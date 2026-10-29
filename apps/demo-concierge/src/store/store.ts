import { configureStore } from '@reduxjs/toolkit';
import { tripSlice } from './tripSlice';
import { travelApi } from './travelApi';

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
    [travelApi.reducerPath]: travelApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(travelApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
