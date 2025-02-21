import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const HomepageJobs = ({ user }) => {
  //fetch info from chatGPT
  const [userResumeInformation, setUserResumeInformation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [returnedJobs, setReturnedJobs] = useState(null);
  const [newReturnedJobs, setNewReturnedJobs] = useState(null);
  const [loading, setLoading] = useState(true);

  const { recommendedJobs, setRecommendedJobs } = useJobRecommendationStore();

  console.log("user", user);

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
    console.log("json resopnse w array", JSON.parse(json.message.content));

    setReturnedJobs(JSON.parse(json.message.content));
    setNewReturnedJobs(JSON.parse(json.message.content));
  };

  console.log(typeof returnedJobs);

  useEffect(() => {
    // getJobs();
  }, []);

  useEffect(() => {
    if (returnedJobs) {
      setLoading(false);
    }
  }, [returnedJobs]);

  const [aiTextGenLoading, setAITextGenLoading] = useState(false);

  const [finishedLoading, setFinishedLoading] = useState(false)

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
    onOpen();
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
    // setTextEditorLoading(true);
    setAITextGenLoading(true);
    setLoadingAIResponse(true);

    const response = await fetch(
      // "http://localhost:8000/getResumeModification",
      "https://openaiapi-c7qc.onrender.com/getResumeHelp",
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
        .concat (". ", "I'm applying to a job titled ", currentSelectedJobTitle)
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
      setAITextGenLoading(false)
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

  }

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

  const [resumeVisible, setResumeVisible] = useState(false)

  const handleUpdate = () => {
    //handle update here 
    setResumeVisible(true)
    //trigger open for a new modal that has the new resume displayed on it?


  }


  //PAYMENT HANDLERS

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const handleOpenPaymentModal = () => {
    setPaymentModalOpen(true)
  }

    const [stripeOpen, setStripeOpen] = useState(false);

     const {
        isOpen: isOpenStripe,
        onOpen: onOpenStripe,
        onClose: onCloseStripe,
      } = useDisclosure();


      const handleOpenPayment = () => {
        setStripeOpen(true)
        onOpenStripe()
      }

       const fetchClientSecret = useCallback(() => {
          // Create a Checkout Session
      
          //do i need a callback function or can I pass something here?
          //I could try storing it in a store and pullling from there?
          // also change the dollar amount on the stripe card entering field.
       console.log("fetch client secret called $29")
      
      
        return (
           
          fetch("https://fulfil-api.onrender.com/create-subscription",
        
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
          setPaymentModalOpen(false)
          //open stripe
          handleOpenPayment()
        }

        const setModalClosed = () => {
          setResumeVisible(false);
     
        };


  return (
    <div className="w-full bg-sky-400 6 py-12">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="flex flex-row w-full" >
          <div>
            <h1 class="block text-3xl font-semibold text-white sm:text-2xl lg:text-3xl lg:leading-tight " onClick={() => setPaymentModalOpen(true)}>
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
          {!loading &&
            recommendedJobs?.map((job) => (
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center  ">
                      <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                        {job.percent_increase}% pay increase
                        <svg
                          class="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                          <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-800">{job.job_title}</h3>
                    <h3 class="font-medium text-gray-800">{job.company}</h3>
                    <h3 class="text-sm text-gray-500">{job.location}</h3>
                    <h3 class="text-sm text-gray-500 mt-2">
                      <span className="text-sm font-medium text-gray-800">
                        Salary:
                      </span>{" "}
                      ${job.pay_rate}
                    </h3>

                    <p class="mt-3 text-gray-700 line-clamp-4">
                      {job.job_description}
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 "
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                      onClick={() => handleOpenJob(job)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {loading && (
            <div className="flex flex-col sm:flex-row sm:w-full">
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
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
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
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
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
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
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
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
                Do you want us to modify your resume so it fits this job ({currentSelectedJobTitle})
                specifically?
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
                  {isEditCareerGoals && experience.id === selectedExperience.id ? (
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
                    onClick={() => updateWithUserEdit(selectedExperience)}
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
                ) : (<button
                  onClick={() => retrieveResumeAndStartAPICall()}
                  type="button"
                  class="mt-3 w-fit ml-auto py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
                </button>)}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {resumeVisible && (<ModifiedResumePreview setModalClosed={() => setModalClosed()} updatedExperience={baseResumeData[0].experience}/>)}
    </div>
  );
};

export default HomepageJobs;
