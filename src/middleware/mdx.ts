import type { MiddlewareHandler } from 'hono'
import { jsx } from 'hono/jsx'
import * as runtime from 'react/jsx-runtime'
import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import type { MDXProps } from '../types/mdx'

const defaultOptions: CompileOptions = {
  jsx: true,
  jsxImportSource: 'hono/jsx',
  development: process.env.NODE_ENV === 'development'
}

export const mdx = (options: CompileOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const mdxContent = c.get('mdxContent')
    if (!mdxContent) {
      await next()
      return
    }

    try {
      const mergedOptions = { ...defaultOptions, ...options }
      const compiled = await compile(mdxContent, mergedOptions)
      const { default: Content, frontmatter } = await eval(String(compiled))

      c.set('mdxComponent', Content)
      c.set('frontmatter', frontmatter || {})
    } catch (error) {
      console.error('MDX compilation error:', error)
      throw error
    }

    await next()
  }
}

export const renderMDX = (props: MDXProps = {}) => {
  return (c: any) => {
    const MDXComponent = c.get('mdxComponent')
    if (!MDXComponent) {
      throw new Error('No MDX component found. Did you apply the mdx middleware?')
    }

    const frontmatter = c.get('frontmatter') || {}
    return jsx(MDXComponent, { ...props, ...frontmatter })
  }
}
