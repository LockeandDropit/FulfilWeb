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

const AboutInfo = ({ changeListener }) => {
  const { currentUser } = useUserStore();
  useEffect(() => {
    if (currentUser) {
      setCurrentIncome(currentUser.currentIncome);
      setGoalIncome(currentUser.goalIncome);
      setUserInterests(currentUser.userInterests);
    }
  }, [currentUser]);

  const [phoneNumber, setPhoneNumber] = useState(null)
  const [about, setAbout] = useState(null)

  const [currentIncome, setCurrentIncome] = useState(null);
  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);
  const [userInterests, setUserInterests] = useState(null);

  const [isEditCareerGoals, setIsEditCareerGoals] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [formValidationMessage, setFormValidationMessage] = useState();
  const [isAddNew, setIsAddNew] = useState(false);
  console.log("issAddNew", isAddNew);
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
     phoneNumber: phoneNumber ? phoneNumber : null,
     about: about ? about : null
    }).then(() => {
      changeListener();
      setUpdateIsLoading(false);
      setIsAddNew(!isAddNew);
      setIsEditCareerGoals(!isEditCareerGoals)
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

      setSkillName(null);
      setIsEditCareerGoals(!isEditCareerGoals);
    });
  };

  const handleCancel = () => {
    setSelectedExperience(null);
    setSkillName(null);
    setIsEditCareerGoals(!isEditCareerGoals);
  };
  const handleCancelNew = () => {
    setSelectedExperience(null);
    setSkillName(null);
    setIsAddNew(!isAddNew);
  };

  const handleSelectedEdit = (x) => {
    setSelectedExperience(x);
    setIsEditCareerGoals(!isEditCareerGoals);
  };
  //add regex test when you can
  let phoneNumberValid = true

  const handleUpdate = () => {
    if (!phoneNumberValid) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().

    
        setUpdateIsLoading(true);
        //update firestore
        uploadWorkExperience();
        setFormValidationMessage()
    
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
          if (res.data()?.phoneNumber) {
            setPhoneNumber(res.data().phoneNumber);
          }
          if (res.data().about) {
            setAbout(res.data().about)
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
      setSkillName(null);
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
              Personal Information
            </label>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <div className="flex flex-col ">
          
       
            <div className="flex flex-col  space-y-4 mb-3">
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="text-sm text-gray-600">
                    Phone Number:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="This is placeholder"
                      value={
                        phoneNumber
                      }
                    />
                  ) : ( phoneNumber ? (<p className="text-sm ">{phoneNumber}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
                <div className="sm:col-span-1 ml-auto">
                  {isEditCareerGoals ? null : (
                    <div
                      className=" text-sm ml-auto cursor-pointer text-blue-400 hover:text-blue-600 hover:underline"
                      onClick={() => handleSelectedEdit()}
                    >
                      Edit
                    </div>
                  )}
                </div>
              </div>
              <div class="grid sm:grid-cols-4  align-center items-center mb-8">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="text-sm text-gray-600">
                    About:
                  </p>
                </div>
                <div class="sm:col-span-3 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <div className="space-y-3">
                    <textarea className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" rows="3" placeholder="Enter some information about yourself and what you offer professionally." onChange={(e) => setAbout(e.target.value)} value={about}></textarea>
                  </div>
                  ) : ( about ? (<p className="text-sm ">{about}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
               
              </div>

              {isEditCareerGoals  ? (
                
                <div className="ml-auto mt-2">
                 <div className="h-[40px]">
                  </div>
                  <button
                    type="button"
                    class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200"
                    onClick={() => handleCancel()}
                  >
                    Cancel
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
        
         


      
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AboutInfo;
