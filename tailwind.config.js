/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inknut': ['Inknut Antiqua', 'serif'],
        'k2d': ['K2D', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'inter-semibold': ['Inter SemiBold', 'sans-serif']
      },
    },
    
  },
  plugins: [],
}

