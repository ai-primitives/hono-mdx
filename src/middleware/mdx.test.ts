import { describe, it, expect, vi } from 'vitest'
import { mdx, renderMDX } from './mdx'
import type { Context } from 'hono'
import type { Env } from '../types/env'

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

describe('MDX Middleware', () => {
  it('should compile simple MDX content', async () => {
    const mdxContent = '# Hello\n\nThis is a test.'
    const mockCtx = createMockContext()
    mockCtx.get.mockReturnValue(mdxContent)

    const middleware = mdx()
    await middleware(mockCtx as Context<Env>, () => Promise.resolve())

    expect(mockCtx.set).toHaveBeenCalledWith('mdxComponent', expect.any(Function))
    expect(mockCtx.set).toHaveBeenCalledWith('frontmatter', {})
  })

  it('should extract frontmatter', async () => {
    const mdxContent = `---
title: Test
description: Testing
---

# Hello

This is a test.`

    const mockCtx = createMockContext()
    mockCtx.get.mockReturnValue(mdxContent)

    const middleware = mdx()
    await middleware(mockCtx as Context<Env>, () => Promise.resolve())

    expect(mockCtx.set).toHaveBeenCalledWith('frontmatter', {
      title: 'Test',
      description: 'Testing'
    })
  })
})
