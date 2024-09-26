import React from 'react'
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";

const EmployerCTAMobileOnly = () => {

  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  return (
    <>
    {isDesktop ? (null) : (
   
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
     
      <div class="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
        <div class="lg:col-span-3">
          <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl">Looking to hire?</h1>
          <p class="mt-3 text-lg text-gray-800">Get your open positions filled with local talent.</p>
          <div class="lg:col-span-4 mt-6 lg:mt-0">
          <img class="w-full rounded-xl" src="landingImages/horizontal-portrait-people-sit-queue-have-pleasant-conversation-with-each-other.jpg" alt="Image Description" />
        </div>
          <div class="mt-5 lg:mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          
            <a class="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none" onClick={() => navigate("OnboardingOne")}>
              Post a position
            </a>
          </div>
    
    
          
        
        </div>
     
    
        
       
      
      </div>
    
    </div>
        )}

        </>

  
  )
}

export default EmployerCTAMobileOnly