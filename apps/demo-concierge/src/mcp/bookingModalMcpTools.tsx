'use client';

import { McpReduxTools, type McpReduxToolDef } from '@webmcp-kit/redux';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import { MOCK_HOTELS } from '@/store/mockTravelData';
import {
  selectCanAddHotel,
  selectTrip,
  tripActions,
} from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

type Props = {
  hotelId: string;
};

export function BookingModalMcpTools({ hotelId }: Props) {
  const router = useRouter();
  const canConfirm = useAppSelector(selectCanAddHotel(hotelId));

  const emptySchema = z.object({});

  const tools = useMemo(
    (): McpReduxToolDef<z.infer<typeof emptySchema>, unknown, RootState, AppDispatch>[] => [
      {
        name: 'confirm_hotel_booking',
        description: `Confirm booking modal for hotel ${hotelId} (adds selected room to trip)`,
        schema: emptySchema,
        enabled: canConfirm,
        execute: (_args, { dispatch, getState }) => {
          const trip = selectTrip(getState());
          const roomId = trip.pendingRoomId;
          if (!roomId || trip.pendingRoomHotelId !== hotelId) {
            return { success: false, error: 'Select a room on the hotel page first' };
          }
          const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
          const room = hotel?.rooms.find((r) => r.id === roomId);
          if (!hotel || !room) {
            return { success: false, error: 'Invalid hotel or room', hotelId };
          }
          dispatch(
            tripActions.addHotelToTrip({
              hotelId,
              hotelName: hotel.name,
              roomId: room.id,
              roomName: room.name,
              pricePerNight: room.pricePerNight,
            }),
          );
          router.back();
          return {
            success: true,
            hotelId,
            roomId,
            modalClosed: true,
          };
        },
      },
      {
        name: 'cancel_booking_modal',
        description: 'Close the hotel booking modal without confirming',
        schema: emptySchema,
        execute: () => {
          router.back();
          return { success: true, cancelled: true, hotelId };
        },
      },
    ],
    [hotelId, canConfirm, router],
  );

  return <McpReduxTools<RootState, AppDispatch> tools={tools} />;
}
