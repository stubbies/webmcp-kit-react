'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { FlightDetailMcpTools } from '@/mcp/flightDetailMcpTools';
import { useGetFlightByIdQuery } from '@/store/travelApi';
import { selectTrip } from '@/store/tripSlice';

export default function FlightDetailPage() {
  const params = useParams<{ flightId: string }>();
  const flightId = params.flightId;
  const { data: flight, isLoading } = useGetFlightByIdQuery({ flightId });
  const selectedFlight = useAppSelector((s) => selectTrip(s).selectedFlight);

  if (isLoading) {
    return <div className="card">Loading flight…</div>;
  }

  if (!flight) {
    return (
      <div className="card">
        <p>Flight not found.</p>
        <Link href="/flights">Back to flights</Link>
      </div>
    );
  }

  return (
    <>
      <FlightDetailMcpTools flightId={flightId} />
      <div className="card">
        <h1>
          {flight.airline} · {flight.origin}→{flight.destination}
        </h1>
        <p>
          Departs {new Date(flight.departAt).toLocaleString()} · ${flight.price} · Context:{' '}
          <code>{flightId}</code>
        </p>
        <p>
          Param-scoped tools: <code>get_flight_details</code>, <code>add_flight_to_trip</code>
        </p>
        {selectedFlight?.flightId === flightId ? (
          <p>This flight is on your trip.</p>
        ) : (
          <p>Select this flight via MCP or add it from DevTools with <code>add_flight_to_trip</code>.</p>
        )}
        <Link href="/flights">Back to list</Link>
      </div>
    </>
  );
}
