import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    server: {
      deps: {
        inline: [
          '@mdx-js/mdx',
          '@mdx-js/react',
          'hono',
          'hono/jsx',
          'react/jsx-runtime'
        ]
      }
    },
    setupFiles: ['./src/test-utils.ts']
  }
})
