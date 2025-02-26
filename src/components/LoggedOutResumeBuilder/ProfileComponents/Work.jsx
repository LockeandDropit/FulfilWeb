import React from "react";
import { useUserStore } from "../../../pages/Doer/Chat/lib/userStore";
import { db } from "../../../firebaseConfig";
import RichTextEditor from "../../../pages/Needer/Components/RichTextEditor";
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

import { useExperienceStore } from "../ResumeBuilder/lib/experienceStore";

const Work = ({ changeListener }) => {
  const { currentUser } = useUserStore();

  const {
    companyName,
    positionTitle,
    description,
    userBaseDescription,
    startDate,
    displayStartDate,
    endDate,
    displayEndDate,
    isEmployed,
    id,
    isLoading,
    allExperiences,
    setAllExperiences,
    setStartDate,
    setCompanyName,
    setPositionTitle,
    setDescription,
    setUserBaseDescription,
    setDisplayStartDate,
    setEndDate,
    setDisplayEndDate,
    setIsEmployed,
    setId,
  } = useExperienceStore();

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

  // const [companyName, setCompanyName] = useState(null);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  // const [userBaseDescription, setUserBaseDescription] = useState(null);
  // const [description, setDescription] = useState(null);

  // const [positionTitle, setPositionTitle] = useState(null);
  // const [isEmployed, setIsEmployed] = useState(false);
  const [returnedResponse, setReturnedResponse] = useState(null);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);

  const [modalInputError, setModalInputError] = useState(null);

  const handleSubmitAIInput = async () => {
    if (!userBaseDescription) {
      setModalInputError("Please provide a brief description of your role.");
    } else {
      setModalInputError(null);
      setTextEditorLoading(true);
      setAITextGenLoading(true);
      setLoadingAIResponse(true);

      const response = await fetch(
        // "http://localhost:8000/getResumeHelp",
        "https://openaiapi-c7qc.onrender.com/getResumeHelp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInput: `${userBaseDescription}`,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setReturnedResponse(json.message.content);
    }
  };

  const saveLocally = () => {
    let newId = uuidv4();

    setAllExperiences([
      ...allExperiences,
      {
        companyName: companyName,
        positionTitle: positionTitle,
        description: description,
        userBaseDescription: userBaseDescription,
        startDate: startDate.toLocaleDateString(),
        displayStartDate: startDate.toLocaleDateString("en-US", options),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        displayEndDate: endDate
          ? endDate.toLocaleDateString("en-US", options)
          : null,
        isEmployed: isEmployed,
        id: newId,
      },
    ]);

    setTimeout(() => {
      changeListener();
      setUpdateIsLoading(false);
      setIsAddNew(!isAddNew);
    }, 200);

    // here
  };

  const uploadWorkExperience = async () => {
    const userChatsRef = collection(db, "users", currentUser.uid, "Resumes");
    //make resume1 dynamic
    await updateDoc(doc(userChatsRef, "My Resume"), {
      experience: arrayUnion({
        companyName: companyName,
        positionTitle: positionTitle,
        description: description,
        userBaseDescription: userBaseDescription ? userBaseDescription : null,
        startDate: startDate.toLocaleDateString(),
        displayStartDate: startDate.toLocaleDateString("en-US", options),
        endDate: endDate ? endDate.toLocaleDateString() : null,
        displayEndDate: endDate
          ? endDate.toLocaleDateString("en-US", options)
          : null,
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

  const editExperience = () => {
    const resumeIndex = allExperiences
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    allExperiences[resumeIndex].companyName = companyName
      ? companyName
      : allExperiences[resumeIndex].companyName;
    allExperiences[resumeIndex].positionTitle = positionTitle
      ? positionTitle
      : selectedExperience.positionTitle;
    allExperiences[resumeIndex].description = description
      ? description
      : selectedExperience.description;
    allExperiences[resumeIndex].userBaseDescription = userBaseDescription
      ? userBaseDescription
      : selectedExperience.userBaseDescription;
    allExperiences[resumeIndex].startDate = startDate
      ? startDate.toLocaleDateString()
      : selectedExperience.startDate;
    allExperiences[resumeIndex].displayStartDate = startDate
      ? startDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayStartDate;
    allExperiences[resumeIndex].endDate = endDate
      ? endDate.toLocaleDateString()
      : selectedExperience.endDate
      ? selectedExperience.endDate
      : null;
    allExperiences[resumeIndex].displayEndDate = endDate
      ? endDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayEndDate
      ? selectedExperience.displayEndDate
      : null;
    allExperiences[resumeIndex].isEmployed = isEmployed === true ? true : false;

    setTimeout(() => {
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
    }, 300)
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
    resumeData.experience[resumeIndex].userBaseDescription = userBaseDescription
      ? userBaseDescription
      : selectedExperience.userBaseDescription;
    resumeData.experience[resumeIndex].startDate = startDate
      ? startDate.toLocaleDateString()
      : selectedExperience.startDate;
    resumeData.experience[resumeIndex].displayStartDate = startDate
      ? startDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayStartDate;
    resumeData.experience[resumeIndex].endDate = endDate
      ? endDate.toLocaleDateString()
      : selectedExperience.endDate
      ? selectedExperience.endDate
      : null;
    resumeData.experience[resumeIndex].displayEndDate = endDate
      ? endDate.toLocaleDateString("en-US", options)
      : selectedExperience.displayEndDate
      ? selectedExperience.displayEndDate
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
    setUserBaseDescription(null);
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
    setUserBaseDescription(null);
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

  const handleUpdate = (selectedExperience) => {
    console.log(description, positionTitle, companyName, startDate);
    if (!description && !selectedExperience.description) {
      setFormValidationMessage("Please fill out all fields");
    } else if (!selectedExperience.positionTitle && !positionTitle) {
      setFormValidationMessage("Please fill out all fields");
    } else if (!selectedExperience.companyName && !companyName) {
      setFormValidationMessage("Please fill out all fields");
    } else if (!selectedExperience.startDate && !startDate) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().
      // uploadEditedWorkExperience();
      editExperience();
      setFormValidationMessage();
    }
  };

  const addExperience = () => {
    console.log(description, positionTitle, companyName, startDate);
    if (!companyName || !startDate || !description || !positionTitle) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      setUpdateIsLoading(true);
      setFormValidationMessage();
      //update firestore
      // uploadWorkExperience();
      saveLocally();
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
    //ty https://stackoverflow.com/questions/10557486/in-an-array-of-objects-fastest-way-to-find-the-index-of-an-object-whose-attribu credit Pablo Francisco Perez Hidalgo 04/19/2013
    const resumeIndex = allExperiences
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    //DO NOT REMOVE THESE CONSOLE LOGS. THEY ARE HANDLING THE REMOVAL OF THE SELECTED ITEM??????

    console.log("splice", allExperiences.splice(resumeIndex, 1));
    console.log("new data", allExperiences);

    if (allExperiences?.length > 0) {
      setAllExperiences([allExperiences]);
    } else {
      setAllExperiences([]);
    }

    // .then(() => {
    changeListener();
    setUpdateIsLoading(false);

    setTextEditorLoading(true);
    setSelectedExperience(null);
    setEditorState(null);
    setEndDate(null);
    setStartDate(null);
    setDescription(null);
    setCompanyName(null);
    setPositionTitle(null);
    setIsEditCareerGoals(!isEditCareerGoals);
    // });
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
    console.log("handlechange editpor state", editorState);
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

  // if editor state has changed x1 setDescription w/Editor state. Else let handelEditorStateChange do the work.

  const [editorInitialChange, setEditorInitialChange] = useState(false);

  useEffect(() => {
    if (editorState) {
      console.log(" use effecvy", editorState);
    }
  }, [editorState]);

  useEffect(() => {
    console.log("description listener", description);
  }, [description]);

  var options = { year: "numeric", month: "numeric" };

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
          {allExperiences?.map((experience) => (
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
                      <p className="text-sm">{experience.displayStartDate}</p>
                      <span className="font-medium text-gray-800 mx-1">-</span>
                      {experience.isEmployed === true ? (
                        <p className="text-sm">Currently Employed</p>
                      ) : (
                        <p className="text-sm">{experience.displayEndDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {isEditCareerGoals && experience.id === selectedExperience.id ? (
                <>
                  <div class="grid sm:grid-cols-4  mb-10 align-center ">
                    <div class="sm:col-span-1 2xl:col-span-1">
                      <p className="font-medium text-sm text-gray-800">
                        Describe your responsibilities: (optional)
                      </p>
                    </div>
                    <div class="sm:col-span-3 align-center items-center space-y-2">
                      {/* got this from chat gpt but idk if this is even copyrightable */}
                      <textarea
                        id="textarea-label"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        rows="5"
                        placeholder="I was in charge of making sure all the materials were orderd and keeping track of our stock. I interacted with customers on a regular basis. I reported to my senior manager and was involved in some decision making."
                        onChange={(e) => setUserBaseDescription(e.target.value)}
                        value={
                          userBaseDescription !== null
                            ? userBaseDescription
                            : experience.userBaseDescription
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="ml-auto mt-8">
                    <button
                      // onClick={() => onOpen()}
                      onClick={() => handleSubmitAIInput()}
                      type="button"
                      class=" w-full py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
                </>
              ) : null}

              <div class="grid sm:grid-cols-4  mb-10 align-center ">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Role & Responsibilities:
                  </p>
                  {/* {isEditCareerGoals &&
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
                  ) : null} */}
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
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handleUpdate(selectedExperience)}
                  >
                    Save
                  </button>
                </div>
              ) : null}
              {formValidationMessage ? (
                <p className="text-red-500 text-sm">{formValidationMessage}</p>
              ) : null}
            </div>
          ))}

          {allExperiences?.length === 0 && isAddNew === false && (
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
                Add Experience
              </button>
            </div>
          )}

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
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      selected={startDate}
                      // revert to non-test
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

          {isAddNew ||
          isEditCareerGoals ||
          allExperiences?.length === 0 ? null : (
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
                    Tell me what you did at this job in plain english and I'll
                    turn it into resume-ready bullet points!
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
                      onChange={(e) => setUserBaseDescription(e.target.value)}
                    ></textarea>

                    {modalInputError && (
                      <p className="mt-1text-sm text-red-500">
                        {modalInputError}
                      </p>
                    )}
                  </div>

                  <div className="w-full flex">
                    {aiTextGenLoading ? (
                      <button
                        // onClick={() => handleSubmitAIInput()}
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
