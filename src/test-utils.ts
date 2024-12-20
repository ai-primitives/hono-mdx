import { vi } from 'vitest'

export const createMockContext = () => ({
  get: vi.fn(),
  set: vi.fn(),
})
