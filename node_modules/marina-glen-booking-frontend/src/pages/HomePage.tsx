import React from 'react'
import { Link } from 'react-router-dom'
// import { useAppSelector } from '../hooks/redux'

const HomePage: React.FC = () => {
  // const { settings } = useAppSelector((state) => state.homepage)

  const pageStyle = {
    minHeight: '100vh',
    position: 'relative' as const,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    // Remove individual background styling since it's now on body
    marginTop: '-80px',
    paddingTop: '80px'
  }

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.5), rgba(8, 145, 178, 0.6))'
  }

  const containerStyle = {
    position: 'relative' as const,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '80px 16px',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  }

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(8, 145, 178, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#0f172a',
    maxWidth: '600px'
  }

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '24px',
    lineHeight: '1.2',
    color: '#0f172a'
  }

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#f97316',
    fontWeight: '500',
    marginBottom: '16px'
  }

  const descriptionStyle = {
    fontSize: '1.125rem',
    marginBottom: '32px',
    color: '#475569',
    lineHeight: '1.625'
  }

  const buttonContainerStyle = {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column' as const
  }

  const primaryButtonStyle = {
    backgroundColor: '#0891b2',
    color: 'white',
    padding: '16px 32px',
    fontSize: '1.125rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '2px solid #0891b2',
    transition: 'all 0.3s ease',
    display: 'block'
  }

  const secondaryButtonStyle = {
    backgroundColor: 'white',
    color: '#0891b2',
    padding: '16px 32px',
    fontSize: '1.125rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '2px solid #0891b2',
    transition: 'all 0.3s ease',
    display: 'block'
  }

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>
            Welcome to<br />
            <span style={{ color: '#0891b2' }}>Marina Glen Holiday Resort</span>
          </h1>
          <p style={subtitleStyle}>
            Your Ocean Paradise Awaits
          </p>
          <p style={descriptionStyle}>
            Experience luxury accommodation with breathtaking ocean views, world-class amenities, and unforgettable memories at South Africa's premier holiday destination.
          </p>
          <div style={buttonContainerStyle}>
            <Link 
              to="/booking-system/rooms" 
              style={primaryButtonStyle}
            >
              Explore Our Units
            </Link>
            <Link 
              to="/booking-system/booking" 
              style={secondaryButtonStyle}
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        padding: '80px 16px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' as const }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '48px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(8, 145, 178, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#0f172a', 
              marginBottom: '16px' 
            }}>
              Why Choose Marina Glen?
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#475569', 
              marginBottom: '48px',
              maxWidth: '600px',
              margin: '0 auto 48px auto'
            }}>
              Discover what makes us the perfect choice for your holiday getaway.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={{
                textAlign: 'center' as const,
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(8, 145, 178, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(8, 145, 178, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  fontSize: '2rem'
                }}>
                  🌊
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                  Ocean Views
                </h3>
                <p style={{ color: '#475569' }}>
                  Wake up to stunning panoramic ocean views from every unit.
                </p>
              </div>

              <div style={{
                textAlign: 'center' as const,
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(8, 145, 178, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(8, 145, 178, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  fontSize: '2rem'
                }}>
                  🏖️
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                  Beach Access
                </h3>
                <p style={{ color: '#475569' }}>
                  Direct access to pristine beaches and crystal-clear waters.
                </p>
              </div>

              <div style={{
                textAlign: 'center' as const,
                padding: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(8, 145, 178, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(8, 145, 178, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  fontSize: '2rem'
                }}>
                  🏨
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                  Luxury Amenities
                </h3>
                <p style={{ color: '#475569' }}>
                  Modern facilities and premium amenities for your comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage