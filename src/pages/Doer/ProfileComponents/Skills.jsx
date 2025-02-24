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

const Skills = ({changeListener}) => {
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
  const [isAddNew, setIsAddNew] = useState(false);
  console.log("issAddNew", isAddNew)
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
  const [skillName, setSkillName] = useState(null);

  const uploadWorkExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, "My Resume"), {
      skills: arrayUnion({
        skillName: skillName,
        id: uuidv4(),
      }),
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      setIsAddNew(!isAddNew);
    });
  };

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
    const resumeIndex = resumeData.skills
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    console.log("resume Index", resumeIndex);

    // go back live
    resumeData.skills[resumeIndex].skillName = skillName
      ? skillName
      : selectedExperience.skillName
      ? selectedExperience.skillName
      : null;
   

    //test conmditions
    // setUpdateIsLoading(false);
    // setIsEditCareerGoals(!isEditCareerGoals);

    //live when fixed
    await updateDoc(doc(userChatsRef, "My Resume"), {
      skills: resumeData.skills,
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setSelectedExperience(null);

      setSkillName(null)
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const handleCancel = () => {
    setSelectedExperience(null);
    setSkillName(null)
    setIsEditCareerGoals(!isEditCareerGoals);
  };
  const handleCancelNew = () => {
    setSelectedExperience(null);
    setSkillName(null)
    setIsAddNew(!isAddNew);
  };

  const handleSelectedEdit = (x) => {
    setSelectedExperience(x);
    setIsEditCareerGoals(!isEditCareerGoals);
  };

  const handleUpdate = () => {
    if (!skillName) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().

      if (selectedExperience) {
        uploadEditedWorkExperience();
        console.log("edited handle");
      } else {
        setUpdateIsLoading(true);
        //update firestore
        uploadWorkExperience();
      }
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
          if (res.data()?.skills) {
            setWorkExperience(res.data().skills);
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
    const resumeIndex = resumeData.skills
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    let newData = resumeData.skills.splice(resumeIndex, 1);



    // let finalResume = resumeData.experience.splice(resumeIndex, 1);

    // setWorkExperience(finalResume)

    // console.log("final resume", finalResume);

    //  resumeData.experience[resumeIndex].id = "deleted"

    await updateDoc(doc(userChatsRef, "My Resume"), {
      skills: resumeData.skills,
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setSelectedExperience(null);
      setSkillName(null)
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };



  //thgis handles toggling back and forth between the person being currently employed/having an end date.



  const handleNew = () => {
    setSelectedExperience(null);
    setSkillName(null);
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
              Skills & Certifications
            </label>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <div className="flex flex-col ">
          {workExperience?.map((experience) => (
            <div className="flex flex-col  space-y-2 mb-3">
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Skill or Certification Name:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <input
                      type="text"
                      onChange={(e) => setSkillName(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Add skill or certification here"
                      value={
                        skillName !== null
                          ? skillName
                          : experience.skillName
                      }
                    />
                  ) : (
                    <p className="text-sm ">{experience.skillName}</p>
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
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handleUpdate()}
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
                                  <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                  />
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
                              <p class="mt-2 font-medium text-gray-800 ">
                                Nothing here
                              </p>
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
                              Add Skill
                            </button>
                          </div>)}
       

          {isAddNew ? (
            <div className="flex flex-col  space-y-3 z-50 mt-4">
              <div class="grid sm:grid-cols-4  align-center items-center mt-8">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                   Skill or Certification Name: 
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setSkillName(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Add skill or certification here"
                  />
                </div>
                <div className="sm:col-span-1 ml-auto"></div>
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
                  onClick={() => handleUpdate()}
                >
                  Add
                </button>
              </div>

              {formValidationMessage ? (
                <p className="text-red-500 text-sm">{formValidationMessage}</p>
              ) : null}
            </div>
          ) : null}

          {isAddNew || isEditCareerGoals || workExperience?.length <= 0 ? null : (
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

export default Skills;
