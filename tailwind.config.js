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
        // High-end custom palette
        brand: {
          50: '#f4f6fa',
          100: '#e9edf5',
          200: '#ccd8eb',
          300: '#9fbcd9',
          400: '#6b9bc4',
          500: '#487da8',
          600: '#36638c',
          700: '#2d5073',
          800: '#274461',
          900: '#253a52',
          950: '#152233',
        },
        risk: {
          low: '#10b981', // emerald-500
          medium: '#f59e0b', // amber-500
          high: '#f97316', // orange-500
          critical: '#ef4444', // red-500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
