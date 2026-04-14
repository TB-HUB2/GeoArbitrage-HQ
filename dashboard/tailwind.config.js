/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        cream: "#E8DCC8",
        dark: { 100: "#22262e", 200: "#1a1d23", 300: "#0f1117", border: "#2a2e38" },
        success: "#5B8C5A",
        danger: "#D45B5B",
        info: "#4A90A4",
        purple: "#7B68EE",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
