import React from "react";

import { useNavigate } from "react-router-dom";

const MobileDoerCTA = () => {
  const navigate = useNavigate();
  return (
    <div class="bg-sky-400 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12 rounded-xl">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <div className=" items-center justify-center">
          <h1 class="block   mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight">
            Looking for work?
           
          </h1>
          </div>
          <p class="mt-3 text-lg text-white">
            Whether you're looking for more leads for your company or seasonal gigs, we've got you covered.
          </p>

          <div class="mt-7 grid gap-3 w-full sm:inline-flex">
            <button
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-white text-sky-400 hover:text-sky-500 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => navigate("/DoerEmailRegister")}
            >
              Create an account
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

        <div class="relative mb-5">
          <img
            class="w-full rounded-md"
            src="/landingImages/WindowInstallation.jpg"
            alt="Image Description"
          />
          <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>

          
        </div>
      </div>
    </div>
  );
};

export default MobileDoerCTA;
