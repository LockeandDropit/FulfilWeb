import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const QuizQ6= ({ handleIncrementFormIndex }) => {

const {personalValues, setPersonalValues} = useQuizStore(); 

const [answersComplete, setAnswersComplete] = useState(null)


  
  const [a, setA] = useState(null)
 const [b, setB] = useState(null)
 const [c, setC] = useState(null)
 const [h, setH] = useState(null)


 // 


  useEffect(() => {
    if (a && b && c && h) {
   setAnswersComplete(true)
    } else {
      setAnswersComplete(false)
    }

  }, [a, b, c, h]);



  const submit = () => {
    //submit locally
setPersonalValues([a,b,c, h])
    //increment form
    handleIncrementFormIndex()
  };


 

  return (
    <div className=" max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center mt-16">
        <h1 className="font-medium text-gray-800 text-center text-2xl ">
        What matters to you the most?
        </h1>
        <h2 className=" text-gray-800 text-center ">
        (1 being not important, 5 being extremely important):
        </h2>
       
       {/* Rating */}
<div className="mt-16 sm:min-w-96 mb-8">
  <h3 className="mb-3  font-medium text-gray-800">
  Work-life balance
  </h3>

  {/* Heading */}
  <div className="mb-3 flex justify-between items-center gap-5 mt-4">
    <span className="text-xs text-gray-700">1</span>
    <span className="text-xs text-gray-700">3</span>
    <span className="text-xs text-gray-700">5</span>
  </div>
  {/* End Heading */}
<div>

  {/* Radio Group */}
  <div className="flex justify-between items-center gap-5 relative after:absolute after:top-1/2 after:inset-x-0 after:w-full after:h-px after:bg-gray-200 after:-translate-y-1/2">
    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setA({"Work-life balance": e.target.value})} type="radio" name="group1" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="1a" value="1" />
      <span className="sr-only">1</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setA({"Work-life balance": e.target.value})}  type="radio" name="group1" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="2a" value="2" />
      <span className="sr-only">2</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-perfect" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setA({"Work-life balance": e.target.value})}  type="radio" name="group1" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="3a" value="3" />
      <span className="sr-only">3</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setA({"Work-life balance": e.target.value})} type="radio" name="group1" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="4a" value="4" />
      <span className="sr-only">4</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setA({"Work-life balance": e.target.value})} type="radio" name="group1" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="5a" value="5" />
      <span className="sr-only">5</span>
    </label>
    {/* End Radio */}
  </div>
  {/* End Radio Group */}
</div>
</div>

<div className="mt-8 min-w-sm sm:min-w-96 mb-8">
  <h3 className="mb-3  font-medium text-gray-800">
  Autonomy and independence
  </h3>

  {/* Heading */}
  <div className="mb-3 flex justify-between items-center gap-5">
    <span className="text-xs text-gray-700">1</span>
    <span className="text-xs text-gray-700">3</span>
    <span className="text-xs text-gray-700">5</span>
  </div>
  {/* End Heading */}

  {/* Radio Group */}
  <div className="flex justify-between items-center gap-5 relative after:absolute after:top-1/2 after:inset-x-0 after:w-full after:h-px after:bg-gray-200 after:-translate-y-1/2">
    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setB({"Autonomy and independence": e.target.value})}  type="radio" name="group2" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="1a" value="1" />
      <span className="sr-only">1</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setB({"Autonomy and independence": e.target.value})}  type="radio" name="group2" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="2a" value="2" />
      <span className="sr-only">2</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-perfect" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setB({"Autonomy and independence": e.target.value})}  type="radio" name="group2" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="3a" value="3" />
      <span className="sr-only">3</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setB({"Autonomy and independence": e.target.value})}  type="radio" name="group2" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="4a" value="4" />
      <span className="sr-only">4</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setB({"Autonomy and independence": e.target.value})}  type="radio" name="group2" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="5a" value="5" />
      <span className="sr-only">5</span>
    </label>
    {/* End Radio */}
  </div>
  {/* End Radio Group */}
</div>

<div className="mt-8 min-w-sm sm:min-w-96 mb-8">
  <h3 className="mb-3  font-medium text-gray-800">
  Job security
  </h3>

  {/* Heading */}
  <div className="mb-3 flex justify-between items-center gap-5">
    <span className="text-xs text-gray-700">1</span>
    <span className="text-xs text-gray-700">3</span>
    <span className="text-xs text-gray-700">5</span>
  </div>
  {/* End Heading */}

  {/* Radio Group */}
  <div className="flex justify-between items-center gap-5 relative after:absolute after:top-1/2 after:inset-x-0 after:w-full after:h-px after:bg-gray-200 after:-translate-y-1/2">
    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setC({"Job security": e.target.value})}  type="radio" name="group3" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="1b" value="1" />
      <span className="sr-only">1</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input  onClick={(e) => setC({"Job security": e.target.value})} type="radio" name="group3" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="2b" value="2" />
      <span className="sr-only">2</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-perfect" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setC({"Job security": e.target.value})} type="radio" name="group3" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="3b" value="3" />
      <span className="sr-only">3</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setC({"Job security": e.target.value})} type="radio" name="group3" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="4b" value="4" />
      <span className="sr-only">4</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setC({"Job security": e.target.value})} type="radio" name="group3" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="5b" value="5" />
      <span className="sr-only">5</span>
    </label>
    {/* End Radio */}
  </div>
  {/* End Radio Group */}
</div>
<div className="mt-8 min-w-sm sm:min-w-96 mb-8">
  <h3 className="mb-3  font-medium text-gray-800">
  Recognition and professional advancement
  </h3>

  {/* Heading */}
  <div className="mb-3 flex justify-between items-center gap-5">
    <span className="text-xs text-gray-700">1</span>
    <span className="text-xs text-gray-700">3</span>
    <span className="text-xs text-gray-700">5</span>
  </div>
  {/* End Heading */}

  {/* Radio Group */}
  <div className="flex justify-between items-center gap-5 relative after:absolute after:top-1/2 after:inset-x-0 after:w-full after:h-px after:bg-gray-200 after:-translate-y-1/2">
    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setH({"Recognition and professional advancement": e.target.value})}  type="radio" name="group4" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="1b" value="1" />
      <span className="sr-only">1</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-tight" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input  onClick={(e) => setH({"Recognition and professional advancement": e.target.value})} type="radio" name="group4" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="2b" value="2" />
      <span className="sr-only">2</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-perfect" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setH({"Recognition and professional advancement": e.target.value})} type="radio" name="group4" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="3b" value="3" />
      <span className="sr-only">3</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-slightly-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setH({"Recognition and professional advancement": e.target.value})} type="radio" name="group4" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="4b" value="4" />
      <span className="sr-only">4</span>
    </label>
    {/* End Radio */}

    {/* Radio */}
    <label htmlFor="hs-pro-shprft-too-loose" className="group relative z-1 inline-flex items-center cursor-pointer text-sm">
      <input onClick={(e) => setH({"Recognition and professional advancement": e.target.value})} type="radio" name="group4" className="shrink-0 size-5 border-gray-300 rounded-full text-sky-500 cursor-pointer focus:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none" id="5b" value="5" />
      <span className="sr-only">5</span>
    </label>
    {/* End Radio */}
  </div>
  {/* End Radio Group */}
</div>

{/* End Rating */}

        {answersComplete ? (
          <button
            type="button"
            class=" w-full sm:w-1/2 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={submit}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            class=" w-full sm:w-1/2 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-200 text-white hove focus:outline-none  pointer-events-none disabled:opacity-50 disabled:pointer-events-none"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizQ6;
