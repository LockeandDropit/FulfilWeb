import React from "react";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";

import {
  doc,
  getDoc,
  collectionGroup,
  getDocs,
  query,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSavedJobStore } from "./Chat/lib/savedJobStore";
import { useMediaQuery } from "@chakra-ui/react";
import { useUserStore } from "./Chat/lib/userStore";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Spinner,
  Text,
  Button
} from "@chakra-ui/react";
import Markdown from "react-markdown";


// import { addJobStore } from "./lib/addJobStore";

const DoerSavedJobs = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const navigate = useNavigate();
  const { fetchJobInfo, setJobHiringState } = useSavedJobStore();
  const {fetchUserInfo, currentUser} = useUserStore()
  // const {jobHeld, addJobInfo} = addJobStore()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // console.log("here is job held", jobHeld)

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
        fetchUserInfo(currentUser.uid)
      });
      setHasRun(true);
    } else {
    }
  }, []);


  const {
    isOpen: isOpenDrawerSingle,
    onOpen: onOpenDrawerSingle,
    onClose: onCloseDrawerSingle,
  } = useDisclosure();
  const {
    isOpen: isOpenNoResume,
    onOpen: onOpenNoResume,
    onClose: onCloseNoResume,
  } = useDisclosure();


  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] =  useState({
    lat: 1,
    lng: 1,
  });

  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID(x);
    // updateJobListingViews(x);
    onOpenDrawerSingle();
    console.log("from on click", x);
  };

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Posted Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          //this was crashing everything??
          // setPostedJobs(0);
        } else {
          setPostedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [jobsInProgressMap, setJobsInProgressMap] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "users", user.uid, "Saved Jobs")
      );

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          //this was crashing everything??
          // setPostedJobs(0);
        } else {
          setJobsInProgressMap(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [jobsInReviewMap, setJobsInReviewMap] = useState([]);

 

  //   console.log(jobsInReview);

  const [showAddJob, setShowAddJob] = useState(false);

  const handleStoreAndNavigateSaved = (x) => {
    console.log(x.jobTitle, x.jobID);

    fetchJobInfo(user.uid, x.jobID, "Saved Jobs", x.jobTitle);
 
    setTimeout(() => navigate("/SavedJobDetails"), 500);
  };

  const handleSendEmail = async (x) => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendNewApplicantEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: x.employerEmail }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
  };

  const handleStoreAndNavigateInReview = (x) => {
    console.log(x.jobTitle, x.jobID);
    fetchJobInfo(user.uid, x.jobID, "In Review", x.jobTitle);
    if (x.hasNewNotification === true) {
      updateDoc(doc(db, "employers", user.uid, "In Review", x.jobTitle), {
        hasNewNotification: false,
      })
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
          console.log(error);
        });
    }
    //set store info... uid, jobTitle, jobID,.

    setTimeout(() => navigate("/JobDetailsReadyToPay"), 500);
  };

  const [dateApplied, setDateApplied] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=3 mohshbool & Samuel Meddows
    let initialDate = new Date();
    var dd = String(initialDate.getDate()).padStart(2, "0");
    var mm = String(initialDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + "/" + dd + "/" + yyyy;

    setDateApplied(today);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const applyAndNavigate = (x) => {
    //If anything is going wring in the application or saved job flow it's because I changed this on 5/27/24 at 2:30. Revert to previous if any issues

    if (currentUser.resumeUploaded) {
      updateDoc(doc(db, "employers", x.employerID, "Posted Jobs", x.jobTitle), {
        hasNewApplicant: true,
      })
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
        });

      setDoc(
        doc(
          db,
          "employers",
          x.employerID,
          "Posted Jobs",
          x.jobTitle,
          "Applicants",
          user.uid
        ),
        {
          applicantID: user.uid,
          isNewApplicant: true,
          dateApplied: dateApplied,
        }
      )
        .then(() => {
          //user info submitted to Job applicant file
          // navigation.navigate("BottomUserTab");
        })
        .catch((error) => {
          //uh oh
        });

        deleteDoc(doc(db, "users", currentUser.uid, "Saved Jobs", x.jobID), {
          hasNewApplicant: true,
        })
          .then(() => {
            //user info submitted to Job applicant file
          })
          .catch((error) => {
            //uh oh
          });

      const docRef = doc(
        db,
        "employers",
        x.employerID,
        "Posted Jobs",
        x.jobTitle
      );

      updateDoc(docRef, { totalApplicants: increment(1) });

      setDoc(doc(db, "users", user.uid, "Applied", x.jobTitle), {
        requirements: x.requirements ? x.requirements : null,
        requirements2: x.requirements2 ? x.requirements2 : null,
        requirements3: x.requirements3 ? x.requirements3 : null,
        isFlatRate: x.isFlatRate ? x.isFlatRate : null,
        niceToHave: x.niceToHave ? x.niceToHave : null,
        datePosted: x.datePosted ? x.datePosted : null,

        jobID: x.jobID,
        jobTitle: x.jobTitle ? x.jobTitle : null,
        hourlyRate: x.hourlyRate ? x.hourlyRate : null,
        streetAddress: x.streetAddress ? x.streetAddress : null,
        city: x.city ? x.city : null,
        state: x.state ? x.state : null,
        zipCode: x.zipCode ? x.zipCode : null,
        description: x.description ? x.description : null,
        addressNumber: x.addressNumber ? x.addressNumber : null,
        addressName: x.addressName ? x.addressName : null,
        lowerRate: x.lowerRate ? x.lowerRate : null,
        upperRate: x.upperRate ? x.upperRate : null,
        addressSuffix: x.addressSuffix ? x.addressSuffix : null,
        locationLat: x.locationLat ? x.locationLat : null,
        locationLng: x.locationLng ? x.locationLng : null,
        businessName: x.businessName ? x.businessName : null,
        employerID: x.employerID ? x.employerID : null,
        employerFirstName: x.employerFirstName ? x.employerFirstName : null,
        flatRate: x.flatRate ? x.flatRate : null,
        isHourly: x.isHourly ? x.isHourly : null,
        category: x.category ? x.category : null,
        isOneTime: x.isOneTime ? x.isOneTime : null,
        lowerCaseJobTitle: x.lowerCaseJobTitle ? x.lowerCaseJobTitle : null,
      })
        .then(() => {
          onOpen();
        })
        .catch((error) => {
          //uh oh
        });

      handleSendEmail(x);
      console.log(x.employerEmail);
    } else {
      onOpenNoResume();
      // pop modal here
    }
  };


  const deleteSavedJob = (x) => {
    deleteDoc(doc(db, "users", currentUser.uid, "Saved Jobs", x.jobID), {
      hasNewApplicant: true,
    })
      .then(() => {
      
        onCloseDrawerSingle()
      })
      .catch((error) => {
        //uh oh
      });
  }

  // useEffect(() => {
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   const sessionId = urlParams.get("session_id");

  //   if (sessionId && user !== null) {
  //     setHasRun(false);
  //     fetch(
  //       `https://fulfil-api.onrender.com/single-post-session-status?session_id=${sessionId}`
     
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.status === "complete") {
  //        console.log(data)
  //        console.log(data.status)
  //           submitJob()
           
  //           setTimeout(() => {
  //             onOpen()
  //     addJobInfo(null)
  //           }, 500);
  //         } else {
  //           alert(
  //             "There was an error processing your payment. Please try again later."
  //           );
  //           addJobInfo(null)
  //         }
  //       });
  //   } else {

  //   }
  // }, [user]);


  const updateBusinessAsPremium = () => {
    console.log("updated as premium")
    updateDoc(doc(db, "employers", user.uid), {
      isPremium : true
    })
  }


  // useEffect(() => {
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //   const sessionId = urlParams.get("session_id");

  //   console.log("new update outer")
  //   if (sessionId && user !== null && currentUser !== null ) {
  //     if (currentUser.isPremium === false) {
  //     console.log("new update inner")
  //     setHasRun(false);
  //     fetch(
  //       `https://fulfil-api.onrender.com/business-subscription-session-status?session_id=${sessionId}`

  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.status === "complete") {
        
  //        console.log(data.status)
  //        console.log(user.uid)
  //        updateDoc(doc(db, "employers", user.uid), {
  //         isPremium : true
  //       })
  //       .catch((error) => console.log(error))
  //         fetchUserInfo(user.uid)
       
  //             onOpen()
              
        
    
  //         } else {
  //           alert(
  //             "There was an error processing your payment. Please try again later."
  //           );
       
  //         }
          
  //       });
  //     } else {}
  //   } else {

  //   }
  // }, [user, currentUser]);

  



  //business logic

  const [showAddJobBusiness, setShowAddJobBusiness] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
const [checkIfPremiumLoading, setCheckIfPremiumLoading] = useState(false)

  // const checkIfPremium = () => {
  

  //   if (currentUser.isPremium === true) {
  //     setShowAddJobBusiness(!showAddJobBusiness)
  //   } else {
  //     setCheckIfPremiumLoading(true)
  //     const docRef = doc(db, "employers", currentUser.uid);

  //     getDoc(docRef).then((snapshot) => {
  //       if (snapshot.data().isPremium === true) {
  //         setShowAddJobBusiness(!showAddJobBusiness)
  //       } else {
  //         setShowSubscriptionModal(!showSubscriptionModal)
  //       }
  //       setCheckIfPremiumLoading(false)
  //     })
    
 
     
  //   }

  // }

  const handleOpenFirstJobBusiness = () => {
    console.log("This is updated", )
    onClose()
    setShowAddJobBusiness(!showAddJobBusiness)
  }

  console.log("hmm", jobsInProgressMap)

    
  if (isLoading === true) {
    return (
      <>
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Dashboard />
      <main id="content" class="lg:ps-[260px] pt-[59px]">
       

        <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          <div class="flex justify-between items-center gap-x-5">
            <h2 class="inline-block text-lg font-semibold text-gray-800 ">
            Saved Jobs
            </h2>

            
          </div>
{isDesktop ? (    <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
            {/* <nav
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
               Saved Jobs
              </button>
             
            </nav> */}

            <div class="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
              {/* <div>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                    <svg
                      class="flex-shrink-0 size-4 text-gray-500 "
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    class="py-[7px] px-3 ps-10 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    placeholder="Search projects"
                  />
                </div>
              </div> */}

              <div class="flex justify-end items-center gap-x-2">
            

              
              </div>
            </div>

            <div>
              <div
                id="hs-pro-tabs-dut-all"
                role="tabpanel"
                aria-labelledby="hs-pro-tabs-dut-item-all"
              >
                <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                  <div class="min-w-full inline-block align-middle">
                    <table class="min-w-full divide-y divide-gray-200 ">
                      <thead>
                        <tr class=" divide-x divide-gray-200 ">
                          <th scope="col" class="px-3 py-2.5 text-start"></th>

                          <th scope="col" class="min-w-[250px]">
                            <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                              <button
                                id="hs-pro-dutnms"
                                type="button"
                                class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                                Job Title
                              </button>
                            </div>
                          </th>
                          <th scope="col" class="min-w-24">
                            <div class="hs-dropdown relative inline-flex w-full cursor-default">
                            <button
                                id="hs-pro-dutads"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 cursor-default"
                              >
                                Employer
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
                                Type
                              </button>
                            </div>
                          </th>

                          <th scope="col">
                            <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                              <button
                                id="hs-pro-dutems"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100"
                              >
                                 Posted
                              </button>
                            </div>
                          </th>
                          <th scope="col">
                            <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                              <button
                                id="hs-pro-dutphs"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                               Pay
                              </button>
                            </div>
                          </th>
                          <th scope="col">
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

                    

                      {jobsInProgressMap.map((job) => (

                        <>
                        <tbody class="divide-y divide-gray-200 ">
                          <tr class="divide-x divide-gray-200 ">
                            <td class="size-px whitespace-nowrap px-3 py-4"></td>
                            <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer">
                              <div
                                onClick={() => handlePostedByBusinessToggleOpen(job)}
                                class="w-full flex items-center gap-x-3"
                              >
                                <div class="grow">
                                  <span class="text-sm font-medium text-gray-800 ">
                                    {job.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <div class="w-full flex items-center gap-x-3">
                                {job.employerProfilePicture ? (
                                  <img
                                    class="flex-shrink-0 size-[38px] rounded-full"
                                    src={job.employerProfilePicture
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

                                <span class="text-sm font-medium text-gray-800 ">
                                  {job.companyName}{" "}
                             
                                </span>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              {job.isFullTimePosition === true ? (<span class="text-sm text-gray-600 font-semibold">
                                Full-time
                              </span>) : (<span class="text-sm text-gray-600 font-semibold">
                              Part-time
                              </span>)}
                              
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                            <span class="text-sm text-gray-600 ">
                                {job.datePosted}
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              {job.isSalaried ? ( <span class="text-sm text-gray-600 ">
                              ${job.lowerRate}/year - ${job.upperRate}/year
                               
                              </span>) : (
                                <span class="text-sm text-gray-600 ">
                                ${job.lowerRate}/hr - ${job.upperRate}/hr
                              </span>
                              )}
                             
                            </td>
                            <td class="size-px py-2 px-3 space-x-2">
                              <div className=" flex  w-full ">
                              
                                  <button 
                                onClick={() => handlePostedByBusinessToggleOpen(job)}
                                    className="py-2 px-3  w-full text-sm font-semibold rounded-md border border-transparent bg-sky-400 hover:bg-sky-500 text-white disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                 View
                                  </button>
                             
                              </div>
                            </td>
                          </tr>
                        </tbody>
                          




                        {openInfoWindowMarkerID.locationLat === job.locationLat ? (
                                  <>
                                    <Drawer
                                      onClose={onCloseDrawerSingle}
                                      isOpen={isOpenDrawerSingle}
                                      size={"xl"}
                                    >
                                      <DrawerOverlay />
                                      <DrawerContent>
                                        <DrawerCloseButton />
                                        <DrawerHeader>{job.jobTitle}</DrawerHeader>
                                        <DrawerBody>
                                          <div class="">
                                         
                                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                                              <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                                <div class="p-4">
                                                  <div class=" ">
                                                    <div className="flex">
                                                      <label
                                                        for="hs-pro-dactmt"
                                                        class="block mb-2 text-xl font-medium text-gray-900"
                                                      >
                                                        {job.jobTitle}
                                                      </label>
                        
                                                    
                                                    </div>
                                                    {job.employerProfilePicture ? (
                                                        <>
                                                          <div class="flex flex-col justify-center items-center size-[64px]  ">
                                                            <img
                                                              src={
                                                                job.employerProfilePicture
                                                              }
                                                              class="flex-shrink-0 size-[64px] rounded-full"
                                                              alt="company logo"
                                                            />
                                                          </div>
                                                          <div className="flex flex-col">
                                                              <p class="font-semibold text-xl text-gray-800 cursor-pointer">
                                                                {job.companyName} 
                                                              </p>
                                                            </div>
                                                        </>
                                                      ) : (  <div className="flex flex-col">
                                                        <p class="font-semibold text-xl text-gray-800 cursor-pointer">
                                                          {job.companyName}
                                                        </p>
                                                      </div>)}
                                                    {job.isFullTimePosition ===
                                                    true ? (
                                                      <label
                                                        for="hs-pro-dactmt"
                                                        class="block  text-lg font-medium text-gray-800"
                                                      >
                                                        Full-time
                                                      </label>
                                                    ) : (
                                                      <label
                                                        for="hs-pro-dactmt"
                                                        class="block  text-lg font-medium text-gray-800 "
                                                      >
                                                        Part-time
                                                      </label>
                                                    )}
                        
                                                    {job.isHourly ? (
                                                      <div class="space-y-1 ">
                                                        <div class="flex align-items-center">
                                                          <p className=" text-md font-medium">$</p>
                                                          <label
                                                            for="hs-pro-dactmt"
                                                            class="block text-md font-medium text-gray-800 "
                                                          >
                                                            {job.lowerRate}
                                                          </label>
                                                          <p className=" text-md font-medium">
                                                            /hour - $
                                                          </p>
                                                          <label
                                                            for="hs-pro-dactmt"
                                                            class="block  text-md font-medium text-gray-800 "
                                                          >
                                                            {job.upperRate}
                                                          </label>
                                                          <p className=" text-md font-medium">
                                                            /hour
                                                          </p>
                                                        </div>
                                                      </div>
                                                    ) : null}
                        
                                                    {job.isSalaried ? (
                                                      <div class="space-y-2 ">
                                                        <div class="flex align-items-center">
                                                          <p className=" text-md font-medium">$</p>
                                                          <label
                                                            for="hs-pro-dactmt"
                                                            class="block  text-md font-medium text-gray-800 "
                                                          >
                                                            {job.lowerRate}
                                                          </label>
                                                          <p className="ml-1 text-md font-medium ">
                                                            yearly - $
                                                          </p>
                                                          <label
                                                            for="hs-pro-dactmt"
                                                            class="block  text-md font-medium text-gray-800 "
                                                          >
                                                            {job.upperRate}
                                                          </label>
                                                          <p className=" ml-1 c font-medium">
                                                            yearly
                                                          </p>
                                                          {job.isEstimatedPay ? (
                                                            <p>*</p>
                                                          ) : null}
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                    {job.isEstimatedPay ? (
                                                      <div className="mb-2 flex flex-col w-full text-sm ">
                                                        <a href="https://www.glassdoor.com/index.htm">
                                                          *Estimate. Powered by{" "}
                                                          <img
                                                            src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png"
                                                            title="Job Search"
                                                          />
                                                        </a>
                                                      </div>
                                                    ) : null}
                                                    <p class="block  text-md font-medium text-gray-800 ">
                                                      {job.streetAddress},{" "}
                                                      {job.city},{" "}
                                                      {job.state}
                                                    </p>
                                                    {job.isEstimatedAddress ? (
                                                      <p class="block italic text-sm  text-gray-800 ">
                                                        Address may not be exact
                                                      </p>
                                                    ) : null}
                                                    <p class="font-semibold text-md text-gray-500  cursor-default">
                                                      <span className="font-semibold text-md text-slate-700">
                                                        {" "}
                                                        Posted:
                                                      </span>{" "}
                                                      {job.datePosted}
                                                    </p>
                                                   
                                                   
                                                  </div>
                        
                                                  <div class="space-y-2 mt-10 mb-4 ">
                                                    <label
                                                      for="dactmi"
                                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                                    >
                                                      What you'll be doing
                                                    </label>
                                                    <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                                                      <Markdown>
                                                        {job.description}
                                                      </Markdown>
                                                    </div>
                                                  </div>
                                                  {job.bio ? (
                                                    <div class="space-y-2 mt-10 mb-4">
                                                      <label
                                                        for="dactmi"
                                                        class="block mb-2 text-md font-medium text-gray-800 "
                                                      >
                                                        About {job.companyName}
                                                      </label>
                        
                                                      <div class="mb-4">
                                                        <p>{job.bio}</p>
                                                      </div>
                                                    </div>
                                                  ) : null}
                        
                                                  <div class="space-y-2 mb-4 ">
                                                    <label
                                                      for="dactmi"
                                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                                    >
                                                      Job Requirements
                                                    </label>
                        
                                                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                                                      <Markdown>
                                                        {job.applicantDescription}
                                                      </Markdown>
                                                    </div>
                                                  </div>
                                                  <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                                                    <label
                                                      for="dactmi"
                                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                                    >
                                                      Employment Benefits
                                                    </label>
                        
                                                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                                                      {job.benefitsDescription ? (
                                                        <Markdown>
                                                          {job.benefitsDescription}
                                                        </Markdown>
                                                      ) : (
                                                        <p>Nothing listed</p>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                        
                                                {isDesktop ? (
                                                  <div class="p-4 flex justify-between gap-x-2">
                                                    <div class="w-full flex justify-end items-center gap-x-2">
                                                      {job.jobTitle.includes(
                                                        "Plumber"
                                                      ) ? (
                                                        <button
                                                          type="button"
                                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                          data-hs-overlay="#hs-pro-datm"
                                                        
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-4 ml-1"
                                                          >
                                                            <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                            />
                                                          </svg>
                                                          See career path
                                                        </button>
                                                      ) : null}
                                                      {job.jobTitle.includes(
                                                        "Server" || "server"
                                                      ) ? (
                                                        <button
                                                          type="button"
                                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                          data-hs-overlay="#hs-pro-datm"
                                                        
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-4 ml-1"
                                                          >
                                                            <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                            />
                                                          </svg>
                                                          See career path
                                                        </button>
                                                      ) : null}
                                                      {job.jobTitle.includes(
                                                        "Machinist" || "CNC"
                                                      ) ? (
                                                        <button
                                                          type="button"
                                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                          data-hs-overlay="#hs-pro-datm"
                                                         
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-4 ml-1"
                                                          >
                                                            <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                            />
                                                          </svg>
                                                          See career path
                                                        </button>
                                                      ) : null}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    id="cookies-simple-with-dismiss-button"
                                                    class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-full mx-auto px-2"
                                                  >
                                                    <div class="p-2 bg-white border border-gray-200 rounded-sm shadow-sm ">
                                                      <div class="p-2 flex justify-between gap-x-2">
                                                        <div class="w-full flex justify-center items-center gap-x-2">
                                                          {job.jobTitle.includes(
                                                            "Plumber"
                                                          ) ? (
                                                            <button
                                                              type="button"
                                                              class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200 bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                                              data-hs-overlay="#hs-pro-datm"
                                                              
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="size-4 ml-1"
                                                              >
                                                                <path
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                                />
                                                              </svg>
                                                              See career path
                                                            </button>
                                                          ) : null}
                                                          {job.jobTitle.includes(
                                                            "Server" || "server"
                                                          ) ? (
                                                            <button
                                                              type="button"
                                                              class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                              data-hs-overlay="#hs-pro-datm"
                                                             
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="size-4 ml-1"
                                                              >
                                                                <path
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                                />
                                                              </svg>
                                                              See career path
                                                            </button>
                                                          ) : null}
                                                          {job.jobTitle.includes(
                                                            "Machinist" || "CNC"
                                                          ) ? (
                                                            <button
                                                              type="button"
                                                              class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                                              data-hs-overlay="#hs-pro-datm"
                                                             
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="size-4 ml-1"
                                                              >
                                                                <path
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                                />
                                                              </svg>
                                                              See career path
                                                            </button>
                                                          ) : null}
                                                          <button
                                                            type="button"
                                                            class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                            data-hs-overlay="#hs-pro-datm"
                                                            onClick={() =>
                                                             onOpen()
                                                            }
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
                                          </div>
                                        </DrawerBody>
                                        <DrawerFooter>
                                          <button
                                            type="button"
                                            class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-red-500 hover:text-red-600  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                            data-hs-overlay="#hs-pro-datm"
                                            onClick={() => deleteSavedJob(job)}
                                          >
                                           
                                            Remove 
                                          </button>
                                          <button
                                            type="button"
                                            class="py-3 px-8 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                            data-hs-overlay="#hs-pro-datm"
                                            onClick={() => applyAndNavigate(job)}
                                          >
                                            Apply
                                          </button>
                                        </DrawerFooter>
                                      </DrawerContent>
                                    </Drawer>
                        
                                 
                                  </>
                                ) : null}




                        
                              </>
                             
                      ))}
                      
                    </table>
                    {!postedJobs.length && !jobsInProgressMap.length && !jobsInReviewMap.length ? (
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
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
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
                            <p class="mt-2 font-medium text-gray-800 ">
                              Nothing here
                            </p>
                            <p class="mb-5 text-sm text-gray-500 "></p>
                       
                          </div>
                        </div>
                         ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>) : (    <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
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
                Active Posts
              </button>
              <button
                type="button"
                class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none  "
                id="hs-pro-tabs-dut-item-validaccounts"
                data-hs-tab="#hs-pro-tabs-dut-validaccounts"
                aria-controls="hs-pro-tabs-dut-validaccounts"
                role="tab"
                onClick={() => console.log("modal no jobs completed yet!")}
              >
                Past Posts
              </button>
            </nav>

            <div class="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
              <div>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                    <svg
                      class="flex-shrink-0 size-4 text-gray-500 "
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    class="py-[7px] px-3 ps-10 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    placeholder="Search projects"
                  />
                </div>
              </div>

              <div class="flex justify-end items-center gap-x-2">
            

              
              </div>
            </div>

            <div>
              <div
                id="hs-pro-tabs-dut-all"
                role="tabpanel"
                aria-labelledby="hs-pro-tabs-dut-item-all"
              >
                <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                  <div class=" inline-block align-middle">
                    <table class="divide-y divide-gray-200 ">
                      <thead>
                        <tr class="border-t border-gray-200 divide-x divide-gray-200 ">
                          <th scope="col" class="px-3 py-2.5 text-start"></th>

                          <th scope="col" class="">
                            <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                              <button
                                id="hs-pro-dutnms"
                                type="button"
                                class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                                Post Title
                              </button>
                            </div>
                          </th>
                          <th scope="col" class="">
                            <div class="hs-dropdown relative inline-flex w-full cursor-default">
                              <button
                                id="hs-pro-dutads"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                                Hired
                              </button>
                            </div>
                          </th>

                          <th scope="col" class="">
                            <div class="hs-dropdown relative inline-flex w-full cursor-default">
                              <button
                                id="hs-pro-dutads"
                                type="button"
                                class="px-3 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                                Applicants 
                              </button>
                            </div>
                          </th>

                          <th scope="col" class="">
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

                          <th scope="col">
                            <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                              <button
                                id="hs-pro-dutems"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100"
                              >
                                Date Posted
                              </button>
                            </div>
                          </th>

                          <th scope="col">
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

                      {postedJobs.map((job) => (
                        <tbody class="divide-y divide-gray-200 ">
                          <tr class="divide-x divide-gray-200 ">
                            <td class="size-px whitespace-nowrap px-3 py-4"></td>
                            <td
                              class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer"
                              onClick={() =>handleStoreAndNavigateSaved(job)}
                            >
                              <div class="w-full flex items-center gap-x-3">
                                <div class="grow">
                                  <span class="text-sm font-medium text-gray-800 ">
                                    {job.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 font-semibold">
                                n/a
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              {job.totalApplicants ? (
                                <span class="text-sm text-gray-600 ">
                                  {job.totalApplicants}
                                </span>
                              ) : (
                                <span class="text-sm text-gray-600 ">0</span>
                              )}
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
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
                                Posted
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 ">
                                {job.datePosted}
                              </span>
                            </td>
                            <td class="size-px py-2 px-3 space-x-2">
                              <div className=" flex  w-full ">
                                {job.hasNewApplicant || job.hasUnreadMessage ? (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateSaved(job)
                                    }
                                    className="py-2 px-3 w-full   relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 "
                                  >
                                    View applicants
                                    <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                      {job.totalApplicants}
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateSaved(job)
                                    }
                                    className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                    View applicants
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ))}

                      {jobsInProgressMap.map((job) => (
                        <tbody class="divide-y divide-gray-200 ">
                          <tr class="divide-x divide-gray-200 ">
                            <td class="size-px whitespace-nowrap px-3 py-4"></td>
                            <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer">
                              <div
                                onClick={() => handleStoreAndNavigateSaved(job)}
                                class="w-full flex items-center gap-x-3"
                              >
                                <div class="grow">
                                  <span class="text-sm font-medium text-gray-800 ">
                                    {job.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <div class="w-full flex items-center gap-x-3">
                                {job.hiredApplicantProfilePicture ? (
                                  <img
                                    class="flex-shrink-0 size-[38px] rounded-full"
                                    src={job.hiredApplicantProfilePicture}
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

                                <span class="text-sm font-medium text-gray-800 ">
                                  {job.hiredApplicantFirstName}{" "}
                                  {job.hiredApplicantLastName}
                                </span>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 font-semibold">
                                n/a
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
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
                                In Progress
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 ">
                                {job.datePosted}
                              </span>
                            </td>
                            <td class="size-px py-2 px-3 space-x-2">
                              <div className=" flex  w-full ">
                                {job.hasNewNotification ? (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateSaved(job)
                                    }
                                    className="py-2 px-3  w-full relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                    Messages
                                    <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                      1
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateSaved(job)
                                    }
                                    className="py-2 px-3  w-full text-sm font-semibold rounded-md border border-transparent bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                    Message
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                      {jobsInReviewMap.map((job) => (
                        <tbody class="divide-y divide-gray-200 ">
                          <tr class="divide-x divide-gray-200 ">
                            <td class="size-px whitespace-nowrap px-3 py-4"></td>
                            <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer">
                              <div
                                onClick={() =>
                                  handleStoreAndNavigateInReview(job)
                                }
                                class="w-full flex items-center gap-x-3"
                              >
                                <div class="grow">
                                  <span class="text-sm font-medium text-gray-800 ">
                                    {job.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 ">
                                {job.hiredApplicantFirstName}{" "}
                                {job.hiredApplicantLastName}
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600  font-semibold ">
                                n/a
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-blue-600 text-white rounded-full">
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
                                Ready To Pay
                              </span>
                            </td>
                            <td class="size-px whitespace-nowrap px-4 py-1">
                              <span class="text-sm text-gray-600 ">
                                {job.datePosted}
                              </span>
                            </td>
                            <td class="size-px  py-2 px-3 space-x-2">
                              <div className=" flex  w-full ">
                                {job.hasNewNotification ? (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateInReview(job)
                                    }
                                    className="py-2 px-3  w-full relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                  Mark Complete
                                    <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                      !
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateInReview(job)
                                    }
                                    className="py-2 px-3  w-full text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                   Mark Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ))}

                      
                    </table>
                    {!postedJobs.length && !jobsInProgressMap.length && !jobsInReviewMap.length ? (
                    <div class="p-5  flex flex-col justify-center items-center text-center">
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
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
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
                            <p class="mt-2 font-medium text-gray-800 ">
                              Nothing here
                            </p>
                            <p class="mb-5 text-sm text-gray-500 "></p>
                            {currentUser ? (currentUser.isBusiness ? ( <a
                class="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowAddJobBusiness(!showAddJobBusiness)}
              >
                <svg
                  class="hidden sm:block flex-shrink-0 size-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
                  />
                </svg>
                Create Post
              </a>) : ( <a
                class="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowAddJob(!showAddJob)}
              >
                <svg
                  class="hidden sm:block flex-shrink-0 size-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
                  />
                </svg>
                Create Job
              </a>)) : <div class="flex animate-pulse">
  <div class="flex-shrink-0">
    <span class="py-2 px-3 w-[120px] h-[40px] rounded-md items-cente block bg-gray-200  "></span>
  </div>

  
</div>}
                          </div>
                        </div>
                         ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      
        </div>
      </main>
  
      <Modal isOpen={isOpenNoResume} onClose={onCloseNoResume}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete your profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please upload a resume to your profile before applying for open
              positions
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => navigate("/UserProfile")}
            >
              Upload my resume
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Application submitted.</Text>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => onClose()}
            >
              close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerSavedJobs;
