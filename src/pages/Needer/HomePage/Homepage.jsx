import React from "react";
import { useState, useEffect } from "react";
import Dashboard from "../Components/Dashboard";
import Header from "../Components/Header";
import AddJobModal from "../Components/AddJobModal";
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
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "./lib/jobsStoreDashboard";
import { useMediaQuery } from "@chakra-ui/react";
import { useUserStore } from "../Chat/lib/userStore";
import AddJobBusiness from "../Components/AddJobBusiness";
import {
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
  Button,
  Text
} from "@chakra-ui/react";
import SubscriptionModal from "../Components/SubscriptionModal";

import { addJobStore } from "./lib/addJobStore";
import ScreeningQuestions from "../Components/screening_questions/ScreeningQuestions";

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const navigate = useNavigate();
  const { fetchJobInfo, setJobHiringState } = useJobStore();
  const { fetchUserInfo, currentUser } = useUserStore();
  const { jobHeld, addJobInfo } = addJobStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenCarWash, onOpen: onOpenCarWash, onClose: onCloseCarWash } = useDisclosure();

  const { isOpen: isOpenTOS, onOpen: onOpenTOS, onClose: onCloseTOS } = useDisclosure();
  const { isOpen: isOpenPP, onOpen: onOpenPP, onClose: onClosePP } = useDisclosure();

  console.log("here is job held", jobHeld);

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const [termsOfService, setTermsOfService] = useState(false)


  const submitCarWashTOS = () => {
    
    updateDoc(doc(db, "employers", user.uid), {
     termsOfService: termsOfService
    })
      //depreciated, remove when able
    
      //in use
    
      .then(() => {
        //all good
        onCloseCarWash()
        console.log("data submitted, new chat profile created");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  }


//   useEffect(() => {
    
// if (currentUser.email === "eleto@mistercarwash.com" & currentUser.termsOfService === false){

//   onOpenCarWash()
// }
//   }, [])

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
        fetchUserInfo(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const submitJob = () => {
    addNewJob();
    addJobMap();
    addJobGlobal();
  };

  const addNewJob = () => {
    const dbRef = collection(
      db,
      "employers",
      jobHeld.employerID,
      "Posted Jobs",
      jobHeld.jobTitle,
      "Applicants"
    );
    const placeholderApplicant = { placeholder: "applicant" };

    //submit data
    setDoc(
      doc(db, "employers", jobHeld.employerID, "Posted Jobs", jobHeld.jobTitle),
      {
        companyName: jobHeld.companyName,
        isSalaried: jobHeld.isSalaried,
        applicantDescription: jobHeld.applicantDescription,
        benefitsDescription: jobHeld.benefitsDescription
          ? jobHeld.benefitsDescription
          : null,
        isFullTimePosition: jobHeld.isFullTimePosition,
        employerID: jobHeld.employerID,
        employerEmail: jobHeld.employerEmail,
        employerFirstName: jobHeld.employerFirstName,
        employerLastName: jobHeld.employerLastName,
        employerProfilePicture: jobHeld.employerProfilePicture,
        jobTitle: jobHeld.jobTitle,
        jobID: jobHeld.jobID,
        firstName: jobHeld.firstName,
        lowerRate: jobHeld.lowerRate,
        upperRate: jobHeld.upperRate,
        isVolunteer: jobHeld.isVolunteer,
        isOneTime: jobHeld.isOneTime,
        isSalaried: jobHeld.isSalaried,
        flatRate: jobHeld.flatRate,
        isHourly: jobHeld.isHourly,
        lowerCaseJobTitle: jobHeld.lowerCaseJobTitle,
        datePosted: jobHeld.datePosted,
        category: jobHeld.category,
        city: jobHeld.city,
        streetAddress: jobHeld.streetAddress,
        state: jobHeld.state,
        zipCode: jobHeld.zipCode,
        locationLat: jobHeld.locationLat,
        locationLng: jobHeld.locationLng,
        description: jobHeld.description,
        requirements: jobHeld.requirements,
        requirements2: jobHeld.requirements2,
        requirements3: jobHeld.requirements3,
        niceToHave: jobHeld.niceToHave,
      }
    )
      .then(() => {
        addDoc(dbRef, placeholderApplicant);
        console.log("data submitted employers");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  const addJobGlobal = () => {
    //submit data
    setDoc(
      doc(db, "Jobs", jobHeld.employerID, "Posted Jobs", jobHeld.jobTitle),
      {
        companyName: jobHeld.companyName,
        isSalaried: jobHeld.isSalaried,
        applicantDescription: jobHeld.applicantDescription,
        benefitsDescription: jobHeld.benefitsDescription
          ? jobHeld.benefitsDescription
          : null,
        isFullTimePosition: jobHeld.isFullTimePosition,
        employerID: jobHeld.employerID,
        employerEmail: jobHeld.employerEmail,
        employerFirstName: jobHeld.employerFirstName,
        employerLastName: jobHeld.employerLastName,
        employerProfilePicture: jobHeld.employerProfilePicture,
        jobTitle: jobHeld.jobTitle,
        jobID: jobHeld.jobID,
        firstName: jobHeld.firstName,
        lowerRate: jobHeld.lowerRate,
        upperRate: jobHeld.upperRate,
        isVolunteer: jobHeld.isVolunteer,
        isOneTime: jobHeld.isOneTime,
        isSalaried: jobHeld.isSalaried,
        flatRate: jobHeld.flatRate,
        isHourly: jobHeld.isHourly,
        lowerCaseJobTitle: jobHeld.lowerCaseJobTitle,
        datePosted: jobHeld.datePosted,
        category: jobHeld.category,
        city: jobHeld.city,
        streetAddress: jobHeld.streetAddress,
        state: jobHeld.state,
        zipCode: jobHeld.zipCode,
        locationLat: jobHeld.locationLat,
        locationLng: jobHeld.locationLng,
        description: jobHeld.description,
        requirements: jobHeld.requirements,
        requirements2: jobHeld.requirements2,
        requirements3: jobHeld.requirements3,
        niceToHave: jobHeld.niceToHave,
      }
    )
      .then(() => {
        //all good
        console.log("data submitted global");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    //submit data
    setDoc(doc(db, "All Jobs", jobHeld.jobID), {
      companyName: jobHeld.companyName,
      isSalaried: jobHeld.isSalaried,
      applicantDescription: jobHeld.applicantDescription,
      benefitsDescription: jobHeld.benefitsDescription
        ? jobHeld.benefitsDescription
        : null,
      isFullTimePosition: jobHeld.isFullTimePosition,
      employerID: jobHeld.employerID,
      employerEmail: jobHeld.employerEmail,
      employerFirstName: jobHeld.employerFirstName,
      employerLastName: jobHeld.employerLastName,
      employerProfilePicture: jobHeld.employerProfilePicture,
      jobTitle: jobHeld.jobTitle,
      jobID: jobHeld.jobID,
      firstName: jobHeld.firstName,
      lowerRate: jobHeld.lowerRate,
      upperRate: jobHeld.upperRate,
      isVolunteer: jobHeld.isVolunteer,
      isOneTime: jobHeld.isOneTime,
      isSalaried: jobHeld.isSalaried,
      flatRate: jobHeld.flatRate,
      isHourly: jobHeld.isHourly,
      lowerCaseJobTitle: jobHeld.lowerCaseJobTitle,
      datePosted: jobHeld.datePosted,
      category: jobHeld.category,
      city: jobHeld.city,
      streetAddress: jobHeld.streetAddress,
      state: jobHeld.state,
      zipCode: jobHeld.zipCode,
      locationLat: jobHeld.locationLat,
      locationLng: jobHeld.locationLng,
      description: jobHeld.description,
      requirements: jobHeld.requirements,
      requirements2: jobHeld.requirements2,
      requirements3: jobHeld.requirements3,
      niceToHave: jobHeld.niceToHave,
    })
      .then(() => {
        //all good
        console.log("submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    // setShowAddJob(!showAddJob)
  };

  const addJobMap = () => {
    //submit data
    setDoc(doc(db, "Map Jobs", jobHeld.jobID), {
      companyName: jobHeld.companyName,
      isPostedByBusiness: true,
      isSalaried: jobHeld.isSalaried,
      applicantDescription: jobHeld.applicantDescription,
      benefitsDescription: jobHeld.benefitsDescription
        ? jobHeld.benefitsDescription
        : null,
      isFullTimePosition: jobHeld.isFullTimePosition,
      employerID: jobHeld.employerID,
      employerEmail: jobHeld.employerEmail,
      employerFirstName: jobHeld.employerFirstName,
      employerLastName: jobHeld.employerLastName,
      employerProfilePicture: jobHeld.employerProfilePicture,
      jobTitle: jobHeld.jobTitle,
      jobID: jobHeld.jobID,
      firstName: jobHeld.firstName,
      lowerRate: jobHeld.lowerRate,
      upperRate: jobHeld.upperRate,
      isVolunteer: jobHeld.isVolunteer,
      isOneTime: jobHeld.isOneTime,
      // isOneTime: isOneTime,

      flatRate: jobHeld.flatRate,
      isHourly: jobHeld.isHourly,
      lowerCaseJobTitle: jobHeld.lowerCaseJobTitle,
      datePosted: jobHeld.datePosted,
      category: jobHeld.category,
      city: jobHeld.city,
      streetAddress: jobHeld.streetAddress,
      state: jobHeld.state,
      zipCode: jobHeld.zipCode,
      locationLat: jobHeld.locationLat,
      locationLng: jobHeld.locationLng,
      description: jobHeld.description,
      requirements: jobHeld.requirements,
      requirements2: jobHeld.requirements2,
      requirements3: jobHeld.requirements3,
      niceToHave: jobHeld.niceToHave,
    })
      .then(() => {
        //all good
        console.log("data submitted for Maps");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    setDoc(doc(db, "Map Jobs Paid", jobHeld.jobID), {
      companyName: jobHeld.companyName,
      isPostedByBusiness: true,
      isSalaried: jobHeld.isSalaried,
      applicantDescription: jobHeld.applicantDescription,
      benefitsDescription: jobHeld.benefitsDescription
        ? jobHeld.benefitsDescription
        : null,
      isFullTimePosition: jobHeld.isFullTimePosition,
      employerID: jobHeld.employerID,
      employerEmail: jobHeld.employerEmail,
      jobTitle: jobHeld.jobTitle,
      jobID: jobHeld.jobID,
      firstName: jobHeld.firstName,
      lowerRate: jobHeld.lowerRate,
      upperRate: jobHeld.upperRate,
      isVolunteer: jobHeld.isVolunteer,
      isOneTime: jobHeld.isOneTime,
      // isOneTime: isOneTime,
      isSalaried: jobHeld.isSalaried,
      flatRate: jobHeld.flatRate,
      isHourly: jobHeld.isHourly,
      lowerCaseJobTitle: jobHeld.lowerCaseJobTitle,
      datePosted: jobHeld.datePosted,
      category: jobHeld.category,
      city: jobHeld.city,
      streetAddress: jobHeld.streetAddress,
      state: jobHeld.state,
      zipCode: jobHeld.zipCode,
      locationLat: jobHeld.locationLat,
      locationLng: jobHeld.locationLng,
      description: jobHeld.description,
      requirements: jobHeld.requirements,
      requirements2: jobHeld.requirements2,
      requirements3: jobHeld.requirements3,
      niceToHave: jobHeld.niceToHave,
    })
      .then(() => {
        //all good
        console.log("data submitted for Maps");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
    //adds to paid only db for map
  };

  // useEffect(() => {
  //   if (jobHeld !== null && user !== null) {
  //     submitJob()
  //     onOpen()
  //     addJobInfo(null)
  //   }

  // },[jobHeld, user])

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
          setLoading(false);
        } else {
          setPostedJobs(results);
          setLoading(false);
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
        collection(db, "employers", user.uid, "Jobs In Progress")
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

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "In Review"));

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
          setJobsInReviewMap(results);
          console.log("in review", results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //   console.log(jobsInReview);

  const [showAddJob, setShowAddJob] = useState(false);

  const handleStoreAndNavigatePosted = (x) => {
    console.log(x.jobTitle, x.jobID);

    fetchJobInfo(user.uid, x.jobID, "Posted Jobs", x.jobTitle);
    if (x.hasNewApplicant === true) {
      updateDoc(doc(db, "employers", user.uid, "Posted Jobs", x.jobTitle), {
        hasNewApplicant: false,
      })
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
          console.log(error);
        });
    }

    //unsure why this setTimeout was here. It was 500 ms before, but changed to 0 and everything seems to be just fine. Idk man.
    setTimeout(() => navigate("/JobDetails"), 0);
  };

  const handleStoreAndNavigateHired = (x) => {
    console.log(x.jobTitle, x.jobID);
    fetchJobInfo(user.uid, x.jobID, "Jobs In Progress", x.jobTitle);
    if (x.hasNewNotification === true) {
      updateDoc(
        doc(db, "employers", user.uid, "Jobs In Progress", x.jobTitle),
        {
          hasNewNotification: false,
        }
      )
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
          console.log(error);
        });
    }
    //set store info... uid, jobTitle, jobID,.

    setTimeout(() => navigate("/JobDetailsHired"), 500);
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

  const [isLoading, setIsLoading] = useState(false);

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
    console.log("updated as premium");
    updateDoc(doc(db, "employers", user.uid), {
      isPremium: true,
    });
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    console.log("new update outer");

    console.log("test");
    if (sessionId && user !== null && currentUser !== null) {
      console.log("test 2");
      if (!currentUser.isPremium) {
        console.log("new update inner");
        setHasRun(false);
        fetch(
          `https://fulfil-api.onrender.com/business-subscription-session-status?session_id=${sessionId}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "complete") {
              console.log(data.status);
              console.log(user.uid);
              updateDoc(doc(db, "employers", user.uid), {
                isPremium: true,
              }).catch((error) => console.log(error));
              fetchUserInfo(user.uid);

              onOpen();

              //set user as premium
            } else {
              alert(
                "There was an error processing your payment. Please try again later."
              );
              // addJobInfo(null)
            }
          });
      } else {
      }
    } else {
    }
  }, [user, currentUser]);

  //business logic

  const [showAddJobBusiness, setShowAddJobBusiness] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [checkIfPremiumLoading, setCheckIfPremiumLoading] = useState(false);

  //credit Jessie Rohrer Oct 30, 2021 https://dev.to/jrrohrer/rendering-a-react-modal-from-another-component-2omn for the hoisting function to have a child component be able to communicate back witha parent component.
  const toggleModal = () => {
    setShowAddJobBusiness(!showAddJobBusiness);
  };

  const checkIfPremium = () => {
    if (currentUser.isPremium === true) {
      setShowAddJobBusiness(!showAddJobBusiness);
      console.log("is premium", showAddJobBusiness);
    } else {
      // setCheckIfPremiumLoading(true)
      const docRef = doc(db, "employers", currentUser.uid);

      getDoc(docRef).then((snapshot) => {
        if (snapshot.data().isPremium === true) {
          setShowAddJobBusiness(!showAddJobBusiness);
          setCheckIfPremiumLoading(false);
        } else {
          setShowSubscriptionModal(!showSubscriptionModal);
          setCheckIfPremiumLoading(false);
        }
        setCheckIfPremiumLoading(false);
      });
    }
  };

  const handleOpenFirstJobBusiness = () => {
    console.log("This is updated");
    setCheckIfPremiumLoading(false);
    onClose();
    setShowAddJobBusiness(!showAddJobBusiness);
  };

  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div>
        <Header />
        <Dashboard />
        <main id="content" class="lg:ps-[260px] pt-[59px]">
          <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
            <div class="flex justify-between items-center gap-x-5">
              <h2 class="inline-block text-lg font-semibold text-gray-800 ">
                My Dashboard
              </h2>

              <div class="flex justify-end items-center gap-x-2">
                <a
                  class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // onClick={() => checkIfPremium()}
                >
                  <>
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
                    Create Job Listing
                  </>
                </a>
              </div>
            </div>
            <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
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
                  My Listings
                </button>
              </nav>

              <div>
                <Center>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </Center>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  //   if (loading) {
  //     return (
  //       <div>
  //         <Header />
  //         <Dashboard />
  //         <main id="content" class="lg:ps-[260px] pt-[59px]">
  //         <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
  //           <div class="flex justify-between items-center gap-x-5">
  //             <h2 class="inline-block text-lg font-semibold text-gray-800 ">
  //               My Dashboard
  //             </h2>

  //             <div class="flex justify-end items-center gap-x-2">

  //                   <a
  //                     class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                     // onClick={() => checkIfPremium()}
  //                   >

  //                       <>
  //                         <svg
  //                           class="hidden sm:block flex-shrink-0 size-3"
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="16"
  //                           height="16"
  //                           fill="currentColor"
  //                           viewBox="0 0 16 16"
  //                         >
  //                           <path
  //                             fill-rule="evenodd"
  //                             clip-rule="evenodd"
  //                             d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
  //                           />
  //                         </svg>
  //                         Create Job Listing
  //                       </>

  //                   </a>

  //             </div>
  //           </div>
  //           <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
  //               <nav
  //                 class="relative  flex space-x-1 after:absolute after:bottom-0 after:inset-x-0 after:border-b-2 after:border-gray-200 "
  //                 aria-label="Tabs"
  //                 role="tablist"
  //               >
  //                 <button
  //                   type="button"
  //                   class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none  active"
  //                   id="hs-pro-tabs-dut-item-all"
  //                   data-hs-tab="#hs-pro-tabs-dut-all"
  //                   aria-controls="hs-pro-tabs-dut-all"
  //                   role="tab"
  //                 >
  //                   My Listings
  //                 </button>

  //               </nav>

  //               <div>

  //               <div class="flex animate-pulse">

  //   <div class="ms-4 w-full">

  //     <ul class="mt-5 space-y-3">
  //       <li class="w-full h-10 bg-gray-200 rounded-full "></li>
  //       <li class="w-full h-10 bg-gray-200 rounded-full "></li>
  //       <li class="w-full h-10 bg-gray-200 rounded-full "></li>
  //       <li class="w-full h-10 bg-gray-200 rounded-full "></li>
  //       <li class="w-full h-10 bg-gray-200 rounded-full"></li>
  //     </ul>
  //   </div>
  // </div>
  //               </div>
  //               </div>
  //       </div>
  //       </main>

  //       </div>

  //     );
  //   }

  return (
    <>
      <Header />
      <Dashboard />
      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          <div class="flex justify-between items-center gap-x-5">
            <h2 class="inline-block text-lg font-semibold text-gray-800 ">
              My Dashboard
            </h2>

            <div class="flex justify-end items-center gap-x-2">
              {currentUser ? (
                currentUser.isBusiness ? (
                  <a
                    class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => checkIfPremium()}
                  >
                    {checkIfPremiumLoading === true ? (
                      <div
                        class="animate-spin inline-block size-5 border-[3px] border-current border-t-transparent text-white rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
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
                        Create Job Listing
                      </>
                    )}
                  </a>
                ) : (
                  <a
                    class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2  font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Create Job Listing
                  </a>
                )
              ) : (
                <div class="flex animate-pulse">
                  <div class="flex-shrink-0">
                    <span class="py-2 px-3 w-[120px] h-[40px] rounded-md items-cente block bg-gray-200  "></span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {isDesktop ? (
            <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
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
                  My Listings
                </button>
                {/* <button
                type="button"
                class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none  "
                id="hs-pro-tabs-dut-item-validaccounts"
                data-hs-tab="#hs-pro-tabs-dut-validaccounts"
                aria-controls="hs-pro-tabs-dut-validaccounts"
                role="tab"
                onClick={() => console.log("modal no jobs completed yet!")}
              >
                Past Posts
              </button> */}
              </nav>

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

                <div class="flex justify-end items-center gap-x-2"></div>
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
                          <tr class="border-t border-gray-200 divide-x divide-gray-200 ">
                            <th scope="col" class="px-3 py-2.5 text-start"></th>

                            <th scope="col" class="min-w-[250px]">
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
                            <th scope="col" class="min-w-24">
                              <div class="hs-dropdown relative inline-flex w-full cursor-default">
                                {currentUser ? (
                                  currentUser.isBusiness ? (
                                    <button
                                      id="hs-pro-dutads"
                                      type="button"
                                      class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 cursor-default"
                                    >
                                      Views
                                    </button>
                                  ) : (
                                    <button
                                      id="hs-pro-dutads"
                                      type="button"
                                      class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 cursor-default"
                                    >
                                      Hired
                                    </button>
                                  )
                                ) : null}
                              </div>
                            </th>

                            <th scope="col" class="min-w-24">
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
                                onClick={() =>
                                  handleStoreAndNavigatePosted(job)
                                }
                              >
                                <div class="w-full flex items-center gap-x-3">
                                  <div class="grow">
                                    <span class="text-sm font-medium text-gray-800 ">
                                      {job.jobTitle}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {currentUser ? (
                                currentUser.isBusiness ? (
                                  <td class="size-px whitespace-nowrap px-4 py-1">
                                    <span class="text-sm text-gray-600 ">
                                      {job.totalViews ? (
                                        <p>{job.totalViews}</p>
                                      ) : (
                                        <p>0</p>
                                      )}
                                    </span>
                                  </td>
                                ) : (
                                  <td class="size-px whitespace-nowrap px-4 py-1">
                                    <span class="text-sm text-gray-600 ">
                                      n/a
                                    </span>
                                  </td>
                                )
                              ) : null}

                              <td class="size-px whitespace-nowrap px-4 py-1">
                                {job.totalApplicants ? (
                                  <span class="text-sm text-gray-600 ">
                                    {job.totalApplicants}
                                  </span>
                                ) : (
                                  <span class="text-sm text-gray-600 ">0</span>
                                )}
                              </td>
                              {job.isActive ? (
                                <td class="size-px whitespace-nowrap px-4 py-1">
                                  <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
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
                                </td>
                              ) : (
                                <td class="size-px whitespace-nowrap px-4 py-1">
                                  <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
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
                                </td>
                              )}

                              <td class="size-px whitespace-nowrap px-4 py-1">
                                <span class="text-sm text-gray-600 ">
                                  {job.datePosted}
                                </span>
                              </td>
                              <td class="size-px py-2 px-3 space-x-2">
                                <div className=" flex  w-full ">
                                  {job.hasNewApplicant ||
                                  job.hasUnreadMessage ? (
                                    <button
                                      onClick={() =>
                                        handleStoreAndNavigatePosted(job)
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
                                        handleStoreAndNavigatePosted(job)
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
                                  onClick={() =>
                                    handleStoreAndNavigateHired(job)
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
                                        handleStoreAndNavigateHired(job)
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
                                        handleStoreAndNavigateHired(job)
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
                                  Ready To Complete
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
                      {!postedJobs.length &&
                      !jobsInProgressMap.length &&
                      !jobsInReviewMap.length ? (
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
                            {currentUser ? (
                              currentUser.isBusiness ? (
                                <a
                                  class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onClick={() => checkIfPremium()}
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
                                  Create Job Listing
                                </a>
                              ) : (
                                <a
                                  class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                  Create Job Listing
                                </a>
                              )
                            ) : (
                              <div class="flex animate-pulse">
                                <div class="flex-shrink-0">
                                  <span class="py-2 px-3 w-[120px] h-[40px] rounded-md items-cente block bg-gray-200  "></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl ">
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

                <div class="flex justify-end items-center gap-x-2"></div>
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
                                onClick={() =>
                                  handleStoreAndNavigatePosted(job)
                                }
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
                              {job.isActive ? (
                                <td class="size-px whitespace-nowrap px-4 py-1">
                                  <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
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
                                </td>
                              ) : (
                                <td class="size-px whitespace-nowrap px-4 py-1">
                                  <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
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
                                </td>
                              )}

                              <td class="size-px whitespace-nowrap px-4 py-1">
                                <span class="text-sm text-gray-600 ">
                                  {job.datePosted}
                                </span>
                              </td>
                              <td class="size-px py-2 px-3 space-x-2">
                                <div className=" flex  w-full ">
                                  {job.hasNewApplicant ||
                                  job.hasUnreadMessage ? (
                                    <button
                                      onClick={() =>
                                        handleStoreAndNavigatePosted(job)
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
                                        handleStoreAndNavigatePosted(job)
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
                                  onClick={() =>
                                    handleStoreAndNavigateHired(job)
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
                                        handleStoreAndNavigateHired(job)
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
                                        handleStoreAndNavigateHired(job)
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
                      {!postedJobs.length &&
                      !jobsInProgressMap.length &&
                      !jobsInReviewMap.length ? (
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
                            {currentUser ? (
                              currentUser.isBusiness ? (
                                <a
                                  class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2  font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onClick={() =>
                                    setShowAddJobBusiness(!showAddJobBusiness)
                                  }
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
                                  Create Job Listing
                                </a>
                              ) : (
                                <a
                                  class="cursor-pointer py-2.5 px-3 inline-flex items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                  Create Job Listing
                                </a>
                              )
                            ) : (
                              <div class="flex animate-pulse">
                                <div class="flex-shrink-0">
                                  <span class="py-2 px-3 w-[120px] h-[40px] rounded-md items-cente block bg-gray-200  "></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {showAddJob ? <AddJobModal /> : null}
      {/* {showAddJobBusiness ? <AddJobBusiness /> : null} */}
      <AddJobBusiness modalOpen={showAddJobBusiness} toggle={toggleModal} />
      {/* {showAddScreeningQuestions ? <ScreeningQuestions /> : null} */}
      {showSubscriptionModal ? <SubscriptionModal /> : null}

      <Modal isOpen={isOpenCarWash} onClose={onCloseCarWash}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Fulfil!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              We have just a few things to take care of before we get started.
              <div className="relative flex gap-x-3 mt-2">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      onChange={(e) => setTermsOfService(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label  className="font-medium text-gray-900" >
                    I am over 18 years of age and I have read and agree to the <span class="text-sky-400" onClick={() => onOpenTOS()}>Terms of Service</span>, the  <span class="text-sky-400" onClick={() => onOpenPP()} > Privacy Policy</span>
                    </label>
                   
                  </div>
                </div>
            </p>
          </ModalBody>

          <ModalFooter>
              <button
              type="button"
              class="py-2.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => submitCarWashTOS()}
            >
              Confirm
            </button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              You can now post your open positions and interview candidates.
            </p>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              class="py-2.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => handleOpenFirstJobBusiness()}
            >
              Create Job Listing
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenPP} onClose={onClosePP} size="xl">
                <ModalOverlay />
                <ModalContent height="66vh">
                  <ModalHeader fontSize="16px">Privacy Policy</ModalHeader>
                  <ModalCloseButton />
              <ModalBody overflowY="scroll">
              <Text marginTop="8">
            Last Updated: [07/28/23] FULFIL INC. PRIVACY POLICY This policy
            explains our information practices, defines your privacy options and
            describes how your information is collected and used. This policy
            covers the websites and the various mobile, web and desktop
            applications (collectively the “Applications”) made available by
            FULFIL Inc. (“FULFIL”). The FULFIL Website and the Applications are
            owned and operated by FULFIL, a company organized under the laws of
            Minnesota. Should you have privacy questions or concerns, send an
            email to fulfilhelp@gmail.com. By using or visiting the FULFIL
            Website or using the Applications, you agree to the collection and
            use of information in the manner described in this policy. If we
            make material changes to this policy, we will notify you by email,
            by means of a notice the next time you log in to the FULFIL Website,
            by means of a notice on the FULFIL Website homepage or when you next
            activate the Application. Such revisions and additions shall be
            effective immediately upon notice. You are responsible for reviewing
            the FULFIL Website or Applications periodically for any modification
            to this policy. Any access or use of the FULFIL Website or
            Applications by you after notice of modifications to this policy
            shall constitute and be deemed to be your agreement to such
            modifications. THE INFORMATION WE COLLECT This policy applies to all
            information collected on the FULFIL Website, any information you
            provide to FULFIL and any information that results from your use of
            Applications. You will most likely provide us personal information
            to us when you register as a user of FULFIL Website, license and
            then use the Applications or participate in certain FULFIL
            promotions or events. The personal information we may collect might
            include passwords, user names, addresses, email addresses, phone
            numbers, bank information and credit/debit card numbers. THE
            APPLICATIONS Use of the Applications is subject to the terms and
            conditions of the Application Terms of Use. BLOGS AND PRODUCT
            REVIEWS The FULFIL Website or Applications may include blogs,
            product reviews or other message areas that allow users to post or
            send information to the FULFIL Website or the Applications. When you
            post information to the FULFIL Website or Applications, others can
            also view that information. We urge you to exercise caution when
            providing personally identifiable information to FULFIL, FULFIL
            Website or the Applications. OUR COLLECTION OF YOUR DATA In addition
            to the personal information you supply, we may collect certain
            information to (1) evaluate how visitors, guests, and customers use
            the FULFIL Website or the Applications; or (2) provide you with
            personalized information or offers. We collect data to make the
            FULFIL Website and Applications work better for you in the following
            ways: to improve the design of the FULFIL Website and Applications,
            to provide personalization on the FULFIL Website and Applications
            and to evaluate the performance of our marketing programs. The
            technologies we may use to gather this non- personal information may
            include “IP” addresses, “cookies”, browser detection, “weblogs” and
            various “geo-location” tools. HOW WE COLLECT AND USE INFORMATION Our
            primary goal in collecting your information is to provide you with a
            personalized, relevant, and positive experience with the FULFIL
            Website and Applications. You can register on the FULFIL Website or
            the Applications to receive Promotions and updates, or to be
            contacted for market research purposes. You can control your privacy
            preferences regarding such marketing communications (see the section
            below entitled “Your Privacy Preferences”). From time to time, you
            may be invited to participate in optional customer surveys or
            promotions, and FULFIL may request that you provide some or all the
            above listed personal information in those surveys or promotions. We
            use information collected from surveys and promotions to learn about
            our customers to improve our services and develop new products and
            services of interest to our customers. IP addresses define the
            Internet location of computers and help us better understand the
            geographic distribution of our visitors and customers and manage the
            performance of the FULFIL Website. Cookies are tiny files placed
            onto the hard drive of your computer when you visit the FULFIL
            Website, so we can immediately recognize you when you return to the
            FULFIL Website and deliver content specific to your interests. You
            may modify your browser preferences to accept all cookies, be
            notified when a cookie is set, or reject all cookies. Please consult
            your browser instructions for information on how to modify your
            choices about cookies. If you modify your browser preferences,
            certain features of the FULFIL Website may not be available to you.
            We may detect the type of web browser you are using to optimize the
            performance of the FULFIL Website and to understand the mix of
            browsers used by our visitors, guests, and customers. To learn about
            how people use our site, we examine weblogs, which show the paths
            people take through the FULFIL Website and how long they spend in
            certain areas. The Applications may include the ability to link
            certain geographical information made available by us with your
            physical location. When you use the Applications, the Applications
            may know, in very general terms, your current physical location. To
            the extent that your physical location can be determined by the
            Applications, we may use your location to make available information
            to you that is relevant because of your physical location. We may
            also compile certain general information related to your use of the
            FULFIL Website and Applications. You agree that we are authorized to
            use, reproduce and generally make such information available to
            third parties in the aggregate, provided that your information shall
            not include personally identifiable information about you or be
            attributable to you. FULFIL may contract with unaffiliated third
            parties to provide services such as customer communications, website
            hosting, data storage, analytics and other services. When we do
            this, we may provide your personally identifiable information to
            third parties only to provide those services, and they are not
            authorized to use your personally identifiable information for any
            other purpose. OUR COMMITMENT TO DATA SECURITY Access to your
            personal data is limited to authorized FULFIL staff or approved
            vendors. Although total security does not exist on the Internet or
            through mobile networks, FULFIL shall make commercially reasonable
            efforts to safeguard the information that you submit to FULFIL. USE
            OF THE FULFIL WEBSITE AND APPLICATIONS BY CHILDREN THE FULFIL
            WEBSITE AND THE APPLICATIONS ARE NOT INTENDED FOR USE BY CHILDREN
            UNDER THE AGE OF 13. YOUR PRIVACY PREFERENCES When you sign up as a
            registered user of the FULFIL Website or Applications you may begin
            receiving marketing communications such as e-mail newsletters,
            product and service updates and promotions. Our customers generally
            find this type of information useful. If you do not want to receive
            these updates, you must “opt-out” by unchecking the “Add me to the
            mailing list” box on the registration page, or should you choose to
            opt-out after registering, you can select the “unsubscribe” link at
            the bottom of the email and follow the opt-out instructions or send
            an email to privacy@[URL].com/unsubscribe. HOW TO ACCESS, REVIEW,
            CORRECT OR DELETE YOUR INFORMATION Send FULFIL an email at
            privacy@[URL].com if you want to access, review, correct or delete
            your personally identifiable information collected by FULFIL. To
            protect your privacy and security, FULFIL requires a user ID and
            password to verify your identity before granting you the right to
            access, review or make corrections to your personally identifiable
            information. FULFIL may be required by law to retain certain of your
            personal information; if this is the case, you may not be able to
            correct or delete all your personal information. DISCLOSURE OF
            INFORMATION We reserve the right to disclose your personally
            identifiable information as required by law and when we believe that
            disclosure is necessary to protect our rights and/or comply with a
            judicial proceeding, court order or legal process. It is also
            possible that FULFIL would sell its business (by merger,
            acquisition, reorganization or otherwise) or sell all or
            substantially all its assets. In any transaction of this kind,
            customer information, including your personally identifiable
            information, may be among the assets that are transferred. If we
            decide to so transfer your personally identifiable information, you
            will be notified by an email sent to the last know email address in
            our files, by notice posted on the FULFIL Website or when you
            activate the Applications. PRIVACY AND OTHER WEBSITES AND
            APPLICATIONS The FULFIL Website or the Applications may contain
            links to other websites or other mobile applications. FULFIL is not
            responsible for the privacy practices of these other sites or
            applications. This policy only applies to information collected by
            FULFIL.
          </Text>
              </ModalBody>
                 

                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClosePP}>
                      Close
                    </Button>
                 
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal isOpen={isOpenTOS} onClose={onCloseTOS} size="xl" >
<ModalOverlay />
<ModalContent height="66vh">
  <ModalHeader fontSize="16px">Terms Of Use</ModalHeader>
  <ModalCloseButton />
<ModalBody overflowY="scroll">
<Text marginTop="8" >
Fulfil Global Terms of Service
Last updated 10/18/2023

These Terms of Service reprsesent a binding agreement between you and Fulfil, Inc. (“Fulfil”) concerning your use of the Fulfil Platform. The Fulfil Platform encompasses Fulfil's websites, mobile applications, and associated services and content.

All personal data you provide to the Fulfil Platform, or that we gather, is subject to our Global Privacy Policy ("Privacy Policy"). By utilizing the Fulfil Platform, you confirm that you've reviewed our Privacy Policy.

By acknowledging the Terms of Service and/or using the Fulfil platform, you expressly confirm that you have read, understand, and unconditionally agree to be bound by this Agreement and all of its terms. If you do not accept and agree to be bound by this Agreement, you must not use or access the Fulfil platform

No agency, partnership, joint venture, employer-employee or franchiser-franchisee relationship is intended or created by this Agreement.

The Fulfil Platform: Connecting Doers and Needers
The Fulfil Platform is a digital marketplace linking Needers seeking services and Doers offering them. Both Needers and Doers are termed "Users". When both parties agree on a task.
Doers' Independent Status: Doers are independent contractors, not affiliates or employees of Fulfil. Fulfil merely acts as a bridge, linking service seekers (Needers) with providers (Doers) and does not undertake any tasks itself.
Disclaimer: Fulfil doesn't oversee, direct, or control a Doer's work and disclaims any responsibility for their performance, ensuring neither quality nor compliance with laws or regulations.
No Endorsement of Doers: References to a Doer's credentials or descriptions only indicate they've met registration processes or criteria on our platform and have received ratings from other users. Such labels aren't endorsements or guarantees by Fulfil about the Doer's skills, qualifications, or trustworthiness. Needers must make their judgments about Doers' suitability.  Fulfil does not directly endorse any Doer.
Limitations: Fulfil isn't liable for any interactions, quality, legality, or outcomes of tasks, nor does it vouch for the integrity or qualifications of Users. Fulfil doesn't guarantee the accuracy, timeliness, or reliability of services requested or provided by Users.
2. Contract between Users
When a Needer and a Doer agree on a task's terms, they enter into a binding contract (the “Service Agreement”). This agreement comprises the terms in this Section 2, the terms agreed upon on the Fulfil Platform, and other accepted contractual terms, as long as they don't conflict with this Agreement or limit Fulfil’s rights. Importantly, Fulfil isn't a party to this Service Agreement and never has an employment relationship with Doers because of it.
Needers must pay Doers in full using the payment methods specified on the Fulfil Platform, based on the agreed rates in the Service Agreement. All Users should adhere to both the Service Agreement and this overarching Agreement during task engagement and completion.


3.  Doer Background Checks & User Responsibilities
Doer Background Checks:
Doers may undergo reviews, possibly including identity verification and criminal background checks, termed “Background Checks”. While Fulfil conducts these checks, it cannot guarantee the complete authenticity of a user's identity or background. It’s always recommended to use caution and common sense for safety, as you would with strangers. Fulfil won't be responsible for misrepresentations by users. Furthermore, neither Fulfil nor its associates are liable for user conduct. By using the platform, you release Fulfil and its affiliates from any claims related to user interactions.
User Responsibilities:
Users must:
Be of legal age (e.g., 18+ in the U.S.) and capable of forming contracts.
Agree to and abide by Fulfil's terms, privacy policy, and other related guidelines.
Only operate in regions where Fulfil is present.
Respect the privacy and rights of others; refrain from unauthorized recordings.
Commit to agreements, communicate timely, and use only approved payment methods on Fulfil.
Behave professionally with other users, use real names, and abide by all applicable laws.
Refrain from using Fulfil for illegal activities, like procuring alcohol or illegal substances.
If representing an organization, you must have authority to commit that organization.
Disclose any potential conflict of interest or if using Fulfil for investigative or unlawful purposes.
Additional Responsibilities for Doers:
Doers confirm:
They function as a recognized business entity and have an independent clientele.
They can legally work in their operating region and have necessary licenses or permits.
They've procured required insurance and maintain a genuine profile on Fulfil.
Their services are offered based on expertise and are executed safely and lawfully.


4. Billing and Payment Procedures on Fulfil
User Agreements: Users on Fulfil deal directly with other users, i.e., "Doers" provide services for "Needers". While Fulfil facilitates the platform, it doesn't take part in the contracts. The Needer is entirely in charge of payments for tasks.
Payment Mechanics: Payments for tasks, service charges, and any additional fees should be transacted through the PSP (third-party payment service provider). Needers must input their payment information to Fulfil and the PSP.
Invoicing: Doers must send accurate invoices to their Needers within 24 hours post-task, capturing all costs including task payment, any agreed-upon out-of-pocket expenses, Fulfil service charges, any Trust & Support fee, or potential cancellation charges. Tips or gratuities can be added to the invoice, which go directly to the Doer. Needers could incur a 3% payment processing fee for transactions. Doers might also need to cover registration fees or return incorrect payments.
PSP Account Set-Up: Doers need to set up a PSP account. This might involve registration, agreeing to PSP's terms, and potentially other verification steps. Doers should be familiar with the PSP's service agreement.
Validation for Safety: To ensure security and prevent fraud, both Fulfil and the PSP might verify an account before its activation and before each booking. This can involve temporary charges which are then refunded.
Automatic Payment Authorization: Once a task is confirmed complete, the Needer automatically allows the PSP to process the corresponding invoice. If a task is booked but then canceled by the Needer before it starts, they may be billed a one-hour cancellation fee.
Discretionary Holds and Refunds: Fulfil can, in certain situations like potential fraud or at a user's request, place holds on payments or facilitate refunds via the PSP.
Tax Implications: Users may be responsible for any relevant taxes on the tasks or fees under the agreement. In some areas, Fulfil might need to collect or report tax information about users and can provide necessary documentation for accurate tax reporting.

5. Community Features and Proper Conduct on the Fulfil Platform
The Fulfil platform may feature user profiles, internal messaging systems, blogs, feedback boards, task listings, discussion forums, and various communication tools (herein referred to as “Community Features”) that facilitate interaction between Doers and Needers. It is imperative that these features be utilized in a manner that adheres to their intended purpose. For the security and integrity of the Fulfil platform, Needers and Doers are strictly advised against sharing personal contact information with other platform users.
Prohibited Activities: Users of the Fulfil platform are expressly prohibited from:
Engaging in, or promoting, conduct that is defamatory, abusive, harassing, or threatening, or otherwise violating the rights (including, but not limited to, privacy and intellectual property rights) of others, be it fellow users or Fulfil staff.
Publishing, uploading, or disseminating any content that is profane, defamatory, unlawful, or infringing on others' rights.
Uploading files that breach the intellectual property rights of any third party or potentially harm the Fulfil platform or its users' devices, such as malware or corrupted files.
Advertising or promoting goods or services unrelated to the tasks or purposes for which the Fulfil platform was designed.
Posting or fulfilling tasks that involve prohibited activities, including but not limited to, purchasing high-value items without prior authorization from Fulfil, engaging in illegal transportation services, or posting unauthorized reviews on third-party websites.
Participating in unauthorized or deceptive activities, including impersonation, pyramid schemes, or spamming.
Utilizing the Fulfil platform in a manner that violates local, state, or international law, or restricts or inhibits other users from enjoying the Community Features.
Misrepresenting any association or endorsement by Fulfil or utilizing automated processes that interfere with the platform's normal operations.
Uploading content that could be deemed harmful, engaging in unauthorized solicitation, or collecting personal information of users without explicit consent.
Bypassing or attempting to bypass the payment system, misrepresenting invoice details, or registering on the platform with fraudulent or multiple identities.
It is essential to note that all interactions within the Community Features are public. Users will be identifiable by their chosen username or profile. Fulfil assumes no responsibility for actions taken by users in response to content or interactions within these areas.
6. Account Deactivation, Suspension and Updates
Fulfil retains the right to suspend your access to the platform while investigating potential violations of this Agreement on your part. Should it be determined that you've breached any term of this Agreement (referred to as a “User Violation”), Fulfil may choose to deactivate your account or limit its functionalities. We will provide you with a written notification of this decision, as mandated by law. However, exceptions might be made if there are reasons to suspect account compromise, or if issuing a notice might jeopardize safety or counteract our actions. Should you contest this decision, you are encouraged to reach out to policies@fulfil.com within 14 days of receiving the notice, detailing your reasons for appeal.
If, under this Section, your account is suspended, deactivated, or its functionalities are limited, you are forbidden from establishing a new account in your name, or using any fictitious, borrowed, or another individual's name—even if you represent that third party.
Regardless of whether your access to Fulfil is limited, suspended, or terminated, the terms of this Agreement will continue to bind you. Fulfil remains entitled to initiate legal proceedings in accordance with this Agreement.
Fulfil reserves the absolute right to amend, halt, either temporarily or permanently, any part or all of the platform at our discretion. As required by law, we will keep you informed about such changes. Fulfil, to the fullest extent permissible by law, assumes no liability for any modification, suspension, or discontinuation of the platform or its services. Additionally, Fulfil may restrict any individual from completing the registration process if there are valid concerns about the platform's safety and integrity or other legitimate business apprehensions.
If you wish to conclude this Agreement, you may do so at any time by discontinuing your use of Fulfil and deactivating your account.
Upon installing our application, you grant permission for the app's installation and any subsequent updates or enhancements released via the Fulfil platform. The app, along with any updates or enhancements, may prompt your device to automatically connect with Fulfil's servers to ensure optimal app performance and to gather usage metrics. It may also influence app-related preferences or data on your device and collect personal details in line with our Privacy Policy. You retain the right to uninstall the application whenever you wish.
7. Account Details, Security, and Telephonic Communications
You must register to use the Fulfil platform. Safeguard your login credentials; you are responsible for all activities under your account. Alert Fulfil of any unauthorized access or security concerns.
Communications to or from Fulfil may be recorded for quality and training.
Ensure the accuracy of your contact details shared with Fulfil and its partners. If we detect inaccuracies, your account may be suspended or terminated. Update any changes to your contact details promptly. Providing a non-owned phone number is prohibited. Notify Fulfil of phone number ownership changes by sending 'STOP' to any prior number's text message.
8. User-Generated Content
"User-Generated Content" (UGC) refers to materials you provide during your engagement with the Fulfil Platform and related campaigns. Responsibility for UGC rests with you, while Fulfil acts only as a distributor. Fulfil neither creates nor endorses UGC, and bears no liability for it. However, UGC not aligning with our terms may be removed.
Your UGC must:
Be truthful and precise.
Avoid illegal activities or transactions.
Uphold third-party rights, including privacy and intellectual property.
Align with all relevant regulations.
Avoid harmful, malicious, or deceptive content.
Not falsely claim affiliation with Fulfil or its representatives.
Not jeopardize Fulfil's operations or partner relationships.
Fulfil hosts user feedback and reviews. These express individual user perspectives, not Fulfil’s. While we aren’t liable for such feedback, reports of violating content can be directed to our support.
If rights infringement claims arise due to a user's UGC, Fulfil might identify the concerned user to the claiming parties for direct resolution.
Should UGC appear objectionable or infringing, especially if promoting severe offenses, users can report it to Fulfil's designated contact.
9. External Websites 
The Fulfil Platform may feature links to third-party websites. These links are provided for informational purposes only and do not imply Fulfil's endorsement or affiliation. Fulfil is not responsible for the content, accuracy, or practices of these external sites. You should evaluate the content and trustworthiness of information from third-party websites. Fulfil has no obligation to monitor or modify these links but may remove or limit them at its discretion.
Your interactions with third-party websites are governed by their respective terms and privacy policies. Engaging with these websites is at your own risk. Fulfil is not liable for any issues arising from your use of these external sites and you agree to indemnify Fulfil from any claims related to such sites.


10.  Fulfil is an Online Service Marketplace 

Fulfil serves as a digital platform connecting Needers with independent Doers. Fulfil does not directly offer services nor does it employ individuals to perform tasks. These Doers function as independent business entities, determining their own work schedules, locations, and service terms. They operate under their own names or business names, not as representatives of Fulfil. Doers supply their own tools and can work for multiple clients or platforms, including competitors. While they choose the tasks they take on, they're expected to fulfill agreed-upon obligations with Needers. They also set their own pricing without interference from Fulfil.
Fulfil is not an employment agency, and it does not act as an employer for any user. Doers understand that they make independent business decisions, which may result in profit or loss.

11.  Intellectual Property and Copyright

All content, such as text, graphics, designs, photos, videos, logos, and more, excluding User Generated Content addressed within this document, is owned by Fulfil (referred to as “Proprietary Material”). This material is protected under local and international intellectual property laws. Users are prohibited from copying or using any of the Proprietary Material from the Fulfil platform without explicit permission from Fulfil.
Trademarks and logos associated with Fulfil are its exclusive property. Any other brand names or logos seen on the Fulfil platform belong to their respective owners. Unauthorized use of Fulfil's marks, logos, or any other proprietary content is strictly forbidden.

Fulfil values intellectual property rights and expects its Users to do the same. If you believe any materials on the Fulfil platform infringe on your intellectual property rights, please contact us.
Description of the copyrighted work you claim is infringed, including where on the Fulfil platform it's found. Ensure the information is sufficient for Fulfil to locate the material and clarify why you believe there's an infringement.
Location of the original or authorized copy of the copyrighted work, e.g., its URL or book title.
Your contact details: name, address, phone number, and email.
A statement asserting that you believe in good faith that the disputed use isn't authorized by the copyright owner, its agent, or the law.
A declaration, under penalty of perjury, that your provided information is accurate and that you are the copyright holder or have authorization to represent them.
Your electronic or physical signature confirming the above information.


12.  Confidentiality 
You recognize that Confidential Data (defined below) is a unique asset of Fulfil. You commit not to disclose or misuse this data, other than for appropriate use on the Fulfil platform, for the duration of your account and 10 years thereafter. You may share this with authorized personnel, provided they uphold confidentiality. You'll protect the data from unauthorized exposure and promptly return any related documents to Fulfil upon account termination or agreement end.
"Confidential Data" covers all of Fulfil's trade secrets, proprietary information, and other non-public details. This includes, but isn't limited to, technical insights, product strategies, customer details, software, processes, designs, marketing, finances, and information about Fulfil's operations and partners.
13. Disclaimer of Warranties
A. User Responsibility The Fulfil Platform is offered "as is" without explicit or implied guarantees. Fulfil doesn't assure content accuracy and assumes no responsibility for issues such as inaccuracies, personal injury, property damage, or data breaches. Any third-party offerings on the Fulfil Platform aren't endorsed by Fulfil. Users must exercise caution and judgment. Fulfil doesn't guarantee uninterrupted service or the absence of tech issues like viruses. Each user is responsible for their interactions and transactions on Fulfil, and Fulfil provides no assurances about the capabilities or credentials of its users.
B. Limitations of Liability By using the Fulfil Platform, users agree to limited liability terms. Users shouldn't hold Fulfil or its associates accountable for damages, losses, or disputes arising from platform usage. Fulfil and its partners won't be liable for any direct or indirect damages, including but not limited to financial losses, data losses, goodwill losses, and service interruptions. If, however, liability is established, any compensation won't exceed the fees you've paid to Fulfil in the past six months. Always be aware of the inherent risks associated with online transactions and act wisely.
14. Indemnification 
You agree to indemnify and defend Fulfil and its associates against any liabilities arising from:
Your use or misuse of the Fulfil Platform.
Your involvement in tasks, performance issues, or payment disputes.
Breaches of this Agreement.
Any legal violations or infringement of user or third-party rights.
Misrepresentation as referenced in Section 2.
Any content you submit that might violate intellectual or legal rights.
Actions or negligence of any agents if you are a client.
Fulfil retains the right to manage its own defense regarding such matters. You must not settle any claim without Fulfil's prior approval.
15. Dispute Resolution
For any disputes arising from your use of Fulfil or related to this Agreement, you and Fulfil agree to negotiate informally for at least 30 days before considering further actions. Start negotiations with a written notice. Send your notices to the email in our contact info.
16. General Provisions
Fulfil's failure to enforce any part of this Agreement shall not be seen as a waiver of any term or right. This Agreement is the complete understanding between you and Fulfil regarding its subject, superseding prior agreements. Other separate agreements, like specialized service terms, remain unaffected.
Each term here is meant to be valid and enforceable. If any term is deemed invalid or unenforceable, it will be adjusted to become valid, or removed without affecting other terms.
Fulfil can assign this Agreement without needing your approval, for reasons such as corporate restructuring or asset acquisition. You can't assign this Agreement without Fulfil's written consent. Any unauthorized assignment is void.
This Agreement benefits and binds Fulfil and its successors. Terms meant to continue post-expiration or termination will do so.
17. Licensing
Doers are responsible for securing required licenses or permits before providing services. Some services might be restricted or illegal, and it's on Doers to steer clear of these. Breaching these requirements may lead to penalties. Needers should verify if a Doer meets specific qualifications or licenses for certain tasks and communicate any unique challenges or hazards associated with the task. If unsure about legal regulations for a task, it's recommended to seek legal advice.
18. Changes to this Agreement and the Fulfil Platform
Fulfil reserves the right, in its sole discretion, to modify, amend, add to, or remove portions of this Agreement (including Terms of Service, Privacy Policy, and any other accompanying policies) and to modify, suspend, or terminate the Fulfil Platform or its content at any time, either with or without prior notice, and without any liability to Fulfil. Limits on certain features might be imposed or access to parts or all of the Fulfil Platform could be restricted without prior notice or liability.
While Fulfil will make efforts to inform you of significant amendments to this Agreement via email, there is no obligation and no liability arises for any missed notifications. If you disagree with any future modifications to this Agreement or if they render you non-compliant, you must deactivate your account and cease using the Fulfil Platform immediately. By continuing to use the Fulfil Platform after any changes to this Agreement, you fully and unconditionally accept all those changes, unless such acceptance is prohibited by local regulations or laws.
19. No Rights of Third Parties
The terms of this Agreement are exclusively for the benefit of the involved Parties and their permitted successors and assigns. They should not be interpreted as granting any rights to any third party (including any potential rights for third party beneficiaries except as detailed in a relevant section) or to grant any individual or entity other than the Doer or Needer any privilege, remedy, claim, reimbursement, cause of action, or any other rights concerning any agreement or provision within or anticipated by this Agreement. Terms within this Agreement are not enforceable by individuals or entities who are not party to this Agreement. However, a Needer's representative may act on behalf of and represent their Needer.
20. Consent to Receive Notices Electronically
You give your consent to receive any agreements, notifications, disclosures, and other communications (collectively referred to as “Notices”) pertinent to this Agreement electronically, which may include but is not limited to receipt via email or by posting Notices on the Fulfil platform. You acknowledge and agree that all Notices that we deliver to you electronically meet any legal requirements that such communication be in written form. Unless stated differently in this Agreement, all Notices under this Agreement must be in writing and will be considered as duly given when received, if delivered personally or sent by certified or registered mail with return receipt requested; when the receipt is electronically confirmed if sent by facsimile or email; or the day it is shown as delivered based on the tracking information of a recognized overnight delivery service, if sent for next-day delivery.


DMCA Notice and Takedown Procedure

DMCA Compliance Fulfil respects the intellectual property rights of others and expects users to do the same. It is our policy to respond to clear notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act (DMCA).

Designated Agent If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our Designated Copyright Agent with the following information:

Identification of the copyrighted work that you claim has been infringed.
Identification of the material that is claimed to be infringing and where it is located on the site.
Your contact information, including your address, telephone number, and email address.
A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.
A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.
Your physical or electronic signature.
Please send your notice of claimed infringement to:

Tyler Bradley
DMCA Designated Agent
Email: tyler@getfulfil.com

Counter-Notice by Accused User If you receive a notice from us that material you have posted has been removed or access to it has been disabled and you believe this was done mistakenly or that you have the right to post the material, you may submit a counter-notice to our DMCA Designated Agent with the following information:

Identification of the material that has been removed or to which access has been disabled and the location where the material appeared before it was removed or disabled.
A statement, under penalty of perjury, that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material.
Your name, address, telephone number, and email address.
A statement that you consent to the jurisdiction of the federal court in your district or, if your address is outside the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided the original notification or an agent of such person.
Your physical or electronic signature.
Upon receiving a valid counter-notice, we may restore the material in question.

Repeat Infringer Policy Fulfil reserves the right to terminate users who are found to be repeat infringers.

Modifications to Policy We reserve the right to amend this policy at any time by posting a revised version on our website.
</Text>
</ModalBody>
 

  <ModalFooter>
    <Button variant="ghost" mr={3} onClick={onCloseTOS}>
      Close
    </Button>
 
  </ModalFooter>
</ModalContent>
</Modal>
    </>
  );
};

export default Homepage;
