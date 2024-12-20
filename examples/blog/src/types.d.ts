declare module '*.mdx' {
  import type { MDXPage } from '../../../src/types/mdx'
  const mdxContent: MDXPage
  export default mdxContent
}
