import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const QuizQ2= ({ handleIncrementFormIndex }) => {

const {setWorkEnvironment} = useQuizStore(); 

const [answersComplete, setAnswersComplete] = useState(null)
const [answer, setAnswer] = useState(null)

  



 // 


  useEffect(() => {
    if (answer) {
   setAnswersComplete(true)
    } else {
      setAnswersComplete(false)
    }

  }, [answer]);



  const submit = () => {
    //submit locally
setWorkEnvironment(answer)
    //increment form
    handleIncrementFormIndex()
  };


 


  // a. Highly structured environments with clear guidelines
  // b. Dynamic, flexible settings with frequent changes
  // c. Independent work with minimal supervision
  // d. Collaborative team-based environments
  // e. Outdoor or physically active workspaces
  // f. Quiet, research-oriented settings
  // g. Customer-facing, interactive roles

  return (
    <div className=" max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center mt-16">
        <h1 className="font-medium text-gray-800 text-center text-2xl ">
        Choose your ideal work scenario:
        </h1>
        <h2 className=" text-gray-800 text-center ">
       
        </h2>
       
   
<div className="mt-2 sm:min-w-96 mb-8">

</div>


<div className="space-y-4 hover:border-sky-500" >


  {/* Checkbox Grid */}
<div className="space-y-4">
  {/* Checkbox */}
  <label onClick={(e) => setAnswer(e.target.value)} value="Highly structured environments with clear guidelines" htmlFor="hs-pro-sheorpo2" className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 hover:shadow-md ring-gray-200 has-checked:ring-2 has-checked:ring-sky-600">
    <span className="flex items-center gap-x-3">
      <input type="radio" id="hs-pro-sheorpo2" className="size-5 bg-transparent border-gray-200 text-sky-500 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0" name="hs-pro-sheorpo"  value="Highly structured environments with clear guidelines"/>
      <span className="grow">
        <span className="block font-medium">
        Highly structured environments with clear guidelines
        
        </span>
      </span>
      <span className="ms-auto">
        <span className="block font-medium">
        
        </span>
      </span>
    </span>

    {/* <span className="block mt-2 text-sm/6 text-gray-500">
      You’ll receive the gift card by email immediately after we process your return at the warehouse. It will be valid for 3 years.
    </span> */}
  </label>
  {/* End Checkbox */}

  {/* Checkbox */}
  <label htmlFor="hs-pro-sheorpo1" onClick={(e) => setAnswer(e.target.value)} value="Dynamic, flexible settings with frequent changes" className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 hover:shadow-md ring-gray-200 has-checked:ring-2 has-checked:ring-sky-600">
    <span className="flex items-center gap-x-3">
      <input type="radio" id="hs-pro-sheorpo1" className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0" name="hs-pro-sheorpo" value="Dynamic, flexible settings with frequent changes" />
      <span className="grow">
        <span className="block font-medium">
        Dynamic, flexible settings with frequent changes
        </span>
      </span>
      <span className="ms-auto">
        <span className="block font-medium">
     
        </span>
      </span>
    </span>

    {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued within 14 business days after we process your return at the warehouse.
    </span> */}
  </label>
  {/* End Checkbox */}

  {/* Checkbox */}
  <label htmlFor="hs-pro-sheorpo3" onClick={(e) => setAnswer(e.target.value)} value="Independent work with minimal supervision" className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600">
    <span className="flex items-center gap-x-3">
      <input type="radio" id="hs-pro-sheorpo3" className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0" name="hs-pro-sheorpo" value="Independent work with minimal supervision" />
      <span className="grow">
        <span className="block font-medium">
        Independent work with minimal supervision
        </span>
      </span>
      <span className="ms-auto">
        <span className="block font-medium">
         
        </span>
      </span>
    </span>

    {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued to your credit or debit card within 10 business days after your return is processed at the warehouse.
    </span> */}
  </label>

  <label htmlFor="hs-pro-sheorpo4" onClick={(e) => setAnswer(e.target.value)} value="Collaborative team-based environments" className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600">
    <span className="flex items-center gap-x-3">
      <input type="radio" id="hs-pro-sheorpo4" className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0" name="hs-pro-sheorpo" value="Collaborative team-based environments" />
      <span className="grow">
        <span className="block font-medium">
        Collaborative team-based environments
        </span>
      </span>
      <span className="ms-auto">
        <span className="block font-medium">
      
        </span>
      </span>
    </span>

    {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued to your credit or debit card within 10 business days after your return is processed at the warehouse.
    </span> */}
  </label>

  <label htmlFor="hs-pro-sheorpo5" onClick={(e) => setAnswer(e.target.value)} value="Customer-facing, interactive roles" className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600">
    <span className="flex items-center gap-x-3">
      <input type="radio" id="hs-pro-sheorpo5" className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0" name="hs-pro-sheorpo" value="Customer-facing, interactive roles" />
      <span className="grow">
        <span className="block font-medium">
        Customer-facing, interactive roles
        </span>
      </span>
      <span className="ms-auto">
        <span className="block font-medium">
      
        </span>
      </span>
    </span>

    {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued to your credit or debit card within 10 business days after your return is processed at the warehouse.
    </span> */}
  </label>
  {/* End Checkbox */}
</div>


</div>




        {answersComplete ? (
          <button
            type="button"
            class=" w-full sm:w-1/2 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => submit()}
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

export default QuizQ2;
