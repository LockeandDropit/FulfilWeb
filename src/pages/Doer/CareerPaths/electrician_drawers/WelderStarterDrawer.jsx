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

const WelderStarterDrawer = ({ toggle, open }) => {
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
                          Become A Welding Professional
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
                                  $55,000
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
                                 4%
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=carpenter&l=Minneapolis&radius=35&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.rHI7DH5U9Eud7zkFCVbrcpn6OTBSwH1zujL62LQPsX2y9gmuW7nSdMCwSM1LO_gawmfbJgsFT3FnsiGE5azd4uf-zEV4_Zox5HU45HtJrA0gpe9tRm89SBFlEHspW-WTdqLRIWHuJMBNh40nZNbZnjXzVv7S_qNMHkdJ2NRDkULC6YLhl3ZEE9mBcriYwgRmI0tqBSg4lLBiJlrM1lL1BkBbnf-e3OGjUUTQsJK-UJZNVjB6hWkKOrQKGoXo2qGERn21US2Et9k4Nq3PV5dxiIeXEG4MvElaqG3Bmvv19QIzr6sevcCh4UBJhgBuAwu6hysF4kX9VQj186cKDL-Oz6D-YI8A_UiVjvoxGJ2FKliFaqZ1solx8PQIyKmEr2aPYLPg5erQQXK9TKWlI9yWHVszfIQ0LpiKWRb4BGQYzoJ9H_BAUFlJThYpfAf_T5S9b6PlqjD9KD_-trHfRczFX7jQUwgnoCq9oePT1uIPsoTs40-TaYKjYYflcJjgxHeBakgfr-g0N9e7lUvm9YFh-X3NW1xPAEi_UlG9Y97lhPYXaDjiQbLp-cnfkJXpVSbROjodN0-gOfwLeMzqo3njWhiY897NX_p4WUef5cNfUvdT5IKD48FE8MtaPfZiMJVPRhAKiD_BwlkPCmdZSuk1RNAl2JJFA1kgh3iG10DVXgsW4GNR8yCngnN1JDHg-RGeOlt_foi9IMj9M38nxW75dwASaFX1cUYY5GH6ERJj92fbHdKO08SllYnHUaGRlaNodqhoL7XDyt152lBieRxHTz1kudGJEFuP15dXxMI6n2YRweZckboYRp9slfPWCseFh_U1DZuqoAVWG9wrosdBdw.nTjTTysgRNOf71i722GVTA.9b7a8cb491fbf1e21702ef7bfba4b264e38b7e89cabc2b6024d37cea8ed5431b&vjk=662a6100533e4397"
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
                                  75+
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
                        <iframe className="w-full h-full" src="https://www.youtube.com/embed/TwzFaCxz274" title="A Day In The Life As A Welder" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
                              <img
                                src="/landingImages/HTClogo.jpg"
                                alt=""
                                class="shrink-0 size-7  "
                                width="32"
                                height="32"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 class="font-medium text-gray-800">
                              Welding & Metals Fabrication Training
                            </h3>
                            <h3 class="font-medium text-gray-800">
                              Hennepin Technical College
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
                            Hennepin Tech’s Welding and Metal Fabrication program provides hands-on training and in-depth knowledge of welding techniques to prepare students for the workforce. The program covers a range of skills, from basic welding to advanced techniques like MIG, TIG, shielded metal arc, and plasma arc welding, taught by industry experts.
                            </p>
                          </div>
                          <div className="flex items-center justify-center mt-auto mb-1">
                            <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-sky-400 text-white  shadow-sm hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                              onClick={() =>
                                window.open(
                                  "https://hennepintech.edu/academic-programs/manufacturing-engineering/welding.html"
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

export default WelderStarterDrawer;
