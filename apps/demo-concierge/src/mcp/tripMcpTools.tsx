'use client';

import { McpReduxTools } from '@webmcp-kit/redux';
import { z } from 'zod';
import { selectTrip, tripActions } from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

const setTravelersSchema = z.object({
  travelers: z.number().int().min(1).max(9),
});

export function TripMcpTools() {
  return (
    <McpReduxTools<RootState, AppDispatch>
      tools={[
        {
          name: 'get_trip',
          description: 'Read the current trip (travelers, search, hotel, flight, status)',
          schema: z.object({}),
          annotations: { readOnlyHint: true },
          execute: (_args, { getState }) => {
            const trip = selectTrip(getState());
            return { success: true, trip };
          },
        },
        {
          name: 'set_travelers',
          description: 'Set number of travelers (1–9)',
          schema: setTravelersSchema,
          execute: (args, { dispatch }) => {
            dispatch(tripActions.setTravelers(args.travelers));
            return { success: true, travelers: args.travelers };
          },
        },
      ]}
    />
  );
}
