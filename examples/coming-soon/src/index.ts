import { Hono } from 'hono'
import { mdx } from 'hono-mdx'
import content from './content/index.mdx'

const app = new Hono()

app.get('/', mdx(content, { useTailwind: true }))

export default app
