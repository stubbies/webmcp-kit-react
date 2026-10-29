# React WebMCP Kit

Headless React hooks and adapters that expose multi-step UI workflows to [WebMCP](https://developer.chrome.com/docs/ai/webmcp) agents via `document.modelContext`, built on Chrome’s official [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool) lifecycle hook.

## Packages

| Package | Description |
|---------|-------------|
| `@webmcp-kit/react` | `McpProvider`, `useMcpTool`, `McpDevTools`, Zod → JSON Schema |
| `@webmcp-kit/react-hook-form` | `McpFormTools`, `useMcpSubmitTool` |
| `@webmcp-kit/zustand` | `McpStoreTools` for store actions |
| `@webmcp-kit/redux` | `McpReduxTools`, `McpRtkQueryTools`, `formatRtkQueryResult` |

## Quickstart

```tsx
'use client';

import { z } from 'zod';
import { McpProvider, useMcpTool } from '@webmcp-kit/react';

function EmailField() {
  const [email, setEmail] = useState('');

  useMcpTool({
    name: 'fill_user_email',
    description: 'Populates email in checkout section',
    schema: z.object({ email: z.string().email() }),
    execute: async (args) => {
      setEmail(args.email);
      return { success: true };
    },
  });

  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}

export default function App() {
  return (
    <McpProvider>
      <EmailField />
    </McpProvider>
  );
}
```

## Local development (Chrome WebMCP)

1. Enable **WebMCP testing**: `chrome://flags/#enable-webmcp-testing` (or Edge `edge://flags/#enable-webmcp-testing`).
2. Install dependencies and run the demo:

```bash
pnpm install
pnpm build
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) and use **MCP DevTools** (bottom-right) to mock-invoke tools.

For browsers without the flag, the demo installs `@mcp-b/webmcp-polyfill` on the client via `installWebMcpPolyfill()`.

## Next.js App Router

Keep the root layout as a Server Component. Wrap the client tree with `McpProvider` in a `'use client'` shell (see `apps/demo-checkout/src/components/McpShell.tsx`).

## Redux / RTK Query

```tsx
<McpReduxTools tools={[{ name: 'add_to_cart', schema, description, execute: (args, { dispatch }) => { ... } }]} />
<McpRtkQueryTools tools={[{ name: 'fetch_order', kind: 'query', initiate: (args) => api.endpoints.getOrder.initiate(args), ... }]} />
```

See [packages/redux/README.md](packages/redux/README.md).

## Demos

### Demo 1: Agentic checkout

`apps/demo-checkout` — catalog → cart → checkout (React Hook Form + Zod) → confirmation, with Zustand cart tools and form fill tools.

Run: `pnpm dev` → [http://localhost:3000](http://localhost:3000)

### Demo 2: Hotel & Flight Concierge

`apps/demo-concierge` — dynamic tool mounting across App Router routes (Redux/RTK Query + RHF search + intercepting booking modal).

Run: `pnpm dev:concierge` → [http://localhost:3001](http://localhost:3001)

See [apps/demo-concierge/README.md](apps/demo-concierge/README.md).
