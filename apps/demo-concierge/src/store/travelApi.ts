import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOCK_FLIGHTS, MOCK_HOTELS, type Flight, type Hotel } from './mockTravelData';

export type HotelSearchArgs = {
  destination?: string;
};

export type HotelByIdArgs = { hotelId: string };

export type FlightSearchArgs = {
  origin?: string;
  destination?: string;
};

export type FlightByIdArgs = { flightId: string };

function filterHotels(destination?: string): Hotel[] {
  if (!destination?.trim()) return MOCK_HOTELS;
  const q = destination.toLowerCase();
  return MOCK_HOTELS.filter(
    (h) => h.city.toLowerCase().includes(q) || h.name.toLowerCase().includes(q),
  );
}

function filterFlights(origin?: string, destination?: string): Flight[] {
  return MOCK_FLIGHTS.filter((f) => {
    if (origin && f.origin.toLowerCase() !== origin.toLowerCase()) return false;
    if (destination && f.destination.toLowerCase() !== destination.toLowerCase()) return false;
    return true;
  });
}

export const travelApi = createApi({
  reducerPath: 'travelApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getHotels: builder.query<Hotel[], HotelSearchArgs>({
      queryFn: (args) => ({ data: filterHotels(args.destination) }),
    }),
    getHotelById: builder.query<Hotel | undefined, HotelByIdArgs>({
      queryFn: ({ hotelId }) => ({
        data: MOCK_HOTELS.find((h) => h.id === hotelId),
      }),
    }),
    getFlights: builder.query<Flight[], FlightSearchArgs>({
      queryFn: (args) => ({ data: filterFlights(args.origin, args.destination) }),
    }),
    getFlightById: builder.query<Flight | undefined, FlightByIdArgs>({
      queryFn: ({ flightId }) => ({
        data: MOCK_FLIGHTS.find((f) => f.id === flightId),
      }),
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useGetFlightsQuery,
  useGetFlightByIdQuery,
} = travelApi;
