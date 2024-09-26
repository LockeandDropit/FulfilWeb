import React from 'react'
import { useNavigate } from "react-router-dom";
const NoDegreeNoProblem = () => {
  const navigate = useNavigate();
  return (
   
    <div class="bg-white mt-24 rounded-md">
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    
      <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
          <img class="rounded-xl" src="landingImages/positive-diverse-workers-unloading-boxes-warehouse.jpg" alt="Image Description" />
        </div>
        <div class="mt-5 sm:mt-10 lg:mt-0">
          <div class="space-y-6 sm:space-y-4">
          <h2 class="font-bold text-3xl lg:text-6xl text-gray-800">
              No degree? 
              </h2>
              <h2 class="font-bold text-3xl lg:text-6xl text-gray-800">
             No problem.
              </h2>
            <div class="space-y-2 md:space-y-4">
              {/* <h2 class="font-bold text-3xl lg:text-5xl text-white">
              No degree? No problem
              </h2> */}
              {/* <p class="text-white font-semibold md:text-lg sm:text-base">
               Fulfil is built with you in mind. Don't waste time repeatedly filling out the same forms. Just one click to apply.
              </p> */}
              <span class="md:text-lg sm:text-base text-gray-800 font-semibold ">
                Many entry level positions provide you technical on-the-job training, so you can earn money while developing your skills.
                </span>
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
         
            {/* <ul class="space-y-2 sm:space-y-4">
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full  text-gray-800 font-bold">
                  1.
                </span>
    
                <span class="md:text-lg sm:text-base text-white font-semibold">
                Many entry level positions provide you technical on-the-job training, so you can earn money while developing your skills.
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full text-gray-800 font-bold">
                 2.
                </span>
    
                <span class="text-sm sm:text-base text-gray-800">
                 Use Fulfil to chat with potential employers 
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full text-gray-800 font-bold">
                  3.
                </span>
    
                <span class="text-sm sm:text-base text-gray-800 ">
                  Find work close to you using our map
                </span>
              </li>
            </ul> */}
        
          </div>
        </div>
    
        {/* <div class="mt-5 sm:mt-10 lg:mt-0">
          <div class="space-y-6 sm:space-y-8">
        
            <div class="space-y-2 md:space-y-4">
              <h2 class="font-bold text-3xl lg:text-4xl text-gray-800">
                How easy is it?
              </h2>
              <p class="text-gray-500">
                All communication and payments are handled through our platform to ensure you're getting the highest quality of service.
              </p>
            </div>
         
            <ul class="space-y-2 sm:space-y-4">
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                  1.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                  <span class="font-bold">Post</span> what you need done
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                 2.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                 Hire the <span class="font-bold">contractor</span> you want
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                  3.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                 Pay through Fulfil when the job is <span class="font-bold">complete!</span>
                </span>
              </li>
            </ul>
        
          </div>
        </div> */}
   
      </div>
      
    </div>
    </div>
  
  )
}

export default NoDegreeNoProblem