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

  console.log(profilePicture);

  //laoding control

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

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


  const [response, setResponse] = useState(null);
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
    setLoading(false);
  };

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
    </>
  );
};

export default DoerHeader;
