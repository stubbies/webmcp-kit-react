import type { z } from 'zod';
import { useMcpTool } from '@webmcp-kit/react';

export type McpStoreToolDef<TArgs = unknown, TResult = unknown> = {
  name: string;
  description: string;
  schema: z.ZodType<TArgs>;
  execute: (args: TArgs) => TResult | Promise<TResult>;
  enabled?: boolean;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
    consequentialHint?: boolean;
  };
};

function McpStoreToolRegistrar<TArgs, TResult>({
  def,
}: {
  def: McpStoreToolDef<TArgs, TResult>;
}) {
  useMcpTool({
    name: def.name,
    description: def.description,
    schema: def.schema,
    enabled: def.enabled ?? true,
    annotations: def.annotations,
    execute: (args: TArgs, { signal }) => {
      if (signal.aborted) throw new Error('Aborted');
      return def.execute(args);
    },
  });
  return null;
}

export type McpStoreToolsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: McpStoreToolDef<any, any>[];
};

/** Register WebMCP tools that invoke Zustand store actions (render inside McpProvider). */
export function McpStoreTools({ tools }: McpStoreToolsProps) {
  return (
    <>
      {tools.map((def) => (
        <McpStoreToolRegistrar key={def.name} def={def} />
      ))}
    </>
  );
}

export type UseMcpStoreToolsOptions = {
  tools: McpStoreToolDef[];
};

/** @deprecated Use McpStoreTools component instead. */
export function useMcpStoreTools(_options: UseMcpStoreToolsOptions): void {
  throw new Error('useMcpStoreTools is removed; render <McpStoreTools /> instead.');
}
