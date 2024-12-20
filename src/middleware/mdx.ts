/** @jsxImportSource hono/jsx */
import type { MiddlewareHandler, Context } from 'hono'
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

export const createMDXMiddleware = (mdxModule: MDXPage, options: MDXMiddlewareOptions = {}): MiddlewareHandler => {
  const { useTailwind = false } = options
  const MDXContent = mdxModule.default

  return jsxRenderer(({ children }) => {
    const meta = extractMetaTags(mdxModule)
    const mdxContent = MDXContent({})

    return Layout({
      meta,
      useTailwind,
      children: html`${mdxContent}${String(children)}`
    }) as HtmlEscapedString
  })
}

// Alias for convenience
export const mdx = createMDXMiddleware
