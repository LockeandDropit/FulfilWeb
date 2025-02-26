import React, { useState, forwardRef, useEffect } from "react";
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
import { useResumeStore } from "../lib/resumeStore";

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import DoerHeader from "../../components/DoerHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Experience = ({
  handleIncrementFormIndex,
  resetExperienceForm,
  isReset,
  isEdit
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);
  const [description, setDescription] = useState(null);
  const [positionTitle, setPositionTitle] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, isLoading] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState(null)

  const { currentUser } = useUserStore();
  const { currentResumeName } = useResumeStore();

  const handleSaveAndClearData = () => {
    //POST all data
    updloadExperience();
    //navigate to a new blank form
    resetExperienceForm();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const checkIfValid = () => {
    if (!positionTitle || !companyName || !startDate || description) {
      onOpen();
    } else if (!endDate && isEnrolled === false) {
      onOpen();
    } else {
      handleUploadAndContinue();
    }
  };

  const notify = () => {
    toast("Success! Your experience has been updated", {
      autoClose: 3000,
      type: "success",
    });
  };


  useEffect(() => {
    if (isReset === true) {
      notify();
    }
  }, []);

  const updloadExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, currentResumeName), {
      experience: arrayUnion({
        positionTitle: positionTitle,
        companyName: companyName,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        description: description,
        isCurrentlyEmployed: isEnrolled,
      }),
    });
  };

  const handleUploadAndContinue = () => {
    updloadExperience().then(() => {
      handleIncrementFormIndex();
    });
  };

  const [selected, setSelected] = useState();

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  const ExampleCustomInput = forwardRef(
    ({ value, onClick, className }, onChange, ref) => (
      <input
        className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        ref={ref}
        value={value}
        onClick={onClick}
      />
    )
  );

  const ExampleCustomInput2 = forwardRef(
    ({ value, onClick, className }, onChange, ref) => (
      <input
        className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        ref={ref}
        value={value}
        onClick={onClick}
      />
    )
  );
  const contextClass = {
    default: "bg-green-600",
  };

  return (
    <div>
      {/* <Header />
      <Dashboard /> */}


{loading ? (
 <p>spinner</p>
) : (  <main id="content" class=" pt-[59px]">
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
    {isEdit && selectedExperience !== null ? ( <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
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

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Position title"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div class="sm:col-span-3 mt-4 sm:mt-5">
            <label
              for="af-account-email"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Company Name
            </label>
          </div>

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div class="flex mb-1 mt-4 sm:mt-5">
            <label
              for="af-account-full-name"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Employed
            </label>
          </div>

          <div class="sm:col-span-9">
            <div class="sm:flex">
              <div class="relative  text-left">
              <DatePicker
                            selected={
                              editedStartDate ? editedStartDate : startDate
                            }
                            onChange={(date) => setEditedStartDate(date)}
                            className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          />
              </div>
              <div class="relative inline-block text-left ml-auto">
              <DatePicker
                            selected={
                              editedStartDate ? editedStartDate : startDate
                            }
                            onChange={(date) => setEditedStartDate(date)}
                            className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          />
              </div>
            </div>
          </div>
          <div class="flex mb-1">
            <div className="ml-auto mt-2.5">
              <input
                type="checkbox"
                class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600"
                onChange={() => setIsEnrolled(!isEnrolled)}
                checked={isEnrolled}
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

          <div class="sm:col-span-9 mt-1">
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
              class="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleUploadAndContinue}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>) : isEdit && !selectedExperience ? (  <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
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

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Position title"
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div class="sm:col-span-3 mt-4 sm:mt-5">
            <label
              for="af-account-email"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Company Name
            </label>
          </div>

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Company name"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div class="flex mb-1 mt-4 sm:mt-5">
            <label
              for="af-account-full-name"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Employed
            </label>
          </div>

          <div class="sm:col-span-9">
            <div class="sm:flex">
              <div class="relative  text-left">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
              <div class="relative inline-block text-left ml-auto">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div class="flex mb-1">
            <div className="ml-auto mt-2.5">
              <input
                type="checkbox"
                class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600"
                onChange={() => setIsEnrolled(!isEnrolled)}
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

          <div class="sm:col-span-9 mt-1">
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
              class="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleUploadAndContinue}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>) : (  <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
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

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Position title"
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div class="sm:col-span-3 mt-4 sm:mt-5">
            <label
              for="af-account-email"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Company Name
            </label>
          </div>

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Company name"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div class="flex mb-1 mt-4 sm:mt-5">
            <label
              for="af-account-full-name"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Employed
            </label>
          </div>

          <div class="sm:col-span-9">
            <div class="sm:flex">
              <div class="relative  text-left">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
              <div class="relative inline-block text-left ml-auto">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div class="flex mb-1">
            <div className="ml-auto mt-2.5">
              <input
                type="checkbox"
                class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600"
                onChange={() => setIsEnrolled(!isEnrolled)}
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

          <div class="sm:col-span-9 mt-1">
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
              class="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleUploadAndContinue}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>)} 
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

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Position title"
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div class="sm:col-span-3 mt-4 sm:mt-5">
            <label
              for="af-account-email"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Company Name
            </label>
          </div>

          <div class="sm:col-span-9 mt-1">
            <input
              id="af-account-email"
              type="email"
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Company name"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div class="flex mb-1 mt-4 sm:mt-5">
            <label
              for="af-account-full-name"
              class="inline-block text-sm text-gray-800 mt-2.5 "
            >
              Employed
            </label>
          </div>

          <div class="sm:col-span-9">
            <div class="sm:flex">
              <div class="relative  text-left">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
              <div class="relative inline-block text-left ml-auto">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div class="flex mb-1">
            <div className="ml-auto mt-2.5">
              <input
                type="checkbox"
                class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600"
                onChange={() => setIsEnrolled(!isEnrolled)}
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

          <div class="sm:col-span-9 mt-1">
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
              class="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleUploadAndContinue}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div className="flex items-center justify-center w-full">
    <ToastContainer
      toastClassName={(context) =>
        contextClass[context?.type || "default"] +
        " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
      }
      position="bottom-center"
      autoClose={3000}
      bodyClassName={() => "text-sm text-gray-800 font-med block p-3"}
    />
  </div>
</main>)}
   
    </div>
  );
};

export default Experience;
