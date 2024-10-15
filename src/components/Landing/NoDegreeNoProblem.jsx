import React from 'react'
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const NoDegreeNoProblem = () => {
  const navigate = useNavigate();
  return (
   <>
    <div class="bg-white  sm:mt-0 rounded-md ">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className=''>
  <path fill="#E0F2FE" fill-opacity="1" d="M0,192L48,181.3C96,171,192,149,288,128C384,107,480,85,576,106.7C672,128,768,192,864,202.7C960,213,1056,171,1152,138.7C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
</svg>
    <div class="w-full px-4  sm:mt-0sm:px-6 lg:px-8 pb-10 mx-auto">
      <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
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
              onClick={() => navigate("/DoerMapLoggedOutClusterTest")}
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