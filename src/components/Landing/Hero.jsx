import React from "react";
import { useNavigate } from "react-router-dom";
import posthog from "posthog-js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Hero = () => {
  const handleNavigateAndCaptureFunnel = () => {
    posthog.capture("logged_out_click_to_map");
    // navigate("/DoerEmailRegister");
    navigate("/OnboardingOneDoer");
  };
  const navigate = useNavigate();
  return (
    <div className="w-full h-[calc(100vh-80px)] sm:bg-landingHeroWave bg-no-repeat bg-bottom ">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 ">
        <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
          <div>
            <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl lg:leading-tight ">
              <span class="text-black">Fulfil is your career search assistant.</span>{" "}
            </h1>
           
           
            <p class="mt-3 text-lg text-gray-800 w-full lg:w-4/5">
              Fulfil connects you with high-paying entry-level jobs that are the start to great career paths. No experience needed.
            </p>

            <div
              class="mt-7 grid gap-3 w-full sm:inline-flex"
              onClick={handleNavigateAndCaptureFunnel}
            >
              <a class="py-3 px-4 inline-flex justify-center cursor-pointer items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-non">
                Browse careers
                <svg
                  class="shrink-0 size-4"
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
              </a>
            </div>
          </div>

          <div class="relative">
            <LazyLoadImage
      // height={"600px"}
      effect="blur"
      src="./landingImages/mediumHero.jpg"
  />
            {/* <img
            loading="lazy"
            class=" rounded-md"
            src="./landingImages/shake2.jpg"
          /> */}
            {/* <img
              loading="lazy"
              class=" rounded-md max-h-[700px] ml-auto"
              src="./landingImages/businessman-portrait-teamwork-as-employee-with-diversity-internship-candidates-opportunity-group-about-us-pride-office-company-training-as-creative-consultant-community.jpg"
            /> */}

            <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-sky-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
