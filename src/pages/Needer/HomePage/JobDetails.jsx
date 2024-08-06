import React from "react";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";
import { useJobStore } from "./lib/jobsStoreDashboard";
import { db } from "../../../firebaseConfig";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  collectionGroup,
  getDocs,
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import EditSelectedBusinessJob from "../Components/EditSelectedBusinessJob";
import EditSelectedJob from "../Components/EditSelectedJob";
import { useLocation } from "react-router-dom";
import {
  Center,
  Flex,
  Text,
  Spinner,
  Image,
  Box,
  Stack,
  Mark,
} from "@chakra-ui/react";
import ApplicantModal from "./ApplicantModal";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Chat/lib/userStore";
import Markdown from "react-markdown";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const JobDetails = () => {
  const { job, fetchJobInfo } = useJobStore();
  console.log(job);
  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [numberOfRatings, setNumberOfRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (job) {
      const q = query(
        collection(
          db,
          "employers",
          job.employerID,
          "Posted Jobs",
          job.jobTitle,
          "Applicants"
        )
      );

      onSnapshot(q, (snapshot) => {
        let results = [];
        let finalResults = [];
        let toMergeResults = [];
        snapshot.docs.forEach((doc) => {
          if (doc.id.length > 25) {
            results.push(doc.id);
            console.log("here?", doc.id);
          } else {
          }
        });

        results.forEach((results) => {
          const messageRef = doc(
            db,
            "employers",
            job.employerID,
            "Posted Jobs",
            job.jobTitle,
            "Applicants",
            results
          );

          getDoc(messageRef).then((snapshot) => {
            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              console.log(
                "applicant messageinfo from employer fb",
                snapshot.data()
              );
              toMergeResults.push({
                ...snapshot.data(),
                id: snapshot.data().applicantID,
              });
            }
          });
        });

        results.forEach((results) => {
          const secondQuery = doc(db, "users", results);

          getDoc(secondQuery).then((snapshot) => {
            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              finalResults.push({
                ...snapshot.data(),
                id: snapshot.data().streamChatID,
              });
            }

            setTimeout(() => {
              //credit Andreas Tzionis https://stackoverflow.com/questions/19480008/javascript-merging-objects-by-id
              setApplicant(
                finalResults.map((t1) => ({
                  ...t1,
                  ...toMergeResults.find((t2) => t2.id === t1.id),
                }))
              );

              // setIsLoading(false);
            }, 500);

            const ratingsQuery = query(
              collection(db, "users", finalResults[0].streamChatID, "Ratings")
            );

            onSnapshot(ratingsQuery, (snapshot) => {
              let ratingResults = [];
              snapshot.docs.forEach((doc) => {
                //review what this does
                if (isNaN(doc.data().rating)) {
                  console.log("not a number");
                } else {
                  ratingResults.push(doc.data().rating);
                }
              });
              //cited elsewhere
              if (!ratingResults || !ratingResults.length) {
                //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
                setRating(0);
              } else {
                setRating(
                  ratingResults.reduce((a, b) => a + b) / ratingResults.length
                );
                setNumberOfRatings(ratingResults.length);
              }
            });
          });
        });
      });
    }
  }, [job]);

  console.log("job", job);
  console.log("applicant", applicant);

  const location = useLocation();

  const [editVisible, setEditVisible] = useState(false);
  const [editBusinessVisible, setEditBusinessVisible] = useState(false);

  useEffect(() => {
    console.log("location", location.state);
    if (location.state === null) {
    } else {
      if (location.state.editReset) {
        setEditVisible(false);
      } else if (location.state.applicantReset) {
        console.log("hello", location.state.applicantReset);
        setApplicantVisible(false);
      }
    }
  }, [location]);

  const [applicantVisible, setApplicantVisible] = useState(false);

  const handleApplicantVisible = () => {
    setApplicantVisible(true);
    //also pass job info so chat can be started.
  };

  const navigateToChannel = (x) => {
    console.log("this is what youre passing", x);
    navigate("/ChatHolder", {
      state: { selectedChannel: x.channelID, applicant: x },
    });
    // console.log("mesage channel",x);
  };

  // useEffect(() => {
  //   if (job) {
  //     setIsActive(job.isActive)
  //     console.log("reload", job.isActive)
  //   }
  // }, [job])

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChangeJobActivity = () => {
    onOpen();
  };
  const changeJobActivityStatus = () => {
    //change local store so changes are displayed

    //update firebase
    updateDoc(doc(db, "Map Jobs", job.jobID), {
      isActive: !job.isActive,
    });
    updateDoc(
      doc(db, "employers", currentUser.uid, "Posted Jobs", job.jobTitle),
      {
        isActive: !job.isActive,
      }
    )
      .then(() => {
        onClose();

        fetchJobInfo(currentUser.uid, job.jobID, "Posted Jobs", job.jobTitle);
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      <Dashboard />
      {job ? (
        <main id="content" class="lg:ps-[260px] pt-[59px]">
          <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
            {currentUser ? (currentUser.isBusiness ? null : null) : null}

            <div class="py-2 sm:pb-0 sm:pt-5 space-y-5">
              <div class="grid sm:flex sm:justify-between sm:items-center gap-3 sm:gap-5">
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p class="inline-flex justify-between items-center gap-x-1">
                      {job.isActive ? (
                        <a class="text-sm text-green-600 decoration-2  font-medium cursor-default ">
                          Active
                        </a>
                      ) : (
                        <a class="text-sm text-gray-600 decoration-2  font-medium cursor-default ">
                          Inactive
                        </a>
                      )}
                    </p>
                    <h1 class="text-lg md:text-xl font-semibold text-stone-800 cursor-default">
                      {job.jobTitle}
                    </h1>
                  </div>
                </div>

                <div class="inline-flex sm:justify-end items-center gap-x-3">
                  <div class="flex justify-end items-center gap-x-2">
             
                        {/* <button
                          type="button"
                          onClick={() =>
                            setEditBusinessVisible(!editBusinessVisible)
                          }
                          class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 "
                        >
                          Edit
                          <svg
                            class="flex-shrink-0 size-4"
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
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button> */}
                  
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-6 gap-5">
                <div class="lg:col-span-5 space-y-4">
                  <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                    <div class="py-3 px-5 flex justify-between items-center gap-x-5 border-b border-stone-200 ">
                      <h2 class="inline-block font-semibold text-stone-800  cursor-default ">
                        Post Info
                      </h2>
                      {job.isActive ? (
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-full cursor-default">
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Active
                        </span>
                      ) : (
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-full cursor-default">
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Inactive
                        </span>
                      )}
                    </div>

                    <div class="p-5 space-y-4">
                      <div class="grid sm:grid-cols-2 gap-3 sm:gap-5">
                        <div>
                          <label
                            for="hs-pro-epdnm"
                            class="block mb-2 text-sm font-medium text-stone-800 "
                          >
                            Name
                          </label>
                          <p className="cursor-default ">{job.jobTitle}</p>
                        </div>
                        <div className="ml-20">
                          <label
                            for="hs-pro-epdnm"
                            class="block mb-2 text-sm font-medium text-stone-800 "
                          >
                            Total Views
                          </label>
                          {!job.totalViews ? (
                            <p className="cursor-default ">0</p>
                          ) : (
                            <p className="cursor-default ">{job.totalViews}</p>
                          )}
                        </div>
                      </div>
                      <div class="grid sm:grid-cols-2 gap-3 sm:gap-5">
                        <div>
                          <div className="cursor-default ">
                            <label
                              for="hs-pro-epdsku"
                              class="block mb-2 text-sm font-medium text-stone-800 "
                            >
                              Location
                            </label>
                            {job.streetAddress}, {job.city}, MN
                          </div>
                        </div>
                        <div>
                          <div className="cursor-default ml-20">
                            <label
                              for="hs-pro-epdsku"
                              class=" block mb-2 text-sm font-medium text-stone-800 "
                            >
                              Status
                            </label>

                            <div class="flex items-center">
                              <label
                                for="hs-basic-with-description"
                                class="text-sm text-gray-500 me-3 dark:text-neutral-400"
                              >
                                Inactive
                              </label>
                              <input
                                type="checkbox"
                                id="hs-basic-with-description"
                                class="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 

  before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                                checked={job.isActive}
                                onClick={() => handleChangeJobActivity()}
                              />
                              <label
                                for="hs-basic-with-description"
                                class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
                              >
                                Active
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {currentUser ? (
                        currentUser.isBusiness ? (
                          <div className="cursor-default ">
                            <label
                              for="hs-pro-epdsku"
                              class="block mb-2 text-sm font-medium text-stone-800 "
                            >
                              Position Type
                            </label>

                            {job.isFullTimePosition ? (
                              <p>Full-time</p>
                            ) : (
                              <p>Part-time</p>
                            )}
                          </div>
                        ) : null
                      ) : null}

                      <div class="grid sm:grid-cols-2 gap-3 sm:gap-5 mb-6">
                        {currentUser ? (
                          currentUser.isBusiness ? (
                            <div className="cursor-default ">
                              <label
                                for="hs-pro-epdsku"
                                class="block mb-2 text-sm font-medium text-stone-800 "
                              >
                                Pay Type
                              </label>

                              {job.isSalaried ? <p>Salary</p> : <p>Hourly</p>}
                            </div>
                          ) : (
                            <div className="cursor-default ">
                              <label
                                for="hs-pro-epdsku"
                                class="block mb-2 text-sm font-medium text-stone-800 "
                              >
                                Pay Type
                              </label>

                              {job.isFlatRate ? (
                                <p>Flat Rate</p>
                              ) : (
                                <p>Hourly</p>
                              )}
                            </div>
                          )
                        ) : null}

                        <div className="ml-20">
                          {currentUser ? (
                            currentUser.isBusiness ? (
                              <div className="cursor-default ">
                                <label
                                  for="hs-pro-epdsku"
                                  class="block mb-2 text-sm font-medium text-stone-800 "
                                >
                                  Pay Rate
                                </label>
                                {job.isSalaried ? (
                                  <p>
                                    ${job.lowerRate}/year - ${job.upperRate}
                                    /year
                                  </p>
                                ) : (
                                  <p>
                                    ${job.lowerRate}/hour - ${job.upperRate}
                                    /hour
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="cursor-default ">
                                <label
                                  for="hs-pro-epdsku"
                                  class="block mb-2 text-sm font-medium text-stone-800 "
                                >
                                  Pay Rate
                                </label>
                                {job.isFlatRate ? (
                                  <p>${job.flatRate} total</p>
                                ) : (
                                  <p>
                                    ${job.lowerRate}/hour - ${job.upperRate}
                                    /hour
                                  </p>
                                )}
                              </div>
                            )
                          ) : null}
                        </div>
                      </div>

                      <div className="mb-10 h-[60px]"></div>

                      <Accordion defaultIndex={[0]} allowMultiple mt={5}>
                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <label
                                  for="hs-pro-epdsku"
                                  class="block mb-2 text-sm font-medium text-stone-800 "
                                >
                                  Description
                                </label>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <div className="prose prose-li  font-inter marker:text-black ">
                              <Markdown>{job.description}</Markdown>
                            </div>
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex="1" textAlign="left">
                                <label
                                  for="hs-pro-epdsku"
                                  class="block mb-2 text-sm font-medium text-stone-800 "
                                >
                                  Applicant Description
                                </label>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <div className="prose prose-li marker:text-black text-gray-800">
                              <Markdown>{job.applicantDescription}</Markdown>
                            </div>
                          </AccordionPanel>
                        </AccordionItem>

                        {job.benefitsDescription ? (
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                  <label
                                    for="hs-pro-epdsku"
                                    class="block mb-2 text-sm font-medium text-stone-800 "
                                  >
                                    Benefits Description
                                  </label>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <div className="prose prose-li marker:text-black text-gray-800">
                                <Markdown>{job.benefitsDescription}</Markdown>
                              </div>
                            </AccordionPanel>
                          </AccordionItem>
                        ) : null}
                      </Accordion>
                    </div>
                  </div>

                  {editVisible ? <EditSelectedJob props={job} /> : null}
                  {editBusinessVisible ? (
                    <EditSelectedBusinessJob props={job} />
                  ) : null}
   
            
           

                  <div class="p-5 space-y-4 w-full flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
                    <nav
                      class="relative  flex space-x-1 after:absolute after:bottom-0 after:inset-x-0 after:border-b-2 after:border-gray-200 "
                      aria-label="Tabs"
                      role="tablist"
                    >
                      <button
                        type="button"
                        class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none  active"
                        id="hs-pro-tabs-dut-item-all"
                        data-hs-tab="#hs-pro-tabs-dut-all"
                        aria-controls="hs-pro-tabs-dut-all"
                        role="tab"
                      >
                        Applicants
                      </button>
                    </nav>

                    <div>
                      <div
                        id="hs-pro-tabs-dut-all"
                        role="tabpanel"
                        aria-labelledby="hs-pro-tabs-dut-item-all"
                      >
                        <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                          <div class="min-w-full inline-block align-middle">
                            <table class="min-w-full divide-y divide-gray-200 ">
                              {applicant ? (
                                <thead>
                                  <tr class="border-t border-gray-200 divide-x divide-gray-200 ">
                                    <th
                                      scope="col"
                                      class="px-3 py-2.5 text-start"
                                    ></th>

                                    <th scope="col" class="min-w-[250px]">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutnms"
                                          type="button"
                                          class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Name
                                        </button>
                                      </div>
                                    </th>
                                    <th scope="col" class="min-w-12">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-default">
                                        <button
                                          id="hs-pro-dutads"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 cursor-default"
                                        >
                                          Rating
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-36">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutsgs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Status
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col " class="min-w-36">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutems"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100"
                                        >
                                          Date Applied
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-36">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutphs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Next Step
                                        </button>
                                      </div>
                                    </th>

                                    {/* <th scope="col"></th> */}
                                  </tr>
                                </thead>
                              ) : (
                                <p class="text-sm text-gray-800">
                                  No applicants yet
                                </p>
                              )}

                              {currentUser
                                ? currentUser.isBusiness
                                  ? applicant
                                    ? applicant.map((applicant) => (
                                        <tbody class="divide-y divide-gray-200 ">
                                          <tr class="divide-x divide-gray-200 ">
                                            <td class="size-px whitespace-nowrap px-3 py-4"></td>
                                            <td
                                              class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer"
                                              // onClick={() => handleStoreAndNavigatePosted(job)}
                                            >
                                              <div class="w-full flex items-center gap-x-3">
                                                {applicant.profilePictureResponse ? (
                                                  <img
                                                    class="flex-shrink-0 size-[38px] rounded-full"
                                                    src={
                                                      applicant.profilePictureResponse
                                                    }
                                                    alt="Image Description"
                                                  />
                                                ) : (
                                                  <svg
                                                    class="w-12 h-12 rounded-full object-cover text-gray-500"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <rect
                                                      x="0.62854"
                                                      y="0.359985"
                                                      width="15"
                                                      height="15"
                                                      rx="7.5"
                                                      fill="white"
                                                    ></rect>
                                                    <path
                                                      d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                                                      fill="currentColor"
                                                    ></path>
                                                    <path
                                                      d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                                                      fill="currentColor"
                                                    ></path>
                                                  </svg>
                                                )}
                                                {applicant ? (
                                                  <p class="text-sm text-gray-800">
                                                    {applicant.firstName}{" "}
                                                    {applicant.lastName}
                                                  </p>
                                                ) : (
                                                  <p class="text-sm text-gray-800">
                                                    No applicants yet
                                                  </p>
                                                )}
                                              </div>
                                            </td>

                                            <p class="flex flex-col items-center mt-6 text-sm text-gray-500 ">
                                              <div class=" text-center items-center gap-x-3 text-sm text-gray-800 cursor-default ">
                                                {applicant.numberOfRatings ? (
                                                  <>
                                                    <Flex>
                                                      {maxRating.map(
                                                        (item, key) => {
                                                          return (
                                                            <Box
                                                              activeopacity={
                                                                0.7
                                                              }
                                                              key={item}
                                                              marginTop="1px"
                                                            >
                                                              <Image
                                                                boxSize="16px"
                                                                src={
                                                                  item <=
                                                                  applicant.rating
                                                                    ? star_filled
                                                                    : star_corner
                                                                }
                                                              ></Image>
                                                            </Box>
                                                          );
                                                        }
                                                      )}
                                                    </Flex>

                                                    <Text marginLeft="4px">
                                                      (
                                                      {
                                                        applicant.numberOfRatings
                                                      }{" "}
                                                      reviews)
                                                    </Text>
                                                  </>
                                                ) : (
                                                  <>
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke-width="1.5"
                                                      stroke="currentColor"
                                                      class="flex-shrink-0 size-4 text-gray-600 "
                                                    >
                                                      <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                      />
                                                    </svg>
                                                    <Text>No reviews yet</Text>
                                                  </>
                                                )}
                                              </div>
                                            </p>

                                            <td class="size-px whitespace-nowrap px-4 py-1">
                                              {applicant.channelId ? (
                                                <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                                                  <svg
                                                    class="flex-shrink-0 size-3.5"
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
                                                    <polyline points="20 6 9 17 4 12" />
                                                  </svg>
                                                  Interviewing
                                                </span>
                                              ) : (
                                                <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                                                  <svg
                                                    class="flex-shrink-0 size-3.5"
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
                                                    <polyline points="20 6 9 17 4 12" />
                                                  </svg>
                                                  Applied
                                                </span>
                                              )}
                                            </td>
                                            <td class="size-px whitespace-nowrap px-4 py-1">
                                              <span class="text-sm text-gray-600 ">
                                                {job.datePosted}
                                              </span>
                                            </td>
                                            <td class="size-px py-2 px-3 space-x-2">
                                              <div className=" flex  w-full ">
                                                {applicant.channelId ? (
                                                  <>
                                                    {" "}
                                                    {/* <button
                                      type="button"
                                      onClick={() => handleApplicantVisible()}
                                      class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                    >
                                      View profile
                                    </button> */}
                                                    {applicant.hasUnreadMessage ? (
                                                      <button
                                                        class=" w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white shadow-sm hover:bg-sky-500"
                                                        onClick={() =>
                                                          navigateToChannel(
                                                            applicant
                                                          )
                                                        }
                                                      >
                                                        See Messages
                                                        <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                                          New
                                                        </span>
                                                      </button>
                                                    ) : (
                                                      <button
                                                        class="  w-auto py-2 px-2 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                                                        onClick={() =>
                                                          navigateToChannel(
                                                            applicant
                                                          )
                                                        }
                                                      >
                                                        See Messages
                                                      </button>
                                                    )}
                                                  </>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleApplicantVisible()
                                                    }
                                                    class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                                  >
                                                    View profile
                                                  </button>
                                                )}
                                              </div>
                                              {applicantVisible ? (
                                                <ApplicantModal
                                                  props={applicant}
                                                />
                                              ) : null}
                                            </td>
                                          </tr>
                                        </tbody>
                                      ))
                                    : null
                                  : null
                                : null}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <div class="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto ">
                      <div class="flex justify-between items-center py-3 px-4  ">
                        <h3
                          id="hs-scale-animation-modal-label"
                          class="font-bold text-gray-800 "
                        >
                          Change Job Status
                        </h3>
                        <button
                          onClick={() => onClose()}
                          type="button"
                          class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                          aria-label="Close"
                          data-hs-overlay="#hs-scale-animation-modal"
                        >
                          <span class="sr-only">Close</span>
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
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="p-4 overflow-y-auto">
                        <p class="mt-1 text-gray-800 ">
                          Are you sure you want to change the active status of
                          this job post?
                        </p>
                      </div>
                      <div class="flex justify-end items-center gap-x-2 py-3 px-4 ">
                        <button
                          onClick={() => onClose()}
                          type="button"
                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
                          data-hs-overlay="#hs-scale-animation-modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={() => changeJobActivityStatus()}
                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Change status
                        </button>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>

                {currentUser ? (
                  currentUser.isBusiness ? null : (
                    <div class="lg:col-span-2">
                      <div class="lg:sticky lg:top-5 space-y-4">
                        <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                          <div class="py-3 px-5  justify-between items-center gap-x-5 border-b border-stone-200 ">
                            <h2 class="inline-block font-semibold text-stone-800 cursor-default">
                              Applicants
                            </h2>
                            {isLoading ? (
                              <Center marginTop="32px">
                                <Spinner
                                  thickness="4px"
                                  speed="0.65s"
                                  emptyColor="gray.200"
                                  color="#01A2E8"
                                  size="lg"
                                />
                              </Center>
                            ) : applicant ? (
                              applicant.map((applicant) => (
                                <>
                                  <div class="mt-2 p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                                    <div class="flex justify-between">
                                      <div class="flex flex-col justify-center items-center size-[56px]  ">
                                        {applicant.profilePictureResponse ? (
                                          <img
                                            src={
                                              applicant.profilePictureResponse
                                            }
                                            class="flex-shrink-0 size-[64px] rounded-full"
                                          />
                                        ) : (
                                          <svg
                                            class="size-full text-gray-500"
                                            width="36"
                                            height="36"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <rect
                                              x="0.62854"
                                              y="0.359985"
                                              width="15"
                                              height="15"
                                              rx="7.5"
                                              fill="white"
                                            ></rect>
                                            <path
                                              d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                                              fill="currentColor"
                                            ></path>
                                            <path
                                              d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                                              fill="currentColor"
                                            ></path>
                                          </svg>
                                        )}
                                      </div>

                                      <div>
                                        <label
                                          for="hs-pro-daicn1"
                                          class="relative cursor-default py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg  text-xs font-medium focus:outline-none text-sky-500 bg-blue-100"
                                        >
                                          <span class="relative z-10 peer-checked:hidden text-sky-500 ">
                                            Pro
                                          </span>
                                          <span class="relative z-10 justify-center items-center gap-x-1.5 hidden peer-checked:flex peer-checked:text-gray-800 text-sky-500 ">
                                            <svg
                                              class="flex-shrink-0 size-3.5 mt-0.5"
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
                                              <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Pro
                                          </span>
                                        </label>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 class="font-medium text-gray-800 cursor-default ">
                                        {applicant.firstName}{" "}
                                        {applicant.lastName}
                                      </h3>
                                      <p class="mt-1 text-sm text-gray-500 ">
                                        <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 cursor-default ">
                                          {applicant.numberOfRatings ? (
                                            <Flex>
                                              {maxRating.map((item, key) => {
                                                return (
                                                  <Box
                                                    activeopacity={0.7}
                                                    key={item}
                                                    marginTop="1px"
                                                  >
                                                    <Image
                                                      boxSize="16px"
                                                      src={
                                                        item <= applicant.rating
                                                          ? star_filled
                                                          : star_corner
                                                      }
                                                    ></Image>
                                                  </Box>
                                                );
                                              })}
                                              <Text marginLeft="4px">
                                                ({applicant.numberOfRatings}{" "}
                                                reviews)
                                              </Text>
                                            </Flex>
                                          ) : (
                                            <>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                class="flex-shrink-0 size-4 text-gray-600 "
                                              >
                                                <path
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                />
                                              </svg>
                                              <Text>No reviews yet</Text>
                                            </>
                                          )}
                                        </div>
                                      </p>
                                      <Stack direction={"row"}>
                                        {applicant.premiumCategoryOne ? (
                                          <span class="inline-flex items-center gap-x-1.5 py-1.5   px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                            {applicant.premiumCategoryOne}
                                          </span>
                                        ) : null}

                                        {applicant.premiumCategoryTwo ? (
                                          <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-1 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                            {applicant.premiumCategoryTwo}
                                          </span>
                                        ) : null}
                                        {applicant.premiumCategoryThree ? (
                                          <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-1 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                            {applicant.premiumCategoryThree}
                                          </span>
                                        ) : null}
                                      </Stack>

                                      <p class="mt-1 text-sm text-gray-500 ">
                                        {applicant.bio}
                                      </p>
                                    </div>

                                    {applicant.channelId ? (
                                      <>
                                        {" "}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleApplicantVisible()
                                          }
                                          class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                        >
                                          View profile
                                        </button>
                                        {applicant.hasUnreadMessage ? (
                                          <button
                                            class=" w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                            onClick={() =>
                                              navigateToChannel(applicant)
                                            }
                                          >
                                            See Messages
                                            <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                              New
                                            </span>
                                          </button>
                                        ) : (
                                          <button
                                            class="  w-auto py-2 px-2 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                            onClick={() =>
                                              navigateToChannel(applicant)
                                            }
                                          >
                                            See Messages
                                          </button>
                                        )}
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          //   navigateApplicantProfile(
                                          //     applicant,
                                          //     allJobs
                                          //   )
                                          handleApplicantVisible()
                                        }
                                        class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                      >
                                        View profile
                                      </button>
                                    )}
                                  </div>
                                  {applicantVisible ? (
                                    <ApplicantModal props={applicant} />
                                  ) : null}
                                </>

                                //applicantModal here
                              ))
                            ) : (
                              <p className="text-sm font-semibold text-gray-500">
                                No applicants yet{" "}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </>
  );
};

export default JobDetails;
