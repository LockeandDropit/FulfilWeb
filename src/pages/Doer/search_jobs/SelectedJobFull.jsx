import { useState } from "react";

const SelectedJobFull = () => {
  const [drawerInfo, setDrawerInfo] = useState("q");
  return drawerInfo ? (
    <div class="pl-10 h-full overflow-y-scroll scrollbar">
      <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
        <div class="">
          <div class="p-4">
            <div class=" cursor-default">
              <div className="flex w-full">
                <div className="ml-auto flex space-x-3">
                  {" "}
                  <button  class=" py-2 px-3 inline-flex justify-center items-center gap-x-2 border border-gray-200  font-medium rounded-lg  bg-white  hover:shadow-sm ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" ml-auto cursor-pointer size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  </button>
                 
                  <button
            type="button"
            class="py-2 px-5 w-3/4 inline-flex justify-center items-center gap-x-2  font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
            //   onClick={() => handleOpenJob(job)}
          >
            Apply
          </button>
                </div>
              </div>
            </div>

            {/* Customer Story Content */}
            <div className="mx-auto">
              {/* Grid */}
              <div className="flex flex-col lg:flex-row lg:justify-between gap-y-5 gap-x-10">
                {/* Center Content */}
                <div className="lg:max-w-xl w-full">
                  {/* Heading */}
                  <div className="pb-2 mb-6 lg:pb-2 lg:mb-3 lg:last:pb-0 last:mb-0 lg:last:border-b-0 border-b border-gray-200">
                    <h1 className="font-semibold text-2xl lg:text-3xl text-gray-800">
                      Title
                    </h1>
                    <h1 className="font-medium text-lg  text-gray-700">
                      Minneapolis, MN
                    </h1>
                    <h1 className="font-medium text-lg  text-gray-700">
                      Company
                    </h1>

                    <div className="flex mt-4 mb-4 w-3/4 justify-between">
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                        Salary: $84,000
                      </span>
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                        Full-Time
                      </span>
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                        Salary: $84,000
                      </span>
                    </div>
                  </div>
                  {/* End Heading */}

                  <div className="space-y-7 pb-6 mb-6 lg:pb-10 lg:mb-10 lg:last:pb-0 last:mb-0 lg:last:border-b-0 border-b border-gray-200">
                    <h4 className="font-medium text-lg text-gray-800">
                      About The Job
                    </h4>

                    <p className="text-gray-600">
                      As one of the world's leading e-commerce platforms,
                      Shopify's engineering team manages hundreds of
                      applications that serve millions of merchants globally.
                      With their rapid growth came increasing complexity:
                    </p>

                    <ul className="flex flex-col gap-y-1 text-gray-600">
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Inconsistent UI components across different teams and
                        applications
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Lengthy development cycles for new features
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Difficulty maintaining design system compliance
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Growing technical debt from duplicate component
                        implementations
                      </li>
                    </ul>

                    <p className="text-gray-600">
                      "Before Preline, each team was essentially rebuilding the
                      same components with slight variations. It was becoming
                      unsustainable," explains Sarah Chen, Senior Engineering
                      Manager at Shopify.
                    </p>

                    <h4 className="font-medium text-lg text-gray-800">
                      Qualifications
                    </h4>

                    <ul className="flex flex-col gap-y-1 text-gray-600">
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Migrating existing components to Preline's ecosystem
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Training 2,000+ developers on the new system
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Establishing new development workflows around Preline's
                        tools
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        Creating custom plugins to integrate with Shopify's
                        internal tools
                      </li>
                    </ul>

                    <h4 className="font-medium text-lg text-gray-800">
                      Nice To Have
                    </h4>

                    <p className="text-gray-600">
                      Shopify implemented Preline's component library and
                      development toolkit across their entire organization. The
                      implementation process included:
                    </p>

                    <ul className="flex flex-col gap-y-1 text-gray-600">
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            40% Faster Development:{" "}
                          </span>
                          Teams now ship new features in less than half the time
                        </div>
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            90% Component Reuse:{" "}
                          </span>
                          Dramatic reduction in duplicate code
                        </div>
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            30% Fewer Bugs:{" "}
                          </span>
                          Standardized components led to more reliable
                          applications
                        </div>
                      </li>
                      <li className="flex gap-x-3">
                        <div className="shrink-0 size-2 mt-2 bg-gray-300 rounded-sm"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            100% Design Compliance:{" "}
                          </span>
                          Perfect alignment with Shopify's design system
                        </div>
                      </li>
                    </ul>

                    <p className="text-gray-600">
                      "Preline hasn't just given us a component library – it's
                      given us a new way of thinking about development," says
                      Michael Rodriguez, Director of Frontend Engineering. "Our
                      teams can focus on solving merchant problems instead of
                      rebuilding basic UI elements."
                    </p>

                    <h4 className="font-medium text-lg text-gray-800">
                      Benefits
                    </h4>

                    <p className="text-gray-600">
                      Following their successful implementation, Shopify is now
                      exploring advanced Preline features to further optimize
                      their development pipeline. They're working closely with
                      the Preline team to develop new capabilities that will
                      benefit both organizations.
                    </p>

                    <p className="text-gray-600">
                      "The partnership with Preline has been transformative,"
                      concludes Chen. "We're seeing benefits we didn't even
                      anticipate when we started this journey."
                    </p>
                  </div>
                </div>
                {/* End Center Content */}
              </div>
              {/* End Grid */}
            </div>
            {/* End Customer Story Content */}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div class="flex animate-pulse">
      <div class="ms-4 mt-2 w-full">
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
        </ul>

        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
        </ul>
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full"></li>
        </ul>
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full"></li>
        </ul>
      </div>
    </div>
  );
};

export default SelectedJobFull;
