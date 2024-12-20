/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx'
import type { LayoutProps } from './types'

export const Layout: FC<{ children?: any } & LayoutProps> = ({ children, title, description, keywords, ogImage, jsonLd }) => {
  return (
    <html>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{title}</title>
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
        {ogImage && (
          <>
            <meta property='og:image' content={ogImage} />
            <meta name='twitter:image' content={ogImage} />
          </>
        )}
        {jsonLd && <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css' />
        <script src='https://cdn.tailwindcss.com' />
      </head>
      <body>
        <main className='container'>{children}</main>
      </body>
    </html>
  )
}
