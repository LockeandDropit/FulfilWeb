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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  const { setSearchResults, searchIsMobile } = useSearchResults();

  const [ isSmall ] = useMediaQuery('(min-width: 700px )')

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
  const [jobTitleSearchResults, setJobTitleSearchResults] = useState(null);
  const [jobCategory, setJobCategory] = useState(null)

  const [displayedCategory, setDisplayedCategory] = useState(null)
  const [jobsInCategory, setJobsInCategory] = useState(null)
  const [viewDropDown, setViewDropDown] = useState(false)



  const handleSearch = (value) => {
    // testSearch(value);
    setJobTitle(value);
  };

  // useEffect(() => {
  //   console.log("firing", jobCategory, minimumPay, positionType)
  // }, [jobTitle, minimumPay, positionType])

  // const testSearch = (value) => {
  //   const q = query(collection(db, "Map Jobs"));

  //   // is this super expensive and going to cause our FB cost to shoot up?
  //   const searchResults = [];
  //   onSnapshot(q, (snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       if (doc.data().lowerCaseJobTitle.includes(value.toLowerCase()) || doc.data().description.includes(value.toLowerCase())  && doc.data().isActive === true) {
  //         searchResults.push(doc.data());
  //         // console.log("here are search results", doc.data())
  //       }
  //     });


  //     // console.log("search results to close bar", searchResults)
  //     if (!searchResults.length || !searchResults || !value.length) {
  //       setViewDropDown(false)
  //       setJobTitleSearchResults(null)
  //       setViewDropDown(false)
  //     } else {
  //       setJobTitleSearchResults(searchResults);
  //     }

  //     //if value > 2 (3?)
  //     //if a & b contain "main root", show just one of those jobs
  //     //some code to see if this word appears more than once, if it does, only render it one time in the autocomplete but keep the jobs all stored in the search results
      
  //   });

  //   // console.log("jobtitle search results", jobTitleSearchResults)
  //   if (value.length >= 2 && jobTitleSearchResults) {
  //     let splitTitle = jobTitleSearchResults[0].lowerCaseJobTitle.split(" ");
  //     console.log("split title", splitTitle[0]);
  //     let firstWord = splitTitle[0]
  //     var categoryTitle = null
  //     let allMatchingTitleJobs = [];


  //       jobTitleSearchResults.forEach((results) => {
  //         if (results.lowerCaseJobTitle.includes(firstWord)) {
  //           categoryTitle = firstWord
  //           allMatchingTitleJobs.push(results)
  //           console.log("from inner forEach", results)
  //         }
  //       });
      



  //     setDisplayedCategory(categoryTitle)
  //     setJobsInCategory(allMatchingTitleJobs)
  //     setViewDropDown(true)
  //   }
  // };

  const handleRenderJobCategory = () => {
setViewDropDown(false)
setSearchResults(jobsInCategory)
search()
  }



  // useEffect(() => {
  //   if (displayedCategory && jobsInCategory) {
  //     console.log("here we gooo", displayedCategory, jobsInCategory)
  //   }
  // }, [displayedCategory, jobsInCategory])

  // map over (filter) all jobs on narrowed search (where value >= 2) and look for a word match. If all results contain that word, that is set & displayed as the category

  const search = () => {

    // resetSearch()

    console.log("firing", jobCategory, minimumPay, positionType)

    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {
        //if a b c we are not solving for salary right now

        if (jobCategory && !minimumPay && !positionType) {
          if (doc.data().category === jobCategory && doc.data().isActive === true) {
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
            console.log("job category", doc.data());
          } else {
            // onOpen()
            console.log("1");
          }
        } else if (jobCategory && minimumPay && !positionType) { 
          console.log("title and minimum");
          if (
            doc.data().category === jobCategory  &&
            doc.data().lowerRate >= minimumPay
             && doc.data().isActive === true
          ) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log("2", minimumPay, doc.data().lowerRate);
          }
        } else if (jobCategory && !minimumPay && positionType) {
          console.log("title and type");
          var isTrueSet = /^true$/i.test(positionType);
          if (
            doc.data().category === jobCategory &&
            doc.data().isFullTimePosition === isTrueSet && doc.data().isActive === true
          ) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log("3");
          }
        } else if (jobCategory && minimumPay && positionType) {
          console.log("title, minimum, type");
          var isTrueSet = /^true$/i.test(positionType);
          if (
            doc.data().category === jobCategory &&
            doc.data().lowerRate >= minimumPay &&
            doc.data().isFullTimePosition === isTrueSet && doc.data().isActive === true
          ) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log("4", isTrueSet, doc.data().isFullTimePosition);
          }
        } else if (minimumPay && !jobTitle && !positionType) {
          console.log("minimum", minimumPay);
          if (doc.data().lowerRate >= minimumPay && doc.data().isActive === true) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log("5");
          }
        } else if (minimumPay && !jobTitle && positionType) {
          console.log("minimum & type");
          var isTrueSet = /^true$/i.test(positionType);
          if (
            doc.data().lowerRate >= minimumPay &&
            doc.data().isFullTimePosition === isTrueSet && doc.data().isActive === true
          ) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log("6");
          }
        } else if (positionType && !minimumPay && !jobTitle) {
          console.log("type", positionType, doc.data().isFullTimePosition);
          //from https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript credit guinaps
          var isTrueSet = /^true$/i.test(positionType);
          if (            
            doc.data().isFullTimePosition === isTrueSet && doc.data().isActive === true
          ) {
            console.log("heres your match with pay", doc.data());
            results.push({ ...doc.data(), id: doc.id, key: doc.id  });
          } else {
            // onOpen()
            console.log(typeof positionType);
            console.log(typeof doc.data().isFullTimePosition);
          }
        } else {
          // onOpen()
        }
      });

      if (!results || !results.length) {
        onOpen();
        console.log("results", results)
        setSearchResults(null);
      } else {
        console.log("new results", results)
        setSearchResults(results);
        
      }
     
    });
  }; 

  const clearSearch = () => {
    resetSearch();
    setSearchResults(null);
    setJobCategory(null);
    setMinimumPay(null);
    setPositionType(null);
    setViewDropDown(false)
  };

  //uhh set all of this in context as SearchResultJobs and check w/conditional rendering on primary screen. Set them as business posted jobs. set all other jobs null?

  //Job title takes input, puts it all to lower case, checks it against all jobs lowercase title, seeing if it contains the input. does x contain y

  const resetSearch = () => {
    document.getElementById("search-form").reset();
  };

  const [filterIsOpen, setFilterIsOpen] = useState(false)

  // useEffect(() => {
  //   //ty molevolence https://www.reddit.com/r/reactjs/comments/w8hdd5/how_to_handle_keyboard_events_the_proper_way_in/
  //   const handleKeyDown = (e) => {
  //     if (e.key === "Enter") {
  //       // search()
  //       e.preventDefault();
  //       search()
  //     }
  //   };
   
  

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);


    //listen for enter button to and call modalValidate
  // ty buddy https://www.youtube.com/watch?v=D5SdvGMTEaU&t=71s

// useEffect(() => {
//   document.addEventListener('keydown', handleKeyDown, true);
// }, [])

// const handleKeyDown = (e) => {
//   console.log("hit enter")
// if (e.key === "Enter") {

//   e.preventDefault();
//   search()
// }
// };



  return (
    <>
      {isDesktop ? ( 
        <div class=" w-full bg-white px-4 sm:px-6 lg:px-8 rounded border border-t">
        {/* <div class="flex flex-row items-center align-center justify-center mx-auto mb-4 mt-4"> */}
        <div class="grid sm:inline-flex mt-2 mb-2 ">
        <form id="search-form">
          <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          {/* <div className="w-[120px] sm:w-[240px]">
              
                <input
                  onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                  onChange={(e) => handleSearch(e.target.value)}
                  class="placeholder:text-gray-600 placeholder:font-normal placeholder:text-base  py-3.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Job Title"
                />
               
              </div> */}
      
              <div className="w-3/4 sm:w-[240px]">
              
                <select
                onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                  onChange={(e) => setMinimumPay(e.target.value)}
                  id="hs-select-label"
                  value={minimumPay}
                  class="  py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-base focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                >
                  <option value={null}>Pay</option>
                  
                  <option value="10">$10/hour +</option>
                  <option value="15">$15/hour +</option>
                  <option value="20">$20/hour +</option>
                  <option value="25">$25/hour +</option>
                  <option value="30">$30/hour +</option>
                  <option value="35">$35/hour +</option>
                  <option value="40">$40/hour +</option>
                </select>
              </div>
              
              <div className="w-3/4 sm:w-[240px] ">
               
                <select
                 onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                  onChange={(e) => setPositionType(e.target.value)}
                  id="hs-select-label"
                  class=" py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-medium focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                >
                  <option value={null}>Job Type</option>

                  <option value={true} class="text-medium">Full-time</option>
                  <option value={false}>Part-time</option>
                  {/* <option value="gigwork">Gig-work</option> */}
                </select>
              </div>
              <div className="w-3/4 sm:w-[320px]">
              
              <select
                        placeholder="Category"
                        class="py-3 px-4 pe-9 block w-full bg-white border-gray-200 rounded-lg  focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        onChange={(e) => setJobCategory(e.target.value)}
                      >
                        <option value={null}>Category</option>
                        <option value="Healthcare & Ambulatory Health Care">Healthcare & Ambulatory Health Care</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Construction">Construction</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Warehousing">Warehousing</option>
                        <option value="Accommodation & Food Services">Accommodation & Food Services</option>
                        <option value="Arts, Entertainment, and Recreation">Arts, Entertainment, and Recreation</option>
                        <option value="Agriculture, Forestry">Agriculture, Forestry</option>
                        <option value="Utilities">Utilities</option>
                        <option value="General Physical Labor">General Physical Labor</option>
                      </select>
              </div>
            
            </div>
          </form>
          <button
            class="mt-2 sm:mt-0 h-[48px] ml-4 w-auto sm:w-auto whitespace-nowrap  pl-8 pr-10  inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => search()}
            onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault() }}
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
            class="w-full sm:w-auto whitespace-nowrap py-3 px-4  ml-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => clearSearch()}
            onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          >
            Clear
          </a>
</div>
  
      </div>
      
        
      ) : (
        <Menu closeOnSelect={true}>
          {filterIsOpen ? ( <MenuButton width={{ base: "100%" }} onClick={() => setFilterIsOpen(false)}>
            <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-600 hover:bg-blue-700 cursor-pointer">
              
              Filter
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mt-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

            </a>
          </MenuButton>) : (
            
          <MenuButton width={{ base: "100%" }} onClick={() => setFilterIsOpen(true)}>
          <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-600 hover:bg-blue-700 cursor-pointer">
            Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </a>
        </MenuButton>
          )}
         

        
          <MenuList width={{ base: "100vw" }}>
            <div class="w-full bg-white  px-4 sm:px-6 lg:px-8  mx-auto">
              <div class="text-center mx-auto mb-4 mt-4">
                <form id="search-form">
                  <div class=" flex flex-col items-center gap-2 sm:flex-row sm:gap-3 mt-2">
                    {/* <div class="w-full">
                      <label
                        for="hs-select-label"
                        class="block text-sm font-medium "
                      >
                        Job Title
                      </label>
                      <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        id="hero-input"
                        name="hero-input"
                        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Ex: Landscaping, Hostess, Construction"
                      />
                    </div> */}
                    {jobsInCategory && viewDropDown ? (
                    <div class=" w-full z-60  shadow-md mb-2 pb-3 px-4 block  bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                      <p className="font-semibold text-medium cursor-default">Category</p>
                  
                      <p className="text-medium cursor-pointer mb-2  " onClick={() => handleRenderJobCategory()}>{displayedCategory}</p>
                    
                      <p  className="font-semibold text-medium cursor-default">Matches</p>
                      {jobsInCategory.map((results) => (
                        <p className=" text-medium cursor-pointer mb-1">{results.jobTitle}</p>
                      ))}
                    </div>
                  ) : null}
              
                    <div class="w-full">
                    
                      <select
                        onChange={(e) => setMinimumPay(e.target.value)}
                        id="hs-select-label"
                        value={minimumPay}
                        class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                      >
                        <option value={null}>Pay Range</option>
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
                  
                   
                      <select
                        onChange={(e) => setPositionType(e.target.value)}
                        id="hs-select-label"
                        class="mt-2 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                      >
                        <option value={null}>Position Type</option>
                        <option value={true}>Full-time</option>
                        <option value={false}>Part-time</option>
                     
                      </select>
                    </div>
                  </div>
                </form>
                <MenuItem>
                  {" "}
                  <button
                    class="w-full sm:w-auto whitespace-nowrap py-3 px-4  mt-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    onClick={() => search()}
                  >
                    Search
                  </button>
                </MenuItem>
                <a
                  class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  onClick={() => clearSearch()}
                >
                  Clear 
                </a>
              </div>
            </div>
          </MenuList>
        </Menu>
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
