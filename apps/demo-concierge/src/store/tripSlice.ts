import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SearchCriteria = {
  destination: string;
  checkIn: string;
  checkOut: string;
};

export type SelectedHotel = {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  pricePerNight: number;
};

export type SelectedFlight = {
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  departAt: string;
  price: number;
};

export type TripState = {
  travelers: number;
  search: SearchCriteria | null;
  pendingRoomId: string | null;
  pendingRoomHotelId: string | null;
  selectedHotel: SelectedHotel | null;
  selectedFlight: SelectedFlight | null;
  tripStatus: 'draft' | 'confirmed';
  confirmationId: string | null;
};

const initialState: TripState = {
  travelers: 1,
  search: null,
  pendingRoomId: null,
  pendingRoomHotelId: null,
  selectedHotel: null,
  selectedFlight: null,
  tripStatus: 'draft',
  confirmationId: null,
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTravelers(state, action: PayloadAction<number>) {
      state.travelers = Math.max(1, Math.min(9, action.payload));
    },
    setSearch(state, action: PayloadAction<SearchCriteria>) {
      state.search = action.payload;
      state.selectedHotel = null;
      state.selectedFlight = null;
      state.pendingRoomId = null;
      state.pendingRoomHotelId = null;
      state.tripStatus = 'draft';
      state.confirmationId = null;
    },
    selectRoom(
      state,
      action: PayloadAction<{ hotelId: string; roomId: string }>,
    ) {
      state.pendingRoomHotelId = action.payload.hotelId;
      state.pendingRoomId = action.payload.roomId;
    },
    clearPendingRoom(state) {
      state.pendingRoomId = null;
      state.pendingRoomHotelId = null;
    },
    addHotelToTrip(state, action: PayloadAction<SelectedHotel>) {
      state.selectedHotel = action.payload;
      state.pendingRoomId = null;
      state.pendingRoomHotelId = null;
    },
    removeHotel(state) {
      state.selectedHotel = null;
      state.pendingRoomId = null;
      state.pendingRoomHotelId = null;
    },
    addFlightToTrip(state, action: PayloadAction<SelectedFlight>) {
      state.selectedFlight = action.payload;
    },
    removeFlight(state) {
      state.selectedFlight = null;
    },
    confirmTrip(state) {
      state.tripStatus = 'confirmed';
      state.confirmationId = `TRIP-${Date.now().toString(36).toUpperCase()}`;
    },
  },
});

export const tripActions = tripSlice.actions;

export const selectTrip = (state: { trip: TripState }) => state.trip;

export const selectCanConfirmTrip = (state: { trip: TripState }) =>
  state.trip.selectedHotel !== null &&
  state.trip.selectedFlight !== null &&
  state.trip.tripStatus === 'draft';

export const selectPendingRoomForHotel =
  (hotelId: string) => (state: { trip: TripState }) =>
    state.trip.pendingRoomHotelId === hotelId ? state.trip.pendingRoomId : null;

export const selectCanAddHotel =
  (hotelId: string) => (state: { trip: TripState }) =>
    state.trip.pendingRoomHotelId === hotelId && state.trip.pendingRoomId !== null;
