import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-utils.ts'],
    deps: {
      inline: [/@mdx-js\/mdx/, /@mdx-js\/react/]
    }
  }
})
