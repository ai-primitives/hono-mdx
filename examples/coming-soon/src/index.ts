import { Hono } from 'hono'
import { Layout, mdx } from '../../../src'
import content from './content/index.mdx'

const app = new Hono()

app.get('/', mdx(content, { useTailwind: true }))

export default app
