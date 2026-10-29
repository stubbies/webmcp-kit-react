# @react-webmcp-kit/next

**[WebMCP](https://developer.chrome.com/docs/ai/webmcp)** adapters for **Next.js Server Actions** and **high-capacity client-side table filtering**.

Requires [`@react-webmcp-kit/core`](https://www.npmjs.com/package/@react-webmcp-kit/core). Server Actions stay in your app (`'use server'`); this package only forwards agent tool calls from Client Components.

## Install

```bash
pnpm add @react-webmcp-kit/next @react-webmcp-kit/core use-webmcp-tool zod
```

## Server Action tools

```tsx
'use client';

import { z } from 'zod';
import { McpServerActionTools } from '@react-webmcp-kit/next';
import { loadLedgerWindow } from '@/app/actions';

export function LedgerActionTools() {
  return (
    <McpServerActionTools
      tools={[
        {
          name: 'load_ledger_window',
          description: 'Load ledger rows for a date range',
          schema: z.object({ from: z.string(), to: z.string() }),
          action: loadLedgerWindow,
          annotations: { readOnlyHint: true },
        },
      ]}
    />
  );
}
```

Each tool’s `action` is typically an imported Server Action. `execute` forwards args and respects `AbortSignal`.

## Table filter tools

Hybrid pattern: load a data window via Server Action, then refine thousands of rows in the browser.

```tsx
'use client';

import {
  applyTableFilters,
  McpTableFilterTools,
  useTableFilterState,
  type TableColumnDef,
} from '@react-webmcp-kit/next';

const columns: TableColumnDef<Row>[] = [
  { id: 'status', label: 'Status' },
  { id: 'amount', label: 'Amount', sortable: true },
];

export function LedgerTable({ rows }: { rows: Row[] }) {
  const filterApi = useTableFilterState({ initialPageSize: 25 });
  const page = applyTableFilters(rows, filterApi.state, columns);

  return (
    <>
      <McpTableFilterTools columns={columns} filterApi={filterApi} toolPrefix="ledger_" />
      {/* render page.rows */}
    </>
  );
}
```

### Auto-registered filter tools

| Tool | Purpose |
|------|---------|
| `set_column_filter` | Filter one column |
| `clear_column_filter` | Clear one column filter |
| `clear_all_filters` | Reset filters, search, sort |
| `set_global_search` | Cross-column search |
| `set_sort` / `clear_sort` | Sort |
| `set_page` / `set_page_size` | Pagination |
| `get_filter_state` | Read-only snapshot (`readOnlyHint`) |

Use `toolPrefix` (e.g. `ledger_`) when multiple tables share a page.

## API

| Export | Purpose |
|--------|---------|
| `McpServerActionTools` | Bind tools to async server functions |
| `useTableFilterState` | Client filter/sort/page state |
| `applyTableFilters` | Pure filter → search → sort → paginate |
| `McpTableFilterTools` | Expose filter state as WebMCP tools |

## Demo

See `apps/demo-datamesh` in [webmcp-kit-react](https://github.com/stubbies/webmcp-kit-react).

## License

MIT
