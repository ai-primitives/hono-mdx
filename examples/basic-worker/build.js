import { build } from 'esbuild'
import * as mdx from '@mdx-js/esbuild'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: './dist/index.js',
  format: 'esm',
  target: 'esnext',
  platform: 'browser',
  jsx: 'automatic',
  jsxDev: false,
  jsxFactory: 'jsx',
  jsxFragment: 'Fragment',
  jsxImportSource: 'hono/jsx',
  plugins: [
    mdx.default({
      jsx: true,
      jsxImportSource: 'hono/jsx',
      development: false,
      providerImportSource: false
    }),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true
    }),
    NodeModulesPolyfillPlugin()
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.jsx': 'jsx',
    '.js': 'jsx',
    '.mdx': 'jsx'
  },
  external: ['__STATIC_CONTENT_MANIFEST'],
  define: {
    'process.env.NODE_ENV': '"production"',
    global: 'globalThis'
  },
  conditions: ['worker', 'browser'],
  mainFields: ['browser', 'module', 'main']
})
