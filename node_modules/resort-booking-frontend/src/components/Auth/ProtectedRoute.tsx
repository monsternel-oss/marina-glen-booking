import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-ocean-lg border border-white/20 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Access Denied</h2>
              <p className="text-secondary-600">You need administrator privileges to access this page.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded-xl transition-all duration-300"
              >
                Go Back
              </button>
              <Navigate to="/login" replace />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute