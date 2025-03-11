import React, { useEffect } from "react";
import { useState } from "react";

import { getDoc, doc, updateDoc } from "firebase/firestore";

const QuizResultJobs = ({result, handleOpenSignUp }) => {
  const [userResumeInformation, setUserResumeInformation] = useState(null);

  const [returnedJobs, setReturnedJobs] = useState(null);
  const [newReturnedEdu, setNewReturnedEdu] = useState(null);
  const [loading, setLoading] = useState(true);

console.log("handle open sign up", handleOpenSignUp)


  useEffect(() => {
    if (result) {
      setTimeout(() => {
        setLoading(false);
    
      }, 2000);
    }
  }, [result]);

  const handleOpenJob = (x) => {
    window.open(x.link);
  };

 let recommendedEdu = null;

  return (
    <div className="w-full  py-6 py-12 mb-10">
      <div class="max-w-[85rem] mx-auto mt-6  px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-row w-full">
          <div>
            <h1 class="block text-xl font-semibold text-gray-800 sm:text-xl lg:text-2xl lg:leading-tight ">
              Openings
            </h1>
            <p class="mt-2  text-gray-800">
              Opportunities in your field to grow your skill set and earning
              potential.
            </p>
          </div>
        
        </div>

        <div className="flex flex-col sm:flex-row mt-4 md:mt-4">
          {!loading &&
            result?.job_openings.map((edu) => (
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center rounded-lg ">
                      <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                        {edu.percent_increase}% pay increase
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
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                          <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-800">
                      {edu.job_title}
                    </h3>
                    <h3 class="font-medium text-gray-800">{edu.company}</h3>
                    <h3 class="text-sm text-gray-500">{edu.location}</h3>
                    <div className="mt-1 flex ">
                      <h3 class="text-sm text-gray-500">
                        <p className="mr-1 font-medium text-sm text-gray-800">
                          Avg. Pay Rate:
                        </p>{" "}
                        {edu.pay_rate}
                      </h3>
                    </div>
                    <p class="mt-3 text-gray-700 line-clamp-4 ">
                      {edu.job_description}
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50  "
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                      onClick={handleOpenSignUp}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {loading && (
            <div className="flex flex-col sm:flex-row sm:w-full">
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                      onClick={handleOpenSignUp}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultJobs;
