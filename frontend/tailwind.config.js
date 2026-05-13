/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "oklch(0.922 0 0)",
      },
      outlineColor: {
        ring: "oklch(0.708 0 0)",
      },
      backgroundColor: {
        background: "oklch(1 0 0)",
      },
      textColor: {
        foreground: "oklch(0.145 0 0)",
      },
      fontFamily: {
        sans: ['Geist Variable', 'sans-serif'],
      },
    },
  },
  plugins: [],
}