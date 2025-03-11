import React, { useEffect, useCallback } from "react";

import { useState } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
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
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from "markdown-draft-js";
import { stateFromMarkdown } from "draft-js-import-markdown";
import Markdown from "react-markdown";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  onEditorStateChange,
} from "draft-js";
import RichTextEditor from "../../Needer/Components/RichTextEditor";
import { useJobRecommendationStore } from "../lib/jobRecommendations";
import PaymentModal from "./PaymentModal/PaymentModal";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import ModifiedResumePreview from "../ResumeBuilder/ModifiedResumePreview";
import ImageSlider from "../components/ImageSlider";
import Carousel from "../components/Carousel";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const HomepageJobs = ({ user }) => {
  //fetch info from chatGPT
  const [userResumeInformation, setUserResumeInformation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [returnedJobs, setReturnedJobs] = useState(null);
  const [newReturnedJobs, setNewReturnedJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasResumeExperience, setHasResumeExperience] = useState(false);

  const { recommendedJobs, setRecommendedJobs } = useJobRecommendationStore();
  const {
    isOpen: isOpenSuggestResume,
    onOpen: onOpenSuggestResume,
    onClose: onCloseSuggestResume,
  } = useDisclosure();

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "users", user.uid, "Resumes", "My Resume")).then(
        (snapshot) => {
          if (!snapshot.data()) {
            setHasResumeExperience(false);
          } else {
            if (snapshot.data().experience.length >= 1) {
              setHasResumeExperience(true);
            } else {
              setHasResumeExperience(false);
            }
          }
        }
      );
    }
  }, [user]);

  // "https://openaiapi-c7qc.onrender.com/getJobs",
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
          userInput: `The user's location is ${user.city}, ${user.state}. The user's current pay is ${user.currentIncome} a year. The user is interested in ${user.userInterests}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse w array new", JSON.parse(json.message.content));
    setRecommendedJobs(JSON.parse(json.message.content));
    setReturnedJobs(JSON.parse(json.message.content));
    setNewReturnedJobs(JSON.parse(json.message.content));
  };

  console.log(typeof returnedJobs);

  useEffect(() => {
    // getJobs();
  }, []);

  useEffect(() => {
    if (returnedJobs) {
      setTimeout(() => {
        setLoading(false);
        console.log("returnedJobs", returnedJobs);
      }, 1000);
    }
  }, [returnedJobs]);

  const [aiTextGenLoading, setAITextGenLoading] = useState(false);

  const [finishedLoading, setFinishedLoading] = useState(false);

  const handleOpenPrompt = () => {
    // open modal
    //do you want us to make you another resume so it's written specifically for this type of job?
    // return, view, option to save.
  };

  // turn it into "I was a blank where I did x. I was a blank where I did y."

  const [userBaseDescription, setUserBaseDescription] = useState(null);
  const [currentSelectedLink, setCurrentSelectedLink] = useState(null);
  const [currentSelectedJobTitle, setCurrentSelectedJobTitle] = useState(null);

  const handleOpenJob = (x) => {
    // window.open(x.link);
    setCurrentSelectedJobTitle(x.job_title);
    setCurrentSelectedLink(x.link);

    if (hasResumeExperience) {
      onOpen();
    } else {
      //open modal that gives an option to set up their resume
      onOpenSuggestResume();
    }
  };

  const uploadJobs = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      returnedJobs: newReturnedJobs,
    });
  };

  const [baseResumeData, setBaseResumeData] = useState([]);
  const [returnedResponse, setReturnedResponse] = useState([]);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);

  const handleSubmitAIInput = async (passedData) => {
    console.log("passedData", passedData);
    // setTextEditorLoading(true);
    setAITextGenLoading(true);
    setLoadingAIResponse(true);

    const response = await fetch(
      // "http://localhost:8000/getResumeModification",
      "https://openaiapi-c7qc.onrender.com/getResumeModification",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({userBaseDescription}),
        body: JSON.stringify({ passedData }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("returned content 2", json.message.content);

    returnedResponse.push(json.message.content);
  };

  const retrieveResumeAndStartAPICall = async () => {
    const resumeSnapshot = await getDoc(
      doc(db, "users", user.uid, "Resumes", "My Resume")
    );

    const resumeData = resumeSnapshot.data();

    baseResumeData.push(resumeData);

    console.log("resumeData", resumeData);
    //ty https://stackoverflow.com/questions/10557486/in-an-array-of-objects-fastest-way-to-find-the-index-of-an-object-whose-attribu credit Pablo Francisco Perez Hidalgo 04/19/2013
    const resumeIndex = resumeData.experience.map((x) =>
      "I worked as a"
        .concat(" ", x.positionTitle)
        .concat(" ", "where")
        .concat(" ", x.userBaseDescription)
        .concat(". ", "I'm applying to a job titled ", currentSelectedJobTitle)
    );

    for (let i = 0; i < resumeIndex.length; i++) {
      console.log("loop", resumeIndex[i]);
      handleSubmitAIInput(resumeIndex[i]);
    }

    setTimeout(() => {
      reassignmentForLoop();
    }, 1500);
  };

  const [newDescriptionsReady, setNewDescriptionsReady] = useState(false);

  const reassignmentForLoop = () => {
    // console.log("coming through top of loop", baseResumeData[0].experience.length, returnedResponse)
    if (baseResumeData !== null && returnedResponse?.length !== 0) {
      for (let i = 0; i < baseResumeData[0].experience.length; i++) {
        let update = { description: returnedResponse[i] };
        let map2 = Object.assign({}, baseResumeData[0].experience[i], update);

        console.log("updated", map2);
      }
      console.log("finished");
      //fire something so editor with new resume data for each option is available to view and edit
      setAITextGenLoading(false);
      setNewDescriptionsReady(true);
    } else {
      setTimeout(() => {
        reassignmentForLoop();
      }, 500);
    }
  };

  //match index
  // substitute locally.

  // useEffect(() => {
  //   if (user) {
  //     uploadEditedWorkExperience();
  //   }
  // }, [user]);

  useEffect(() => {
    if (newReturnedJobs) {
      uploadJobs();
    }
  }, [newReturnedJobs]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setReturnedJobs(snapshot.data().returnedJobs);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //Resume update form controls

  const [isEditCareerGoals, setIsEditCareerGoals] = useState(false);
  const [editorState, setEditorState] = useState(null);
  const [textEditorLoading, setTextEditorLoading] = useState(true);
  const [description, setDescription] = useState(null);

  const handleEditorChange = (editorState) => {
    console.log("handlechange editpor state", editorState);
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  //update local job description

  const updateWithUserEdit = () => {
    const resumeIndex = baseResumeData[0].experience
      .map(function (x) {
        return x.id;
      })
      .indexOf(selectedExperience.id);

    baseResumeData[0].experience[resumeIndex].description = description;

    handleCancel();
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

  // useEffect(() => {
  //   if (returnedResponse) {
  //     setContentState(stateFromMarkdown(returnedResponse));
  //     console.log("any issues?", returnedResponse);
  //   }
  // }, [returnedResponse]);

  // useEffect(() => {
  //   if (contentState) {
  //     setEditorState(EditorState.createWithContent(contentState));

  //     setTimeout(() => {
  //       setTextEditorLoading(false);
  //       setAITextGenLoading(false);

  //       onClose();
  //     }, 500);
  //   }
  // }, [contentState]);

  const handleSelectedEdit = (x) => {
    setSelectedExperience(x);

    console.log("handleSelectedEdit", x);
    setIsEditCareerGoals(!isEditCareerGoals);
  };

  const handleCancel = () => {
    setTextEditorLoading(true);
    setSelectedExperience(null);
    setEditorState(null);

    setDescription(null);
    setUserBaseDescription(null);

    setIsEditCareerGoals(!isEditCareerGoals);
  };

  const [resumeVisible, setResumeVisible] = useState(false);

  const handleUpdate = () => {
    //handle update here
    setResumeVisible(true);
    //trigger open for a new modal that has the new resume displayed on it?
  };

  const handleGoToSite = () => {
    //close modal
    onClose();
    //open site

    window.open(currentSelectedLink);
  };

  //PAYMENT HANDLERS

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const handleOpenPaymentModal = () => {
    setPaymentModalOpen(true);
  };

  const [stripeOpen, setStripeOpen] = useState(false);

  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();

  const handleOpenPayment = () => {
    setStripeOpen(true);
    onOpenStripe();
  };

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    //do i need a callback function or can I pass something here?
    //I could try storing it in a store and pullling from there?
    // also change the dollar amount on the stripe card entering field.
    console.log("fetch client secret called $29");

    return (
      fetch(
        "https://fulfil-api.onrender.com/create-subscription",

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => data.clientSecret)
    );
  }, []);

  const options = { fetchClientSecret };

  const handleCloseOfferOpenPayment = () => {
    //close Modal
    setPaymentModalOpen(false);
    //open stripe
    handleOpenPayment();
  };

  const setModalClosed = () => {
    setResumeVisible(false);
    handleGoToSite();
  };

  return (
    <div className="w-full bg-sky-400 6 py-12">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="flex flex-row w-full">
          <div>
            <h1
              class="block text-3xl font-semibold text-white sm:text-2xl lg:text-3xl lg:leading-tight "
              onClick={() => setPaymentModalOpen(true)}
            >
              Open Positions
            </h1>
            <p class="mt-2 text text-white">
              Browse open positions that fit your skill set.
            </p>
          </div>
          {loading ? (
            <button className=" px-4 py-1 h-2/3 ml-auto bg-white hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm">
              <div
                className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-gray-700 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </button>
          ) : (
            <button
              className=" px-5 py-1 h-2/3 ml-auto bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-md shadow-sm"
              onClick={() => getJobs()}
            >
              Refresh
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
        
            {!loading && recommendedJobs ? (
                <div className="w-full h-[400px]">
              <Carousel slides={returnedJobs} />
              </div>
            ) : null}
         

       

         

          {loading && (
            <div className="flex flex-col sm:flex-row w-full">
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                     
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    {/* <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button> */}
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full ">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                   
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    {/* <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button> */}
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full ">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                     
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    {/* <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button> */}
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {paymentModalOpen && (<PaymentModal handleCloseOfferOpenPayment={() => handleCloseOfferOpenPayment()} />)}
      {stripeOpen && (
            <Modal
              isOpen={isOpenStripe}
              onClose={() => setStripeOpen(false)}
              size="xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />

                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </ModalContent>
            </Modal>
          )} */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="w-full p-4 ">
              <h1 className="text-2xl font-medium text-gray-800 mb-8">
                Do you want us to modify your resume so it fits this job (
                {currentSelectedJobTitle}) specifically?
              </h1>

              {newDescriptionsReady &&
                baseResumeData[0].experience?.map((experience) => (
                  <>
                    {/* got this from chat gpt but idk if this is even copyrightable */}
                    <div class="grid sm:grid-cols-4  align-center items-center">
                      <div class="sm:col-span-1 2xl:col-span-1 mb-5">
                        <p className="font-medium text-sm text-gray-800">
                          Position Title:
                        </p>
                      </div>
                      <div class="sm:col-span-2 align-center items-center mb-5">
                        <p className="text-sm font-semibold ">
                          {" "}
                          {experience.positionTitle}
                        </p>
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
                    {isEditCareerGoals &&
                    experience.id === selectedExperience.id ? (
                      <div className="w-full flex">
                        <div className="ml-auto mt-6">
                          <button
                            type="button"
                            class=" mr-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200"
                            onClick={() => handleCancel()}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            // onClick={() => handleUpdate(selectedExperience)}
                            onClick={() =>
                              updateWithUserEdit(selectedExperience)
                            }
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}

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
                ) : newDescriptionsReady ? (
                  <button
                    onClick={() => handleUpdate(selectedExperience)}
                    type="button"
                    class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Apply To Resume
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
                ) : (
                  <div className="w-full flex space-x-2 ">
                    <button
                      onClick={() => handleGoToSite()}
                      type="button"
                      class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-blue-600 hover:text-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      No thanks
                    </button>
                    <button
                      onClick={() => retrieveResumeAndStartAPICall()}
                      type="button"
                      class="mt-3 w-fit  py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Yes
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
                    </button>{" "}
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenSuggestResume}
        onClose={onCloseSuggestResume}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="w-full p-4 ">
              <h1 className="text-2xl font-medium text-gray-800 mb-8">
                Do you want to build a resume before you go to this job post?
              </h1>

              <div className="w-full flex">
                <div className="w-full flex space-x-2 ">
                  <button
                    onClick={() => handleGoToSite()}
                    type="button"
                    class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-blue-600 hover:text-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    No thanks
                  </button>
                  <button
                    onClick={() => navigate("/ResumeBuilder")}
                    type="button"
                    class="mt-3 w-fit  py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Yes
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
                  </button>{" "}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {resumeVisible && (
        <ModifiedResumePreview
          setModalClosed={() => setModalClosed()}
          updatedExperience={baseResumeData[0].experience}
        />
      )}
    </div>
  );
};

export default HomepageJobs;
