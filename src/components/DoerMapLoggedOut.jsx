import React, { useState, useEffect } from "react";

import Header from "./Header.jsx";

import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { 
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  Menu,
  MenuButton,
  MenuList,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, } from "@chakra-ui/react";
    import JobFilter from "../pages/Doer/components/JobFilter.jsx"
    import { useSearchResults } from "../pages/Doer/Chat/lib/searchResults"
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Select
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";


import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig.js";


import { FcGoogle } from "react-icons/fc";
import LoggedOutHeader from "./Landing/LoggedOutHeader.jsx";
import { useMediaQuery } from "@chakra-ui/react";
import {
  doc,
  getDoc,
  collectionGroup,

  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import Plausible from 'plausible-tracker'
import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";


const DoerMapLoggedOut = (props) => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  const { searchResults } = useSearchResults()

  const closeInfoWindow = props.props

  useEffect(() => {
console.log(closeInfoWindow)
    if (closeInfoWindow === true) {
      setOpenInfoWindowMarkerID(null)
    } 


  }, [closeInfoWindow])

  useEffect(() => {
    if (searchResults === null) {
 //normal render
renderAllJobs()
 //initial render with all f(x)
    } else {
     setBusinessPostedJobs(searchResults)
     console.log("search results map screen",searchResults)
    }
  }, [searchResults])


  const renderAllJobs = () => {
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
          //ignore this job is for Needer map screen
        } else if (doc.data().isPostedByBusiness) {
          postedByBusiness.push({ ...doc.data(), id: doc.id });
        } else {
          results.push({ ...doc.data(), id: doc.id });
          console.log("this is from results",doc.data())
        }
      });

      setPostedJobs(results);
      setBusinessPostedJobs(postedByBusiness);
    });
  }



  const [allJobs, setAllJobs] = useState([]);

  //huge shout out to junaid7898 https://github.com/react-native-maps/react-native-maps/issues/350
  const filteredLocations = (postedJobs) => {
    let finalfiltered = [];

    const hash = Object.create(null);
    const processedLocations = postedJobs.map((postedJobs) => {
      const { locationLat: lat, locationLng: lng } = postedJobs;
      // console.log(lat, lng)
      const latLng = `${lat}_${lng}`;
      // Check if this combination of latitude and longitude has been encountered before
      if (hash[latLng]) {
        // If it has, increment the offset based on the number of occurrences
        const offset = hash[latLng];
        hash[latLng] += 1;
        finalfiltered.push({
          ...postedJobs,

          locationLat: lat - offset * 0.0001,
          locationLng: lng - offset * 0.0001,
        });

        console.log("second encounter hash", finalfiltered);
      } else {
        // If it hasn't been encountered before, mark it as seen in the hash table with an offset of 1
        hash[latLng] = 1;
        // Return the original location if it's the first time encountering this combination

        finalfiltered.push({ ...postedJobs });
      }
    });
    setAllJobs(finalfiltered);
    return processedLocations;
  };

  useEffect(() => {
    if (!postedJobs.length || !postedJobs) {
      console.log("nothing");
    } else {
      filteredLocations(postedJobs);
    }
  }, [postedJobs]);

  useEffect(() => {
    allJobs.map((allJobs) => {
      console.log("location lat", allJobs.locationLat);
    });
  }, [allJobs]);

  const defaultLat = 44.96797106363888;
  const defaultLong = -93.26177106829272;
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";

  //map help https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
  const [open, setOpen] = useState(false);

  //opening one window at a time help from https://github.com/Developer-Nijat/React-Google-Map-Markers/blob/main/src/App.jsx & https://www.youtube.com/watch?v=Uq-0tA0f_X8 & Vadim Gremyachev https://stackoverflow.com/questions/50903246/react-google-maps-multiple-info-windows-opening-up

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState(null);

  const handleToggleOpen = (x) => {
    console.log(x);
    setOpenInfoWindowMarkerID(x);
  };


  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure()
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  //category search

  const [searchJobCategory, setSearchJobCategory] = useState(null)

  useEffect(() => {
    if (searchJobCategory && searchJobCategory !== null) {
      searchCategory(searchJobCategory)
    } else {

    }
  }, [searchJobCategory])
  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID(x.jobID);
    // updateJobListingViews(x);
    onOpenDrawer();
  };


  const searchCategory = (value) => {
    console.log(value);
    const q = query(collection(db, "Map Jobs"));

    if (value === "all") {
      const q = query(collection(db, "Map Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        setPostedJobs(results);
      });
    } else {
      onSnapshot(q, (snapshot) => {
        let results = [];
        let secondResults = [];

        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });

        results.map((results) => {
          if (results.category == value) {
            secondResults.push(results);
            console.log("match", results);
          } else {
            // return(<NoCategoryMatchModal props={true}/>)
            console.log("no match1")
          
          }
        });

        if (secondResults.length === 0) {
         onOpen()
          
          
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  const handleCloseInfoWindow = () => {
    setOpenInfoWindowMarkerID(null)
    
  }

  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
    }, 200);
  };


  //const handle log in / sign up navigate
  const handleClose = () => {
    onClose();
  };
  const handleGoogleSignUp = async () => {
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log("result", result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log("google user", user);

        Promise.all([
          getDoc(doc(db, "users", result.user.uid)),
          getDoc(doc(db, "employers", result.user.uid)),
        ])
          .then((results) =>
            //   results[0]._document === null && results[1]._document === null
            // ? console.log("new")
            // : ( results[0]._document !== null &&
            //   results[0]._document.data.value.mapValue.fields.isEmployer)
            // ? console.log("doer")
            // : console.log("needer")
            navigate(
              results[0]._document === null && results[1]._document === null
                ? "/AddProfileInfo"
                : results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer
                ? "/DoerMapScreen"
                : "/NeederMapScreen"
            )
          )
          .catch();

        //check if user is already in DB
        //if so, navigate accordingly
        //if not, navigate to new profile register
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("hello", error);
      });
  };


  const logIn = () => {
    console.log("logging in")
    const auth = getAuth();
    console.log("logging in")
    setPersistence(auth, browserLocalPersistence).then(() => {
      // New sign-in will be persisted with local persistence.
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          // setLoggingIn(true);

          //stream chat log in
          // const chatClient = new StreamChat(
          //   process.env.REACT_APP_STREAM_CHAT_API_KEY
          // );

          // Signed in
          // setCurrentUser(response.user.uid)
          setIsSignedIn(true);
          const currentUser = response.user.uid;

          // chatClient.connectUser(
          //   { id: response.user.uid },
          //   chatClient.devToken(response.user.uid)
          // );

          // const docRefUsers = doc(db, "users", response.user.uid);
          // const docRefEmployers = doc(db, "employers", response.user.uid);

          // Thanks Jake :)
          Promise.all([
            getDoc(doc(db, "users", response.user.uid)),
            getDoc(doc(db, "employers", response.user.uid)),
          ])
            .then((results) =>
            
              navigate(
                results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer
                  ? "/DoerMapScreen"
                  : "/NeederMapScreen"
              )
            )
            .catch();
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          setPasswordValidationMessage("Oops! Wrong email or password");
        });
    });

    // template credit simple log in card https://chakra-templates.vercel.app/forms/authentication
  };

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);


  const [passwordValidationMessage, setPasswordValidationMessage] = useState();
  const passwordRegex = /[^\>]*/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const modalValidate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
      console.log("email good")
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
    } else {
      setPasswordValidationMessage();
      console.log("password good")
    }

    if (isValid && isValidPassword) {
      logIn()
    }
  };

 //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
    

      <LoggedOutHeaderNoGap props={openModal} />

{/* <div class=" mx-auto px-4 sm:px-6 lg:px-8"> */}
<div class=" mx-auto">
      

      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        
        <Box
              h={{ base: "100vh", lg: "90vh" }}
              w={{ base: "100vw", lg: "100vw" }}
              
            >
         
          <Map
            defaultCenter={{ lat: defaultLat, lng: defaultLong }}
            defaultZoom={11}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            //move to env
            mapId="6cc03a62d60ca935"
            onClick={() => handleCloseInfoWindow()}
          >
             {isDesktop ? (  <Center >
                  
                  <Card
                    align="center"
                    mt={2}
                    width={{ base: "full", md: "auto" }}
                    
                 
                    // mr={{ base: "80px", md: "0" }}
                    ml={{ base: "0px", md: "80px" }}
                  >
                      <JobFilter />
                    
                  </Card>
                </Center>) : (  <Center  >
                  
                  <Card
                    align="center"
                
                 
                    
                 width={{base: "100vw"}}
                    // mr={{ base: "80px", md: "0" }}
                    // ml={{ base: "0px", md: "80px" }}
                  >
                    <div className="w-3/4 mt-4 mb-2">
               
          <Menu >
  <MenuButton width={{base: "100%"}}>
  <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

            Search
          </a>

  </MenuButton>
  <MenuList  width={{base: "100vw"}}>
<JobFilter />
  </MenuList>
</Menu>
          </div>
                  </Card>
                </Center>)}
            {businessPostedJobs !== null &&
                  businessPostedJobs.map((businessPostedJobs) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={businessPostedJobs.jobID}
                        position={{
                          lat: businessPostedJobs.locationLat
                            ? businessPostedJobs.locationLat
                            : 44.96797106363888,
                          lng: businessPostedJobs.locationLng
                            ? businessPostedJobs.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() =>
                          handlePostedByBusinessToggleOpen(businessPostedJobs)
                        }
                      >
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {businessPostedJobs.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : businessPostedJobs.isSalaried ? (
                            <p>
                              ${businessPostedJobs.lowerRate} yearly - ${businessPostedJobs.upperRate} yearly
                            </p>
                          ) : (
                            <p>
                              ${businessPostedJobs.lowerRate} - $
                              {businessPostedJobs.upperRate}/hr
                            </p>
                          )}
                        </button>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === businessPostedJobs.jobID ? (
                        <Drawer
                          onClose={onCloseDrawer}
                          isOpen={isOpenDrawer}
                          size={"xl"}
                        >
                          <DrawerOverlay />
                          <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>
                              {businessPostedJobs.jobTitle}
                            </DrawerHeader>
                            <DrawerBody>
                              <div class=" ">
                                <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                                  {/* <div class="py-3 px-4 flex justify-between items-center border-b ">
                                  <h3 class="font-semibold text-gray-800">Create A Job</h3>
                              
                                </div> */}

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 ">
                                      <div class="">
                                        <label
                                          for="hs-pro-dactmt"
                                          class="block mb-2 text-lg font-medium text-gray-800">
                                          {businessPostedJobs.jobTitle}
                                        </label>

                                {businessPostedJobs.isFullTimePosition ? ( <label
                                          for="hs-pro-dactmt"
                                          class="block  text-md font-medium text-gray-800"
                                        >
                                          Full-time
                                        </label>) : ( <label
                                          for="hs-pro-dactmt"
                                          class="block  text-md font-medium text-gray-800 "
                                        >
                                          Part-time
                                        </label>)}
                                       

                                        {businessPostedJobs.isHourly ? (
                                          <div class="space-y-1 ">
                                            <div class="flex align-items-center">
                                              <p className=" text-sm font-medium">
                                                $
                                              </p>
                                              <label
                                                for="hs-pro-dactmt"
                                                class="block text-sm font-medium text-gray-800 "
                                              >
                                                {businessPostedJobs.lowerRate}
                                              </label>
                                              <p className=" text-sm font-medium">
                                                /hour - $
                                              </p>
                                              <label
                                                for="hs-pro-dactmt"
                                                class="block  text-sm font-medium text-gray-800 "
                                              >
                                              {businessPostedJobs.upperRate}
                                              </label>
                                              <p className=" text-sm font-medium">
                                                /hour
                                              </p>
                                            </div>
                                          </div>
                                        ) : null}

                                        {businessPostedJobs.isSalaried ? (
                                           <div class="space-y-2 ">
                                           <div class="flex align-items-center">
                                             <p className=" text-sm font-medium">
                                               $
                                             </p>
                                             <label
                                               for="hs-pro-dactmt"
                                               class="block  text-sm font-medium text-gray-800 "
                                             >
                                               {businessPostedJobs.lowerRate}
                                             </label>
                                             <p className="ml-1 text-sm font-medium ">
                                                yearly - $
                                             </p>
                                             <label
                                               for="hs-pro-dactmt"
                                               class="block  text-sm font-medium text-gray-800 "
                                             >
                                               {businessPostedJobs.upperRate}
                                             </label>
                                             <p className=" ml-1 text-sm font-medium">
                                                yearly
                                             </p>
                                           </div>
                                         </div>
                                        ) : null}
  <p class="block  text-sm font-medium text-gray-800 ">{businessPostedJobs.streetAddress}, {businessPostedJobs.city}, {businessPostedJobs.state}</p>
<p class="font-semibold text-sm text-gray-500  cursor-default">
                                          <span className="font-semibold text-sm text-slate-700">
                                            {" "}
                                            Posted:
                                          </span>{" "}
                                          {businessPostedJobs.datePosted}
                                        </p>
                                        <p class="font-semibold text-sm text-slate-700  mt-2 cursor-pointer">
                                          Employer:
                                        </p>
                                        <div className="flex">
                                        {businessPostedJobs.employerProfilePicture ? (
<>
                                          <div class="flex flex-col justify-center items-center size-[56px]  ">
                                           
                                              <img
                                                src={
                                                  businessPostedJobs.employerProfilePicture
                                                }
                                                class="flex-shrink-0 size-[64px] rounded-full"
                                              />
                                            
                                            <div className="flex flex-col ml-4">
                                            <p class="font-semibold text-sm text-gray-500  mt-2 cursor-pointer">
                                              {businessPostedJobs.businessName}
                                            </p>
                                            <p class="font-semibold text-sm text-gray-500 cursor-default ">
                                              {businessPostedJobs.city}, Minnesota
                                            </p>
                                          </div>
                                            
                                          </div>
                                        
                                          </>  ) : (null )}
                                          <div className="flex flex-col">
                                            <p class="font-semibold text-sm text-gray-500  mt-1 cursor-pointer">
                                              {businessPostedJobs.companyName}
                                            </p>
                                            
                                          </div>
                                       
                                       </div>
                                      </div>
                                     


                                     
                                      <div class="space-y-2 mt-10 mb-4">
                                        <label
                                          for="dactmi"
                                          class="block mb-2 text-md font-medium text-gray-800 "
                                        >
                                         What you'll be doing
                                        </label>

                                        <div class="mb-4">
                                          <p>{businessPostedJobs.description}</p>
                                        </div>
                                      </div>
                                                {businessPostedJobs.bio ? (
                                                   <div class="space-y-2 mt-10 mb-4">
                                                   <label
                                                     for="dactmi"
                                                     class="block mb-2 text-md font-medium text-gray-800 "
                                                   >
                                                   About {businessPostedJobs.companyName}
                                                   </label>
           
                                                   <div class="mb-4">
                                                     <p>{businessPostedJobs.bio}</p>
                                                   </div>
                                                 </div>
                                                ) : (null)}
                                     

                                      <div class="space-y-2 mb-4">
                                        <label
                                          for="dactmi"
                                          class="block mb-2 text-md font-medium text-gray-800 "
                                        >
                                         Job Requirements
                                        </label>

                                        <div class="mb-4">
                                          <p>{businessPostedJobs.applicantDescription}</p>
                                        </div>
                                      </div>
                                      <div class="space-y-2 mb-4">
                                        <label
                                          for="dactmi"
                                          class="block mb-2 text-md font-medium text-gray-800 "
                                        >
                                          Employment Benefits
                                        </label>

                                        <div class="mb-4">
                                          <p>{businessPostedJobs.benefitsDescription}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2">
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => onOpen()}
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DrawerBody>
                          </DrawerContent>
                        </Drawer>
                      ) : null}
                    </>
                  ))}
            {/* {allJobs !== null &&
              allJobs.map((allJobs) => (
              
                <AdvancedMarker
                  key={allJobs.jobID}
                  position={{
                    lat: allJobs.locationLat
                      ? allJobs.locationLat
                      : 44.96797106363888,
                    lng: allJobs.locationLng
                      ? allJobs.locationLng
                      : -93.26177106829272,
                  }}
                  onClick={() => handleToggleOpen(allJobs.jobID)}
                >
                  <div
                  
                  >
                    <Button colorScheme="blue" height="24px" marginRight={5}>
                      {allJobs.isVolunteer ? (
                        <Text>Volunteer!</Text>
                      ) : allJobs.isFlatRate ? (
                        <Text>${allJobs.flatRate}</Text>
                      ) : (
                        <Text>
                          ${allJobs.lowerRate} - ${allJobs.upperRate}/hr
                        </Text>
                      )}
                    </Button>
                  </div>
                  /
                  {openInfoWindowMarkerID === allJobs.id ? (
                    <InfoWindow
                      key={openInfoWindowMarkerID}
                      position={{
                        lat: allJobs.locationLat
                          ? allJobs.locationLat
                          : 44.96797106363888,
                        lng: allJobs.locationLng
                          ? allJobs.locationLng
                          : -93.26177106829272,
                      }}

                      onCloseClick={() => setOpenInfoWindowMarkerID(null)}
                    >
                    <Card >
                        <CardBody>
                          <Stack>
                            <Heading size="md">{allJobs.jobTitle}</Heading>
                            <Flex>
                            
                            
                              {allJobs.isVolunteer ? (
                              <Text>Volunteer!</Text>
                            ) : allJobs.isFlatRate ? (
                              <Heading size="sm">Budget: ${allJobs.flatRate}</Heading>
                            ) : (
                            
                              <Heading size="sm">${allJobs.lowerRate} - ${allJobs.upperRate}/hr</Heading>
                            )}
                            </Flex>
                            <Text fontSize="md">{allJobs.description}</Text>
                          </Stack>
                        </CardBody>

                        <Box marginTop="4px" spacing={6}>
                          <Center>
                        <Button
                              bg="white"
                              color={'#01A2E8'}
                             marginRight="32px"
                              width="180px"
                              onClick={() => onOpenSignIn()}
                            >
                             Save
                            </Button>
                            <Button
                              bg="#01A2E8"
                              color={'white'}
                              _hover={{
                                bg: 'blue.500',
                              }}
                              width="180px"
                         onClick={() => onOpenSignIn()}
                            >
                              Apply
                            </Button>
                            </Center>
                        </Box>
                      </Card>
                    </InfoWindow>
                  ) : null}
                
                </AdvancedMarker>
              ))} */}

<Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        size={{ base: "full", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <div class="mt-7 bg-white rounded-xl ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
                <p class="mt-2 text-sm text-gray-600">
                  Don't have an account yet?
                  <button
                    class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                    onClick={() => navigate("/DoerEmailRegister")}
                  >
                    Sign up here
                  </button>
                </p>
              </div>

              <div class="mt-5">
                <button
                  type="button"
                  class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => handleGoogleSignUp()}
                >
                  <svg
                    class="w-4 h-auto"
                    width="46"
                    height="47"
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign in with Google
                </button>

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
                  Or
                </div>

                <form>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="email" class="block text-sm mb-2">
                        Email address
                      </label>
                      <div class="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          required
                          aria-describedby="email-error"
                        />
                         {emailValidationBegun === true ? (
                <p class="block text-sm mb-2 text-red-500">{validationMessage}</p>
              ) : null}
                      </div>
                      
                    </div>

                    <div>
                      <div class="flex justify-between items-center">
                        <label for="password" class="block text-sm mb-2">
                          Password
                        </label>
                        {/* <a class="text-sm text-blue-600 decoration-2 hover:underline font-medium" href="../examples/html/recover-account.html">Forgot password?</a> */}
                      </div>
                      <div class="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          required
                          aria-describedby="password-error"
                        />
                         {passwordValidationBegun === true ? (
                <p class="block text-sm mb-2 text-red-500">{passwordValidationMessage}</p>
              ) : null}
                      </div>
                      <p
                        class="hidden text-xs text-red-600 mt-2"
                        id="password-error"
                      >
                        8+ characters required
                      </p>
                    </div>

                    <div class="flex items-center">
                      <div class="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          class="shrink-0 mt-0.5 border-gray-200  text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div class="ms-3">
                        <label for="remember-me" class="text-sm">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <input type="button"
                     onClick={() => modalValidate()}
                     value="Sign In"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                   
                    </input>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

{/* <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
    <ModalHeader>Oops!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
       <Text> Sorry! There are no jobs currently available in that category</Text>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
      
      </ModalFooter>
    </ModalContent>
  </Modal> */}
  <Modal isOpen={isOpenSignIn} onClose={onCloseSignIn}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Create an account or sign in to apply!</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseSignIn}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
          </Map>
        </Box>
      </APIProvider>
  
{isDesktop ? ( <div class="w-full rounded-lg ml-6">
  

              {/* <MapScreen props={closeInfoWindow} /> */}
         
      
    </div>) : (null)}
  
 
</div>

{isDesktop ? ( null) : (<div class="w-full rounded-lg mt-10">
   

              {/* <MapScreen props={closeInfoWindow} /> */}
         
      
    </div>)}
 
      
    </>
  );
};

export default DoerMapLoggedOut;