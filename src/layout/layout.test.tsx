import { describe, it, expect } from 'vitest'
import { Layout } from './index'

describe('Layout Component', () => {
  it('should render meta tags from frontmatter', () => {
    const props = {
      title: 'Test Page',
      description: 'Test description',
      keywords: 'test, mdx, hono',
      ogImage: 'https://example.com/image.jpg',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Test Page',
        description: 'Test description'
      }
    }

    const layout = Layout(props)
    const content = String(layout)

    // Verify meta tags
    expect(content).toContain('<title>Test Page</title>')
    expect(content).toContain('content="Test description"')
    expect(content).toContain('content="test, mdx, hono"')
    expect(content).toContain('content="https://example.com/image.jpg"')
    expect(content).toContain('application/ld+json')
    expect(content).toContain('"@context":"https://schema.org"')

    // Verify CSS includes
    expect(content).toContain('cdn.jsdelivr.net/npm/@picocss/pico')
    expect(content).toContain('cdn.tailwindcss.com')
  })

  it('should handle array of keywords', () => {
    const props = {
      title: 'Test Page',
      keywords: ['test', 'mdx', 'hono']
    }

    const layout = Layout(props)
    const content = String(layout)
    expect(content).toContain('content="test, mdx, hono"')
  })

  it('should handle missing optional props', () => {
    const props = {
      title: 'Test Page'
    }

    const layout = Layout(props)
    const content = String(layout)

    expect(content).toContain('<title>Test Page</title>')
    expect(content).not.toContain('name="description"')
    expect(content).not.toContain('name="keywords"')
    expect(content).not.toContain('property="og:image"')
    expect(content).not.toContain('application/ld+json"')
  })

  it('should include container class for main element', () => {
    const props = {
      title: 'Test Page'
    }

    const layout = Layout(props)
    const content = String(layout)
    expect(content).toContain('<main className="container">')
  })
})
