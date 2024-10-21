import React from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const WhatWeOffer = () => {
  const navigate = useNavigate();

  return (
    <>
      <div class="w-full  mt-12 sm:mt-6 md:mt-0 ">
      
        <div class="max-w-[85rem]  py-10 pb-10 sm:px-6 lg:px-8 lg:py-14 mx-auto ">
          <div class=" p-5 sm:p-1 grid lg:grid-cols-3 gap-8 lg:gap-12 mb-10">
            <div class="lg:col-span-1">
              <h2 class="font-bold text-2xl md:text-3xl text-gray-800 ">
                Find employment in growing fields
              </h2>
              <p class="mt-2 md:mt-4 text-gray-500 ">
                Join one of countless growing industries that have great pay and
                a lot of open positions.
              </p>
            </div>

            <div class="lg:col-span-2">
              <div class="grid sm:grid-cols-2 gap-8 md:gap-12">
                <div class="flex gap-x-5">
                  <svg
                    class="shrink-0 mt-1 size-6 text-blue-600 "
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
                    <rect width="18" height="10" x="3" y="11" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" x2="8" y1="16" y2="16" />
                    <line x1="16" x2="16" y1="16" y2="16" />
                  </svg>
                  <div class="grow">
                    <h3 class="text-lg font-semibold text-gray-800 ">
                      Rewarding work
                    </h3>
                    <p class="mt-1 text-gray-600 ">
                      Work with your hands and your mind at the same time.
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5">
                  <svg
                    class="shrink-0 mt-1 size-6 text-blue-600 "
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
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  <div class="grow">
                    <h3 class="text-lg font-semibold text-gray-800 ">
                      Earn while you learn
                    </h3>
                    <p class="mt-1 text-gray-600 ">
                      Many entry level positions offer on-the-job training
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5">
                  <svg
                    class="shrink-0 mt-1 size-6 text-blue-600 "
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
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <div class="grow">
                    <h3 class="text-lg font-semibold text-gray-800 ">
                      Access resources
                    </h3>
                    <p class="mt-1 text-gray-600 ">
                      We connect you with resources that help you get into the
                      career you want.
                    </p>
                  </div>
                </div>

                <div class="flex gap-x-5">
                  <svg
                    class="shrink-0 mt-1 size-6 text-blue-600 "
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div class="grow">
                    <h3 class="text-lg font-semibold text-gray-800 ">
                      Union & non-union positions
                    </h3>
                    <p class="mt-1 text-gray-600 ">
                      Be part of a larger community searching for better
                      employment opprotunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="aspect-w-16 aspect-h-7 ">
            <LazyLoadImage
              effect="blur"
              src="/landingImages/car-care-woman.jpg"
            />
            {/* <img class="w-full object-cover sm:rounded-xl"  src="/landingImages/car-care-woman.jpg" alt="Features Image" loading="lazy"  /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatWeOffer;
