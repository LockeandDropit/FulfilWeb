import React from "react";
import wave2 from "../../components/svgs/wave2.svg"


const WhatUsersGet = () => {
  return (

    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 class="text-2xl font-bold md:text-3xl md:leading-tight text-gray-800 ">
          When using Fulfil, our users get:
        </h2>
      </div>

      <div class="max-w-5xl mx-auto">
        <div class="grid sm:grid-cols-2 gap-6 md:gap-12 items-center justify-center align-center ">
          <div className="relative">
            <img src="/landingImages/verticalClarity.jpg" alt="" className="rounded-lg" />
            <div class="absolute inset-0 -z-[1] bg-gradient-to-tr from-sky-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6"></div>
            
          </div>

          <div className="items-center justify-center align-center "
           >
            <h3 class="text-2xl font-semibold text-gray-800 ">Clarity</h3>
            <p class="mt-2 text-gray-600 text-lg">
              At Fulfil, we provide a straightforward pathway to successful
              careers. With the job market constantly evolving, we help you
              navigate your options by identifying professions that are thriving
              and align with your skills and interests. Our resources and
              insights empower you to make informed decisions about your future,
              ensuring that your hard work leads to meaningful rewards.
            </p>
            <h3 class="mt-6 text-2xl font-semibold text-gray-800 ">Guidance</h3>
            <p class="mt-2 text-gray-600 text-lg">
              We provide personalized, tailored advice to help you take
              meaningful steps in your career. Our expert-designed assessments
              and career planning tools help you identify your strengths and
              align them with in-demand professions. We truly believe that each
              individual has fantastic potential and is capable of creating
              immense value for society.
            </p>
          </div>
        
          <div className="md:mt-6 items-center justify-center align-center">
            <h3 class="text-2xl font-semibold text-gray-800 ">Opportunity</h3>
            <p class="mt-2 text-gray-600 text-lg">
              We don’t just connect you with jobs, we connect you with
              opportunities that match your passions, strengths, and goals.
              Fulfil is here to open doors to careers that truly fit who you are
              and where you want to go.
            </p>
            <h3 class="mt-6 text-2xl font-semibold text-gray-800 ">Growth</h3>
            <p class="mt-2 text-gray-600 text-lg">
              When you've been in the same place in your career for too long, we
              can help you take that next step. Whether it's upskilling for a
              promotion or transitioning to a new industry, Fulfil provides the
              resources and support you need to grow. We don't want you to
              regret not taking action 10 years from now!
            </p>
          </div>

          <div className="relative">
          <img src="/landingImages/verticalGuidance.jpg" alt="" className="rounded-lg md:mt-6" />
          <div class="absolute inset-0 -z-[1] bg-gradient-to-tl from-sky-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:ms-6"></div>
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default WhatUsersGet;
