import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { logout } from '../../store/slices/authSlice'
import resortLogo from '../../assets/resort-logo.jpg'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/booking-system/login')
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-secondary-900/20 backdrop-blur-lg border-b border-white/20 shadow-ocean">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/booking-system" className="flex items-center space-x-3">
                <div className="w-16 h-12 rounded-lg overflow-hidden shadow-ocean">
                  <img src={resortLogo} alt="Marina Glen Holiday Resort Logo" className="w-full h-full object-contain bg-white p-1" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">Marina Glen</h1>
                  <p className="text-xs text-white/90 drop-shadow-md">Holiday Resort</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-2">
              <Link 
                to="/booking-system" 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/booking-system') 
                    ? 'bg-white/30 text-white backdrop-blur-sm shadow-ocean border border-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/booking-system/rooms" 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/booking-system/rooms') 
                    ? 'bg-white/30 text-white backdrop-blur-sm shadow-ocean border border-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
              >
                Units
              </Link>
              <Link 
                to="/booking-system/booking" 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/booking-system/booking') 
                    ? 'bg-white/30 text-white backdrop-blur-sm shadow-ocean border border-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
              >
                Book Now
              </Link>
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'bg-white/30 text-white backdrop-blur-sm shadow-ocean border border-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                }`}
              >
                Dashboard
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/admin') 
                      ? 'bg-white/30 text-white backdrop-blur-sm shadow-ocean border border-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-white/90 text-sm">
                    Welcome, {user?.firstName} {user?.role === 'admin' && '(Admin)'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white/90 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-20">{children}</main>
      
      <footer className="bg-secondary-900/95 backdrop-blur-lg text-white border-t border-primary-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-9 rounded-lg overflow-hidden bg-white/10">
                  <img src={resortLogo} alt="Marina Glen Holiday Resort Logo" className="w-full h-full object-contain bg-white p-1 rounded" />
                </div>
                <h3 className="text-xl font-bold">Marina Glen Holiday Resort</h3>
              </div>
              <p className="text-secondary-300 mb-4 max-w-md">
                Experience luxury and comfort at our world-class holiday resort. 
                Professional booking management system for seamless reservations with breathtaking ocean views.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Quick Links</h4>
              <ul className="space-y-2 text-secondary-300">
                <li><Link to="/booking-system/rooms" className="hover:text-white transition-colors hover:text-primary-300">Units</Link></li>
                <li><Link to="/booking-system/booking" className="hover:text-white transition-colors hover:text-primary-300">Book Now</Link></li>
                <li><Link to="/booking-system/dashboard" className="hover:text-white transition-colors hover:text-primary-300">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Contact</h4>
              <ul className="space-y-2 text-secondary-300">
                <li>📞 0393130200</li>
                <li>📧 bookings@marinaglen.co.za</li>
                <li>🏖️ 17 Mars Road, Marina Beach, KZN</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2025 Marina Glen Holiday Resort. All rights reserved. 🌊</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout