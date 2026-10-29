'use client';

import { useAppSelector } from '@/store/hooks';
import { selectTrip } from '@/store/tripSlice';

export function TripSummaryStrip() {
  const trip = useAppSelector(selectTrip);

  return (
    <aside className="trip-strip card" aria-label="Trip summary">
      <strong>Trip context</strong>
      <ul className="trip-strip-list">
        <li>Travelers: {trip.travelers}</li>
        <li>
          Search:{' '}
          {trip.search
            ? `${trip.search.destination} (${trip.search.checkIn} → ${trip.search.checkOut})`
            : 'Not set'}
        </li>
        <li>
          Hotel:{' '}
          {trip.selectedHotel
            ? `${trip.selectedHotel.hotelName} — ${trip.selectedHotel.roomName}`
            : 'None'}
        </li>
        <li>
          Flight:{' '}
          {trip.selectedFlight
            ? `${trip.selectedFlight.airline} ${trip.selectedFlight.origin}→${trip.selectedFlight.destination}`
            : 'None'}
        </li>
        <li>Status: {trip.tripStatus}</li>
      </ul>
    </aside>
  );
}
