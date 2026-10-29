'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { HotelDetailMcpTools } from '@/mcp/hotelDetailMcpTools';
import { useGetHotelByIdQuery } from '@/store/travelApi';
import {
  selectPendingRoomForHotel,
  selectTrip,
  tripActions,
} from '@/store/tripSlice';

export default function HotelDetailPage() {
  const params = useParams<{ hotelId: string }>();
  const hotelId = params.hotelId;
  const dispatch = useAppDispatch();
  const { data: hotel, isLoading } = useGetHotelByIdQuery({ hotelId });
  const pendingRoomId = useAppSelector(selectPendingRoomForHotel(hotelId));
  const selectedHotel = useAppSelector((s) => selectTrip(s).selectedHotel);

  if (isLoading) {
    return <div className="card">Loading hotel…</div>;
  }

  if (!hotel) {
    return (
      <div className="card">
        <p>Hotel not found.</p>
        <Link href="/hotels">Back to hotels</Link>
      </div>
    );
  }

  return (
    <>
      <HotelDetailMcpTools hotelId={hotelId} />
      <div className="card">
        <h1>{hotel.name}</h1>
        <p>
          {hotel.city} · {hotel.rating}★ · Context: <code>{hotelId}</code>
        </p>
        <p>
          Param-scoped tools: <code>get_hotel_details</code>, <code>select_room</code>,{' '}
          <code>add_hotel_to_trip</code>
        </p>
        <ul className="room-list">
          {hotel.rooms.map((room) => (
            <li
              key={room.id}
              className={pendingRoomId === room.id ? 'selected' : undefined}
            >
              <span>
                {room.name} — ${room.pricePerNight}/night
              </span>
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  dispatch(tripActions.selectRoom({ hotelId, roomId: room.id }))
                }
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <Link href={`/hotels/${hotelId}/book`} className="primary" style={{ padding: '10px 16px' }}>
            Open booking modal
          </Link>
          <Link href="/hotels">Back to list</Link>
        </div>
        {selectedHotel?.hotelId === hotelId && (
          <p style={{ marginTop: 12 }}>On trip: {selectedHotel.roomName}</p>
        )}
      </div>
    </>
  );
}
