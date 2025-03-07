import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";

const CurrentIncome = ({ handleIncrementFormIndex }) => {

  const {setCurrentPay} = useQuizStore();


  const [income, setIncome] = useState(null);
  const [finalIncome, setFinalIncome] = useState(null);
  console.log()

  useEffect(() => {
    if (income) {
      setFinalIncome(income.label);
    }
  }, [income]);



  const incomeValues = [
    { label: "less than 20,000", id: 1 },
    { label: "20,000", id: 2 },
    { label: "25,000", id: 3 },
    { label: "30,000", id: 4 },
    { label: "35,000", id: 5 },
    { label: "40,000", id: 6 },
    { label: "45,000", id: 7 },
    { label: "50,000", id: 8 },
    { label: "55,000", id: 9 },
    { label: "60,000", id: 10 },
    { label: "65,000", id: 11 },
    { label: "70,000", id: 12 },
    { label: "75,000", id: 13 },
    { label: "80,000", id: 14 },
    { label: "90,000", id: 15 },
    { label: "100,000", id: 16 },
    { label: "110,000", id: 17 },
    { label: "120,000+", id: 18 },
  ];

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  console.log(income, finalIncome);

  const submit = () => {
    //submit locally
    setCurrentPay(finalIncome)
handleIncrementFormIndex()
    //increment form

  };

  return (
    <div className=" max-w-[85rem] w-full h-[calc(500px-20px)]  mx-auto flex flex-col  justify-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center">
        <h1 className="font-medium text-gray-800 text-center text-2xl">
          What's your current yearly income?
        </h1>
        <Select
          className="w-full mt-4 sm: mt-10"
          isClearable={isClearable}
          isSearchable={isSearchable}
          options={incomeValues}
          onSelect={(e) => setIncome(e.target.value)}
          onChange={setIncome}
        />

        {finalIncome ? (
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

export default CurrentIncome;
