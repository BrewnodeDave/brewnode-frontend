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
        'xxs': '0.5rem',
        'xs': '0.625rem',
        'sm': '0.75rem',
        'base': '0.875rem',
        'lg': '1rem',
        'xl': '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '1.875rem',
        '5xl': '2.25rem',
        '6xl': '3rem',
      }
    },
  },
  plugins: [],
}