import React from "react";
import { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const PlumberMasterDrawer = ({ toggle, open }) => {
  const handleClose = () => {
    toggle();
  };

  return (
    <div>
      {" "}
      <Drawer onClose={() => handleClose()} isOpen={open} size={"lg"}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <div class="">
              <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                  <div class="p-4">
                    <div class=" cursor-default">
                    <div className="flex flex-col">
                        <label
                          for="hs-pro-dactmt"
                          class="block  text-2xl font-medium text-gray-900"
                        >
                    Master Plumber
                        </label>
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-4  font-medium text-gray-700"
                        >
                  Minneapolis, MN
                        </label>
                      </div>

                    
                      <div className="w-full  mx-auto">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="flex flex-col bg-white border shadow-sm rounded-xl">
                            <div className="p-4 md:p-5">
                              <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase font-medium tracking-wide text-sky-400">
                                  Avg. Salary
                                </p>
                              </div>

                              <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                  $80,000
                                </h3>
                              
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"  onClick={() =>
                            window.open(
                              "https://www.bls.gov/ooh/construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm"
                            )
                          }>
                            <div className="p-4 md:p-5">
                              <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                                  Industry growth
                                </p>
                              </div>

                              <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                 6%
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=plumber&l=Minneapolis&radius=35&vjk=ff9dc1d63ea6ffa5"
                              )
                            }
                          >
                            <div className="p-4 md:p-5">
                              <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                                  Open Positions
                                </p>
                              </div>

                              <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                  50+
                                </h3>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.25"
                                  stroke="currentColor"
                                  class="size-3 ml-1 hover:underline"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex"></div>
                    </div>

                    <div class="space-y-2 mt-6 mb-4 ">
                      <label
                        for="dactmi"
                        class="block mb-2 text-lg font-medium text-gray-900 "
                      >
                        What you'll be doing
                      </label>
                      <div className="w-full prose prose-li  marker:text-black mb-4 ">
                        The highest level of licensing for a plumber, allowing
                        them to take on large-scale projects, run businesses,
                        and oversee plumbing teams.{" "}
                      </div>
                    </div>

                    <div class="space-y-2 mt-6 mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-lg font-medium text-gray-800 "
                      >
                        Key Responsibilities
                      </label>

                      <div class="mb-4">
                        <ul className="list-disc px-3 ">
                          <li class="mt-1 text-gray-700">
                            <p className="">
                              Design and install complex plumbing systems for
                              large-scale projects.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Train and supervise journeymen and apprentices.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Apply for permits and ensure compliance with state
                              and local codes.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="space-y-2 mt-6 mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-lg font-medium text-gray-800 "
                      >
                        Qualifications
                      </label>
                      <div class="mb-4">
                        <ul className="list-disc px-3 ">
                          <li class="mt-1 text-gray-700">
                            <p className="">
                              Additional experience (1-2 years as a journeyman)
                              and passing the master plumber licensing exam.{" "}
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Leadership and project management skills.{" "}
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="space-y-2 mt-6 mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-lg font-medium text-gray-800 "
                      >
                       Open Positions{" "}
                        <span
                          className="cursor-pointer hover:underline text-base text-gray-700 "
                          onClick={() =>
                            window.open(
                              "https://www.indeed.com/jobs?q=master+plumber&l=Minneapolis&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.JpSAvAFAYiFRZqdhdep5bxTbluLY6oGj-hQuzpJATTtrrZcsmovt6Ayjjryf5mg3EqtFdhIw-UqDAOE0Xn4-1cCT_tUKiCOKPVQV8A5vQajKcdnLPewx-CHQyc48htGowajXJGoKWOtGYoKHgC6vaRsmgQnnx8G220YQ_MZXPWbslTVkz8ZXMDwOVqInXGQ_pYdR47axhnxnJ1YYRW1wqollhliDcBXZarVLW1EY51rQz3PEXw461pSd4im7nWy9U-iU3y3O2zdndkOa2u-lEkwysiYm_0NL8by6rj1fMTMlmgol-iRXeYB9YwToaV_jebgr7x0-81OCdgV5FY7txPSLV8g8Kjo9XVioKHRRNImyfVahE78qlRURq7oKPblbPEUoyVbXtWQqMEbizauOHJwPFQmisH0UDehTM0kmyXReNbn06DaN-D6t_nER_c9sDoUJEcD2gtX_e-9fWct-nQl2GBalTdenZMH-atWu7WD-a2Z_9W27iK1Jbd7sivQYI3e_Iwmel_J3pQWklJq21CvtvRYJ3-tyUxYlF-4l_7HKIPBngSCq7f8KtTKIKKe32m2-qU85U9LpzjcwHUR_eAxamZr6RovK8mKDpp0g55QHl4ulGUC4FJf3SkZQsdpRuYkuq25jCNs8FF-Hi_CUxu5vet8Uo6AQpzvANLVUF6rlUXE1bRWx3J9TUERzH5IVc36YCY5cavNYFDLb2IRFOz-kZw7y60z1WbWnadyiCAwt7DuxNP93V_wdghv9LfHtbm1hq-l9zleVn0x8wigcDfNzmjmLAndjdN6VHVP2fOjhAlNq55wLK8XfVPk1tm3leJmPLj9uJ3JoPTfGY4xEUg.TNGwiUw5FCt0I6XTWwJ_uA.3f5a59d0741b449a94fad863e9d71cb4a9a366b5c2cf1aaf292a31b7b830aaa9&vjk=b63d3b8cf977117a"
                            )
                          }
                        >
                          (See more)
                        </span>
                      </label>
                      <div class="mb-4">
                        <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                          <div class="flex justify-between">
                            <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                              <img
                                src="/landingImages/streetplumbinglogo.jpg"
                                alt=""
                                class="shrink-0 size-6  "
                                width="32"
                                height="32"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 class="font-medium text-gray-800">
                            Licenced Plumber
                            </h3>
                            <h3 class="font-medium text-gray-800">
                              Street Plumbing Inc.
                            </h3>
                            <h3 class="text-sm text-gray-500">
                              Burnsville, MN
                            </h3>
                        
                            <p class="mt-3 text-gray-700 line-clamp-4">
                              Apply to open positions that provide on the job
                              training. Learn to install, repair, deal with
                              waste, vents, and water piping.
                            </p>
                          </div>
                          <div className="flex items-center justify-center mt-auto mb-1">
                            <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                              onClick={() =>
                                window.open(
                                  "https://www.streetplumbinginc.com/careers.html"
                                )
                              }
                            >
                              Apply
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.25"
                                stroke="currentColor"
                                class="size-3 hover:underline"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
        
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PlumberMasterDrawer;
