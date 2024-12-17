import React from "react";
import DoerHeader from "../components/DoerHeader";
import TreeTest from "./TreeTest";

const CareerPaths = () => {
  return (
    <>
      <DoerHeader />
      <div className="max-w-[85rem] w-full mx-auto flex flex-col items-center align-center justify-center gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="mt-10 w-full flex flex-col">
          <h1 className="text-2xl font-semibold">Career Paths</h1>
          <select class="mt-2 py-3 px-4 pe-9 block sm:w-1/4 w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
  <option selected="">Open this select menu</option>
  <option>Trucking (CDL A)</option>
  <option>2</option>
  <option>3</option>
</select>
        </div>
        <div className=" flex align-center justify-center items-center w-full ">
            <TreeTest />
        </div>    
      </div>
    </>
  );
};

export default CareerPaths;
