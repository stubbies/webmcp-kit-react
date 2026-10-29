'use client';

import {
  McpReduxTools,
  McpRtkQueryTools,
  type McpReduxToolDef,
  type McpRtkQueryToolDef,
} from '@react-webmcp-kit/redux';
import type { UnknownAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { z } from 'zod';
import { MOCK_FLIGHTS } from '@/store/mockTravelData';
import { travelApi } from '@/store/travelApi';
import { tripActions } from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

type Props = {
  flightId: string;
};

export function FlightDetailMcpTools({ flightId }: Props) {
  const emptySchema = z.object({});

  const queryTools = useMemo(
    (): McpRtkQueryToolDef<z.infer<typeof emptySchema>>[] => [
      {
        name: 'get_flight_details',
        description: `Load flight ${flightId} details via RTK Query (read-only)`,
        schema: emptySchema,
        kind: 'query' as const,
        initiate: () =>
          travelApi.endpoints.getFlightById.initiate({ flightId }) as unknown as UnknownAction,
      },
    ],
    [flightId],
  );

  const mutationTools = useMemo(
    (): McpReduxToolDef<z.infer<typeof emptySchema>, unknown, RootState, AppDispatch>[] => [
      {
        name: 'add_flight_to_trip',
        description: `Add flight ${flightId} to the trip`,
        schema: emptySchema,
        execute: (_args, { dispatch }) => {
          const flight = MOCK_FLIGHTS.find((f) => f.id === flightId);
          if (!flight) {
            return { success: false, error: 'Flight not found', flightId };
          }
          dispatch(
            tripActions.addFlightToTrip({
              flightId: flight.id,
              airline: flight.airline,
              origin: flight.origin,
              destination: flight.destination,
              departAt: flight.departAt,
              price: flight.price,
            }),
          );
          return { success: true, flightId, airline: flight.airline };
        },
      },
    ],
    [flightId],
  );

  return (
    <>
      <McpRtkQueryTools tools={queryTools} />
      <McpReduxTools<RootState, AppDispatch> tools={mutationTools} />
    </>
  );
}
