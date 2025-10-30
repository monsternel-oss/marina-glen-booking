import React from 'react'
import marinaBackground from '../assets/marina-beach-ocean-bg.jpg'

const BackgroundImage: React.FC = () => {
  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${marinaBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    zIndex: -1000,
    backgroundColor: '#0891b2'
  }

  return <div style={backgroundStyle} className="background-image-component" />
}

export default BackgroundImage