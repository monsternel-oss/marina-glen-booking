import React from 'react'

const SimpleHomePage: React.FC = () => {
  return (
    <div 
      style={{
        backgroundColor: '#0891b2',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '40px',
          borderRadius: '16px',
          color: '#333',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0891b2' }}>
          Marina Glen Holiday Resort
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>
          Your Ocean Paradise Awaits
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '40px', lineHeight: '1.6' }}>
          Experience luxury accommodation with breathtaking ocean views, world-class amenities, 
          and unforgettable memories at South Africa's premier holiday destination.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/booking-system/rooms"
            style={{
              backgroundColor: '#0891b2',
              color: 'white',
              padding: '15px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Explore Units
          </a>
          <a 
            href="/booking-system/booking"
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '15px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Book Now
          </a>
        </div>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '40px',
            borderRadius: '16px',
            color: '#333',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#0891b2' }}>
            Why Choose Marina Glen?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌊</div>
              <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Ocean Views</h3>
              <p style={{ color: '#666' }}>Stunning panoramic ocean views from every unit</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏖️</div>
              <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Beach Access</h3>
              <p style={{ color: '#666' }}>Direct access to pristine beaches</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏨</div>
              <h3 style={{ color: '#0891b2', marginBottom: '10px' }}>Luxury Amenities</h3>
              <p style={{ color: '#666' }}>Modern facilities for your comfort</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        ✓ Minimal React + Inline Styles<br/>
        ✓ No CSS frameworks<br/>
        ✓ Direct styling
      </div>
    </div>
  )
}

export default SimpleHomePage