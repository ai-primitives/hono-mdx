declare module '*.mdx' {
  import type { FC } from 'hono/jsx'

  interface MDXFrontmatter {
    meta?: {
      title?: string
      description?: string
      keywords?: string[]
      ogTitle?: string
      ogDescription?: string
      ogImage?: string
      ogUrl?: string
      jsonLd?: Record<string, unknown>
    }
  }

  const Component: FC & {
    frontmatter?: MDXFrontmatter
  }
  export default Component
}
