import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useWebMCP } from 'use-webmcp-tool';
import { McpProvider } from '@react-webmcp-kit/core';
import { McpRtkQueryTools } from './index.tsx';

const dispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => dispatch,
  useStore: () => ({ getState: () => ({}) }),
}));

const fetchOrderTool = {
  name: 'fetch_order',
  description: 'Load order',
  schema: z.object({ orderId: z.string() }),
  kind: 'query' as const,
  initiate: (args: { orderId: string }) => ({ type: 'api/getOrder', meta: args }),
};

describe('McpRtkQueryTools', () => {
  it('sets readOnlyHint for query tools and formats success', async () => {
    dispatch.mockResolvedValueOnce({ data: { id: 'ord-1' } });

    render(
      <McpProvider>
        <McpRtkQueryTools tools={[fetchOrderTool]} />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'fetch_order',
          annotations: expect.objectContaining({ readOnlyHint: true }),
        }),
      );
    });

    const call = vi.mocked(useWebMCP).mock.calls.find((c) => c[0].name === 'fetch_order');
    const result = await call![0].execute({ orderId: 'ord-1' }, { signal: new AbortController().signal });
    expect(dispatch).toHaveBeenCalled();
    expect(result).toEqual({ success: true, data: { id: 'ord-1' } });
  });

  it('formats RTK errors without throwing', async () => {
    dispatch.mockResolvedValueOnce({ error: { status: 404, data: null } });

    render(
      <McpProvider>
        <McpRtkQueryTools tools={[fetchOrderTool]} />
      </McpProvider>,
    );

    await waitFor(() => expect(useWebMCP).toHaveBeenCalled());

    const call = vi.mocked(useWebMCP).mock.calls.find((c) => c[0].name === 'fetch_order');
    const result = await call![0].execute({ orderId: 'missing' }, { signal: new AbortController().signal });
    expect(result).toEqual({
      success: false,
      error: expect.objectContaining({ status: 404 }),
    });
  });

  it('sets consequentialHint for mutations', async () => {
    dispatch.mockResolvedValueOnce({ data: { ok: true } });

    const mutationTool = {
      name: 'update_order',
      description: 'Patch order',
      schema: z.object({ id: z.string() }),
      kind: 'mutation' as const,
      initiate: (args: { id: string }) => ({ type: 'api/updateOrder', meta: args }),
    };

    render(
      <McpProvider>
        <McpRtkQueryTools tools={[mutationTool]} />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'update_order',
          annotations: expect.objectContaining({ consequentialHint: true }),
        }),
      );
    });
  });
});
