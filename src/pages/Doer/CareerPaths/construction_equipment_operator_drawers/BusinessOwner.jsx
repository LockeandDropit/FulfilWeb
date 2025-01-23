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

const BusinessOwner = ({ toggle, open }) => {
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
  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
      <div class="p-4">
        <div class=" cursor-default">
          <div className="flex flex-col">
            <label
              for="hs-pro-dactmt"
              class="block text-2xl font-medium text-gray-900"
            >
              Equipment Manager or Business Owner
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
                      $90,000 - $150,000+
                    </h3>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"
                onClick={() =>
                  window.open(
                    "https://www.indeed.com/q-Equipment-Manager-or-Business-Owner-jobs.html"
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
                      Stable
                    </h3>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://www.indeed.com/jobs?q=equipment+manager+business+owner&l=Minneapolis%2C+MN"
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
                      40+
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
          <div className="w-full prose prose-li marker:text-black mb-4 ">
            Overseeing equipment fleet operations or running a business that specializes in construction equipment services.
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
                <p>Manage equipment inventory, maintenance schedules, and budgets.</p>
              </li>
              <li class="text-gray-700">
                <p>Negotiate contracts with construction companies or project owners.</p>
              </li>
              <li class="text-gray-700">
                <p>Ensure compliance with industry regulations.</p>
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
                <p>12+ years of experience.</p>
              </li>
              <li class="text-gray-700">
                <p>Business management or finance knowledge is beneficial.</p>
              </li>
              <li class="text-gray-700">
                <p>Expertise in equipment maintenance and operations.</p>
              </li>
            </ul>
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

export default BusinessOwner;
