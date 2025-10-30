import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'
import marinaBooking from '../assets/marina-booking.jpg'

const HomePage: React.FC = () => {
  const { unitRates } = useAppSelector((state) => state.rooms)
  const { settings } = useAppSelector((state) => state.homepage)
  
  // Get rates for display - using mid season rates as base
  const fourSleeperRate = unitRates.find(rate => rate.unitType === '4 Sleeper Unit')?.midSeasonRate || 1250
  const sixSleeperRate = unitRates.find(rate => rate.unitType === '6 Sleeper Unit')?.midSeasonRate || 1850
  const biggerSixSleeperRate = unitRates.find(rate => rate.unitType === 'Bigger 6 sleeper Unit')?.midSeasonRate || 2200

  // Get unit descriptions from settings
  const getUnitDescription = (unitType: string) => {
    return settings.unitDescriptions.find(unit => unit.unitType === unitType) || {
      unitType,
      title: unitType,
      description: `Beautiful ${unitType.toLowerCase()} with ocean views`
    }
  }
  return (
    <div className="min-h-screen" style={{ minHeight: '100vh', backgroundColor: '#0891b2' }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${marinaBooking})`,
          backgroundColor: '#0891b2',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-secondary-900/40 via-secondary-800/50 to-primary-900/60"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.5), rgba(8, 145, 178, 0.6))'
          }}
        ></div>
        <div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          style={{
            position: 'relative',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '80px 16px',
            color: 'white'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-ocean-lg border border-white/20 animate-fade-in-up"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(8, 145, 178, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#0f172a'
              }}
            >
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-secondary-900"
                style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  lineHeight: '1.2',
                  color: '#0f172a'
                }}
              >
                {settings.heroTitle.includes('Marina Glen Holiday Resort') ? (
                  <>
                    {settings.heroTitle.split('Marina Glen Holiday Resort')[0]}
                    <span className="block text-primary-600">Marina Glen Holiday Resort</span>
                  </>
                ) : (
                  settings.heroTitle
                )}
              </h1>
              <p className="text-xl text-accent-500 font-medium mb-4">
                {settings.heroSubtitle}
              </p>
              <p className="text-lg mb-8 text-secondary-600 leading-relaxed">
                {settings.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/booking-system/rooms" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-ocean hover:shadow-ocean-lg hover:-translate-y-1 text-center"
                >
                  Explore Units
                </Link>
                <Link 
                  to="/booking-system/booking" 
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-ocean-lg hover:shadow-2xl hover:-translate-y-1 text-center border-2 border-primary-500"
                >
                  Book Now
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-lg">
                <div className="h-96 rounded-2xl shadow-ocean-lg overflow-hidden animate-fade-in-up">
                  <img 
                    src={marinaBooking} 
                    alt="Marina Glen Holiday Resort" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-lg p-12 rounded-2xl shadow-ocean-lg border border-white/20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-secondary-900 mb-4">{settings.featuresTitle}</h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                {settings.featuresSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(settings.featureCards || []).map((feature) => (
                <div key={feature.id} className="text-center p-8 rounded-xl border border-primary-100 hover:shadow-ocean-lg transition-all duration-300 bg-white/70 hover:bg-white/90 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    {feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `<span class="text-3xl">${feature.emoji}</span>`
                          }
                        }}
                      />
                    ) : (
                      <span className="text-3xl">{feature.emoji}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-lg p-12 rounded-2xl shadow-ocean-lg border border-white/20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-secondary-900 mb-4">{settings.accommodationTitle}</h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                {settings.accommodationSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-ocean overflow-hidden hover:shadow-ocean-lg transition-all duration-300 hover:-translate-y-2 border border-white/30">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden relative">
                  {getUnitDescription('4 Sleeper Unit').image ? (
                    <img 
                      src={getUnitDescription('4 Sleeper Unit').image} 
                      alt={getUnitDescription('4 Sleeper Unit').title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<span class="text-white text-lg font-medium">🏠 4 Sleeper Unit</span>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                      🏠 4 Sleeper Unit
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{getUnitDescription('4 Sleeper Unit').title}</h3>
                  <p className="text-secondary-600 mb-4">{getUnitDescription('4 Sleeper Unit').description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">R{fourSleeperRate.toLocaleString()}<span className="text-sm text-secondary-500">/night</span></span>
                    <Link to="/booking-system/rooms" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-ocean overflow-hidden hover:shadow-ocean-lg transition-all duration-300 hover:-translate-y-2 border border-white/30">
                <div className="h-48 bg-gradient-to-br from-seafoam-400 to-seafoam-600 overflow-hidden relative">
                  {getUnitDescription('6 Sleeper Unit').image ? (
                    <img 
                      src={getUnitDescription('6 Sleeper Unit').image} 
                      alt={getUnitDescription('6 Sleeper Unit').title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<span class="text-white text-lg font-medium">🏡 6 Sleeper Unit</span>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                      🏡 6 Sleeper Unit
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{getUnitDescription('6 Sleeper Unit').title}</h3>
                  <p className="text-secondary-600 mb-4">{getUnitDescription('6 Sleeper Unit').description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">R{sixSleeperRate.toLocaleString()}<span className="text-sm text-secondary-500">/night</span></span>
                    <Link to="/booking-system/rooms" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-ocean overflow-hidden hover:shadow-ocean-lg transition-all duration-300 hover:-translate-y-2 border border-white/30">
                <div className="h-48 bg-gradient-to-br from-accent-400 to-accent-600 overflow-hidden relative">
                  {getUnitDescription('Bigger 6 sleeper Unit').image ? (
                    <img 
                      src={getUnitDescription('Bigger 6 sleeper Unit').image} 
                      alt={getUnitDescription('Bigger 6 sleeper Unit').title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<span class="text-white text-lg font-medium">🏨 Bigger 6 Sleeper Unit</span>'
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg font-medium">
                      🏨 Bigger 6 Sleeper Unit
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{getUnitDescription('Bigger 6 sleeper Unit').title}</h3>
                  <p className="text-secondary-600 mb-4">{getUnitDescription('Bigger 6 sleeper Unit').description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">R{biggerSixSleeperRate.toLocaleString()}<span className="text-sm text-secondary-500">/night</span></span>
                    <Link to="/booking-system/rooms" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-12 rounded-2xl shadow-ocean-lg text-white">
            <h2 className="text-4xl font-bold mb-4">{settings.ctaTitle}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
              {settings.ctaDescription}
            </p>
            <Link 
              to="/booking-system/booking" 
              className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-ocean-lg hover:shadow-2xl hover:-translate-y-1 inline-block"
            >
              Start Booking Now 🌊
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage