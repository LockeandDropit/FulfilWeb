import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import { useUserStore } from "../../Chat/lib/userStore";
import {
  setDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useResumeStore } from "../lib/resumeStore";
import { useNavigate } from "react-router-dom";
import DoerHeader from "../../components/DoerHeader";


const BuildResume = ({ handleIncrementFormIndex, isEdit }) => {
  const { currentUser } = useUserStore();
  const { currentResumeName } = useResumeStore();
  console.log("resume name", currentResumeName);
  const navigate = useNavigate();

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

  const updloadEducationEdit = async () => {
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
      id: currentResumeName
    })
      .then(() => {
        navigate("/ResumePreview")
      })
      .catch((e) => alert(e));
  };

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit === true && currentUser && currentResumeName) {
      setLoading(true)
      //fetch about && phone # from fb
      getDoc(
        doc(db, "users", currentUser.uid, "Resumes", currentResumeName)
      ).then((snapshot) => {
        if (!snapshot.data()) {
        } else {
          console.log("from firestore", snapshot.data().aboutDescription);
          setAboutDescription(snapshot.data().aboutDescription);
          setPhoneNumber(snapshot.data().phoneNumber)
        }
        setLoading(false);
      });
      setLoading(false);
    } else {setLoading(false) }
  }, [currentUser, currentResumeName, isEdit]);

  return (
    <div>
      {/* <Header />
      <Dashboard /> */}


      <main id="content" class="pt-[59px]">
        <div class="">
          <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            <li class="flex md:w-full items-center after:text-gray-200 dark:after:text-gray-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
              <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <svg
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                Personal <span class="hidden sm:inline-flex sm:ms-2">Info</span>
              </span>
            </li>
            <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
              <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <span class="me-2">2</span>
                Education
              </span>
            </li>
            <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
              <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <span class="me-2">3</span>
                Experience
              </span>
            </li>
            <li class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
              <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <span class="me-2">4</span>
                Skills
              </span>
            </li>
            <li class="flex items-center">
              <span class="me-2">5</span>
              Finish
            </li>
          </ol>

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
                  <div class="hs-tooltip inline-block"></div>
                </div>

                <div class="sm:col-span-9">
                  <div class="sm:flex">
                    <p className="mr-1 text-base">{currentUser.firstName}</p>
                    <p>{currentUser.lastName}</p>
                  </div>
                </div>

                <div class="sm:col-span-3">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-4 sm:mt-5"
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
                    class="inline-block text-sm text-gray-800 mt-4 sm:mt-5"
                  >
                    Location
                  </label>
                </div>

                <div class="flex sm:col-span-9">
                  <p className="mr-1">{currentUser.city},</p>
                  <p>{currentUser.state}</p>
                </div>

                {loading ? (
                <p>spinner</p>
                ) : (<>
                  <div class="sm:col-span-3">
                  <div class="inline-block">
                    <label
                      for="af-account-phone"
                      class="inline-block text-sm text-gray-800 mt-4 sm:mt-5 "
                    >
                      Phone
                    </label>
                    <span class="text-sm text-gray-400 "> (optional)</span>
                  </div>
                </div>
                <div class="sm:flex mt-1">
                  <input
                    id="af-account-phone"
                    type="text"
                    class="py-2 px-3 pe-11 block w-1/2 border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    value={phoneNumber ? phoneNumber : null}
                    placeholder="xxx-xxx-xxxx"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-bio"
                    class="inline-block text-sm text-gray-800 mt-4 sm:mt-7"
                  >
                    About you
                  </label>
                  <span class="text-sm text-gray-400 "> (optional)</span>
                </div>

                <div class="sm:col-span-9 mt-1">
                  {isEdit ? (
                    <textarea
                      id="af-account-bio"
                      class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                      rows="6"
                      value={aboutDescription ? aboutDescription : null}
                      onChange={(e) => setAboutDescription(e.target.value)}
                    >
                    
                    </textarea>
                  ) : (
                    <textarea
                      id="af-account-bio"
                      class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                      rows="6"
                      placeholder="I am a hard working, focused individual who is set on self-improvement."
                      onChange={(e) => setAboutDescription(e.target.value)}
                    ></textarea>
                  )}
                </div>
                </>)}
             

                <div class="mt-5 flex justify-end gap-x-2">
                  {/* <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                  >
                    Cancel
                  </button> */}
                  {isEdit ? (<button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={updloadEducationEdit}
                  >
                    Finish Editing
                  </button>) : (<button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={updloadEducation}
                  >
                    Next
                  </button>)}
                  
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
