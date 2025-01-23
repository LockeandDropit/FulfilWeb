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

const MachinerySpecialistDrawer = ({ toggle, open }) => {
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
  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto">
    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
      <div class="p-4">
        <div class="cursor-default">
          <div className="flex flex-col">
            <label for="hs-pro-dactmt" class="block text-2xl font-medium text-gray-900">
              Machinery Specialist
            </label>
            <label for="hs-pro-dactmt" class="block mb-4 font-medium text-gray-700">
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
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">$65,000 - $85,000</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl" onClick={() => window.open("https://www.bls.gov/")}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase tracking-wide font-medium text-sky-400">Industry growth</p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">6%</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer" onClick={() => window.open("https://www.indeed.com/")}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase tracking-wide font-medium text-sky-400">Open Positions</p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">50+</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-6 mb-4">
            <label for="dactmi" class="block mb-2 text-lg font-medium text-gray-900">
              What you'll be doing
            </label>
            <div className="w-full prose prose-li marker:text-black mb-4">
              Specialize in specific machinery, such as CNC machines or robotics, and perform advanced diagnostics, repairs, and system optimization.
            </div>
          </div>
          <div className="space-y-2 mt-6 mb-4">
            <label for="dactmi" class="block mb-2 text-lg font-medium text-gray-800">
              Key Responsibilities
            </label>
            <div class="mb-4">
              <ul className="list-disc px-3">
                <li class="mt-1 text-gray-700">Install, maintain, and optimize specialized equipment.</li>
                <li class="text-gray-700">Train others on using advanced machinery.</li>
                <li class="text-gray-700">Perform complex diagnostics and system repairs.</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2 mt-6 mb-4">
            <label for="dactmi" class="block mb-2 text-lg font-medium text-gray-800">
              Qualifications
            </label>
            <div class="mb-4">
              <ul className="list-disc px-3">
                <li class="mt-1 text-gray-700">5-7 years of experience in industrial maintenance.</li>
                <li class="text-gray-700">Advanced certifications in specific machinery systems.</li>
                <li class="text-gray-700">Expertise in automation or hydraulic systems.</li>
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

export default MachinerySpecialistDrawer;
