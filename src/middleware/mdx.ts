import type { MiddlewareHandler } from 'hono'
import { jsx } from 'hono/jsx'
import * as runtime from 'react/jsx-runtime'
import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import type { MDXContent, MDXProps, Frontmatter } from '../types/mdx'

const defaultOptions: CompileOptions = {
  jsx: true,
  jsxImportSource: '@mdx-js/react',
  development: true,
  format: 'mdx',
  outputFormat: 'function-body',
  providerImportSource: '@mdx-js/react'
}

export const mdx = (options: CompileOptions = {}): MiddlewareHandler => {
  return async (c, next) => {
    const mdxContent = c.get('mdxContent')
    if (!mdxContent) {
      await next()
      return
    }

    try {
      // Extract and set frontmatter first, before any potential errors
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

      // Set frontmatter before attempting compilation
      c.set('frontmatter', frontmatter)

      // Compile MDX - this is expected to fail in development
      const mergedOptions: CompileOptions = {
        ...defaultOptions,
        ...options
      }

      const result = await compile(content, mergedOptions)

      // Create component with runtime context
      const Component = new Function(
        'jsx',
        'jsxs',
        'Fragment',
        `
        ${result}
        return typeof MDXContent === 'function' ? MDXContent : function() { return null }
        `
      )(runtime.jsx, runtime.jsxs, runtime.Fragment)

      c.set('mdxComponent', Component)
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
  return (c: any) => {
    const MDXComponent = c.get('mdxComponent')
    if (!MDXComponent) {
      throw new Error('No MDX component found. Did you apply the mdx middleware?')
    }

    const frontmatter = c.get('frontmatter') || {}
    return jsx(MDXComponent, { ...props, ...frontmatter })
  }
}
