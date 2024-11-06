import React from "react";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../../firebaseConfig";
import Markdown from "react-markdown";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Divider,
  Heading,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { Container, Text, Flex, Box, Center } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
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
} from "@chakra-ui/react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const Dashboard = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState(0);

  //this is the same user, rewritten to accomidate the f(x) that grabs the users unread messages
  const [currentUser, setCurrentUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setCurrentUser(currentUser);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [addJobVisible, setAddJobVisible] = useState(false);

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

  const [employerID, setEmployerID] = useState(null);

  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  //modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenResume,
    onOpen: onOpenResume,
    onClose: onCloseResume,
  } = useDisclosure();
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setEmployerID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, [hasRun]);

  useEffect(() => {
    if (user !== null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setCity(snapshot.data().city);
        setState(snapshot.data().state);
        setFirstName(snapshot.data().firstName);
        setLastName(snapshot.data().lastName);
      });
    }
  }, [user]);

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

  const [userSubmission, setUserSubmission] = useState(null);
  const [validationMessage, setValidationMessage] = useState();

  const addCareerCoachingInitiation = async () => {
    if (!userSubmission) {
      setValidationMessage("Please fill out the form above");
    } else {
      await setDoc(doc(db, "Career Coaching", user.uid), {
        name: firstName + " " + lastName,
        email: user.email,
        submission: userSubmission,
        hasBeenViewed: false,
        id: user.uid,
      });

      onClose();
      onOpenSuccess();
      //open success modal
    }
  };

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

  //get number of unread messages

  useEffect(() => {
    if (currentUser) {
      let allChats = [];

      const unSub = onSnapshot(
        doc(db, "User Messages", currentUser.uid),
        async (res) => {
          let unreadMessages = 0;

          const items = res.data().chats;

          console.log("res data", res.data().chats);

          items.map(async (item) => {
            console.log("fetchedIDs", item.chatId);

            if (item.isSeen === false) {
              unreadMessages++;
            }
          });
          console.log(unreadMessages);
          if (unreadMessages > 0) {
            setUnseenMessages(unreadMessages);
          }
        }
      );
      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const [response, setResponse] = useState(null);

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
    setLoading(false);
  };

  const [userResumeInformation, setUserResumeInformation] = useState(null);

  const [completedResume, setCompletedResume] = useState(null);

  const createResumeAI = async () => {
    setLoading(true);

    const response = await fetch(
      "https://openaiapi-c7qc.onrender.com/aiResumeCreation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userResumeInformation }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    // const response = await fetch("https://openaiapi-c7qc.onrender.com/aiResumeCreation", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ userInput: userResumeInformation }),
    // });
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }

    const json = await response.json();
    console.log("json resopnse", json.message.content);

    setCompletedResume(json.message.content);
    setLoading(false);
  };

  return (
    <div>
      {/* <aside
        id="hs-pro-sidebar"
        class="hs-overlay [--auto-close:lg]
      hs-overlay-open:translate-x-0
      -translate-x-full transition-all duration-300 transform
      w-[260px]
      hidden
      fixed inset-y-0 start-0 z-[60]
      bg-white 
      xl:block lg:translate-x-0 lg:end-auto lg:bottom-0
     
     "
      > */}
      <aside
        id="hs-pro-sidebar"
        class="hs-overlay [--auto-close:lg]
    hs-overlay-open:translate-x-0
    -translate-x-full transition-all duration-300 transform
    w-[260px]
    hidden
    fixed inset-y-0 start-0 z-[60]
    bg-white border-e border-gray-200
    lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
   "
      >
        <div class="flex flex-col h-full max-h-full py-3">
          <header class="h-[46px] px-8">
            <a
              class="flex-none text-4xl font-sans font-bold text-sky-400 cursor-pointer"
              aria-label="Brand"
              onClick={() => navigate("/DoerMapView")}
            >
              Fulfil
            </a>
          </header>

          <div class="h-[calc(100%-35px)] lg:h-[calc(100%-93px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <nav
              class="hs-accordion-group pb-3  w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open
            >
              <ul>
                <li class="px-5 mb-1.5 mt-6">
                  <button
                    class="hs-accordion-toggle  mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate("/DoerMapView")}
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-4"
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
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Explore
                  </button>
                </li>
                <li class="px-5 mb-1.5">
                  <button
                    class="hs-accordion-toggle mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate("/DoerSavedJobs")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      class="flex-shrink-0 mt-0.5 size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                    Saved Jobs
                  </button>
                </li>

                {unseenMessages > 0 ? (
                  <button
                    type="button"
                    class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate("/DoerChatHolder")}
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-4"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Messages
                    <span class=" ml-auto inline-flex items-center  px-2 rounded-full text-[10px] font-medium bg-red-500 text-white">
                      {unseenMessages}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate("/DoerChatHolder")}
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-4"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Messages
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/UserProfile");
                  }}
                  class="hs-accordion-toggle  px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/DoerAccountManager")}
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                    <circle cx="18" cy="15" r="3" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                    <path d="m21.7 16.4-.9-.3" />
                    <path d="m15.2 13.9-.9-.3" />
                    <path d="m16.6 18.7.3-.9" />
                    <path d="m19.1 12.2.3-.9" />
                    <path d="m19.6 18.7-.4-1" />
                    <path d="m16.8 12.3-.4-1" />
                    <path d="m14.3 16.6 1-.4" />
                    <path d="m20.7 13.8 1-.4" />
                  </svg>
                  Account Settings
                </button>
                <li class=" pt-2 px-8 mt-5 border-t border-gray-200 first:border-transparent first:pt-0">
                  <span class="block text-xs uppercase text-gray-500">
                   Tools
                  </span>
                </li>

            
                <li class="px-8 mb-0.5 mt-4">
                  <button
                    type="button"
                    class="py-2 w-full px-11 text-center text-sm items-center gap-x-2  font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => onOpen()}
                    // onClick={() => navigate('/ResumeDashboard')}
                    // onClick={() => testAI()}
                  >
                    Career advisor
                  </button>
                  <button
                    type="button"
                    class="mt-3 py-2 w-full px-11 text-center items-center gap-x-2 text-sm  font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => onOpenResume()}
                    // onClick={() => navigate('/ResumeDashboard')}
                    // onClick={() => testAI()}
                  >
                    Resume builder
                  </button>
                  <button
                    type="button"
                    class="mt-3 py-2 w-full px-11 text-center items-center gap-x-2 text-sm  font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
             
                    onClick={() => navigate('/ResumeDashboard')}
                    // onClick={() => testAI()}
                  >
                    Resume builder test
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>

      <Modal isOpen={isOpenResume} onClose={onCloseResume} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Let's make a professional resume!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              You can speak to me in plain English and I will create a polished
              and professional resume for each of your applications.  If you
              need to apply to a different job, feel free to upload your resume
              and just ask to make it for a different position!
            </p>
            <p className="mt-3">
              Here are a few things you should consider adding:
            </p>
            <div class="sm:grid sm:grid-cols-2 sm:gap-2  ">
              <ul className="list-disc mx-6 mt-4">
                <li className="list-disc mt-1">Contact Information </li>
                <li className="list-disc mt-1">Professional Summary</li>
                <li className="list-disc mt-1">Work Experience</li>
                <li className="list-disc mt-1">Education</li>
                <li className="list-disc mt-1">Skills</li>
              </ul>

              <ul className="max-sm:hidden list-disc mx-6 mt-4">
                <li className="list-disc mt-1">
                  {" "}
                  Volunteer Experience{" "}
                  <span className="italic">(if relevant)</span>
                </li>
                <li className="list-disc mt-1">
                  Projects <span className="italic">(if relevant)</span>
                </li>

                <li className="list-disc mt-1">
                  Languages <span className="italic">(if applicable)</span>
                </li>
                <li className="list-disc mt-1">
                  Professional Affiliations{" "}
                  <span className="italic">(if applicable)</span>
                </li>
                <li className="list-disc mt-1">What job you are applying to</li>
              </ul>
            </div>

            <div class="w-full space-y-3 mt-4 sm:mt-6">
              <textarea
                onChange={(e) => setUserResumeInformation(e.target.value)}
                class=" py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                rows="4"
                placeholder="ex: I worked at a local coffee shop for 2 years and was promoted to shift lead. I completed a 2 year associates degree in psychology from Normandale Community College."
              ></textarea>
            </div>
            {/* {validationMessage ? (
              <p className="text-red-500 mt-1 ml-1">{validationMessage}</p>
            ) : null} */}

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
                  onClick={() => createResumeAI()}
                  type="button"
                  class="ml-auto py-3 px-6 items-center gap-x-2 font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Submit
                </button>
              )}
            </div>
            {completedResume && (
              <div>
                <h2 className="text-lg text-black font-semibold mt-3">
                  Resume outline:
                </h2>
                <p className="mt-1">
                  <Markdown>{completedResume}</Markdown>
                </p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Let's Find the Right Fit for You!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              The more information you give me on your career desires, the
              better I can serve you.
            </p>
            <p className="mt-1">Some examples of information are:</p>

            <div class="sm:grid sm:grid-cols-2 sm:gap-2  ">
              <ul className="list-disc mx-6 mt-4">
                <li className="list-disc mt-1">Ideal pay range</li>
                <li className="list-disc mt-1">
                  What is your ideal company culture?
                </li>
                <li className="list-disc mt-1">
                  How hard are you willing to work to meet your goals?
                </li>
                <li className="list-disc mt-1">
                  Do you like working with your hands / solving problems, etc?
                </li>
                <li className="list-disc mt-1">
                  Do you want to move up quickly or find your niche and
                  maintain.
                </li>
              </ul>

              <ul className="max-sm:hidden list-disc mx-6 mt-4">
                <li className="list-disc mt-1">
                  What are a few of your interests?
                </li>
                <li className="list-disc mt-1">
                  Do you have a long-term career vision?
                </li>

                <li className="list-disc mt-1">
                  Do you want to learn something and get better over time?
                </li>
                <li className="list-disc mt-1">
                  How do you want your work work-life balance to look like?
                </li>
                <li className="list-disc mt-1">
                  Are there any barriers that are slowing you down currently?  
                </li>
              </ul>
            </div>

            <div class="w-full space-y-3 mt-4 sm:mt-6">
              <textarea
                onChange={(e) => setUserSubmission(e.target.value)}
                class=" py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                rows="4"
                placeholder="ex: I've recently graduated from highschool and want to work with my hands. I'd like to do something mechanical, but don;t know where to get started."
              ></textarea>
            </div>
            {/* {validationMessage ? (
              <p className="text-red-500 mt-1 ml-1">{validationMessage}</p>
            ) : null} */}

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
            {response && (
              <div>
                <h2 className="text-lg text-black font-semibold mt-3">
                  Career advice:
                </h2>
                <p className="mt-1">
                  <Markdown>{response}</Markdown>
                </p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>We'll get back to you in the next 48 hours.</p>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => onCloseSuccess()}
              type="button"
              class="ml-auto py-3 px-6 items-center gap-x-2 font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
