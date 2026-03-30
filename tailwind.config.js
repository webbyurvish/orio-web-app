/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f5ff',
          100: '#e9ecff',
          200: '#d6dcff',
          300: '#b8c2ff',
          400: '#98a8ff',
          500: '#7b8fff',
          600: '#6677f6',
          700: '#5462df',
          800: '#434eb8',
          900: '#383f94',
        },
        indigo: {
          50: '#f3f5ff',
          100: '#e9ecff',
          200: '#d6dcff',
          300: '#b8c2ff',
          400: '#98a8ff',
          500: '#7b8fff',
          600: '#6677f6',
          700: '#5462df',
          800: '#434eb8',
          900: '#383f94',
        },
        violet: {
          50: '#f6f3ff',
          100: '#efe9ff',
          200: '#e2d6ff',
          300: '#cdb8ff',
          400: '#b49aff',
          500: '#9c7cff',
          600: '#8862f0',
          700: '#7349d8',
          800: '#5f3bb3',
          900: '#4d3292',
        },
      },
    },
  },
  plugins: [],
}
