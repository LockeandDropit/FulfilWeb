import React from "react";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../../firebaseConfig";
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
  Skeleton
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
  const [unseenMessages, setUnseenMessages] = useState(0)




    //this is the same user, rewritten to accomidate the f(x) that grabs the users unread messages
    const [currentUser, setCurrentUser] = useState(null)
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setCurrentUser(currentUser)
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


       //modal control
       const { isOpen, onOpen, onClose } = useDisclosure()





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
      });
    } else {
    }
  }, [user]);







  //laoding control

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(null)

  const [test, setTest] = useState("test")

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((snapshot) => {
     console.log(snapshot.data())
        setIsPremium(snapshot.data().isPremium)
      })
        .then(() => {
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        
        })
        .catch((error) => {
          // no buen
          console.log(error)
        });
    }
  }, [user]);


  useEffect(() => {
    console.log(isLoading, isPremium)
  }, [isLoading, isPremium])



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
   
             console.log("res data",res.data().chats)
   
             items.map(async (item) => {
              
               console.log("fetchedIDs", item.chatId)
   
               if (item.isSeen === false) {
                   unreadMessages++
               }
             });
   
   
             console.log(unreadMessages)
   
             if (unreadMessages > 0) {
              setUnseenMessages(unreadMessages) 
             }
           }
         );
   
         return () => {
           unSub();
         };
      }
     }, [currentUser]);


  return (
    <div>
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
              class="flex-none text-4xl font-sans font-bold text-sky-400"
              aria-label="Brand"
              onClick={() => navigate("/DoerMapScreen")}
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
                <li class="px-5 mb-1.5">
                  <button
                    class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 "
                    onClick={() => navigate("/DoerMapScreen")}
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

                {unseenMessages > 0 ? (   <button
                  type="button"
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
             onClick={() => navigate("/ChatEntry")}
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
                  <span class=" ml-auto inline-flex items-center  px-2 rounded-full text-[10px] font-medium bg-red-500 text-white">{unseenMessages}</span>
                  
                </button>) : (   <button
                  type="button"
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
             onClick={() => navigate("/ChatEntry")}
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
                </button>)}

              

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

                {/* <li class="pt-5 px-8 mt-5 mb-1.5 border-t border-gray-200 first:border-transparent first:pt-0">
                  <span class="block text-xs uppercase text-gray-500">
                    Actions
                  </span>
                </li>

                <li class="px-5 mb-0.5">
                  <button
                    class="flex items-center gap-x-2 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate(`/NeederAllCategories`)}
                  >
                    <span class="flex justify-center items-center size-6 bg-sky-400 text-white rounded-md">
                      <svg
                        class="flex-shrink-0 size-3"
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
                        <rect width="18" height="7" x="3" y="3" rx="1" />
                        <rect width="9" height="7" x="3" y="14" rx="1" />
                        <rect width="5" height="7" x="16" y="14" rx="1" />
                      </svg>
                    </span>
                    Find A Pro
                  </button>
                </li> */}
                <li class="px-8 mb-0.5 mt-10">
                  <button
                    type="button"
                    class="py-2 w-full px-11 inline-flex text-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                   onClick={() => onOpen()}
                  >
                    
                   
                   Upgrade to Pro
                  </button>
                 
                </li>

                
              
              </ul>
            </nav>
          </div>

          <footer class="lg:block absolute bottom-0 inset-x-0 border-t border-gray-200">
            <div class="hs-dropdown [--auto-close:inside] relative flex">
              <div class="p-1 border-t border-gray-200">
                {loggingOut ? (
                  <div
                    class="animate-spin ml-4 inline-block size-6 border-[3px] border-current border-t-transparent text-red-600 rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:bg-gray-100"
                    onClick={() => handleLogOut()}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </footer>
        </div>
      </aside>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Center py={6}>
            <Box
              maxW={"330px"}
              w={"full"}
              bg={useColorModeValue("white", "gray.800")}
              rounded={"md"}
              overflow={"hidden"}
            >
              <VStack spacing={1} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                  Upgrade to premium
                </Heading>
                <Text fontSize="lg" color={"gray.500"}>
                  Get the frist 2 months for $1/month. Then continue at
                  $29/month.
                </Text>

                <Text fontSize="md" color={"gray.500"}>
                  Cancel at anytime.
                </Text>
              </VStack>
              <Stack
                textAlign={"center"}
                p={5}
                color={useColorModeValue("gray.800", "white")}
                align={"center"}
              >
                <Text
                  fontSize={"md"}
                  fontWeight={500}
                  textColor="#01A2E8"
                  p={2}
                  px={3}
                  rounded={"full"}
                >
                  Premium Subscription
                </Text>
                <Stack direction={"row"} align={"center"} justify={"center"}>
                  <Text fontSize={"3xl"}>$</Text>
                  <Text fontSize={"6xl"} fontWeight={800}>
                    1
                  </Text>
                  <Text color={"gray.500"}>/month</Text>
                </Stack>
              </Stack>

              <Box px={1} py={6}>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Save 50% on all transaction fees
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Get noticed by customers as a Premium Contractor
                  </ListItem>

                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Be seen by customers who are looking for contractors in your
                    category
                  </ListItem>
                </List>

                <Button
                  mt={10}
                  w={"full"}
                  bg="#01A2E8"
                  color={"white"}
                  rounded={"xl"}
                  boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
                  _hover={{ bg: "#018ecb", textColor: "white" }}
                  onClick={() => initializeSubscription()}
                >
                  Start your trial
                </Button>
              </Box>
            </Box>
          </Center>
        </ModalContent>
      </Modal>
    </div>

    
  );
};

export default Dashboard;
