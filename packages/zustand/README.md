# @react-webmcp-kit/zustand

Register **[Zustand](https://zustand.docs.pmnd.rs/)** store actions as **[WebMCP](https://developer.chrome.com/docs/ai/webmcp)** tools so agents can mutate client state through explicit schemas.

Requires [`@react-webmcp-kit/core`](https://www.npmjs.com/package/@react-webmcp-kit/core).

## Install

```bash
pnpm add @react-webmcp-kit/zustand @react-webmcp-kit/core zustand use-webmcp-tool zod
```

## Usage

Render `<McpStoreTools />` inside `McpProvider`. Keep tool defs stable (module scope).

```tsx
'use client';

import { z } from 'zod';
import { McpStoreTools } from '@react-webmcp-kit/zustand';
import { useCartStore } from './cartStore';

const addSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(1),
});

const cartTools = [
  {
    name: 'add_to_cart',
    description: 'Add a product line to the cart',
    schema: addSchema,
    execute: (args) => {
      useCartStore.getState().addItem(args);
      return { success: true, cart: useCartStore.getState().lines };
    },
  },
  {
    name: 'remove_from_cart',
    description: 'Remove a line by product id',
    schema: z.object({ productId: z.string() }),
    execute: ({ productId }) => {
      useCartStore.getState().removeItem(productId);
      return { success: true };
    },
  },
];

export function CartMcpTools() {
  return <McpStoreTools tools={cartTools} />;
}
```

## API

| Export | Purpose |
|--------|---------|
| `McpStoreTools` | Registers each `McpStoreToolDef` via `useMcpTool` |
| `McpStoreToolDef` | `{ name, description, schema, execute, enabled?, annotations? }` |

`execute` receives parsed args and should return a JSON-serializable result. Use `enabled` to hide tools when the store cannot accept the action.

> `useMcpStoreTools` is removed — render `<McpStoreTools />` instead.

## Demo

See `apps/demo-checkout` in [webmcp-kit-react](https://github.com/stubbies/webmcp-kit-react).

## License

MIT
