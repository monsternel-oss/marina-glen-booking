import React from 'react'
import marinaBackground from '../assets/marina-beach-ocean-bg.jpg'

const BackgroundImage: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1000,
    backgroundColor: '#0891b2'
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center'
  }

  const cssBackgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(/background.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    zIndex: -1001,
    backgroundColor: '#0891b2'
  }

  return (
    <>
      {/* Method 1: CSS Background from public folder */}
      <div style={cssBackgroundStyle} className="bg-css-public" />
      
      {/* Method 2: IMG tag with imported asset */}
      <div style={containerStyle} className="bg-img-container">
        <img 
          src={marinaBackground} 
          alt="Marina Glen Ocean Background" 
          style={imageStyle}
          className="bg-img-asset"
        />
      </div>
      
      {/* Method 3: IMG tag from public folder */}
      <div style={{...containerStyle, zIndex: -1002}} className="bg-img-public-container">
        <img 
          src="/background.jpg" 
          alt="Marina Glen Ocean Background" 
          style={imageStyle}
          className="bg-img-public"
        />
      </div>
    </>
  )
}

export default BackgroundImage