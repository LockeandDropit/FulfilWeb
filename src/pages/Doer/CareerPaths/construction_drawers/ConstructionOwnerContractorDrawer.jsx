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

const ConstructionOwnerContractorDrawer = ({toggle, open}) => {

    
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
  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto">
    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
      <div class="p-4">
        <div class="cursor-default">
          <div className="flex flex-col">
            <label for="hs-pro-dactmt" class="block text-2xl font-medium text-gray-900">
              Construction Business Owner/Contractor
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
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">$100,000 - $200,000+</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl" onClick={() => window.open("https://www.careeronestop.org/")}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase tracking-wide font-medium text-sky-400">Industry growth</p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">4%</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer" onClick={() => window.open("https://www.indeed.com/jobs?q=general+contractor&l=Minneapolis%2C+MN")}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase tracking-wide font-medium text-sky-400">Open Positions</p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800">30+</h3>
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
              Own and manage a construction business, secure contracts, oversee multiple projects, and ensure timely, high-quality project completion.
            </div>
          </div>
          <div className="space-y-2 mt-6 mb-4">
            <label for="dactmi" class="block mb-2 text-lg font-medium text-gray-800">
              Key Responsibilities
            </label>
            <div class="mb-4">
              <ul className="list-disc px-3">
                <li class="mt-1 text-gray-700">Secure contracts and manage client relationships.</li>
                <li class="text-gray-700">Oversee projects, finances, and schedules.</li>
                <li class="text-gray-700">Hire, train, and manage staff effectively.</li>
              </ul>
            </div>
          </div>
          <div className="space-y-2 mt-6 mb-4">
            <label for="dactmi" class="block mb-2 text-lg font-medium text-gray-800">
              Qualifications
            </label>
            <div class="mb-4">
              <ul className="list-disc px-3">
                <li class="mt-1 text-gray-700">10+ years of construction experience.</li>
                <li class="text-gray-700">Strong business management and financial skills.</li>
                <li class="text-gray-700">Licenses and certifications as required in the region.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          </DrawerBody>
          <DrawerFooter>
        
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ConstructionOwnerContractorDrawer;
