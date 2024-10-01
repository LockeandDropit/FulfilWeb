import React from "react";
import { useNavigate } from "react-router-dom";
import posthog from 'posthog-js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MainHero = () => {

  const handleNavigateAndCaptureFunnel = () => {
    posthog.capture('logged_out_click_to_map');
    navigate("/DoerMapLoggedOutClusterTest")
  }
  const navigate = useNavigate();

  return (
   
   
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-180px)] sm:h-[calc(100vh-448px)]">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 class="block text-2xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight">
            {/* credit ty https://www.svgbackgrounds.com/elements/underline-doodles/ */}
            {/* credit Stickers 2/8/2018 https://stackoverflow.com/questions/48688385/adding-underline-text-decoration-without-text-for-an-inline-svg */}
          Your career starts here. <a className="border-b max-w-[100px]"><svg width="140px" strokeWidth={7} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1418 125"  fill="#38BDF8"><path d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z"></path></svg></a>
            {/* <span class="text-sky-400">ease.</span> */}
          </h1>
          <p class="mt-3 text-lg text-gray-800">
           Find a career that won't leave you $100,000 in debt before your first day. 
          </p>
          

          <div class="mt-7 grid gap-3 w-full sm:inline-flex">
            <button
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleNavigateAndCaptureFunnel}
            >
              Browse careers
              <svg
                class="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            {/* <button
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text font-semibold rounded-lg border border-transparent bg-red-400 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => navigate("/TestLanding")}
            >
            Test Landing
              <svg
                class="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button> */}
          </div>


        </div>

        {/* <div class="relative ms-4"> */}
        <div class="relative">
          <div class=" max-h-[800px] md:ml-20 rounded-md">


        
        <LazyLoadImage
      effect="blur"
      height={"700px"}
      src="./landingImages/pexels-fauxels-3182831.jpg"
  />
    </div>
          {/* <img
          loading="lazy"
            class=" max-h-[800px] md:ml-20 rounded-md"
              //credit fauxels https://www.pexels.com/photo/photo-of-men-shaking-hands-3182831/
              src="./landingImages/pexels-fauxels-3182831.jpg"
         
          
          /> */}
          <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>
        </div>
        
      </div>
    
    </div>


  );
};

export default MainHero;
