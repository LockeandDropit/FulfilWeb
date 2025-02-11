import React from "react";
import { useState, useEffect } from "react";
import DoerHeader from "./components/DoerHeader";
import { useMediaQuery } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import { Box } from "@chakra-ui/react";
import Select from "react-select";
import { useUserStore } from "./Chat/lib/userStore";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Education from "./ProfileComponents/Education";
import Work from "./ProfileComponents/Work";
import Skills from "./ProfileComponents/Skills";
import StepperComponent from "./ProfileComponents/StepperComponent";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumePreview from "./ResumeBuilder/ResumePreview";

const MyProfile = () => {
  const { currentUser } = useUserStore();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);

  const [businessName, setBusinessName] = useState(null);

  const [isEditCareerGoals, setIsEditCareerGoals] = useState(false);
  const [isEditGoalIncome, setIsEditGoalIncome] = useState(false);
  const [isEditCurrentIncome, setIsEditCurrentIncome] = useState(false);
  const [accordionHidden, setAccordionHidden] = useState(false);

  const handleAccordionForPrint = () => {
    setAccordionHidden(!accordionHidden);
  };

  useEffect(() => {
    if (currentUser) {
      setCurrentIncome(currentUser.currentIncome);
      setGoalIncome(currentUser.goalIncome);
      setUserInterests(currentUser.userInterests);

      setSavedCareers(
        currentUser.savedCareerInterests.filter((x) => x.savedInterest)
      );
      console.log(
        "interests saved",
        currentUser.savedCareerInterests.filter((x) => x.savedInterest)
      );
    }
  }, [currentUser]);

  const [currentIncome, setCurrentIncome] = useState(null);
  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);
  const [userInterests, setUserInterests] = useState(null);
  const [savedCareers, setSavedCareers] = useState(null);

  useEffect(() => {
    if (goalIncome) {
      setGoalFinalIncome(goalIncome.label);
    }
  }, [goalIncome]);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [formValidationMessage, setFormValidationMessage] = useState();

  const uploadToFirebase = async () => {
    await updateDoc(doc(db, "users", currentUser.uid), {
      userInterests: userInterests,
      currentIncome: currentIncome,
      goalIncome: goalIncome,
    }).then(() => {
      setUpdateIsLoading(false);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  //lets see. How would I do this, delete locally and in fb

  const handleDeleteSelected = async (saved) => {
    setSavedCareers(savedCareers.filter((x) => x.id !== saved.id));

    const resumeSnapshot = await getDoc(doc(db, "users", currentUser.uid));

    const resumeData = resumeSnapshot.data();

    const resumeIndex = resumeData.savedCareerInterests
      .map(function (x) {
        return x.id;
      })
      .indexOf(saved.id);

    let newData = resumeData.savedCareerInterests.splice(resumeIndex, 1);

    await updateDoc(doc(db, "users", currentUser.uid), {
      savedCareerInterests: resumeData.savedCareerInterests,
    }).then(() => {
      // changeListener();
      // setUpdateIsLoading(false);
      // setSelectedExperience(null);
      // setSkillName(null)
      // setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  // regex credit Rogit Jain 8/3/2013 https://stackoverflow.com/questions/18033088/javascript-function-need-allow-numbers-dot-and-comma
  let regex = /^[0-9.,]+$/;

  const handleUpdate = () => {
    let currentIncomeTest = regex.test(currentIncome);
    let goalIncomeTest = regex.test(goalIncome);

    console.log("refex test", regex.test(currentIncome));
    if (!userInterests || !currentIncomeTest || !goalIncomeTest) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      setUpdateIsLoading(true);
      //update firestore
      uploadToFirebase();
      setFormValidationMessage();
    }
  };

  //update in fb
  useEffect(() => {
    if (newInterest) {
      let newID = savedCareers.filter((x) => x.savedInterest === newInterest);

      console.log("newID", newID);
      updateDoc(doc(db, "users", currentUser.uid), {
        savedCareerInterests: arrayUnion({
          id: newID[0].id,
          savedInterest: newInterest,
        }),
      }).then(() => setNewInterest(""));

      setNewInterest("");
    }
  }, [savedCareers]);
  const [newInterest, setNewInterest] = useState(null);

  const addNewInterest = async () => {
    //update Locally
    setSavedCareers([
      ...savedCareers,
      { id: uuidv4(), savedInterest: newInterest },
    ]);
  };

  const [changeOccured, setChangeOccured] = useState(false);

  const changeListener = () => {
    setChangeOccured(!changeOccured);
    notify();
  };

  const notify = () => {
    toast("Success, your profile has been updated!", {
      autoClose: 3000,
      type: "success",
      position: "bottom-right",
    });
  };

  const contextClass = {
    default: "bg-green-600",
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalCloseAccordion = () => {
    setOpenModal(true);
    setAccordionHidden("hidden");
  };

  const setModalClosed = () => {
    setOpenModal(false);
    setAccordionHidden(false);
  };

  return (
    <>
      <DoerHeader />

      {currentUser && (
        <main id="content">
          <div class="max-w-6xl mx-auto">
            <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
              <div class="p-5 pb-0 bg-white border border-gray-200 shadow-sm rounded-xl ">
                <figure>
                  <svg
                    class="w-full"
                    preserveAspectRatio="none"
                    width="1113"
                    height="161"
                    viewBox="0 0 1113 161"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_666_220723)">
                      <rect
                        x="0.5"
                        width="1112"
                        height="161"
                        rx="12"
                        fill="white"
                      ></rect>
                      <rect
                        x="1"
                        width="1112"
                        height="348"
                        fill="#A7E1FC"
                      ></rect>
                      <path
                        d="M512.694 359.31C547.444 172.086 469.835 34.2204 426.688 -11.3096H1144.27V359.31H512.694Z"
                        fill="#56C4F9"
                      ></path>
                      <path
                        d="M818.885 185.745C703.515 143.985 709.036 24.7949 726.218 -29.5801H1118.31V331.905C1024.49 260.565 963.098 237.945 818.885 185.745Z"
                        fill="#0BA5EE"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_666_220723">
                        <rect
                          x="0.5"
                          width="1112"
                          height="161"
                          rx="12"
                          fill="white"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </figure>

                <div class="-mt-24">
                  <div class="relative flex w-[120px] h-[120px] mx-auto border-4 border-white rounded-full ">
                    {profilePicture ? (
                      <img
                        class="object-cover size-full rounded-full"
                        src={profilePicture}
                        alt="Image Description"
                      />
                    ) : (
                      <svg
                        class="size-full text-gray-500"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.62854"
                          y="0.359985"
                          width="15"
                          height="15"
                          rx="7.5"
                          fill="white"
                        ></rect>
                        <path
                          d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    )}

                    <div class="absolute bottom-0 -end-2"></div>
                  </div>

                  <div class="mt-3 text-center mb-3">
                    <h1 class="text-xl font-semibold text-gray-800 ">
                      {currentUser.firstName} {currentUser.lastName}
                    </h1>
                    {/* <p class="text-gray-500 ">
                       iam_amanda
                     </p> */}
                  </div>
                </div>
              </div>

              {isDesktop ? null : (
                <>
                  {" "}
                  <div class="xl:ps-5 grow space-y-5">
                    <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                      {/* Start about */}
                      <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                        <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                          <div class="pt-4 first:pt-0">
                            <h2 class="text-sm font-semibold text-gray-800 ">
                              Details
                            </h2>

                            <ul class="mt-3 space-y-2">
                              {businessName ? (
                                <li>
                                  <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                    <svg
                                      class="flex-shrink-0 size-4 text-gray-600 "
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    >
                                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                      <path d="M10 6h4" />
                                      <path d="M10 10h4" />
                                      <path d="M10 14h4" />
                                      <path d="M10 18h4" />
                                    </svg>
                                  </div>
                                </li>
                              ) : null}

                              <li>
                                <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                  <svg
                                    class="flex-shrink-0 size-4 text-gray-600 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  {currentUser.city}, {currentUser.state}
                                </div>
                              </li>

                              <li>
                                <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                  <svg
                                    class="flex-shrink-0 size-4 text-gray-600 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                    <rect
                                      width="20"
                                      height="16"
                                      x="2"
                                      y="4"
                                      rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                  </svg>
                                  {currentUser.email}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* stepper component */}
                      <StepperComponent
                        currentUser={currentUser}
                        changeListener={changeListener}
                      />
                    </div>
                  </div>
                </>
              )}

              <div class="xl:p-5 flex flex-col xl:bg-white xl:border xl:border-gray-200 xl:shadow-sm xl:rounded-xl ">
                <div class="xl:flex">
                  <div
                    id="hs-pro-dupsd"
                    class="hs-overlay [--auto-close:xl] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-[320px] bg-white p-5 overflow-y-auto xl:relative xl:z-0 xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 xl:p-0 border-e border-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 "
                  >
                    <div class="xl:hidden">
                      <div class="absolute top-2 end-4 z-10">
                        <button
                          type="button"
                          class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                          data-hs-overlay="#hs-pro-dupsd"
                        >
                          <span class="sr-only">Close</span>
                          <svg
                            class="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                      <div class="pt-4 first:pt-0">
                        <h2 class="text-sm font-semibold text-gray-800 ">
                          Details
                        </h2>
                        <ul class="mt-3 space-y-2">
                          {businessName ? (
                            <li>
                              <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                <svg
                                  class="flex-shrink-0 size-4 text-gray-600 "
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                  <path d="M10 6h4" />
                                  <path d="M10 10h4" />
                                  <path d="M10 14h4" />
                                  <path d="M10 18h4" />
                                </svg>
                              </div>
                            </li>
                          ) : null}

                          <li>
                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 "
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {currentUser.city}, {currentUser.state}
                            </div>
                          </li>

                          <li>
                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 "
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <rect
                                  width="20"
                                  height="16"
                                  x="2"
                                  y="4"
                                  rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>
                              {currentUser.email}
                            </div>
                          </li>
                        </ul>
                        <h2 class="text-sm font-semibold text-gray-800 mt-4 mb-3">
                          Profile Progress
                        </h2>{" "}
                        {/* stepper component */}
                        <StepperComponent
                          currentUser={currentUser}
                          changeListener={changeListener}
                          changeOccured={changeOccured}
                        />
                        <div>
                          <button
                            type="button"
                            class="mt-4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            // onClick={() => setOpenModal(true)}
                            onClick={() => handleOpenModalCloseAccordion()}
                          >
                            Create Resume
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                                clipRule="evenodd"
                              />
                              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="xl:ps-5  w-full sm:w-3/4 space-y-1 mt-2">
                    <div className="flex flex-col bg-white rounded-xl shadow-sm xl:shadow-none  w-full ml-auto">
                      {accordionHidden ? null : (
                        <Accordion defaultIndex={[0]} allowMultiple>
                          <AccordionItem>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <label
                                  for="hs-pro-epdsku"
                                  class="block font-medium text-stone-800 "
                                >
                                  Career Goals{" "}
                                  <span className="text-gray-500 text-sm">
                                    (only you can see this)
                                  </span>
                                </label>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                              <div className="flex flex-col  space-y-2 z-50">
                                <div class="grid sm:grid-cols-4  align-center items-center">
                                  <div class="sm:col-span-1 2xl:col-span-1">
                                    <p className="font-medium text-sm text-gray-800">
                                      Current Income:
                                    </p>
                                  </div>
                                  <div class="sm:col-span-2 align-center items-center">
                                    {isEditCareerGoals ? (
                                      <input
                                        type="text"
                                        onChange={(e) =>
                                          setCurrentIncome(e.target.value)
                                        }
                                        className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="This is placeholder"
                                        value={
                                          currentIncome ? currentIncome : null
                                        }
                                      />
                                    ) : (
                                      <p className="text-sm ml-2">
                                        {" "}
                                        {currentIncome}
                                      </p>
                                    )}
                                  </div>
                                  <div className="sm:col-span-1 ml-auto">
                                    {isEditCareerGoals ? null : (
                                      <div
                                        className=" text-sm ml-auto cursor-pointer text-blue-400 hover:text-blue-600 hover:underline"
                                        onClick={() =>
                                          setIsEditCareerGoals(
                                            !isEditCareerGoals
                                          )
                                        }
                                      >
                                        Edit
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div class="grid sm:grid-cols-4  align-center items-center">
                                  <div class="sm:col-span-1 2xl:col-span-1">
                                    <p className="font-medium text-sm text-gray-800">
                                      Goal Income:
                                    </p>
                                  </div>
                                  <div class="sm:col-span-2 align-center items-center">
                                    {isEditCareerGoals ? (
                                      <input
                                        type="text"
                                        onChange={(e) =>
                                          setGoalIncome(e.target.value)
                                        }
                                        className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="This is placeholder"
                                        value={goalIncome ? goalIncome : null}
                                      />
                                    ) : (
                                      <p className="text-sm ml-2">
                                        {" "}
                                        {goalIncome}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div class="grid sm:grid-cols-4  mb-2 align-center">
                                  <div class="sm:col-span-1 2xl:col-span-1">
                                    <p className="font-medium text-sm text-gray-800">
                                      About me:
                                    </p>
                                  </div>
                                  <div class="sm:col-span-2 align-center items-center">
                                    {isEditCareerGoals ? (
                                      <textarea
                                        type="text"
                                        onChange={(e) =>
                                          setUserInterests(e.target.value)
                                        }
                                        className="py-2 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        rows="3"
                                        placeholder="I enjoy working with my hands, being around people, and generally excel in leadership positions."
                                        value={
                                          userInterests ? userInterests : null
                                        }
                                      />
                                    ) : (
                                      <p className="text-sm ml-2">
                                        {" "}
                                        {userInterests}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div class="grid sm:grid-cols-4 mb-6 align-center">
                                  <div class="sm:col-span-1 2xl:col-span-1">
                                    <p className="font-medium text-sm text-gray-800">
                                      Career Interests:
                                    </p>
                                  </div>
                                  <div class="sm:col-span-2 align-center items-center">
                                    {isEditCareerGoals && (
                                      <div className="flex flex-row space-x-1 mb-4">
                                        <input
                                          type="text"
                                          onChange={(e) =>
                                            setNewInterest(e.target.value)
                                          }
                                          className="py-2 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                          value={newInterest}
                                          placeholder="Mechanic, HVAC Technician, etc."
                                        />
                                        <button
                                          type="button"
                                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                          onClick={() => addNewInterest()}
                                        >
                                          Add
                                        </button>
                                      </div>
                                    )}
                                    <div className="flex flex-row flex-wrap mb-8">
                                      {savedCareers?.map((saved) => (
                                        <>
                                          <div class="mt-1 mb-1 text-sm ml-2 cursor-default inline-flex flex-nowrap items-center bg-sky-400 rounded-lg p-1.5 ">
                                            <div class="whitespace-nowrap text-sm font-medium text-white ">
                                              {saved.savedInterest}
                                            </div>
                                            <div
                                              class="ms-2.5 inline-flex justify-center items-center size-5 rounded-full text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-gray-400  cursor-pointer"
                                              onClick={() =>
                                                handleDeleteSelected(saved)
                                              }
                                            >
                                              <svg
                                                class="shrink-0 size-3"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              >
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                              </svg>
                                            </div>
                                          </div>
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {isEditCareerGoals ? (
                                  <div className="ml-auto ">
                                    {/* <button
                                    type="button"
                                    class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
                                    //    onClick={() => handleUpdate()}
                                  >
                                    Delete
                                  </button> */}
                                    <button
                                      type="button"
                                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                      onClick={() => handleUpdate()}
                                    >
                                      Update
                                    </button>
                                  </div>
                                ) : null}
                                {formValidationMessage ? (
                                  <p className="text-red-500 text-sm">
                                    {formValidationMessage}
                                  </p>
                                ) : null}
                              </div>
                            </AccordionPanel>
                          </AccordionItem>
                          <Work changeListener={changeListener} />
                          <Education changeListener={changeListener} />
                          <Skills changeListener={changeListener} />
                        </Accordion>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {openModal && (
            <ResumePreview
              setModalClosed={() => setModalClosed()}
              handleAccordionForPrint={() => handleAccordionForPrint()}
            />
          )}
        </main>
      )}
    </>
  );
};

export default MyProfile;
