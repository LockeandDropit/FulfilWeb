import React from "react";
import { useState, useEffect, useRef } from "react";
import DoerHeader from "../components/DoerHeader";
import { useMediaQuery } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";
import Markdown from "react-markdown";
import { Box } from "@chakra-ui/react";
import Select from "react-select";
import { useUserStore } from "../Chat/lib/userStore";
import { updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Education from "../ProfileComponents/Education";
import Work from "../ProfileComponents/Work";
import Skills from "../ProfileComponents/Skills";
import StepperComponent from "../ProfileComponents/StepperComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumePreview from "../ResumeBuilder/ResumePreview";
import AboutInfo from "../ProfileComponents/AboutInfo";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import EducationPreview from "./Preview/EducationPreview";
import ExperiencePreview from "./Preview/ExperiencePreview";
import SkillPreview from "./Preview/SkillPreview";
import AboutPreview from "./Preview/AboutPreview";


const ResumeBuilder = () => {
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

  //save to firebbase
  const [resumeInfo, setResumeInfo] = useState(null);


  useEffect(() => {
    if (currentUser) {
   
      getDoc(doc(db, "users", currentUser.uid, "Resumes", "My Resume")).then(
        (snapshot) => {
          if (!snapshot.data()) {
          } else {
            console.log("from firestore", snapshot.data());
            setResumeInfo(snapshot.data());
          }
        }
      );
    }
  }, [currentUser]);

  const contentRef = useRef(null);
  //   const reactToPrintFn = useReactToPrint({ contentRef });
  
    function ResumePrintComponent() {
      return (
        <div id="section-to-print" className="w-full px-2" ref={contentRef}>
          <AboutPreview resumeInfo={resumeInfo} currentUser={currentUser} />
          {resumeInfo?.education?.length > 0 && (
            <EducationPreview resumeInfo={resumeInfo} />
          )}
          {resumeInfo?.experience?.length > 0 && (
            <ExperiencePreview resumeInfo={resumeInfo} />
          )}
          {resumeInfo?.skills?.length > 0 && (
            <SkillPreview resumeInfo={resumeInfo} />
          )}
        </div>
      );
    }

  
 const saveToFirebase = async () => {

        // This whole thing is essentially GPT code.


        // Capture the content using html2canvas
        const canvas = await html2canvas(contentRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
    
        // Create a new PDF and add the captured image
        const pdf = new jsPDF("portrait", "in", "letter");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
    
        // Get canvas dimensions in pixels
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
    
        // Calculate the scaling ratio to fit the canvas width to the PDF width
        const ratio = pdfWidth / canvasWidth;
        let imgWidth = pdfWidth;
        let imgHeight = canvasHeight * ratio;
    
        // If the scaled image height is too tall, recalculate based on the PDF height
        if (imgHeight > pdfHeight) {
          const newRatio = pdfHeight / canvasHeight;
          imgWidth = canvasWidth * newRatio;
          imgHeight = pdfHeight;
        }
    
        // Optionally, center the image vertically/horizontally if it's smaller than the page
        const marginX = (pdfWidth - imgWidth) / 2;
        const marginY = 0.5; // Fixed margin at the top (0.5 inches)
    
        // Add the image to the PDF at the computed position and size
        pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
    
        // Instead of saving locally, get a Blob of the PDF
        const pdfBlob = pdf.output("blob");
    
        console.log("blolb", pdfBlob);
    
        const storage = getStorage();
        const resumeRef = ref(storage, "users/" + currentUser.uid + "/resume.jpg");
    
        await uploadBytes(resumeRef, pdfBlob).then((snapshot) => {});
    
        await getDownloadURL(resumeRef).then((response) => {
          updateDoc(doc(db, "users", currentUser.uid), {
            resume: response,
          })
            .then(() => {
              //all good
            })
            .catch((error) => {
              // no bueno
            });
        });
 }








  return (
    <>
  
      <DoerHeader />

      {currentUser && (
        <main id="content">
          <div class="max-w-6xl mx-auto mt-16">
            <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
            

              {isDesktop ? null : (
                <>
                  {" "}
                  <div class="xl:ps-5 grow space-y-5">
                    <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                      {/* Start about */}
                     
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
                  

                    <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                      <div class="mt-8 ">
                        <div className="h-[48px] mt-16"></div>
                        {/* <h2 class=" font-semibold text-gray-800 mt-16 mb-3">
                          Resume Progress
                        </h2>{" "} */}
                        {/* stepper component */}
                        <StepperComponent
                          currentUser={currentUser}
                          changeListener={changeListener}
                          changeOccured={changeOccured}
                        />
                        <div>
                        <div className="flex w-full">
                    <button
                            type="button"
                            class="mt-6 py-2 px-3 inline-flex w-full items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => setOpenModal(true)}
                            // onClick={() => saveToFirebase()}
                          >
                           Save
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
                          {/* <button
                            type="button"
                            class="mt-6 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="xl:ps-5  w-full sm:w-3/4 space-y-1 mt-2">
                    <div className="flex flex-col bg-white rounded-xl shadow-sm xl:shadow-none  w-full ml-auto">
                    <h2 class="font-semibold text-gray-800 text-lg">
     My Resume
    </h2>
    <div class="h-full py-4 space-y-4">
    <p class="pb-4 text-sm text-gray-500 dark:text-neutral-500">
      Add relevant work history, skills, and education. Use this information to genetate multiple resumes each tailored to different positions with the use of AI.
    </p>
    </div>
                    
                      {accordionHidden ? null : (
                        <Accordion defaultIndex={[0]} allowMultiple>
                         <AboutInfo changeListener={changeListener}/>
                          <Work changeListener={changeListener} />
                          <Education changeListener={changeListener} />
                          <Skills changeListener={changeListener} />
                        </Accordion>
                        
                      )}
                    </div>
                    <div className=" sm:invisible flex w-full">
                    <button
                            type="button"
                            class="mt-6 py-2 px-3 inline-flex w-full justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => setOpenModal(true)}
                            // onClick={() => saveToFirebase()}
                          >
                           Save
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
                <div className="invisible">
                <ResumePrintComponent 
                   resumeInfo={resumeInfo}
                   currentUser={currentUser}/>
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

export default ResumeBuilder;
