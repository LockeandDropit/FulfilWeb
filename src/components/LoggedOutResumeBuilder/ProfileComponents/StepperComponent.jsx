import React from "react";
import { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  updateDoc,
  doc,
  getDoc,
  collectionGroup,
  query,
  collection,
  onSnapshot,
} from "firebase/firestore";

const StepperComponent = ({ allSkills, allEducation, allExperiences, changeOccured }) => {
  // uhh lets grab the info from db, check for section length, conditionally render complete or incomplete symbol.

  const [infoComplete, setInfoComplete] = useState(false);
  const [experienceComplete, setExperienceComplete] = useState(null);
  const [educationComplete, setEducationComplete] = useState(null);
  const [skillsComplete, setSkillsComplete] = useState(false);

  const [currentIncome, setCurrentIncome] = useState(null);
  const [goalIncome, setGoalIncome] = useState(null);
  const [finalGoalIncome, setGoalFinalIncome] = useState(null);
  const [userInterests, setUserInterests] = useState(null);



  useEffect(() => {

        if (allSkills.length > 0) {
          setSkillsComplete(true);
        } else {
          setSkillsComplete(false);
        }
        if (allExperiences.length > 0) {
          setExperienceComplete(true);
        } else {
          setExperienceComplete(false);
        }
        if (allEducation.length > 0) {
          setEducationComplete(true);
        } else {
          setEducationComplete(false);
        }
        console.log("fired");

     
  }, [changeOccured]);

  // nice to have----> link to the expand section needing to be completed.

  return (
    <ol class="ml-2 relative text-gray-700 border-s border-gray-200 mt-2">
      {/* <li class="mb-6 ms-5">
        <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-green-200 rounded-full -start-2 ring-1 ring-white ">
          <svg
            class="w-2 h-2 text-green-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
        </span>
        <h3 class="font-medium text-sm">Personal Info & Goals</h3>
      </li> */}
      <li class="mb-6 ms-5">
        {experienceComplete ? (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-green-200 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-2 h-2 text-green-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        ) : (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-3.5 h-3.5 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
        )}
        <h3 class="font-medium text-sm">Professional Experience</h3>
      </li>
      <li class="mb-6 ms-5">
        {educationComplete ? (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-green-200 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-2 h-2 text-green-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        ) : (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-3.5 h-3.5 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
        )}

        <h3 class="font-medium text-sm">Education</h3>
      </li>
      <li class="ms-5">
        {skillsComplete ? (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-green-200 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-2 h-2 text-green-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        ) : (
          <span class="mt-0.5 absolute flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full -start-2 ring-1 ring-white ">
            <svg
              class="w-3.5 h-3.5 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </span>
        )}
        <h3 class="font-medium text-sm">Skills</h3>
      </li>
    </ol>
  );
};

export default StepperComponent;
