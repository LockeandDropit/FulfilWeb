import React from 'react'
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const NoDegreeNoProblem = () => {
  const navigate = useNavigate();
  return (
   <>
    <div class="bg-white  sm:bg-upsideDownWave bg-no-repeat bg-top  mt-10 sm:mt-0 rounded-md ">
   
    <div class="w-full px-4 sm:mt-0 sm:px-6 lg:px-8 pb-10 mx-auto">
      <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div className='mt-16'>
        <LazyLoadImage
      effect="blur"
      src="landingImages/positive-diverse-workers-unloading-boxes-warehouse.jpg"
  />
        </div>
        <div class="mt-5 sm:mt-10 lg:mt-0">
        <h2 class="font-bold text-3xl lg:text-4xl text-gray-800">
              Your career
              </h2>
              <h2 class="font-bold text-3xl lg:text-5xl text-gray-800">
              starts here.
              </h2>
          <div class="space-y-1 sm:space-y-2">
            <div class="mt-2">
           
              <p class="md:text-lg sm:text-base text-gray-800 ">
                Fulfil is your friend in finding jobs that pay well 
                </p>
                <p class="md:text-lg sm:text-base text-gray-800  ">
                and have promising career paths
                </p>
                <div class="mt-7 grid gap-3 w-full sm:inline-flex">
            <button
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => navigate("/OnboardingOneDoer")}
            >
              Let's get started
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
          
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default NoDegreeNoProblem