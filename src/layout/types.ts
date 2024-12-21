import type { Child } from 'hono/jsx'

export interface LayoutProps {
  title: string
  description?: string
  keywords?: string | string[]
  ogImage?: string
  jsonLd?: Record<string, unknown>
  children?: Child
}
