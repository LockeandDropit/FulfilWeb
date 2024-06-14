import React from "react";
import { useState, useEffect } from "react";
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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Input,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { db } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useSearchResults } from "../Chat/lib/searchResults";
import { useMediaQuery } from "@chakra-ui/react";

const JobFilter = () => {
  const [user, setUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const { setSearchResults } = useSearchResults();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [jobTitle, setJobTitle] = useState(null);
  const [minimumPay, setMinimumPay] = useState(null);
  const [positionType, setPositionType] = useState(null);

  const search = () => {
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {
        //if a b c we are not solving for salary right now

        if (jobTitle && !minimumPay && !positionType) {
          if (doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase())) {
            results.push(doc.data());
            console.log("title", doc.data());
          } else {
            // onOpen()
            console.log("1");
          }
        } else if (jobTitle && minimumPay && !positionType) {
          console.log("title and minimum");
          if (
            doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase()) &&
            doc.data().lowerRate >= minimumPay
          ) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("2");
          }
        } else if (jobTitle && !minimumPay && positionType) {
          console.log("title and type");
          if (
            doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase()) &&
            doc.data().lowerRate >= minimumPay
          ) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("3");
          }
        } else if (jobTitle && minimumPay && positionType) {
          console.log("title, minimum, type");
          if (
            doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase()) &&
            doc.data().lowerRate >= minimumPay &&
            doc.data().isFullTimePosition === positionType
          ) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("4");
          }
        } else if (minimumPay && !jobTitle && !positionType) {
          console.log("minimum", minimumPay);
          if (doc.data().lowerRate >= minimumPay) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("5");
          }
        } else if (minimumPay && !jobTitle && positionType) {
          console.log("minimum & type");
          if (
            doc.data().lowerRate >= minimumPay &&
            doc.data().isFullTimePosition === positionType
          ) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("6");
          }
        } else if (positionType && !minimumPay && !jobTitle) {
          console.log("type");
          if (
            doc.data().lowerRate >= minimumPay &&
            doc.data().isFullTimePosition === positionType
          ) {
            console.log("heres your match with pay", doc.data());
            results.push(doc.data());
          } else {
            // onOpen()
            console.log("7");
          }
        } else {
          // onOpen()
        }
      });

      if (!results || !results.length) {
        onOpen();
      } else {
        setSearchResults(results);
      }
    });
  };

  const clearSearch = () => {
    resetSearch();
    setSearchResults(null);
    setJobTitle(null);
    setMinimumPay(null);
    setPositionType(null);
  };

  //uhh set all of this in context as SearchResultJobs and check w/conditional rendering on primary screen. Set them as business posted jobs. set all other jobs null?

  //Job title takes input, puts it all to lower case, checks it against all jobs lowercase title, seeing if it contains the input. does x contain y

  const resetSearch = () => {
    document.getElementById("search-form").reset();
  };

  useEffect(() => {
    //ty molevolence https://www.reddit.com/r/reactjs/comments/w8hdd5/how_to_handle_keyboard_events_the_proper_way_in/
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        // search()
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  
  return (
    <>
      {isDesktop ? (
        <div class="w-full bg-white  px-4 sm:px-6 lg:px-8  ">
          <div class="flex flex-row items-center mx-auto mb-4 mt-4">
            <form id="search-form">
              <div class=" flex flex-col items-center gap-2 sm:flex-row sm:gap-3 ">
                <div class="max-w-[560px] min-w-[320px]">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium mb-1 ml-1"
                  >
                    Job Title
                  </label>
                  <input
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    id="hero-input"
                    name="hero-input"
                    class=" mb-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Ex: Landscaping, Hostess, Construction"
                  />
                </div>
                {/* <div className=" w-[560px]">
          <label for="hs-select-label" class="block text-sm font-medium  ">Pay Type</label>
<select id="hs-select-label" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
  <option selected="">Hourly</option>
  <option>Salary</option>
 
</select>
</div> */}
                <div className=" w-[320px]">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium mb-1 ml-1"
                  >
                    Pay Range
                  </label>
                  <select
                    onChange={(e) => setMinimumPay(e.target.value)}
                    id="hs-select-label"
                    value={minimumPay}
                    class=" mb-2 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    <option value={null}>Select minimum pay</option>
                    <option value="10">$10/hour +</option>
                    <option value="15">$15/hour +</option>
                    <option value="20">$20/hour +</option>
                    <option value="25">$25/hour +</option>
                    <option value="30">$30/hour +</option>
                    <option value="35">$35/hour +</option>
                    <option value="40">$40/hour +</option>
                  </select>
                </div>
                <div className=" w-[320px]">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium mb-1  ml-1"
                  >
                    Position Type
                  </label>
                  <select
                    onChange={(e) => setPositionType(e.target.value)}
                    id="hs-select-label"
                    class="mb-2 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    <option value={null}>Select position type</option>
                    <option value="true">Full-time</option>
                    <option value="false">Part-time</option>
                  </select>
                </div>

                {/* <button class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" onClick={() => search()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

            Search
          </button>
          <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" onClick={() => clearSearch()}>
        

           Clear search
          </a> */}
              </div>
            </form>
            <button
              class=" h-[48px] ml-4 w-auto sm:w-auto whitespace-nowrap  px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              onClick={() => search()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search
            </button>
            <a
              class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              onClick={() => clearSearch()}
            >
              Clear search
            </a>
          </div>
        </div>
      ) : (
        <div class="w-full bg-white  px-4 sm:px-6 lg:px-8  mx-auto">
          <div class="text-center mx-auto mb-4 mt-4">
            <form id="search-form">
              <div class=" flex flex-col items-center gap-2 sm:flex-row sm:gap-3 mt-2">
                <div class="w-full">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium "
                  >
                    Job Title
                  </label>
                  <input
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    id="hero-input"
                    name="hero-input"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Ex: Landscaping, Hostess, Construction"
                  />
                </div>
                {/* <div className=" w-[560px]">
          <label for="hs-select-label" class="block text-sm font-medium  ">Pay Type</label>
<select id="hs-select-label" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
  <option selected="">Hourly</option>
  <option>Salary</option>
 
</select>
</div> */}
                <div class="w-full">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium  "
                  >
                    Pay Range
                  </label>
                  <select
                    onChange={(e) => setMinimumPay(e.target.value)}
                    id="hs-select-label"
                    value={minimumPay}
                    class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    <option value={null}>Select minimum pay</option>
                    <option value="10">$10/hour +</option>
                    <option value="15">$15/hour +</option>
                    <option value="20">$20/hour +</option>
                    <option value="25">$25/hour +</option>
                    <option value="30">$30/hour +</option>
                    <option value="35">$35/hour +</option>
                    <option value="40">$40/hour +</option>
                  </select>
                </div>
                <div class="w-full">
                  <label
                    for="hs-select-label"
                    class="block text-sm font-medium  "
                  >
                    Position Type
                  </label>
                  <select
                    onChange={(e) => setPositionType(e.target.value)}
                    id="hs-select-label"
                    class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    <option value={null}>Select position type</option>
                    <option value="true">Full-time</option>
                    <option value="false">Part-time</option>
                  </select>
                </div>

                <button
                  class="w-full sm:w-auto whitespace-nowrap py-3 px-4  mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  onClick={() => search()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  Search
                </button>
                <a
                  class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  onClick={() => clearSearch()}
                >
                  Clear search
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0  sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
              <div class="p-4 sm:p-7">
                <div class="text-center">
                  <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800 ">
                    No Results
                  </h2>
                  <div class="max-w-sm mx-auto">
                    <p class="mt-2 text-sm text-gray-600 ">
                      No jobs match your search
                    </p>
                    <p class="mt-2 text-sm text-gray-600 ">
                      Try broadening your search and try again for more results
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end items-center ">
                <button
                  onClick={() => onClose()}
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                  href="#"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JobFilter;
