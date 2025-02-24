import React from "react";
import { useUserStore } from "../Chat/lib/userStore";
import { db } from "../../../firebaseConfig";
import RichTextEditor from "../../Needer/Components/RichTextEditor";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
import { Box } from "@chakra-ui/react";
// import { useUserStore } from "../Chat/lib/userStore";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  arrayUnion,
  onSnapshot,
  deleteDoc,
  deleteField,
} from "firebase/firestore";

// import RichTextEditor from "../../Needer/Components/RichTextEditor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from "markdown-draft-js";
import { stateFromMarkdown } from "draft-js-import-markdown";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  onEditorStateChange,
} from "draft-js";

import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";

const Education = ({ changeListener }) => {
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (currentUser) {
      setCurrentIncome(currentUser.currentIncome);
      setGoalIncome(currentUser.goalIncome);
      setUserInterests(currentUser.userInterests);
    }
  }, [currentUser]);

  const [currentIncome, setCurrentIncome] = useState(null);
  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);
  const [userInterests, setUserInterests] = useState(null);

  const [isEditCareerGoals, setIsEditCareerGoals] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [formValidationMessage, setFormValidationMessage] = useState();

  const [companyName, setCompanyName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState(null);

  const [positionTitle, setPositionTitle] = useState(null);

  // new
  const [degree, setDegree] = useState(null);
  const [institutionName, setInstitutionName] = useState(null);
  const [isEmployed, setIsEmployed] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const uploadWorkExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, "My Resume"), {
      education: arrayUnion({
        degree: degree,
        institutionName: institutionName,
        startDate: startDate.toLocaleDateString(),
        displayStartDate: startDate.toLocaleDateString("en-US", options),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        displayEndDate: endDate
          ? endDate.toLocaleDateString("en-US", options)
          : null,
        isEnrolled: isEnrolled,
        id: uuidv4(),
      }),
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      setIsAddNew(!isAddNew);
    });
  };

  var options = { year: "numeric", month: "numeric" };

  const uploadEditedWorkExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    const resumeSnapshot = await getDoc(
      doc(db, "users", currentUser.uid, "Resumes", "My Resume")
    );
    const resumeData = resumeSnapshot.data();
    console.log("resume data", resumeData);
    console.log("selected id", selectedExperience.id);
    console.log("isEmployed", isEmployed);

    //ty https://stackoverflow.com/questions/10557486/in-an-array-of-objects-fastest-way-to-find-the-index-of-an-object-whose-attribu credit Pablo Francisco Perez Hidalgo 04/19/2013
    const resumeIndex = resumeData.education
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    // go back live
    resumeData.education[resumeIndex].degree = degree
      ? degree
      : selectedExperience.degree
      ? selectedExperience.degree
      : null;
    resumeData.education[resumeIndex].institutionName = institutionName
      ? institutionName
      : selectedExperience.institutionName;
    resumeData.education[resumeIndex].startDate = startDate
      ? startDate.toLocaleDateString()
      : selectedExperience.startDate;
    resumeData.experience[resumeIndex].displayStartDate = startDate
      ? startDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayStartDate;
    resumeData.education[resumeIndex].endDate = endDate
      ? endDate.toLocaleDateString()
      : selectedExperience.endDate
      ? selectedExperience.endDate
      : null;
    resumeData.experience[resumeIndex].displayEndDate = endDate
      ? endDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayEndDate
      ? selectedExperience.displayEndDate
      : null;
    resumeData.education[resumeIndex].isEnrolled =
      isEnrolled === true ? true : false;

    //test conmditions
    // setUpdateIsLoading(false);
    // setIsEditCareerGoals(!isEditCareerGoals);

    //live when fixed
    await updateDoc(doc(userChatsRef, "My Resume"), {
      education: resumeData.education,
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setSelectedExperience(null);
      setEndDate(null);
      setStartDate(null);
      setDegree(null);
      setInstitutionName(null);
      setIsEnrolled(false);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const handleCancel = () => {
    setSelectedExperience(null);
    setFormValidationMessage();
    setEndDate(null);
    setStartDate(null);
    setDegree(null);
    setInstitutionName(null);
    setIsEnrolled(false);
    setIsEditCareerGoals(!isEditCareerGoals);
  };
  const handleCancelNew = () => {
    setFormValidationMessage();
    setSelectedExperience(null);
    setEndDate(null);
    setStartDate(null);
    setDegree(null);
    setInstitutionName(null);
    setIsEnrolled(false);
    setIsAddNew(!isAddNew);
  };

  const handleSelectedEdit = (x) => {
    setSelectedExperience(x);
    setIsEnrolled(x.isEnrolled);
    console.log("handleSelectedEdit", x);
    setIsEditCareerGoals(!isEditCareerGoals);
  };

  const handleUpdate = (selectedExperience) => {
    if (!institutionName && !selectedExperience.institutionName) {
      setFormValidationMessage("Please fill out all fields");
    } else if (!selectedExperience.startDate && !startDate) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().
      uploadEditedWorkExperience();
      setFormValidationMessage();
    }
  };

  const addEducation = () => {
    if (!institutionName || !startDate) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      setUpdateIsLoading(true);
      setFormValidationMessage();
      //update firestore
      uploadWorkExperience();
    }
  };

  const [loading, setLoading] = useState(false);
  const [workExperience, setWorkExperience] = useState(null);

  //this is for editing
  const [selectedEducation, setSelectedEducation] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      //   onOpenChoose();

      let intermediateHold = [];

      const unSub = onSnapshot(
        doc(db, "users", currentUser.uid, "Resumes", "My Resume"),
        async (res) => {
          if (res.data()?.education) {
            setWorkExperience(res.data().education);
          }
        }
      );

      return () => {
        unSub();
      };
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleDeleteSelected = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic

    const resumeSnapshot = await getDoc(
      doc(db, "users", currentUser.uid, "Resumes", "My Resume")
    );

    const resumeData = resumeSnapshot.data();

    //ty https://stackoverflow.com/questions/10557486/in-an-array-of-objects-fastest-way-to-find-the-index-of-an-object-whose-attribu credit Pablo Francisco Perez Hidalgo 04/19/2013
    const resumeIndex = resumeData.education
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    let newData = resumeData.education.splice(resumeIndex, 1);

    console.log("new data", resumeData.education);

    // let finalResume = resumeData.experience.splice(resumeIndex, 1);

    // setWorkExperience(finalResume)

    // console.log("final resume", finalResume);

    //  resumeData.experience[resumeIndex].id = "deleted"

    await updateDoc(doc(userChatsRef, "My Resume"), {
      education: resumeData.education,
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setSelectedExperience(null);
      setEndDate(null);
      setStartDate(null);
      setDegree(null);
      setInstitutionName(null);
      setIsEnrolled(false);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const [isAddNew, setIsAddNew] = useState(false);

  //thgis handles toggling back and forth between the person being currently employed/having an end date.

  useEffect(() => {
    if (isEnrolled) {
      setEndDate(null);
    }
  }, [isEnrolled]);

  useEffect(() => {
    if (endDate) {
      setIsEnrolled(false);
    }
  }, [endDate]);

  const handleNew = () => {
    setSelectedExperience(null);
    setEndDate(null);
    setStartDate(null);
    setDegree(null);
    setInstitutionName(null);
    setIsEnrolled(false);
    setIsAddNew(!isAddNew);
  };

  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <label
              for="hs-pro-epdsku"
              class="block font-medium text-stone-800 "
            >
              Education
            </label>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <div className="flex flex-col ">
          {workExperience?.map((experience) => (
            <div className="flex flex-col  space-y-2 mb-16">
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Institution Name:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <input
                      type="text"
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="This is placeholder"
                      value={
                        institutionName !== null
                          ? institutionName
                          : experience.institutionName
                      }
                    />
                  ) : (
                    <p className="text-sm ">{experience.institutionName}</p>
                  )}
                </div>
                <div className="sm:col-span-1 ml-auto">
                  {isEditCareerGoals ? null : (
                    <div
                      className=" text-sm ml-auto cursor-pointer text-blue-400 hover:text-blue-600 hover:underline"
                      onClick={() => handleSelectedEdit(experience)}
                    >
                      Edit
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row align-center items-center"></div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Degree (optional):
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <input
                      type="text"
                      onChange={(e) => setDegree(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="This is placeholder"
                      value={degree !== null ? degree : experience.degree}
                    />
                  ) : (
                    <p className="text-sm ">{experience.degree}</p>
                  )}
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Attendance:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <div className="w-full">
                      <div className="flex align-center items-center">
                        <DatePicker
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          selected={
                            startDate !== null
                              ? startDate
                              : experience.startDate
                          }
                          onChange={(date) => setStartDate(date)}
                          className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />

                        <span className="font-medium text-gray-800 mx-2">
                          -
                        </span>

                        <DatePicker
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          selected={
                            endDate !== null ? endDate : experience.endDate
                          }
                          onChange={(date) => setEndDate(date)}
                          className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </div>
                      <div className="ml-auto">
                        <div
                          className="ml-auto mt-2.5"
                          onClick={() => setIsEnrolled(!isEnrolled)}
                        >
                          <input
                            type="checkbox"
                            class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600 cursor-pointer"
                            onChange={() => setIsEnrolled(!isEnrolled)}
                            checked={isEnrolled}
                          />
                          <label
                            for="af-account-full-name"
                            class="inline-block text-sm text-gray-600 ml-auto"
                          >
                            Currently Enrolled
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex align-center items-center">
                      <p className="text-sm">{experience.displayStartDate}</p>
                      <span className="font-medium text-gray-800 mx-1">-</span>
                      {experience.isEnrolled === true ? (
                        <p className="text-sm">Currently Enrolled</p>
                      ) : (
                        <p className="text-sm">{experience.displayEndDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditCareerGoals && experience.id === selectedExperience.id ? (
                <div className="ml-auto mt-2">
                  <button
                    type="button"
                    class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeleteSelected()}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handleUpdate(selectedExperience)}
                  >
                    Update
                  </button>
                </div>
              ) : null}
              {formValidationMessage ? (
                <p className="text-red-500 text-sm">{formValidationMessage}</p>
              ) : null}
            </div>
          ))}

          {workExperience?.length <= 0 && isAddNew === false && (
            <div class="p-5 min-h-[328px] flex flex-col justify-center items-center text-center">
              <svg
                class="w-48 mx-auto mb-4"
                width="178"
                height="90"
                viewBox="0 0 178 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="27"
                  y="50.5"
                  width="124"
                  height="39"
                  rx="7.5"
                  fill="currentColor"
                  class="fill-white "
                />
                <rect
                  x="27"
                  y="50.5"
                  width="124"
                  height="39"
                  rx="7.5"
                  stroke="currentColor"
                  class="stroke-gray-50 "
                />
                <rect
                  x="34.5"
                  y="58"
                  width="24"
                  height="24"
                  rx="4"
                  fill="currentColor"
                  class="fill-gray-50 "
                />
                <rect
                  x="66.5"
                  y="61"
                  width="60"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  class="fill-gray-50 "
                />
                <rect
                  x="66.5"
                  y="73"
                  width="77"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  class="fill-gray-50 "
                />
                <rect
                  x="19.5"
                  y="28.5"
                  width="139"
                  height="39"
                  rx="7.5"
                  fill="currentColor"
                  class="fill-white "
                />
                <rect
                  x="19.5"
                  y="28.5"
                  width="139"
                  height="39"
                  rx="7.5"
                  stroke="currentColor"
                  class="stroke-gray-100 "
                />
                <rect
                  x="27"
                  y="36"
                  width="24"
                  height="24"
                  rx="4"
                  fill="currentColor"
                  class="fill-gray-100 "
                />
                <rect
                  x="59"
                  y="39"
                  width="60"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  class="fill-gray-100 "
                />
                <rect
                  x="59"
                  y="51"
                  width="92"
                  height="6"
                  rx="3"
                  fill="currentColor"
                  class="fill-gray-100 "
                />
                <g filter="url(#filter13)">
                  <rect
                    x="12"
                    y="6"
                    width="154"
                    height="40"
                    rx="8"
                    fill="currentColor"
                    class="fill-white "
                    shape-rendering="crispEdges"
                  />
                  <rect
                    x="12.5"
                    y="6.5"
                    width="153"
                    height="39"
                    rx="7.5"
                    stroke="currentColor"
                    class="stroke-gray-100 "
                    shape-rendering="crispEdges"
                  />
                  <rect
                    x="20"
                    y="14"
                    width="24"
                    height="24"
                    rx="4"
                    fill="currentColor"
                    class="fill-gray-200  "
                  />
                  <rect
                    x="52"
                    y="17"
                    width="60"
                    height="6"
                    rx="3"
                    fill="currentColor"
                    class="fill-gray-200 "
                  />
                  <rect
                    x="52"
                    y="29"
                    width="106"
                    height="6"
                    rx="3"
                    fill="currentColor"
                    class="fill-gray-200 "
                  />
                </g>
                <defs>
                  <filter
                    id="filter13"
                    x="0"
                    y="0"
                    width="178"
                    height="64"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="6" />
                    <feGaussianBlur stdDeviation="6" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1187_14810"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1187_14810"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>

              <div class="max-w-sm mx-auto">
                <p class="mt-2 font-medium text-gray-800 ">Nothing here</p>
                <p class="mb-5 text-sm text-gray-500 "></p>
              </div>
              <button
                type="button"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                data-hs-overlay="#hs-pro-dasadpm"
                onClick={() => handleNew()}
              >
                <svg
                  class="hidden sm:block flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Education
              </button>
            </div>
          )}

          {isAddNew ? (
            <div className="flex flex-col  space-y-3 z-50 mt-4">
              <div class="grid sm:grid-cols-4  align-center items-center mt-8">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Institution Name:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="This is placeholder"
                  />
                </div>
                <div className="sm:col-span-1 ml-auto"></div>
              </div>
              <div className="flex flex-row align-center items-center"></div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Degree (optional):
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setDegree(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="This is placeholder"
                  />
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Dates Attended:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <div className="flex align-center items-center">
                    <DatePicker
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    />

                    <span className="font-medium text-gray-800 mx-2">-</span>

                    <DatePicker
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    />
                  </div>
                  <div class="flex mb-1">
                    <div className="ml-auto mt-2.5">
                      <input
                        type="checkbox"
                        class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600 cursor-pointer"
                        onChange={() => setIsEnrolled(!isEnrolled)}
                        checked={isEnrolled}
                      />
                      <label
                        for="af-account-full-name"
                        class="inline-block text-sm text-gray-600 cursor-pointer"
                        onClick={() => setIsEnrolled(!isEnrolled)}
                      >
                        Currently enrolled
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-auto space-x-2 mt-2">
                <button
                  type="button"
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => handleCancelNew()}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => addEducation()}
                >
                  Add
                </button>
              </div>

              {formValidationMessage ? (
                <p className="text-red-500 text-sm">{formValidationMessage}</p>
              ) : null}
            </div>
          ) : null}

          {isAddNew ||
          isEditCareerGoals ||
          workExperience?.length <= 0 ? null : (
            <div className="ml-auto mt-3">
              <button
                type="button"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleNew()}
              >
                Add More
              </button>
            </div>
          )}
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default Education;
