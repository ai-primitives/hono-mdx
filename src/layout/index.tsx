/** @jsxImportSource hono/jsx */
import { html } from 'hono/html'
import type { FC } from 'hono/jsx'
import type { LayoutProps } from './types'

const Layout: FC<LayoutProps> = ({ meta = {}, children, useTailwind = false }) => {
  const {
    title = 'Hono MDX',
    description = '',
    keywords = [],
    ogTitle = title,
    ogDescription = description,
    ogImage,
    ogUrl,
    jsonLd,
  } = meta

  const jsonLdScript = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        ${keywords.length > 0 ? `<meta name="keywords" content="${keywords.join(', ')}" />` : ''}

        <!-- Open Graph -->
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
        ${ogUrl ? `<meta property="og:url" content="${ogUrl}" />` : ''}

        <!-- Styles -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
        ${useTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}

        <!-- JSON-LD -->
        ${html`${jsonLdScript}`}
      </head>
      <body>
        <main class="container">
          ${children}
        </main>
      </body>
    </html>`
}

export default Layout
