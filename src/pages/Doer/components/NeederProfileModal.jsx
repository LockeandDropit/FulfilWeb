import React from 'react'
import { useEffect, useState, useCallback } from "react";
import { useUserStore } from '../Chat/lib/userStore';
import { useChatStore } from '../Chat/lib/chatStore';
import { useMediaQuery } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import { db } from '../../../firebaseConfig';
import { useNavigate } from "react-router-dom";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Flex,
    Box,
    Image,
    Text
  } from '@chakra-ui/react'
  import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import {
    doc,
    getDoc,
    query,
    collection,
    onSnapshot,
    updateDoc,
    addDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    arrayUnion,
  } from "firebase/firestore";


const NeederProfileModal = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId, user, changeChat } = useChatStore();

    useEffect(() => {
        onOpen()
    }, [])

    const [isDesktop] = useMediaQuery("(min-width: 500px)");
    console.log("user from modal", user)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

    const [userExperience, setUserExperience] = useState(null);
    const [userSkills, setUserSkills] = useState(null);
    const [userExperienceLength, setUserExperienceLength] = useState(0);


    const getProExp = () => {
       
        // should this be done on log ina nd stored in redux store so it's cheaper?
        const skillsQuery = query(
          collection(db, "users", user.uid, "User Profile Skills")
        );
        const experienceQuery = query(
          collection(db, "users", user.uid, "User Profile Experience")
        );
    
     
    
        onSnapshot(experienceQuery, (snapshot) => {
          let experience = [];
          snapshot.docs.forEach((doc) => {
            //review what this does
            experience.push({ ...doc.data(), id: doc.id });
          });
    
          // setUserExperience(experience);
          if (!experience || !experience.length) {
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
            setUserExperience(null);
            setUserExperienceLength(0);
          } else {
            setUserExperience(experience);
            setUserExperienceLength(experience.length);
          }
        });
      };

      const [emblaRef, emblaApi] = useEmblaCarousel();

      const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
      }, [emblaApi]);
    
      const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
      }, [emblaApi]);

      const navigate = useNavigate();
      
      const handleClose = () => {


        navigate("/DoerChatHolder", {state: {profileModalReset: true}})
      }


  return (
    <div> <Modal isOpen={isOpen} onClose={() => handleClose()} size="4xl" >
    <ModalOverlay />

    <ModalContent>
      <ModalCloseButton />
      <main id="content" class="pt-[30px]">
        <div class="max-w-6xl mx-auto">
          <ol class="md:hidden py-3 px-2 sm:px-5 flex items-center whitespace-nowrap">
            {/* <li class="flex items-center text-sm ">
              User Profile
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
              class="text-sm font-semibold text-gray-800 truncate "
              aria-current="page"
            >
              Profile
            </li> */}
          </ol>

          <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
            <div class="p-5 pb-0 bg-white border border-gray-200 shadow-sm rounded-xl ">
              <figure>
                <svg
                  class="w-full"
                  preserveAspectRatio="none"
                  width="1113"
                  height="161"
                  viewBox="0 0 1113 161"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_666_220723)">
                    <rect
                      x="0.5"
                      width="1112"
                      height="161"
                      rx="12"
                      fill="white"
                    ></rect>
                    <rect x="1" width="1112" height="348" fill="#D9DEEA"></rect>
                    <path
                      d="M512.694 359.31C547.444 172.086 469.835 34.2204 426.688 -11.3096H1144.27V359.31H512.694Z"
                      fill="#C0CBDD"
                    ></path>
                    <path
                      d="M818.885 185.745C703.515 143.985 709.036 24.7949 726.218 -29.5801H1118.31V331.905C1024.49 260.565 963.098 237.945 818.885 185.745Z"
                      fill="#8192B0"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_666_220723">
                      <rect
                        x="0.5"
                        width="1112"
                        height="161"
                        rx="12"
                        fill="white"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </figure>

              {/* {profilePicture ? (<img
                    class="object-cover size-full rounded-full"
                    src={profilePicture}
                    
                    alt="Image Description"
                  />) :  ( <svg class="size-full text-gray-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                  <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                  <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                </svg>) } */}

              <div class="-mt-24">
                <div class="relative flex w-[120px] h-[120px] mx-auto border-4 border-white rounded-full ">
                  {user.profilePictureResponse ? (
                    <img
                      class="object-cover size-full rounded-full"
                      src={user.profilePictureResponse}
                      alt="Image Description"
                    />
                  ) : (
                    <svg
                      class="size-full text-gray-500"
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

                  <div class="absolute bottom-0 -end-2">
                   
                  </div>
                </div>

            

                <div class="mt-3 text-center">
                  <h1 class="text-xl font-semibold text-gray-800 ">
                    {user.firstName} {user.lastName}
                  </h1>
                  {/* <p class="text-gray-500 ">
                          iam_amanda
                        </p> */}
                </div>
              </div>

              <div class="mt-7 py-0.5 flex flex-row justify-between items-center gap-x-2 whitespace-nowrap overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
             

                <div class="pb-3">
                  {/* <a
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    href="../../pro/dashboard/account-profile.html"
                  >
                    Edit
                  </a> */}
                </div>
              </div>
            </div>

            <div class="xl:p-5 flex flex-col xl:bg-white xl:border xl:border-gray-200 xl:shadow-sm xl:rounded-xl ">
              <div class="xl:flex">
                <div
                  id="hs-pro-dupsd"
                  class="hs-overlay [--auto-close:xl] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-[320px] bg-white p-5 overflow-y-auto xl:relative xl:z-0 xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 xl:p-0 border-e border-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 "
                >
                  <div class="xl:hidden">
                    <div class="absolute top-2 end-4 z-10">
                      <button
                        type="button"
                        class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-pro-dupsd"
                      >
                        <span class="sr-only">Close</span>
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
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>



                  <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                    <div class="pt-4 first:pt-0">
                      <h2 class="text-sm font-semibold text-gray-800 ">
                        About
                      </h2>

                      <ul class="mt-3 space-y-2">
                        {user.businessName ? (
                          <li>
                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 "
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
                            </div>
                          </li>
                        ) : null}

                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
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
                            {user.city}, {user.state}
                          </div>
                        </li>
                        <li>
                          {/* <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            {numberOfRatings ? (
                              <Flex>
                                {maxRating.map((item, key) => {
                                  return (
                                    <Box
                                      activeopacity={0.7}
                                      key={item}
                                      marginTop="4px"
                                    >
                                      <Image
                                        boxSize="16px"
                                        src={
                                          item <= rating
                                            ? star_filled
                                            : star_corner
                                        }
                                      ></Image>
                                    </Box>
                                  );
                                })}

                                <Text marginTop="4px" marginLeft="4px">
                                  ({numberOfRatings} reviews)
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
                          </div> */}
                        </li>
                        {/* <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
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
                            {user.email}
                          </div>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* start specialty modal */}

                {/* end specialty modal */}




                {/* test */}

                {isDesktop ? (null) : (   <div class="xl:ps-5 grow space-y-5">
                  <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                    {/* Start about */}
                    <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                    <div class="pt-4 first:pt-0">
                      <h2 class="text-sm font-semibold text-gray-800 ">
                        Details
                      </h2>

                      <ul class="mt-3 space-y-2">
                        {user.businessName ? (
                          <li>
                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                              <svg
                                class="flex-shrink-0 size-4 text-gray-600 "
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
                            </div>
                          </li>
                        ) : null}

                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
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
                            {user.city}, {user.state}
                          </div>
                        </li>
                        <li>
                          {/* <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            {numberOfRatings ? (
                              <Flex>
                                {maxRating.map((item, key) => {
                                  return (
                                    <Box
                                      activeopacity={0.7}
                                      key={item}
                                      marginTop="4px"
                                    >
                                      <Image
                                        boxSize="16px"
                                        src={
                                          item <= rating
                                            ? star_filled
                                            : star_corner
                                        }
                                      ></Image>
                                    </Box>
                                  );
                                })}

                                <Text marginTop="4px" marginLeft="4px">
                                  ({numberOfRatings} reviews)
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
                          </div> */}
                        </li>
                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            <svg
                              class="flex-shrink-0 size-4 text-gray-600 "
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
                            {user.email}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  </div>
                  </div>
                  </div>
)}
             
                {/* end test */}

                <div class="xl:ps-5 grow space-y-5">
                  <div class="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none ">
                    {/* Start about */}
                    <div class="p-5 pb-2  flex flex-column sm:flex sm:justify-between sm:items-center gap-2">
                      <h2 class="inline-block font-semibold text-gray-800 ">
                        About
                      </h2>

                      {user.bio ? (
                        <div class="flex sm:justify-end items-center gap-x-2">
                        
                        </div>
                      ) : null}
                    </div>
                 

                    {user.bio ? (
                      <div class=" text-left flex justify-start w-full  bg-white  rounded-xl ">
                        <div class="h-full p-6">
                          <p class=" text-md  text-black ">{user.bio}</p>
                        </div>
                        {/* <!-- End Body --> */}
                      </div>
                    ) : (
                      <div class="p-5 min-h-[160px] flex flex-col justify-center items-center text-center">
                        {" "}
                        <div class="max-w-sm mx-auto">
                          <p class="mt-2 font-medium text-gray-800 ">
                            Nothing here
                          </p>
                          <p class="mb-5 text-sm text-gray-500 "></p>
                        </div>
                      
                      </div>
                    )}
                    {/* end about */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ModalContent>
  </Modal></div>
  )
}

export default NeederProfileModal