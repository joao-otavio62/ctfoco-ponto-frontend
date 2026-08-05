/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ctblack: '#0a0a0a',
        ctblack2: '#141414',
        ctred: '#e10600',
        ctred2: '#ff1a1a',
        ctgray: '#2a2a2a'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        }
      },
      animation: {
        ripple: 'ripple 0.6s linear'
      }
    }
  },
  plugins: []
}
