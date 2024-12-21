import type { FC, ReactNode } from 'react'

export interface MDXProps {
  children?: ReactNode
  components?: Record<string, FC>
  [key: string]: any
}

export interface MDXContent extends FC<MDXProps> {
  frontmatter?: Record<string, any>
}

export interface Frontmatter {
  title?: string
  description?: string
  keywords?: string | string[]
  ogImage?: string
  jsonLd?: Record<string, unknown>
  [key: string]: any
}
