import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useWebMCP } from 'use-webmcp-tool';
import { McpProvider } from '@react-webmcp-kit/core';
import { McpReduxTools } from './index.tsx';

const dispatch = vi.fn();
const getState = vi.fn(() => ({ count: 0 }));

vi.mock('react-redux', () => ({
  useDispatch: () => dispatch,
  useStore: () => ({ getState }),
}));

const incrementTool = {
  name: 'increment',
  description: 'Increment counter',
  schema: z.object({ by: z.number().default(1) }),
  execute: ({ by }: { by: number }, ctx: { dispatch: typeof dispatch }) => {
    ctx.dispatch({ type: 'counter/increment', payload: by });
    return { success: true, by };
  },
};

describe('McpReduxTools', () => {
  it('registers tools and wires dispatch in execute', async () => {
    render(
      <McpProvider>
        <McpReduxTools tools={[incrementTool]} />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(expect.objectContaining({ name: 'increment' }));
    });

    const call = vi.mocked(useWebMCP).mock.calls.find((c) => c[0].name === 'increment');
    expect(call).toBeDefined();
    await call![0].execute({ by: 2 }, { signal: new AbortController().signal });
    expect(dispatch).toHaveBeenCalledWith({ type: 'counter/increment', payload: 2 });
  });
});
