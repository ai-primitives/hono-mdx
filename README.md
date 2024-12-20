# hono-mdx

[![npm version](https://badge.fury.io/js/hono-mdx.svg)](https://badge.fury.io/js/hono-mdx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Seamless MDX integration for Hono applications, providing first-class JSX support via @mdx-js/react. Build content-rich applications with the power of MDX and the performance of Cloudflare Workers.

## Features

- 🚀 Native Hono JSX rendering for MDX content
- 📝 Built-in Layout component with PicoCSS and optional Tailwind CSS
- 🎨 Automatic meta tag generation from MDX frontmatter
- 🌐 Optimized for Cloudflare Workers
- ⚡ Streaming SSR support
- 🔄 Hot module replacement during development

## Quick Start

```bash
npm install hono-mdx
# or
pnpm add hono-mdx
```

### TypeScript Configuration

Add the following to your `tsconfig.json`:

```json
{
  'compilerOptions': {
    'jsx': 'react-jsx',
    'jsxImportSource': 'hono/jsx',
    'target': 'esnext',
    'module': 'esnext',
    'types': ['@cloudflare/workers-types']
  }
}
```

### Basic Usage

```typescript
import { Hono } from 'hono'
import { mdx } from 'hono-mdx'
import content from './content/index.mdx'

const app = new Hono()
app.use('/', mdx(content))

export default app
```

### MDX Content with Frontmatter

```mdx
---
title: My Page
description: A great page built with Hono MDX
keywords: ['hono', 'mdx', 'cloudflare']
ogTitle: My Amazing Page
ogDescription: Check out this awesome page
ogImage: https://example.com/image.jpg
jsonLd: {
  '$type': 'WebPage',
  'name': 'My Page',
  'description': 'A great page built with Hono MDX'
}
---

# Welcome to My Page

This is a page built with Hono MDX.
```

## Layout Component

The built-in Layout component provides:

- PicoCSS for minimal, semantic HTML styling
- Optional Tailwind CSS via CDN for customization
- Automatic meta tag generation from frontmatter
- SEO-friendly defaults
- JSON-LD support

```typescript
import { mdx } from 'hono-mdx'
import content from './content.mdx'

// Default layout with PicoCSS
app.use('/', mdx(content))

// Enable Tailwind CSS
app.use('/', mdx(content, { useTailwind: true }))

// Custom layout
app.use('/', mdx(content, {
  layout: ({ children, frontmatter }) => (
    <CustomLayout meta={frontmatter}>
      {children}
    </CustomLayout>
  )
}))
```

## Meta Tags

The Layout component automatically generates:

- Basic meta tags (title, description, keywords)
- Open Graph tags (title, description, image, url)
- JSON-LD structured data
- Twitter card tags

All meta information is extracted from the MDX frontmatter.

## API Reference

### MDX Middleware Options

```typescript
interface MDXOptions {
  useTailwind?: boolean // Enable Tailwind CSS
  layout?: (props: LayoutProps) => JSX.Element // Custom layout component
  wrapper?: (props: WrapperProps) => JSX.Element // Custom MDX wrapper
}

interface LayoutProps {
  children: JSX.Element
  frontmatter: MDXFrontmatter
}

interface MDXFrontmatter {
  title?: string
  description?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  jsonLd?: Record<string, unknown>
}
```

## Dependencies

- [hono](https://www.npmjs.com/package/hono) - Fast, lightweight web framework
- [@mdx-js/react](https://www.npmjs.com/package/@mdx-js/react) - React implementation for MDX
