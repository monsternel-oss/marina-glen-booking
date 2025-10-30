import React from 'react';
import '../styles/marina-integration.css';

const MarinaNavigation: React.FC = () => {
  return (
    <nav className="main-site-nav">
      <div className="back-to-main-site">
        <a 
          href="/main-site/index.html" 
          className="back-to-main-site"
          title="Return to Marina Glen main website"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M19 12H5m0 0l7 7m-7-7l7-7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Back to Main Site
        </a>
      </div>
      
      <div className="booking-brand">
        <img 
          src="/main-site/images/resort-logo.jpg" 
          alt="Marina Glen Resort Logo" 
          className="nav-logo-img"
          onError={(e) => {
            e.currentTarget.src = '/main-site/images/Resort Logo 1.jpg';
          }}
        />
        <h2>Marina Glen Bookings</h2>
      </div>
      
      <div className="nav-actions">
        <a 
          href="/booking-system/login" 
          className="admin-login-link"
          title="Admin Login"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Admin
        </a>
      </div>
    </nav>
  );
};

export default MarinaNavigation;