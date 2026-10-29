# @react-webmcp-kit/redux

WebMCP tools for **Redux Toolkit** slice actions and **RTK Query** endpoints.

## Install

```bash
pnpm add @react-webmcp-kit/redux @react-webmcp-kit/core use-webmcp-tool zod react-redux @reduxjs/toolkit
```

Wrap your app with Redux `Provider`, then `@react-webmcp-kit/core`'s `McpProvider`.

## Slice / thunk tools

Hoist tool defs and Zod schemas at module scope (avoid new objects each render).

```tsx
'use client';

import { McpReduxTools } from '@react-webmcp-kit/redux';
import { cartSlice, selectCart } from './cartSlice';

const addToCartSchema = z.object({ productId: z.string(), qty: z.number().int().min(1) });

const cartTools = [
  {
    name: 'add_to_cart',
    description: 'Add a line item to the cart',
    schema: addToCartSchema,
    execute: (args, { dispatch, getState, signal }) => {
      if (signal.aborted) throw new Error('Aborted');
      dispatch(cartSlice.actions.addItem(args));
      return { success: true, cart: selectCart(getState()) };
    },
  },
];

export function CartMcpTools() {
  return <McpReduxTools tools={cartTools} />;
}
```

## RTK Query tools

Bind `endpoint.initiate(args)`. For one-shot agent reads, pass RTK options inside your wrapper:

```tsx
initiate: (args) =>
  ordersApi.endpoints.getOrder.initiate(args, { subscribe: false, forceRefetch: true }),
```

```tsx
<McpRtkQueryTools
  tools={[
    {
      name: 'fetch_order',
      description: 'Load order by id',
      schema: z.object({ orderId: z.string() }),
      kind: 'query',
      initiate: (args) => ordersApi.endpoints.getOrder.initiate(args),
    },
    {
      name: 'update_order',
      description: 'Patch an order',
      schema: patchOrderSchema,
      kind: 'mutation',
      initiate: (args) => ordersApi.endpoints.updateOrder.initiate(args),
    },
  ]}
/>
```

Query tools get `readOnlyHint: true`; mutations get `consequentialHint: true`. Results are normalized via `formatRtkQueryResult` for agent-friendly `{ success, data }` / `{ success: false, error }` payloads.
