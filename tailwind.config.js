/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        santiz: {
          crimson: {
            DEFAULT: '#ba0c2f',
            light: '#d4143a',
            dark: '#8a0923',
            glow: 'rgba(186, 12, 47, 0.12)',
            tint: '#f9e6ea',
          },
          cream: '#fffefb',
          black: '#000000',
          sand: {
            DEFAULT: '#c5b8a8',
            light: '#ebe6dd',
          },
          gold: {
            DEFAULT: '#c9a046',
            light: '#d4b366',
            dark: '#a8842e',
          },
          charcoal: '#36302a',
          gray: '#8a8278',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Degular Display', 'sans-serif'],
        editorial: ['GT Alpina', 'serif'],
      },
      lineHeight: {
        tight: '0.90',
      },
    },
  },
  plugins: [],
}
