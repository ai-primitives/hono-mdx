import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mdx } from './mdx'
import { Hono } from 'hono'
import type { Env } from '../types/env'

describe('MDX Middleware', () => {
  let app: Hono<Env>
  let mockGet: Mock
  let mockSet: Mock

  beforeEach(() => {
    app = new Hono<Env>()
    mockGet = vi.fn()
    mockSet = vi.fn()

    app.use('*', async (c, next) => {
      c.get = mockGet
      c.set = mockSet
      await next()
    })

    // Add MDX middleware and response handler
    app.use('*', mdx())
    app.get('*', (c) => c.text('OK'))
  })

  it('should compile simple MDX content', async () => {
    const mdxContent = '# Hello\n\nThis is a test.'
    mockGet.mockImplementation((key: string) => {
      if (key === 'mdxContent') return mdxContent
      return null
    })

    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)

    const mdxComponentCall = mockSet.mock.calls.find(
      (call: [string, unknown]) => call[0] === 'mdxComponent'
    )
    expect(mdxComponentCall).toBeTruthy()
    expect(typeof mdxComponentCall?.[1]).toBe('function')
  })

  it('should extract frontmatter', async () => {
    const mdxContent = `---
title: Test
description: Testing
---

# Hello

This is a test.`

    mockGet.mockImplementation((key: string) => {
      if (key === 'mdxContent') return mdxContent
      return null
    })

    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)

    const frontmatterCall = mockSet.mock.calls.find(
      (call: [string, unknown]) => call[0] === 'frontmatter'
    )
    expect(frontmatterCall?.[1]).toEqual({
      title: 'Test',
      description: 'Testing'
    })

    const mdxComponentCall = mockSet.mock.calls.find(
      (call: [string, unknown]) => call[0] === 'mdxComponent'
    )
    expect(mdxComponentCall).toBeTruthy()
    expect(typeof mdxComponentCall?.[1]).toBe('function')
  })

  it('should handle MDX compilation errors', async () => {
    const invalidMdxContent = '# Test\n\n<Component invalid={true'
    mockGet.mockImplementation((key: string) => {
      if (key === 'mdxContent') return invalidMdxContent
      return null
    })

    const res = await app.request('http://localhost/')
    expect(res.status).toBe(500)

    const error = mockSet.mock.calls.find(
      (call: [string, unknown]) => call[0] === 'error'
    )
    expect(error).toBeTruthy()
  })

  it('should skip processing when no MDX content', async () => {
    mockGet.mockImplementation(() => null)

    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
    expect(mockSet).not.toHaveBeenCalled()
  })
})
