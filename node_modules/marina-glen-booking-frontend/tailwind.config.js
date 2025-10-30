/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0891b2', // Ocean Blue
          600: '#0e7490', // Deep Ocean
          700: '#155e75',
          800: '#164e63',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8', // Coastal Gray
          500: '#64748b',
          600: '#475569', // Text Light
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Deep Sea
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa', // Light Coral
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Coral/Sunset Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        sand: {
          50: '#fefce8',
          100: '#fef3c7', // Sandy Beach
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        seafoam: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0', // Sea Foam Green
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'float': 'float 20s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(0px) translateX(-10px)' },
          '75%': { transform: 'translateY(20px) translateX(5px)' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'ocean': '0 4px 6px -1px rgba(8, 145, 178, 0.1)',
        'ocean-lg': '0 20px 25px -5px rgba(8, 145, 178, 0.15)',
        'coral': '0 4px 6px -1px rgba(249, 115, 22, 0.1)',
        'coral-lg': '0 20px 25px -5px rgba(249, 115, 22, 0.15)',
      },
    },
  },
  plugins: [],
}