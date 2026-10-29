# @react-webmcp-kit/redux

**[WebMCP](https://developer.chrome.com/docs/ai/webmcp)** adapters for **Redux Toolkit** slice/thunk actions and **RTK Query** endpoints.

Requires [`@react-webmcp-kit/core`](https://www.npmjs.com/package/@react-webmcp-kit/core). Render inside Redux `<Provider>` and `McpProvider`.

## Install

```bash
pnpm add @react-webmcp-kit/redux @react-webmcp-kit/core @reduxjs/toolkit react-redux use-webmcp-tool zod
```

## Slice / thunk tools

Hoist tool defs and Zod schemas at module scope.

```tsx
'use client';

import { z } from 'zod';
import { McpReduxTools } from '@react-webmcp-kit/redux';
import { cartSlice, selectCart } from './cartSlice';

const addToCartSchema = z.object({
  productId: z.string(),
  qty: z.number().int().min(1),
});

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

`execute` receives `{ dispatch, getState, signal }`.

## RTK Query tools

Bind `endpoint.initiate(args)`. For one-shot agent reads:

```tsx
initiate: (args) =>
  ordersApi.endpoints.getOrder.initiate(args, { subscribe: false, forceRefetch: true }),
```

```tsx
import { z } from 'zod';
import { McpRtkQueryTools } from '@react-webmcp-kit/redux';

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

- `kind: 'query'` → `readOnlyHint: true`
- `kind: 'mutation'` → `consequentialHint: true`
- Results normalized with `formatRtkQueryResult` → `{ success, data }` / `{ success: false, error }`

## API

| Export | Purpose |
|--------|---------|
| `McpReduxTools` | Dispatch-based tools |
| `McpRtkQueryTools` | RTK Query `initiate` tools |
| `formatRtkQueryResult` | Normalize RTK results for agents |

## Demo

See `apps/demo-concierge` in [webmcp-kit-react](https://github.com/stubbies/webmcp-kit-react).

## License

MIT
