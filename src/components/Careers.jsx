import React from "react";
import LoggedOutHeaderAbout from "./Landing/LoggedOutHeaderAbout";
import Footer from "../components/Footer.jsx";
const Careers = () => {
  return (
    <div className="">
      <LoggedOutHeaderAbout />
      <>
        <div class="sm:hidden px-4 sm:py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div class="min-h-[35vh] md:min-h-[75vh] bg-careerHero bg-center bg-cover bg-no-repeat relative rounded-xl"></div>
        </div>
        <div class="max-sm:hidden max-sm:px-4  mx-auto">
          <div
            className={
              "flex min-h-[35vh] md:min-h-[75vh] bg-careerHero bg-center bg-cover bg-no-repeat  rounded-lg"
            }
          >
            <div class=" flex align-center items-center justify-center w-1/2  text-center p-6   mx-auto mt-auto opacity-95">
              <div class="px-5 py-4  bg-white rounded-lg md:p-7 ">
                <h3 class="text-lg font-bold text-gray-800 sm:text-3xl ">
                  Come work with us
                </h3>
              </div>
            </div>
          </div>
        </div>
        <header class="md:justify-start  z-50 w-full mb-16 mt-8 ">
          <nav
            class="mt-6 relative max-w-[85rem] w-full bg-white  mx-2 py-3 px-4  md:items-center md:justify-between md:py-0 md:px-6 lg:px-8 xl:mx-auto "
            aria-label="Global"
          >
            <h1 className="text-3xl font-bold">Open Positions</h1>
            <p class="mt-4">There are currently no open Positions.</p>
            <p>
              If you think you'd be a good fit for our team, email{" "}
              <span className="font-semibold">tyler@getfulfil.com</span> with
              your resume.
            </p>
          </nav>
        </header>
        <Footer />
      </>
    </div>
  );
};

export default Careers;
