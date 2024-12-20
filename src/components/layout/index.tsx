import type { FC } from 'hono/jsx'
import { html } from 'hono/html'

export interface MetaData {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  jsonld?: Record<string, unknown>
}

interface LayoutProps {
  meta: MetaData
  children?: any
}

export const Layout: FC<LayoutProps> = ({ meta, children }) => {
  const jsonld = meta.jsonld ? JSON.stringify(meta.jsonld) : ''

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta.title}</title>
        ${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
        ${meta.keywords?.length ? `<meta name="keywords" content="${meta.keywords.join(', ')}">` : ''}

        <!-- OpenGraph -->
        <meta property="og:title" content="${meta.title}">
        ${meta.description ? `<meta property="og:description" content="${meta.description}">` : ''}
        ${meta.image ? `<meta property="og:image" content="${meta.image}">` : ''}
        ${meta.url ? `<meta property="og:url" content="${meta.url}">` : ''}
        ${meta.type ? `<meta property="og:type" content="${meta.type}">` : '<meta property="og:type" content="website">'}

        <!-- JSON-LD -->
        ${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ''}

        <!-- PicoCSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">

        <!-- TailwindCSS -->
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${children}
      </body>
    </html>`
}
