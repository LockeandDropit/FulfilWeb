import React from "react";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";
import { useJobStore } from "./lib/jobsStoreDashboard";
import { db } from "../../../firebaseConfig";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
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
} from "@chakra-ui/react";

const JobDetails = () => {
  const { job } = useJobStore();
  console.log(job);
  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [numberOfRatings, setNumberOfRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (location.state === null) {
    } else {
      if (location.state.editReset) {
        setEditVisible(false);
      }
    }
  }, [location]);
  return (
    <>
      <Header />
      <Dashboard />
      {job ? (
        <main id="content" class="lg:ps-[260px] pt-[59px]">
          <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
            <ol class="lg:hidden pt-5 flex items-center whitespace-nowrap">
              <li class="flex items-center text-sm text-stone-600 ">
                Products
                <svg
                  class="flex-shrink-0 mx-1 overflow-visible size-4 text-stone-400 "
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
              </li>
              <li
                class="text-sm font-semibold text-stone-800 truncate "
                aria-current="page"
              >
                Product Details
              </li>
            </ol>

            <div class="py-2 sm:pb-0 sm:pt-5 space-y-5">
              <div class="grid sm:flex sm:justify-between sm:items-center gap-3 sm:gap-5">
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p class="inline-flex justify-between items-center gap-x-1">
                      <a
                        class="text-sm text-sky-400 decoration-2 hover:underline font-medium focus:outline-none focus:underline "
                        href="#"
                      >
                        Posted
                      </a>
                    </p>
                    <h1 class="text-lg md:text-xl font-semibold text-stone-800 ">
                      {job.jobTitle}
                    </h1>
                  </div>
                </div>

                <div class="inline-flex sm:justify-end items-center gap-x-3">
                  <div class="flex justify-end items-center gap-x-2">
                    <button
                      type="button"
                      onClick={() => setEditVisible(true)}
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
                    </button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-6 gap-5">
                <div class="lg:col-span-4 space-y-4">
                  <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                    <div class="py-3 px-5 flex justify-between items-center gap-x-5 border-b border-stone-200 ">
                      <h2 class="inline-block font-semibold text-stone-800 ">
                        Post Info
                      </h2>
                    </div>

                    <div class="p-5 space-y-4">
                      <div>
                        <label
                          for="hs-pro-epdnm"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Name
                        </label>
                        <p>{job.jobTitle}</p>
                      </div>

                      <div>
                        <div>
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
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Type
                        </label>
                        {job.isFlatRate ? <p>Flat Rate</p> : <p>Hourly</p>}
                      </div>

                      <div>
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Rate
                        </label>
                        {job.isFlatRate ? (
                          <p>{job.flatRate}</p>
                        ) : (
                          <p>
                            {job.lowerRate} {job.upperRate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label class="block mb-2 text-sm font-medium text-stone-800 ">
                          Description
                        </label>
                        {job.description}
                      </div>
                    </div>
                  </div>

                  {editVisible ? <EditSelectedJob props={job} /> : null}

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

                <div class="lg:col-span-2">
                  <div class="lg:sticky lg:top-5 space-y-4">
                    <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                      <div class="py-3 px-5  justify-between items-center gap-x-5 border-b border-stone-200 ">
                        <h2 class="inline-block font-semibold text-stone-800 ">
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
                                    {applicant.profilePictureRespone ? (
                                      <img
                                        src={applicant.profilePictureRespone}
                                        class="flex-shrink-0 size-[38px] rounded-full"
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
                                    {applicant.firstName} {applicant.lastName}
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

                                {applicant.hasUnreadMessage ||
                                applicant.channelID ? (
                                  <>
                                    {" "}
                                    <button
                                      type="button"
                                      // onClick={() =>
                                      //   navigateApplicantProfile(
                                      //     applicant,
                                      //     allJobs
                                      //   )
                                      // }
                                      class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                    >
                                      View profile
                                    </button>
                                    <button
                                      class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                      // onClick={() =>
                                      //   navigateToChannel(
                                      //     applicant
                                      //   )
                                      // }
                                    >
                                      See Messages
                                      <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                        New
                                      </span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    // onClick={() =>
                                    //   navigateApplicantProfile(
                                    //     applicant,
                                    //     allJobs
                                    //   )
                                    // }
                                    class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500  "
                                  >
                                    View profile
                                  </button>
                                )}
                              </div>
                            </>
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
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </>
  );
};

export default JobDetails;
