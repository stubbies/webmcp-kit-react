import type { ZodTypeAny } from 'zod';

export type JsonSchema = Record<string, unknown>;

export type ToolExecuteContext = {
  signal: AbortSignal;
};

export type McpToolRegistryEntry = {
  name: string;
  description: string;
  inputSchema?: JsonSchema;
  annotations?: WebMCP.ToolAnnotations;
  registered: boolean;
  supported: boolean;
  error: Error | null;
  lastResult?: unknown;
  lastInvokedAt?: number | null;
};

export type UseMcpToolOptions<TArgs = unknown, TResult = unknown> = {
  name: string;
  description: string;
  schema?: ZodTypeAny;
  inputSchema?: JsonSchema;
  annotations?: WebMCP.ToolAnnotations;
  enabled?: boolean;
  exposedTo?: string[];
  execute: (args: TArgs, context: ToolExecuteContext) => TResult | Promise<TResult>;
};

export type McpRegistrySnapshot = McpToolRegistryEntry[];
