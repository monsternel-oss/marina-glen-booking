import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import roomsReducer from './slices/roomsSlice'
import bookingsReducer from './slices/bookingsSlice'
import guestsReducer from './slices/guestsSlice'
import homepageReducer from './slices/homepageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
    guests: guestsReducer,
    homepage: homepageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch