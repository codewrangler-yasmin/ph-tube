/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./public/js/script.js"],
  theme: {
    extend: {
      fontFamily: {
        accent: ['"Roboto", sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
};
