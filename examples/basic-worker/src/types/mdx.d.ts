declare module '*.mdx' {
  export interface FrontMatter {
    title?: string
    description?: string
    keywords?: string[]
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    jsonLd?: Record<string, any>
  }

  const Content: () => JSX.Element
  export const frontMatter: FrontMatter
  export default Content
}
