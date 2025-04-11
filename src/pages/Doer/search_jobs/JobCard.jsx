import React from "react";
import { useSelectedJobStore } from "./SelectedJobStore";

const JobCard = ({ jobs }) => {


  const { setSelectedJob } = useSelectedJobStore();
  

  console.log("jobcaraas", jobs);

  

  return (
    <>
      {jobs ? (jobs?.map((job) => (
        <div className="flex flex-col sm:flex-row  p-1 w-full auto">
          <div class=" p-5 space-y-2 flex flex-col bg-white border w-full border-gray-200 rounded-xl shadow-sm hover:shadow-sm hover:ring-2 ring-sky-200 cursor-pointer" onClick={() => setSelectedJob(job)
          }>
            <div>
              <div className="flex justify-between">
                <h3 class="font-bold text-xl text-gray-800 line-clamp-1">
                  {job.job_title}
                </h3>
                <div class="flex justify-between min-w-fit pl-1">
                  <div class="flex flex-col justify-center items-center  ">
                    <span class="ml-1 inline-flex items-center gap-x-1 text-sm font-medium text-green-600 rounded-full">
                      5% raise
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
              </div>

              <div className="flex space-x-1.5 mt-1">
                {" "}
                <h3 class=" text-sm text-gray-600">{job.company}</h3>
                <ul className="flex flex-row gap-y-1 text-gray-600">
                  <li className="flex gap-x-1.5 text-sm text-gray-600">
                    <div className="shrink-0 size-1 mt-2.5  bg-gray-600 rounded-full"></div>
                    {job.location}
                  </li>
                </ul>
              </div>

              <h3 class="text-sm text-gray-500">
                <span className="text-sm  text-gray-600">{job.pay_range}</span>{" "}
              </h3>

              <p class="my-3 text-gray-600 line-clamp-3">{job.job_summary}</p>
            </div>

            <div className="flex mt-auto mb-1">
              <button
                type="button"
                class="w-1/4 ml-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 "
                //   onClick={() => handleOpenJob(job)}
              >
                Save
              </button>
              <button
                type="button"
                class="ml-1 py-2 px-3 w-3/4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                //   onClick={() => handleOpenJob(job)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ))) : (<p>loading </p>)}
    {/* <div className="flex w-full py-5 items-center px-2 ">
    <button
                type="button"
                class=" py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                //   onClick={() => handleOpenJob(job)}
              >
                Load more
              </button>
    </div> */}
    </>
  );
};

export default JobCard;
