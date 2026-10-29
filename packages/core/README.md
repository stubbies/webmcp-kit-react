# @react-webmcp-kit/core

Headless React hooks that register **[WebMCP](https://developer.chrome.com/docs/ai/webmcp)** tools on `document.modelContext`, so AI agents can drive your UI without scraping the DOM.

Built on Chrome’s [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool) lifecycle. Tools mount and unmount with your React tree.

## Install

```bash
pnpm add @react-webmcp-kit/core use-webmcp-tool zod
```

Peer: `react` ≥ 18, `use-webmcp-tool` ≥ 0.3.

## Quickstart

```tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { McpProvider, useMcpTool } from '@react-webmcp-kit/core';

function EmailField() {
  const [email, setEmail] = useState('');

  useMcpTool({
    name: 'fill_user_email',
    description: 'Populates email in checkout',
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

In Next.js App Router, keep the root layout as a Server Component and wrap clients with `McpProvider` in a `'use client'` shell.

## API

| Export | Purpose |
|--------|---------|
| `McpProvider` | Registry context; wrap the client tree once |
| `useMcpTool` | Register one tool (`name`, `description`, Zod `schema`, `execute`, optional `enabled` / `annotations`) |
| `useMcpRegistry` | Read the live tool registry (used by DevTools) |
| `McpDevTools` | Overlay to inspect and mock-invoke tools in development |
| `installWebMcpPolyfill` | Install `@mcp-b/webmcp-polyfill` when the browser flag is off |
| `zodToJsonSchema` | Convert Zod schemas to JSON Schema for agents |

### `useMcpTool` options

- **`enabled`** — when `false`, the tool is unregistered (e.g. gate submit until the form is valid)
- **`annotations`** — WebMCP hints such as `readOnlyHint`, `consequentialHint`
- **`execute(args, { signal })`** — return a JSON-serializable result for the agent

## Browser setup

1. Enable WebMCP testing: `chrome://flags/#enable-webmcp-testing`
2. Or call `installWebMcpPolyfill()` once on the client (demos do this in `McpShell`)

## Related packages

| Package | Role |
|---------|------|
| [`@react-webmcp-kit/react-hook-form`](https://www.npmjs.com/package/@react-webmcp-kit/react-hook-form) | Form fill + submit tools |
| [`@react-webmcp-kit/zustand`](https://www.npmjs.com/package/@react-webmcp-kit/zustand) | Zustand actions |
| [`@react-webmcp-kit/redux`](https://www.npmjs.com/package/@react-webmcp-kit/redux) | Redux Toolkit + RTK Query |
| [`@react-webmcp-kit/next`](https://www.npmjs.com/package/@react-webmcp-kit/next) | Server Actions + table filters |

Demos and source: [github.com/stubbies/webmcp-kit-react](https://github.com/stubbies/webmcp-kit-react)

## License

MIT
