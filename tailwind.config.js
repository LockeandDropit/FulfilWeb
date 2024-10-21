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
        landingHeroWave: "url('/public/landingImages/wave1.svg')",
        upsideDownWave: "url('/public/landingImages/waveUpsidedown.svg')",
        aboutHero: "url('/public/landingImages/horizontal-portrait-people-sit-queue-have-pleasant-conversation-with-each-other.jpg')",
        careerHero: "url('/public/landingImages/people-working-as-team-company.jpg')"
      }
    },
  
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin'),
    require('@tailwindcss/typography'),
  ],
}

