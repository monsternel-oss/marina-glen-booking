import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'

const RoomsPage: React.FC = () => {
  const { units, unitRates } = useAppSelector((state) => state.rooms)
  const [selectedType, setSelectedType] = useState('All')

  // Get unique unit types from both units and unitRates
  const unitTypes = ['All', ...Array.from(new Set([
    ...units.map(unit => unit.type),
    ...unitRates.map(rate => rate.unitType)
  ]))]
  
  const filteredUnits = selectedType === 'All' 
    ? units 
    : units.filter(unit => unit.type === selectedType)

  // Function to get rate for a unit type
  const getRateForUnitType = (unitType: string) => {
    const rate = unitRates.find(rate => rate.unitType === unitType)
    return rate ? rate.midSeasonRate : 800 // Default to mid-season rate
  }

  // Function to get features for unit type
  const getFeaturesForUnitType = (unitType: string) => {
    const baseFeatures = ['Ocean View', 'WiFi', 'Air Conditioning']
    
    if (unitType.includes('2 Sleeper')) {
      return [...baseFeatures, 'Kitchenette', 'Balcony']
    } else if (unitType.includes('4 Sleeper')) {
      return [...baseFeatures, 'Full Kitchen', 'Living Area', 'Balcony']
    } else if (unitType.includes('6 Sleeper')) {
      return [...baseFeatures, 'Full Kitchen', 'Living Area', 'Private Deck', 'Premium Amenities']
    }
    return baseFeatures
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Units</h1>
          <p className="text-xl text-gray-600">
            Discover our collection of elegantly designed accommodations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {unitTypes.map((type: string) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full relative">
                    {unit.images && unit.images.length > 0 ? (
                      <img 
                        src={unit.images[unit.heroImageIndex || 0]}
                        alt={`${unit.number} - ${unit.type}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-medium">${unit.type}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-medium">
                        {unit.type}
                      </div>
                    )}
                    {unit.status !== 'Available' && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        {unit.status}
                      </div>
                    )}
                    {unit.images && unit.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{unit.images.length - 1} more
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{unit.number}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {unit.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{unit.features}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Capacity: {unit.type.includes('2') ? '2' : unit.type.includes('4') ? '4' : unit.type.includes('6') ? '6' : '4'} guests
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {getFeaturesForUnitType(unit.type).slice(0, 4).map((feature: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                        {getFeaturesForUnitType(unit.type).length > 4 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{getFeaturesForUnitType(unit.type).length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">R{getRateForUnitType(unit.type).toLocaleString()}</span>
                      <span className="text-gray-500">/night</span>
                    </div>
                    <div className="space-x-2">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors">
                        View Details
                      </button>
                      <Link 
                        to={`/booking?unit=${unit.id}`}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          unit.status === 'Available'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {unit.status === 'Available' ? 'Book Now' : unit.status}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUnits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {units.length === 0 
                ? 'No units have been added yet. Please add units in the admin dashboard.' 
                : 'No units found for the selected category.'}
            </p>
            {units.length === 0 && (
              <p className="text-gray-500 mt-2">Contact the administrator to set up accommodations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomsPage