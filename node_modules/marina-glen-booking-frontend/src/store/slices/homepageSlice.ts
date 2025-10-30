import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Load settings from localStorage
const loadHomepageSettings = (): HomepageSettings => {
  // Default settings
  const defaultSettings: HomepageSettings = {
    heroTitle: 'Experience Paradise at Marina Glen Holiday Resort',
    heroSubtitle: 'Luxury Meets Nature\'s Beauty',
    heroDescription: 'Immerse yourself in world-class amenities, breathtaking ocean views, and exceptional service. Your perfect coastal getaway awaits with pristine beaches and unforgettable experiences.',
    featuresTitle: 'Why Choose Marina Glen Holiday Resort?',
    featuresSubtitle: 'We offer unparalleled luxury and ocean-inspired experiences to make your stay unforgettable',
    featureCards: [
      {
        id: 'ocean-views',
        title: 'Ocean Views',
        description: 'Wake up to stunning ocean vistas from your private balcony. Every room offers breathtaking panoramic views of the endless blue horizon.',
        emoji: '🌊',
        image: '/api/placeholder/400/300'
      },
      {
        id: 'fine-dining',
        title: 'Fine Dining',
        description: 'Savor exquisite coastal cuisine prepared by world-renowned chefs. Multiple restaurants featuring fresh seafood and international flavors.',
        emoji: '🍽️',
        image: '/api/placeholder/400/300'
      },
      {
        id: 'spa-wellness',
        title: 'Spa & Wellness',
        description: 'Rejuvenate your mind and body at our award-winning oceanfront spa. Professional treatments and wellness programs with ocean-inspired therapy.',
        emoji: '🧘',
        image: '/api/placeholder/400/300'
      }
    ],
    accommodationTitle: 'Accommodation',
    accommodationSubtitle: 'Choose from our collection of elegantly designed units with stunning ocean views',
    unitDescriptions: [
      {
        unitType: '4 Sleeper Unit',
        title: '4 Sleeper Unit',
        description: 'Comfortable unit with ocean views perfect for small families or groups of 4',
        image: '/api/placeholder/400/300'
      },
      {
        unitType: '6 Sleeper Unit',
        title: '6 Sleeper Unit',
        description: 'Spacious unit with ocean views perfect for larger families or groups of 6',
        image: '/api/placeholder/400/300'
      },
      {
        unitType: 'Bigger 6 sleeper Unit',
        title: 'Bigger 6 Sleeper Unit',
        description: 'Our largest and most luxurious unit with extra space and premium amenities for 6 guests',
        image: '/api/placeholder/400/300'
      }
    ],
    ctaTitle: 'Ready for Your Dream Ocean Vacation?',
    ctaDescription: 'Book your stay today and experience the ultimate in luxury and relaxation by the ocean'
  }

  try {
    const saved = localStorage.getItem('marinaglen-homepage-settings')
    if (saved) {
      const parsedSettings = JSON.parse(saved)
      // Merge saved settings with defaults to ensure all properties exist
      return { ...defaultSettings, ...parsedSettings }
    }
  } catch (error) {
    console.warn('Failed to load homepage settings from localStorage:', error)
  }
  
  // Return default settings if no saved data or error
  return defaultSettings
}

interface UnitDescription {
  unitType: string
  title: string
  description: string
  image?: string
}

interface FeatureCard {
  id: string
  title: string
  description: string
  emoji: string
  image?: string
}

interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  featuresTitle: string
  featuresSubtitle: string
  featureCards: FeatureCard[]
  accommodationTitle: string
  accommodationSubtitle: string
  unitDescriptions: UnitDescription[]
  ctaTitle: string
  ctaDescription: string
}

interface HomepageState {
  settings: HomepageSettings
  loading: boolean
  error: string | null
}

const initialState: HomepageState = {
  settings: loadHomepageSettings(),
  loading: false,
  error: null
}

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    updateHomepageSettings: (state, action: PayloadAction<Partial<HomepageSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    updateUnitDescription: (state, action: PayloadAction<UnitDescription>) => {
      const index = state.settings.unitDescriptions.findIndex(unit => unit.unitType === action.payload.unitType)
      if (index !== -1) {
        state.settings.unitDescriptions[index] = action.payload
      }
    },
    updateFeatureCard: (state, action: PayloadAction<FeatureCard>) => {
      const index = state.settings.featureCards.findIndex(card => card.id === action.payload.id)
      if (index !== -1) {
        state.settings.featureCards[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  updateHomepageSettings,
  updateUnitDescription,
  updateFeatureCard,
  setLoading,
  setError
} = homepageSlice.actions

export default homepageSlice.reducer