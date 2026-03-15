/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "finance-blue": "#0061F2",
        "finance-dark": "#004ec4",
      },
    },
  },
  plugins: [],
};
