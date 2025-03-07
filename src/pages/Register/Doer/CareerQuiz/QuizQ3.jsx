import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const QuizQ3 = ({ handleIncrementFormIndex }) => {
  const { setPassion } = useQuizStore();

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
    setPassion(answer);
    //increment form
    handleIncrementFormIndex();
  };

  // a. Technology and innovation
  // b. Healthcare and helping others
  // c. Creative arts and design
  // d. Business and entrepreneurship
  // e. Environmental and sustainability issues
  // f. Education and knowledge sharing
  // g. Social services and community development
  // h. Science and research
  // i. Finance and economics

  return (
    <div className=" max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center mt-16">
        <h1 className="font-medium text-gray-800 text-center text-2xl ">
          Choose your top 3 areas of interest:
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
                    handleCheckboxChange(e, "Healthcare and helping others")
                  }
                  id="hs-pro-sheorpo1"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo2"
                  value="Healthcare and helping others"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Healthcare and helping others
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
                    handleCheckboxChange(e, "Technology and innovation")
                  }
                  id="hs-pro-sheorpo2"
                  className="size-5 bg-transparent border-gray-200 text-sky-500 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo1"
                  value="Technology and innovation"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Technology and innovation
                  </span>
                </span>
              </span>
            </label>
            {/* End Checkbox */}

            {/* Checkbox */}
            <label
              htmlFor="hs-pro-sheorpo3"
              value="Creative arts and design"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
             
                  onChange={(e) =>
                    handleCheckboxChange(e, "Creative arts and design")
                  }
                  id="hs-pro-sheorpo3"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo3"
                  value="Creative arts and design"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Creative arts and design
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
              value="Business and entrepreneurship"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md has-checked:ring-2 has-checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                 
                  onChange={(e) =>
                    handleCheckboxChange(e, "Business and entrepreneurship")
                  }
                  id="hs-pro-sheorpo4"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                  value="Business and entrepreneurship"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Business and entrepreneurship
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
              value="Environmental and sustainability issues"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="hs-pro-sheorpo5"
                
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      "Environmental and sustainability issues"
                    )
                  }
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                  value="Environmental and sustainability issues"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Environmental and sustainability issues
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>
            <label
              htmlFor="hs-pro-sheorpo6"
              value="Social services and community development"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
              
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      "Social services and community development"
                    )
                  }
                  id="hs-pro-sheorpo6"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                  value="Social services and community development"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Social services and community development
                  </span>
                </span>
                <span className="ms-auto">
                  <span className="block font-medium"></span>
                </span>
              </span>
            </label>
            <label
              htmlFor="hs-pro-sheorpo7"
              value="Education and knowledge sharing"
              className="py-5 px-4 block text-sm bg-white text-gray-800 rounded-xl checked:bg-sky-500 checked:border-sky-500 cursor-pointer rounded-xl ring-1 ring-gray-200 hover:shadow-md checked:ring-2 checked:ring-sky-600"
            >
              <span className="flex items-center gap-x-3">
                <input
                  type="checkbox"
               
                  onChange={(e) =>
                    
                    handleCheckboxChange(e, "Education and knowledge sharing")
                  }
                  id="hs-pro-sheorpo7"
                  className="size-5 bg-transparent border-gray-200 text-sky-600 rounded-full checked:bg-sky-500 checked:border-sky-500 focus:ring-white focus:ring-offset-0"
                  name="hs-pro-sheorpo"
                  value="Education and knowledge sharing"
                />
                <span className="grow">
                  <span className="block font-medium">
                    Education and knowledge sharing
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

export default QuizQ3;
