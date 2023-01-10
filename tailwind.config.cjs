/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        atkinson: "Atkinson Hyperlegible, ui-sans-serif, system-ui",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
