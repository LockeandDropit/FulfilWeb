import React, {useState} from "react";
import DoerHeader from "../components/DoerHeader";
import TreeTest from "./TreeTest"
import { Tooltip } from 'react-tooltip'

const CareerPaths = () => {



  



  return (
    <>
      <DoerHeader />
      <div className="max-w-[85rem] w-full mx-auto flex flex-col items-center align-center justify-center gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="mt-10 w-full flex flex-col">
          <h1 className="text-2xl font-semibold">Career Paths</h1>
          <select class="mt-2 py-3 px-4 pe-9 block sm:w-1/4 w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
            <option selected="">Open this select menu</option>
            <option>Carpentry</option>
            <option>HVAC</option>
            <option>Plumbing</option>
            <option>Trucking</option>
            <option>Welding & Metal Fabrication</option>
          </select>
        </div>
        <div className="p-2 mt-4 border rounded-md flex flex-col align-center justify-center items-center w-3/4">
          <div className="flex flex-col w-full  ">
            <p className="ml-2 text-2xl text-gray-800 font-medium">Trucking</p>
            <div className="flex flex-row align-center items-center space-x-3">
              <p className="ml-2" data-tooltip-id="my-tooltip"
  data-tooltip-content="Pay scales quickly"
  data-tooltip-place="bottom">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#48bb78"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </p>
              <p data-tooltip-id="my-tooltip"
  data-tooltip-content="Growing industry"
  data-tooltip-place="bottom">
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                 stroke="#808080"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </p>
              <p data-tooltip-id="my-tooltip"
  data-tooltip-content="Great work-life balance"
  data-tooltip-place="bottom">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                 stroke="#C70039"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
                  />
                </svg>
              </p>
              <Tooltip id="my-tooltip" />
              
                
              
              <div>
      {/* Hover over this div to hide/show <HoverText /> */}
   
    </div>
            </div>
          </div>
          <TreeTest />
        </div>
      </div>
    </>
  );
};

export default CareerPaths;
