import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useWebMCP } from 'use-webmcp-tool';
import { z } from 'zod';
import { McpProvider, useMcpRegistry } from './McpProvider';
import { useMcpTool } from './useMcpTool';
import { zodToJsonSchema } from './zodToJsonSchema';

function RegistryProbe() {
  const tools = useMcpRegistry();
  return <div data-testid="count">{tools.length}</div>;
}

const emailToolSchema = z.object({ email: z.string().email() });

function ToolUser() {
  useMcpTool({
    name: 'fill_user_email',
    description: 'Populates email in checkout section',
    schema: emailToolSchema,
    execute: async (args) => {
      return { success: true, email: args.email };
    },
  });
  return null;
}

describe('zodToJsonSchema', () => {
  it('converts zod object to JSON Schema', () => {
    const schema = z.object({ email: z.string().email() });
    const json = zodToJsonSchema(schema);
    expect(json.type).toBe('object');
    expect(json.properties).toBeDefined();
  });
});

describe('useMcpTool', () => {
  it('registers tool metadata in McpProvider', async () => {
    render(
      <McpProvider>
        <ToolUser />
        <RegistryProbe />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalled();
    });

    await waitFor(() => {
      const el = document.querySelector('[data-testid="count"]');
      expect(el?.textContent).toBe('1');
    });
  });

  it('passes validation errors through execute wrapper', async () => {
    let capturedExecute: ((args: unknown, ctx: { signal: AbortSignal }) => unknown) | undefined;
    vi.mocked(useWebMCP).mockImplementation((opts) => {
      capturedExecute = opts.execute;
      return { supported: true, registered: true, error: null };
    });

    render(
      <McpProvider>
        <ToolUser />
      </McpProvider>,
    );

    await waitFor(() => expect(capturedExecute).toBeDefined());
    await expect(capturedExecute!({ email: 'not-an-email' }, { signal: new AbortController().signal })).rejects.toThrow(
      'Validation failed',
    );
  });
});
