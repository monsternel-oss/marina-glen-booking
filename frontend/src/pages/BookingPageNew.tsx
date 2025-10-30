import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface Room {
  id: number
  name: string
  type: string
  price: number
  capacity: number
  amenities: string[]
  image?: string
  description?: string
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

const BookingPageNew: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('room')
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
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
    // Mock rooms data with VikBookings-style information
    const mockRooms: Room[] = [
      {
        id: 1,
        name: '4 Sleeper Unit',
        type: 'Ocean View Apartment',
        price: 1200,
        capacity: 4,
        amenities: ['Ocean View', 'Air Conditioning', 'WiFi', 'Kitchen', 'Parking', 'Balcony'],
        description: 'Comfortable oceanfront unit perfect for small families with stunning views'
      },
      {
        id: 2,
        name: '6 Sleeper Unit',
        type: 'Family Villa',
        price: 1800,
        capacity: 6,
        amenities: ['Ocean View', 'Air Conditioning', 'WiFi', 'Full Kitchen', 'Parking', 'Balcony', 'BBQ Area'],
        description: 'Spacious villa with premium amenities for larger families'
      },
      {
        id: 3,
        name: 'Premium Unit',
        type: 'Luxury Suite',
        price: 2500,
        capacity: 8,
        amenities: ['Ocean View', 'Air Conditioning', 'WiFi', 'Full Kitchen', 'Parking', 'Balcony', 'Premium Service', 'Private Pool'],
        description: 'Ultimate luxury oceanfront suite with exclusive amenities and dedicated service'
      }
    ]
    
    setRooms(mockRooms)
    
    if (roomId) {
      const room = mockRooms.find(r => r.id === parseInt(roomId))
      if (room) {
        setSelectedRoom(room)
        setFormData(prev => ({ ...prev, roomId: roomId }))
      }
    }
  }, [roomId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setFormData(prev => ({ ...prev, roomId: room.id.toString() }))
  }

  const calculateTotal = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0
    const nights = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))
    return selectedRoom.price * nights
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Prepare booking data
      const bookingData = {
        ...formData,
        selectedRoom,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice: calculateTotal(),
        bookingDate: new Date().toISOString(),
        bookingId: `MG${Date.now()}`
      }

      // Send email notification to resort and guest
      const emailData = {
        to: ['bookings@marinaglen.co.za', formData.email],
        subject: `New Booking Confirmation - Marina Glen Holiday Resort`,
        booking: bookingData,
        resortEmail: 'bookings@marinaglen.co.za',
        guestEmail: formData.email
      }

      // Simulate API call for booking and email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Log booking data for demo purposes
      console.log('Booking submitted:', bookingData)
      console.log('Email notification sent to:', emailData.to)
      
      alert(`Booking confirmed! Confirmation emails sent to ${formData.email} and bookings@marinaglen.co.za`)
      setStep(3) // Success step
    } catch (error) {
      alert('Error submitting booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* VikBookings-style Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Reservation</h1>
              <div className="flex items-center text-blue-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Marina Glen Holiday Resort • Secure SSL Booking</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center text-blue-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm font-medium">Instant Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VikBookings-style Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
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
              
              <div className={`hidden sm:block w-24 h-2 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-200'}`}></div>
              
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
              
              <div className={`hidden sm:block w-24 h-2 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gray-200'}`}></div>
              
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
                </div>

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
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.map((amenity, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-8">
                            <div className="text-4xl font-bold text-blue-600">R{room.price.toLocaleString()}</div>
                            <div className="text-lg text-gray-500 font-medium">per night</div>
                            {formData.checkIn && formData.checkOut && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm text-gray-600 font-medium">
                                  {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))} nights
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                  R{(room.price * Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))).toLocaleString()} total
                                </div>
                              </div>
                            )}
                          </div>
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
                      Address (Optional)
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="Cape Town"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="8001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
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
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
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
                  Confirmation emails have been sent to <strong className="text-blue-600">{formData.email}</strong>
                </p>
                
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
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                    {formData.checkIn && formData.checkOut && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">Price Breakdown</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room rate (per night)</span>
                            <span className="font-medium">R{selectedRoom.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Number of nights</span>
                            <span className="font-medium">×{Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))}</span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">R{calculateTotal().toLocaleString()}</span>
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
                  <h4 className="font-bold text-gray-900 mb-4">Need Assistance?</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>0393130200</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>bookings@marinaglen.co.za</span>
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