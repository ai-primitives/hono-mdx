/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { jsx } from 'hono/jsx'
import type { Context } from 'hono'
import { Layout } from './layout'
import Content from './content/index.mdx'

const app = new Hono()

const renderer = (content: any) => {
  return jsx(Layout, { children: content })
}

app.use('*', jsxRenderer(renderer))
app.get('/', (c: Context) => c.render(jsx(Content, {})))

export default app
