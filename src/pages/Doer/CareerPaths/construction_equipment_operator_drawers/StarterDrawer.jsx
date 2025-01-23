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

const StarterDrawer = ({ toggle, open }) => {
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
                          Become A Construction Equipment Operator
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
                                  $65,000
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl"
                            onClick={() =>
                              window.open(
                                "https://www.bls.gov/ooh/construction-and-extraction/carpenters.htm"
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
                                  5%
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=construction+equipment+operator&l=Minneapolis&radius=35&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.23JbTZcUv1XPFYvQJ6aGuYxlI7SZz1igyBcfapWZDQnMW7RQRrMXTD5Ph_TYZ0CNDvo7yfMclLihHTPZG5Q5RXyAv5i4hL0BgHbXwgkE7--a5bMjpmCF0b0RwGp3ePeqLzwdGyhT1-OG-YeWissMHnNP-MttOVKSL65aCdJKKhtphz0H1wcniPnq2XQLQzvpmEDKBvnoiAo6Pq8sGTZvLQoe57F_OAQNHw-Jer6YKdQTjeO76SXf2r6Mpev2xa9iH62B3w8_3dlX6GgEF0impTQ2yQk_rNuXLBe4hSCS8SOk-owuMc7gNxWkPbQDccYuC4it_ae8EU3QUzsPgXkidPrEb4JMiJk0_N1cJPnTOgVEcBG2ivs4Q85Ks0pYMN6IY4wYrwCjSDybdfp1s-QvuDTehQ5nAqOHrCPuj1fdZl6GxyyoAa1ab7TO3QAU2O_h-jJmVuwsgNV6DX8rB9bJPm3e5FxVkSUHUvp6aWqlE3u97cFGvcVIdWQakxv7HpSuH1TQ8gVcQr2G-ms5o36VLhhmBBwlrCanuLn-ya-Ekkt412G3oplUd7BjGfc7d5ev6hHBPhuw0UJEqo3Ctm6TpTQijhY9WeHBSQe12IQV55utzZBswUIatArqGIpa4kQO8FH1r4Z6DpYNMyWh6uStULhb4Wz83lkwigLR1BcIK17eeC6YhBcAxJ52wfFvhrQcj8wo1VJ3cqcW_6tx3bkioU8rlI7r1zLo9-jxFJP20IgyB5JvcnT4xv8B8YwaRTLFZhSVZjTY_ijo_n-KzSUd3O2U_noiVe5hfN6jYA4IPNxuY4lbKrOKiFwg5i1LfVSeMcGaJEXxp_3KvV1oSMRaVg.CbzAtgXXZRUyCMb4PlHUsw.d0cd84b840d5b8b48a5834455e8afe78b1609e9ca168e6ead0dc6ab955f10752&vjk=3ff8729739806e4f"
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
                        <iframe className="w-full h-full" src="https://www.youtube.com/embed/7OmPZDu2kO4" title="WHAT IT&#39;S LIKE TO BE A HEAVY EQUIPMENT OPERATOR || A day in the life of a heavy equipment operator" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
                                src="/landingImages/local49logo.jpg"
                                alt=""
                                class="shrink-0 size-7  "
                                width="32"
                                height="32"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 class="font-medium text-gray-800">
                             Heavy Equipment Operation Training
                            </h3>
                            <h3 class="font-medium text-gray-800">
                              Local 49
                            </h3>
                            <h3 class="text-sm text-gray-500">
                              Hinkley, MN
                            </h3>

                            <p class="mt-3 text-gray-700 line-clamp-4">
Learn how to operate heavy equipment safely and effectively.                            </p>
                          </div>
                          <div className="flex items-center justify-center mt-auto mb-1">
                            <button
                              type="button"
                              class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-sky-400 text-white  shadow-sm hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                              onClick={() =>
                                window.open(
                                  "https://www.iuoe.org/training/local-49-heavy-equipment-operator-training-school"
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

export default StarterDrawer;
