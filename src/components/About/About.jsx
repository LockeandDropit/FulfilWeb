import React from 'react'
import LoggedOutHeader from '../Landing/LoggedOutHeader'
import AboutHero from './AboutHero'
import WhatUsersGet from './WhatUsersGet'
import TylerFeature from './TylerFeature'

// import Footer from "../Landing/Footer"
const About = () => {
  return (
  <>
        <LoggedOutHeader />
        <div className='max-w-[85rem] mx-auto'>
        <AboutHero />
        <WhatUsersGet />
        <TylerFeature />
   

    
        {/* <Footer /> */}
    </div>
    </>
  )
}

export default About