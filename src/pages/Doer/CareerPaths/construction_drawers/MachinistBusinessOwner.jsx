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

const MachinistBusinessOwner = ({ toggle, open }) => {
  const handleClose = () => {
    toggle();
  };

  const url = "https://www.youtube.com/watch?v=9MhagGqLaFk";

  return (
    <div>
      {" "}
      <Drawer onClose={() => handleClose()} isOpen={open} size={"lg"}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <div class="">
              <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto">
                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div class="p-4">
                    <div class="cursor-default">
                      <div className="flex flex-col">
                        <label
                          for="hs-pro-dactmt"
                          class="block text-2xl font-medium text-gray-900"
                        >
                          Business Owner/Tooling Contractor
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
                                  $80,000 - $150,000+
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"
                            onClick={() =>
                              window.open("https://www.careeronestop.org/")
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
                                  3.7%
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=machining+contractor&l=Minneapolis%2C+MN"
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
                                  10+
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-900"
                        >
                          What you'll be doing
                        </label>
                        <div className="w-full prose prose-li marker:text-black mb-4">
                          Own and operate a machining business, securing
                          contracts, managing teams, and ensuring the production
                          of high-quality machined parts for clients.
                        </div>
                      </div>
                      <div className="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-800"
                        >
                          Key Responsibilities
                        </label>
                        <div className="mb-4">
                          <ul className="list-disc px-3">
                            <li class="mt-1 text-gray-700">
                              Bid on contracts and manage machining projects.
                            </li>
                            <li class="text-gray-700">
                              Hire and train machinists to deliver quality work.
                            </li>
                            <li class="text-gray-700">
                              Oversee production schedules and client
                              relationships.
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-800"
                        >
                          Qualifications
                        </label>
                        <div className="mb-4">
                          <ul className="list-disc px-3">
                            <li class="mt-1 text-gray-700">
                              10+ years of machining experience.
                            </li>
                            <li class="text-gray-700">
                              Business management and financial skills.
                            </li>
                            <li class="text-gray-700">
                              Knowledge of licensing and safety regulations.
                            </li>
                          </ul>
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

export default MachinistBusinessOwner;
