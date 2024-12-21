import type { MiddlewareHandler } from 'hono'
import { jsx } from 'hono/jsx'
import * as runtime from 'react/jsx-runtime'
import { compile } from '@mdx-js/mdx'
import type { CompileOptions } from '@mdx-js/mdx'
import type { MDXContent, MDXProps, Frontmatter } from '../types/mdx'

const defaultOptions: CompileOptions = {
  jsx: true,
  jsxImportSource: 'hono/jsx',
  development: false,
  format: 'mdx',
  outputFormat: 'function-body'
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

      const match = content.match(/^---\n([\s\S]*?)\n---/)
      if (match) {
        const yaml = match[1]
        yaml.split('\n').forEach((line: string) => {
          const [key, ...values] = line.split(':')
          if (key && values.length) {
            frontmatter[key.trim()] = values.join(':').trim()
          }
        })
        content = content.slice(match[0].length).trim()
      }

      // Compile MDX
      const mergedOptions = { ...defaultOptions, ...options }
      const compiled = String(await compile(content, mergedOptions))

      // Create module context
      const moduleCode = `
        const React = { createElement: jsx, Fragment }
        ${compiled}
        return MDXContent
      `

      const Content = new Function('jsx', 'Fragment', moduleCode)(jsx, runtime.Fragment)

      c.set('mdxComponent', Content)
      c.set('frontmatter', frontmatter)

      await next()
    } catch (error) {
      console.error('MDX compilation error:', error)
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
