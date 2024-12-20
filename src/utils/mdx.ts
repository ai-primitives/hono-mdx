import type { FC } from 'hono/jsx'
import type { MetaTags } from '../layout/types'

export interface MDXPage {
  default: FC
  frontmatter?: MetaTags
}

export const extractMetaTags = (mdxModule: MDXPage): MetaTags => {
  return mdxModule.frontmatter || {}
}
