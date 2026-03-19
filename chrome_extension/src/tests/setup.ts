import { vi } from 'vitest'

// Mock the chrome extension APIs
global.chrome = {
  tabCapture: {
    capture: vi.fn(),
  },
  // Add other mocks as needed
} as any
