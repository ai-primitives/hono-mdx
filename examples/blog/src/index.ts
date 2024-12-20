import { Hono } from 'hono'
import { Layout, mdx } from '../../../src'
import homePage from './content/index.mdx'
import gettingStarted from './content/blog/getting-started.mdx'
import mdxJsx from './content/blog/mdx-jsx.mdx'
import cloudflareWorkers from './content/blog/cloudflare-workers.mdx'

const app = new Hono()

// Home page
app.get('/', mdx(homePage, { useTailwind: true }))

// Blog posts
app.get('/blog/getting-started', mdx(gettingStarted, { useTailwind: true }))
app.get('/blog/mdx-jsx', mdx(mdxJsx, { useTailwind: true }))
app.get('/blog/cloudflare-workers', mdx(cloudflareWorkers, { useTailwind: true }))

export default app
