'use client';

import {
  McpReduxTools,
  McpRtkQueryTools,
  type McpReduxToolDef,
  type McpRtkQueryToolDef,
} from '@webmcp-kit/redux';
import type { UnknownAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import { MOCK_HOTELS } from '@/store/mockTravelData';
import { travelApi } from '@/store/travelApi';
import {
  selectCanAddHotel,
  selectTrip,
  tripActions,
} from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

const selectRoomSchema = z.object({
  roomId: z.string().min(1),
});

type Props = {
  hotelId: string;
};

export function HotelDetailMcpTools({ hotelId }: Props) {
  const canAdd = useAppSelector(selectCanAddHotel(hotelId));

  const emptySchema = z.object({});

  const queryTools = useMemo(
    (): McpRtkQueryToolDef<z.infer<typeof emptySchema>>[] => [
      {
        name: 'get_hotel_details',
        description: `Load hotel ${hotelId} details via RTK Query (read-only)`,
        schema: emptySchema,
        kind: 'query' as const,
        initiate: () =>
          travelApi.endpoints.getHotelById.initiate({ hotelId }) as unknown as UnknownAction,
      },
    ],
    [hotelId],
  );

  const selectRoomTool = useMemo(
    (): McpReduxToolDef<z.infer<typeof selectRoomSchema>, unknown, RootState, AppDispatch> => ({
      name: 'select_room',
      description: `Select a room at hotel ${hotelId} before adding to trip`,
      schema: selectRoomSchema,
      execute: (args, { dispatch }) => {
        dispatch(tripActions.selectRoom({ hotelId, roomId: args.roomId }));
        return { success: true, hotelId, roomId: args.roomId };
      },
    }),
    [hotelId],
  );

  const addHotelTool = useMemo(
    (): McpReduxToolDef<z.infer<typeof emptySchema>, unknown, RootState, AppDispatch> => ({
      name: 'add_hotel_to_trip',
      description: `Add hotel ${hotelId} with the selected room to the trip`,
      schema: emptySchema,
      enabled: canAdd,
      execute: (_args, { dispatch, getState }) => {
        const trip = selectTrip(getState());
        const roomId = trip.pendingRoomId;
        if (!roomId || trip.pendingRoomHotelId !== hotelId) {
          return { success: false, error: 'Select a room first with select_room' };
        }
        const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
        const room = hotel?.rooms.find((r) => r.id === roomId);
        if (!hotel || !room) {
          return { success: false, error: 'Invalid hotel or room' };
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
        return {
          success: true,
          hotelId,
          roomId,
          hotelName: hotel.name,
          roomName: room.name,
        };
      },
    }),
    [hotelId, canAdd],
  );

  return (
    <>
      <McpRtkQueryTools tools={queryTools} />
      <McpReduxTools<RootState, AppDispatch> tools={[selectRoomTool, addHotelTool]} />
    </>
  );
}
