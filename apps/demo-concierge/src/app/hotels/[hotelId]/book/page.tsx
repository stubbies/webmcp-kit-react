'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookingModalMcpTools } from '@/mcp/bookingModalMcpTools';
import { BookingModal } from '@/components/BookingModal';

/** Full-page fallback when hard-navigating to the book URL. */
export default function HotelBookPage() {
  const params = useParams<{ hotelId: string }>();
  const hotelId = params.hotelId;

  return (
    <>
      <BookingModalMcpTools hotelId={hotelId} />
      <div className="card">
        <h1>Book hotel {hotelId}</h1>
        <p>Full-page booking view (hard navigation). Use soft navigation from the hotel page for the intercepting modal.</p>
        <Link href={`/hotels/${hotelId}`}>Back to hotel</Link>
      </div>
      <BookingModal hotelId={hotelId} />
    </>
  );
}
