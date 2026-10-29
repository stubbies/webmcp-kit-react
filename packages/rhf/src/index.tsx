import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useMcpTool } from '@webmcp-kit/react';

export type McpFormFieldDef<T extends FieldValues> = {
  name: FieldPath<T>;
  description: string;
  toolName?: string;
  schema?: z.ZodTypeAny;
};

export type McpFormToolsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: McpFormFieldDef<T>[];
  enabled?: boolean;
};

const DEFAULT_FIELD_SCHEMA = z.object({ value: z.string().describe('Field value') });

function McpFormFieldTool<T extends FieldValues>({
  form,
  field,
  enabled,
}: {
  form: UseFormReturn<T>;
  field: McpFormFieldDef<T>;
  enabled: boolean;
}) {
  const toolName = field.toolName ?? `fill_${String(field.name).replace(/\./g, '_')}`;
  const schema = field.schema ?? DEFAULT_FIELD_SCHEMA;

  useMcpTool({
    name: toolName,
    description: field.description,
    schema,
    enabled,
    execute: ({ value }: { value: string }) => {
      form.setValue(field.name, value as never, { shouldValidate: true, shouldDirty: true });
      return { success: true, field: field.name, value };
    },
  });

  return null;
}

/** Register one WebMCP tool per form field (render inside McpProvider). */
export function McpFormTools<T extends FieldValues>({
  form,
  fields,
  enabled = true,
}: McpFormToolsProps<T>) {
  return (
    <>
      {fields.map((field) => (
        <McpFormFieldTool key={String(field.name)} form={form} field={field} enabled={enabled} />
      ))}
    </>
  );
}

export type UseMcpSubmitToolOptions<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: string;
  description: string;
  enabled?: boolean;
  onValidSubmit?: (values: T) => unknown | Promise<unknown>;
};

export function useMcpSubmitTool<T extends FieldValues>({
  form,
  name,
  description,
  enabled = true,
  onValidSubmit,
}: UseMcpSubmitToolOptions<T>) {
  return useMcpTool({
    name,
    description,
    schema: z.object({}),
    enabled,
    execute: () =>
      new Promise((resolve) => {
        void form.handleSubmit(
          async (values) => {
            const result = onValidSubmit ? await onValidSubmit(values) : { success: true, values };
            resolve(result);
          },
          (errors) => {
            resolve({ success: false, errors });
          },
        )();
      }),
  });
}

/** @deprecated Use McpFormTools component instead (hooks cannot run in a loop). */
export function useMcpFormTools<T extends FieldValues>(_options: UseMcpFormToolsOptions<T>): void {
  throw new Error('useMcpFormTools is removed; render <McpFormTools /> instead.');
}

export type UseMcpFormToolsOptions<T extends FieldValues> = McpFormToolsProps<T>;
