// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#008800',
        'primary-brown': '#9A7B4F',
        'primary-cream': '#FFFDD0',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-green-brown': 'linear-gradient(to bottom, #008800, #9A7B4F)',
        'gradient-brown-green': 'linear-gradient(to bottom, #9A7B4F, #008800)',
      },
    },
  },
  plugins: [],
};