/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brewery: {
          50: '#fef7ee',
          100: '#feebd6',
          200: '#fdd4ad',
          300: '#fab979',
          400: '#f69544',
          500: '#f37b1f',
          600: '#e46015',
          700: '#bd4a13',
          800: '#973b17',
          900: '#7a3216',
        }
      }
    },
  },
  plugins: [],
}