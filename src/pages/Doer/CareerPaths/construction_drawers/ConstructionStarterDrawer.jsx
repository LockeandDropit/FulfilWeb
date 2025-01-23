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

const ConstructionStarterDrawer = ({ toggle, open }) => {
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
                          Become A Construction Laborer
                        </label>
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-4  font-medium text-gray-700"
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
                                  $60,000
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"
                            onClick={() =>
                              window.open(
                                "https://www.bls.gov/ooh/construction-and-extraction/construction-laborers-and-helpers.htm"
                              )
                            }
                          >
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
                                "https://www.indeed.com/jobs?q=construction&l=Minneapolis&radius=35&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.psKIQBKEhrPMEUky6BZM8d1c2zpKMe2tHD11UUb-ndn22aTMf7k_-f_NSP2X7uRqP9ktYP9p0xNHos0E959M_bMi2Ga1hkv31cMUbH4HKZF79miCjVo7LZ8LklKg-HIKKxZYoqo-iFNIYqlGIPgAdkpqucT2RIMmIG5o3wmq8KmOfixlJmGyvi8XwRKAKvK82VpP-YMvWkKzl-Rc6p5eBu9s0tPOF3G71dGAwJAohONfJqqwfffvqRLAawee7YVOMKBeFlDkRkLtr0X2mFRN6ctTAG0RPbfoq_5fGnr9aqPRcJkufED1h47EmmAjybB1LlqlSUI2hyYX0jaOQaSOLTYPAGa1bS8IssbOatoZx5qgITDwr-aGQmLhoNnKXmyLV7jf-gfBFnQn347rP1wYelvYDc2BRwgJVD6fR_cy0ZvE3i_9gwKfK7P1OwxkSCmgDLwKxgLxtcFDH93AR4RQNYsb9geEPsQE_pfFyAFYziy3C2vEMZVGxixLNJnwzlINvGps8XgJxqqrdbn0nNpwOxsqpcrTpF6ayoIfLPE8mIhNvEajJuHWg32dOAQjXDtkLe5KlJVpEDDUAeoUrB09JTT_3vPfbweukmG8LoWltFdy4FTseS5ctRHa3AuxwkE_xEy6q-ASu4hawwh1vSnnb4StofaqDxZYyXeCip2paffUUYPE2K9JxKYeITUcouZPgvwtGIg3vTjjmRB52ZEJjmrDW6fJ0_wC6EC7XNEOSjQ3rUqSpJV9UJNrRvCtGZHxrFhCS2X73Y0p_eMz4kW4GnsVYkLS0u0GN4RmQNma_qCf1kR6wMQptVF_xnvyL2DMB03vei1yYC_ZBLguOOHpXQ.aUjmfM9_QsI-TkW1Fjfjsw.3fe1c89ad3ea77f552f1070645d763962a35f315a8423f9292d58b5c25dc0d7b&vjk=2e26ddc87f320a53"
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
                                  1,000+
                                </h3>
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
                          <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/yY0AoEguD4Y"
                            title="Day in the Life: General Laborer"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
                          ></iframe>
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
                                src="/landingImages/constructionlogo.jpg"
                                alt=""
                                class="shrink-0 size-7  "
                                width="32"
                                height="32"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 class="font-medium text-gray-800">
                              Construction Laborer
                            </h3>
                            <h3 class="font-medium text-gray-800">
                              Standard Water Control Systems
                            </h3>
                            <h3 class="text-sm text-gray-500">
                              Various locations, MN
                            </h3>

                            <p class="mt-3 text-gray-700 line-clamp-4">
                              Perform general labor such as jack hammering,
                              digging, hauling dirt, gravel and concrete.
                            </p>
                          </div>
                          <div className="flex items-center justify-center mt-auto mb-1">
                            <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-sky-400 text-white  shadow-sm hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                              onClick={() =>
                                window.open(
                                  "https://standardwater.com/employment/"
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

export default ConstructionStarterDrawer;
