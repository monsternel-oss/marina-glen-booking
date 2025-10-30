import React from 'react';
import MarinaNavigation from './MarinaNavigation';
import '../styles/marina-integration.css';

interface MarinaLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
}

const MarinaLayout: React.FC<MarinaLayoutProps> = ({ 
  children, 
  title = "Online Booking System",
  subtitle = "Secure your perfect seaside getaway",
  showNavigation = true 
}) => {
  return (
    <div className="marina-layout">
      {showNavigation && <MarinaNavigation />}
      
      <div className="booking-header">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      
      <main className="booking-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="booking-footer">
        <div className="container">
          <p>
            © 2025 Marina Glen Holiday Resort. 
            <a href="/main-site/index.html">
              Visit our main website
            </a> | 
            <a href="tel:+27393121234">+27 39 312 1234</a> | 
            <a href="mailto:bookings@marinaglen.co.za">bookings@marinaglen.co.za</a>
          </p>
          <p>
            17 Mars Road, Marina Beach, KZN | Secure Online Booking Platform | 
            <a href="/booking-system/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85em' }}>
              Staff Login
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MarinaLayout;