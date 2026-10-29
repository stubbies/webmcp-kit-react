'use client';

import {
  McpReduxTools,
  McpRtkQueryTools,
  type McpReduxToolDef,
  type McpRtkQueryToolDef,
} from '@webmcp-kit/redux';
import type { UnknownAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import { travelApi } from '@/store/travelApi';
import { selectTrip } from '@/store/tripSlice';
import type { AppDispatch, RootState } from '@/store/store';

const openHotelSchema = z.object({
  hotelId: z.string().min(1),
});

export function HotelsListMcpTools() {
  const router = useRouter();
  const destination = useAppSelector((s) => selectTrip(s).search?.destination);

  const emptySchema = z.object({});

  const queryTools = useMemo(
    (): McpRtkQueryToolDef<z.infer<typeof emptySchema>>[] => [
      {
        name: 'list_hotels',
        description:
          'List hotels for the active search destination via RTK Query (read-only)',
        schema: emptySchema,
        kind: 'query' as const,
        initiate: () =>
          travelApi.endpoints.getHotels.initiate({ destination }) as unknown as UnknownAction,
      },
    ],
    [destination],
  );

  const navTools = useMemo(
    (): McpReduxToolDef<z.infer<typeof openHotelSchema>, unknown, RootState, AppDispatch>[] => [
      {
        name: 'open_hotel',
        description: 'Navigate to a hotel detail page by hotelId',
        schema: openHotelSchema,
        execute: (args) => {
          router.push(`/hotels/${encodeURIComponent(args.hotelId)}`);
          return { success: true, hotelId: args.hotelId };
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
