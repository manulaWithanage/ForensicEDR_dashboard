/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Slate 900
        surface: '#1e293b',    // Slate 800
        primary: '#06b6d4',    // Cyan 500
        secondary: '#8b5cf6',  // Violet 500
        success: '#22c55e',    // Green 500
        warning: '#eab308',    // Yellow 500
        danger: '#ef4444',     // Red 500
        text: {
          primary: '#f8fafc',  // Slate 50
          secondary: '#94a3b8', // Slate 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
