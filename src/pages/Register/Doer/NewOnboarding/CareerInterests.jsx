import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useUserStore } from "../../../Doer/Chat/lib/userStore";
import { db } from "../../../../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CareerInterests = () => {
  const { currentUser } = useUserStore();
  const navigate = useNavigate();

const [interests, setInterests] = useState(null)

const uploadAnswer = async () => {
  await updateDoc(doc(db, "users", currentUser.uid), {
    userInterests: interests,
  });
};

  const submit = () => {
    uploadAnswer();
    navigate("/DoerPayment")
  }
  

  return (
    <div className=" max-w-[85rem] w-full h-[calc(500px-20px)]  mx-auto flex flex-col  justify-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col items-center justify-center">
        <h1 className="font-medium text-gray-800 text-center text-2xl">
         What do you want to do?
        </h1>
        <p className="mt-1 sm:mt-1 text-gray-800 text-center">
         Describe your interests, hobbies, and the type of work you're interested in doing and we'll help generate some career options for you!
        </p>
        <div class="w-full space-y-3 flex items-center justify-center">
  <textarea onChange={(e) => setInterests(e.target.value)} class=" mt-5 sm:mt-6 py-3 px-4 block w-full sm:w-3/4  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" rows="4" placeholder="e.g. I like to work with my hands and be outside. I like to work with people and problem solve."></textarea>
</div>
        {interests ? (
          <button
            type="button"
            class=" w-full sm:w-1/2 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={submit}
         >
            Finish
          </button>
        ) : (
          <button
            type="button"
            class=" w-full sm:w-1/2 text-center justify-center mt-6 lg:mt-10 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-200 text-white hove focus:outline-none  pointer-events-none disabled:opacity-50 disabled:pointer-events-none"
            
         >
        Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default CareerInterests;
