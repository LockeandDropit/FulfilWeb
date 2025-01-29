import React from "react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";
import {
  query,
  collection,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Spinner,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Skeleton,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  VStack,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
import { CheckIcon } from "@chakra-ui/icons";

const DoerHeader = () => {
  const [user, setUser] = useState(null);

  const [hasRun, setHasRun] = useState(false);
  const navigate = useNavigate();

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

  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogOut = async () => {
    setLoggingOut(true);

    await signOut(auth)
      .then(
        setTimeout(() => {
          navigate("/");
        }, 2000)
      ) // undefined
      .catch((e) => console.log(e));
  };

  const [userFirstName, setUserFirstName] = useState("User");
  const [userLastName, setUserLastName] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        setEmail(snapshot.data().email);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    getDoc(doc(db, "users", user.uid)).then((snapshot) => {
      if (!snapshot.data().profilePictureResponse) {
      } else {
        setProfilePicture(snapshot.data().profilePictureResponse);
        console.log("profile picture", snapshot.data().profilePictureResponse);
      }
    });
  };

  const handleLinkOpen = (step) => {
    window.open(step.link)
  }

  console.log(profilePicture);

  //laoding control

  const [loading, setLoading] = useState(false);
  // setTimeout(() => {
  //   setLoading(false);
  // }, 1000);

  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(null);

  const [test, setTest] = useState("test");

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((snapshot) => {
          console.log(snapshot.data());
          setIsPremium(snapshot.data().isPremium);
        })
        .then(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        })
        .catch((error) => {
          // no buen
          console.log(error);
        });
    }
  }, [user]);

  useEffect(() => {
    console.log(isLoading, isPremium);
  }, [isLoading, isPremium]);

  const [subscriptionID, setSubscriptionID] = useState(null);

  const initializeSubscription = () => {
    //credit and help from https://github.com/pagecow/stripe-subscribe-payments
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ session }) => {
        setSubscriptionID(session.id);
        window.open(session.url, "_blank");
      })
      // .then(({ url }) => {
      //   // window.location = url
      //   window.open(url, "_blank")
      // })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "users", user.uid), {
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showDropdown, setShowDropdown] = useState(false);

  const {
    isOpen: isOPenMobileDash,
    onOpen: onOpenMobileDash,
    onClose: onCloseMobileDash,
  } = useDisclosure();

  //test response
  const [response, setResponse] = useState([
    {
      "id": 1,
      "career_name": "Art Teacher",
      "explanation": "As an Art Teacher, you can inspire and educate students in various artistic disciplines, sharing your love for painting and abstract art. This role allows you to foster creativity and appreciation for art in others.",
      "starting_salary": "$40,000 - $60,000",
      "career_range": "$40,000 - $80,000",
      "steps": [
        {
          "step_number": 1,
          "description": "Obtain a bachelor's degree in Art Education or a related field.",
          "link": "https://www.cehd.umn.edu/ci/academics/visual-art-education/"
        },
        {
          "step_number": 2,
          "description": "Complete a teacher preparation program to gain classroom experience.",
          "link": null
        },
        {
          "step_number": 3,
          "description": "Acquire state teaching certification to teach in public schools.",
          "link": "https://education.mn.gov/MDE/dse/lic/"
        },
        {
          "step_number": 4,
          "description": "Apply for art teaching positions in schools or community centers.",
          "link": "https://www.indeed.com/q-Art-Teacher-l-Minnesota-jobs.html"
        }
      ]
    },
    {
      "id": 2,
      "career_name": "Teaching Artist",
      "explanation": "As a Teaching Artist, you can integrate your artistic skills into educational settings, conducting workshops and programs that combine art creation with learning. This role allows you to work with diverse groups and share your passion for art.",
      "starting_salary": "$30,000 - $50,000",
      "career_range": "$30,000 - $70,000",
      "steps": [
        {
          "step_number": 1,
          "description": "Develop a strong portfolio showcasing your abstract paintings and teaching experience.",
          "link": null
        },
        {
          "step_number": 2,
          "description": "Network with local arts organizations and schools to find opportunities.",
          "link": null
        },
        {
          "step_number": 3,
          "description": "Consider joining professional associations, such as the Teaching Artists Guild.",
          "link": "https://teachingartistsguild.org/"
        },
        {
          "step_number": 4,
          "description": "Apply for teaching artist positions or propose workshops to educational institutions.",
          "link": "https://www.indeed.com/q-Teaching-Artist-l-Minnesota-jobs.html"
        }
      ]
    },
    {
      "id": 3,
      "career_name": "Art Therapist",
      "explanation": "As an Art Therapist, you can use the creative process of art to improve the mental and emotional well-being of clients. This role combines your artistic skills with a desire to help people, providing therapeutic support through art.",
      "starting_salary": "$45,000 - $55,000",
      "career_range": "$45,000 - $90,000",
      "steps": [
        {
          "step_number": 1,
          "description": "Earn a master's degree in Art Therapy from an accredited program.",
          "link": "https://www.adler.edu/programs/art-therapy-ma/"
        },
        {
          "step_number": 2,
          "description": "Complete required supervised clinical experience hours.",
          "link": null
        },
        {
          "step_number": 3,
          "description": "Obtain Art Therapy Certification through the Art Therapy Credentials Board.",
          "link": "https://www.atcb.org/"
        },
        {
          "step_number": 4,
          "description": "Apply for art therapist positions in healthcare settings, schools, or private practice.",
          "link": "https://www.indeed.com/q-Art-Therapist-l-Minnesota-jobs.html"
        }
      ]
    }
  ]
  );

  // const [response, setResponse] = useState(null);
  const [userSubmission, setUserSubmission] = useState(null);

  const testAI = async () => {
    setLoading(true);
    const response = await fetch(
      "https://openaiapi-c7qc.onrender.com/careerPathGeneration",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userSubmission }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse", json.message.content);

    setResponse(json.message.content);
  };

  useEffect(() => {
    if (response) {
      setLoading(false);
    }
  }, [response]);
  return (
    <>
      <header class="flex flex-wrap  md:justify-start md:flex-nowrap z-50 w-full bg-white  ">
        <nav class="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center gap-x-1">
            <button
              class="flex-none font-bold text-4xl focus:outline-none text-sky-400"
              onClick={() => navigate("/DoerHomepage")}
              aria-label="Brand"
            >
              Fulfil
            </button>
          </div>
          <div
            id="hs-header-base"
            class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block "
            aria-labelledby="hs-header-base-collapse"
          >
            <div class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
              <div class="py-2 md:py-0  flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
                <div class="grow">
                  <div class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                    <button
                      class="pt-2  px-2 flex items-center font-medium pointer-default text-gray-800 hover:underline  rounded-lg   "
                      onClick={() => navigate("/DoerHomepage")}
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                      Home
                    </button>
                    <a
                      class="pt-2  px-2 flex items-center font-medium  text-gray-800 hover:underline cursor-pointer rounded-lg   "
                      onClick={() => navigate("/CareerPaths")}
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Career Paths
                    </a>
                    <button
                      class="pt-2  px-2 flex items-center font-medium pointer-default text-gray-800 hover:underline  rounded-lg   "
                      onClick={() => onOpen()}
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                      Career Coach
                    </button>
                    <a
                      class="pt-2  px-2 flex items-center font-medium  text-gray-800 hover:underline cursor-pointer rounded-lg   "
                      onClick={() => navigate("/Resources")}
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Resources
                    </a>
                  </div>
                </div>
                <div class="mt-2 md:mt-2 md:mx-2">
                  <div class="w-full h-px md:w-px md:h-4 bg-gray-100 md:bg-gray-300 dark:bg-neutral-700"></div>
                </div>
                <Menu>
                  <MenuButton _hover={{ textDecoration: "underline" }}>
                    <a
                      class="pt-2  px-2 flex items-center font-medium  text-gray-800 hover:underline  rounded-lg"
                      aria-current="page"
                    >
                      <svg
                        class="shrink-0 size-4 me-3 md:me-2 block md:hidden"
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
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                        <path d="M18 14h-8" />
                        <path d="M15 18h-5" />
                        <path d="M10 6h8v4h-8V6Z" />
                      </svg>
                      Profile
                    </a>
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => navigate("/DoerAccountManager")}>
                      <p class="hs-accordion-toggle px-4 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex    text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                        {" "}
                        Account Settings
                      </p>
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/MyProfile")}>
                      <p class="hs-accordion-toggle px-4 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex   text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                        {" "}
                        My Profile
                      </p>
                    </MenuItem>
                    {/* <MenuItem onClick={() => navigate("/DoerPaymentHistory")}>Payment History</MenuItem> */}

                    {loggingOut ? (
                      <Center>
                        <Spinner />
                      </Center>
                    ) : (
                      <Center>
                        <Button
                          width="160px"
                          colorScheme="red"
                          height="32px"
                          marginTop="8px"
                          onClick={() => handleLogOut()}
                        >
                          Log Out
                        </Button>
                      </Center>
                    )}
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8  mx-auto">
              <div className=" md:items-center">
                <div className="mt-5 sm:mt-10 lg:mt-0">
                  <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-2 md:space-y-4">
                      <h2 className="font-bold text-2xl lg:text-4xl text-gray-800">
                        Let's find the right fit
                      </h2>
                      <p className="text-gray-500">
                        I'm your career coach. Tell me a bit about yourself and
                        I'll help you find a career that fits you. Tell me
                        things like:
                      </p>
                    </div>

                    <ul className="space-y-2 sm:space-y-2">
                      <li className="flex gap-x-3">
                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                          <svg
                            className="shrink-0 size-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <div className="grow">
                          <span className="text-sm sm:text-base text-gray-500">
                            What your interests are.
                            {/* <span className="font-bold">Easy & fast</span> designing */}
                          </span>
                        </div>
                      </li>

                      <li className="flex gap-x-3">
                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                          <svg
                            className="shrink-0 size-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <div className="grow">
                          <span className="text-sm sm:text-base text-gray-500">
                            What skills you have{" "}
                            <span className="font-bold">OR</span> want to have.
                          </span>
                        </div>
                      </li>

                      <li className="flex gap-x-3">
                        <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                          <svg
                            className="shrink-0 size-3.5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <div className="grow">
                          <span className="text-sm sm:text-base text-gray-500">
                            The type of work environment you want to be a part
                            of.
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="w-full space-y-3 mt-4 sm:mt-10">
                <textarea
                  onChange={(e) => setUserSubmission(e.target.value)}
                  class=" py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                  rows="4"
                  placeholder="ex: I've recently graduated from highschool and want to work with my hands. I'd like to do something mechanical, but don;t know where to get started."
                ></textarea>
              </div>
            </div>

            <div className="w-full flex mt-6">
              {loading ? (
                <button
                  type="button"
                  class="ml-auto py-3 px-6 items-center gap-x-2 font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div
                    class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => testAI()}
                  type="button"
                  class="ml-auto py-3 px-6 items-center gap-x-2 font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Submit
                </button>
              )}
            </div>
            {loading && (
               <div>
               <h2 className="text-lg text-black font-semibold mt-3">
                 Career advice:
               </h2>
               <p className="mt-1">
                 {response.map((resp) => (
                   <div className="flex flex-col sm:flex-row mt-4 md:mt-2 p-1 w-full ">
                     <div class=" p-5 space-y-4 flex flex-col  rounded-xl ">
                       {/* <div class="flex justify-between">
                         <div class="flex flex-col justify-center items-center rounded-lg ">
                           <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                             <svg
                               class="shrink-0 size-4"
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
                               <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                               <polyline points="16 7 22 7 22 13"></polyline>
                             </svg>
                           </span>
                         </div>
                       </div> */}

                       <div>
                         <h3 class="font-medium text-xl text-gray-800">
                           {resp.career_name}
                         </h3>

                         <div className="mt-1 flex flex-col">
                           <div className="flex flex-row">
                            
                               <p className="mr-1 font-medium text-sm text-gray-800">
                                 Starting Salary:
                               </p>{" "}
                               <h3 class="text-sm text-gray-500">
                               {resp.starting_salary}
                             </h3>{" "}
                           </div>
                           <div className="flex flex-row">
                 
                               <p className="mr-1 font-medium text-sm text-gray-800">
                                 Average Salary:
                               </p>{" "}
                               <h3 class="text-sm text-gray-500 ">
                               {resp.career_range}
                 
                             </h3>
                           </div>
                         </div>
                         <p className="mt-5 font-medium  text-gray-800">
                                About
                               </p>{" "}
                         <p class=" text-gray-700 line-clamp-4 ">
                           {resp.explanation}
                         </p>

                         <p className="mt-5 font-medium  text-gray-800">
                                Steps
                               </p>{" "}
                         <ul class="ml-4 text-gray-700 list-decimal">
                           {resp.steps.map((step) => (
                             step.link ? (
                             <div className="flex flex-row">
<li className="hover:underline cursor-pointer" onClick={() => handleLinkOpen(step)}>{step.description}</li> <span> <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke-width="1.25"
                                 stroke="currentColor"
                                 class="size-3 ml-1 hover:underline"
                               >
                                 <path
                                   stroke-linecap="round"
                                   stroke-linejoin="round"
                                   d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                 />
                               </svg></span>
                               
                             </div>): ( <div className="flex flex-row">
<li className="">{step.description}</li> 
                             </div>) 

                            
                           ))}
                         </ul>
                       </div>

                       <div className="flex mt-auto mb-1">
                         <button
                           type="button"
                           class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50  "
                         >
                           Save
                         </button>
                         {/* <button
         type="button"
         class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
         onClick={() => handleOpenJob(edu)}
       >
         Apply
       </button> */}
                         <button
                           type="button"
                           class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                           // onClick={() => handleOpenJob(edu)}
                         >
                           Add to interests
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
             
               </p>
             </div>
            )}
            {response && (
              <div>
                <h2 className="text-lg text-black font-semibold mt-3">
                  Career advice:
                </h2>
                <p className="mt-1">
                  {response.map((resp) => (
                    <div className="flex flex-col sm:flex-row mt-4 md:mt-2 p-1 w-full ">
                      <div class=" p-5 space-y-4 flex flex-col  rounded-xl ">
                        {/* <div class="flex justify-between">
                          <div class="flex flex-col justify-center items-center rounded-lg ">
                            <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                              <svg
                                class="shrink-0 size-4"
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
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                              </svg>
                            </span>
                          </div>
                        </div> */}

                        <div>
                          <h3 class="font-medium text-xl text-gray-800">
                            {resp.career_name}
                          </h3>

                          <div className="mt-1 flex flex-col">
                            <div className="flex flex-row">
                             
                                <p className="mr-1 font-medium text-sm text-gray-800">
                                  Starting Salary:
                                </p>{" "}
                                <h3 class="text-sm text-gray-500">
                                {resp.starting_salary}
                              </h3>{" "}
                            </div>
                            <div className="flex flex-row">
                  
                                <p className="mr-1 font-medium text-sm text-gray-800">
                                  Average Salary:
                                </p>{" "}
                                <h3 class="text-sm text-gray-500 ">
                                {resp.career_range}
                  
                              </h3>
                            </div>
                          </div>
                          <p className="mt-5 font-medium  text-gray-800">
                                 About
                                </p>{" "}
                          <p class=" text-gray-700 line-clamp-4 ">
                            {resp.explanation}
                          </p>

                          <p className="mt-5 font-medium  text-gray-800">
                                 Steps
                                </p>{" "}
                          <ul class="ml-4 text-gray-700 list-decimal">
                            {resp.steps.map((step) => (
                              step.link ? (
                              <div className="flex flex-row">
 <li className="hover:underline cursor-pointer" onClick={() => handleLinkOpen(step)}>{step.description}</li> <span> <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.25"
                                  stroke="currentColor"
                                  class="size-3 ml-1 hover:underline"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                  />
                                </svg></span>
                                
                              </div>): ( <div className="flex flex-row">
 <li className="">{step.description}</li> 
                              </div>) 
 
                             
                            ))}
                          </ul>
                        </div>

                        <div className="flex mt-auto mb-1">
                          <button
                            type="button"
                            class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50  "
                          >
                            Save
                          </button>
                          {/* <button
          type="button"
          class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
          onClick={() => handleOpenJob(edu)}
        >
          Apply
        </button> */}
                          <button
                            type="button"
                            class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                            // onClick={() => handleOpenJob(edu)}
                          >
                            Add to interests
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <Markdown>{response}</Markdown> */}
                </p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerHeader;
