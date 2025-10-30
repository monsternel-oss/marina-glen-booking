import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/redux'
import { login } from '../store/slices/authSlice'

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdminHint, setShowAdminHint] = useState(false)
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Admin credentials check
      if (formData.email === 'admin@marinaglen.co.za' && formData.password === 'Marina@2025') {
        dispatch(login({
          id: 1,
          email: formData.email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        }))
        navigate('/booking-system/admin')
        return
      }

      // Guest credentials check
      if (formData.email === 'guest@marinaglen.co.za' && formData.password === 'Guest@2025') {
        dispatch(login({
          id: 2,
          email: formData.email,
          firstName: 'Guest',
          lastName: 'User',
          role: 'guest'
        }))
        navigate('/booking-system/dashboard')
        return
      }

      // Invalid credentials
      setError('Invalid email or password. Please try again.')
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLoginAdmin = () => {
    setFormData({
      email: 'admin@marinaglen.co.za',
      password: 'Marina@2025'
    })
  }

  const quickLoginGuest = () => {
    setFormData({
      email: 'guest@marinaglen.co.za',
      password: 'Guest@2025'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-ocean-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">Sign In</h2>
            <p className="text-secondary-600">Access your Marina Glen Holiday Resort account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-ocean-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAdminHint(!showAdminHint)}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Need login credentials?
            </button>
          </div>

          {showAdminHint && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <h4 className="font-medium text-primary-900 mb-3">Demo Credentials:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-primary-800">Administrator Access:</p>
                    <p className="text-primary-600">admin@marinaglen.co.za</p>
                    <p className="text-primary-600">Marina@2025</p>
                  </div>
                  <button
                    onClick={quickLoginAdmin}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs transition-all duration-300"
                  >
                    Quick Login
                  </button>
                </div>
                <div className="border-t border-primary-200 pt-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-primary-800">Guest Access:</p>
                    <p className="text-primary-600">guest@marinaglen.co.za</p>
                    <p className="text-primary-600">Guest@2025</p>
                  </div>
                  <button
                    onClick={quickLoginGuest}
                    className="bg-seafoam-500 hover:bg-seafoam-600 text-white px-3 py-1 rounded text-xs transition-all duration-300"
                  >
                    Quick Login
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link to="/booking-system/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/booking-system"
              className="text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage