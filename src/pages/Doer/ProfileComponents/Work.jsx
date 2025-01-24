import React from 'react'
import { useUserStore } from '../Chat/lib/userStore'
import { db } from '../../../firebaseConfig'
import RichTextEditor from '../../Needer/Components/RichTextEditor'
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

const Work = ({ changeListener}) => {
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
  const [isEmployed, setIsEmployed] = useState(false);

  const uploadWorkExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, "My Resume"), {
      experience: arrayUnion({
        companyName: companyName,
        positionTitle: positionTitle,
        description: description,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        isEmployed: isEmployed,
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
    const resumeIndex = resumeData.experience
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    console.log("resume Index", resumeIndex);

    // go back live
    resumeData.experience[resumeIndex].companyName = companyName
      ? companyName
      : selectedExperience.companyName;
    resumeData.experience[resumeIndex].positionTitle = positionTitle
      ? positionTitle
      : selectedExperience.positionTitle;
    resumeData.experience[resumeIndex].description = description
      ? description
      : selectedExperience.description;
    resumeData.experience[resumeIndex].startDate = startDate
      ? startDate.toLocaleDateString()
      : selectedExperience.startDate;
    resumeData.experience[resumeIndex].endDate = endDate
      ? endDate.toLocaleDateString()
      : selectedExperience.endDate
      ? selectedExperience.endDate
      : null;

    resumeData.experience[resumeIndex].isEmployed = isEmployed === true
      ? true
      : false;

    //test conmditions
    // setUpdateIsLoading(false);
    // setIsEditCareerGoals(!isEditCareerGoals);

    //live when fixed
    await updateDoc(doc(userChatsRef, "My Resume"), {
      experience: resumeData.experience,
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setTextEditorLoading(true);
      setSelectedExperience(null);
      setEditorState(null);
      setEndDate(null);
      setStartDate(null);
      setDescription(null);
      setCompanyName(null);
      setPositionTitle(null);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const handleCancel = () => {
    setTextEditorLoading(true);
    setSelectedExperience(null);
    setEditorState(null);
    setEndDate(null);
    setStartDate(null);
    setDescription(null);
    setCompanyName(null);
    setPositionTitle(null);
    setIsEmployed(false);
    setIsEditCareerGoals(!isEditCareerGoals);
  };
  const handleCancelNew = () => {
    setTextEditorLoading(true);
    setSelectedExperience(null);
    setEditorState(null);
    setEndDate(null);
    setStartDate(null);
    setDescription(null);
    setCompanyName(null);
    setPositionTitle(null);
    setIsEmployed(false);
    setIsAddNew(!isAddNew);
  };

  const handleSelectedEdit = (x) => {
    setSelectedExperience(x);
    setIsEmployed(x.isEmployed);
    console.log("handleSelectedEdit", x);
    setIsEditCareerGoals(!isEditCareerGoals);
  };

  const handleUpdate = () => {
    if (!companyName || !startDate || !description || !positionTitle) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().
        uploadEditedWorkExperience();
        setFormValidationMessage();
    }
  };

  
  const addExperience = () => {

    if (!companyName || !startDate || !description || !positionTitle) {
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
          if (res.data()?.skills) {
            setWorkExperience(res.data().skills);
          }

          // res.data().experience.forEach((exp) => {
          //   console.log("here are ids", exp.id)
          //   if (exp.id !== "deleted") {
          //     intermediateHold.push(res.data().experience);
          //     console.log("hjerer", res.data().experience)
          //   }

          // })

          //   setIsEnrolled(res.data().isEnrolled);
          // setLoading(false);
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
    const resumeIndex = resumeData.experience
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

      //DO NOT REMOVE THESE CONSOLE LOGS. THEY ARE HANDLING THE REMOVAL OF THE SELECTED ITEM??????
    console.log("resume Index", resumeIndex);
    console.log("data", resumeData)
    console.log("splice", resumeData.experience.splice(resumeIndex, 1))
    console.log("new data", resumeData.experience)

    await updateDoc(doc(userChatsRef, "My Resume"), {
      experience: resumeData.experience
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      //set all local values null for updating/editing purposes.
      setTextEditorLoading(true);
      setSelectedExperience(null);
      setEditorState(null);
      setEndDate(null);
      setStartDate(null);
      setDescription(null);
      setCompanyName(null);
      setPositionTitle(null);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const [isAddNew, setIsAddNew] = useState(false);

  //thgis handles toggling back and forth between the person being currently employed/having an end date.

  useEffect(() => {
    
    if (isEmployed) {
      setEndDate(null)
    }
  }, [ isEmployed])

  useEffect(() => {

    if (endDate) {
      setIsEmployed(false)
    }
  }, [endDate])

  const handleNew = () => {
    setSelectedExperience(null);
    setEditorState(null);
    setEndDate(null);
    setStartDate(null);
    setDescription(null);
    setCompanyName(null);
    setPositionTitle(null);
    setIsEmployed(false);
    setIsAddNew(!isAddNew);
  };

  const [editorState, setEditorState] = useState(null);
  const [textEditorLoading, setTextEditorLoading] = useState(true);

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  const [contentState, setContentState] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);

  useEffect(() => {
    if (selectedExperience) {
      setContentState(stateFromMarkdown(selectedExperience.description));
      console.log("any issues?", selectedExperience.description);
    }
  }, [selectedExperience]);

  useEffect(() => {
    if (contentState) {
      setEditorState(EditorState.createWithContent(contentState));
      setTimeout(() => {
        setTextEditorLoading(false);
      }, 500);
    }
  }, [contentState]);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <label
              for="hs-pro-epdsku"
              class="block font-medium text-stone-800 "
            >
              Work Experience
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
                    Position Title:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <input
                      type="text"
                      onChange={(e) => setPositionTitle(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="This is placeholder"
                      value={
                        positionTitle !== null
                          ? positionTitle
                          : experience.positionTitle
                      }
                    />
                  ) : (
                    <p className="text-sm "> {experience.positionTitle}</p>
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
                  <p className="font-medium text-sm text-gray-800">Company:</p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <input
                      type="text"
                      onChange={(e) => setCompanyName(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="This is placeholder"
                      value={
                        companyName !== null
                          ? companyName
                          : experience.companyName
                      }
                    />
                  ) : (
                    <p className="text-sm ">{experience.companyName}</p>
                  )}
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Dates Employed:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <>
                      <div className="flex align-center items-center">
                        <DatePicker
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
                          selected={
                            endDate !== null ? endDate : experience.endDate
                          }
                          onChange={(date) => setEndDate(date)}
                          className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </div>
                      <div className="w-full">
                        <div className="ml-auto mt-2.5" onClick={() => setIsEmployed(!isEmployed)}>
                          <input
                            type="checkbox"
                            class="mr-2 ml-auto shrink-0 border-gray-200 rounded text-blue-600 cursor-pointer"
                            onChange={() => setIsEmployed(!isEmployed)}
                            checked={isEmployed}
                          />
                          <label
                            for="af-account-full-name"
                            class="inline-block text-sm text-gray-600"
                            // onClick={() => setIsEmployed(!isEmployed)}
                          >
                            Currently employed
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex align-center items-center">
                      <p className="text-sm">{experience.startDate}</p>
                      <span className="font-medium text-gray-800 mx-1">-</span>
                      {experience.isEmployed === true ? (
                        <p className="text-sm">Currently Employed</p>
                      ) : (
                        <p className="text-sm">{experience.endDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-10 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Role & Responsibilities:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {/* got this from chat gpt but idk if this is even copyrightable */}
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    textEditorLoading ? (
                      <p>loading...</p>
                    ) : (
                      <RichTextEditor
                        defaultEditorState={editorState}
                        onChange={(editorState) =>
                          handleEditorChange(editorState)
                        }
                      />
                    )
                  ) : (
                    <div className="prose prose-li text-sm marker:text-black text-gray-800">
                      <Markdown>{experience.description}</Markdown>
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

          {isAddNew ? (
            <div className="flex flex-col  space-y-3 z-50 mt-4">
              <div class="grid sm:grid-cols-4  align-center items-center mt-8">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Position Title:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="This is placeholder"
                  />
                </div>
                <div className="sm:col-span-1 ml-auto"></div>
              </div>
              <div className="flex flex-row align-center items-center"></div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">Company:</p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setCompanyName(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="This is placeholder"
                  />
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Dates Employed:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <div className="flex align-center items-center">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="mt-1 py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    />

                    <span className="font-medium text-gray-800 mx-2">-</span>

                    <DatePicker
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
                        onChange={() => setIsEmployed(!isEmployed)}
                        checked={isEmployed}
                      />
                      <label
                        for="af-account-full-name"
                        class="inline-block text-sm text-gray-600 cursor-pointer"
                        onClick={() => setIsEmployed(!isEmployed)}
                      >
                        Currently employed
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Role & Responsibilities:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  <RichTextEditor
                    defaultEditorState={editorState}
                    onChange={(editorState) => handleEditorChange(editorState)}
                  />
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
                  onClick={() => addExperience()}
                >
                  Add
                </button>
              </div>

              {formValidationMessage ? (
                <p className="text-red-500 text-sm">{formValidationMessage}</p>
              ) : null}
            </div>
          ) : null}

          {isAddNew || isEditCareerGoals ? null : (
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

export default Work;
