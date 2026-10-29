# Demo 1 — Agentic Checkout

Multi-step checkout flow exposing WebMCP tools for cart and form automation.

## Run

From the repo root:

```bash
pnpm install
pnpm build
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## WebMCP setup

1. Enable `chrome://flags/#enable-webmcp-testing` (Chrome or Edge equivalent).
2. In development, **MCP DevTools** appears at the bottom-right for mock tool invocation.
3. Without the flag, the app installs `@mcp-b/webmcp-polyfill` on the client.

## Tools by step

| Step | Tools |
|------|--------|
| Catalog / Cart | `add_to_cart`, `remove_from_cart`, `set_cart_qty` |
| Checkout | `fill_email`, `fill_fullName`, …, `submit_checkout`, `get_checkout_state` |
| Confirmation | `get_order_status` |
