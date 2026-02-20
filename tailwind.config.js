/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Courier Prime', 'monospace'],
        vt: ['VT323', 'monospace'],
        tech: ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
