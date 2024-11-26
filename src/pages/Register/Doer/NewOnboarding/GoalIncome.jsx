import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useUserStore } from "../../../Doer/Chat/lib/userStore";
import { db } from "../../../../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const GoalIncome = ( {handleIncrementFormIndex}) => {
  const { currentUser } = useUserStore();

  const incomeValues = [
    { label: "10,000", id: 1 },
    { label: "11,000", id: 2 },
    { label: "12,000", id: 3 },
    { label: "13,000", id: 4 },
    { label: "14,000", id: 5 },
    { label: "15,000", id: 6 },
    { label: "16,000", id: 7 },
    { label: "17,000", id: 8 },
    { label: "18,000", id: 9 },
    { label: "19,000", id: 10 },
    { label: "20,000", id: 11 },
    { label: "21,000", id: 12 },
    { label: "22,000", id: 13 },
    { label: "23,000", id: 14 },
    { label: "24,000", id: 15 },
    { label: "25,000", id: 16 },
    { label: "26,000", id: 17 },
    { label: "27,000", id: 18 },
    { label: "28,000", id: 19 },
    { label: "29,000", id: 20 },
    { label: "30,000", id: 21 },
    { label: "31,000", id: 22 },
    { label: "32,000", id: 23 },
    { label: "33,000", id: 24 },
    { label: "34,000", id: 25 },
    { label: "35,000", id: 26 },
    { label: "36,000", id: 27 },
    { label: "37,000", id: 28 },
    { label: "38,000", id: 29 },
    { label: "39,000", id: 30 },
    { label: "40,000", id: 31 },
    { label: "41,000", id: 32 },
    { label: "42,000", id: 33 },
    { label: "43,000", id: 34 },
    { label: "44,000", id: 35 },
    { label: "45,000", id: 36 },
    { label: "46,000", id: 37 },
    { label: "47,000", id: 38 },
    { label: "48,000", id: 39 },
    { label: "49,000", id: 40 },
    { label: "50,000", id: 41 },
    { label: "51,000", id: 42 },
    { label: "52,000", id: 43 },
    { label: "53,000", id: 44 },
    { label: "54,000", id: 45 },
    { label: "55,000", id: 46 },
    { label: "56,000", id: 47 },
    { label: "57,000", id: 48 },
    { label: "58,000", id: 49 },
    { label: "59,000", id: 50 },
    { label: "60,000", id: 51 },
    { label: "61,000", id: 52 },
    { label: "62,000", id: 53 },
    { label: "63,000", id: 54 },
    { label: "64,000", id: 55 },
    { label: "65,000", id: 56 },
    { label: "66,000", id: 57 },
    { label: "67,000", id: 58 },
    { label: "68,000", id: 59 },
    { label: "69,000", id: 60 },
    { label: "70,000", id: 61 },
    { label: "71,000", id: 62 },
    { label: "72,000", id: 63 },
    { label: "73,000", id: 64 },
    { label: "74,000", id: 65 },
    { label: "75,000", id: 66 },
    { label: "76,000", id: 67 },
    { label: "77,000", id: 68 },
    { label: "78,000", id: 69 },
    { label: "79,000", id: 70 },
    { label: "80,000", id: 71 },
    { label: "81,000", id: 72 },
    { label: "82,000", id: 73 },
    { label: "83,000", id: 74 },
    { label: "84,000", id: 75 },
    { label: "85,000", id: 76 },
    { label: "86,000", id: 77 },
    { label: "87,000", id: 78 },
    { label: "88,000", id: 79 },
    { label: "89,000", id: 80 },
    { label: "90,000", id: 81 },
    { label: "91,000", id: 82 },
    { label: "92,000", id: 83 },
    { label: "93,000", id: 84 },
    { label: "94,000", id: 85 },
    { label: "95,000", id: 86 },
    { label: "96,000", id: 87 },
    { label: "97,000", id: 88 },
    { label: "98,000", id: 89 },
    { label: "99,000", id: 90 },
    { label: "100,000", id: 91 },
    { label: "101,000", id: 92 },
    { label: "102,000", id: 93 },
    { label: "103,000", id: 94 },
    { label: "104,000", id: 95 },
    { label: "105,000", id: 96 },
    { label: "106,000", id: 97 },
    { label: "107,000", id: 98 },
    { label: "108,000", id: 99 },
    { label: "109,000", id: 100 },
    { label: "110,000", id: 101 },
    { label: "111,000", id: 102 },
    { label: "112,000", id: 103 },
    { label: "113,000", id: 104 },
    { label: "114,000", id: 105 },
    { label: "115,000", id: 106 },
    { label: "116,000", id: 107 },
    { label: "117,000", id: 108 },
    { label: "118,000", id: 109 },
    { label: "119,000", id: 110 },
    { label: "120,000", id: 111 },
  ];

  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);

  useEffect(() => {
    if (goalIncome) {
      setGoalFinalIncome(goalIncome.label);
    }
  }, [goalIncome]);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

 

  const uploadAnswer = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      goalIncome: finalGoalIncome,
    });
  };


  const submit = () => {
    //
uploadAnswer()
//increment form   
handleIncrementFormIndex();
  }

  return (
    <div className=" max-w-[85rem] w-full h-[calc(500px-20px)]  mx-auto flex flex-col  justify-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center">
        <h1 className="font-medium text-gray-800 text-center text-2xl">
          How much would you like to make a year?
        </h1>
        <Select
          className="w-full mt-4 sm:mt-10"
          isClearable={isClearable}
          isSearchable={isSearchable}
          options={incomeValues}
          onSelect={(e) => setGoalIncome(e.target.value)}
          onChange={setGoalIncome}
        />

        {finalGoalIncome ? (
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

export default GoalIncome;
