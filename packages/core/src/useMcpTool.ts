import { useEffect, useMemo, useRef } from 'react';
import { useWebMCP } from 'use-webmcp-tool';
import type { ZodTypeAny } from 'zod';
import { useMcpProviderContext } from './McpProvider';
import { isZodSchema, zodToJsonSchema } from './zodToJsonSchema';
import type { JsonSchema, UseMcpToolOptions } from './types';

export function useMcpTool<TArgs = unknown, TResult = unknown>(
  options: UseMcpToolOptions<TArgs, TResult>,
) {
  const {
    name,
    description,
    schema,
    inputSchema: inputSchemaProp,
    annotations,
    enabled = true,
    execute,
  } = options;

  const provider = useMcpProviderContext();
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const zodJsonCache = useRef<{ source: ZodTypeAny; json: JsonSchema } | null>(null);
  const resolvedInputSchema = useMemo((): JsonSchema | undefined => {
    if (inputSchemaProp) return inputSchemaProp;
    if (schema && isZodSchema(schema)) {
      if (zodJsonCache.current?.source === schema) {
        return zodJsonCache.current.json;
      }
      const json = zodToJsonSchema(schema);
      zodJsonCache.current = { source: schema, json };
      return json;
    }
    return undefined;
  }, [schema, inputSchemaProp]);

  const inputSchemaKey = useMemo(
    () => (resolvedInputSchema ? JSON.stringify(resolvedInputSchema) : ''),
    [resolvedInputSchema],
  );

  const { supported, registered, error } = useWebMCP({
    name,
    description,
    inputSchema: resolvedInputSchema,
    annotations,
    enabled,
    async execute(args: unknown, { signal }: { signal: AbortSignal }) {
      const currentSchema = schemaRef.current;
      if (currentSchema && isZodSchema(currentSchema)) {
        const parsed = currentSchema.safeParse(args);
        if (!parsed.success) {
          const message = parsed.error.errors.map((e) => e.message).join('; ');
          throw new Error(`Validation failed: ${message}`);
        }
        const result = await execute(parsed.data as TArgs, { signal });
        provider?.recordResult(name, result);
        return result;
      }
      const result = await execute(args as TArgs, { signal });
      provider?.recordResult(name, result);
      return result;
    },
  });

  useEffect(() => {
    if (!provider) return;
    provider.upsertEntry({
      name,
      description,
      inputSchema: resolvedInputSchema,
      annotations,
      registered,
      supported,
      error,
    });
  }, [provider, name, description, inputSchemaKey, annotations, registered, supported, error]);

  useEffect(() => {
    return () => {
      provider?.removeEntry(name);
    };
  }, [provider, name]);

  return { supported, registered, error };
}
