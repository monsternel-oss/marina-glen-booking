import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { updateUnits, updateUnitRates, updateUnitRate, addUnitRate, deleteUnitRate } from '../store/slices/roomsSlice'
import { addBooking, updateBooking, updateBookingStatus, deleteBooking, updateBookings, type Booking } from '../store/slices/bookingsSlice'
import { addGuest, updateGuestBookingStats, updateGuests, type Guest } from '../store/slices/guestsSlice'
import { updateHomepageSettings, updateUnitDescription, updateFeatureCard } from '../store/slices/homepageSlice'

// Define types for business settings
interface BusinessSettings {
  name: string
  address: string
  phone: string
  email: string
  website: string
  description: string
  logo: string
}

// Define types for data items
interface SeasonRate {
  id: string
  seasonName: string
  dateRange: string
  highSeasonRate: number
  midSeasonRate: number
  lowSeasonRate: number
  minStay: number
  adminFee: number
  breakageDeposit: number
}

interface Unit {
  id: string
  number: string
  type: string
  features: string
  status: string
  rate: number
  images?: string[]
  heroImageIndex?: number
  seasonRates?: SeasonRate[]
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  lastLogin: string
}

export default function AdminDashboard() {
  // Navigation
  const navigate = useNavigate()
  
  // Redux integration
  const dispatch = useAppDispatch()
  const { units: reduxUnits, unitRates: reduxUnitRates } = useAppSelector((state) => state.rooms)
  const { bookings: reduxBookings } = useAppSelector((state) => state.bookings)
  const { guests: reduxGuests } = useAppSelector((state) => state.guests)
  const { settings: homepageSettings } = useAppSelector((state) => state.homepage)
  
  // Debug: Log bookings state changes
  useEffect(() => {
    console.log('🔄 Redux bookings updated:', reduxBookings)
  }, [reduxBookings])
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete'>('view')
  const [modalType, setModalType] = useState<string>('unit')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})

  // Use Redux state as primary source, fallback to local state
  const [units, setUnits] = useState<Unit[]>(reduxUnits)
  const [users, setUsers] = useState<User[]>([])

  // Sync local state with Redux state
  useEffect(() => {
    setUnits(reduxUnits)
  }, [reduxUnits])

  // Update Redux store when units change
  const updateUnitsInStore = (newUnits: Unit[]) => {
    setUnits(newUnits)
    dispatch(updateUnits(newUnits))
  }

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: 'Marina Glen Holiday Resort',
    address: '123 Coastal Drive, Port Alfred, 6170',
    phone: '+27 46 624 1234',
    email: 'info@marinaglen.com',
    website: 'https://marinaglen.com',
    description: 'Experience luxury coastal accommodation at Marina Glen Holiday Resort. Our premium units offer breathtaking ocean views and world-class amenities for the perfect getaway.',
    logo: '/logo.png'
  })

  // Season rates state - REMOVED
  // const [seasonRates, setSeasonRates] = useState([
  //   { id: 1, name: 'Peak Season', dateRange: 'Dec 15 - Jan 15', rate: '+25%', color: 'blue' },
  //   { id: 2, name: 'High Season', dateRange: 'Nov 1 - Dec 14, Jan 16 - Mar 31', rate: '+15%', color: 'green' },
  //   { id: 3, name: 'Standard Season', dateRange: 'Apr 1 - Oct 31', rate: 'Base Rate', color: 'gray' }
  // ])

  // Use Redux unitRates as the authoritative source
  const unitRates = reduxUnitRates

  // Booking page settings state
  const [bookingPageSettings, setBookingPageSettings] = useState({
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
  })

  // Modal functions
  const openModal = (mode: 'view' | 'edit' | 'delete', item: any = null) => {
    setModalMode(mode)
    setModalType(item?.type || 'unit')
    setSelectedItem(item)
    setFormData(item || {})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    setFormData({})
  }

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log('💾 handleSave called')
    alert('Changes saved successfully!')
    closeModal()
  }

  // Clear all data functions
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      updateUnitsInStore([])
      setUsers([])
      dispatch(updateBookings([]))
      dispatch(updateUnitRates([]))
      alert('All data has been cleared successfully!')
    }
  }

  const clearUnits = () => {
    if (window.confirm('Are you sure you want to clear all units?')) {
      updateUnitsInStore([])
      alert('All units cleared!')
    }
  }

  // const clearUsers = () => {
  //   if (window.confirm('Are you sure you want to clear all users?')) {
  //     setUsers([])
  //     alert('All users cleared!')
  //   }
  // }

  const clearBookings = () => {
    if (window.confirm('Are you sure you want to clear all bookings?')) {
      dispatch(updateBookings([]))
      alert('All bookings cleared!')
    }
  }

  const clearRates = () => {
    if (window.confirm('Are you sure you want to clear all rates?')) {
      dispatch(updateUnitRates([]))
      alert('All rates cleared!')
    }
  }

  // Tab configuration
  const updateBasicInfo = () => {
    if (window.confirm('Save changes to basic information?')) {
      alert('Basic information updated successfully!')
    }
  }

  const resetBasicInfo = () => {
    if (window.confirm('Reset basic information to defaults?')) {
      setBusinessSettings({
        name: 'Marina Glen Holiday Resort',
        address: '123 Coastal Drive, Port Alfred, 6170',
        phone: '+27 46 624 1234',
        email: 'info@marinaglen.com',
        website: 'https://marinaglen.com',
        description: 'Experience luxury coastal accommodation at Marina Glen Holiday Resort. Our premium units offer breathtaking ocean views and world-class amenities for the perfect getaway.',
        logo: '/logo.png'
      })
      alert('Basic information reset to defaults!')
    }
  }

  // Homepage settings functions
  const saveHomepageSettings = () => {
    if (window.confirm('Save changes to homepage settings?')) {
      // Save to localStorage for persistence
      localStorage.setItem('marinaglen-homepage-settings', JSON.stringify(homepageSettings))
      alert('Homepage settings saved successfully!')
    }
  }

  const resetHomepageSettings = () => {
    if (window.confirm('Reset homepage settings to defaults? This will restore all original content.')) {
      dispatch(updateHomepageSettings({
        heroTitle: 'Experience Paradise at Marina Glen Holiday Resort',
        heroSubtitle: 'Luxury Meets Nature\'s Beauty',
        heroDescription: 'Immerse yourself in world-class amenities, breathtaking ocean views, and exceptional service. Your perfect coastal getaway awaits with pristine beaches and unforgettable experiences.',
        featuresTitle: 'Why Choose Marina Glen Holiday Resort?',
        featuresSubtitle: 'We offer unparalleled luxury and ocean-inspired experiences to make your stay unforgettable',
        featureCards: [
          {
            id: 'ocean-views',
            title: 'Ocean Views',
            description: 'Wake up to stunning ocean vistas from your private balcony. Every room offers breathtaking panoramic views of the endless blue horizon.',
            emoji: '🌊',
            image: '/api/placeholder/400/300'
          },
          {
            id: 'fine-dining',
            title: 'Fine Dining',
            description: 'Savor exquisite coastal cuisine prepared by world-renowned chefs. Multiple restaurants featuring fresh seafood and international flavors.',
            emoji: '🍽️',
            image: '/api/placeholder/400/300'
          },
          {
            id: 'spa-wellness',
            title: 'Spa & Wellness',
            description: 'Rejuvenate your mind and body at our award-winning oceanfront spa. Professional treatments and wellness programs with ocean-inspired therapy.',
            emoji: '🧘',
            image: '/api/placeholder/400/300'
          }
        ],
        accommodationTitle: 'Accommodation',
        accommodationSubtitle: 'Choose from our collection of elegantly designed units with stunning ocean views',
        unitDescriptions: [
          {
            unitType: '4 Sleeper Unit',
            title: '4 Sleeper Unit',
            description: 'Comfortable unit with ocean views perfect for small families or groups of 4',
            image: '/api/placeholder/400/300'
          },
          {
            unitType: '6 Sleeper Unit',
            title: '6 Sleeper Unit',
            description: 'Spacious unit with ocean views perfect for larger families or groups of 6',
            image: '/api/placeholder/400/300'
          },
          {
            unitType: 'Bigger 6 sleeper Unit',
            title: 'Bigger 6 Sleeper Unit',
            description: 'Our largest and most luxurious unit with extra space and premium amenities for 6 guests',
            image: '/api/placeholder/400/300'
          }
        ],
        ctaTitle: 'Ready for Your Dream Ocean Vacation?',
        ctaDescription: 'Book your stay today and experience the ultimate in luxury and relaxation by the ocean'
      }))
      alert('Homepage settings reset to defaults!')
    }
  }

  // Tab configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'units', label: 'Unit Management', icon: '🏠' },
    { id: 'bookings', label: 'Booking Management', icon: '📅' },
    { id: 'guests', label: 'Guest Management', icon: '👥' },
    { id: 'rates', label: 'Rates & Pricing', icon: '💰' },
    { id: 'homepage', label: 'Homepage Settings', icon: '🏡' },
    { id: 'bookingpage', label: 'Booking Page Settings', icon: '🎨' },
    { id: 'settings', label: 'Business Settings', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
                <span className="text-white text-xl font-bold">🏖️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                  Marina Glen Holiday Resort
                </h1>
                <p className="text-secondary-600 text-sm">Resort Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
              >
                🗑️ Clear All Data
              </button>
              <button 
                onClick={() => openModal('edit', { 
                  firstName: 'Admin', 
                  lastName: 'User', 
                  email: 'admin@marinaglen.com', 
                  role: 'admin', 
                  type: 'user' 
                })}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-secondary-700 font-medium">Admin User</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                }}
                className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all duration-200 border-b-3 ${
                  activeTab === tab.id
                    ? 'text-blue-700 border-blue-600 bg-blue-50/50'
                    : 'text-secondary-600 border-transparent hover:text-blue-600 hover:bg-blue-50/30'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Resort Dashboard</h2>
              <div className="flex space-x-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{units.length}</div>
                    <div className="text-sm text-secondary-600">Total Units</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{reduxBookings.length}</div>
                    <div className="text-sm text-secondary-600">Active Bookings</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{users.length}</div>
                    <div className="text-sm text-secondary-600">Registered Users</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Overview Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-secondary-700">Total Revenue (This Month)</span>
                    <span className="font-bold text-blue-700">R {reduxBookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-secondary-700">Occupancy Rate</span>
                    <span className="font-bold text-green-700">{units.length > 0 ? Math.round((reduxBookings.length / units.length) * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-secondary-700">Average Booking Value</span>
                    <span className="font-bold text-purple-700">R {reduxBookings.length > 0 ? Math.round(reduxBookings.reduce((sum, booking) => sum + booking.totalAmount, 0) / reduxBookings.length).toLocaleString() : 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => openModal('edit', { type: 'unit' })}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-blue-700 font-medium transition-colors"
                  >
                    ➕ Add Unit
                  </button>
                  <button 
                    onClick={() => navigate('/booking-form?mode=create')}
                    className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-green-700 font-medium transition-colors"
                  >
                    📅 New Booking
                  </button>
                  <button 
                    onClick={() => navigate('/admin/seasonal-calendar')}
                    className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 text-yellow-700 font-medium transition-colors"
                  >
                    📆 Seasonal Calendar
                  </button>
                  <button 
                    onClick={() => openModal('edit', { type: 'user' })}
                    className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 text-purple-700 font-medium transition-colors"
                  >
                    👤 Add User
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-orange-700 font-medium transition-colors"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Units Tab */}
        {activeTab === 'units' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Unit Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => openModal('edit', { type: 'unit' })}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
                >
                  ➕ Add New Unit
                </button>
                <button 
                  onClick={clearUnits}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-md transition-all duration-200"
                >
                  🗑️ Clear All Units
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Unit Overview</h3>
              
              {units.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-xl font-semibold text-secondary-700 mb-2">No Units Available</h3>
                  <p className="text-secondary-600 mb-6">Get started by adding your first unit to the system.</p>
                  <button 
                    onClick={() => openModal('edit', { type: 'unit' })}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
                  >
                    ➕ Add Your First Unit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {units.map((unit) => (
                    <div key={unit.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Hero Image */}
                      {unit.images && unit.images.length > 0 && (
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                          <img 
                            src={unit.images[unit.heroImageIndex || 0]}
                            alt={`${unit.number} - Hero Image`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"><div class="text-center"><div class="text-4xl mb-2">🏠</div><p class="text-sm">No Image</p></div></div>';
                              }
                            }}
                          />
                          {unit.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              +{unit.images.length - 1} more
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{unit.number}</h4>
                          <p className="text-sm text-gray-600">{unit.type}</p>
                          <p className="text-sm text-gray-500 mt-1">{unit.features}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          unit.status === 'Available' ? 'bg-green-100 text-green-800' :
                          unit.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-blue-600 mb-3">
                        R{unit.rate.toLocaleString()}/night
                        <div className="text-xs text-gray-500 font-normal">
                          {unit.seasonRates ? `${unit.seasonRates.length} season rates` : 'No season rates'}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openModal('view', { ...unit, type: 'unit' })}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => openModal('edit', { ...unit, type: 'unit' })}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => openModal('delete', { ...unit, type: 'unit' })}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                        <button 
                          onClick={() => openModal('edit', { ...unit, type: 'unitSeasonRates' })}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition-colors"
                        >
                          💰 Manage Season Rates
                        </button>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Booking Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/booking-form?mode=create')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200"
                >
                  ➕ New Booking
                </button>
                <button 
                  onClick={clearBookings}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-md transition-all duration-200"
                >
                  🗑️ Clear All Bookings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Current Bookings</h3>
              
              {reduxBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-secondary-700 mb-2">No Bookings Found</h3>
                  <p className="text-secondary-600 mb-6">Start managing your resort by creating your first booking.</p>
                  <button 
                    onClick={() => navigate('/booking-form?mode=create')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200"
                  >
                    ➕ Create First Booking
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Guest</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Unit</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Dates</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">
                          Actions
                          <span className="text-xs font-normal text-gray-500 block">📋 = Full Details</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reduxBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-blue-600">{booking.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-secondary-900">{booking.guestName}</div>
                              <div className="text-sm text-secondary-600">{booking.guestEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-secondary-900">{booking.unitNumber}</div>
                              <div className="text-sm text-secondary-600">{booking.unitType}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div>{booking.checkIn} to {booking.checkOut}</div>
                              <div className="text-secondary-600">{booking.guests}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-green-600">R{booking.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <select 
                              value={booking.status}
                              onChange={(e) => {
                                console.log(`🔄 Updating booking ${booking.id} status to:`, e.target.value)
                                dispatch(updateBookingStatus({ id: booking.id, status: e.target.value }))
                              }}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'Checked Out' ? 'bg-purple-100 text-purple-800' :
                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Checked In">Checked In</option>
                              <option value="Checked Out">Checked Out</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => window.open(`/booking-preview?id=${booking.id}`, '_blank')}
                                className="text-green-600 hover:text-green-800 p-1 rounded"
                                title="View Full Details"
                              >
                                📋
                              </button>
                              <button 
                                onClick={() => openModal('view', { ...booking, type: 'booking' })}
                                className="text-gray-600 hover:text-gray-800 p-1 rounded"
                                title="Quick View"
                              >
                                👁️
                              </button>
                              <button 
                                onClick={() => navigate(`/booking-form?mode=edit&id=${booking.id}`)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              {booking.status === 'Pending' && (
                                <button 
                                  onClick={() => {
                                    console.log(`✅ Quick confirming booking ${booking.id}`)
                                    dispatch(updateBookingStatus({ id: booking.id, status: 'Confirmed' }))
                                  }}
                                  className="text-green-600 hover:text-green-800 p-1 rounded"
                                  title="Quick Confirm"
                                >
                                  ✅
                                </button>
                              )}
                              {booking.status === 'Confirmed' && (
                                <button 
                                  onClick={() => {
                                    console.log(`🏠 Quick check-in booking ${booking.id}`)
                                    dispatch(updateBookingStatus({ id: booking.id, status: 'Checked In' }))
                                  }}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                  title="Quick Check In"
                                >
                                  🏠
                                </button>
                              )}
                              {booking.status === 'Checked In' && (
                                <button 
                                  onClick={() => {
                                    console.log(`🎯 Quick check-out booking ${booking.id}`)
                                    dispatch(updateBookingStatus({ id: booking.id, status: 'Checked Out' }))
                                  }}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                  title="Quick Check Out"
                                >
                                  🎯
                                </button>
                              )}
                              <button 
                                onClick={() => openModal('delete', { ...booking, type: 'booking' })}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Guest Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => openModal('edit', { type: 'guest' })}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-all duration-200"
                >
                  ➕ Add Guest
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all guests?')) {
                      dispatch(updateGuests([]))
                      alert('All guests cleared!')
                    }
                  }}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-md transition-all duration-200"
                >
                  🗑️ Clear All Guests
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Guest List</h3>
              
              {reduxGuests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-secondary-700 mb-2">No Guests Found</h3>
                  <p className="text-secondary-600 mb-6">Guests will be automatically created when bookings are made.</p>
                  <button 
                    onClick={() => openModal('edit', { type: 'guest' })}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-all duration-200"
                  >
                    ➕ Add Guest Manually
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Guest</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Contact</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Bookings</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Total Spent</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Last Visit</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reduxGuests.map((guest) => (
                        <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-secondary-900">{guest.name}</div>
                              <div className="text-sm text-secondary-600">ID: {guest.id}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm text-secondary-900">{guest.email}</div>
                              <div className="text-sm text-secondary-600">{guest.phone}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{guest.totalBookings}</div>
                              <div className="text-xs text-secondary-600">bookings</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-green-600">R{guest.totalSpent.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm text-secondary-700">
                            {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              guest.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {guest.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => openModal('view', { ...guest, type: 'guest' })}
                                className="text-gray-600 hover:text-gray-800 p-1 rounded"
                                title="View"
                              >
                                👁️
                              </button>
                              <button 
                                onClick={() => openModal('edit', { ...guest, type: 'guest' })}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => openModal('delete', { ...guest, type: 'guest' })}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rates Tab */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Rates & Pricing</h2>
              <button 
                onClick={clearRates}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-md transition-all duration-200"
              >
                🗑️ Clear All Rates
              </button>
            </div>

            {/* Unit Rates */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900">Unit Rates</h3>
                <button 
                  onClick={() => openModal('edit', { type: 'unitRate' })}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200"
                >
                  ➕ Add Unit Rate
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {unitRates.map((rate) => (
                  <div key={rate.id} className={`p-4 rounded-lg border-2 border-${rate.color}-200 bg-${rate.color}-50`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`font-semibold text-${rate.color}-800`}>{rate.unitType}</h4>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => openModal('edit', { ...rate, type: 'unitRate' })}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => openModal('delete', { ...rate, type: 'unitRate' })}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>High Season:</span>
                        <span className="font-bold">R{rate.highSeasonRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mid Season:</span>
                        <span className="font-bold">R{rate.midSeasonRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Low Season:</span>
                        <span className="font-bold">R{rate.lowSeasonRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Stay:</span>
                        <span className="font-bold">{rate.minStay} nights</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Admin Fee:</span>
                        <span className="font-bold">R{rate.adminFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Breakage Deposit:</span>
                        <span className="font-bold">R{rate.breakageDeposit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-secondary-900">Business Settings</h2>
            
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900">Basic Information</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={updateBasicInfo}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    💾 Update
                  </button>
                  <button 
                    onClick={resetBasicInfo}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Resort Name</label>
                  <input 
                    type="text" 
                    value={businessSettings.name}
                    onChange={(e) => setBusinessSettings({...businessSettings, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({...businessSettings, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Website</label>
                  <input 
                    type="url" 
                    value={businessSettings.website}
                    onChange={(e) => setBusinessSettings({...businessSettings, website: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Address</label>
                  <input 
                    type="text" 
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({...businessSettings, address: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                  <textarea 
                    value={businessSettings.description}
                    onChange={(e) => setBusinessSettings({...businessSettings, description: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Homepage Settings Tab */}
        {activeTab === 'homepage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-secondary-900">Homepage Settings</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={saveHomepageSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  💾 Save Changes
                </button>
                <button 
                  onClick={resetHomepageSettings}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>
            
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Hero Section</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input 
                    type="text" 
                    value={homepageSettings.heroTitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ heroTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <input 
                    type="text" 
                    value={homepageSettings.heroSubtitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ heroSubtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
                  <textarea 
                    value={homepageSettings.heroDescription}
                    onChange={(e) => dispatch(updateHomepageSettings({ heroDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Features Section</h3>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features Title</label>
                  <input 
                    type="text" 
                    value={homepageSettings.featuresTitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ featuresTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features Subtitle</label>
                  <textarea 
                    value={homepageSettings.featuresSubtitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ featuresSubtitle: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Feature Cards */}
              <h4 className="text-lg font-semibold text-secondary-900 mb-3">Feature Cards</h4>
              <div className="space-y-4">
                {homepageSettings.featureCards.map((card) => (
                  <div key={card.id} className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">{card.emoji}</span>
                      {card.title}
                    </h5>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                          type="text" 
                          value={card.title}
                          onChange={(e) => dispatch(updateFeatureCard({ 
                            ...card, 
                            title: e.target.value 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                        <input 
                          type="text" 
                          value={card.emoji}
                          onChange={(e) => dispatch(updateFeatureCard({ 
                            ...card, 
                            emoji: e.target.value 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="🌊"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feature Image</label>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Enter image URL or upload below"
                            value={card.image || ''}
                            onChange={(e) => dispatch(updateFeatureCard({ 
                              ...card, 
                              image: e.target.value 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const url = URL.createObjectURL(file)
                                dispatch(updateFeatureCard({ 
                                  ...card, 
                                  image: url 
                                }))
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {card.image && (
                            <div className="mt-2">
                              <img 
                                src={card.image} 
                                alt={`${card.title} preview`}
                                className="w-full h-24 object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/400/300'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                          value={card.description}
                          onChange={(e) => dispatch(updateFeatureCard({ 
                            ...card, 
                            description: e.target.value 
                          }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation Section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Accommodation Section</h3>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Title</label>
                  <input 
                    type="text" 
                    value={homepageSettings.accommodationTitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ accommodationTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Subtitle</label>
                  <textarea 
                    value={homepageSettings.accommodationSubtitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ accommodationSubtitle: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Unit Descriptions */}
              <h4 className="text-lg font-semibold text-secondary-900 mb-3">Unit Descriptions</h4>
              <div className="space-y-4">
                {homepageSettings.unitDescriptions.map((unit) => (
                  <div key={unit.unitType} className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">{unit.unitType}</h5>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Title</label>
                        <input 
                          type="text" 
                          value={unit.title}
                          onChange={(e) => dispatch(updateUnitDescription({ 
                            ...unit, 
                            title: e.target.value 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                          value={unit.description}
                          onChange={(e) => dispatch(updateUnitDescription({ 
                            ...unit, 
                            description: e.target.value 
                          }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Image</label>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Enter image URL or upload below"
                            value={unit.image || ''}
                            onChange={(e) => dispatch(updateUnitDescription({ 
                              ...unit, 
                              image: e.target.value 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const url = URL.createObjectURL(file)
                                dispatch(updateUnitDescription({ 
                                  ...unit, 
                                  image: url 
                                }))
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {unit.image && (
                            <div className="mt-2">
                              <img 
                                src={unit.image} 
                                alt={`${unit.unitType} preview`}
                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/400/300'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Call-to-Action Section</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                  <input 
                    type="text" 
                    value={homepageSettings.ctaTitle}
                    onChange={(e) => dispatch(updateHomepageSettings({ ctaTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Description</label>
                  <textarea 
                    value={homepageSettings.ctaDescription}
                    onChange={(e) => dispatch(updateHomepageSettings({ ctaDescription: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Page Settings Tab */}
        {activeTab === 'bookingpage' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-secondary-900">Booking Page Settings</h2>
            
            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900">General Settings</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      if (window.confirm('Save booking page settings?')) {
                        alert('Booking page settings updated successfully!')
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    💾 Update
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Reset booking page settings to defaults?')) {
                        setBookingPageSettings({
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
                        })
                        alert('Booking page settings reset to defaults!')
                      }
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={bookingPageSettings.title}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Page Subtitle</label>
                  <input 
                    type="text" 
                    value={bookingPageSettings.subtitle}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, subtitle: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    value={bookingPageSettings.contactEmail}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, contactEmail: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Contact Phone</label>
                  <input 
                    type="tel" 
                    value={bookingPageSettings.contactPhone}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, contactPhone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Check-in Time</label>
                  <input 
                    type="time" 
                    value={bookingPageSettings.checkInTime}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, checkInTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Check-out Time</label>
                  <input 
                    type="time" 
                    value={bookingPageSettings.checkOutTime}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, checkOutTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Welcome Message</label>
                  <textarea 
                    value={bookingPageSettings.welcomeMessage}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, welcomeMessage: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Cancellation Policy</label>
                  <textarea 
                    value={bookingPageSettings.cancellationPolicy}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, cancellationPolicy: e.target.value})}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Footer Text</label>
                  <input 
                    type="text" 
                    value={bookingPageSettings.footerText}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, footerText: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Color Customization */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Color Customization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={bookingPageSettings.primaryColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, primaryColor: e.target.value})}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={bookingPageSettings.primaryColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, primaryColor: e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={bookingPageSettings.accentColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, accentColor: e.target.value})}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={bookingPageSettings.accentColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, accentColor: e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={bookingPageSettings.backgroundColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, backgroundColor: e.target.value})}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={bookingPageSettings.backgroundColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, backgroundColor: e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Button Color</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      value={bookingPageSettings.buttonColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, buttonColor: e.target.value})}
                      className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={bookingPageSettings.buttonColor}
                      onChange={(e) => setBookingPageSettings({...bookingPageSettings, buttonColor: e.target.value})}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Feature Display Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={bookingPageSettings.showAvailabilityCalendar}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, showAvailabilityCalendar: e.target.checked})}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-secondary-700">Show Availability Calendar</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={bookingPageSettings.showUnitImages}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, showUnitImages: e.target.checked})}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-secondary-700">Show Unit Images</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={bookingPageSettings.showUnitFeatures}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, showUnitFeatures: e.target.checked})}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-secondary-700">Show Unit Features</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={bookingPageSettings.showPricing}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, showPricing: e.target.checked})}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-secondary-700">Show Pricing</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input 
                    type="checkbox" 
                    checked={bookingPageSettings.showGuestReviews}
                    onChange={(e) => setBookingPageSettings({...bookingPageSettings, showGuestReviews: e.target.checked})}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-secondary-700">Show Guest Reviews</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Booking Page Preview</h3>
              <div className="bg-gray-100 rounded-lg p-6" style={{backgroundColor: bookingPageSettings.backgroundColor}}>
                <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto" style={{backgroundColor: bookingPageSettings.headerBackgroundColor}}>
                  <h1 className="text-3xl font-bold mb-2" style={{color: bookingPageSettings.primaryColor}}>
                    {bookingPageSettings.title}
                  </h1>
                  <p className="text-lg mb-6" style={{color: bookingPageSettings.textColor}}>
                    {bookingPageSettings.subtitle}
                  </p>
                  <div className="space-y-4">
                    <div className="text-sm" style={{color: bookingPageSettings.textColor}}>
                      <strong>Check-in:</strong> {bookingPageSettings.checkInTime} | <strong>Check-out:</strong> {bookingPageSettings.checkOutTime}
                    </div>
                    <div className="text-sm" style={{color: bookingPageSettings.textColor}}>
                      <strong>Contact:</strong> {bookingPageSettings.contactEmail} | {bookingPageSettings.contactPhone}
                    </div>
                    <button 
                      className="px-6 py-3 rounded-lg text-white font-medium"
                      style={{backgroundColor: bookingPageSettings.buttonColor, color: bookingPageSettings.buttonTextColor}}
                    >
                      Book Now
                    </button>
                    <div className="text-sm border-t pt-4" style={{color: bookingPageSettings.textColor}}>
                      {bookingPageSettings.welcomeMessage}
                    </div>
                    <div className="text-xs text-center pt-4" style={{color: bookingPageSettings.textColor}}>
                      {bookingPageSettings.footerText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-secondary-900">
                  {modalType === 'unitSeasonRates' 
                    ? `Season Rates - ${selectedItem?.number || 'Unit'}`
                    : `${modalMode === 'view' ? 'View' : modalMode === 'edit' ? 'Edit' : 'Delete'} ${modalType}`
                  }
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {modalMode === 'delete' ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">Confirm Deletion</h4>
                  <p className="text-secondary-600 mb-6">Are you sure you want to delete this {modalType}? This action cannot be undone.</p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={closeModal}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        // Handle deletion based on type
                        if (modalType === 'unit' && selectedItem) {
                          updateUnitsInStore(units.filter(unit => unit.id !== selectedItem.id))
                        } else if (modalType === 'user' && selectedItem) {
                          setUsers(users.filter(user => user.id !== selectedItem.id))
                        } else if (modalType === 'booking' && selectedItem) {
                          dispatch(deleteBooking(selectedItem.id))
                        } else if (modalType === 'unitRate' && selectedItem) {
                          dispatch(deleteUnitRate(selectedItem.id))
                        } else if (modalType === 'unitSeasonRates' && selectedItem) {
                          // Clear all season rates for this unit
                          const updatedUnit = { ...selectedItem, seasonRates: [] }
                          setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                        }
                        closeModal()
                        alert(`${modalType} deleted successfully!`)
                      }}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-secondary-600">
                    {modalType === 'unitSeasonRates' 
                      ? `Manage season-specific pricing for ${selectedItem?.number || 'this unit'}`
                      : modalMode === 'view' 
                        ? 'Viewing details for this ' 
                        : 'Edit the details for this '
                    }{modalType !== 'unitSeasonRates' ? modalType : ''}.
                  </p>
                  
                  {/* Basic form fields based on type */}
                  {modalType === 'unit' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Number</label>
                        <input 
                          type="text" 
                          value={formData.number || ''}
                          onChange={(e) => setFormData({...formData, number: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="e.g., Unit 101"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Type</label>
                        <select 
                          value={formData.type || ''}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select unit type</option>
                          <option value="4 Sleeper">4 Sleeper</option>
                          <option value="6 Sleeper">6 Sleeper</option>
                          <option value="Bigger 6 sleeper Unit">Bigger 6 sleeper Unit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Features</label>
                        <input 
                          type="text" 
                          value={formData.features || ''}
                          onChange={(e) => setFormData({...formData, features: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="e.g., Ocean View, Full Kitchen"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Rate (per night)</label>
                        <input 
                          type="number" 
                          value={formData.rate || ''}
                          onChange={(e) => setFormData({...formData, rate: e.target.value ? parseInt(e.target.value) : 0})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="e.g., 1200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                        <select 
                          value={formData.status || ''}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select status</option>
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                      
                      {/* Images Section */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Images</label>
                        <div className="space-y-3">
                          {/* Current Images Display */}
                          {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {formData.images.map((imageUrl: string, index: number) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={imageUrl} 
                                    alt={`Unit ${formData.number} - Image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-image.jpg';
                                    }}
                                  />
                                  {/* Hero Badge */}
                                  {formData.heroImageIndex === index && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                      Hero
                                    </div>
                                  )}
                                  {/* Action Buttons */}
                                  {modalMode !== 'view' && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => {
                                            setFormData({...formData, heroImageIndex: index})
                                          }}
                                          className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
                                          title="Set as Hero Image"
                                        >
                                          ⭐
                                        </button>
                                        <button
                                          onClick={() => {
                                            const newImages = formData.images.filter((_: string, i: number) => i !== index)
                                            const newHeroIndex = formData.heroImageIndex === index ? 0 : 
                                              formData.heroImageIndex > index ? formData.heroImageIndex - 1 : formData.heroImageIndex
                                            setFormData({
                                              ...formData, 
                                              images: newImages,
                                              heroImageIndex: newImages.length > 0 ? newHeroIndex : undefined
                                            })
                                          }}
                                          className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
                                          title="Remove Image"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Add New Images */}
                          {modalMode !== 'view' && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <div className="text-center">
                                <div className="text-4xl mb-2">📷</div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Add Unit Images</h4>
                                <p className="text-xs text-gray-500 mb-3">Add multiple images for this unit. The first image or selected hero image will be the main display image.</p>
                                
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        const input = e.target as HTMLInputElement;
                                        const imageUrl = input.value.trim();
                                        if (imageUrl) {
                                          const currentImages = formData.images || [];
                                          const newImages = [...currentImages, imageUrl];
                                          setFormData({
                                            ...formData, 
                                            images: newImages,
                                            heroImageIndex: formData.heroImageIndex !== undefined ? formData.heroImageIndex : 0
                                          });
                                          input.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-gray-400">Press Enter to add the image</p>
                                </div>
                                
                                {/* File Upload Section */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <p className="text-sm font-medium text-gray-900 mb-2">Or upload from your computer:</p>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                                      multiple
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length > 0) {
                                          // Show loading state
                                          const label = document.querySelector('label[for="image-upload"]');
                                          if (label) {
                                            label.innerHTML = '<span>⏳</span><span>Processing...</span>';
                                          }
                                          
                                          let processedCount = 0;
                                          files.forEach(file => {
                                            if (file.type.startsWith('image/')) {
                                              const reader = new FileReader();
                                              reader.onload = (event) => {
                                                const imageDataUrl = event.target?.result as string;
                                                if (imageDataUrl) {
                                                  const currentImages = formData.images || [];
                                                  const newImages = [...currentImages, imageDataUrl];
                                                  setFormData({
                                                    ...formData, 
                                                    images: newImages,
                                                    heroImageIndex: formData.heroImageIndex !== undefined ? formData.heroImageIndex : 0
                                                  });
                                                }
                                                processedCount++;
                                                // Reset label when done
                                                if (processedCount === files.length) {
                                                  setTimeout(() => {
                                                    if (label) {
                                                      label.innerHTML = '<span>📁</span><span>Choose Files</span>';
                                                    }
                                                  }, 500);
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          });
                                        }
                                        // Clear the input
                                        e.target.value = '';
                                      }}
                                      className="hidden"
                                      id="image-upload"
                                    />
                                    <label 
                                      htmlFor="image-upload"
                                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                    >
                                      <span>📁</span>
                                      <span>Choose Files</span>
                                    </label>
                                    <span className="text-xs text-gray-500">JPG, PNG, GIF, WebP</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">Select multiple images to upload them all at once</p>
                                </div>
                                
                                <div className="mt-3 text-xs text-gray-500">
                                  <p><strong>Sample URLs you can use:</strong></p>
                                  <div className="space-y-1 mt-1">
                                    <p>• https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop</p>
                                    <p>• https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop</p>
                                    <p>• https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {modalType === 'user' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          value={formData.firstName || ''}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          value={formData.lastName || ''}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={formData.email || ''}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Role</label>
                        <select 
                          value={formData.role || ''}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select role</option>
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="guest">Guest</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {modalType === 'booking' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Guest Name</label>
                        <input 
                          type="text" 
                          value={formData.guestName || ''}
                          onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Guest Email</label>
                        <input 
                          type="email" 
                          value={formData.guestEmail || ''}
                          onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="guest@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Guest Phone</label>
                        <input 
                          type="tel" 
                          value={formData.guestPhone || ''}
                          onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="+27 XX XXX XXXX"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Check In</label>
                          <input 
                            type="date" 
                            value={formData.checkIn || ''}
                            onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Check Out</label>
                          <input 
                            type="date" 
                            value={formData.checkOut || ''}
                            onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Type</label>
                        <select 
                          value={formData.unitType || ''}
                          onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select unit type</option>
                          <option value="4 Sleeper">4 Sleeper</option>
                          <option value="6 Sleeper">6 Sleeper</option>
                          <option value="Bigger 6 sleeper Unit">Bigger 6 sleeper Unit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Total Amount</label>
                        <input 
                          type="number" 
                          value={formData.totalAmount || ''}
                          onChange={(e) => setFormData({...formData, totalAmount: parseInt(e.target.value)})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="Total amount"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Status</label>
                          <select 
                            value={formData.status || 'Pending'}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Checked In">Checked In</option>
                            <option value="Checked Out">Checked Out</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Payment Status</label>
                          <select 
                            value={formData.payment || 'Pending'}
                            onChange={(e) => setFormData({...formData, payment: e.target.value})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Deposit Paid">Deposit Paid</option>
                            <option value="Paid">Paid</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Guest Count</label>
                        <input 
                          type="text" 
                          value={formData.guests || ''}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          placeholder="e.g., 4 adults, 2 children"
                        />
                      </div>
                    </div>
                  )}
                  
                  {modalType === 'unitRate' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Type</label>
                        <select 
                          value={formData.unitType || ''}
                          onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                          disabled={modalMode === 'view'}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select unit type</option>
                          <option value="4 Sleeper Unit">4 Sleeper Unit</option>
                          <option value="6 Sleeper Unit">6 Sleeper Unit</option>
                          <option value="Bigger 6 sleeper Unit">Bigger 6 sleeper Unit</option>
                          <option value="8 Sleeper Unit">8 Sleeper Unit</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">High Season Rate</label>
                          <input 
                            type="number" 
                            value={formData.highSeasonRate || ''}
                            onChange={(e) => setFormData({...formData, highSeasonRate: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="950"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Mid Season Rate</label>
                          <input 
                            type="number" 
                            value={formData.midSeasonRate || ''}
                            onChange={(e) => setFormData({...formData, midSeasonRate: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="850"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Low Season Rate</label>
                          <input 
                            type="number" 
                            value={formData.lowSeasonRate || ''}
                            onChange={(e) => setFormData({...formData, lowSeasonRate: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="750"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Minimum Stay (nights)</label>
                          <input 
                            type="number" 
                            value={formData.minStay || ''}
                            onChange={(e) => setFormData({...formData, minStay: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Admin Fee</label>
                          <input 
                            type="number" 
                            value={formData.adminFee || ''}
                            onChange={(e) => setFormData({...formData, adminFee: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="200"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Breakage Deposit</label>
                          <input 
                            type="number" 
                            value={formData.breakageDeposit || ''}
                            onChange={(e) => setFormData({...formData, breakageDeposit: parseInt(e.target.value)})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Color Theme</label>
                          <select 
                            value={formData.color || ''}
                            onChange={(e) => setFormData({...formData, color: e.target.value})}
                            disabled={modalMode === 'view'}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          >
                            <option value="">Select color</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="yellow">Yellow</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {modalType === 'unitSeasonRates' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Season Rates for {selectedItem?.number}</h4>
                        <p className="text-blue-700 text-sm">
                          Manage different pricing for various seasons throughout the year for this specific unit.
                        </p>
                      </div>
                      
                      {/* Current Season Rates */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">Current Season Rates</h5>
                          <button 
                            onClick={() => {
                              // Add new season rate to this unit
                              const newSeasonRate: SeasonRate = {
                                id: Date.now().toString(),
                                seasonName: 'New Season',
                                dateRange: 'Select dates',
                                highSeasonRate: (selectedItem?.rate || 800) * 1.2,
                                midSeasonRate: selectedItem?.rate || 800,
                                lowSeasonRate: (selectedItem?.rate || 800) * 0.8,
                                minStay: 2,
                                adminFee: 200,
                                breakageDeposit: 500
                              }
                              
                              const updatedUnit = {
                                ...selectedItem,
                                seasonRates: [...(selectedItem?.seasonRates || []), newSeasonRate]
                              }
                              
                              setUnits(units.map(unit => 
                                unit.id === selectedItem.id ? updatedUnit : unit
                              ))
                              setSelectedItem(updatedUnit)
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            ➕ Add Season Rate
                          </button>
                        </div>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {selectedItem?.seasonRates?.length === 0 || !selectedItem?.seasonRates ? (
                            <div className="text-center py-8 text-gray-500">
                              <div className="text-4xl mb-2">📅</div>
                              <p>No season rates set for this unit</p>
                              <p className="text-sm">Add your first season rate above</p>
                            </div>
                          ) : (
                            selectedItem?.seasonRates?.map((seasonRate: SeasonRate, index: number) => (
                              <div key={seasonRate.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <input 
                                      type="text"
                                      value={seasonRate.seasonName}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, seasonName: e.target.value }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="font-medium text-gray-900 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                      placeholder="Season Name"
                                    />
                                    <input 
                                      type="text"
                                      value={seasonRate.dateRange}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, dateRange: e.target.value }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="text-sm text-gray-600 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 mt-1"
                                      placeholder="Date Range"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const updatedSeasonRates = selectedItem?.seasonRates?.filter((_: SeasonRate, i: number) => i !== index) || []
                                      const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                      setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                      setSelectedItem(updatedUnit)
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    🗑️
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">High Season</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.highSeasonRate}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, highSeasonRate: parseInt(e.target.value) || 0 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mid Season</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.midSeasonRate}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, midSeasonRate: parseInt(e.target.value) || 0 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Low Season</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.lowSeasonRate}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, lowSeasonRate: parseInt(e.target.value) || 0 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Stay</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.minStay}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, minStay: parseInt(e.target.value) || 1 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Admin Fee</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.adminFee}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, adminFee: parseInt(e.target.value) || 0 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Breakage Deposit</label>
                                    <input 
                                      type="number"
                                      value={seasonRate.breakageDeposit}
                                      onChange={(e) => {
                                        const updatedSeasonRates = [...(selectedItem?.seasonRates || [])]
                                        updatedSeasonRates[index] = { ...seasonRate, breakageDeposit: parseInt(e.target.value) || 0 }
                                        const updatedUnit = { ...selectedItem, seasonRates: updatedSeasonRates }
                                        setUnits(units.map(unit => unit.id === selectedItem.id ? updatedUnit : unit))
                                        setSelectedItem(updatedUnit)
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      
                      {/* Close button for season rates modal */}
                      <div className="flex justify-end mt-6">
                        <button 
                          onClick={closeModal}
                          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {modalMode === 'edit' && modalType !== 'unitSeasonRates' && (
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={closeModal}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          // Handle save based on type
                          console.log('🔥 Save button clicked!')
                          console.log('modalType:', modalType)
                          console.log('selectedItem:', selectedItem)
                          console.log('formData:', formData)
                          
                          if (modalType === 'unit') {
                            console.log('✅ In unit save logic')
                            if (selectedItem && selectedItem.id) {
                              console.log('🔄 Updating existing unit')
                              // Update existing unit
                              updateUnitsInStore(units.map(unit => 
                                unit.id === selectedItem.id ? { ...formData, id: selectedItem.id } : unit
                              ))
                            } else {
                              console.log('➕ Adding new unit')
                              console.log('Current units before add:', units)
                              // Add new unit - simple approach
                              const newUnit = { 
                                id: Date.now().toString(),
                                number: formData.number || `Unit ${Math.floor(Math.random() * 999) + 100}`,
                                type: formData.type || '2 Sleeper',
                                features: formData.features || 'Standard features',
                                status: formData.status || 'Available',
                                rate: Number(formData.rate) || 800,
                                images: formData.images || [],
                                heroImageIndex: formData.heroImageIndex || 0,
                                seasonRates: []
                              }
                              console.log('💡 Created newUnit:', newUnit)
                              const updatedUnits = [...units, newUnit]
                              console.log('🎯 Updated units array:', updatedUnits)
                              updateUnitsInStore(updatedUnits)
                            }
                          } else if (modalType === 'user') {
                            if (selectedItem) {
                              // Update existing user
                              setUsers(users.map(user => 
                                user.id === selectedItem.id ? { ...formData, id: selectedItem.id, lastLogin: new Date().toISOString().split('T')[0] } : user
                              ))
                            } else {
                              // Add new user
                              const newUser = { ...formData, id: Date.now().toString(), status: 'Active', lastLogin: new Date().toISOString().split('T')[0] }
                              setUsers([...users, newUser])
                            }
                          } else if (modalType === 'booking') {
                            if (selectedItem && selectedItem.id) {
                              // Update existing booking
                              console.log('🔄 Updating existing booking:', selectedItem.id)
                              const updatedBooking = { ...formData, id: selectedItem.id } as Booking
                              dispatch(updateBooking(updatedBooking))
                            } else {
                              // Add new booking
                              console.log('📋 Adding new booking with form data:', formData)
                              const newBooking: Booking = { 
                                id: `MG-${Date.now()}`,
                                guestName: formData.guestName || '',
                                guestEmail: formData.guestEmail || '',
                                guestPhone: formData.guestPhone || '',
                                unitType: formData.unitType || '',
                                unitNumber: formData.unitNumber || `Unit ${Math.floor(Math.random() * 999) + 100}`,
                                checkIn: formData.checkIn || '',
                                checkOut: formData.checkOut || '',
                                guests: formData.guests || '2 adults',
                                totalAmount: formData.totalAmount || 0,
                                status: formData.status || 'Pending',
                                payment: formData.payment || 'Pending'
                              }
                              console.log('✅ Created newBooking:', newBooking)
                              
                              // Create guest record automatically
                              const existingGuest = reduxGuests.find(guest => guest.email === newBooking.guestEmail)
                              if (!existingGuest && newBooking.guestEmail) {
                                const newGuest: Guest = {
                                  id: `GUEST-${Date.now()}`,
                                  name: newBooking.guestName,
                                  email: newBooking.guestEmail,
                                  phone: newBooking.guestPhone,
                                  totalBookings: 1,
                                  totalSpent: newBooking.totalAmount,
                                  lastVisit: newBooking.checkIn,
                                  status: 'Active',
                                  preferences: '',
                                  notes: `Auto-created from booking ${newBooking.id}`,
                                  createdAt: new Date().toISOString()
                                }
                                console.log('👤 Creating new guest:', newGuest)
                                dispatch(addGuest(newGuest))
                              } else if (existingGuest) {
                                // Update existing guest's booking stats
                                console.log('🔄 Updating existing guest booking stats')
                                dispatch(updateGuestBookingStats({
                                  email: newBooking.guestEmail,
                                  bookingAmount: newBooking.totalAmount,
                                  bookingDate: newBooking.checkIn
                                }))
                              }
                              
                              dispatch(addBooking(newBooking))
                              console.log('📤 Dispatched addBooking action')
                            }
                          } else if (modalType === 'unitRate') {
                            if (selectedItem) {
                              // Update existing unit rate
                              dispatch(updateUnitRate({ ...formData, id: selectedItem.id }))
                            } else {
                              // Add new unit rate
                              const newUnitRate = { ...formData, id: Date.now() }
                              dispatch(addUnitRate(newUnitRate))
                            }
                          } else if (modalType === 'unitSeasonRates') {
                            // Season rates are saved in real-time, just close modal
                            console.log('Season rates saved for unit:', selectedItem?.number)
                          }
                          handleSave()
                        }}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}