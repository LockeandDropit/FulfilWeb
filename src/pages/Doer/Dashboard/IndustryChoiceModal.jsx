import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useEduRecommendationStore } from "../lib/eduRecommendations";
import { useJobRecommendationStore } from "../lib/jobRecommendations";
import { usePreferredIndustryStore } from "../lib/userPreferredIndustry";

const IndustryChoiceModal = ({ modalControl, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

   const{ setPreferredIndustry } = usePreferredIndustryStore();

  useEffect(() => {
    onOpen();
  }, []);

  const [loading, setLoading] = useState(false);
  const [returnedJobs, setReturnedJobs] = useState(null);
  const [returnedEducation, setReturnedEducation] = useState(null);
  const [newPreferredIndustry, setNewPreferredIndustry] = useState(null);
  const [returnedIndustry, setReturnedIndustry] = useState(null);

  const handleOnClose = () => {
    onClose();
    modalControl();
  };

  console.log("user from modal", user)


  const {setRecommendedEdu} = useEduRecommendationStore();
  const {setRecommendedJobs} = useJobRecommendationStore();


 
  const getJobs = async () => {
    setLoading(true);

    const response = await fetch(
       
 "https://openaiapi-c7qc.onrender.com/getJobs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `The user's location is ${user.city}, ${user.state}. The user's current pay is ${user.currentIncome} a year. The user is interested in ${newPreferredIndustry}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse w array", JSON.parse(json.message.content));

    setReturnedJobs(JSON.parse(json.message.content));
    setRecommendedJobs(JSON.parse(json.message.content))
  
    // setLoading(false);
  };

  const getEdu = async () => {
    setLoading(true);

        
    const response = await fetch(
        "https://openaiapi-c7qc.onrender.com/getEdu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: `The user's location is ${user.city}, ${user.state}. The user's current pay is ${user.currentIncome}. The user is interested in ${newPreferredIndustry}`,
      }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse w array EDU", JSON.parse(json.message.content));

    setReturnedEducation(JSON.parse(json.message.content));
    setRecommendedEdu(JSON.parse(json.message.content))
    // setLoading(false);
  };

  
  const getPreferredIndustry = async () => {
    setLoading(true);

    console.log("new pref ind", newPreferredIndustry)
    
    const response = await fetch(
  "https://openaiapi-c7qc.onrender.com/getIndustryRecommendation",
      
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `The user is interested in ${newPreferredIndustry}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json industry resopnse w array", JSON.parse(json.message.content));

    //sets new industry so it can be changed in FB
    setReturnedIndustry(JSON.parse(json.message.content));

    //stores new industry to context
    setPreferredIndustry(JSON.parse(json.message.content));
    // setLoading(false);
  };

  const fetchNewPathData = () => {
    getPreferredIndustry();
    getJobs();
    getEdu();
  };

  const uploadNewData = async () => {

    console.log("returned from modal", returnedIndustry, returnedJobs, returnedEducation)
    await updateDoc(doc(db, "users", user.uid), {
      userPreferredIndustry: returnedIndustry,
      returnedJobs: returnedJobs,
      returnedEducation: returnedEducation,
    }).then(() => {
      setTimeout(() => {
         setLoading(false);
        handleOnClose();  
      }, 500)
        
    })
  };

  useEffect(() => {
    if (returnedEducation && returnedIndustry && returnedJobs) {
      //update fb
      uploadNewData();
    }
  }, [returnedEducation, returnedIndustry, returnedJobs]);

  // once industry is entered, make button clickable,
  // send to 3 API ebnd poinsts
  // enable loadiong sign & extra message sating it will take a bit of time.
  // setState locally and update FB.

  return (
    <Modal isOpen={isOpen} onClose={() => handleOnClose()} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <div className="mt-0  ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h3
                  id="hs-modal-recover-account-label"
                  className="block text-2xl font-bold text-gray-800"
                >
                  {" "}
                  Already know what you want?{" "}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Enter the industry/career you want below and we'll tailor your
                  profile for you.
                </p>
              </div>
              <div className="mt-5">
               
                  <div className="grid gap-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2">
                        Industry/career:
                      </label>
                      <div className="relative">
                        <input
                          onChange={(e) => setNewPreferredIndustry(e.target.value)}
                     
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                       
                    
                        />
                      
                      </div>
                    
                    </div>
                    {loading ? (
                      <button
                        //   onClick={() => fetchNewPathData()}
                     
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Loading...
                      </button>
                    ) : (
                      <button
                        onClick={() => fetchNewPathData()}
                  
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Generate Profile
                      </button>
                    )}
                  </div>
          
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IndustryChoiceModal;
