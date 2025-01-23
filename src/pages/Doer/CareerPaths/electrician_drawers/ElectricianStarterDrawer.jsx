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
import ReactPlayer from "react-player";

const ElectricianStarterDrawer = ({ toggle, open }) => {
  const handleClose = () => {
    toggle();
  };
  const url = "https://www.youtube.com/watch?v=Fbp5KltYAXk";

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
                          Become An Electrician
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
                                  $60,000
                                </h3>
                              
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col bg-white border shadow-sm rounded-xl"  onClick={() =>
                            window.open(
                              "https://www.bls.gov/ooh/construction-and-extraction/carpenters.htm"
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
                                 5.7%
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=electrician&l=Minneapolis&radius=35&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.1VOlPTdlHLLed2mRuh9t6VOYUQv4gTuIbzNxYraccjQjTJF3_VINrmf_EOrY4bNkB9r7WVB9eBTjszBZE6i336i4IHBP-Mq-zYLqjgoh9LGnBRLrL-lLCw5ZlnoCPLIcaYvzeJW0D2lNXgItPIn3uGlSS-iEBy5p0uQfcH8dl3W1uQl7mbF3CGPxyedyQjA3ZVirq5_7A2Wt69dgG9W03N7x4SLDpabpenuN2ANzHxqXOJsPeB6uvUmmUUQX4QI2k1wNUdKZLdTPKjSLgTYyCIhCDOOB6mUL1yuNWBAOHXL6N5xL6z5z8NgJazpPpQFAeF7ADqlCasu4kV2O_I3sTRGsnO4akPNsaz1i12VPycSLY-mEbyqgod3QAELp3tM2TEsMZuLjOOR-96H-0Cib0JslzzeAdY87sOFyVgaXv4axIOPUUroCriFvJ_pZVcILSbkPQh1gZAMsRgSBPJUU9Fl2W5UCUGbdxNFtg1jyD_vVW4KZq4acdIRLFr-hS9PvCH29RUBSI7xtqFr3tiy7bsF80eI2Hzsuue5beoTEi25_uJMHlpYn_Y-3CCG094h2qme5wnhAR90V2zuceULNAg_dm1Wlrsvod2VnyIRj215SlvqJevj6RRwybmHsfIoLKFdJh9qoIfMGUygvI0TrUQG63rCGNa8ir31mwgWSSc7KU7y1WC5qsBbGPsLhwNXeAeIRtX5o0HJVyK9z86J23O14sDyqin8FiygsM2cON6xtiy4O7Nx8Eow4iF4-qpJlBxcYP1CbblQgVuwEQ-SNOZYlKo6eSn_x_iTqKPlibzzJqKWlaH4e6WQuVSKs4JYsGO1UA7eWee3e8Np13ZUkAg.3ZX1rnwDbss7I5dDiBKMKg.20516c5b4a5ae849ae8d893b9cc7a69a1139ee9b3fd8db9e3005572ad565ebc6&vjk=83c9ab6391446098"
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
                                  100+
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
                    
                     
                    </div>
                    <div>
                    <label
                        for="dactmi"
                        class="block mt-4 mb-2 text-xl font-medium text-gray-800 "
                      >
                        A Day In The Life
                      </label>
                      <div class="mt-4 relative max-w-5xl mx-auto mb-1 ">
                        <div class="w-full object-cover h-[480px] sm:h-80 rounded-xl">
                        <iframe className="w-full h-full" src="https://www.youtube.com/embed/O7VmwkrhqiY" title="DAY IN THE LIFE OF AN ELECTRICIAN - Electrician Life" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2 mt-6 mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-xl font-medium text-gray-800 "
                      >
                        Get Started!
                      </label>
                      <div class="mb-4">
                        <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                          <div class="flex justify-between">
                            <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                              {/* <img
                                src="/landingImages/HTClogo.jpg"
                                alt=""
                                class="shrink-0 size-7  "
                                width="32"
                                height="32"
                              /> */}
                            </div>
                          </div>
                          <div>
                            <h3 class="font-medium text-gray-800">
                              Electrician Apprenticeship
                            </h3>
                            <h3 class="font-medium text-gray-800">
                             IBEW 292
                            </h3>
                            <h3 class="text-sm text-gray-500">
                              Minneapolis, MN
                            </h3>
                            {/* <div className="mt-1 flex ">
                              <h3 class="text-sm text-gray-500 line-clamp-1">
                                <p className="mr-1 font-medium text-sm text-gray-800">
                                  Avg. Salary:
                                </p>{" "}
                                $65,000
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
                            </div> */}
                            <p class="mt-3 text-gray-700 line-clamp-4">
                           Learn the foundations of the trade by applying for this pre-apprentice role. Get paid to increase your earning potential.
                            </p>
                          </div>
                          <div className="flex items-center justify-center mt-auto mb-1">
                            <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-sky-400 text-white  shadow-sm hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                              onClick={() =>
                                window.open(
                                  "https://mplsjatc.org/pre-apprentice/"
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

export default ElectricianStarterDrawer;
