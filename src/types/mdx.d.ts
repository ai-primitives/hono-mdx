import type { Context } from 'hono'
import type { FC } from 'hono/jsx'
import type { ReactNode } from 'react'

export interface MDXProps {
  children?: ReactNode
  components?: Record<string, FC>
  [key: string]: unknown
}

export interface MDXContent extends FC<MDXProps> {
  frontmatter?: Record<string, unknown>
}

export interface Frontmatter {
  title?: string
  description?: string
  keywords?: string | string[]
  ogImage?: string
  jsonLd?: Record<string, unknown>
  [key: string]: unknown
}
