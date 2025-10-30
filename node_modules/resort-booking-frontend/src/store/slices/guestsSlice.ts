import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  totalBookings: number
  totalSpent: number
  lastVisit: string
  status: 'Active' | 'Inactive'
  preferences?: string
  notes?: string
  createdAt: string
}

interface GuestsState {
  guests: Guest[]
  loading: boolean
  error: string | null
}

const initialState: GuestsState = {
  guests: [],
  loading: false,
  error: null,
}

const guestsSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {
    addGuest: (state, action: PayloadAction<Guest>) => {
      // Check if guest already exists by email
      const existingGuest = state.guests.find(guest => guest.email === action.payload.email)
      if (!existingGuest) {
        state.guests.push(action.payload)
      }
    },
    updateGuest: (state, action: PayloadAction<Guest>) => {
      const index = state.guests.findIndex(guest => guest.id === action.payload.id)
      if (index !== -1) {
        state.guests[index] = action.payload
      }
    },
    updateGuestBookingStats: (state, action: PayloadAction<{ email: string; bookingAmount: number; bookingDate: string }>) => {
      const guest = state.guests.find(guest => guest.email === action.payload.email)
      if (guest) {
        guest.totalBookings += 1
        guest.totalSpent += action.payload.bookingAmount
        guest.lastVisit = action.payload.bookingDate
      }
    },
    deleteGuest: (state, action: PayloadAction<string>) => {
      state.guests = state.guests.filter(guest => guest.id !== action.payload)
    },
    updateGuests: (state, action: PayloadAction<Guest[]>) => {
      state.guests = action.payload
    }
  },
})

export const { addGuest, updateGuest, updateGuestBookingStats, deleteGuest, updateGuests } = guestsSlice.actions
export default guestsSlice.reducer