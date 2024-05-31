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
import ApplicantModal from "./ApplicantModal";
import { useNavigate } from "react-router-dom";
import EmbeddedPaymentsJobDetails from "../Components/EmbeddedPaymentsJobDetails";

const JobDetailsReadyToPay = () => {
  const { job } = useJobStore();
  console.log(job);
  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [numberOfRatings, setNumberOfRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const secondQuery = doc(db, "users", job.hiredApplicant);
    let finalResults = [];
    getDoc(secondQuery).then((snapshot) => {
      // if empty https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
      // if (Object.keys(snapshot.data()).length !== 0) {
      //   finalResults.push({ ...snapshot.data() });
      // } else {
      //   console.log("ehh");
      // }

      if (!snapshot.data()) {
        console.log("nothing");
        // console.log(snapshot.data())
      } else {
        finalResults.push({
          ...snapshot.data(),
          id: snapshot.data().hiredApplicant,
        });
      }
    
      setTimeout(() => {
        setApplicant(finalResults[0]);
        console.log("this is your applicant(s)", finalResults[0]);
      }, 50);

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
}, [])

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

  const [applicantVisible, setApplicantVisible] = useState(false)
  
  const handleApplicantVisible = () => {
    setApplicantVisible(true)
    //also pass job info so chat can be started.
  }

  const navigateToChannel = (x) => {
    console.log("this is what youre passing", x);
    navigate("/NeederChatEntry", {
      state: { selectedChannel: x.channelID, applicant: x },
    });
    // console.log("mesage channel",x);
  };

  const [paymentVisible, setPaymentVisible] = useState(false);

  const handlePaymentVisible = () => {
    setPaymentVisible(!paymentVisible);
  };
  return (
    <>
      <Header />
      <Dashboard />
      {job ? (
        <main id="content" class="lg:ps-[260px] pt-[59px]">
          <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
           

            <div class="py-2 sm:pb-0 sm:pt-5 space-y-5">
              <div class="grid sm:flex sm:justify-between sm:items-center gap-3 sm:gap-5">
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p class="inline-flex justify-between items-center gap-x-1">
                      <a
                        class="text-sm bg-green-100 px-2 text-green-700  decoration-2  font-medium cursor-default "
                      
                      >
                        In Progress
                      </a>
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
                      // onClick={() => setEditVisible(true)}
                      class="py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm font-medium rounded-lg border  bg-red-300 text-white shadow-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 "
                    >
                     cancel
                      
                    </button> */}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-6 gap-5">
                <div class="lg:col-span-4 space-y-4">
                  <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                    <div class="py-3 px-5 flex justify-between items-center gap-x-5 border-b border-stone-200 ">
                      <h2 class="inline-block font-semibold text-stone-800  cursor-default ">
                        Post Info
                      </h2>
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-700  rounded-full cursor-default">
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
                      <div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Type
                        </label>
                        {job.isFlatRate ? <p>Flat Rate</p> : <p>Hourly</p>}
                      </div>

                      <div className="cursor-default ">
                        <label
                          for="hs-pro-epdsku"
                          class="block mb-2 text-sm font-medium text-stone-800 "
                        >
                          Pay Rate
                        </label>
                        {job.isFlatRate ? (
                          <p>${job.confirmedRate} total</p>
                        ) : (
                          <p>
                           ${job.confirmedRate}/hour
                          </p>
                        )}
                      </div>
                      <div className="cursor-default ">
                        <label class="block mb-2 text-sm font-medium text-stone-800 ">
                          Description
                        </label>
                        {job.description}
                      </div>
                    </div>
                  </div>

                  {editVisible ? <EditSelectedJob props={job} /> : null}

               
                </div>

                <div class="lg:col-span-2">
                  <div class="lg:sticky lg:top-5 space-y-4">
                    <div class="flex flex-col bg-white border border-stone-200 overflow-hidden rounded-xl shadow-sm ">
                      <div class="py-3 px-5  justify-between items-center gap-x-5 border-b border-stone-200 ">
                        <h2 class="inline-block font-semibold text-stone-800 cursor-default">
                          You've hired:
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
                                      class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                      onClick={() =>
                                        navigateToChannel(
                                          applicant
                                        )
                                      }
                                      // onClick={() => handleApplicantVisible()}
                                    >
                                      Messages
                                      <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                        New
                                      </span>
                                    </button>
                                    <button   onClick={() => handlePaymentVisible()} className="py-2 px-3  w-full text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 ">
                          Pay
                        </button>
                                  </>
                                ) : (
                                  <>
                               
                                   <button
                                   type="button"
                                 
                                    onClick={() =>
                                      navigateToChannel(
                                        applicant
                                      )
                                    }
                           
                             
                                   class="py-2 px-2  inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-blue-600 text-white shadow-sm hover:bg-blue-700  "
                                 >
                                   Messages
                                 </button>
                                 <button   onClick={() => handlePaymentVisible()} className="py-2 px-3  w-full text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 ">
                          Pay
                        </button>
                                 </>
                                )}
                              </div>
                              {paymentVisible ? <EmbeddedPaymentsJobDetails props={job}/> : null}
                              {applicantVisible ? <ApplicantModal props={applicant} /> : null}
                            </>
    
                            //applicantModal here
                        
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

export default JobDetailsReadyToPay;
