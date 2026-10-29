'use client';

import Link from 'next/link';
import { FlightsListMcpTools } from '@/mcp/flightsListMcpTools';
import { useGetFlightsQuery } from '@/store/travelApi';

export default function FlightsPage() {
  const { data: flights = [], isFetching } = useGetFlightsQuery({});

  return (
    <>
      <FlightsListMcpTools />
      <div className="card">
        <h1>Flights</h1>
        <p>
          Route tools: <code>list_flights</code>, <code>open_flight</code>
        </p>
        {isFetching && <p>Loading…</p>}
        <ul>
          {flights.map((flight) => (
            <li key={flight.id} style={{ marginBottom: 12 }}>
              <Link href={`/flights/${flight.id}`}>
                {flight.airline} {flight.origin}→{flight.destination}
              </Link>{' '}
              — ${flight.price} · {new Date(flight.departAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
