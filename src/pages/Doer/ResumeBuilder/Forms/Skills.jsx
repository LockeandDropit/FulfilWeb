import React, { useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";

import DatePicker from "react-datepicker";
import CalendarContainer from "react-datepicker";

import RichTextEditor from "../../../Needer/Components/RichTextEditor";
import "react-datepicker/dist/react-datepicker.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from "markdown-draft-js";
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

const Skills = ({ handleIncrementFormIndex, resetSkillsForm }) => {
  const [skillName, setSkillName] = useState(null);

  const { currentUser } = useUserStore();
  const { currentResumeName } = useResumeStore();

  const handleSaveAndClearData = () => {
    //POST all data
    updloadExperience();
    //navigate to a new blank form
    resetSkillsForm();
  };

  const updloadExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, currentResumeName), {
      skills: arrayUnion({
        skillName: skillName,
      }),
    });
  };

  const handleUploadAndContinue = () => {
    if (!skillName) {
      handleIncrementFormIndex();
    } else {
      updloadExperience().then(() => {
        handleIncrementFormIndex();
      });
    }
  };

  return (
    <div>
      <Header />
      <Dashboard />
      <main id="content" class=" pt-[59px]">
        <div class="max-w-6xl mx-auto mt-5">
          <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            <li class="flex md:w-full items-center text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
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
            <li class="flex md:w-full items-center text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
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
                Education
              </span>
            </li>
            <li class="flex md:w-full items-center text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
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
                <h2 class="text-xl font-bold text-gray-800 ">Skills</h2>
                <p class="text-sm text-gray-600 ">
                  Provide general contact information, along with a few
                  sentences to describe yourself.
                </p>
              </div>

              <form>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Skill Name
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <input
                    id="af-account-email"
                    type="email"
                    class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Position title"
                    onChange={(e) => setSkillName(e.target.value)}
                  />
                </div>

                <div class="mt-8 flex justify-center gap-x-2">
                  {/* <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleSaveAndClearData}
                  >
                    Add skills
                  </button>
                </div>
                <div class="mt-10 flex justify-end gap-x-2">
                  {/* <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleUploadAndContinue}
                  >
                    Finish
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

export default Skills;
