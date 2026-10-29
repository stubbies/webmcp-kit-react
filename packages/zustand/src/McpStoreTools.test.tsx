import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { useWebMCP } from 'use-webmcp-tool';
import { McpProvider } from '@webmcp-kit/react';
import { McpStoreTools } from './index.tsx';

const pingTool = {
  name: 'ping',
  description: 'Ping store',
  schema: z.object({}),
  execute: () => ({ ok: true }),
};

describe('McpStoreTools', () => {
  it('registers store action tools', async () => {
    render(
      <McpProvider>
        <McpStoreTools tools={[pingTool]} />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(expect.objectContaining({ name: 'ping' }));
    });
  });
});
