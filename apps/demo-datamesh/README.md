# Demo 3: B2B Enterprise Financial Data-Mesh

Illustrates **high-capacity client filtering hooks** on heavy ledger tables, with windows loaded through **Next.js Server Actions** (`@webmcp-kit/next`).

## Run

1. Enable WebMCP: `chrome://flags/#enable-webmcp-testing`
2. From repo root:

```bash
pnpm install
pnpm build
pnpm dev:datamesh
```

3. Open [http://localhost:3002](http://localhost:3002) and use **MCP DevTools** (bottom-right).

## Hybrid data flow

1. **Server Actions** load a secure window (date range + optional accounts, up to 2000 rows) into the browser session.
2. **Client filter tools** refine that window in memory (column filters, global search, sort, pagination) without extra server round-trips.
3. **`export_ledger`** sends the current window + filter snapshot back to a Server Action for server-side re-validation and CSV export.

## Routes → tools

| Route | Server Action tools | Client filter tools |
|-------|---------------------|---------------------|
| `/` | `load_accounts`, `get_mesh_summary` | — |
| `/ledger` | `load_ledger_window`, `export_ledger` | `ledger_set_column_filter`, `ledger_set_global_search`, `ledger_set_sort`, `ledger_set_page`, `ledger_get_filter_state`, … |
| `/accounts` | `load_accounts` | — |
| `/accounts/[accountId]` | `get_account`, `load_ledger_window` (scoped) | `account_{id}_*` filter tools |

Navigating away from an account detail page unmounts account-scoped tools; the layout **Active window** strip persists across routes.

## Verify

1. `/ledger` — before load, filter tools are disabled; after **Load window**, table + `ledger_*` tools work.
2. Invoke `ledger_set_column_filter` in DevTools — table updates without reload.
3. `/accounts/A1` — account tools appear; navigate to `/ledger` — account tools disappear.
4. `export_ledger` is disabled until a window is loaded; export row count matches filtered totals.
