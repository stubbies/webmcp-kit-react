'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { TripPageMcpTools } from '@/mcp/tripPageMcpTools';
import { selectCanConfirmTrip, selectTrip } from '@/store/tripSlice';

export default function TripPage() {
  const trip = useAppSelector(selectTrip);
  const canConfirm = useAppSelector(selectCanConfirmTrip);

  return (
    <>
      <TripPageMcpTools />
      <div className="card">
        <h1>Your trip</h1>
        <p>
          Route tools: <code>remove_hotel</code>, <code>remove_flight</code>,{' '}
          <code>confirm_trip</code>
          {!canConfirm && ' (confirm disabled until hotel + flight are set)'}
        </p>

        {trip.tripStatus === 'confirmed' && trip.confirmationId ? (
          <p>
            <strong>Confirmed:</strong> {trip.confirmationId}
          </p>
        ) : (
          <>
            <h2>Summary</h2>
            <ul>
              <li>Travelers: {trip.travelers}</li>
              <li>
                Hotel:{' '}
                {trip.selectedHotel
                  ? `${trip.selectedHotel.hotelName} (${trip.selectedHotel.roomName})`
                  : 'Missing — '}
                {!trip.selectedHotel && <Link href="/hotels">pick a hotel</Link>}
              </li>
              <li>
                Flight:{' '}
                {trip.selectedFlight
                  ? `${trip.selectedFlight.airline} ${trip.selectedFlight.origin}→${trip.selectedFlight.destination}`
                  : 'Missing — '}
                {!trip.selectedFlight && <Link href="/flights">pick a flight</Link>}
              </li>
            </ul>
          </>
        )}

        <p style={{ marginTop: 16 }}>
          <Link href="/">Back to hub</Link>
        </p>
      </div>
    </>
  );
}
