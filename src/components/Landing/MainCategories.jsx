import React from "react";
import { useNavigate } from "react-router-dom";

const MainCategories = () => {
  const navigate = useNavigate();

  const handleNavigation = (x) => {
    navigate("/FunnelSelectedCategory", { state: { category: x } });
  };

  return (
    <div class="mt-20 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <h1 class="block text-xl font-bold text-gray-800 sm:text-4xl lg:text-4xl lg:leading-tight">
        Looking for a <span class="text-sky-400">Pro?</span>
      </h1>
      <p class="mt-3 text-lg text-gray-800">
        Browse our Doers by category and send them a message!
      </p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/DrivewayAsphalt.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Asphalt</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Asphalt")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/CarpentryTrim.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Carpentry</h3>
            <p class="mt-3 text-gray-500">
              From simple framing to large scale industrial projects, our pros
              can get the job done.
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Carpentry")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img src="/landingImages/Cleaning.jpg" className="rounded-t-xl" />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Cleaning</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Cleaning")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img src="/landingImages/Drywall.jpg" className="rounded-t-xl" />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Drywall</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Drywall")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/GutterCleaning.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Gutter Cleaning</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Gutter Cleaning")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/RoofingSiding.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Roofing</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your roofing needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Roofing")}
            >
              See Pros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCategories;
