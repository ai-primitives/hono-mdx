/** @jsxImportSource hono/jsx */
import { jsx } from 'hono/jsx'
import type { FC } from 'hono/jsx'
import { html } from 'hono/html'

interface LayoutProps {
  children?: unknown
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
        <link rel="stylesheet" href="https://cdn.tailwindcss.com" />
        <title>Hono MDX Example</title>
      </head>
      <body>
        <main class="container">
          ${String(children)}
        </main>
      </body>
    </html>
  `
}
