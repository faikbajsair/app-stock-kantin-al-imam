/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          green: '#E8F5E9',
          greenDark: '#2E7D32',
          mint: '#C8E6C9',
          sage: '#A5D6A7',
          teal: '#E0F2F1',
          peach: '#FFF3E0',
          amber: '#FFF8E1'
        }
      }
    },
  },
  plugins: [],
}
