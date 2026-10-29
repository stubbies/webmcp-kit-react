# Demo 2: Hotel & Flight Concierge

Next.js App Router demo for **dynamic, contextual WebMCP tool mounting** — layout-stable trip tools, route-scoped search/list/detail tools, and modal-only tools via an intercepting parallel route.

## Run

```bash
pnpm install
pnpm build
pnpm dev:concierge
```

Open [http://localhost:3001](http://localhost:3001). Enable WebMCP testing in Chrome (`chrome://flags/#enable-webmcp-testing`) and use **MCP DevTools** (bottom-right).

## Tools by route

| Route | Layout tools (always) | Route / modal tools |
|-------|----------------------|---------------------|
| All | `get_trip`, `set_travelers` | — |
| `/search` | same | `fill_*`, `submit_search` |
| `/hotels` | same | `list_hotels`, `open_hotel` |
| `/hotels/[hotelId]` | same | `get_hotel_details`, `select_room`, `add_hotel_to_trip` |
| `/flights` | same | `list_flights`, `open_flight` |
| `/flights/[flightId]` | same | `get_flight_details`, `add_flight_to_trip` |
| `/trip` | same | `remove_hotel`, `remove_flight`, `confirm_trip` |
| Soft book modal | underlying page tools stay | `confirm_hotel_booking`, `cancel_booking_modal` |

## Verify contextual mounting

1. On `/` — DevTools shows only `get_trip` and `set_travelers`.
2. Go to `/search` — RHF fill tools appear.
3. Open `/hotels/H1` — hotel param tools appear; navigate away and they disappear.
4. From a hotel detail, click **Open booking modal** (client navigation) — modal tools appear; close modal — they disappear while hotel tools remain.
5. On `/trip`, `confirm_trip` is disabled until both hotel and flight are on the trip.

## Stack

- Redux Toolkit + RTK Query (`@webmcp-kit/redux`) for trip state and mock inventory
- React Hook Form (`@webmcp-kit/react-hook-form`) on search
- `@webmcp-kit/react` — `McpProvider`, `McpDevTools`, polyfill
