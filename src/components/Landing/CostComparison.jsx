import React from 'react'
import { useNavigate } from "react-router-dom";
const CostComparison = () => {
  const navigate = useNavigate();
  return (
   

    <div className='w-full  bg-sky-100 rounded-md ">'>
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto sm:mt-20 ">
      <div class="grid md:grid-cols-2 gap-12">
        <div class="lg:w-3/4">
          <h2 class="text-3xl text-gray-800 font-bold lg:text-4xl ">
          Your Career is Too Important to Settle
          </h2>
          <p class="mt-3 text-gray-800 ">
          Don’t look back in regret in 10 years.  Let’s get you into a fulfilling career that realizes your potential today.
          </p>
          <p class="mt-5">
            {/* <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="#">
              Contact sales to learn more
              <svg class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a> */}
          </p>
        </div>
 
    
        <div class="space-y-6 lg:space-y-10">
        
          <div class="flex gap-x-5 sm:gap-x-8">
      
            <span class="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto ">
              <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </span>
            <div class="grow">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 ">
              We eliminate barriers to move up in your career
              </h3>
              <p class="mt-1 text-gray-600 ">
              Fulfil does everything we can to make moving up easy.
              </p>
            </div>
          </div>
        
          <div class="flex gap-x-5 sm:gap-x-8">
          
           
            <span class="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto ">
              <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
            </span>
            <div class="grow">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800 ">
              Let’s see what your highest and best looks like
              </h3>
              <p class="mt-1 text-gray-600 ">
              Operating at your best doesn’t just benefit you, it benefits everyone around you.
              </p>
            </div>
          </div>
    
          <div class="flex gap-x-5 sm:gap-x-8">
       
          <span class="shrink-0 inline-flex justify-center items-center size-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto ">
              <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            </span>
            <div class="grow">
              <h3 class="text-base sm:text-lg font-semibold text-gray-800">
              Continued Support
              </h3>
              <p class="mt-1 text-gray-600 ">
              We help make sure you are always moving up.
              </p>
            </div>
          </div>
        
        </div>
     
      </div>
    
    </div>
    </div>
  
  )
}

export default CostComparison