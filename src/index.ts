/** @jsxImportSource hono/jsx */
import { jsxRenderer } from 'hono/jsx-renderer'
import type { MiddlewareHandler } from 'hono'
import type { FC } from 'hono/jsx'
import type { Child } from 'hono/jsx'
import { html } from 'hono/html'
import type { PropsWithChildren } from 'hono/jsx'
import type { HtmlEscapedString } from 'hono/utils/html'
import Layout from './layout'
import type { MDXPage } from './utils/mdx'
import { mdx } from './middleware/mdx'

export { Layout }
export type { LayoutProps, MetaTags } from './layout/types'
export type { MDXPage } from './utils/mdx'

// Basic MDX renderer without layout/meta support
export interface MDXRendererOptions {
  layout?: FC<PropsWithChildren>
}

export const mdxRenderer = (options: MDXRendererOptions = {}): MiddlewareHandler => {
  const { layout: CustomLayout } = options

  return jsxRenderer(({ children }) => {
    if (CustomLayout) {
      return CustomLayout({ children }) as HtmlEscapedString
    }
    return children as HtmlEscapedString
  })
}

// Full-featured MDX middleware with layout/meta support
export { mdx }
