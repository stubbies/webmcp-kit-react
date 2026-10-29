'use client';

import { McpReduxTools, type McpReduxToolDef } from '@webmcp-kit/redux';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import {
  selectCanConfirmTrip,
  selectTrip,
  tripActions,
} from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

export function TripPageMcpTools() {
  const canConfirm = useAppSelector(selectCanConfirmTrip);

  const emptySchema = z.object({});

  const tools = useMemo(
    (): McpReduxToolDef<z.infer<typeof emptySchema>, unknown, RootState, AppDispatch>[] => [
      {
        name: 'remove_hotel',
        description: 'Remove the selected hotel from the trip',
        schema: emptySchema,
        execute: (_args, { dispatch, getState }) => {
          const had = selectTrip(getState()).selectedHotel;
          dispatch(tripActions.removeHotel());
          return { success: true, removed: Boolean(had) };
        },
      },
      {
        name: 'remove_flight',
        description: 'Remove the selected flight from the trip',
        schema: emptySchema,
        execute: (_args, { dispatch, getState }) => {
          const had = selectTrip(getState()).selectedFlight;
          dispatch(tripActions.removeFlight());
          return { success: true, removed: Boolean(had) };
        },
      },
      {
        name: 'confirm_trip',
        description: 'Confirm the trip when both hotel and flight are selected',
        schema: emptySchema,
        enabled: canConfirm,
        execute: (_args, { dispatch, getState }) => {
          if (!selectCanConfirmTrip(getState())) {
            return {
              success: false,
              error: 'Select both a hotel and a flight before confirming',
            };
          }
          dispatch(tripActions.confirmTrip());
          const trip = selectTrip(getState());
          return { success: true, confirmationId: trip.confirmationId };
        },
      },
    ],
    [canConfirm],
  );

  return <McpReduxTools<RootState, AppDispatch> tools={tools} />;
}
