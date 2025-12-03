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
      },
      fontSize: {
        'xxs': '0.65rem',
        'xs': '0.875rem',
        'sm': '1rem',
        'base': '1.125rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '3rem',
        '5xl': '3.75rem',
        '6xl': '4.5rem',
      }
    },
  },
  plugins: [],
}