import type { MiddlewareHandler, Context } from 'hono'
import { jsx } from 'hono/jsx'
import * as runtime from 'react/jsx-runtime'
import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import type { MDXContent, MDXProps, Frontmatter } from '../types/mdx'

const defaultOptions: CompileOptions = {
  jsx: true,
  jsxImportSource: 'hono/jsx',
  development: true,
  format: 'mdx',
  outputFormat: 'function-body',
  providerImportSource: '@mdx-js/react'
}

let esbuildTransform: (code: string, options: {
  loader: string
  jsxFactory: string
  jsxFragment: string
  format: string
}) => Promise<{ code: string }>

// Initialize esbuild based on environment
const initializeEsbuild = async () => {
  if (!esbuildTransform) {
    try {
      // Try Node.js esbuild first
      const esbuild = await import('esbuild')
      esbuildTransform = esbuild.transform
    } catch {
      // Fallback to esbuild-wasm in browser
      const esbuildWasm = await import('esbuild-wasm')
      await esbuildWasm.initialize({
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.17.19/esbuild.wasm'
      })
      esbuildTransform = esbuildWasm.transform
    }
  }
}

export const mdx = (options: CompileOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const mdxContent = c.get('mdxContent')
    if (!mdxContent) {
      await next()
      return
    }

    try {
      // Extract frontmatter
      const frontmatter: Frontmatter = {}
      let content = mdxContent

      if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3)
        if (endIndex !== -1) {
          const yaml = content.slice(3, endIndex).trim()
          yaml.split('\n').forEach((line: string) => {
            const [key, ...values] = line.split(':')
            if (key && values.length) {
              frontmatter[key.trim()] = values.join(':').trim()
            }
          })
          content = content.slice(endIndex + 3).trim()
        }
      }

      c.set('frontmatter', frontmatter)

      // Initialize esbuild if needed
      await initializeEsbuild()

      // Compile MDX
      const mergedOptions: CompileOptions = {
        ...defaultOptions,
        ...options
      }

      const result = await compile(content, mergedOptions)
      const code = String(result)

      // Transform JSX with esbuild
      const transformed = await esbuildTransform(code, {
        loader: 'jsx',
        jsxFactory: '_jsx',
        jsxFragment: '_Fragment',
        format: 'iife'
      })

      // Create component function
      const createMDXComponent = new Function(
        '_jsx',
        '_jsxs',
        '_Fragment',
        'props',
        `
        const MDXContent = (props) => {
          ${transformed.code}
          return typeof MDXContent === 'function' ? MDXContent(props) : null
        }
        return MDXContent
        `
      )

      // Create wrapper component
      const WrappedComponent = (props: MDXProps) => {
        try {
          const Component = createMDXComponent(
            runtime.jsx,
            runtime.jsxs,
            runtime.Fragment,
            props
          )
          return Component(props)
        } catch (error) {
          console.error('Error rendering MDX:', error)
          c.status(500)
          return null
        }
      }

      c.set('mdxComponent', WrappedComponent)
      await next()
    } catch (error) {
      console.error('MDX compilation error:', error)
      c.set('error', error)
      c.status(500)
      throw error
    }
  }
}

export const renderMDX = (props: MDXProps = {}) => {
  return (c: Context) => {
    const MDXComponent = c.get('mdxComponent')
    if (!MDXComponent) {
      throw new Error('No MDX component found. Did you apply the mdx middleware?')
    }

    const frontmatter = c.get('frontmatter') || {}
    return jsx(MDXComponent, { ...props, ...frontmatter })
  }
}
