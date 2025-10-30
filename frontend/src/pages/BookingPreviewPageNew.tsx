import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { addBooking, updateBooking, type Booking } from '../store/slices/bookingsSlice'
import { addGuest } from '../store/slices/guestsSlice'
import { getSeasonForDate } from '../store/slices/roomsSlice'

interface BookingFormData {
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
  specialRequests?: string
}

interface PricingBreakdown {
  baseRate: number
  nights: number
  subtotal: number
  adminFee: number
  breakageDeposit: number
  total: number
}

const BookingPreviewPageNew: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const bookingId = searchParams.get('id')
  const mode = searchParams.get('mode') || 'view' // 'view', 'edit', 'create'
  
  const { bookings } = useAppSelector((state) => state.bookings)
  const { unitRates, seasonalCalendar } = useAppSelector((state) => state.rooms)
  
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'create')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<BookingFormData>({
    id: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    unitType: '',
    unitNumber: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    totalAmount: 0,
    status: 'Pending',
    payment: 'Pending',
    specialRequests: ''
  })
  
  const [breakdown, setBreakdown] = useState<PricingBreakdown>({
    baseRate: 0,
    nights: 0,
    subtotal: 0,
    adminFee: 0,
    breakageDeposit: 0,
    total: 0
  })

  // Calculate pricing breakdown
  const calculatePricing = (checkIn: string, checkOut: string, unitType: string, adminFee?: number, breakageDeposit?: number) => {
    if (!checkIn || !checkOut || !unitType) return

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24))
    
    if (nights <= 0) return

    const unitRate = unitRates.find(rate => rate.unitType === unitType)
    
    // Get the season for the check-in date to determine the rate
    const season = getSeasonForDate(checkIn, unitType, seasonalCalendar)
    let baseRate = unitRate?.midSeasonRate || 150
    
    // Apply seasonal rate
    switch (season) {
      case 'high':
        baseRate = unitRate?.highSeasonRate || baseRate
        break
      case 'low':
        baseRate = unitRate?.lowSeasonRate || baseRate
        break
      default: // 'mid'
        baseRate = unitRate?.midSeasonRate || baseRate
        break
    }
    
    const currentAdminFee = adminFee !== undefined ? adminFee : (breakdown.adminFee || unitRate?.adminFee || 50)
    const currentBreakageDeposit = breakageDeposit !== undefined ? breakageDeposit : (breakdown.breakageDeposit || unitRate?.breakageDeposit || 100)
    
    const subtotal = baseRate * nights
    const total = subtotal + currentAdminFee + currentBreakageDeposit

    const newBreakdown = {
      baseRate,
      nights,
      subtotal,
      adminFee: currentAdminFee,
      breakageDeposit: currentBreakageDeposit,
      total
    }

    setBreakdown(newBreakdown)
    setFormData(prev => ({ ...prev, totalAmount: total }))
  }

  // Handle admin fee change
  const handleAdminFeeChange = (newAdminFee: number) => {
    const updatedTotal = breakdown.subtotal + newAdminFee + breakdown.breakageDeposit
    setBreakdown(prev => ({
      ...prev,
      adminFee: newAdminFee,
      total: updatedTotal
    }))
    setFormData(prev => ({ ...prev, totalAmount: updatedTotal }))
  }

  // Handle breakage deposit change
  const handleBreakageDepositChange = (newBreakageDeposit: number) => {
    const updatedTotal = breakdown.subtotal + breakdown.adminFee + newBreakageDeposit
    setBreakdown(prev => ({
      ...prev,
      breakageDeposit: newBreakageDeposit,
      total: updatedTotal
    }))
    setFormData(prev => ({ ...prev, totalAmount: updatedTotal }))
  }

  // Generate new booking ID
  const generateBookingId = () => {
    const lastId = bookings.length > 0 
      ? Math.max(...bookings.map(b => parseInt(b.id.replace('B', '')) || 0))
      : 0
    return `B${String(lastId + 1).padStart(4, '0')}`
  }

  useEffect(() => {
    const loadBookingData = async () => {
      if (mode === 'create') {
        // Initialize for new booking
        setFormData(prev => ({
          ...prev,
          id: generateBookingId(),
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
        }))
        setLoading(false)
        return
      }

      if (!bookingId) {
        setLoading(false)
        return
      }

      // Load existing booking for view/edit mode
      let foundBooking = bookings.find(b => b.id === bookingId)
      
      if (!foundBooking) {
        try {
          // Try to load from localStorage with multiple possible keys
          const possibleKeys = ['resort_bookings', 'marinaglen-bookings', 'bookings']
          for (const key of possibleKeys) {
            const storedBookings = localStorage.getItem(key)
            if (storedBookings) {
              const parsedBookings = JSON.parse(storedBookings)
              foundBooking = parsedBookings.find((b: any) => b.id === bookingId)
              if (foundBooking) {
                console.log(`Found booking in localStorage with key: ${key}`)
                break
              }
            }
          }
          
          // Try to load from a temporary booking storage (for new bookings)
          if (!foundBooking) {
            const tempBookingData = localStorage.getItem(`temp_booking_${bookingId}`)
            if (tempBookingData) {
              try {
                const parsed = JSON.parse(tempBookingData)
                // Check if the temp data has the new structure with expiration
                if (parsed.booking && parsed.expires) {
                  if (Date.now() < parsed.expires) {
                    foundBooking = parsed.booking
                    console.log('Found booking in temporary storage (new format)')
                  } else {
                    // Remove expired temp booking
                    localStorage.removeItem(`temp_booking_${bookingId}`)
                    console.log('Removed expired temporary booking')
                  }
                } else {
                  // Old format - just the booking data
                  foundBooking = parsed
                  console.log('Found booking in temporary storage (old format)')
                }
              } catch (error) {
                console.error('Error parsing temporary booking data:', error)
                localStorage.removeItem(`temp_booking_${bookingId}`)
              }
            }
          }
        } catch (error) {
          console.error('Failed to load booking from storage:', error)
        }
      }

      if (foundBooking) {
        setFormData({
          id: foundBooking.id,
          guestName: foundBooking.guestName,
          guestEmail: foundBooking.guestEmail,
          guestPhone: foundBooking.guestPhone,
          unitType: foundBooking.unitType,
          unitNumber: foundBooking.unitNumber,
          checkIn: foundBooking.checkIn,
          checkOut: foundBooking.checkOut,
          guests: foundBooking.guests,
          totalAmount: foundBooking.totalAmount,
          status: foundBooking.status,
          payment: foundBooking.payment,
          specialRequests: ''
        })
        calculatePricing(foundBooking.checkIn, foundBooking.checkOut, foundBooking.unitType)
      }
      setLoading(false)
    }

    loadBookingData()
  }, [bookingId, mode, bookings, unitRates])

  // Handle form input changes
  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Recalculate pricing when relevant fields change
    if (field === 'checkIn' || field === 'checkOut' || field === 'unitType') {
      const newData = { ...formData, [field]: value }
      calculatePricing(newData.checkIn, newData.checkOut, newData.unitType, breakdown.adminFee, breakdown.breakageDeposit)
    }
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required'
    if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) newErrors.guestEmail = 'Invalid email format'
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone number is required'
    if (!formData.unitType) newErrors.unitType = 'Unit type is required'
    if (!formData.unitNumber.trim()) newErrors.unitNumber = 'Unit number is required'
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required'
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required'
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      newErrors.checkOut = 'Check-out must be after check-in'
    }
    if (!formData.guests || parseInt(formData.guests) < 1) {
      newErrors.guests = 'Number of guests must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save booking
  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const bookingData: Booking = {
        id: formData.id,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        unitType: formData.unitType,
        unitNumber: formData.unitNumber,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        totalAmount: formData.totalAmount,
        status: formData.status,
        payment: formData.payment
      }

      if (mode === 'create') {
        dispatch(addBooking(bookingData))
        
        // Save to temporary storage for new window access (expires in 1 hour)
        const tempData = {
          booking: bookingData,
          timestamp: Date.now(),
          expires: Date.now() + (60 * 60 * 1000) // 1 hour
        }
        localStorage.setItem(`temp_booking_${bookingData.id}`, JSON.stringify(tempData))
        
        // Add guest to guest management
        dispatch(addGuest({
          id: `G${Date.now()}`,
          name: formData.guestName,
          email: formData.guestEmail,
          phone: formData.guestPhone,
          totalBookings: 1,
          totalSpent: formData.totalAmount,
          lastVisit: formData.checkIn,
          status: 'Active' as const,
          createdAt: new Date().toISOString()
        }))
      } else {
        dispatch(updateBooking(bookingData))
        
        // Update temporary storage (expires in 1 hour)
        const tempData = {
          booking: bookingData,
          timestamp: Date.now(),
          expires: Date.now() + (60 * 60 * 1000) // 1 hour
        }
        localStorage.setItem(`temp_booking_${bookingData.id}`, JSON.stringify(tempData))
      }

      alert(`Booking ${mode === 'create' ? 'created' : 'updated'} successfully!`)
      navigate('/admin')
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Failed to save booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const printBooking = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (mode !== 'create' && !formData.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-4">
            {bookingId ? `Booking ID "${bookingId}" could not be found.` : 'No booking ID provided.'}
          </p>
          <div className="text-sm text-gray-500 mb-4 bg-gray-100 p-3 rounded">
            <p><strong>Debug Info:</strong></p>
            <p>Mode: {mode}</p>
            <p>Booking ID: {bookingId || 'None'}</p>
            <p>Redux Bookings: {bookings.length}</p>
            <p>localStorage Keys: {Object.keys(localStorage).filter(k => k.includes('booking')).join(', ') || 'None'}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            This may happen if the booking was recently deleted or if there's a data synchronization issue.
          </p>
          <div className="space-x-2">
            <button 
              onClick={() => navigate('/admin')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Admin Dashboard
            </button>
            <button 
              onClick={() => navigate('/booking-preview-new?mode=create')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Booking
            </button>
          </div>
        </div>
      </div>
    )
  }

  const availableUnitTypes = unitRates.map(rate => rate.unitType)

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:shadow-none print:border-b-2 print:border-gray-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'Create New Booking' : 
                 mode === 'edit' ? 'Edit Booking' : 'Booking Details'}
              </h1>
              <p className="text-gray-600 mt-1">Marina Glen Holiday Resort</p>
            </div>
            <div className="flex space-x-3 print:hidden">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={printBooking}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🖨️ Print
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? '💾 Saving...' : '💾 Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setErrors({})
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ❌ Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => navigate('/admin')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Booking Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {isEditing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <div className={`px-3 py-2 rounded-md border font-medium ${
                      formData.status === 'Confirmed' ? 'bg-green-50 border-green-200 text-green-800' :
                      formData.status === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      formData.status === 'Checked In' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                      formData.status === 'Checked Out' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                      'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {formData.status}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => handleInputChange('guestName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.guestName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter guest name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.guestName}
                    </div>
                  )}
                  {errors.guestName && <p className="text-red-500 text-sm mt-1">{errors.guestName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.guests ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.guests}
                    </div>
                  )}
                  {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.guestEmail ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="guest@email.com"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.guestEmail}
                    </div>
                  )}
                  {errors.guestEmail && <p className="text-red-500 text-sm mt-1">{errors.guestEmail}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.guestPhone}
                      onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.guestPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+1-555-0123"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.guestPhone}
                    </div>
                  )}
                  {errors.guestPhone && <p className="text-red-500 text-sm mt-1">{errors.guestPhone}</p>}
                </div>
              </div>
            </div>

            {/* Accommodation Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accommodation Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
                  {isEditing ? (
                    <select
                      value={formData.unitType}
                      onChange={(e) => handleInputChange('unitType', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.unitType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select unit type</option>
                      {availableUnitTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.unitType}
                    </div>
                  )}
                  {errors.unitType && <p className="text-red-500 text-sm mt-1">{errors.unitType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.unitNumber}
                      onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.unitNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., A101, V205"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.unitNumber}
                    </div>
                  )}
                  {errors.unitNumber && <p className="text-red-500 text-sm mt-1">{errors.unitNumber}</p>}
                </div>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.checkIn ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : 'Not set'}
                    </div>
                  )}
                  {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.checkOut ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : 'Not set'}
                    </div>
                  )}
                  {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Length of Stay:</strong> {breakdown.nights} night{breakdown.nights !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
                <textarea
                  value={formData.specialRequests || ''}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special requests or notes..."
                />
              </div>
            )}
          </div>

          {/* Right Column - Pricing and Summary */}
          <div className="space-y-6">
            
            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Rate (per night)</span>
                  <span className="font-medium">R {breakdown.baseRate.toLocaleString()}</span>
                </div>
                
                {/* Season Indicator */}
                {formData.checkIn && formData.unitType && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Season Applied</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getSeasonForDate(formData.checkIn, formData.unitType, seasonalCalendar) === 'high' 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : getSeasonForDate(formData.checkIn, formData.unitType, seasonalCalendar) === 'low'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {getSeasonForDate(formData.checkIn, formData.unitType, seasonalCalendar).toUpperCase()} SEASON
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Nights</span>
                  <span className="font-medium">{breakdown.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R {breakdown.subtotal.toLocaleString()}</span>
                </div>
                
                {/* Admin Fee - Editable */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Admin Fee</span>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">R</span>
                      <input
                        type="number"
                        value={breakdown.adminFee}
                        onChange={(e) => handleAdminFeeChange(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        min="0"
                      />
                    </div>
                  ) : (
                    <span className="font-medium">R {breakdown.adminFee.toLocaleString()}</span>
                  )}
                </div>

                {/* Breakage Deposit - Editable */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Breakage Deposit</span>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">R</span>
                      <input
                        type="number"
                        value={breakdown.breakageDeposit}
                        onChange={(e) => handleBreakageDepositChange(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        min="0"
                      />
                    </div>
                  ) : (
                    <span className="font-medium">R {breakdown.breakageDeposit.toLocaleString()}</span>
                  )}
                </div>
                
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">R {breakdown.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                {isEditing ? (
                  <select
                    value={formData.payment}
                    onChange={(e) => handleInputChange('payment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                ) : (
                  <div className={`px-3 py-2 rounded-md border font-medium ${
                    formData.payment === 'Paid' ? 'bg-green-50 border-green-200 text-green-800' :
                    formData.payment === 'Partial' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    formData.payment === 'Refunded' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                    'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {formData.payment}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Guest:</strong> {formData.guestName || 'Not specified'}</div>
                <div><strong>Unit:</strong> {formData.unitNumber} ({formData.unitType})</div>
                <div><strong>Dates:</strong> {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : 'Not set'} - {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : 'Not set'}</div>
                <div><strong>Duration:</strong> {breakdown.nights} night{breakdown.nights !== 1 ? 's' : ''}</div>
                <div><strong>Total:</strong> R {breakdown.total.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPreviewPageNew