import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'
import SeasonalCalendar from '../components/SeasonalCalendar'

const SeasonalCalendarPage: React.FC = () => {
  const navigate = useNavigate()
  const { unitRates } = useAppSelector((state) => state.rooms)
  const [selectedUnitType, setSelectedUnitType] = useState(unitRates[0]?.unitType || '')

  const handleSeasonChange = (date: string, season: 'low' | 'mid' | 'high') => {
    console.log(`Season changed for ${date}: ${season}`)
    // Additional logic can be added here if needed
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seasonal Calendar Management</h1>
              <p className="text-gray-600 mt-1">Set high, mid, and low season periods for different unit types</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Unit Type Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Unit Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unitRates.map((unitRate) => (
              <button
                key={unitRate.id}
                onClick={() => setSelectedUnitType(unitRate.unitType)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedUnitType === unitRate.unitType
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-lg">{unitRate.unitType}</h3>
                <div className="mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>High Season:</span>
                    <span className="font-medium">R{unitRate.highSeasonRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mid Season:</span>
                    <span className="font-medium">R{unitRate.midSeasonRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Season:</span>
                    <span className="font-medium">R{unitRate.lowSeasonRate}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Seasonal Calendar */}
        {selectedUnitType && (
          <SeasonalCalendar
            unitType={selectedUnitType}
            onSeasonChange={handleSeasonChange}
          />
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">1.</span>
              <span>Select a unit type above to configure its seasonal calendar</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">2.</span>
              <span>Choose the season type (Low, Mid, or High) you want to set</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">3.</span>
              <span>Click on a start date in the calendar, then click on an end date to create a seasonal period</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">4.</span>
              <span>The system will automatically apply the correct rates when customers make bookings during these periods</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">5.</span>
              <span>You can navigate between months using the arrow buttons in the calendar</span>
            </li>
          </ul>
        </div>

        {/* Rate Information */}
        {selectedUnitType && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Rates for {selectedUnitType}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Low Season Rate</h4>
                <p className="text-2xl font-bold text-green-900">
                  R{unitRates.find(r => r.unitType === selectedUnitType)?.lowSeasonRate}/night
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Mid Season Rate</h4>
                <p className="text-2xl font-bold text-yellow-900">
                  R{unitRates.find(r => r.unitType === selectedUnitType)?.midSeasonRate}/night
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">High Season Rate</h4>
                <p className="text-2xl font-bold text-red-900">
                  R{unitRates.find(r => r.unitType === selectedUnitType)?.highSeasonRate}/night
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeasonalCalendarPage