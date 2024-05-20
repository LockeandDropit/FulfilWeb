import React from "react";
import LandingNeederMapScreen from "../LandingNeederMapScreen";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";



const MapHero = () => {


  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const navigate = useNavigate();
  return (
<>
{isDesktop ? (<div class="mt-20 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex lg:items-center items-center md:items-center">
<div class="w-full max-w-[50rem]rounded-lg ml-6">  <LandingNeederMapScreen /></div>


<div class="w-full justify-center">
  <div class=" bg-white  mt-4 rounded-xl shadow-sm ">
    <div class="p-4 sm:p-7">
      <h1 class="block text-3xl font-bold text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
        Know what you need?{" "}
      </h1>
      <p class="mt-3 text-lg text-gray-800">
        Post what you need done and let the professionals come to you
      </p>

      <div class="mt-5 lg:mt-8 ">
        <div class="w-full sm:w-auto">
          <label for="hero-input" class="sr-only">
            Search
          </label>
          {/* <input type="text" id="hero-input" name="hero-input" class="py-3 px-4 block w-full xl:min-w-72 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Enter work email"> */}
        </div>
        <button
          class="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => navigate("/NeederEmailRegister")}
        >
          Post my job
        </button>
      </div>
    </div>
  </div>
</div>


</div>) : (
<div>
<div class="mt-20 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex lg:items-center items-center md:items-center">
<div class="w-full justify-center">
  <div class=" bg-white  mt-4 rounded-xl shadow-sm ">
    <div class="p-4 sm:p-7">
      <h1 class="block text-3xl font-bold text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl">
        Know what you need?{" "}
      </h1>
      <p class="mt-3 text-lg text-gray-800">
        Post what you need done and let the professionals come to you
      </p>

      <div class="mt-5 lg:mt-8 ">
        <div class="w-full sm:w-auto">
          <label for="hero-input" class="sr-only">
            Search
          </label>
          {/* <input type="text" id="hero-input" name="hero-input" class="py-3 px-4 block w-full xl:min-w-72 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Enter work email"> */}
        </div>
        <button
          class="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => navigate("/NeederEmailRegister")}
        >
          Post my job
        </button>
      </div>
    </div>
  </div>
</div>


</div>
{/* <div class="mt-20 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex lg:items-center items-center md:items-center">
<div class="w-full rounded-lg ml-6">  <LandingNeederMapScreen /></div>
</div> */}
</div>)}
    </>
  );
};

export default MapHero;
