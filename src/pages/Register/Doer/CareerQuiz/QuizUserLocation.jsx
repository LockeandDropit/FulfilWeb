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
   
    { label: "Minnesota", id: 23 },
   
  ];

  const cityOptions = [
    { label: "Minneapolis", id: 1 },
    { label: "Saint Paul", id: 2 },
    { label: "Rochester", id: 3 },
    { label: "Duluth", id: 4 },
    { label: "Bloomington", id: 5 },
    { label: "Brooklyn Park", id: 6 },
    { label: "Woodbury", id: 7 },
    { label: "Plymouth", id: 8 },
    { label: "Lakeville", id: 9 },
    { label: "Blaine", id: 10 },
    { label: "Maple Grove", id: 11 },
    { label: "St. Cloud", id: 12 },
    { label: "Eagan", id: 13 },
    { label: "Burnsville", id: 14 },
    { label: "Coon Rapids", id: 15 },
    { label: "Eden Prairie", id: 16 },
    { label: "Apple Valley", id: 17 },
    { label: "Edina", id: 18 },
    { label: "Minnetonka", id: 19 },
    { label: "St. Louis Park", id: 20 },
    { label: "Shakopee", id: 21 },
    { label: "Mankato", id: 22 },
    { label: "Moorhead", id: 23 },
    { label: "Cottage Grove", id: 24 },
    { label: "Maplewood", id: 25 },
    { label: "Richfield", id: 26 },
    { label: "Inver Grove Heights", id: 27 },
    { label: "Roseville", id: 28 },
    { label: "Andover", id: 29 },
    { label: "Savage", id: 30 },
    { label: "Brooklyn Center", id: 31 },
    { label: "Fridley", id: 32 },
    { label: "Chaska", id: 33 },
    { label: "Ramsey", id: 34 },
    { label: "Oakdale", id: 35 },
    { label: "Prior Lake", id: 36 },
    { label: "Rosemount", id: 37 },
    { label: "Elk River", id: 38 },
    { label: "Owatonna", id: 39 },
    { label: "Shoreview", id: 40 },
    { label: "Austin", id: 41 },
    { label: "Winona", id: 42 },
    { label: "Chanhassen", id: 43 },
    { label: "Faribault", id: 44 },
    { label: "Farmington", id: 45 },
    { label: "White Bear Lake", id: 46 },
    { label: "Otsego", id: 47 },
    { label: "Champlin", id: 48 },
    { label: "Lino Lakes", id: 49 },
    { label: "Columbia Heights", id: 50 },
    { label: "New Brighton", id: 51 },
    { label: "Hastings", id: 52 },
    { label: "Crystal", id: 53 },
    { label: "West St. Paul", id: 54 },
    { label: "Willmar", id: 55 },
    { label: "Golden Valley", id: 56 },
    { label: "St. Michael", id: 57 },
    { label: "Northfield", id: 58 },
    { label: "New Hope", id: 59 },
    { label: "Forest Lake", id: 60 },
    { label: "South St. Paul", id: 61 },
    { label: "Sartell", id: 62 },
    { label: "Stillwater", id: 63 },
    { label: "Hopkins", id: 64 },
    { label: "Albert Lea", id: 65 },
    { label: "Anoka", id: 66 },
    { label: "Red Wing", id: 67 },
    { label: "Ham Lake", id: 68 },
    { label: "Buffalo", id: 69 },
    { label: "Hugo", id: 70 },
    { label: "Hibbing", id: 71 },
    { label: "Bemidji", id: 72 },
    { label: "Alexandria", id: 73 },
    { label: "Monticello", id: 74 },
    { label: "Hutchinson", id: 75 },
    { label: "Brainerd", id: 76 },
    { label: "Fergus Falls", id: 77 },
    { label: "North Mankato", id: 78 },
    { label: "Robbinsdale", id: 79 },
    { label: "New Ulm", id: 80 },
    { label: "Marshall", id: 81 },
    { label: "Sauk Rapids", id: 82 },
    { label: "Lake Elmo", id: 83 },
    { label: "Waconia", id: 84 },
    { label: "Rogers", id: 85 },
    { label: "Worthington", id: 86 },
    { label: "Mounds View", id: 87 },
    { label: "Vadnais Heights", id: 88 },
    { label: "Big Lake", id: 89 },
    { label: "North St. Paul", id: 90 },
    { label: "Cloquet", id: 91 },
    { label: "St. Peter", id: 92 },
    { label: "East Bethel", id: 93 },
    { label: "North Branch", id: 94 },
    { label: "Mendota Heights", id: 95 },
    { label: "Victoria", id: 96 },
    { label: "Grand Rapids", id: 97 },
    { label: "Cambridge", id: 98 },
    { label: "Little Canada", id: 99 },
    { label: "Fairmont", id: 100 }
  ];


  // const [finalState, setFinalState] = useState(null);

  // useEffect(() => {
  //   if (stateIntermediate) {
  //     setFinalState(stateIntermediate.label);
  //   }
  // }, [stateIntermediate]);

  const [finalCity, setFinalCity] = useState(null);

  useEffect(() => {
    if (cityIntermediate) {
      setFinalCity(cityIntermediate.label);
    }
  }, [cityIntermediate]);

  const handleSubmit = () => {
    if (!cityIntermediate) {
      //error
      console.log("issue on submit")
    } else {
      setCity(finalCity);
      setState("MN");
console.log("handling submit")
      navigate("/QuizResultsCareerOptions");
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
                       <Select
                        className="w-full mt-4 sm: mt-10"
                        isClearable={isClearable}
                        isSearchable={isSearchable}
                        options={cityOptions}
                        onSelect={(e) => setCityIntermediate(e.target.value)}
                        onChange={setCityIntermediate}
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
