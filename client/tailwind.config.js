/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    
    extend: {
      colors:{
        "primary":"#fefae0",
        "l-primary": "#283618",
        "r-primary": "#dda15e",
        "l-secondary": "#606c38",
        "r-secondary": "#bc6c25"
      },
    },
  },
  plugins: [],
}

