import React, { useState, useEffect } from 'react'
import { useCompatRouter } from '../hooks/useCompatRouter'
import { getApiUrl } from '../utils/api'

interface Room {
  id: number
  name: string
  type: string
  price: number
  capacity: number
  amenities: string[]
  total_rooms?: number
  available_rooms?: number
  images?: string[]
  hero_image_index?: number
  image?: string
  description?: string
  pricing?: {
    high_season: number
    mid_season: number
    low_season: number
    admin_fee: number
    breakage_deposit: number
    min_stay: number
  }
  available?: boolean
}

interface BookingForm {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
  title: string
  address: string
  city: string
  zipCode: string
  country: string
}

interface SeasonPeriod {
  id: string
  startDate: string
  endDate: string
  season: 'low' | 'mid' | 'high'
  roomTypeId: number | null
}

interface AvailabilityBooking {
  id: string
  checkIn: string
  checkOut: string
  roomTypeId: number | null
  status: string
}

interface GuestReview {
  id: string
  guestName: string
  location: string
  stayLabel: string
  quote: string
  sourceType: 'booking' | 'enquiry'
  sourceLabel: string
  submittedAt: string
}

interface BookingPageSettings {
  title: string
  subtitle: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  headerBackgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  showAvailabilityCalendar: boolean
  showUnitImages: boolean
  showUnitFeatures: boolean
  showPricing: boolean
  showGuestReviews: boolean
  contactEmail: string
  contactPhone: string
  cancellationPolicy: string
  checkInTime: string
  checkOutTime: string
  welcomeMessage: string
  footerText: string
}

const defaultBookingPageSettings: BookingPageSettings = {
  title: 'Book Your Stay at Marina Glen',
  subtitle: 'Experience luxury coastal accommodation',
  primaryColor: '#3B82F6',
  accentColor: '#06B6D4',
  backgroundColor: '#F8FAFC',
  headerBackgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  buttonColor: '#3B82F6',
  buttonTextColor: '#FFFFFF',
  showAvailabilityCalendar: true,
  showUnitImages: true,
  showUnitFeatures: true,
  showPricing: true,
  showGuestReviews: true,
  contactEmail: 'bookings@marinaglen.com',
  contactPhone: '+27 46 624 1234',
  cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  welcomeMessage: 'Welcome to Marina Glen Holiday Resort! We look forward to hosting you.',
  footerText: '© 2025 Marina Glen Holiday Resort. All rights reserved.'
}

const normalizeDate = (value: string) => String(value || '').split('T')[0]

const CALENDAR_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const resolveSeasonForDate = (
  date: string,
  roomId: number | null,
  periods: SeasonPeriod[]
): 'low' | 'mid' | 'high' => {
  const normalizedDate = normalizeDate(date)

  if (roomId != null) {
    const roomSpecific = periods.find((period) =>
      period.roomTypeId === roomId &&
      normalizedDate >= period.startDate &&
      normalizedDate <= period.endDate
    )

    if (roomSpecific) {
      return roomSpecific.season
    }
  }

  const globalPeriod = periods.find((period) =>
    period.roomTypeId == null &&
    normalizedDate >= period.startDate &&
    normalizedDate <= period.endDate
  )

  return globalPeriod?.season || 'mid'
}

const BookingPageNew: React.FC = () => {
  const router = useCompatRouter()
  const roomParam = router.query.room
  const roomId = Array.isArray(roomParam) ? roomParam[0] : roomParam
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [availabilityBookings, setAvailabilityBookings] = useState<AvailabilityBooking[]>([])
  const [guestReviews, setGuestReviews] = useState<GuestReview[]>([])
  const [seasonPeriods, setSeasonPeriods] = useState<SeasonPeriod[]>([])
  const [bookingPageSettings, setBookingPageSettings] = useState<BookingPageSettings>(defaultBookingPageSettings)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [emailWarning, setEmailWarning] = useState<string | null>(null)
  const today = new Date()
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth())
  
  const [formData, setFormData] = useState<BookingForm>({
    roomId: roomId || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    title: 'Mr',
    address: '',
    city: '',
    zipCode: '',
    country: 'South Africa'
  })

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const [roomsRes, seasonsRes, bookingsRes, settingsRes, feedbackRes] = await Promise.all([
          fetch(`${getApiUrl()}/api/rooms`),
          fetch(`${getApiUrl()}/api/seasons`),
          fetch(`${getApiUrl()}/api/bookings`),
          fetch(`${getApiUrl()}/api/booking-page-settings`),
          fetch(`${getApiUrl()}/api/guest-feedback`)
        ])

        const roomsJson = await roomsRes.json()
        if (roomsJson.success && Array.isArray(roomsJson.data)) {
          const mapped: Room[] = roomsJson.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            capacity: r.capacity,
            description: r.description || '',
            amenities: r.amenities || [],
            images: r.images || [],
            hero_image_index: r.hero_image_index ?? 0,
            image: (r.images && r.images[r.hero_image_index ?? 0]) || (r.images && r.images[0]) || undefined,
            price: r.pricing?.low_season ?? r.price ?? 0,
            pricing: r.pricing,
            available: r.available !== false,
            available_rooms: r.available_rooms,
            total_rooms: r.total_rooms,
          }))
          setRooms(mapped)
          if (roomId) {
            const room = mapped.find(r => r.id === parseInt(roomId))
            if (room) {
              setSelectedRoom(room)
              setFormData(prev => ({ ...prev, roomId: roomId }))
            }
          }
        }

        const seasonsJson = await seasonsRes.json()
        if (seasonsJson.success && Array.isArray(seasonsJson.data)) {
          const mappedSeasons: SeasonPeriod[] = seasonsJson.data.map((row: any) => ({
            id: String(row.id ?? ''),
            startDate: normalizeDate(String(row.start_date ?? '')),
            endDate: normalizeDate(String(row.end_date ?? '')),
            season: row.season,
            roomTypeId: row.room_type_id == null ? null : Number(row.room_type_id),
          }))
          setSeasonPeriods(mappedSeasons)
        }

        const bookingsJson = await bookingsRes.json()
        if (bookingsJson.success && Array.isArray(bookingsJson.data)) {
          const mappedBookings: AvailabilityBooking[] = bookingsJson.data
            .filter((row: any) => String(row.status || '').toLowerCase() !== 'cancelled')
            .map((row: any) => ({
              id: String(row.booking_reference ?? row.id),
              checkIn: normalizeDate(String(row.check_in ?? '')),
              checkOut: normalizeDate(String(row.check_out ?? '')),
              roomTypeId: row.room_type_id == null ? null : Number(row.room_type_id),
              status: String(row.status || ''),
            }))
          setAvailabilityBookings(mappedBookings)
        }

        const settingsJson = await settingsRes.json()
        if (settingsJson.success && settingsJson.data) {
          setBookingPageSettings({
            ...defaultBookingPageSettings,
            ...settingsJson.data
          })
        }

        const feedbackJson = await feedbackRes.json()
        if (feedbackJson.success && Array.isArray(feedbackJson.data)) {
          setGuestReviews(feedbackJson.data.map((entry: any) => ({
            id: String(entry.id ?? ''),
            guestName: String(entry.guestName ?? 'Guest'),
            location: String(entry.location ?? 'Marina Glen guest'),
            stayLabel: String(entry.stayLabel ?? 'Marina Glen stay'),
            quote: String(entry.quote ?? ''),
            sourceType: entry.sourceType === 'booking' ? 'booking' : 'enquiry',
            sourceLabel: String(entry.sourceLabel ?? 'Guest feedback'),
            submittedAt: String(entry.submittedAt ?? new Date().toISOString()),
          })))
        }
      } catch (err) {
        console.error('Failed to load reservation data:', err)
      }
    }

    void fetchReservationData()
  }, [roomId])

  const currentSeason = selectedRoom && formData.checkIn
    ? resolveSeasonForDate(formData.checkIn, selectedRoom.id, seasonPeriods)
    : 'mid'

  const getSeasonalRoomRate = (room: Room) => {
    switch (currentSeason) {
      case 'high':
        return room.pricing?.high_season ?? room.price ?? 0
      case 'low':
        return room.pricing?.low_season ?? room.price ?? 0
      default:
        return room.pricing?.mid_season ?? room.price ?? 0
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setFormData(prev => ({ ...prev, roomId: room.id.toString() }))
  }

  const getBookingBreakdown = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) {
      return {
        nights: 0,
        roomRate: 0,
        subtotal: 0,
        adminFee: 0,
        breakageDeposit: 0,
        total: 0,
      }
    }

    const nights = Math.max(
      0,
      Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))
    )
    const roomRate = getSeasonalRoomRate(selectedRoom)
    const subtotal = roomRate * nights
    const adminFee = selectedRoom.pricing?.admin_fee ?? 0
    const breakageDeposit = selectedRoom.pricing?.breakage_deposit ?? 0

    return {
      nights,
      roomRate,
      subtotal,
      adminFee,
      breakageDeposit,
      total: subtotal + adminFee + breakageDeposit,
    }
  }

  const calculateTotal = () => {
    return getBookingBreakdown().total
  }

  const totalInventory = selectedRoom?.total_rooms ?? rooms.reduce((sum, room) => sum + (room.total_rooms ?? 0), 0)

  const getBookedRoomsForDay = (dateKey: string) => {
    return availabilityBookings.filter((booking) => {
      if (selectedRoom && booking.roomTypeId !== selectedRoom.id) {
        return false
      }

      if (!booking.checkIn || !booking.checkOut) {
        return false
      }

      return booking.checkIn <= dateKey && booking.checkOut > dateKey
    }).length
  }

  const isRequestedDate = (dateKey: string) => {
    if (!formData.checkIn) {
      return false
    }

    if (!formData.checkOut) {
      return formData.checkIn === dateKey
    }

    return formData.checkIn <= dateKey && formData.checkOut > dateKey
  }

  const calendarFirstDay = new Date(calendarYear, calendarMonth, 1)
  const calendarLastDay = new Date(calendarYear, calendarMonth + 1, 0)
  const calendarStartOffset = calendarFirstDay.getDay()
  const calendarDaysInMonth = calendarLastDay.getDate()
  const calendarCells: Array<number | null> = [
    ...Array(calendarStartOffset).fill(null),
    ...Array.from({ length: calendarDaysInMonth }, (_, index) => index + 1),
  ]

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null)
  }

  const calendarMonthLabel = new Date(calendarYear, calendarMonth, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  const goToPreviousCalendarMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear((value) => value - 1)
      return
    }

    setCalendarMonth((value) => value - 1)
  }

  const goToNextCalendarMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear((value) => value + 1)
      return
    }

    setCalendarMonth((value) => value + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!selectedRoom) {
        throw new Error('Please select a room before submitting your booking.')
      }

      const pricing = getBookingBreakdown()
      const totalAmount = pricing.total
      const bookingReference = `MG${Date.now()}`

      const paymentParams = new URLSearchParams({
        bookingReference,
        roomId: String(selectedRoom.id),
        room: selectedRoom.name,
        roomType: selectedRoom.type,
        checkin: formData.checkIn,
        checkout: formData.checkOut,
        guests: String(formData.guests),
        amount: String(totalAmount),
        baseRate: String(pricing.roomRate),
        adminFee: String(pricing.adminFee),
        breakageDeposit: String(pricing.breakageDeposit),
        specialRequests: formData.specialRequests || '',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        confirmationNumber: bookingReference
      })

      await router.push(`/booking-system/payment?${paymentParams.toString()}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error submitting booking. Please try again.'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="booking-form-theme min-h-screen bg-transparent" style={{ backgroundColor: bookingPageSettings.backgroundColor }}>
      {/* VikBookings-style Header */}
      <div className="booking-shell-card overflow-hidden border border-white/30 px-6 py-7 sm:px-8" style={{ backgroundColor: bookingPageSettings.headerBackgroundColor }}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Reservation Desk</p>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: bookingPageSettings.primaryColor }}>{bookingPageSettings.title}</h1>
              <div className="flex items-center" style={{ color: bookingPageSettings.accentColor }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{bookingPageSettings.subtitle}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <div className="flex items-center rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-emerald-700 shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center rounded-2xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sky-700 shadow-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-sm font-medium">Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VikBookings-style Progress Bar */}
        <div className="mb-8">
          <div className="booking-shell-card p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-4 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <div>
                  <div className="font-bold text-lg">Room & Dates</div>
                  <div className="text-sm text-gray-500">Select your accommodation</div>
                </div>
              </div>
              
              <div className={`hidden sm:block w-24 h-2 rounded-full ${step >= 2 ? 'bg-gray-300' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center space-x-4 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 2 ? '✓' : '2'}
                </div>
                <div>
                  <div className="font-bold text-lg">Guest Details</div>
                  <div className="text-sm text-gray-500">Your information</div>
                </div>
              </div>
              
              <div className={`hidden sm:block w-24 h-2 rounded-full ${step >= 3 ? 'bg-gray-300' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center space-x-4 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step >= 3 ? '✓' : '3'}
                </div>
                <div>
                  <div className="font-bold text-lg">Confirmation</div>
                  <div className="text-sm text-gray-500">Booking complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Room & Dates */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Date & Guest Selection */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">1</span>
                    When would you like to stay?
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Check-in Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg group-hover:border-blue-300"
                          required
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Check-out Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg group-hover:border-blue-300"
                          required
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-700 mb-3">Number of Guests</label>
                      <div className="relative">
                        <select
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg appearance-none group-hover:border-blue-300"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm" style={{ color: bookingPageSettings.textColor }}>
                    <div><strong>Check-in:</strong> {bookingPageSettings.checkInTime}</div>
                    <div><strong>Check-out:</strong> {bookingPageSettings.checkOutTime}</div>
                    <div><strong>Cancellation:</strong> {bookingPageSettings.cancellationPolicy}</div>
                  </div>
                </div>

                {bookingPageSettings.showAvailabilityCalendar && (
                  <div data-testid="availability-calendar-section" className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Availability Calendar</h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Live room availability for {selectedRoom ? selectedRoom.name : 'all accommodation types'}.
                          {selectedRoom ? ' Change your selected unit below to compare availability.' : ' Select a unit below to narrow the calendar to one accommodation type.'}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Available</div>
                          <div className="mt-1 text-2xl font-bold text-emerald-800">{Math.max(totalInventory - getBookedRoomsForDay(formatDateKey(new Date())), 0)}</div>
                          <div className="text-xs text-emerald-700">Rooms open today</div>
                        </div>
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Booked</div>
                          <div className="mt-1 text-2xl font-bold text-amber-800">{getBookedRoomsForDay(formatDateKey(new Date()))}</div>
                          <div className="text-xs text-amber-700">Rooms occupied today</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Inventory</div>
                          <div className="mt-1 text-2xl font-bold text-slate-800">{totalInventory}</div>
                          <div className="text-xs text-slate-600">Total rooms in view</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        Available
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                        Fully booked
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                        Your selected stay dates
                      </span>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                        <button
                          type="button"
                          onClick={goToPreviousCalendarMonth}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                        >
                          ◀ Prev
                        </button>
                        <div className="text-lg font-bold text-slate-900">{calendarMonthLabel}</div>
                        <button
                          type="button"
                          onClick={goToNextCalendarMonth}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
                        >
                          Next ▶
                        </button>
                      </div>

                      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                        {CALENDAR_DAYS.map((day) => (
                          <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 bg-white">
                        {calendarCells.map((day, index) => {
                          if (day == null) {
                            return <div key={`empty-${index}`} className="min-h-[110px] border-b border-r border-slate-100 bg-slate-50/60" />
                          }

                          const currentDate = new Date(calendarYear, calendarMonth, day)
                          const dateKey = formatDateKey(currentDate)
                          const bookedRooms = getBookedRoomsForDay(dateKey)
                          const availableRooms = Math.max(totalInventory - bookedRooms, 0)
                          const isFull = totalInventory > 0 && availableRooms === 0
                          const isToday = formatDateKey(currentDate) === formatDateKey(new Date())
                          const isRequested = isRequestedDate(dateKey)

                          return (
                            <div
                              key={dateKey}
                              className={`min-h-[110px] border-b border-r border-slate-100 p-3 transition-colors ${
                                isRequested ? 'bg-sky-50' : isFull ? 'bg-rose-50/70' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                  isToday ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {day}
                                </div>
                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                  isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {isFull ? 'Full' : 'Open'}
                                </span>
                              </div>

                              <div className="mt-4 space-y-1.5">
                                <div className="text-lg font-bold text-slate-900">{availableRooms}</div>
                                <div className="text-xs font-medium text-slate-600">rooms available</div>
                                <div className="text-xs text-slate-500">{bookedRooms} booked</div>
                                {isRequested && (
                                  <div className="pt-1 text-[11px] font-semibold text-sky-700">Selected stay</div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Room Selection */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Accommodation</h3>
                  <div className="space-y-6">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`border-3 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          selectedRoom?.id === room.id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl transform scale-105'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {bookingPageSettings.showUnitImages && room.image && (
                              <div className="mb-5 overflow-hidden rounded-2xl border border-blue-100 shadow-sm">
                                <img
                                  src={room.image}
                                  alt={room.name}
                                  className="h-56 w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center mb-4">
                              <h4 className="text-2xl font-bold text-gray-900">{room.name}</h4>
                              {selectedRoom?.id === room.id && (
                                <div className="ml-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 text-lg mb-4">{room.description}</p>
                            <div className="flex items-center mb-4 text-gray-600">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="font-medium">Sleeps up to {room.capacity} guests</span>
                            </div>
                            {bookingPageSettings.showUnitFeatures && (
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {bookingPageSettings.showPricing && (
                            <div className="text-right ml-8">
                              <div className="text-4xl font-bold" style={{ color: bookingPageSettings.primaryColor }}>R{getSeasonalRoomRate(room).toLocaleString()}</div>
                              <div className="text-lg text-gray-500 font-medium">per night</div>
                              {formData.checkIn && formData.checkOut && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="text-sm text-gray-600 font-medium">
                                    {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))} nights
                                  </div>
                                  <div className="text-sm font-semibold uppercase" style={{ color: bookingPageSettings.accentColor }}>
                                    {currentSeason} season
                                  </div>
                                  <div className="text-xl font-bold" style={{ color: bookingPageSettings.primaryColor }}>
                                    R{(getSeasonalRoomRate(room) * Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))).toLocaleString()} total
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRoom || !formData.checkIn || !formData.checkOut}
                    className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    Continue to Guest Details →
                  </button>
                </div>

                {bookingPageSettings.showGuestReviews && (
                  <div data-testid="guest-reviews-section" className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-xl">
                    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.94))] px-8 py-10 sm:px-10">
                      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Guest Feedback</p>
                          <h3 className="mt-3 text-3xl font-bold">Real feedback pulled from stored bookings and enquiry messages</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            This section only displays guest-written content already captured in the system and approved for public display, so it reflects actual reservation notes and enquiry messages rather than hard-coded testimonials.
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[20rem]">
                          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Live feedback items</div>
                            <div className="mt-2 text-4xl font-bold">{guestReviews.length}</div>
                            <div className="mt-1 text-sm text-slate-300">Visible guest-written messages in the current feed</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Feed source</div>
                            <div className="mt-2 text-lg font-bold">Bookings and enquiries</div>
                            <div className="mt-1 text-sm text-slate-300">The API only returns approved and featured entries from reservation notes and stored enquiry messages.</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-5 xl:grid-cols-3">
                        {guestReviews.length > 0 ? guestReviews.map((review) => (
                          <article key={review.id} className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="text-lg font-bold text-white">{review.guestName}</div>
                                <div className="text-sm text-slate-300">{review.location} • {review.stayLabel}</div>
                              </div>
                              <div className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100">
                                {review.sourceLabel}
                              </div>
                            </div>
                            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              {new Date(review.submittedAt).toLocaleDateString()} • {review.sourceType === 'booking' ? 'Reservation note' : 'Enquiry message'}
                            </div>
                            <p className="mt-5 text-sm leading-7 text-slate-200">“{review.quote}”</p>
                          </article>
                        )) : (
                          <div className="xl:col-span-3 rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                            <div className="text-lg font-bold text-white">No guest feedback is available yet</div>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                              Once guests submit enquiry messages or reservation notes with meaningful detail, this section will begin showing them automatically.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Guest Details (VikBookings style form) */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">2</span>
                  Guest Information
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Details Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                        <select
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div className="md:col-span-1.5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="md:col-span-1.5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+27 82 123 4567"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Address Information
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="Cape Town"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code *</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="8001"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            required
                          >
                            <option value="South Africa">South Africa</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Special Requests
                    </h3>
                    
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder="Let us know about any special requirements, dietary preferences, accessibility needs, celebration occasions, etc."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-6 pt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-2 border-gray-200"
                    >
                      ← Back to Room Selection
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 disabled:opacity-60 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                      style={{ backgroundColor: bookingPageSettings.buttonColor, color: bookingPageSettings.buttonTextColor }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Booking...
                        </span>
                      ) : (
                        'Complete Booking →'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: VikBookings-style Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                <p className="text-xl text-gray-600 mb-2">
                  Thank you for choosing Marina Glen Holiday Resort
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  {emailWarning
                    ? 'Booking is confirmed, but there was an issue sending the guest confirmation email.'
                    : <>Confirmation emails have been sent to <strong className="text-blue-600">{formData.email}</strong></>}
                </p>

                {emailWarning && (
                  <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left">
                    <h3 className="mb-1 font-semibold text-amber-900">Email Delivery Warning</h3>
                    <p className="text-amber-800">{emailWarning}</p>
                  </div>
                )}
                
                <div className="bg-blue-50 rounded-xl p-8 mb-8 text-left border border-blue-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-6">Booking Summary:</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Guest:</span>
                      <span className="font-bold">{formData.title} {formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Accommodation:</span>
                      <span className="font-bold">{selectedRoom?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Check-in:</span>
                      <span className="font-bold">{new Date(formData.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Check-out:</span>
                      <span className="font-bold">{new Date(formData.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Accommodation Subtotal:</span>
                      <span className="font-bold">R{getBookingBreakdown().subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Admin Fee:</span>
                      <span className="font-bold">R{getBookingBreakdown().adminFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-200">
                      <span className="font-medium">Breakage Deposit:</span>
                      <span className="font-bold">R{getBookingBreakdown().breakageDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 bg-blue-100 rounded-lg px-4">
                      <span className="font-bold text-lg">Total Amount:</span>
                      <span className="font-bold text-2xl text-blue-600">R{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setStep(1)
                    setFormData({
                      roomId: '',
                      checkIn: '',
                      checkOut: '',
                      guests: 1,
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      specialRequests: '',
                      title: 'Mr',
                      address: '',
                      city: '',
                      zipCode: '',
                      country: 'South Africa'
                    })
                    setSelectedRoom(null)
                    setEmailWarning(null)
                  }}
                  className="px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: bookingPageSettings.buttonColor, color: bookingPageSettings.buttonTextColor }}
                >
                  Make Another Booking
                </button>
              </div>
            )}
          </div>

          {/* VikBookings-style Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 sticky top-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
                <h3 className="text-xl font-bold">Booking Summary</h3>
                <p className="text-blue-100 text-sm">Your reservation details</p>
              </div>
              
              <div className="p-6">
                {selectedRoom ? (
                  <div className="space-y-6">
                    {/* Room Info */}
                    <div className="border-b border-gray-100 pb-6">
                      <h4 className="font-bold text-xl text-gray-900">{selectedRoom.name}</h4>
                      <p className="text-blue-600 font-medium">{selectedRoom.type}</p>
                      <div className="flex items-center text-gray-600 mt-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">{formData.guests} guest{formData.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    {/* Date Info */}
                    {formData.checkIn && formData.checkOut && (
                      <div className="border-b border-gray-100 pb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Check-in</span>
                            <span className="font-bold">{new Date(formData.checkIn).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Check-out</span>
                            <span className="font-bold">{new Date(formData.checkOut).toLocaleDateString()}</span>
                          </div>
                          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-200">
                            <div className="text-center">
                              <div className="font-bold text-lg">
                                {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))} Night{Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24)) > 1 ? 's' : ''}
                              </div>
                              <div className="text-sm">Duration of stay</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Price Breakdown */}
                    {bookingPageSettings.showPricing && formData.checkIn && formData.checkOut && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">Price Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room rate (per night)</span>
                            <span className="font-medium">R{getBookingBreakdown().roomRate.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Season applied</span>
                            <span className="font-medium uppercase">{currentSeason} season</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Number of nights</span>
                            <span className="font-medium">×{getBookingBreakdown().nights}</span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Accommodation subtotal</span>
                            <span className="font-medium">R{getBookingBreakdown().subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Admin Fee</span>
                            <span className="font-medium">R{getBookingBreakdown().adminFee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Breakage Deposit</span>
                            <span className="font-medium">R{getBookingBreakdown().breakageDeposit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Taxes & service fees</span>
                            <span>Included</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-gray-900">Total Amount</span>
                              <span className="text-2xl font-bold text-blue-600">R{calculateTotal().toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="font-medium">Select your room and dates</p>
                    <p className="text-sm">to see pricing details</p>
                  </div>
                )}
                
                {/* Contact & Security Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm" style={{ color: bookingPageSettings.textColor }}>
                    {bookingPageSettings.welcomeMessage}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-4">Need Assistance?</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{bookingPageSettings.contactPhone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{bookingPageSettings.contactEmail}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>17 Mars Road, Marina Beach, KZN</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center text-green-600 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">256-bit SSL Secure Booking</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4 text-center text-xs" style={{ color: bookingPageSettings.textColor }}>
                    {bookingPageSettings.footerText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPageNew