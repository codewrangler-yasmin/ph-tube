/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./public/js/script.js"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
