import React from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";

const Experience = ({ handleIncrementFormIndex }) => {
  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class=" pt-[59px]">
        <div class="max-w-6xl  border border-red-500">
          <div class="max-w-5xl px-4 py-10 sm:px-6  mx-auto">
            <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-800 ">Experience</h2>
               
              </div>

              <form>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-full-name"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Title
                  </label>
                 
                </div>

                <div class="sm:col-span-10">
                  <div class="sm:flex">
                    <input
                      id="af-account-full-name"
                      type="text"
                      class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Maria"
                    />
                    
                  </div>
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-full-name"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Company
                  </label>
                 
                </div>
                <div class="sm:col-span-10">
                  <div class="sm:flex">
                    <input
                      id="af-account-full-name"
                      type="text"
                      class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Maria"
                    />
                    
                  </div>
                </div>

                <div class="sm:col-span-7">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Employment Range
                  </label>
                  
                </div>
                <div class="sm:col-span-10">
                  <div class="sm:flex">
                    <input
                      id="af-account-full-name"
                      type="text"
                      class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Start date"
                    />
                    <input
                      type="text"
                      class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="End date"
                    />
                  </div>
                </div>
            

              
                <div class="sm:col-span-3">
                  <label
                    for="af-account-bio"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                   Job Description
                  </label>
                </div>

                <div class="sm:col-span-11">
                  <textarea
                    id="af-account-bio"
                    class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    rows="6"
                    placeholder="I am a hardworking individual who strives to create a thriving environment. I have strong communication skills and work well with others."
                  ></textarea>
                </div>

                <div class="mt-5 flex justify-end gap-x-2">
                  {/* <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleIncrementFormIndex}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Experience;
