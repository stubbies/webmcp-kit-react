import { useMcpTool } from '@webmcp-kit/react';
import type { McpServerActionToolDef } from './types';

function McpServerActionToolRegistrar<TArgs, TResult>({
  def,
}: {
  def: McpServerActionToolDef<TArgs, TResult>;
}) {
  useMcpTool({
    name: def.name,
    description: def.description,
    schema: def.schema,
    enabled: def.enabled ?? true,
    annotations: def.annotations,
    execute: async (args: TArgs, { signal }) => {
      if (signal.aborted) throw new Error('Aborted');
      return def.action(args);
    },
  });
  return null;
}

export type McpServerActionToolsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: McpServerActionToolDef<any, any>[];
};

/** Register WebMCP tools that invoke Next.js Server Actions (render inside McpProvider). */
export function McpServerActionTools({ tools }: McpServerActionToolsProps) {
  return (
    <>
      {tools.map((def) => (
        <McpServerActionToolRegistrar key={def.name} def={def} />
      ))}
    </>
  );
}
