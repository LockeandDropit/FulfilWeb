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
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "./lib/jobsStoreDashboard";

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const navigate = useNavigate();
  const { fetchJobInfo, setJobHiringState } = useJobStore();
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

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
    setTimeout(() => navigate("/JobDetails"), 500);
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

  return (
    <>
      <Header />
      <Dashboard />
      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <ol class="md:hidden py-3 px-2 sm:px-5 flex items-center whitespace-nowrap">
          <li class="flex items-center text-sm text-gray-600 ">
            My Dashboard
            <svg
              class="flex-shrink-0 mx-1 overflow-visible size-4 text-gray-400 "
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
            class="text-sm font-semibold text-gray-800 truncate"
            aria-current="page"
          >
            Overview
          </li>
        </ol>

        <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          <div class="flex justify-between items-center gap-x-5">
            <h2 class="inline-block text-lg font-semibold text-gray-800 ">
            My Dashboard
            </h2>

            <div class="flex justify-end items-center gap-x-2">
              <a
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
                              <button
                                id="hs-pro-dutads"
                                type="button"
                                class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 "
                              >
                                Hired
                              </button>
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
                              onClick={() => handleStoreAndNavigatePosted(job)}
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
                                onClick={() => handleStoreAndNavigateHired(job)}
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
                            <td class="size-px py-2 px-3 space-x-2">
                              <div className=" flex  w-full ">
                                {job.hasNewNotification ? (
                                  <button
                                    onClick={() =>
                                      handleStoreAndNavigateInReview(job)
                                    }
                                    className="py-2 px-3  w-full relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                  >
                                    Pay
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
                                    Pay
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
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
                            <a
                          
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
                            </a>
                          </div>
                        </div>
                         ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showAddJob ? <AddJobModal /> : null}
    </>
  );
};

export default Homepage;
