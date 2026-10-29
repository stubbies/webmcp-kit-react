import { vi } from 'vitest';

vi.mock('use-webmcp-tool', () => ({
  useWebMCP: vi.fn(() => ({
    supported: true,
    registered: true,
    error: null,
  })),
}));
