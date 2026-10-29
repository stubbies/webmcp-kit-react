'use client';

import {
  McpReduxTools,
  McpRtkQueryTools,
  type McpReduxToolDef,
  type McpRtkQueryToolDef,
} from '@react-webmcp-kit/redux';
import type { UnknownAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import { travelApi } from '@/store/travelApi';
import { selectTrip } from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

const openFlightSchema = z.object({
  flightId: z.string().min(1),
});

export function FlightsListMcpTools() {
  const router = useRouter();
  const search = useAppSelector((s) => selectTrip(s).search);

  const emptySchema = z.object({});

  const queryTools = useMemo(
    (): McpRtkQueryToolDef<z.infer<typeof emptySchema>>[] => [
      {
        name: 'list_flights',
        description: 'List flights for the active search via RTK Query (read-only)',
        schema: emptySchema,
        kind: 'query' as const,
        initiate: () =>
          travelApi.endpoints.getFlights.initiate({}) as unknown as UnknownAction,
      },
    ],
    [search?.destination],
  );

  const navTools = useMemo(
    (): McpReduxToolDef<z.infer<typeof openFlightSchema>, unknown, RootState, AppDispatch>[] => [
      {
        name: 'open_flight',
        description: 'Navigate to a flight detail page by flightId',
        schema: openFlightSchema,
        execute: (args) => {
          router.push(`/flights/${encodeURIComponent(args.flightId)}`);
          return { success: true, flightId: args.flightId };
        },
      },
    ],
    [router],
  );

  return (
    <>
      <McpRtkQueryTools tools={queryTools} />
      <McpReduxTools<RootState, AppDispatch> tools={navTools} />
    </>
  );
}
