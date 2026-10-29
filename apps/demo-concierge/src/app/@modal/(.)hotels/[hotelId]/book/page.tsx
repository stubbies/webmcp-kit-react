'use client';

import { useParams } from 'next/navigation';
import { BookingModal } from '@/components/BookingModal';
import { BookingModalMcpTools } from '@/mcp/bookingModalMcpTools';

export default function InterceptedBookModalPage() {
  const params = useParams<{ hotelId: string }>();
  const hotelId = params.hotelId;

  return (
    <>
      <BookingModalMcpTools hotelId={hotelId} />
      <BookingModal hotelId={hotelId} />
    </>
  );
}
