import React from 'react'
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
import { useUserStore } from '../Doer/Chat/lib/userStore';
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebaseConfig';

const WorkExperience = () => {
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
    const handleUpdate = () => {
        if (!userInterests || !currentIncome || !goalIncome) {
          setFormValidationMessage("Please fill out all fields");
        } else {
            setUpdateIsLoading(true);
            //update firestore
            uploadToFirebase();
        }
    
      };

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
      <div className="flex flex-col  space-y-1 z-50">
        <div class="grid sm:grid-cols-4  align-center items-center">
          <div class="sm:col-span-1 2xl:col-span-1">
            <p className="font-medium text-sm text-gray-800">
              Position Title:
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
                  setIsEditCareerGoals(!isEditCareerGoals)
                }
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
              Company:
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
        <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
          <div class="sm:col-span-1 2xl:col-span-1">
            <p className="font-medium text-sm text-gray-800">
              Dates Employed:
            </p>
          </div>
          <div class="sm:col-span-2 align-center items-center">
            {isEditCareerGoals ? (
              <input
                type="text"
                onChange={(e) =>
                  setUserInterests(e.target.value)
                }
                className="py-2 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                rows="3"
                placeholder="This is placeholder"
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
        <div class="grid sm:grid-cols-4  mb-2 align-center items-center">
          <div class="sm:col-span-1 2xl:col-span-1">
            <p className="font-medium text-sm text-gray-800">
              Role & Responsibilities:
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
                placeholder="This is placeholder"
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
        {isEditCareerGoals ? (
          <div className="ml-auto mt-2">
            <button
              type="button"
              class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
              //    onClick={() => handleUpdate()}
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
        {formValidationMessage ? (<p className="text-red-500 text-sm">{formValidationMessage}</p>) : (null)}
      </div>
    </AccordionPanel>
  </AccordionItem>
  )
}

export default WorkExperience