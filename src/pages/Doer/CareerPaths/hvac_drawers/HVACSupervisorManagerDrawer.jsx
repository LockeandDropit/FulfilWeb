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

const HVACSupervisorManagerDrawer = ({toggle, open}) => {


  const handleClose = () => {
    toggle();
  }
    



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
                          class="block text-2xl font-medium text-gray-900"
                        >
                          HVAC Supervisor/Manager
                        </label>
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-4 font-medium text-gray-700"
                        >
                          Minneapolis, MN
                        </label>
                      </div>
                      <div className="w-full mx-auto">
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
                                $70,000 - $90,000
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/q-Entry-Level-Equipment-Operator-jobs.html"
                              )
                            }
                          >
                            <div className="p-4 md:p-5">
                              <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                                  Industry Growth
                                </p>
                              </div>
                              <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                  4.5%
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=HVAC&l=Minneapolis&from=searchOnHP&vjk=295fcc3b4d7cd88b"
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
                                  200+
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
                      A leadership role overseeing HVAC teams, managing projects, and ensuring the delivery of high-quality services.
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
                            Supervise HVAC technicians and manage daily operations.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Plan and oversee installations, repairs, and maintenance projects.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Ensure compliance with safety regulations and company policies.
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
                            7-10 years of experience in the HVAC industry.                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Strong leadership and organizational skills.                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Proficiency in project management tools and techniques.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <button
              type="button"
              class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              // onClick={() => onOpen()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Save
            </button>
            <button
              type="button"
              class="py-2 px-8 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              // onClick={() => onOpen()}
            >
              Get Started
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default HVACSupervisorManagerDrawer;
