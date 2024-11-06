import React, { useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import { useUserStore } from "../../Chat/lib/userStore";
import {
  setDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useResumeStore } from "../lib/resumeStore";




const BuildResume = ({ handleIncrementFormIndex }) => {
  const { currentUser } = useUserStore();
  const {currentResumeName} = useResumeStore();
  console.log("resume name", currentResumeName)

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [aboutDescription, setAboutDescription] = useState(null);

  const updloadEducation = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, currentResumeName), {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: phoneNumber ? phoneNumber : null,
      aboutDescription: aboutDescription ? aboutDescription : null,
      email: currentUser.email,
      city: currentUser.city,
      state: currentUser.state,
    })
      .then(() => {
        handleIncrementFormIndex();
      })
      .catch((e) => alert(e));
  };

  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class="pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
            <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-800 ">About</h2>
                <p class="text-sm text-gray-600 ">
                  Provide general contact information, along with a few
                  sentences to describe yourself.
                </p>
              </div>

              <form>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-full-name"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Full name
                  </label>
                  <div class="hs-tooltip inline-block">
                    <svg
                      class="hs-tooltip-toggle ms-1 inline-block size-3 text-gray-400 "
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm "
                      role="tooltip"
                    >
                      Displayed on public forums, such as Preline
                    </span>
                  </div>
                </div>

                <div class="sm:col-span-9">
                  <div class="sm:flex">
                    <p className="mr-1">{currentUser.firstName}</p>
                    <p>{currentUser.lastName}</p>
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Email
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <p>{currentUser.email}</p>
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Location
                  </label>
                </div>

                <div class="flex sm:col-span-9">
                  <p className="mr-1">{currentUser.city},</p>
                  <p>{currentUser.state}</p>
                </div>
                <div class="sm:col-span-3">
                  <div class="inline-block">
                    <label
                      for="af-account-phone"
                      class="inline-block text-sm text-gray-800 mt-2.5 "
                    >
                      Phone
                    </label>
                    <span class="text-sm text-gray-400 "> (optional)</span>
                  </div>
                </div>
                <div class="sm:flex">
                  <input
                    id="af-account-phone"
                    type="text"
                    class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    placeholder="(xxx)xxx-xx-xx"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-bio"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    About you
                  </label>
                  <span class="text-sm text-gray-400 "> (optional)</span>
                </div>

                <div class="sm:col-span-9">
                  <textarea
                    id="af-account-bio"
                    class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    rows="6"
                    placeholder="I am a hardworking individual who strives to create a thriving environment. I have strong communication skills and work well with others."
                    onChange={(e) => setAboutDescription(e.target.value)}
                  ></textarea>
                </div>

                <div class="mt-5 flex justify-end gap-x-2">
                  {/* <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={updloadEducation}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildResume;
