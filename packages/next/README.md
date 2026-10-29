# @react-webmcp-kit/next

WebMCP tools for **Next.js Server Actions** and **high-capacity client-side table filtering**.

## Install

```bash
pnpm add @react-webmcp-kit/next @react-webmcp-kit/core use-webmcp-tool zod
```

Server Actions stay in your app (`'use server'`). This package forwards agent tool calls to those functions from client components inside `McpProvider`.

## Server Action tools

```tsx
'use client';

import { McpServerActionTools } from '@react-webmcp-kit/next';
import { z } from 'zod';
import { loadLedgerWindow } from '@/app/actions';

const loadSchema = z.object({ from: z.string(), to: z.string() });

export function LedgerActionTools() {
  return (
    <McpServerActionTools
      tools={[
        {
          name: 'load_ledger_window',
          description: 'Load ledger rows for a date range',
          schema: loadSchema,
          action: loadLedgerWindow,
          annotations: { readOnlyHint: true },
        },
      ]}
    />
  );
}
```

## Table filter tools

Use `useTableFilterState` for React state, `applyTableFilters` for pure filtering over in-memory rows, and `McpTableFilterTools` to expose filter/sort/page tools to agents.

| Tool | Purpose |
|------|---------|
| `set_column_filter` | Filter one column |
| `clear_column_filter` | Remove one column filter |
| `clear_all_filters` | Reset filters, search, sort |
| `set_global_search` | Cross-column search |
| `set_sort` / `clear_sort` | Sort |
| `set_page` / `set_page_size` | Pagination |
| `get_filter_state` | Read-only snapshot |

Pass `toolPrefix` (e.g. `ledger_`) when multiple tables register tools on one page.

See `apps/demo-datamesh` for the full financial data-mesh demo.
