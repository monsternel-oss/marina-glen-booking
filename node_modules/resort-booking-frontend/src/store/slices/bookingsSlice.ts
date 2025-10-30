import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string
  unitType: string
  unitNumber: string
  checkIn: string
  checkOut: string
  guests: string
  totalAmount: number
  status: string
  payment: string
}

interface BookingsState {
  bookings: Booking[]
  loading: boolean
  error: string | null
}

// Save bookings to localStorage
const saveBookingsToStorage = (bookings: Booking[]) => {
  try {
    localStorage.setItem('resort_bookings', JSON.stringify(bookings))
  } catch (error) {
    console.error('Failed to save bookings to storage:', error)
  }
}

// Sample bookings for initial data
const sampleBookings: Booking[] = [
  {
    id: 'B0001',
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1-555-0123',
    unitType: 'Standard Apartment',
    unitNumber: 'A101',
    checkIn: '2025-11-15',
    checkOut: '2025-11-22',
    guests: '2',
    totalAmount: 2100,
    status: 'Confirmed',
    payment: 'Paid'
  },
  {
    id: 'B0002',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.johnson@email.com',
    guestPhone: '+1-555-0456',
    unitType: 'Deluxe Villa',
    unitNumber: 'V205',
    checkIn: '2025-12-01',
    checkOut: '2025-12-08',
    guests: '4',
    totalAmount: 4200,
    status: 'Pending',
    payment: 'Pending'
  },
  {
    id: 'B0003',
    guestName: 'Michael Brown',
    guestEmail: 'michael.brown@email.com',
    guestPhone: '+1-555-0789',
    unitType: 'Standard Apartment',
    unitNumber: 'A203',
    checkIn: '2025-11-20',
    checkOut: '2025-11-25',
    guests: '2',
    totalAmount: 1500,
    status: 'Checked In',
    payment: 'Paid'
  }
]

// Load bookings from localStorage
const loadBookingsFromStorage = (): Booking[] => {
  try {
    const stored = localStorage.getItem('resort_bookings')
    if (stored) {
      return JSON.parse(stored)
    } else {
      // If no stored data, initialize with sample bookings and save them
      saveBookingsToStorage(sampleBookings)
      return sampleBookings
    }
  } catch (error) {
    console.error('Failed to load bookings from storage:', error)
    return sampleBookings
  }
}

const initialState: BookingsState = {
  bookings: loadBookingsFromStorage(),
  loading: false,
  error: null,
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload)
      saveBookingsToStorage(state.bookings)
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id)
      if (index !== -1) {
        state.bookings[index] = action.payload
        saveBookingsToStorage(state.bookings)
      }
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id)
      if (index !== -1) {
        state.bookings[index].status = action.payload.status
        saveBookingsToStorage(state.bookings)
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload)
      saveBookingsToStorage(state.bookings)
    },
    updateBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload
    }
  },
})

export const { addBooking, updateBooking, updateBookingStatus, deleteBooking, updateBookings } = bookingsSlice.actions
export default bookingsSlice.reducer