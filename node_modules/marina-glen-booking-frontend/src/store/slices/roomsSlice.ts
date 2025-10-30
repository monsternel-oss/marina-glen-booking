import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SeasonalPeriod {
  id: string
  unitType: string
  startDate: string // YYYY-MM-DD format
  endDate: string // YYYY-MM-DD format
  season: 'low' | 'mid' | 'high'
}

interface SeasonRate {
  id: string
  seasonName: string
  dateRange: string
  highSeasonRate: number
  midSeasonRate: number
  lowSeasonRate: number
  minStay: number
  adminFee: number
  breakageDeposit: number
}

interface Unit {
  id: string
  number: string
  type: string
  features: string
  status: string
  rate: number
  images?: string[]
  heroImageIndex?: number
  seasonRates?: SeasonRate[]
}

interface UnitRate {
  id: number
  unitType: string
  highSeasonRate: number
  midSeasonRate: number
  lowSeasonRate: number
  minStay: number
  adminFee: number
  breakageDeposit: number
  color: string
}

interface RoomsState {
  units: Unit[]
  unitRates: UnitRate[]
  seasonalCalendar: Record<string, SeasonalPeriod[]> // unitType -> array of seasonal periods
  loading: boolean
  error: string | null
}

const initialState: RoomsState = {
  units: [],
  unitRates: [
    { id: 1, unitType: '4 Sleeper Unit', highSeasonRate: 1400, midSeasonRate: 1250, lowSeasonRate: 1100, minStay: 2, adminFee: 300, breakageDeposit: 800, color: 'blue' },
    { id: 2, unitType: '6 Sleeper Unit', highSeasonRate: 2100, midSeasonRate: 1850, lowSeasonRate: 1600, minStay: 3, adminFee: 400, breakageDeposit: 1000, color: 'purple' },
    { id: 3, unitType: 'Bigger 6 sleeper Unit', highSeasonRate: 2500, midSeasonRate: 2200, lowSeasonRate: 1900, minStay: 3, adminFee: 500, breakageDeposit: 1200, color: 'orange' }
  ],
  seasonalCalendar: {
    // Default seasonal periods for each unit type
    '4 Sleeper Unit': [
      { id: '4sleeper-high-2025', unitType: '4 Sleeper Unit', startDate: '2025-12-01', endDate: '2025-12-31', season: 'high' },
      { id: '4sleeper-high-2026', unitType: '4 Sleeper Unit', startDate: '2026-01-01', endDate: '2026-01-31', season: 'high' },
      { id: '4sleeper-low-2026', unitType: '4 Sleeper Unit', startDate: '2026-05-01', endDate: '2026-08-31', season: 'low' },
    ],
    '6 Sleeper Unit': [
      { id: '6sleeper-high-2025', unitType: '6 Sleeper Unit', startDate: '2025-12-01', endDate: '2025-12-31', season: 'high' },
      { id: '6sleeper-high-2026', unitType: '6 Sleeper Unit', startDate: '2026-01-01', endDate: '2026-01-31', season: 'high' },
      { id: '6sleeper-low-2026', unitType: '6 Sleeper Unit', startDate: '2026-05-01', endDate: '2026-08-31', season: 'low' },
    ],
    'Bigger 6 sleeper Unit': [
      { id: 'bigger6sleeper-high-2025', unitType: 'Bigger 6 sleeper Unit', startDate: '2025-12-01', endDate: '2025-12-31', season: 'high' },
      { id: 'bigger6sleeper-high-2026', unitType: 'Bigger 6 sleeper Unit', startDate: '2026-01-01', endDate: '2026-01-31', season: 'high' },
      { id: 'bigger6sleeper-low-2026', unitType: 'Bigger 6 sleeper Unit', startDate: '2026-05-01', endDate: '2026-08-31', season: 'low' },
    ]
  },
  loading: false,
  error: null,
}

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updateUnits: (state, action: PayloadAction<Unit[]>) => {
      state.units = action.payload
    },
    addUnit: (state, action: PayloadAction<Unit>) => {
      state.units.push(action.payload)
    },
    updateUnit: (state, action: PayloadAction<Unit>) => {
      const index = state.units.findIndex(unit => unit.id === action.payload.id)
      if (index !== -1) {
        state.units[index] = action.payload
      }
    },
    deleteUnit: (state, action: PayloadAction<string>) => {
      state.units = state.units.filter(unit => unit.id !== action.payload)
    },
    updateUnitRates: (state, action: PayloadAction<UnitRate[]>) => {
      state.unitRates = action.payload
    },
    updateUnitRate: (state, action: PayloadAction<UnitRate>) => {
      const index = state.unitRates.findIndex(rate => rate.id === action.payload.id)
      if (index !== -1) {
        state.unitRates[index] = action.payload
      }
    },
    addUnitRate: (state, action: PayloadAction<UnitRate>) => {
      state.unitRates.push(action.payload)
    },
    deleteUnitRate: (state, action: PayloadAction<number>) => {
      state.unitRates = state.unitRates.filter(rate => rate.id !== action.payload)
    },
    updateSeasonalCalendar: (state, action: PayloadAction<{ unitType: string; period: SeasonalPeriod }>) => {
      const { unitType, period } = action.payload
      
      if (!state.seasonalCalendar[unitType]) {
        state.seasonalCalendar[unitType] = []
      }
      
      // Remove any overlapping periods
      state.seasonalCalendar[unitType] = state.seasonalCalendar[unitType].filter(p => 
        !(period.startDate <= p.endDate && period.endDate >= p.startDate)
      )
      
      // Add the new period
      state.seasonalCalendar[unitType].push(period)
      
      // Sort periods by start date
      state.seasonalCalendar[unitType].sort((a, b) => a.startDate.localeCompare(b.startDate))
    },
    removeSeasonalPeriod: (state, action: PayloadAction<{ unitType: string; periodId: string }>) => {
      const { unitType, periodId } = action.payload
      if (state.seasonalCalendar[unitType]) {
        state.seasonalCalendar[unitType] = state.seasonalCalendar[unitType].filter(p => p.id !== periodId)
      }
    },
    clearSeasonalCalendar: (state, action: PayloadAction<string>) => {
      const unitType = action.payload
      if (state.seasonalCalendar[unitType]) {
        state.seasonalCalendar[unitType] = []
      }
    },
  },
})

export const { 
  updateUnits, 
  addUnit, 
  updateUnit, 
  deleteUnit, 
  updateUnitRates, 
  updateUnitRate,
  addUnitRate,
  deleteUnitRate,
  updateSeasonalCalendar,
  removeSeasonalPeriod,
  clearSeasonalCalendar
} = roomsSlice.actions

// Helper function to get the current season for a date and unit type
export const getSeasonForDate = (date: string, unitType: string, seasonalCalendar: Record<string, SeasonalPeriod[]>): 'low' | 'mid' | 'high' => {
  const unitCalendar = seasonalCalendar[unitType]
  
  if (!unitCalendar) return 'mid'
  
  for (const period of unitCalendar) {
    if (date >= period.startDate && date <= period.endDate) {
      return period.season
    }
  }
  
  return 'mid' // Default to mid season
}

export default roomsSlice.reducer