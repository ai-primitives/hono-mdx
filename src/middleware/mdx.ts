/** @jsxImportSource hono/jsx */
import type { MiddlewareHandler, Context, Next } from 'hono'
import type { FC } from 'hono/jsx'
import type { Child } from 'hono/jsx'
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
  const MDXContent: FC = mdxModule.default
  const meta = extractMetaTags(mdxModule)

  return async (c: Context, next: Next) => {
    c.setRenderer((content: string | Promise<string>) => {
      const mdxContent = MDXContent({}) as Child
      const rendered = Layout({
        meta,
        useTailwind,
        children: html`${mdxContent}${String(content)}`
      })
      return c.html(rendered as HtmlEscapedString)
    })
    await next()
  }
}

// Alias for convenience
export const mdx = createMDXMiddleware
