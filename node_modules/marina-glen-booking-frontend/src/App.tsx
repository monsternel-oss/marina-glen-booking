import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import MarinaLayout from './components/MarinaLayout'
import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import BookingPageNew from './pages/BookingPageNew'
import BookingPreviewPageRedirect from './pages/BookingPreviewPageRedirect'
import BookingPreviewPageNew from './pages/BookingPreviewPageNew'
import AdminDashboard from './pages/AdminDashboard'
import GuestDashboard from './pages/GuestDashboard'
import SeasonalCalendarPage from './pages/SeasonalCalendarPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import './styles/marina-integration.css'

function App() {
  return (
    <Routes>
      {/* Public booking routes with Marina branding */}
      <Route path="/booking-system" element={
        <MarinaLayout title="Marina Glen Holiday Resort" subtitle="Your perfect seaside escape awaits">
          <HomePage />
        </MarinaLayout>
      } />
      <Route path="/booking-system/rooms" element={
        <MarinaLayout title="Accommodation Options" subtitle="Choose your perfect oceanfront unit">
          <RoomsPage />
        </MarinaLayout>
      } />
      <Route path="/booking-system/booking" element={
        <MarinaLayout title="Book Your Stay" subtitle="Secure your reservation in just a few clicks">
          <BookingPageNew />
        </MarinaLayout>
      } />
      <Route path="/booking-system/booking-preview" element={<BookingPreviewPageRedirect />} />
      <Route path="/booking-system/booking-form" element={
        <MarinaLayout title="Booking Details" subtitle="Complete your reservation">
          <BookingPreviewPageNew />
        </MarinaLayout>
      } />
      
      {/* Auth routes without main navigation */}
      <Route path="/booking-system/login" element={
        <MarinaLayout title="Admin Login" subtitle="Access your booking management dashboard" showNavigation={false}>
          <LoginPage />
        </MarinaLayout>
      } />
      <Route path="/booking-system/register" element={
        <MarinaLayout title="Admin Registration" subtitle="Create your management account" showNavigation={false}>
          <RegisterPage />
        </MarinaLayout>
      } />
      
      {/* Guest dashboard route */}
      <Route 
        path="/booking-system/dashboard" 
        element={
          <ProtectedRoute>
            <MarinaLayout title="Guest Dashboard" subtitle="Manage your bookings and preferences">
              <GuestDashboard />
            </MarinaLayout>
          </ProtectedRoute>
        } 
      />
        
      {/* Admin routes with original layout */}        
      <Route
        path="/booking-system/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-system/admin/seasonal-calendar"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <SeasonalCalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App