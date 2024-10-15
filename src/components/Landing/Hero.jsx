import React from 'react'
import { useNavigate } from "react-router-dom";
import posthog from 'posthog-js';

const Hero = () => {

    const handleNavigateAndCaptureFunnel = () => {
        posthog.capture('logged_out_click_to_map');
        navigate("/DoerMapLoggedOutClusterTest")
      }
      const navigate = useNavigate();
  return (

    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
    
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white"><span class="text-black">Your Career Starts Here.</span>  <a className="border-b max-w-[100px]"><svg width="140px" strokeWidth={7} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1418 125"  fill="#38BDF8"><path d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z"></path></svg></a></h1>
          <p class="mt-3 text-lg text-gray-800 ">Find your dream job without getting $100,000 in college debt.</p>
    

          <div class="mt-7 grid gap-3 w-full sm:inline-flex" onClick={handleNavigateAndCaptureFunnel}>
            <a class="py-3 px-4 inline-flex justify-center cursor-pointer items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-non" >
              Browse Careers
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a>
           
          </div>
 
      
        </div>

    
        <div class="relative ms-4">
          <img class="w-full rounded-md" src="./landingImages/pexels-fauxels-3182831.jpg" alt="Hero Image" />
          <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>
    
      
          <div class="absolute bottom-0 start-0">
            <svg class="w-2/3 ms-auto h-auto text-white dark:text-neutral-900" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="531" y="352" width="99" height="99" fill="currentColor"/>
              <rect x="140" y="352" width="106" height="99" fill="currentColor"/>
              <rect x="482" y="402" width="64" height="49" fill="currentColor"/>
              <rect x="433" y="402" width="63" height="49" fill="currentColor"/>
              <rect x="384" y="352" width="49" height="50" fill="currentColor"/>
              <rect x="531" y="328" width="50" height="50" fill="currentColor"/>
              <rect x="99" y="303" width="49" height="58" fill="currentColor"/>
              <rect x="99" y="352" width="49" height="50" fill="currentColor"/>
              <rect x="99" y="392" width="49" height="59" fill="currentColor"/>
              <rect x="44" y="402" width="66" height="49" fill="currentColor"/>
              <rect x="234" y="402" width="62" height="49" fill="currentColor"/>
              <rect x="334" y="303" width="50" height="49" fill="currentColor"/>
              <rect x="581" width="49" height="49" fill="currentColor"/>
              <rect x="581" width="49" height="64" fill="currentColor"/>
              <rect x="482" y="123" width="49" height="49" fill="currentColor"/>
              <rect x="507" y="124" width="49" height="24" fill="currentColor"/>
              <rect x="531" y="49" width="99" height="99" fill="currentColor"/>
            </svg>
          </div>
        
        </div>
   
      </div>
    
    </div>

  )
}

export default Hero