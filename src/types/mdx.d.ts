export interface MDXProps {
  [key: string]: any
}

export interface Frontmatter {
  title?: string
  description?: string
  keywords?: string | string[]
  ogImage?: string
  jsonLd?: Record<string, unknown>
  [key: string]: any
}
