import React from "react";

import { useNavigate } from "react-router-dom";

const MainHero = () => {
  const navigate = useNavigate();
  return (
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 class="block text-2xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight">
            Get hired without the headache.
            {/* <span class="text-sky-400">ease.</span> */}
          </h1>
          <p class="mt-3 text-lg text-gray-800">
            Apply to job listings close to home without having to submit a new resume over, and over and over <span class="text-gray-800 text-base">and over</span>  <span class="text-gray-800 text-sm">and over</span>  <span class="text-gray-800 text-xs">and over</span> <span class="text-gray-800 text-xs">and over.</span> 
          </p>

          <div class="mt-7 grid gap-3 w-full sm:inline-flex">
            <button
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => navigate("/DoerMapLoggedOut")}
            >
              Browse Jobs
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

          <div class="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5"></div>
        </div>

        {/* <div class="relative ms-4"> */}
        <div class="relative">
          <img
            class="w-full rounded-md"
            src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80" alt="Image Description"
          
          />
          <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>
        </div>
      </div>
    </div>
  );
};

export default MainHero;
