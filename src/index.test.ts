import { describe, it, expect, vi } from 'vitest'
import { Layout } from './layout'
import { mdx, renderMDX } from './middleware/mdx'
import { jsx } from 'hono/jsx'
import type { Context } from 'hono'
import type { Env } from './types/env'
import type { HonoRequest } from 'hono'

interface MockContext extends Partial<Context<Env>> {
  req: HonoRequest
  env: Env['Bindings']
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
  header: ReturnType<typeof vi.fn>
  status: ReturnType<typeof vi.fn>
  text: (text: string) => Response
}

const createMockContext = (overrides: Partial<MockContext> = {}): MockContext => ({
  req: { url: 'http://localhost' } as HonoRequest,
  env: {},
  get: vi.fn(),
  set: vi.fn(),
  header: vi.fn(),
  status: vi.fn(),
  text: (text: string) => new Response(text),
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
    const htmlContent = String(result)

    expect(htmlContent).toContain('<title>Test Page</title>')
    expect(htmlContent).toContain('<meta name="description" content="Test description"')
    expect(htmlContent).toContain('<meta name="keywords" content="test, mdx, hono"')
    expect(htmlContent).toContain('<meta property="og:image" content="https://example.com/image.jpg"')
    expect(htmlContent).toContain('<script type="application/ld+json"')
    expect(htmlContent).toContain('https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css')
    expect(htmlContent).toContain('https://cdn.tailwindcss.com')

    // Extract and parse JSON-LD content for comparison
    const jsonLdMatch = htmlContent.match(/<script type="application\/ld\+json">\s*(.*?)\s*<\/script>/s)
    const jsonLdContent = jsonLdMatch ? JSON.parse(jsonLdMatch[1]) : null
    expect(jsonLdContent).toEqual({ '@type': 'WebPage', name: 'Test' })
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
    mockCtx.get.mockImplementation((key: string) => {
      if (key === 'mdxContent') return mdxContent
      return null
    })

    await middleware(mockCtx as unknown as Context<Env>, () => Promise.resolve())

    const frontmatterCall = mockCtx.set.mock.calls.find(
      (call) => Array.isArray(call) && call[0] === 'frontmatter'
    )
    expect(frontmatterCall?.[1]).toEqual({
      title: 'Test MDX',
      description: 'Testing MDX compilation'
    })

    const mdxComponentCall = mockCtx.set.mock.calls.find(
      (call) => Array.isArray(call) && call[0] === 'mdxComponent'
    )
    expect(mdxComponentCall).toBeTruthy()
    expect(typeof mdxComponentCall?.[1]).toBe('function')
  })

  it('should render MDX content with frontmatter', async () => {
    const mockComponent = () => jsx('div', {}, 'Test Content')
    const frontmatter = { title: 'Test', description: 'Test Description' }
    const mockCtx = createMockContext({
      req: { url: 'http://localhost' } as HonoRequest,
      env: {},
      get: vi.fn().mockImplementation((key: string) => {
        if (key === 'mdxComponent') return mockComponent
        if (key === 'frontmatter') return frontmatter
        return null
      })
    })

    const renderer = renderMDX()
    const result = renderer(mockCtx as unknown as Context<Env>)
    const html = result.toString()

    expect(html).toContain('Test Content')
  })

  it('should handle MDX compilation errors', async () => {
    const invalidMdx = '# Invalid MDX\n\n{{'
    const mockCtx = createMockContext({
      req: { url: 'http://localhost' } as HonoRequest,
      env: {},
      get: vi.fn().mockReturnValue(invalidMdx),
      status: vi.fn()
    })

    const middleware = mdx()
    await expect(middleware(mockCtx as unknown as Context<Env>, () => Promise.resolve())).rejects.toThrow()
    expect(mockCtx.status).toHaveBeenCalledWith(500)
  })
})
