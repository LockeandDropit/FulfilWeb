import React, { useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";

import DatePicker from "react-datepicker";
import CalendarContainer from "react-datepicker";
import {
  setDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useUserStore } from "../../Chat/lib/userStore";
import RichTextEditor from "../../../Needer/Components/RichTextEditor";
import "react-datepicker/dist/react-datepicker.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from "markdown-draft-js";


const Experience = ({ handleIncrementFormIndex, resetExperienceForm }) => {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [positionTitle, setPositionTitle] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  
  const { currentUser } = useUserStore();
  
  const handleSaveAndClearData = () => {

    //POST all data
    updloadExperience()
    //navigate to a new blank form
    resetExperienceForm();
  };

  const updloadExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, "Resume1"), {
      experience: arrayUnion({
        positionTitle: positionTitle,
        companyName: companyName,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        description: description,
      }),
    });
  };

  const handleUploadAndContinue = () => {

    updloadExperience().then(() => {
      handleIncrementFormIndex();   
    })
   
  }

  const [selected, setSelected] = useState();

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class=" pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
            <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-800 ">Experience</h2>
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
                    Position Title
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <input
                    id="af-account-email"
                    type="email"
                    class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Position title"
                    onChange={(e) => setPositionTitle(e.target.value)}
                  />
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-email"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Company Name
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <input
                    id="af-account-email"
                    type="email"
                    class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Company name"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div class="flex mb-1">
                  <label
                    for="af-account-full-name"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Employed
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <div class="sm:flex">
                    <div class="relative inline-block text-left">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </div>
                    <div class="relative inline-block text-left ml-auto">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    </div>
                  </div>
                </div>
                <div class="flex mb-1">
                  <div className="ml-auto mt-2.5">
                    <input
                      type="checkbox"
                      class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600"
                    />
                    <label
                      for="af-account-full-name"
                      class="inline-block text-sm text-gray-600"
                    >
                      Currently employed
                    </label>
                  </div>
                </div>
                <div class="sm:col-span-3">
                  <label
                    for="af-account-bio"
                    class="inline-block text-sm text-gray-800 mt-2.5 "
                  >
                    Job Description
                  </label>
                </div>

                <div class="sm:col-span-9">
                  <RichTextEditor
                    onChange={(description) => handleEditorChange(description)}
                    // ref={field.ref}
                    placeholder="ex: I was responsible for ensuring a pleasurable customer experience."
                  />
                </div>
                <div class="mt-2 flex justify-center gap-x-2">
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleSaveAndClearData}
                  >
                    Add Experience
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

export default Experience;