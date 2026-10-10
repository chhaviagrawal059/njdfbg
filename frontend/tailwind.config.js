/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0a192f',
          deep: '#0f2347',
          blue: '#1e3a8a',
          light: '#f8fafc',
          border: '#e2e8f0',
          teal: '#0d9488',
          emerald: '#059669',
          amber: '#d97706',
          crimson: '#dc2626'
        }
      }
    },
  },
  plugins: [],
}
