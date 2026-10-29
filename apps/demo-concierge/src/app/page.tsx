'use client';

import Link from 'next/link';

export default function HubPage() {
  return (
    <div className="card">
      <h1>Hotel &amp; Flight Concierge</h1>
      <p>
        Build a trip with contextual WebMCP tools that mount and unmount as you navigate.
        Layout tools <code>get_trip</code> and <code>set_travelers</code> stay active on every
        route.
      </p>
      <ol>
        <li>
          <Link href="/search">Search</Link> — fill travel dates and destination (RHF tools)
        </li>
        <li>
          <Link href="/hotels">Hotels</Link> — list and open dynamic hotel pages
        </li>
        <li>
          <Link href="/flights">Flights</Link> — pick a flight for the return leg
        </li>
        <li>
          <Link href="/trip">Trip</Link> — review and confirm
        </li>
      </ol>
      <p style={{ fontSize: 14, color: '#52525b' }}>
        Open MCP DevTools (bottom-right) and watch the tool list change as you change routes.
      </p>
    </div>
  );
}
