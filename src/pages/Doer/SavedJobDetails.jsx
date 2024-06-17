import React from "react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { useSavedJobStore } from "./Chat/lib/savedJobStore";
import { db } from "../../firebaseConfig";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";
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
  increment,
} from "firebase/firestore";


import { useLocation } from "react-router-dom";
import {
  Center,
  Flex,
  Text,
  Spinner,
  Image,
  Box,
  Stack,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useUserStore } from "./Chat/lib/userStore";

const SavedJobDetails = () => {
  const { job } = useSavedJobStore();
  console.log(job);
  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [numberOfRatings, setNumberOfRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useUserStore()

  const navigate = useNavigate()

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

  const location = useLocation();

  const [editVisible, setEditVisible] = useState(false);
  const [editBusinessVisible, setEditBusinessVisible] = useState(false);

  useEffect(() => {
    console.log("location", location.state)
    if (location.state === null) {
    } else {
      if (location.state.editReset) {
        setEditVisible(false);
      } else if (location.state.applicantReset) {
        console.log("hello",location.state.applicantReset)
        setApplicantVisible(false)
      }
    }
  }, [location]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [applicantVisible, setApplicantVisible] = useState(false)
  
  const handleApplicantVisible = () => {
    setApplicantVisible(true)
    //also pass job info so chat can be started.
  }

  const navigateToChannel = (x) => {
    console.log("this is what youre passing", x);
    navigate("/ChatHolder", {
      state: { selectedChannel: x.channelID, applicant: x },
    });

  };

  const applyAndNavigate = (x) => {
    //If anything is going wring in the application or saved job flow it's because I changed this on 5/27/24 at 2:30. Revert to previous if any issues

    if (currentUser.isOnboarded === true) {
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
          currentUser.uid
        ),
        {
          applicantID: currentUser.uid,
          isNewApplicant: true,
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

      setDoc(doc(db, "users", currentUser.uid, "Applied", x.jobTitle), {
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
      // onOpenNotOnboarded();
    }
  };

  const handleOnClose = () => {
    onClose()
    navigate("/DoerSavedJobs")
  }
  return (
    <>
      <Header />
      <Dashboard />
      {job ? (
        <main id="content" class="lg:ps-[260px] pt-[59px]">
          <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
           {currentUser ? (currentUser.isBusiness ? (null) : (null)) : (null)}

            <div class="py-2 sm:pb-0 sm:pt-5 space-y-5">
              <div class="grid sm:flex sm:justify-between sm:items-center gap-3 sm:gap-5">
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p class="inline-flex justify-between items-center gap-x-1">
                      <a
                        class="text-sm text-sky-400 decoration-2  font-medium cursor-default "
                      
                      >
                        Active
                      </a>
                    </p>
                    <h1 class="text-lg md:text-xl font-semibold text-stone-800 cursor-default">
                      {job.jobTitle}
                    </h1>
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
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full cursor-default">
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
                    </div>

                    <div class="p-5 space-y-4">
                    <div class="grid sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label
                          for="hs-pro-epdnm"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Job Title
                        </label>
                        <p className="cursor-default ">{job.jobTitle}</p>
                      </div> 
                      
                      {/* <div className="ml-20">
                        <label
                          for="hs-pro-epdnm"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Total Views
                        </label>
                        <p className="cursor-default ">{job.totalViews}</p>
                      </div>  */}
                   
                        
                        </div>
                        <div class="grid sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <div className="cursor-default ">
                          <label
                            for="hs-pro-epdsku"
                            class="block mb-2 text-sm font-medium text-stone-800 "
                          >
                           Employer
                          </label>
                          {job.companyName}
                        </div>
                      </div>
                      <div>
                    
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
                        {/* <div className="cursor-default ml-20">
                          <label
                            for="hs-pro-epdsku"
                            class=" block mb-2 text-sm font-medium text-stone-800 "
                          >
                            Status
                          </label>
                        Posted
                        </div> */}
                      </div>
                     
                      </div>
                      {job ? (job.isPostedByBusiness  ? (<div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Position Type
                        </label>
                        
                        {job.isFullTimePosition ? (<p>Full-time</p>) : (<p>Part-time</p>)}
                      </div>) : (null)) : (null)}

                      {job ? (job.isPostedByBusiness  ? (     <div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Type
                        </label>
                        
                        {job.isSalaried ? <p>Salary</p> : <p>Hourly</p>}
                      </div>) : (     <div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Type
                        </label>
                        
                        {job.isFlatRate ? <p>Flat Rate</p> : <p>Hourly</p>}
                      </div>)) : (null)}
                      
                 
                      {job ? (job.isPostedByBusiness  ? (     <div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Rate
                        </label>
                        {job.isSalaried ? ( <p>
                            ${job.lowerRate}/year - ${job.upperRate}/year
                          </p>) : ( <p>
                            ${job.lowerRate}/hour - ${job.upperRate}/hour
                          </p>)}
                       
                      </div>) : (     <div className="cursor-default ">
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
                            ${job.lowerRate}/hour - ${job.upperRate}/hour
                          </p>
                        )}
                      </div>)) : (null)}
                     


                      <div className="cursor-default ">
                        <label class="block mb-2 text-sm font-medium text-stone-800 ">
                          Description
                        </label>
                        {job.description}
                      </div>

                      {job ? (job.isPostedByBusiness ? (<div className="cursor-default ">
                        <label class="block mb-2 text-sm font-medium text-stone-800 ">
                          Applicant Description
                        </label>
                        {job.applicantDescription}
                      </div>) : (null)) : (null)}

                      {job ? (job.isPostedByBusiness  && job.benefitsDescription ? (<div className="cursor-default ">
                        <label class="block mb-2 text-sm font-medium text-stone-800 ">
                          Benefits Description
                        </label>
                        {job.benefitsDescription}
                      </div>) : (null)) : (null)}
                      <div class="flex flex-row-reverse">
                      <button
                                          type="button"
                                          class="ml-auto py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() =>
                                            applyAndNavigate(job)
                                          }
                                        >
                                          Apply
                                        </button>
                                        </div>
                    </div>
                  </div>


                  {/* 
            
            Could add later when they have ability to add pictures


            <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
           
              <div class="py-3 px-5 flex justify-between items-center gap-x-5 border-b border-stone-200 dark:border-neutral-700">
                <h2 class="inline-block font-semibold text-stone-800 dark:text-neutral-200">
                  Media
                </h2>

                <div class="flex justify-end items-center gap-x-2">
                  <button type="button" class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                      <path d="M12 12v9" />
                      <path d="m16 16-4-4-4 4" />
                    </svg>
                    Upload from URL
                  </button>
                </div>
              </div>
     
        
              <div class="p-5 space-y-4">
            
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              
                  <div id="dismiss-img1" class="relative">
                    <div class="flex-shrink-0 relative rounded-xl overflow-hidden w-full h-44">
                      <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1549298916-f52d724204b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80" alt="Image Description">
                    </div>
                    <div class="absolute top-2 end-2 z-10">
                      <button type="button" class="size-7 inline-flex justify-center items-center gap-x-1.5 font-medium text-sm rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-remove-element="#dismiss-img1">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
               
                  <div id="dismiss-img2" class="relative">
                    <div class="flex-shrink-0 relative rounded-xl overflow-hidden w-full h-44">
                      <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1549298916-acc8271f8b8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80" alt="Image Description">
                    </div>
                    <div class="absolute top-2 end-2 z-10">
                      <button type="button" class="size-7 inline-flex justify-center items-center gap-x-1.5 font-medium text-sm rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-remove-element="#dismiss-img2">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                
                  <div id="dismiss-img3" class="relative">
                    <div class="flex-shrink-0 relative rounded-xl overflow-hidden w-full h-44">
                      <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1549298916-c6c5f85fa167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80" alt="Image Description">
                    </div>
                    <div class="absolute top-2 end-2 z-10">
                      <button type="button" class="size-7 inline-flex justify-center items-center gap-x-1.5 font-medium text-sm rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-remove-element="#dismiss-img3">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div id="dismiss-img4" class="relative">
                    <div class="flex-shrink-0 relative rounded-xl overflow-hidden w-full h-44">
                      <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80" alt="Image Description">
                    </div>
                    <div class="absolute top-2 end-2 z-10">
                      <button type="button" class="size-7 inline-flex justify-center items-center gap-x-1.5 font-medium text-sm rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-remove-element="#dismiss-img4">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
               
                </div>
                

                
                <div class="space-y-2">
                  <label class="hidden mb-2 text-sm font-medium text-stone-800 dark:text-neutral-200">
                    Upload images
                  </label>
                  <div class="p-12 h-56 flex justify-center bg-white border border-dashed border-stone-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
                    <div class="text-center">
                      <svg class="w-16 text-stone-400 mx-auto dark:text-neutral-400" width="70" height="46" viewBox="0 0 70 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-stone-400 dark:fill-neutral-800 dark:stroke-neutral-500" />
                        <path d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-stone-400 dark:fill-neutral-800 dark:stroke-neutral-500" />
                        <rect x="17.0656" y="1.62305" width="35.8689" height="42.7541" rx="5" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-stone-400 dark:fill-neutral-800 dark:stroke-neutral-500" />
                        <path d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z" stroke="currentColor" stroke-width="2" class="stroke-stone-400 dark:stroke-neutral-500" />
                        <circle cx="39.5902" cy="14.9672" r="4.16393" stroke="currentColor" stroke-width="2" class="stroke-stone-400 dark:stroke-neutral-500" />
                      </svg>

                      <div class="mt-4 flex flex-wrap justify-center text-sm leading-6 text-stone-600">
                        <span class="pe-1 font-medium text-stone-800 dark:text-neutral-200">
                          Drop your files here or
                        </span>
                        <label for="hs-pro-epdupb" class="relative cursor-pointer bg-white font-semibold text-green-600 hover:text-green-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-green-500 dark:hover:text-green-600">
                          <span>browse</span>
                          <input id="hs-pro-epdupb" type="file" class="sr-only" name="hs-pro-deuuf">
                        </label>
                      </div>

                      <p class="mt-1 text-xs text-stone-400 dark:text-neutral-400">
                        CSV, XLS, DOCX
                      </p>
                    </div>
                  </div>
                </div>
              

                <p class="text-sm text-stone-500 dark:text-neutral-500">
                  Add up to 10 images to your product.
                </p>
              </div>
          
            </div> */}




          
          
                </div>

                
        
               
              </div>
            </div>
          </div>
        </main>
      ) : null}

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
                                          onClick={() =>
                                         handleOnClose()
                                          }
                                        >
                                          close
                                        </button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
    </>
  );
};

export default SavedJobDetails;
