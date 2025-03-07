import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const QuizQ5 = ({ handleIncrementFormIndex }) => {
  const { setLearningAndDevelopment } = useQuizStore();

  const [answersComplete, setAnswersComplete] = useState(null);
  const [answer, setAnswer] = useState([]);
  const [selectedLimitMessage, setSelectedLimitMessage] = useState(null);
  const [limitReached, setLimitReached] = useState(false)

  const handleCheckboxChange = (e, label) => {
   if (e.target.checked && answer.length < 3) {
      setAnswer((prev) => [...prev, label]);
      setSelectedLimitMessage(null);
      setLimitReached(false)
      console.log("add")
    } else {
      setAnswer((prev) => prev.filter((item) => item !== label));
      setSelectedLimitMessage(null);
      console.log("remove")
    } 
  };

  useEffect(() => {
    if (answer.length <= 3) {
      setSelectedLimitMessage(null);
      setLimitReached(false)
    } else {
      setSelectedLimitMessage("You can only select 3 options");
      selectedLimitMessage(true)
    }
  }, [answer])


  useEffect(() => {
    if (answer.length === 3) {
      setAnswersComplete(true);
    } else {
      setAnswersComplete(false);
    }
    console.log("answessss", answer);
  }, [answer]);

  const submit = () => {
    //submit locally
    setLearningAndDevelopment(answer);
    //increment form
    handleIncrementFormIndex();
  };

  // I learn best through:
  // a. Theoretical study and academic research
  // b. Practical, hands-on experience
  // c. Visual and interactive demonstrations
  // d. Collaborative group learning
  // e. Self-directed, independent study
  // f. Mentorship and direct guidance
  // g. Experimental and trial-and-error methods
  

  return (
    <div className=" max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center mt-16">
        <h1 className="font-medium text-gray-800 text-center text-2xl ">
        I learn best through:
        </h1>
        <h2 className=" text-gray-800 text-center "></h2>

        <div className="mt-2 sm:min-w-96 mb-8"></div>

        <div className=" ">
          {/* Checkbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3  gap-5">
            {/* Checkbox */}
            <label
              htmlFor="hs-pro-sheorpo1"
              value="Healthcare and helping others"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 hover:shadow-md ring-gray-200 has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkBox"
             
                  onChange={(e) =>
                    handleCheckboxChange(e, "Theoretical study and academic research")
                  }
                  id="hs-pro-sheorpo1"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo2"
                  value="Healthcare and helping others"
                />
                <span className="grow">
                  <span className="block font-medium">
                  Theoretical study and academic research
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>
            {/* End Checkbox */}
            {/* Checkbox */}
            <label
              value="Technology and innovation"
              htmlFor="hs-pro-sheorpo2"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 hover:shadow-md ring-gray-200 has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
              
                  onChange={(e) =>
                    handleCheckboxChange(e, "Practical, hands-on experience")
                  }
                  id="hs-pro-sheorpo2"
                  className="size-5 bg-transparent border-gray-200 text-sky-500 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo1"
            
                />
                <span className="grow">
                  <span className="block font-medium">
                  Practical, hands-on experience
                  </span>
                </span>
              </span>
            </label>
            {/* End Checkbox */}

            {/* Checkbox */}
            <label
              htmlFor="hs-pro-sheorpo3"
          
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
             
                  onChange={(e) =>
                    handleCheckboxChange(e, "Visual and interactive demonstrations")
                  }
                  id="hs-pro-sheorpo3"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo3"
                
                />
                <span className="grow">
                  <span className="block font-medium">
                  Visual and interactive demonstrations
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>

              {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued to your credit or debit card within 10 business days after your return is processed at the warehouse.
    </span> */}
            </label>

            <label
              htmlFor="hs-pro-sheorpo4"
          
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                 
                  onChange={(e) =>
                    handleCheckboxChange(e, "Collaborative group learning")
                  }
                  id="hs-pro-sheorpo4"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
             
                />
                <span className="grow">
                  <span className="block font-medium">
                  Collaborative group learning
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>

              {/* <span className="block mt-2 text-sm/6 text-gray-500">
      Your refund will be issued to your credit or debit card within 10 business days after your return is processed at the warehouse.
    </span> */}
            </label>

            <label
              htmlFor="hs-pro-sheorpo5"
         
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="hs-pro-sheorpo5"
                
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      "Self-directed, independent study"
                    )
                  }
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
              
                />
                <span className="grow">
                  <span className="block font-medium">
                  Self-directed, independent study
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>
            <label
              htmlFor="hs-pro-sheorpo6"
          
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
              
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      "Mentorship and direct guidance"
                    )
                  }
                  id="hs-pro-sheorpo6"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
              
                />
                <span className="grow">
                  <span className="block font-medium">
                  Mentorship and direct guidance
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>
            <label
              htmlFor="hs-pro-sheorpo7"
         
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
               
                  onChange={(e) =>
                    
                    handleCheckboxChange(e, "Experimental and trial-and-error methods")
                  }
                  id="hs-pro-sheorpo7"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                 
                />
                <span className="grow">
                  <span className="block font-medium">
                  Experimental and trial-and-error methods
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>

         

        


            {/* End Checkbox */}
          </div>
        </div>
       {selectedLimitMessage && (<p className="text-red-500 text-sm">{selectedLimitMessage}</p>)} 

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

export default QuizQ5;
