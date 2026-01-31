/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sudoku: {
          primary: '#1f2937',
          secondary: '#374151',
          accent: '#3b82f6',
          light: '#f3f4f6',
        },
      },
      spacing: {
        'grid': 'repeat(9, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
