import React from "react";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { Box } from "@chakra-ui/react";
import { useResumeStore } from "../ResumeBuilder/lib/resumeStore";


import { v4 as uuidv4 } from "uuid";


const AboutInfo = ({ changeListener }) => {

const [isEditCareerGoals, setIsEditCareerGoals] = useState(false)
const [selectedExperience, setSelectedExperience] = useState(null);
  // const [phoneNumber, setPhoneNumber] = useState(null)
  // const [about, setAbout] = useState(null)
  const [formValidationMessage, setFormValidationMessage] = useState();
   const [updateIsLoading, setUpdateIsLoading] = useState(false);


   const {fullName, setFullName, city, setCity, state, setState, phoneNumber, setPhoneNumber, email, setEmail, about, setAbout} = useResumeStore()

const handleSelectedEdit = (x) => {
  setSelectedExperience(x);
  setIsEditCareerGoals(!isEditCareerGoals);
};

const handleCancel = () => {
  setSelectedExperience(null);
  setIsEditCareerGoals(!isEditCareerGoals);
};

const handleUpdateAbout = () => {

}

  //add regex test when you can
  let phoneNumberValid = true

  const handleUpdate = () => {
    if (!phoneNumberValid) {
      setFormValidationMessage("Please fill out all fields");
    } else {
      // check if it has an id, if it has an id it exists, so route to uploadEditedWorkExperience(). Else route to uploadEorkExperience().

    
        setUpdateIsLoading(true);
        //update local store
        // uploadWorkExperience();
        setFormValidationMessage()
        handleCancel()
    
    }
  };

//Thios is the rewritten portion

//I need to create a local store for this info.

// Name, phone number (optional), city, state, email, about blurb (optional) 

// const [fullName, setFullName] = useState(null)

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
       
            <div className="flex flex-col  space-y-2 mb-3">
            <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Full Name:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setFullName(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="John Doe"
                      value={
                        fullName
                      }
                    />
                  ) : ( fullName ? (<p className="text-sm ">{fullName}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
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
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    City
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setCity(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Minneapolis"
                      value={
                        city
                      }
                    />
                  ) : ( city ? (<p className="text-sm ">{city}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
              
              </div> <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    State:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setState(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="Minnesota"
                      value={
                        state
                      }
                    />
                  ) : ( state ? (<p className="text-sm ">{state}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
              
              </div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    E-mail:
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="applicant@gmail.com"
                      value={
                        email
                      }
                    />
                  ) : ( email ? (<p className="text-sm ">{email}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
              
              </div>
              <div class="grid sm:grid-cols-4  align-center items-center">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    Phone Number (optional):
                  </p>
                </div>
                <div class="sm:col-span-2 align-center items-center">
                  {isEditCareerGoals ?
                  (
                    <input
                      type="text"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className=" w-3/4 py-2 px-4 block  border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      placeholder="(xxx) xxx-xxxx"
                      value={
                        phoneNumber
                      }
                    />
                  ) : ( phoneNumber ? (<p className="text-sm ">{phoneNumber}</p>) : (<p className="text-sm text-gray-500 italic">Nothing here yet</p>)
                    
                  )}
                </div>
              
              </div>
              <div class="grid sm:grid-cols-4  align-center items-center mb-8">
                <div class="sm:col-span-1 2xl:col-span-1">
                  <p className="font-medium text-sm text-gray-800">
                    About (optional):
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
