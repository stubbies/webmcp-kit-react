import type { ZodTypeAny } from 'zod';
import { zodToJsonSchema as zod3ToJsonSchema } from 'zod-to-json-schema';

export function zodToJsonSchema(schema: ZodTypeAny): Record<string, unknown> {
  const result = zod3ToJsonSchema(schema, { $refStrategy: 'none' });
  if (typeof result === 'object' && result !== null && '$schema' in result) {
    const { $schema: _, ...rest } = result as Record<string, unknown>;
    return rest;
  }
  return result as Record<string, unknown>;
}

export function isZodSchema(value: unknown): value is ZodTypeAny {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_def' in value &&
    typeof (value as ZodTypeAny).safeParse === 'function'
  );
}
