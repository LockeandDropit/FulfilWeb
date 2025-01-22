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

const EntryLevelCarpenterDrawer = ({toggle, open}) => {


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
  {/* <!-- Header Section --> */}
  <div class="">
    <h2 class="text-3xl font-bold text-gray-900">Entry-Level Carpenter</h2>
    <p class="text-lg text-gray-600">Kickstart your career in carpentry with hands-on experience and skill-building opportunities.</p>
  </div>

  {/* <!-- Content Section --> */}
  <div class="p-6 space-y-8">
    {/* <!-- Salary --> */}
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">Average Salary</p>
        <p class="text-2xl font-semibold text-gray-900">$30,000 - $45,000</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Industry Growth</p>
        <p class="text-2xl font-semibold text-green-600 flex items-center">
          3.5%
          <svg
            class="ml-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
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
        </p>
      </div>
    </div>

    {/* <!-- Openings --> */}
    <div>
      <p class="text-sm text-gray-500">Openings Near You</p>
      <a
        href="https://www.indeed.com/jobs?q=entry+level+carpenter&l=Minneapolis%2C+MN"
        target="_blank"
        class="text-2xl font-semibold text-[#38BDF8] hover:underline"
      >
        1,250 Jobs
      </a>
    </div>

    {/* <!-- What You'll Be Doing --> */}
    <div>
      <h3 class="text-xl font-bold text-gray-900">What You'll Be Doing</h3>
      <p class="text-gray-700 leading-relaxed">
        As an entry-level carpenter, you’ll assist with constructing, repairing, and installing structures such as walls, floors, and cabinets. Gain hands-on experience and learn under the guidance of seasoned professionals.
      </p>
    </div>

    {/* <!-- Key Responsibilities --> */}
    <div>
      <h3 class="text-xl font-bold text-gray-900">Key Responsibilities</h3>
      <ul class="list-disc space-y-2 pl-5 text-gray-700">
        <li>
          <span class="font-medium text-gray-900">Construction:</span> Build frameworks, walls, and doors using tools and materials provided.
        </li>
        <li>
          <span class="font-medium text-gray-900">Blueprint Reading:</span> Learn to interpret construction plans and follow technical specifications.
        </li>
        <li>
          <span class="font-medium text-gray-900">Tool Use:</span> Safely operate tools like saws, drills, and measuring devices.
        </li>
        <li>
          <span class="font-medium text-gray-900">Safety Compliance:</span> Follow safety guidelines to prevent injuries on the job site.
        </li>
      </ul>
    </div>

    {/* <!-- Qualifications --> */}
    <div>
      <h3 class="text-xl font-bold text-gray-900">Qualifications</h3>
      <ul class="list-disc space-y-2 pl-5 text-gray-700">
        <li>
          <span class="font-medium text-gray-900">Education:</span> High school diploma or equivalent. Vocational training in carpentry is a plus.
        </li>
        <li>
          <span class="font-medium text-gray-900">Physical Stamina:</span> Ability to lift heavy materials and perform manual labor.
        </li>
        <li>
          <span class="font-medium text-gray-900">Technical Skills:</span> Basic knowledge of tools, measurements, and construction techniques.
        </li>
      </ul>
    </div>
  </div>
</div>


          {/* <div class="">
  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto">
    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
      <div class="p-4">
        <div class="cursor-default">
          <div className="flex">
            <label
              for="hs-pro-dactmt"
              class="block mb-2 text-2xl font-medium text-gray-900"
            >
              Entry-Level Carpenter
            </label>
          </div>

          <div class="space-y-2">
            <div class="flex align-items-center">
              <p className="text-md font-medium">Average Salary:</p>
              <p className="ml-1 text-md font-medium">$30,000 - $</p>
              <label
                for="hs-pro-dactmt"
                class="block text-md font-medium text-gray-800"
              >
                45,000
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex align-center items-center">
              <p className="text-md font-medium">Industry Growth:</p>
              <p className="ml-1 text-md font-medium text-green-600">3.5%</p>

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
          <div class="space-y-2">
            <div class="flex align-center items-center">
              <p className="text-md font-medium">Openings Near You:</p>

              <p
                className="ml-1 text-md text-gray-800 hover:text-gray-900 font-medium cursor-pointer hover:underline"
                onClick={() =>
                  window.open(
                    "https://www.indeed.com/jobs?q=entry+level+carpenter&l=Minneapolis%2C+MN"
                  )
                }
              >
                1,250
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

        <div class="space-y-2 mt-6 mb-4">
          <label
            for="dactmi"
            class="block mb-2 text-lg font-medium text-gray-900"
          >
            What you'll be doing
          </label>
          <div className="w-full prose prose-li marker:text-black mb-4">
            Entry-level carpenters assist with constructing, repairing, and
            installing structures and frameworks such as walls, floors, and
            cabinets. They gain foundational skills while working under the
            guidance of experienced carpenters.
          </div>
        </div>

        <div class="space-y-2 mt-6 mb-4">
          <label
            for="dactmi"
            class="block mb-2 text-lg font-medium text-gray-800"
          >
            Key Responsibilities
          </label>

          <div class="mb-4">
            <ul className="list-disc px-3">
              <li class="mt-1 text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Construction:</span>
                  Assist in building frameworks, walls, floors, and doors using
                  tools and materials provided.
                </p>
              </li>
              <li class="text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Blueprint Reading:</span>
                  Learn to interpret construction plans and follow technical
                  specifications.
                </p>
              </li>
              <li class="text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Tool Use:</span>
                  Operate basic tools like saws, drills, and measuring devices
                  safely.
                </p>
              </li>
              <li class="text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Safety Compliance:</span>
                  Follow safety guidelines to prevent injuries and accidents on
                  the job site.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="space-y-2 mt-6 mb-4">
          <label
            for="dactmi"
            class="block mb-2 text-lg font-medium text-gray-800"
          >
            Qualifications
          </label>

          <div class="mb-4">
            <ul className="list-disc px-3">
              <li class="mt-1 text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Education:</span>
                  High school diploma or equivalent. Vocational training in
                  carpentry is a plus.
                </p>
              </li>
              <li class="text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Physical Stamina:</span>
                  Ability to lift heavy materials, stand for extended periods,
                  and perform manual labor.
                </p>
              </li>
              <li class="text-gray-700">
                <p className="">
                  <span className="font-medium mr-1">Technical Skills:</span>
                  Basic knowledge of tools, measurements, and construction
                  techniques.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> */}

          </DrawerBody>
  
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EntryLevelCarpenterDrawer;
