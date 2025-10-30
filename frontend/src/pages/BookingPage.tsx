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

// interface PricingBreakdown {
//   basePrice: number
//   nights: number
//   subtotal: number
//   taxes: number
//   fees: number
//   total: number
// }

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('room')
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  // const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown>({
  //   basePrice: 0,
  //   nights: 0,
  //   subtotal: 0,
  //   taxes: 0,
  //   fees: 0,
  //   total: 0
  // })
  
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
    // Fetch rooms data
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms')
        const data = await response.json()
        
        if (data.success) {
          setRooms(data.data)
          if (roomId) {
            const room = data.data.find((r: Room) => r.id === parseInt(roomId))
            setSelectedRoom(room)
          }
        }
      } catch (error) {
        // Mock data fallback
        const mockRooms: Room[] = [
          {
            id: 1,
            name: 'Ocean View Suite',
            type: 'Suite',
            price: 299,
            capacity: 4,
            amenities: ['Ocean View', 'Balcony', 'Mini Bar', 'WiFi']
          },
          {
            id: 2,
            name: 'Garden Villa',
            type: 'Villa',
            price: 459,
            capacity: 6,
            amenities: ['Private Garden', 'Pool', 'Kitchen', 'WiFi']
          }
        ]
        setRooms(mockRooms)
        if (roomId) {
          const room = mockRooms.find(r => r.id === parseInt(roomId))
          if (room) {
            setSelectedRoom(room)
          }
        }
      }
    }

    fetchRooms()
  }, [roomId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setFormData(prev => ({
      ...prev,
      roomId: room.id.toString()
    }))
  }

  const calculateTotal = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0
    
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24))
    
    return nights * selectedRoom.price
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
        totalPrice: selectedRoom?.price || 0,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Stay</h1>
          <p className="text-xl text-gray-600">
            Complete your reservation in just a few simple steps
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Room & Dates</span>
            </div>
            
            <div className={`w-16 h-px ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Guest Details</span>
            </div>
            
            <div className={`w-16 h-px ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Room & Dates</h2>
                  
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Room Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Room</h3>
                    <div className="space-y-4">
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => handleRoomSelect(room)}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedRoom?.id === room.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
                              <p className="text-gray-600">Capacity: {room.capacity} guests</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {room.amenities.map((amenity, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                              <p className="text-gray-500 text-sm">/night</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRoom || !formData.checkIn || !formData.checkOut}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-md font-medium transition-colors"
                  >
                    Continue to Guest Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Details</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-md font-medium transition-colors"
                      >
                        {loading ? 'Processing...' : 'Complete Booking'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your booking. A confirmation email has been sent to {formData.email}.
                  </p>
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedRoom && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedRoom.name}</h4>
                    <p className="text-gray-600 text-sm">{selectedRoom.type}</p>
                  </div>
                  
                  {formData.checkIn && formData.checkOut && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(formData.checkIn).toLocaleDateString()} - {new Date(formData.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))} nights
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!selectedRoom && (
                <p className="text-gray-500 text-center py-8">
                  Select a room to see pricing details
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage