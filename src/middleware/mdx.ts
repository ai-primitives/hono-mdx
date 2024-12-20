/** @jsxImportSource hono/jsx */
import type { Handler, Context } from 'hono'
import type { FC } from 'hono/jsx'
import { jsxRenderer } from 'hono/jsx-renderer'
import { html } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'
import type { MDXPage } from '../utils/mdx'
import { extractMetaTags } from '../utils/mdx'
import Layout from '../layout'

export interface MDXMiddlewareOptions {
  useTailwind?: boolean
}

export const createMDXMiddleware = (mdxModule: MDXPage, options: MDXMiddlewareOptions = {}): Handler => {
  const { useTailwind = false } = options

  return async (c: Context) => {
    try {
      const MDXContent = mdxModule.default
      const meta = extractMetaTags(mdxModule)

      const renderer = jsxRenderer(({ children }) => {
        const mdxContent = MDXContent({})
        return Layout({
          meta,
          useTailwind,
          children: html`${mdxContent}${String(children)}`
        }) as HtmlEscapedString
      })

      return renderer(c, () => Promise.resolve())
    } catch (error) {
      console.error('MDX Rendering Error:', error)
      throw error
    }
  }
}

// Alias for convenience
export const mdx = createMDXMiddleware
