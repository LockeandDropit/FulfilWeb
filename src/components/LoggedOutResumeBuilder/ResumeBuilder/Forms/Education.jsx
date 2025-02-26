import React, { useState, forwardRef, useEffect } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import {
  setDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import DatePicker from "react-datepicker";
import CalendarContainer from "react-datepicker";
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
import Experience from "./Experience";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoerHeader from "../../components/DoerHeader";

const Education = ({
  handleIncrementFormIndex,
  resetEducationForm,
  isEdit,
  isReset,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [degree, setDegree] = useState(null);
  const [institutionTitle, setInstitutionTitle] = useState(null);
  const [major, setMajor] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [id, setId] = useState(null);

  const { currentResumeName } = useResumeStore();
  const { currentUser } = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenChoose,
    onOpen: onOpenChoose,
    onClose: onCloseChoose,
  } = useDisclosure();

  const navigate = useNavigate();

  const notify = () => {
    toast("Success! Your edu has been updated.", {
      autoClose: 3000,
      type: "success",
    });
  };

  useEffect(() => {
    if (isReset === true) {
      notify();
    }
  }, []);

  const handleSaveAndClearData = () => {
    //POST all data

    //unmute +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    updloadEducation();

    //if isEdit
    //navigate to a new blank form
    resetEducationForm();
  };

  const checkIfValid = () => {
    if (!institutionTitle || !startDate || !degree || !major) {
      onOpen();
      console.log("1");
    } else if (!endDate && isEnrolled === false) {
      onOpen();
      console.log("2", endDate);
    } else if (isEdit && !isEditAndNew) {
      updloadEditedEducation().then(() => navigate("/ResumePreview"));
    } else if (isEdit && isEditAndNew) {
      updloadEducation().then(() => navigate("/ResumePreview"));
    } else {
      uploadAndNavigate();
      console.log("got em");
    }
  };

  const checkIfValidEdited = () => {
    if (!institutionTitle || !startDate || !degree || !major) {
      onOpen();
      console.log("1");
    } else if (!editedEndDate && isEnrolled === false) {
      onOpen();
      console.log("2", endDate);
    } else if (isEdit && !isEditAndNew) {
      updloadEditedEducation().then(() => navigate("/ResumePreview"));
    } else if (isEdit && isEditAndNew) {
      updloadEducation().then(() => navigate("/ResumePreview"));
    } else {
      uploadAndNavigate();
      console.log("got em");
    }
  };

  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState(null);

  //this is for editing
  const [selectedEducation, setSelectedEducation] = useState(null);

  useEffect(() => {
    if (isEdit === true && currentUser && currentResumeName) {
      setLoading(true);
      onOpenChoose();

      let intermediateHold = [];

      const unSub = onSnapshot(
        doc(db, "users", currentUser.uid, "Resumes", currentResumeName),
        async (res) => {
          setEducation(res.data().education);
          setIsEnrolled(res.data().isEnrolled);
          setLoading(false);
        }
      );


      // setEducation(intermediateHold)



      return () => {
        unSub();
      };
    } else {
      setLoading(false);
    }
  }, [currentUser, currentResumeName, isEdit]);

  const [editedStartDate, setEditedStartDate] = useState(null);
  const [editedEndDate, setEditedEndDate] = useState(null);

  const updloadEducation = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, currentResumeName), {
      education: arrayUnion({
        institutionName: institutionTitle,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        degree: degree,
        major: major,
        isEnrolled: isEnrolled,
        id: uuidv4(),
      }),
    });
  };

  const updloadEditedEducation = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic

    const resumeSnapshot = await getDoc(
      doc(db, "users", currentUser.uid, "Resumes", currentResumeName)
    );

    const resumeData = resumeSnapshot.data();

    const resumeIndex = resumeData.education.findIndex((x) => (x.id = id));

    console.log("id", id, resumeData.education[resumeIndex]);

    console.log("all checks", institutionTitle, degree, major, isEnrolled);

    resumeData.education[resumeIndex].institutionName = institutionTitle;
    resumeData.education[resumeIndex].degree = degree;
    resumeData.education[resumeIndex].major = major;
    resumeData.education[resumeIndex].startDate = editedStartDate
      ? editedStartDate.toLocaleDateString()
      : startDate;
    resumeData.education[resumeIndex].endDate = editedEndDate
      ? editedEndDate.toLocaleDateString()
      : endDate
      ? endDate
      : null;
    resumeData.education[resumeIndex].isEnrolled = isEnrolled;

    // resumeData.education[id].institutionName = institutionTitle;

    await updateDoc(doc(userChatsRef, currentResumeName), {
      education: resumeData.education,
    });
  };

  // const testUpdate = () => {
  //   const educationIndex = x
  // }

  const [isEditAndNew, setIsEditAndNew] = useState(false);

  const handleAddEducationWhileEditing = () => {
    setIsEditAndNew(true);
    setSelectedEducation(null);
    setInstitutionTitle(null);
    setStartDate(null);
    setDegree(null);
    setMajor(null);
    setEndDate(null);
    setIsEnrolled(false);
    onCloseChoose();

    console.log(
      "tester tesrtyyyy",
      selectedEducation,
      institutionTitle,
      startDate,
      degree,
      major,
      endDate
    );
  };

  const handleChooseEducation = (x) => {
    console.log("passed edu", x);
    setSelectedEducation(x);
    setInstitutionTitle(x.institutionName);
    setStartDate(x.startDate);
    setDegree(x.degree);
    setMajor(x.major);
    setIsEnrolled(x.isEnrolled);
    setId(x.id);

    if (x.endDate) {
      setEndDate(x.endDate);
    }
    onCloseChoose();
  };

  useEffect(() => {
    if (isEnrolled === true) {
      setEndDate(null);
    }
  }, []);

  const uploadAndNavigate = () => {
    updloadEducation().then(() => {
      handleIncrementFormIndex();
    });
  };

  const handleIsEnrolled = () => {};

  const ExampleCustomInput = forwardRef(({ value, onClick }, onChange, ref) => (
    <input
      className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      ref={ref}
      value={(date) => setEndDate(date)}
      onClick={onClick}
      selected={endDate}
      onChange={(date) => setEndDate(date)}
    />
  ));

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
      ) : (
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
                  Personal{" "}
                  <span class="hidden sm:inline-flex sm:ms-2">Info</span>
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
            {isEdit && selectedEducation !== null ? (
              <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
                <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
                  <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 ">Education</h2>
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
                        Degree
                      </label>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Major
                      </label>
                    </div>
                    <div class="sm:col-span-9 mt-1">
                      <input
                        id="af-account-email"
                        type="email"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Institution
                      </label>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        value={institutionTitle}
                        onChange={(e) => setInstitutionTitle(e.target.value)}
                      />
                    </div>
                    <div class="flex mb-1 mt-4 sm:mt-5">
                      <label
                        for="af-account-full-name"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Attendance
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
                              editedEndDate
                                ? editedEndDate
                                : endDate
                                ? endDate
                                : null
                            }
                            onChange={(date) => setEditedEndDate(date)}
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
                          Currently enrolled
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : isEdit && !selectedEducation ? (
              <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
                <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
                  <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 ">Education</h2>
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
                        Degree
                      </label>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Major, Minor, associates, etc."
                        onChange={(e) => setDegree(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Major
                      </label>
                    </div>
                    <div class="sm:col-span-9 mt-1">
                      <input
                        id="af-account-email"
                        type="email"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Engineering, English, Management, etc."
                        onChange={(e) => setMajor(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Institution
                      </label>
                    </div>

                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="ex: Hennepin Technical College"
                        onChange={(e) => setInstitutionTitle(e.target.value)}
                      />
                    </div>
                    <div class="flex mb-1 mt-4 sm:mt-5">
                      <label
                        for="af-account-full-name"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Attendance
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
                          Currently enrolled
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
                <div class="bg-white rounded-xl shadow p-4 sm:p-7 ">
                  <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 ">Education</h2>
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
                        Degree
                      </label>
                    </div>

                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Major, Minor, associates, etc."
                        onChange={(e) => setDegree(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Major
                      </label>
                    </div>

                    <div class="sm:col-span-9 mt-1">
                      <input
                        id="af-account-email"
                        type="email"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Engineering, English, Management, etc."
                        onChange={(e) => setMajor(e.target.value)}
                      />
                    </div>
                    <div class="sm:col-span-3 mt-4 sm:mt-5">
                      <label
                        for="af-account-email"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Institution
                      </label>
                    </div>

                    <div class="sm:col-span-9">
                      <input
                        id="af-account-email"
                        type="email"
                        class="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="ex: Hennepin Technical College"
                        onChange={(e) => setInstitutionTitle(e.target.value)}
                      />
                    </div>
                    <div class="flex mb-1 mt-4 sm:mt-5">
                      <label
                        for="af-account-full-name"
                        class="inline-block text-sm text-gray-800 mt-2.5 "
                      >
                        Attendance
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
                          Currently enrolled
                        </label>
                      </div>
                    </div>
                    <div class="mt-8 flex justify-center gap-x-2">
                      <button
                        type="button"
                        class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={handleSaveAndClearData}
                      >
                        Add Education
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
                        // onClick={uploadAndNavigate}
                        onClick={checkIfValid}
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
            )}

            {isEdit && (
              <>
                {" "}
                <div class="mt-8 flex justify-center gap-x-2">
                  {/* <button
                type="button"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
              >
                Cancel
              </button> */}
                  <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                    onClick={onOpenChoose}
                  >
                    Edit Other Education
                  </button>
                  {/* <button
                    type="button"
                    class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleSaveAndClearData}
                  >
                    Add More Education
                  </button> */}
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
                    // onClick={uploadAndNavigate}
                    // onClick={notify}
                    onClick={checkIfValidEdited}
                  >
                    Finish
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
              </>
            )}
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
        </main>
      )}

      <Modal isOpen={isOpenChoose} onClose={onCloseChoose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What part would you like to edit?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center justify-center">
              {education?.map((education) => (
                <button
                  class="mt-3 py-2 w-1/2 px-4 text-center items-center align-center gap-x-2 text-sm  font-semibold rounded-lg border  bg-gray-100 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => handleChooseEducation(education)}
                >
                  {education.institutionName}
                </button>
              ))}
              <button
                type="button"
                class="mt-3 py-2 px-6 w-1/2 text-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleAddEducationWhileEditing}
              >
                Add More Education
              </button>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => navigate("/ResumePreview")}
            >
              Nevermind
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Oops!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">
              Looks like you left something blank. Please make sure you've
              filled out all fields.
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={onClose}
            >
              Continue
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Education;
