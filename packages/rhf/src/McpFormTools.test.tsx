import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { useWebMCP } from 'use-webmcp-tool';
import { McpProvider } from '@react-webmcp-kit/core';
import { McpFormTools } from './index.tsx';

type FormValues = { email: string };

const emailField = [{ name: 'email' as const, description: 'Fill email field' }];

function FormToolsFixture() {
  const form = useForm<FormValues>({ defaultValues: { email: '' } });
  return (
    <>
      <McpFormTools form={form} fields={emailField} />
      <input data-testid="email" {...form.register('email')} />
    </>
  );
}

describe('McpFormTools', () => {
  it('registers fill tools via useWebMCP', async () => {
    render(
      <McpProvider>
        <FormToolsFixture />
      </McpProvider>,
    );

    await waitFor(() => {
      expect(useWebMCP).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'fill_email' }),
      );
    });
  });
});
