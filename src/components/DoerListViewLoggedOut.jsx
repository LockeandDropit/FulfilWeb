import React, { useState, useEffect } from "react";

import Header from "./Header.jsx";
import { Helmet } from "react-helmet";
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
  useDisclosure,
} from "@chakra-ui/react";
import JobFilter from "../pages/Doer/components/JobFilter.jsx";
import { useSearchResults } from "../pages/Doer/Chat/lib/searchResults";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  RedditIcon,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";

import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig.js";
import Markdown from "react-markdown";

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
import Plausible from "plausible-tracker";
import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";
import CustomPromotedListCards from "./CustomPromotedListCards.jsx";

const DoerListViewLoggedOut = (props) => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  const { searchResults, searchIsMobile, setSearchIsMobile } =
    useSearchResults();

  const closeInfoWindow = props.props;

  useEffect(() => {
    console.log(closeInfoWindow);
    if (closeInfoWindow === true) {
      setOpenInfoWindowMarkerID(null);
    }
  }, [closeInfoWindow]);

  useEffect(() => {
    if (searchResults === null) {
      //normal render
      renderAllJobs();
      //initial render with all f(x)
    } else if (
      searchResults !== null &&
      searchResults[0].isFullTimePosition === "gigwork"
    ) {
      setPostedJobs(searchResults);
      setBusinessPostedJobs(null);
    } else {
      setBusinessPostedJobs(searchResults);

      console.log("search results map screen", searchResults);
    }
  }, [searchResults]);

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
          console.log("this is from results", doc.data());
        }
      });

      setPostedJobs(results);
      setBusinessPostedJobs(postedByBusiness);
    });
  };

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSignIn,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure();
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare,
  } = useDisclosure();
  const {
    isOpen: isOpenEmailSignUp,
    onOpen: onOpenEmailSignUp,
    onClose: onCloseEmailSignUp,
  } = useDisclosure();
  const {
    isOpen: isOpenEmailSignUpSuccess,
    onOpen: onOpenEmailSignUpSuccess,
    onClose: onCloseEmailSignUpSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  //category search

  const [searchJobCategory, setSearchJobCategory] = useState(null);

  useEffect(() => {
    if (searchJobCategory && searchJobCategory !== null) {
      searchCategory(searchJobCategory);
    } else {
    }
  }, [searchJobCategory]);
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
            console.log("no match1");
          }
        });

        if (secondResults.length === 0) {
          onOpen();
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  const handleCloseInfoWindow = () => {
    setOpenInfoWindowMarkerID(null);
    setUrlCopied(false);
  };

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
                ? "/DoerMapView"
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
    console.log("logging in");
    const auth = getAuth();
    console.log("logging in");
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
                  ? "/DoerMapView"
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
      console.log("email good");
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
    } else {
      setPasswordValidationMessage();
      console.log("password good");
    }

    if (isValid && isValidPassword) {
      logIn();
    }
  };

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        navigate("/DoerAddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const validate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      setPasswordValidationMessage(
        "Password Invalid. Must be at least 6 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
    } else {
      setPasswordValidationMessage();
    }
    if (isValid && isValidPassword) {
      onSignUp();
    }
  };

  const handleSwitchModals = () => {
    onClose();
    onOpenSignIn();
  };

  //this is to receive jobs
  //will have to eventually makew this so that it checks if the user is logged in...
  //like if user ? && isDoer navigate("DoerMapScreen/sessionid={blah}")
  // else (stay here and render it on the logged out map)

  //"https://getfulfil.com/DoerMapLoggedOut/?session_id=CHECKOUT_SESSION_ID",
  //test http://localhost:3000/DoerMapLoggedOut/?session_id=CHECKOUT_SESSION_ID
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      const q = query(collection(db, "Map Jobs"));
      console.log("session id ", sessionId);
      onSnapshot(q, (snapshot) => {
        let results = [];
        let postedByBusiness = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          if (doc.data().jobID === sessionId) {
            if (doc.data().isPostedByBusiness === true) {
              // postedByBusiness.push({ ...doc.data(), id: doc.id });
              // setPostedJobs([])
              handlePostedByBusinessToggleOpen(doc.data());
              console.log("business result inner", doc.data());
            } else if (doc.data().isFullTimePosition === "gigwork") {
              handlePostedByBusinessToggleOpen(doc.data());
              console.log("gig link", doc.data());
            }
          } else {
          }
        });

        // setPostedJobs(results);
        // setBusinessPostedJobs(postedByBusiness);
      });
    }
  }, []);

  const [urlCopied, setUrlCopied] = useState(false);

  const handleCopiedURL = (businessPostedJobs) => {
    setUrlCopied(true);
    navigator.clipboard.writeText(
      `https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`
    );
  };

  const [subscriberEmail, setSubscriberEmail] = useState(null);

  const handleNewEmailSignUp = async () => {
    // insert email regex, if then
    onCloseEmailSignUp();
    onOpenEmailSignUpSuccess();

    console.log("subscriberEmail", subscriberEmail);

    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/newEmailSignUp",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: subscriberEmail }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);

    onCloseEmailSignUp();
    onOpenEmailSignUpSuccess();
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     onOpenEmailSignUp()
  //     }, 120000
  //     )
  // }, [])

  // h-[calc(100vh-100px)]

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
      <LoggedOutHeaderNoGap props={openModal} />

      {/* <div id="cookies-simple-with-dismiss-button" class=" top-10 lg:start-[19vw] items-center  justify-center z-[60]  w-full mx-auto p-6">
 
 <div class="p-4  rounded-xl m ">
   <div class="flex justify-between items-center gap-x-5 sm:gap-x-10" onClick={() => navigate("/DoerListViewLoggedOut")}>
   <JobFilter />
   
   </div>
 </div>
</div> */}
      {isDesktop ? (
        <Center>
          <Card
            align="center"
            mt={2}
            width={{ base: "full", md: "auto" }}

            // ml={{ base: "0px", md: "80px" }}
          >
            <JobFilter />
          </Card>
        </Center>
      ) : (
        <Center>
          <Card align="center" width={{ base: "100vw" }}>
            <div className="w-3/4 mt-4 mb-2">
              {/* <Menu closeOnSelect={true}>
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
</Menu> */}

              <JobFilter />
            </div>
          </Card>
        </Center>
      )}

      <div
        id="cookies-simple-with-dismiss-button"
        class=" items-center justify-center overflow-y-auto h-80vh z-[60] sm:max-w-4xl w-auto mx-auto p-6 "
      >
        <div class="p-4 bg-white ">
          {/* insert custom promoted jobs here */}

     
          <CustomPromotedListCards />
         
         
          {businessPostedJobs !== null &&
            businessPostedJobs.map((businessPostedJobs) => (
              <>
                <div class=" mt-3 mb-2 p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center">
                      <h3 class="font-medium text-gray-800 text-xl ">
                        {businessPostedJobs.jobTitle} 
                      </h3>
                      <div className="flex">
                        {/* {businessPostedJobs.employerProfilePicture ? (
                          <>
                            <div class="flex flex-col justify-center items-center size-[56px]  ">
                              <img
                                src={businessPostedJobs.employerProfilePicture}
                                class="flex-shrink-0 size-[64px] rounded-full"
                              />

                              <div className="flex flex-col ml-4">
                                <p class="font-semibold text-base text-gray-500  mt-2 cursor-pointer">
                                  {businessPostedJobs.businessName}
                                </p>
                                <p class="font-semibold text-sm text-gray-500 cursor-default ">
                                  {businessPostedJobs.city}, Minnesota
                                </p>
                              </div>
                            </div>
                          </>
                        ) : null} */}
                        <div className="flex flex-col">
                          <p class="font-semibold text-sm text-gray-500  mt-1 cursor-pointer">
                            {businessPostedJobs.companyName}
                          </p>
                        </div>
                      </div>

                      {businessPostedJobs.isFullTimePosition === true ? (
                        <label
                          for="hs-pro-dactmt"
                          class="block  text-md font-medium text-gray-800"
                        >
                          Full-time
                        </label>
                      ) : (
                        <label
                          for="hs-pro-dactmt"
                          class="block  text-md font-medium text-gray-800 "
                        >
                          Part-time
                        </label>
                      )}

                      {businessPostedJobs.isHourly ? (
                        <div class="space-y-1 ">
                          <div class="flex align-items-center">
                            <p className="  font-medium">$</p>
                            <label
                              for="hs-pro-dactmt"
                              class="block font-medium text-gray-800 "
                            >
                              {businessPostedJobs.lowerRate}
                            </label>
                            <p className="  font-medium">/hour - $</p>
                            <label
                              for="hs-pro-dactmt"
                              class="block font-medium text-gray-800 "
                            >
                              {businessPostedJobs.upperRate}
                            </label>
                            <p className="font-medium">/hour</p>
                          </div>
                        </div>
                      ) : null}

                      {businessPostedJobs.isSalaried ? (
                        <div class="space-y-2 ">
                          <div class="flex align-items-center">
                            <p className=" text-sm font-medium">$</p>
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
                            <p className=" ml-1 text-sm font-medium">yearly</p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <label
                        for="hs-pro-daicn1"
                        class="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-none"
                      >
                        <button
                          onClick={() => onOpen()}
                          type="button"
                          class="py-2 px-4 w-full inline-flex justify-center items-center gap-x-2 text-base  rounded-lg border  bg-sky-400 text-white hover:bg-sky-500  "
                        >
                          Apply
                        </button>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-800 ">Description</h3>

                    <p class="mt-1 text-sm text-gray-500 line-clamp-3">
                      {businessPostedJobs.description}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handlePostedByBusinessToggleOpen(businessPostedJobs)
                    }
                    type="button"
                    class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                  >
                    See details
                  </button>
                </div>
                {openInfoWindowMarkerID === businessPostedJobs.jobID ? (
                  <>
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
                          <div class="">
                            <Helmet>
                              <meta charSet="utf-8" />
                              <title>{businessPostedJobs.jobTitle}</title>
                              <meta
                                name="description"
                                content={businessPostedJobs.description}
                              />
                              {/* <link rel="canonical" href=`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}` /> */}
                            </Helmet>
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              {/* <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <h3 class="font-semibold text-gray-800">Create A Job</h3>
                            
                              </div> */}

                              <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                <div class="p-4 ">
                                <div class=" ">
                              <div className="flex">
                                <label
                                  for="hs-pro-dactmt"
                                  class="block mb-2 text-2xl font-medium text-gray-900"
                                >
                                  {businessPostedJobs.jobTitle}
                                </label>

                                <label onClick={() => onOpenShare()}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4 ml-1 cursor-pointer"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                    />
                                  </svg>
                                </label>
                              </div>
                              {businessPostedJobs.employerProfilePicture ? (
                                <>
                                  <div class="flex flex-row items-center">
                                    <div className="justify-center items-center">
                                      <img
                                        src={
                                          businessPostedJobs.employerProfilePicture
                                        }
                                        class="flex-shrink-0 size-[56px] rounded-full"
                                        alt="company logo"
                                      />
                                    </div>

                                    <p class="font-semibold ml-2 text-xl text-gray-800 cursor-pointer">
                                      {businessPostedJobs.companyName}
                                    </p>
                                  </div>
                                  {/* <div className="flex flex-col">
                                    <p class="font-semibold text-xl text-gray-800 cursor-pointer">
                                      {businessPostedJobs.companyName}
                                    </p>
                                  </div> */}
                                </>
                              ) : (
                                <div className="flex flex-col">
                                  <p class="font-semibold text-xl text-gray-800 cursor-pointer">
                                    {businessPostedJobs.companyName}
                                  </p>
                                </div>
                              )}
                              {businessPostedJobs.isFullTimePosition ===
                              true ? (
                                <label
                                  for="hs-pro-dactmt"
                                  class="block mt-1 text-lg font-medium text-gray-800"
                                >
                                  Full-time
                                </label>
                              ) : (
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-lg font-medium text-gray-800 "
                                >
                                  Part-time
                                </label>
                              )}

                              {businessPostedJobs.isHourly ? (
                                <div class="space-y-1 ">
                                  <div class="flex align-items-center">
                                    <p className=" text-md font-medium">$</p>
                                    <label
                                      for="hs-pro-dactmt"
                                      class="block text-md font-medium text-gray-800 "
                                    >
                                      {businessPostedJobs.lowerRate}
                                    </label>
                                    <p className=" text-md font-medium">
                                      /hour - $
                                    </p>
                                    <label
                                      for="hs-pro-dactmt"
                                      class="block  text-md font-medium text-gray-800 "
                                    >
                                      {businessPostedJobs.upperRate}
                                    </label>
                                    <p className=" text-md font-medium">
                                      /hour
                                    </p>
                                  </div>
                                </div>
                              ) : null}

                              {businessPostedJobs.isSalaried ? (
                                <div class="space-y-2 ">
                                  <div class="flex align-items-center">
                                    <p className=" text-md font-medium">$</p>
                                    <label
                                      for="hs-pro-dactmt"
                                      class="block  text-md font-medium text-gray-800 "
                                    >
                                      {businessPostedJobs.lowerRate}
                                    </label>
                                    <p className="ml-1 text-md font-medium ">
                                      yearly - $
                                    </p>
                                    <label
                                      for="hs-pro-dactmt"
                                      class="block  text-md font-medium text-gray-800 "
                                    >
                                      {businessPostedJobs.upperRate}
                                    </label>
                                    <p className=" ml-1 c font-medium">
                                      yearly
                                    </p>
                                    {businessPostedJobs.isEstimatedPay ? (
                                      <p>*</p>
                                    ) : null}
                                  </div>
                                </div>
                              ) : null}
                              {businessPostedJobs.isEstimatedPay ? (
                                <div className="mb-2 flex flex-col w-full text-sm ">
                                  <a href="https://www.glassdoor.com/index.htm">
                                    *Estimate. Powered by{" "}
                                    <img
                                      src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png"
                                      title="Job Search"
                                    />
                                  </a>
                                </div>
                              ) : null}
                              <p class="block  text-md font-medium text-gray-800 ">
                                {businessPostedJobs.streetAddress},{" "}
                                {businessPostedJobs.city},{" "}
                                {businessPostedJobs.state}
                              </p>
                              {businessPostedJobs.isEstimatedAddress ? (
                                <p class="block italic text-sm  text-gray-800 ">
                                  Address may not be exact
                                </p>
                              ) : null}
                              <p class="font-semibold text-md text-gray-500  cursor-default">
                                <span className="font-semibold text-md text-slate-700">
                                  {" "}
                                  Posted:
                                </span>{" "}
                                {businessPostedJobs.datePosted}
                              </p>
                            </div>
                            {businessPostedJobs.companyBio ? (
                              <div class="space-y-2 mt-10 mb-4 ">
                                <label
                                  for="dactmi"
                                  class="block mb-2 text-lg font-medium text-gray-900 "
                                >
                                  About us
                                </label>
                                <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                                  {businessPostedJobs.companyBio}
                                </div>
                              </div>
                            ) : null}

                                  <div class="space-y-2 mt-10 mb-4 ">
                                    <label
                                      for="dactmi"
                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                    >
                                      What you'll be doing
                                    </label>
                                    <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                                      <Markdown>
                                        {businessPostedJobs.description}
                                      </Markdown>
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
                                  ) : null}

                                  <div class="space-y-2 mb-4 ">
                                    <label
                                      for="dactmi"
                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                    >
                                      Job Requirements
                                    </label>

                                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                                      <Markdown>
                                        {
                                          businessPostedJobs.applicantDescription
                                        }
                                      </Markdown>
                                    </div>
                                  </div>
                                  <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                                    <label
                                      for="dactmi"
                                      class="block mb-2 text-lg font-medium text-gray-900 "
                                    >
                                      Employment Benefits
                                    </label>

                                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                                      {businessPostedJobs.benefitsDescription ? (
                                        <Markdown>
                                          {
                                            businessPostedJobs.benefitsDescription
                                          }
                                        </Markdown>
                                      ) : (
                                        <p>Nothing listed</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {isDesktop ? (
                                  <div class="p-4 flex justify-between gap-x-2">
                                    <div class="w-full flex justify-end items-center gap-x-2">
                                      <button
                                        type="button"
                                        class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                        data-hs-overlay="#hs-pro-datm"
                                        onClick={() => onOpen()}
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
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                          />
                                        </svg>
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                        data-hs-overlay="#hs-pro-datm"
                                        onClick={() => onOpen()}
                                      >
                                        Apply
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    id="cookies-simple-with-dismiss-button"
                                    class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-full mx-auto px-2"
                                  >
                                    <div class="p-2 bg-white border border-gray-200 rounded-sm shadow-sm ">
                                      <div class="p-2 flex justify-between gap-x-2">
                                        <div class="w-full flex justify-center items-center gap-x-2">
                                          <button
                                            type="button"
                                            class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                            data-hs-overlay="#hs-pro-datm"
                                            onClick={() => onOpen()}
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
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                              />
                                            </svg>
                                            Save
                                          </button>
                                          <button
                                            type="button"
                                            class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                            data-hs-overlay="#hs-pro-datm"
                                            onClick={() => onOpen()}
                                          >
                                            Apply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DrawerBody>
                      </DrawerContent>
                    </Drawer>

                    <Modal isOpen={isOpenShare} onClose={onCloseShare}>
                      <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                          <div class="mt-5 bg-white rounded-xl ">
                            <div class="p-4 sm:p-7 text-center align-center items-center justify-center">
                              <div class="text-center align-center items-center justify-center mb-5">
                                <h1 class="block text-2xl font-bold text-gray-800">
                                  Share to
                                </h1>
                              </div>

                              <FacebookShareButton
                                url={`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`}
                              >
                                <FacebookIcon size={32} round={true} />
                              </FacebookShareButton>
                              <h1 class="block text-2xl font-bold text-gray-800">
                                Copy Link:
                              </h1>
                              {urlCopied ? (
                                <span class=" h-[24px] ml-1 inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-700 ">
                                  Copied!
                                </span>
                              ) : (
                                <label
                                  onClick={() =>
                                    handleCopiedURL(businessPostedJobs)
                                  }
                                  className=" inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium mt-2 "
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 ml-1 items-center cursor-pointer"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                    />
                                  </svg>
                                </label>
                              )}
                            </div>
                          </div>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </>
                ) : null}
              </>
            ))}
        </div>
      </div>

      <div
        id="cookies-simple-with-dismiss-button"
        class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-auto mx-auto px-2"
      >
        <div class="p-2 bg-transparent rounded-sm shadow-sm ">
          <div class="p-2 flex justify-between gap-x-2">
            <div class="w-full flex justify-center items-center gap-x-2">
              <button
                type="button"
                class=" border border-slate-800 shadow-sm py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                data-hs-overlay="#hs-pro-datm"
                onClick={() => navigate("/DoerMapLoggedOutClusterTest")}
              >
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
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                </svg>
                See Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        size={{ base: "full", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <div class="mt-5 bg-white rounded-xl ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign up</h1>
                <p class="mt-2 text-sm text-gray-600">It's fast and free</p>
              </div>

              <div class="mt-3">
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
                  Sign up with Google
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
                          <p class="block text-sm mb-2 text-red-500">
                            {validationMessage}
                          </p>
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
                          <p class="block text-sm mb-2 text-red-500">
                            {passwordValidationMessage}
                          </p>
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

                    <input
                      type="button"
                      onClick={() => validate()}
                      value="Sign up"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    ></input>
                    <p class="mt-2 text-center text-sm text-gray-600">
                      Already have an account?
                      <button
                        class="text-sky-400  decoration-2 hover:underline ml-1 font-medium"
                        onClick={() => handleSwitchModals()}
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenSignIn} onClose={onCloseSignIn}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div class="mt-5 bg-white rounded-xl ">
              <div class="p-4 sm:p-7">
                <div class="text-center">
                  <h1 class="block text-2xl font-bold text-gray-800">
                    Sign in
                  </h1>
                  {/* <p class="mt-2 text-sm text-gray-600">
                  It's free and fast
                  
                </p> */}
                </div>

                <div class="mt-3">
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
                    Sign up with Google
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
                            <p class="block text-sm mb-2 text-red-500">
                              {validationMessage}
                            </p>
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
                            <p class="block text-sm mb-2 text-red-500">
                              {passwordValidationMessage}
                            </p>
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

                      <input
                        type="button"
                        onClick={() => modalValidate()}
                        value="Sign up"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                      ></input>
                      <p class="mt-2 text-center text-sm text-gray-600">
                        Already have an account?
                        <button
                          class="text-sky-400  decoration-2 hover:underline ml-1 font-medium"
                          onClick={() => navigate("/DoerEmailRegister")}
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerListViewLoggedOut;
