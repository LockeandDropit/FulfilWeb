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

const PlumberApprenticeDrawer = ({toggle, open}) => {


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

                       Plumber Apprentice
                        </label>
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-4 font-medium text-gray-700"
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
                                  $35,000
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
                      Learn the trade under the supervision of licensed plumbers. Gain hands-on experience with basic plumbing tasks and safety practices.
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
                             
                            Assist with pipe installation, repairs, and maintenance.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                           
                            Learn to read blueprints and understand plumbing systems.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Handle simple tasks such as unclogging drains and replacing fixtures.
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
                            High school diploma or GED.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Enrollment in an apprenticeship program (typically 4-5 years).
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Basic mechanical aptitude and problem-solving skills.
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
                              "https://www.indeed.com/jobs?q=plumbing+apprentice&l=Minneapolis&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.OHdoO8CxM-l0xV3ZfMK20ccqd7KmnXZlZ9Uo-s1Ls6ripNTpzBEExiqW6sdN5u6aLzRMnYiRKnZ_jqFegyL_LRiAPhS6x1QQjthZP8ofqipLwiEeZWq-O3jZKo-xv8swRiB1FsK7HtVd01Ahe0x-nJVzBy4RzupeDiiC2Olqr4lxup-Fyz2gH8ZsAh1gsmciQu2YEYa3VUhVlctLI4_Xiye9U-bHkeSnl1DAgC119GgqeOM6i2G2lCe7uLSH1I1R7-1lG5tFJ8Z0lDNpH_7oBgcwngGa59HWG-mHlEsFLjamOKzMK7CYS0hl-wNoEjNWJg_t-t4AmMANIjk3GLt0NoKyW9Nxh9doyAslGnzewNIHXhkxMcrvhgIDBNunLvpZuQMUghWq9hdBcWHvYxCJfo3JwmDJYRYG_WC2tdX8xA-IZeR6XEG35Jq94RfbNLxWhws4g-av5FhUq6bIW88s7jh0TUrKhUWkjny2OQylZWGnWYi388VsbWqVAP6bF_0wtjsh3uphnxrvnr73i-uhtdFzj8JAZ-1gnkTgwQ9ne3xaCvsixBLQu8KZv8-cPVn2EjrxaKgv-TJ3HQEQ_skbPSbC1ynKTaTa8ErY_uFUEpUoJRoCZdMJbToj4sE2I_p1MbzKhYOXuz00JQICwVaaPExx9r1DWdVKi6jcrBQ9I1nTKWZNoNppO3ac3iwYyzL8-A4xP4vf1g56D8Rv9Dro1znTuGOgRGghCGIfOvYCAwxhjlfOfkxtDv3xpnN8QSVXU_qM4R3ORVPMFOgYSIsVV8-RTCEf7iRUTeEvzmhhmNTVodIHmm9-KU5hxiIKpVmORVXBMG1tnE_MFVTsDGlDlw.E1E0sBlVaJ1F8UCXzumtag.dc89caeabbac1274618a27261524a9b61e371187649bae178ec96f20891466b3&vjk=ec90ab1d9df762bf"
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
                              Plumbing Apprentice
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
                            {/* <button
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
                            </button> */}
                             <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
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

export default PlumberApprenticeDrawer;
