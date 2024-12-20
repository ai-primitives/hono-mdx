import * as esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  platform: 'browser',
  plugins: [
    mdx({
      jsxImportSource: 'hono/jsx',
      providerImportSource: '@mdx-js/react',
    }),
  ],
  external: ['__STATIC_CONTENT_MANIFEST'],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.mdx': 'jsx',
  },
})
