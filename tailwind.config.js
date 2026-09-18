/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          850: '#1f1f1f',
        },
      },
    },
  },
  plugins: [],
};
