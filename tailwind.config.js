/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F7F3',
          100: '#E1ECE3',
          200: '#C2D9C7',
          300: '#97BF9E',
          400: '#689F72',
          500: '#437F4F',
          600: '#2E7D45', // Leaf green (HOLD / positive)
          700: '#1F4D2B', // Deep forest green (dominant)
          800: '#1B3D23',
          900: '#1B2B1E', // Near-black green (primary text)
          950: '#0E1710',
        },
        harvest: {
          primary: '#1F4D2B',
          leaf: '#2E7D45',
          pale: '#EEF5E9',
          text: '#1B2B1E',
          surface: '#FAFDF9',
        },
        tomato: {
          50: '#FDF2F0',
          100: '#FBE4E0',
          200: '#F7CDC5',
          300: '#EFAB9F',
          400: '#E47B6A',
          500: '#D8432B', // Tomato red (SELL / urgency)
          600: '#B8321D',
          700: '#992715',
          800: '#7E2214',
          900: '#682015',
        },
        amberGold: {
          50: '#FEF9EE',
          100: '#FDF1D7',
          200: '#FBE1AE',
          300: '#F7CC7A',
          400: '#F2A93B', // Onion amber (highlights)
          500: '#E28E1D',
          600: '#C56F14',
          700: '#9C5013',
          800: '#7F3F16',
          900: '#693516',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Cambria', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(31, 77, 43, 0.07)',
        'soft-lg': '0 14px 45px rgba(31, 77, 43, 0.12)',
        'glow-green': '0 0 35px rgba(46, 125, 69, 0.35)',
        'glow-red': '0 0 35px rgba(216, 67, 43, 0.35)',
        'glow-amber': '0 0 35px rgba(242, 169, 59, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
      },
    },
  },
  plugins: [],
}
