import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { updateSeasonalCalendar, type SeasonalPeriod } from '../store/slices/roomsSlice'

interface CalendarDay {
  date: Date
  season: 'low' | 'mid' | 'high'
  isToday: boolean
  isSelected: boolean
}

interface SeasonalCalendarProps {
  unitType: string
  onSeasonChange?: (date: string, season: 'low' | 'mid' | 'high') => void
}

const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({ unitType, onSeasonChange }) => {
  const dispatch = useAppDispatch()
  const { seasonalCalendar } = useAppSelector((state) => state.rooms)
  
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedSeason, setSelectedSeason] = useState<'low' | 'mid' | 'high'>('mid')
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<Date | null>(null)

  const today = new Date()
  const currentYear = currentMonth.getFullYear()
  const currentMonthIndex = currentMonth.getMonth()

  // Get the first day of the month and how many days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Get seasonal rate for a specific date
  const getSeasonForDate = (date: Date): 'low' | 'mid' | 'high' => {
    const dateStr = date.toISOString().split('T')[0]
    const unitCalendar = seasonalCalendar[unitType]
    
    if (!unitCalendar) return 'mid'
    
    for (const period of unitCalendar) {
      if (dateStr >= period.startDate && dateStr <= period.endDate) {
        return period.season
      }
    }
    
    return 'mid' // Default to mid season
  }

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = []
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(currentYear, currentMonthIndex, -startingDayOfWeek + i + 1)
      days.push({
        date,
        season: getSeasonForDate(date),
        isToday: false,
        isSelected: false
      })
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day)
      days.push({
        date,
        season: getSeasonForDate(date),
        isToday: date.toDateString() === today.toDateString(),
        isSelected: false
      })
    }
    
    // Add empty cells to complete the week
    const remainingCells = 42 - days.length // 6 weeks × 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentYear, currentMonthIndex + 1, i)
      days.push({
        date,
        season: getSeasonForDate(date),
        isToday: false,
        isSelected: false
      })
    }
    
    return days
  }

  const handleDayClick = (day: CalendarDay) => {
    if (isSelecting && selectionStart) {
      // End selection
      const endDate = day.date
      const startDate = selectionStart
      
      // Ensure start is before end
      const actualStart = startDate <= endDate ? startDate : endDate
      const actualEnd = startDate <= endDate ? endDate : startDate
      
      // Update the seasonal calendar
      updateSeasonalPeriod(actualStart, actualEnd, selectedSeason)
      
      setIsSelecting(false)
      setSelectionStart(null)
    } else {
      // Start selection
      setIsSelecting(true)
      setSelectionStart(day.date)
    }
  }

  const updateSeasonalPeriod = (startDate: Date, endDate: Date, season: 'low' | 'mid' | 'high') => {
    const newPeriod: SeasonalPeriod = {
      id: `${unitType}-${Date.now()}`,
      unitType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      season
    }
    
    dispatch(updateSeasonalCalendar({ unitType, period: newPeriod }))
    
    if (onSeasonChange) {
      // Notify parent component of the change
      onSeasonChange(newPeriod.startDate, season)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getSeasonColor = (season: 'low' | 'mid' | 'high') => {
    switch (season) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'mid': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'low': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const days = generateCalendarDays()
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Seasonal Calendar - {unitType}
        </h3>
        
        {/* Season Selector */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Select Season:</span>
          <div className="flex space-x-2">
            {(['low', 'mid', 'high'] as const).map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${
                  selectedSeason === season
                    ? getSeasonColor(season)
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)} Season
              </button>
            ))}
          </div>
        </div>

        {isSelecting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Selection Mode:</strong> Click on another date to complete the {selectedSeason} season period.
              Starting from: {selectionStart?.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900">{monthYear}</h4>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === currentMonthIndex
          const isSelectionStart = selectionStart?.toDateString() === day.date.toDateString()
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                relative p-2 text-sm rounded-lg border-2 transition-all hover:scale-105 cursor-pointer
                ${isCurrentMonth ? '' : 'opacity-40'}
                ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                ${isSelectionStart ? 'ring-2 ring-purple-500 bg-purple-50' : ''}
                ${getSeasonColor(day.season)}
              `}
            >
              <span className="relative z-10">{day.date.getDate()}</span>
              
              {day.isToday && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm text-gray-600">Low Season</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-600">Mid Season</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm text-gray-600">High Season</span>
        </div>
      </div>
    </div>
  )
}

export default SeasonalCalendar