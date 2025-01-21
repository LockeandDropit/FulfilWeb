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

const HVACSpecialistInstallerDrawer = ({ toggle, open }) => {
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
                      <div className="flex">
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-2 text-2xl font-medium text-gray-900"
                        >
                          HVAC Specialist/Installer
                        </label>
                      </div>

                      <div class="space-y-2 ">
                        <div class="flex align-items-center">
                          <p className="text-md font-medium ">
                            Average Salary:
                          </p>
                          <p className="ml-1 text-md font-medium ">
                            $55,000 - $75,000
                          </p>
                        </div>
                      </div>
                      <div class="space-y-2 ">
                        <div class="flex align-center  items-center">
                          <p className="text-md font-medium ">
                            Industry Growth:
                          </p>
                          <p className="ml-1 text-md font-medium text-green-600">
                            4.5%
                          </p>

                          <svg
                            class="shrink-0 size-5 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#48bb78"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                          </svg>
                        </div>
                      </div>
                      <div class="space-y-2 ">
                        <div class="flex align-center items-center">
                          <p className="text-md font-medium ">
                            Openings Near You:
                          </p>

                          <p
                            className="ml-1 text-md text-gray-800 hover:text-gray-900 font-medium cursor-pointer hover:underline"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=class+a+cdl+driver&l=Minneapolis%2C+MN&from=searchOnDesktopSerp%2Cwhatautocomplete&vjk=cb01c123a1e663fa"
                              )
                            }
                          >
                            2,490
                          </p>
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
                        Focuses on complex system installations or specializes
                        in specific areas, such as refrigeration, geothermal
                        systems, or energy-efficient HVAC solutions.{" "}
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
                              Design and install advanced HVAC systems tailored
                              to customer needs.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Provide expertise in specialized areas (e.g.,
                              large-scale refrigeration).
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Ensure compliance with energy efficiency standards
                              and regulations.
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
                              NATE Certification or equivalent.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              5+ years of experience in HVAC installation or a
                              specific specialization.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                              Advanced technical knowledge of system design and
                              implementation.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-lg font-medium text-gray-900 "
                      >
                        Open Positions
                      </label>
                      <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                        <div class="flex justify-between">
                          <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                            <img
                              src="/landingImages/comfortmatterslogo.jpg"
                              alt=""
                              class="shrink-0 size-6"
                              width="32"
                              height="32"
                            />
                          </div>
                        </div>

                        <div>
                          <h3 class="font-medium text-gray-800">
                            Residential HVAC Service Technician
                          </h3>
                          <h3 class="font-medium text-gray-800">
                            Comfort Matters
                          </h3>
                          <h3 class="text-sm text-gray-500">
                            Various locations
                          </h3>
                          <div className="mt-1 flex flex-row">
                            <h3 class="text-sm text-gray-500 line-clamp-1">
                              <span className="font-medium text-sm text-gray-800">
                                Salary:
                              </span>{" "}
                              $75,000 - $135,000
                            </h3>
                            <span class="ml-1 inline-flex items-center gap-x-1 text-xs font-medium text-green-500 rounded-full">
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
                              25% pay increase
                            </span>
                          </div>
                          <p class="mt-3 text-gray-700 line-clamp-4">
                            Apply to open positions that provide on the job
                            training. Learn to install, maintain, and repair all
                            HVAC related equipment.
                          </p>
                        </div>

                        <div className="flex items-center justify-center mt-auto mb-1">
                          <button
                            type="button"
                            class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                            onClick={() =>
                              window.open(
                                "https://www.comfortmatters.com/contact/careers/residential-hvac-installer"
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default HVACSpecialistInstallerDrawer;
