/// <reference types="@cloudflare/workers-types" />

declare module '*.mdx' {
  import type { FC } from 'hono/jsx'
  const MDXComponent: FC
  export default MDXComponent
}

export interface Env {
  // Add your environment bindings here
}

export interface Variables {
  mdxContent?: string
  frontmatter?: Record<string, unknown>
  mdxComponent?: FC
  [key: string]: unknown
}
