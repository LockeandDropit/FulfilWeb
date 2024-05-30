import React from "react";
import { useState, useEffect } from "react";
import Dashboard from "../Components/Dashboard";
import Header from "../Components/Header";
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


const handleStoreAndNavigatePosted = (x) => {
    console.log(x.jobTitle, x.jobID, )

fetchJobInfo(user.uid, x.jobID, "Posted Jobs", x.jobTitle)
setTimeout(() => (
    navigate("/JobDetails")
),500)

}

const handleStoreAndNavigateHired = (x) => {
    console.log(x.jobTitle, x.jobID, )


    //set store info... uid, jobTitle, jobID,.


    navigate("/JobDetails")
}


  return (
    <>
      <Header />
      <Dashboard />
      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <ol class="md:hidden py-3 px-2 sm:px-5 flex items-center whitespace-nowrap">
          <li class="flex items-center text-sm text-gray-600 ">
            Welcome, User
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
              Welcome, User
            </h2>

            <div class="flex justify-end items-center gap-x-2">
              <a
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                href="../../pro/dashboard/users-add-user.html"
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
                Add user
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
                All
              </button>
              <button
                type="button"
                class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none  "
                id="hs-pro-tabs-dut-item-validaccounts"
                data-hs-tab="#hs-pro-tabs-dut-validaccounts"
                aria-controls="hs-pro-tabs-dut-validaccounts"
                role="tab"
              >
                Valid accounts
              </button>
              <button
                type="button"
                class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 after:pointer-events-none "
                id="hs-pro-tabs-dut-item-fakeaccounts"
                data-hs-tab="#hs-pro-tabs-dut-fakeaccounts"
                aria-controls="hs-pro-tabs-dut-fakeaccounts"
                role="tab"
              >
                Fake accounts
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
                <div class="hs-dropdown relative inline-flex [--auto-close:true]">
                  <button
                    id="hs-pro-dptied"
                    type="button"
                    class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-3.5"
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
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                    Import / Export
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] "
                    aria-labelledby="hs-pro-dptied"
                  >
                    <div class="p-1">
                      <button
                        type="button"
                        class="w-full flex gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-pro-dicm"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Import contacts
                      </button>
                      <button
                        type="button"
                        class="w-full flex gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-pro-decm"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Export contacts
                      </button>
                    </div>
                  </div>
                </div>

                <div class="hs-dropdown relative inline-flex [--auto-close:inside]">
                  <button
                    id="hs-pro-dptfd"
                    type="button"
                    class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                  >
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
                      <line x1="21" x2="14" y1="4" y2="4" />
                      <line x1="10" x2="3" y1="4" y2="4" />
                      <line x1="21" x2="12" y1="12" y2="12" />
                      <line x1="8" x2="3" y1="12" y2="12" />
                      <line x1="21" x2="16" y1="20" y2="20" />
                      <line x1="12" x2="3" y1="20" y2="20" />
                      <line x1="14" x2="14" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="10" y2="14" />
                      <line x1="16" x2="16" y1="18" y2="22" />
                    </svg>
                    Filter
                    <span class="font-medium text-[10px] py-0.5 px-[5px] bg-gray-800 text-white leading-3 rounded-full ">
                      5
                    </span>
                  </button>

                  <div
                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] "
                    aria-labelledby="hs-pro-dptfd"
                  >
                    <div class="p-1">
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <circle cx="12" cy="10" r="3" />
                          <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                        </svg>
                        Name
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Email addresses
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M11 12H3" />
                          <path d="M16 6H3" />
                          <path d="M16 18H3" />
                          <path d="M21 12h-6" />
                        </svg>
                        Description
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                          <path d="M10 6h4" />
                          <path d="M10 10h4" />
                          <path d="M10 14h4" />
                          <path d="M10 18h4" />
                        </svg>
                        Company
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        User ID
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Phone numbers
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Location
                      </a>
                      <a
                        class="w-full flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        href="#"
                      >
                        <svg
                          class="flex-shrink-0 mt-0.5 size-3.5"
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
                          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        Signed up as
                      </a>
                    </div>
                  </div>
                </div>
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
                          <th scope="col" class="px-3 py-2.5 text-start">
                            <input
                              type="checkbox"
                              class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            />
                          </th>

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
                                Actions
                              </button>
                            </div>
                          </th>

                          {/* <th scope="col"></th> */}
                        </tr>
                      </thead>
                  
                        
                      


                    
                  {postedJobs.map((job) => (
                       <tbody class="divide-y divide-gray-200 ">
                       <tr class="divide-x divide-gray-200 ">
                         <td class="size-px whitespace-nowrap px-3 py-4">
                           <input
                             type="checkbox"
                             class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                           />
                         </td>
                         <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer" onClick={() => handleStoreAndNavigatePosted(job)}>
                           <div class="w-full flex items-center gap-x-3">
                             <div class="grow">
                               <span class="text-sm font-medium text-gray-800 ">
                                 {job.jobTitle}
                               </span>
                             </div>
                           </div>
                         </td>
                         <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600 font-semibold">n/a</span>
                      </td>
                         <td class="size-px whitespace-nowrap px-4 py-1">
                           <span class="text-sm text-gray-600 ">{job.totalApplicants}</span>
                         </td>
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
                             posted
                           </span>
                         </td>
                         <td class="size-px whitespace-nowrap px-4 py-1">
                           <span class="text-sm text-gray-600 ">
                             {job.datePosted}
                           </span>
                         </td>
                         <td class="size-px py-1 space-x-2">
                             <div className=" flex  w-full ">
                           {/* <button
                             type="button"
                             class="py-2 px-3  mx-1 text-start bg-white border hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle  "
                             data-hs-overlay="#hs-pro-datm"
                           >
                             Edit Post
                           </button> */}
                           <button className="py-2 px-3   text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 ">
                             View applicants
                           </button>
                           </div>
                         </td>
                       </tr>
                     </tbody>
                ))}

{jobsInProgressMap.map((job) => (
                    <tbody class="divide-y divide-gray-200 ">
                    <tr class="divide-x divide-gray-200 ">
                      <td class="size-px whitespace-nowrap px-3 py-4">
                        <input
                          type="checkbox"
                          class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer">
                        <div class="w-full flex items-center gap-x-3">
                          <div class="grow">
                            <span class="text-sm font-medium text-gray-800 ">
                              {job.jobTitle}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                      <div class="w-full flex items-center gap-x-3">
                        {job.hiredApplicantProfilePicture ? ( <img class="flex-shrink-0 size-[38px] rounded-full" src={job.hiredApplicantProfilePicture} alt="Image Description" />) : ( <svg
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
                    </svg>)}
                     
                        <span class="text-sm font-medium text-gray-800 ">{job.hiredApplicantFirstName} {job.hiredApplicantLastName}</span>
                        </div>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600 font-semibold">n/a</span>
                      </td>
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
                          In Progress
                        </span>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600 ">
                          {job.datePosted}
                        </span>
                      </td>
                      <td class="size-px py-1 space-x-2">
                          <div className=" flex  w-full ">
                        {/* <button
                          type="button"
                          class="py-2 px-3  mx-1 text-start bg-white border hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle  "
                          data-hs-overlay="#hs-pro-datm"
                        >
                          Edit Post
                        </button> */}
                        <button className="py-2 px-3   text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 ">
                          Message
                        </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
                {jobsInReviewMap.map((job) => (
                    <tbody class="divide-y divide-gray-200 ">
                    <tr class="divide-x divide-gray-200 ">
                      <td class="size-px whitespace-nowrap px-3 py-4">
                        <input
                          type="checkbox"
                          class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer">
                        <div class="w-full flex items-center gap-x-3">
                          <div class="grow">
                            <span class="text-sm font-medium text-gray-800 ">
                              {job.jobTitle}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600 ">{job.hiredApplicant}</span>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600  font-semibold ">n/a</span>
                      </td>
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
                          Ready To Pay
                        </span>
                      </td>
                      <td class="size-px whitespace-nowrap px-4 py-1">
                        <span class="text-sm text-gray-600 ">
                          {job.datePosted}
                        </span>
                      </td>
                      <td class="size-px py-1 space-x-2">
                          <div className=" flex  w-full ">
                        {/* <button
                          type="button"
                          class="py-2 px-3  mx-1 text-start bg-white border hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle  "
                          data-hs-overlay="#hs-pro-datm"
                        >
                          Edit Post
                        </button> */}
                        <button className="py-2 px-3   text-sm font-semibold rounded-md border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 ">
                          Pay
                        </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
                </table>
             
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Homepage;
