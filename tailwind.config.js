const { px } = require('framer-motion');

/** @type {import('tailwindcss').Config} */
module.exports = {

 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        aboutHero: "url('/public/landingImages/horizontal-portrait-people-sit-queue-have-pleasant-conversation-with-each-other.jpg')"
      }
    },
  
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin'),
    require('@tailwindcss/typography'),
  ],
}

