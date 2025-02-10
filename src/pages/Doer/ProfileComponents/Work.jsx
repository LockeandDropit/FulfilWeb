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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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

const Work = ({ changeListener }) => {
  const { currentUser } = useUserStore();
  // useEffect(() => {
  //   if (currentUser) {
  //     setCurrentIncome(currentUser.currentIncome);
  //     setGoalIncome(currentUser.goalIncome);
  //     setUserInterests(currentUser.userInterests);
  //   }
  // }, [currentUser]);

  const [currentIncome, setCurrentIncome] = useState(null);
  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);
  const [userInterests, setUserInterests] = useState(null);

  const [isEditCareerGoals, setIsEditCareerGoals] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [formValidationMessage, setFormValidationMessage] = useState();
  const [aiPromtInput, setAIPromtInput] = useState(null);

  const [companyName, setCompanyName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState(null);

  const [positionTitle, setPositionTitle] = useState(null);
  const [isEmployed, setIsEmployed] = useState(false);
  const [returnedResponse, setReturnedResponse] = useState(null);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);

  const handleSubmitAIInput = async () => {
    setTextEditorLoading(true);
    setAITextGenLoading(true);
    setLoadingAIResponse(true);

    const response = await fetch(
      "http://localhost:8000/getResumeHelp",
      // "https://openaiapi-c7qc.onrender.com/getResumeHelp",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `${aiPromtInput}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    console.log("response", json.message.content);
    // console.log("response2", json.responsibilities.map(item => `- ${item}`).join("\n"))

    // console.log("json resopnse w array", JSON.parse(json.message.content));

    setReturnedResponse(json.message.content);
    // setReturnedResponse(JSON.parse(json.message.content));
  };

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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

    resumeData.experience[resumeIndex].isEmployed =
      isEmployed === true ? true : false;

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
          if (res.data()?.experience) {
            setWorkExperience(res.data().experience);
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
    console.log("data", resumeData);
    console.log("splice", resumeData.experience.splice(resumeIndex, 1));
    console.log("new data", resumeData.experience);

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

  const [isAddNew, setIsAddNew] = useState(false);

  //thgis handles toggling back and forth between the person being currently employed/having an end date.

  useEffect(() => {
    if (isEmployed) {
      setEndDate(null);
    }
  }, [isEmployed]);

  useEffect(() => {
    if (endDate) {
      setIsEmployed(false);
    }
  }, [endDate]);

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

  const [aiTextGenLoading, setAITextGenLoading] = useState(false);

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  const [contentState, setContentState] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);

  //duplicate these two but change it to receive the markdown response from the api call
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

  //new

  useEffect(() => {
    if (returnedResponse) {
      setContentState(stateFromMarkdown(returnedResponse));
      console.log("any issues?", returnedResponse);
    }
  }, [returnedResponse]);

  useEffect(() => {
    if (contentState) {
      setEditorState(EditorState.createWithContent(contentState));
      setTimeout(() => {
        setTextEditorLoading(false);
        setAITextGenLoading(false);
        onClose();
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
                      <div className="flex align-center items-center ">
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
                      <div className="col-span-2  flex ">
                        <div
                          className="ml-auto  mt-2"
                          onClick={() => setIsEmployed(!isEmployed)}
                        >
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
              <div class="grid sm:grid-cols-4  mb-10 align-center ">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Role & Responsibilities:
                  </p>
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    <button
                    onClick={() => onOpen()}
                    type="button"
                    class="mt-2 w-3/4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    AI Assistant
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  ) : (null)}
                 
                </div>
                <div class="sm:col-span-3 align-center items-center">
                  {/* got this from chat gpt but idk if this is even copyrightable */}
                  {isEditCareerGoals &&
                  experience.id === selectedExperience.id ? (
                    textEditorLoading ? (
                      <p>loading...</p>
                    ) : (
                      <>
                        <RichTextEditor
                          defaultEditorState={editorState}
                          onChange={(editorState) =>
                            handleEditorChange(editorState)
                          }
                        />
                      
                      </>
                    )
                  ) : (
                    <div className="prose prose-li text-sm marker:text-black text-gray-800">
                      <Markdown>{experience.description}</Markdown>
                    </div>
                  )}
                </div>
              </div>
              {isEditCareerGoals && experience.id === selectedExperience.id ? (
                <div className="ml-auto mt-8">
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
                <div class="sm:col-span-3 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Your job title goes here"
                  />
                </div>
                <div className="sm:col-span-1 ml-auto"></div>
              </div>
              <div className="flex flex-row align-center items-center"></div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">Company:</p>
                </div>
                <div class="sm:col-span-3 align-center items-center">
                  <input
                    type="text"
                    onChange={(e) => setCompanyName(e.target.value)}
                    className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="The company name goes here"
                  />
                </div>
              </div>
              <div class="grid sm:grid-cols-4  mb-2 align-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800 sm:mt-3">
                    Dates Employed:
                  </p>
                </div>
                <div class="sm:col-span-3 align-center items-center">
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
              <div class="grid sm:grid-cols-4  mb-2 align-center">
                <div class="sm:col-span-1 2xl:col-span-1 flex flex-col">
                  <p className="font-medium text-sm text-gray-800">
                    Role & Responsibilities:
                  </p>
                  <button
                    onClick={() => onOpen()}
                    type="button"
                    class="mt-2 w-3/4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    AI Assistant
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {aiTextGenLoading ? (
                  <p>loading...</p>
                ) : (
                  <div class="sm:col-span-3 align-center items-center border border-gray-200 rounded-lg">
                    <RichTextEditor
                      defaultEditorState={editorState}
                      onChange={(editorState) =>
                        handleEditorChange(editorState)
                      }
                    />
                  </div>
                )}
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

<Modal isOpen={isOpen} onClose={onClose} size="3xl">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader></ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <div className="w-full p-4">
                      <h1 className="text-lg font-medium text-gray-800">
                        Tell me what you did at this job in plain english and
                        I'll turn it into resume-ready bullet points!
                      </h1>

                      <div className="w-full mt-8">
                        <label
                          htmlFor="textarea-label"
                          className="block text-sm font-medium mb-2"
                        >
                          Write a few sentences here (be specific!):
                        </label>
                        <textarea
                          id="textarea-label"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          rows="3"
                          placeholder="I was in charge of making sure all the materials were orderd and keeping track of our stock. I interacted with customers on a regular basis. I reported to my senior manager and was involved in some decision making."
                          onChange={(e) => setAIPromtInput(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="w-full flex">
                        {aiTextGenLoading ? (
                          <button
                            onClick={() => handleSubmitAIInput()}
                            type="button"
                            class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Generating
                            <div
                              className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                              role="status"
                              aria-label="loading"
                            ></div>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubmitAIInput()}
                            type="button"
                            class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Generate
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="white"
                              className="size-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default Work;
