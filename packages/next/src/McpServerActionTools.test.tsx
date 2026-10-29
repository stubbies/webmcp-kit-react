import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useWebMCP } from 'use-webmcp-tool';
import { McpProvider } from '@webmcp-kit/react';
import { McpServerActionTools } from './McpServerActionTools';

describe('McpServerActionTools', () => {
  it('registers server action tools', async () => {
    const action = vi.fn(async (args: { id: string }) => ({ ok: true, id: args.id }));

    render(
      <McpProvider>
        <McpServerActionTools
          tools={[
            {
              name: 'load_thing',
              description: 'Load',
              schema: z.object({ id: z.string() }),
              action,
            },
          ]}
        />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'load_thing' }),
      );
    });
  });
});
