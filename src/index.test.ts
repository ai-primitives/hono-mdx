import { describe, it, expect, vi } from 'vitest'
import { Layout } from './layout'
import { mdx, renderMDX } from './middleware/mdx'
import { jsx } from 'hono/jsx'
import type { Context } from 'hono'
import type { Env } from './types/env'

interface MockContext extends Partial<Context<Env>> {
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
  env: Env
}

const createMockContext = (overrides: Partial<MockContext> = {}): MockContext => ({
  get: vi.fn(),
  set: vi.fn(),
  env: {},
  ...overrides
})

describe('Layout', () => {
  it('should render meta tags correctly', () => {
    const props = {
      title: 'Test Page',
      description: 'Test description',
      keywords: ['test', 'mdx', 'hono'],
      ogImage: 'https://example.com/image.jpg',
      jsonLd: { '@type': 'WebPage', name: 'Test' }
    }

    const result = jsx(Layout, props)
    const html = result.toString()

    expect(html).toContain('<title>Test Page</title>')
    expect(html).toContain('<meta name="description" content="Test description"')
    expect(html).toContain('<meta name="keywords" content="test, mdx, hono"')
    expect(html).toContain('<meta property="og:image" content="https://example.com/image.jpg"')
    expect(html).toContain('<script type="application/ld+json"')
    expect(html).toContain('{"@type":"WebPage","name":"Test"}')
    expect(html).toContain('https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css')
    expect(html).toContain('https://cdn.tailwindcss.com')
  })
})

describe('MDX Middleware', () => {
  it('should compile MDX content and extract frontmatter', async () => {
    const mdxContent = `---
title: Test MDX
description: Testing MDX compilation
---

# Hello World

This is a test MDX file.

<div>Hello from MDX!</div>
`

    const mockCtx = createMockContext({
      req: { url: 'http://localhost' } as any,
      header: vi.fn(),
      status: vi.fn()
    })

    const middleware = mdx()
    mockCtx.get.mockReturnValue(mdxContent)
    await middleware(mockCtx as Context<Env>, () => Promise.resolve())

    expect(mockCtx.set).toHaveBeenCalledWith('mdxComponent', expect.any(Function))
    expect(mockCtx.set).toHaveBeenCalledWith('frontmatter', {
      title: 'Test MDX',
      description: 'Testing MDX compilation'
    })

    const MDXComponent = mockCtx.get('mdxComponent')
    expect(MDXComponent).toBeDefined()
    expect(typeof MDXComponent).toBe('function')

    const rendered = String(MDXComponent({}))
    expect(rendered).toContain('Hello World')
    expect(rendered).toContain('Hello from MDX!')
  })

  it('should render MDX content with frontmatter', async () => {
    const MDXComponent = () => jsx('div', {}, 'Test Content')
    const frontmatter = { title: 'Test', description: 'Test Description' }
    const mockCtx = createMockContext()

    mockCtx.get.mockImplementation((key: string) => {
      if (key === 'mdxComponent') return MDXComponent
      if (key === 'frontmatter') return frontmatter
      return null
    })

    const renderer = renderMDX()
    const result = renderer(mockCtx as Context<Env>)
    const html = result.toString()

    expect(html).toContain('Test Content')
  })

  it('should handle MDX compilation errors', async () => {
    const invalidMdx = '# Invalid MDX\n\n{{'
    const mockCtx = createMockContext()
    mockCtx.get.mockReturnValue(invalidMdx)

    const middleware = mdx()
    await expect(middleware(mockCtx as Context<Env>, () => Promise.resolve())).rejects.toThrow()
  })
})
