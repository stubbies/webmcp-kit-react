'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useGetHotelByIdQuery } from '@/store/travelApi';
import { selectPendingRoomForHotel, selectTrip } from '@/store/tripSlice';

type Props = {
  hotelId: string;
};

export function BookingModal({ hotelId }: Props) {
  const router = useRouter();
  const { data: hotel } = useGetHotelByIdQuery({ hotelId });
  const pendingRoomId = useAppSelector(selectPendingRoomForHotel(hotelId));
  const selectedHotel = useAppSelector((s) => selectTrip(s).selectedHotel);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="book-title">
      <div className="modal-panel">
        <h2 id="book-title">Book {hotel?.name ?? hotelId}</h2>
        <p>
          Room:{' '}
          {pendingRoomId
            ? hotel?.rooms.find((r) => r.id === pendingRoomId)?.name ?? pendingRoomId
            : 'None selected — pick a room on the detail page'}
        </p>
        {selectedHotel?.hotelId === hotelId && (
          <p className="hint">This hotel is already on your trip.</p>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="button" className="secondary" onClick={() => router.back()}>
            Cancel
          </button>
          <Link href={`/hotels/${hotelId}`} className="secondary" style={{ padding: '10px 16px' }}>
            View hotel
          </Link>
        </div>
        <p style={{ fontSize: 13, color: '#71717a', marginTop: 16 }}>
          Modal-only MCP tools: <code>confirm_hotel_booking</code>,{' '}
          <code>cancel_booking_modal</code>
        </p>
      </div>
    </div>
  );
}
