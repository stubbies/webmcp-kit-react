# @react-webmcp-kit/react-hook-form

Expose **[React Hook Form](https://react-hook-form.com/)** fields and submit handlers as **[WebMCP](https://developer.chrome.com/docs/ai/webmcp)** tools so agents can fill and submit forms safely.

Requires [`@react-webmcp-kit/core`](https://www.npmjs.com/package/@react-webmcp-kit/core).

## Install

```bash
pnpm add @react-webmcp-kit/react-hook-form @react-webmcp-kit/core react-hook-form use-webmcp-tool zod
```

## Usage

Render inside `McpProvider`. Hoist field defs at module scope when possible.

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { McpFormTools, useMcpSubmitTool } from '@react-webmcp-kit/react-hook-form';

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const fields = [
  { name: 'email' as const, description: 'Set checkout email' },
  { name: 'fullName' as const, description: 'Set full name' },
];

export function CheckoutForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', fullName: '' },
  });

  useMcpSubmitTool({
    name: 'submit_checkout',
    description: 'Submit the checkout form',
    form,
    enabled: form.formState.isValid,
    onSubmit: async (values) => {
      // persist / navigate
      return { success: true, values };
    },
  });

  return (
    <>
      <McpFormTools form={form} fields={fields} />
      <form onSubmit={form.handleSubmit((v) => console.log(v))}>{/* inputs */}</form>
    </>
  );
}
```

## API

| Export | Purpose |
|--------|---------|
| `McpFormTools` | One `fill_*` tool per field (`toolName` optional; default `fill_<path>`) |
| `useMcpSubmitTool` | Registers a submit tool that runs validation then your `onSubmit` |
| `McpFormFieldDef` | `{ name, description, toolName?, schema? }` |

Default field schema is `z.object({ value: z.string() })`. Pass a custom Zod schema when the agent should send structured values.

Gate tools with `enabled` (e.g. disable submit until the cart is non-empty).

## Demo

See `apps/demo-checkout` in [webmcp-kit-react](https://github.com/stubbies/webmcp-kit-react).

## License

MIT
