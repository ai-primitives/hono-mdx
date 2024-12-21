/** @jsxImportSource hono/jsx */
import { jsx } from 'hono/jsx'
import { html, raw } from 'hono/html'
import type { FC, Child } from 'hono/jsx'
import type { LayoutProps } from './types'

export const Layout: FC<LayoutProps> = ({ children, title, description, keywords, ogImage, jsonLd }) => {
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  const renderMetaTags = () => html`
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${description ? html`<meta name="description" content="${description}" />` : ''}
    ${keywordsString ? html`<meta name="keywords" content="${keywordsString}" />` : ''}
    ${ogImage ? html`
      <meta property="og:image" content="${ogImage}" />
      <meta name="twitter:image" content="${ogImage}" />
    ` : ''}
    ${jsonLd ? html`
      <script type="application/ld+json">
        ${raw(JSON.stringify(jsonLd))}
      </script>
    ` : ''}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
    <script src="https://cdn.tailwindcss.com"></script>
  `

  return html`
    <!DOCTYPE html>
    <html>
      <head>
        ${renderMetaTags()}
      </head>
      <body>
        <main class="container">
          ${children || ''}
        </main>
      </body>
    </html>
  `
}
