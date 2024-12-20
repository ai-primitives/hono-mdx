import type { Context, MiddlewareHandler } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Layout } from '../../components/layout'
import { compile } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import type { FC } from 'hono/jsx'
import type { MetaData } from '../../components/layout'

export interface MDXProps extends Partial<MetaData> {}

export interface MDXContent {
  default: FC
  frontmatter?: MDXProps
}

interface MDXRenderContext {
  mdxProps?: MDXProps
  children?: any
}

export const mdx = (): MiddlewareHandler => {
  return async (c: Context, next) => {
    // Create the renderer before calling next()
    const renderer = jsxRenderer(({ children }: MDXRenderContext) => {
      const props = c.get('mdx-props') as MDXProps || {}
      const meta: MetaData = {
        title: props.title || 'Untitled Page',
        description: props.description,
        keywords: props.keywords,
        image: props.image,
        url: props.url,
        type: props.type,
        jsonld: props.jsonld
      }

      try {
        return <Layout meta={meta}>{children}</Layout>
      } catch (error) {
        console.error('Error rendering MDX:', error)
        return <Layout meta={{ title: 'Error' }}>
          <h1>Error rendering content</h1>
          <p>An error occurred while rendering the content. Please try again later.</p>
        </Layout>
      }
    }, {
      stream: true // Enable streaming support
    })

    // Call next() to allow other middleware to run
    await next()

    // Return the rendered response
    return renderer(c, next)
  }
}

// MDX compilation helper with improved error handling
export async function compileMDX(source: string): Promise<MDXContent> {
  if (!source) {
    throw new Error('MDX source cannot be empty')
  }

  try {
    const result = await compile(source, {
      jsx: true,
      jsxImportSource: 'hono/jsx',
      development: process.env.NODE_ENV === 'development',
      outputFormat: 'function-body',
      providerImportSource: '@mdx-js/react'
    })

    // Execute the compiled MDX
    const { default: Content, frontmatter } = await (new Function('runtime', `
      const exports = {};
      ${String(result)};
      return exports;
    `))(runtime)

    if (!Content) {
      throw new Error('Failed to compile MDX: No content exported')
    }

    return { default: Content, frontmatter }
  } catch (error) {
    console.error('Error compiling MDX:', error)
    throw error
  }
}
