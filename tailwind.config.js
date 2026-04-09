// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#FEE2E2',
          500: '#B91C1C',
          900: '#7F1D1D',
        },
        gold: {
          50: '#FEF3C7',
          500: '#B45309',
        },
        cream: '#FDFAF4',
        ink: {
          400: '#4A3728',
          900: '#1C1410',
        },
        muted: '#78716C',
      },
      fontFamily: {
        serif: ['Noto Serif JP', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
