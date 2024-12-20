import * as esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'neutral',
  target: 'esnext',
  plugins: [
    mdx({
      jsxImportSource: 'hono/jsx',
      providerImportSource: '@mdx-js/react',
      development: process.env.NODE_ENV === 'development',
    }),
  ],
  external: ['__STATIC_CONTENT_MANIFEST'],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.mdx': 'jsx',
  },
})
