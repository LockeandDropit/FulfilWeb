import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const QuizQ4 = ({ handleIncrementFormIndex }) => {
  const { setLongTerm } = useQuizStore();

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
    if (answer.length >= 1) {
      setAnswersComplete(true);
    } else {
      setAnswersComplete(false);
    }
    console.log("answessss", answer);
  }, [answer]);

  const submit = () => {
    //submit locally
    setLongTerm(answer);
    //increment form
    handleIncrementFormIndex();
  };

  // Imagine your ideal professional life in 10 years:

  // Describe your aspirations:
  // a. Geographic mobility and international opportunities
  // b. Leadership and management roles
  // c. Continuous innovation and cutting-edge work
  // d. Deep specialization in a specific field
  // e. Entrepreneurial ventures and business ownership
  // f. Social impact and meaningful contributions
  // g. Academic or research-oriented career
  

  return (
    <div className=" max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center mt-16">
        <h1 className="font-medium text-gray-800 text-center text-2xl ">
        Imagine your ideal professional life in 10 years:
        </h1>
        <h2 className=" text-gray-700 text-center mt-2 text-sm">(Choose up to 3)</h2>

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
                    handleCheckboxChange(e, "Ability to travel and go abroad")
                  }
                  id="hs-pro-sheorpo1"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo2"
                  value="Healthcare and helping others"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Ability to travel and go abroad
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
                    handleCheckboxChange(e, "Leadership and management roles")
                  }
                  id="hs-pro-sheorpo2"
                  className="size-5 bg-transparent border-gray-200 text-sky-500 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo1"
            
                />
                <span className="grow">
                  <span className="block font-medium">
                  Leadership and management roles
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
                    handleCheckboxChange(e, "Continuous innovation and cutting-edge work")
                  }
                  id="hs-pro-sheorpo3"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo3"
                
                />
                <span className="grow">
                  <span className="block font-medium">
                  Continuous innovation and cutting-edge work
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
                    handleCheckboxChange(e, "Deep specialization in a specific field")
                  }
                  id="hs-pro-sheorpo4"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
             
                />
                <span className="grow">
                  <span className="block font-medium">
                  Deep specialization in a specific field
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
                      "Entrepreneurial ventures and business ownership"
                    )
                  }
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
              
                />
                <span className="grow">
                  <span className="block font-medium">
                  Entrepreneurial ventures and business ownership
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
                      "Social impact and meaningful contributions"
                    )
                  }
                  id="hs-pro-sheorpo6"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
              
                />
                <span className="grow">
                  <span className="block font-medium">
                  Social impact and meaningful contributions
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
                    
                    handleCheckboxChange(e, "Academic or research-oriented career")
                  }
                  id="hs-pro-sheorpo7"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                 
                />
                <span className="grow">
                  <span className="block font-medium">
                  Academic or research-oriented career
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>

            <label
              htmlFor="hs-pro-sheorpo8"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="hs-pro-sheorpo8"
               
                  onChange={(e) =>
                    handleCheckboxChange(e, "Science and research")
                  }
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Science and research
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>

            <label
              htmlFor="hs-pro-sheorpo9"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
               
                  onChange={(e) =>
                    handleCheckboxChange(e, "Finance and economics")
                  }
                  id="hs-pro-sheorpo9"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Finance and economics
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

export default QuizQ4;
