/** @type {import('tailwindcss').Config} */ // Allows for type checking and IDE autocompletion
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable Tailwind's preflight to avoid conflicts with Quasar's reset styles
    preflight: false,
  },
}
