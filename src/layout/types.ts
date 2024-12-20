import type { Child } from 'hono/jsx'

export interface MetaTags {
  title?: string
  description?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  jsonLd?: Record<string, unknown>
}

export interface LayoutProps {
  meta?: MetaTags
  children?: Child
  useTailwind?: boolean
}
