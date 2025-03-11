import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";
import { useNavigate } from "react-router-dom";

const QuizUserLocation = ({ handleIncrementFormIndex }) => {
  const { setCity, setState } = useQuizStore();

  const [cityIntermediate, setCityIntermediate] = useState(null);
  const [stateIntermediate, setStateIntermediate] = useState(null);

  const navigate = useNavigate();

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const stateOptions = [
    { label: "Alabama", id: 1 },
    { label: "Alaska", id: 2 },
    { label: "Arizona", id: 3 },
    { label: "Arkansas", id: 4 },
    { label: "California", id: 5 },
    { label: "Colorado", id: 6 },
    { label: "Connecticut", id: 7 },
    { label: "Delaware", id: 8 },
    { label: "Florida", id: 9 },
    { label: "Georgia", id: 10 },
    { label: "Hawaii", id: 11 },
    { label: "Idaho", id: 12 },
    { label: "Illinois", id: 13 },
    { label: "Indiana", id: 14 },
    { label: "Iowa", id: 15 },
    { label: "Kansas", id: 16 },
    { label: "Kentucky", id: 17 },
    { label: "Louisiana", id: 18 },
    { label: "Maine", id: 19 },
    { label: "Maryland", id: 20 },
    { label: "Massachusetts", id: 21 },
    { label: "Michigan", id: 22 },
    { label: "Minnesota", id: 23 },
    { label: "Mississippi", id: 24 },
    { label: "Missouri", id: 25 },
    { label: "Montana", id: 26 },
    { label: "Nebraska", id: 27 },
    { label: "Nevada", id: 28 },
    { label: "New Hampshire", id: 29 },
    { label: "New Jersey", id: 30 },
    { label: "New Mexico", id: 31 },
    { label: "New York", id: 32 },
    { label: "North Carolina", id: 33 },
    { label: "North Dakota", id: 34 },
    { label: "Ohio", id: 35 },
    { label: "Oklahoma", id: 36 },
    { label: "Oregon", id: 37 },
    { label: "Pennsylvania", id: 38 },
    { label: "Rhode Island", id: 39 },
    { label: "South Carolina", id: 40 },
    { label: "South Dakota", id: 41 },
    { label: "Tennessee", id: 42 },
    { label: "Texas", id: 43 },
    { label: "Utah", id: 44 },
    { label: "Vermont", id: 45 },
    { label: "Virginia", id: 46 },
    { label: "Washington", id: 47 },
    { label: "West Virginia", id: 48 },
    { label: "Wisconsin", id: 49 },
    { label: "Wyoming", id: 50 },
  ];

  const [finalState, setFinalState] = useState(null);

  useEffect(() => {
    if (stateIntermediate) {
      setFinalState(stateIntermediate.label);
    }
  }, [stateIntermediate]);

  const handleSubmit = () => {
    if (!finalState || !cityIntermediate) {
      //error
      console.log("issue on submit")
    } else {
      setCity(cityIntermediate);
      setState(finalState);
console.log("handling submit")
      navigate("/QuizResults");
    }
  };

  return (
    <div className=" max-w-[85rem] w-full h-[calc(500px-20px)]  mx-auto flex flex-col  justify-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center">
        <form>
          <div className="space-y-12">
            <div className=" border-gray-900/10 pb-0">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <p className="text-gray-600 text-sm mt-1">(We ask so we can we can find you job openings close to you)</p>
              <form>
                <div class="mt-6 grid gap-4 lg:gap-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label
                        for="hs-company-hire-us-1"
                        class="block mb-2 text-sm text-gray-700 font-medium "
                      >
                        City
                      </label>
                      <input
                        onChange={(e) => setCityIntermediate(e.target.value)}
                        type="text"
                        name="hs-company-hire-us-1"
                        id="hs-company-hire-us-1"
                        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                      />
                    </div>
                    <div>
                      <label
                        for="hs-company-website-hire-us-1"
                        class="block mb-2 text-sm text-gray-700 font-medium "
                      >
                        State
                      </label>
                      <Select
                        className="w-full mt-4 sm: mt-10"
                        isClearable={isClearable}
                        isSearchable={isSearchable}
                        options={stateOptions}
                        onSelect={(e) => setStateIntermediate(e.target.value)}
                        onChange={setStateIntermediate}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center sm:justify-end gap-x-6">
            <input
              type="button"
              value="Continue"
              onClick={() => handleSubmit()}
              class="w-full sm:w-1/4 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizUserLocation;
