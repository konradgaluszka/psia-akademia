/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "ui-sans-serif", "system-ui"],
        body: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          50: "#f4f7ff",
          100: "#e6edff",
          200: "#c5d4ff",
          300: "#9db4ff",
          400: "#6b8cff",
          500: "#3c5ff0",
          600: "#2648c4",
          700: "#1c389b",
          800: "#152c7a",
          900: "#10235f"
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(16, 35, 95, 0.12)"
      }
    }
  },
  plugins: []
};
