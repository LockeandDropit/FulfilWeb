import React, { useState, useEffect, useRef } from "react";

import Header from "./Header.jsx";
import {Helmet} from "react-helmet";
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
  useMap
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Marker } from "@googlemaps/markerclusterer";
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

  const { searchResults, searchIsMobile, setSearchIsMobile } = useSearchResults()

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
    } else if (searchResults !== null && searchResults[0].isFullTimePosition === "gigwork" ) {
        setPostedJobs(searchResults)
        setBusinessPostedJobs(null)

    }
    else {
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

  const {
    isOpen: isOpenPlumber,
    onOpen: onOpenPlumber,
    onClose: onClosePlumber,
  } = useDisclosure();
  const {
    isOpen: isOpenServer,
    onOpen: onOpenServer,
    onClose: onCloseServer,
  } = useDisclosure();

  const {
    isOpen: isOpenCNC,
    onOpen: onOpenCNC,
    onClose: onCloseCNC,
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
    setUrlCopied(false)
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
      setPasswordValidationMessage( "Password Invalid. Must be at least 6 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number");
    } else {
      setPasswordValidationMessage();
    }
    if (isValid && isValidPassword) {
      onSignUp();
    }
  };


  const handleSwitchModals = () => {
    onClose()
    onOpenSignIn()
  }



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
console.log("session id ", sessionId)
    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        if (doc.data().jobID === sessionId) {
            if (doc.data().isPostedByBusiness === true) {
              // postedByBusiness.push({ ...doc.data(), id: doc.id });
              // setPostedJobs([])
              handlePostedByBusinessToggleOpen(doc.data())
              console.log("business result inner", doc.data())
            } else if (doc.data().isFullTimePosition === "gigwork") {
              handlePostedByBusinessToggleOpen(doc.data())
              console.log("gig link", doc.data())
            }
        } else {

        }
      });

      // setPostedJobs(results);
      // setBusinessPostedJobs(postedByBusiness);
    });
  }
  }, [])

  const [urlCopied, setUrlCopied] = useState(false)


  const handleCopiedURL = (businessPostedJobs) => {
    setUrlCopied(true)
    navigator.clipboard.writeText(`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`)
  }


  const [subscriberEmail, setSubscriberEmail] = useState(null)

  const handleNewEmailSignUp = async () => {

   // insert email regex, if then
   onCloseEmailSignUp()
   onOpenEmailSignUpSuccess()

   console.log("subscriberEmail", subscriberEmail)

    const response = await fetch(
    
      "https://emailapi-qi7k.onrender.com/newEmailSignUp",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: subscriberEmail}),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error)

    onCloseEmailSignUp()
    onOpenEmailSignUpSuccess()
  }


  //bettter useEffect than I write https://www.youtube.com/watch?v=QQYeipc_cik&t=788s
// useEffect(() => {
//   const openEmail = () => setTimeout(() => {
//     onOpenEmailSignUp()
//     }, 120000
//     );

//       openEmail()

// }, [])

const [scrollBehavior, setScrollBehavior] = React.useState('inside')



 //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
    

      <LoggedOutHeaderNoGap props={openModal} />

{/* <div class=" mx-auto px-4 sm:px-6 lg:px-8"> */}
<div class=" mx-auto">
      

      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        
        <Box
              h={{ base: "100vh", lg: "92vh" }}
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
                    
                 
                 
                    ml={{ base: "0px", md: "80px" }}
                  >
                      <JobFilter />
                    
                  </Card>
                </Center>) : (<Center>
                  
                  <Card
                    align="center"
                
                 
                    
                 width={{base: "100vw"}}
                 
                  >
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
                        //  ref={(marker) => setMarkerRef(marker, businessPostedJobs.key)}
                        onClick={() =>
                          handlePostedByBusinessToggleOpen(businessPostedJobs)
                        }
                      >
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {businessPostedJobs.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : businessPostedJobs.isSalaried ? (
                            <p>
                              ${businessPostedJobs.lowerRate} yearly - ${businessPostedJobs.upperRate} yearly
                            </p>
                          ) : ( businessPostedJobs.upperRate > businessPostedJobs.lowerRate ?  (<p>
                            ${businessPostedJobs.lowerRate}/hr + 
                          </p>) : ( <p>
                              ${businessPostedJobs.lowerRate}/hr
                            </p>)
                           
                          )}
                        </button>
                        /
                      </AdvancedMarker>
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
                <meta name="description" content={businessPostedJobs.description} />
                {/* <link rel="canonical" href=`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}` /> */}
            </Helmet>
                                <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                                  {/* <div class="py-3 px-4 flex justify-between items-center border-b ">
                                  <h3 class="font-semibold text-gray-800">Create A Job</h3>
                              
                                </div> */}

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 ">
                                      <div class="">
                                        <div className="flex">
                                        <label
                                          for="hs-pro-dactmt"
                                          class="block mb-2 text-lg font-medium text-gray-800">
                                          {businessPostedJobs.jobTitle}
                                        </label>

{/*                                        
                                        <label onClick={() => onOpenShare()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-1 cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
</svg>

                                         
                                        </label> */}

                                        {businessPostedJobs.jobTitle.includes("Plumber") ? (  <label onClick={() => onOpenPlumber()} >
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 ml-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
                                        </label>) : (null) }
                                        {businessPostedJobs.jobTitle.includes("Server" || "server") ? (  <label onClick={() => onOpenServer()} >
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 ml-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
                                        </label>) : (null) }
                                         {businessPostedJobs.jobTitle.includes("Machinist" || "CNC") ? (  <label onClick={() => onOpenCNC()} >
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 ml-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>
</label>) : (null) }
                                       
                                      
                                        </div>
                                {businessPostedJobs.isFullTimePosition === true ? ( <label
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
                                     

                                      <div class="space-y-2 mb-4 ">
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
                                      <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                                        <label
                                          for="dactmi"
                                          class="block mb-2 text-md font-medium text-gray-800 "
                                        >
                                          Employment Benefits
                                        </label>

                                        <div class="mb-4">
                                        {businessPostedJobs.benefitsDescription ? (  <p>{businessPostedJobs.benefitsDescription}</p>) : (  <p>Nothing listed</p>)}
                                          
                                        </div>
                                      </div>
                                    </div>

                                    {isDesktop ? (<div class="p-4 flex justify-between gap-x-2">
                                      
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => onOpen()}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
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
                                    </div>) : (
                                      <div id="cookies-simple-with-dismiss-button" class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-full mx-auto px-2">
                                         <div class="p-2 bg-white border border-gray-200 rounded-sm shadow-sm ">
                                        <div class="p-2 flex justify-between gap-x-2">
                                      <div class="w-full flex justify-center items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => onOpen()}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
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
                                    </div>)}
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
                                  <h1 class="block text-2xl font-bold text-gray-800">Share to</h1>
                                  
                                </div>
                  
                                <FacebookShareButton url={`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`}>
                                                          <FacebookIcon size={32} round={true}/>
                                                    
                                                          </FacebookShareButton>
                                                          <h1 class="block text-2xl font-bold text-gray-800">Copy Link:</h1>
                          {urlCopied ? (<span class=" h-[24px] ml-1 inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-700 ">Copied!</span>) : (<label onClick={() => handleCopiedURL(businessPostedJobs)} className=" inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium mt-2 ">
                                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-1 items-center cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                  </svg>
                  
                                                           
                                                          </label>)}
                              </div>
                            </div>
                            </ModalBody>
                  
                          
                          </ModalContent>
                        </Modal>
                        </>
                      ) : null}
                       {/* <Modal isOpen={isOpenShare} onClose={onCloseShare}>
     
        <ModalContent>
       
          <ModalCloseButton />
          <ModalBody>
          <div class="mt-5 bg-white rounded-xl ">
            <div class="p-4 sm:p-7 text-center align-center items-center justify-center">
              <div class="text-center align-center items-center justify-center mb-5">
                <h1 class="block text-2xl font-bold text-gray-800">Share to</h1>
                
              </div>

              <FacebookShareButton url={`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`}>
                                        <FacebookIcon size={32} round={true}/>
                                        {businessPostedJobs.jobID}
                                        </FacebookShareButton>
                                        <h1 class="block text-2xl font-bold text-gray-800">Copy Link:</h1>
        {urlCopied ? (<span class=" h-[24px] ml-1 inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-700 ">Copied!</span>) : (<label onClick={() => handleCopiedURL(businessPostedJobs)} className=" inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium mt-2 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-1 items-center cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
</svg>

                                         
                                        </label>)}
            </div>
          </div>
          </ModalBody>

        
        </ModalContent>
      </Modal> */}
                    </>
                  ))}

{postedJobs !== null &&
                  postedJobs.map((postedJobs) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={postedJobs.jobID}
                        position={{
                          lat: postedJobs.locationLat
                            ? postedJobs.locationLat
                            : 44.96797106363888,
                          lng: postedJobs.locationLng
                            ? postedJobs.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() =>
                          handlePostedByBusinessToggleOpen(postedJobs)
                        }
                      >
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {postedJobs.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : postedJobs.isFlatRate ? (
                            <p>
                              ${postedJobs.flatRate}
                            </p>
                          ) : (postedJobs.upperRate > postedJobs.lowerRate ?  (<p>
                            ${postedJobs.lowerRate}/hr + 
                          </p>) : ( <p>
                              ${postedJobs.lowerRate}/hr
                            </p>)
                           
                          )}
                        </button>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === postedJobs.jobID ? (
                        <Drawer
                          onClose={onCloseDrawer}
                          isOpen={isOpenDrawer}
                          size={"xl"}
                        >
                          <DrawerOverlay />
                          <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>
                              {postedJobs.jobTitle}
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
                                        <div className="flex">
                                        <label
                                          for="hs-pro-dactmt"
                                          class="block mb-2 text-lg font-medium text-gray-800">
                                          {postedJobs.jobTitle}
                                        </label>
                                        {urlCopied ? (<span class=" h-[24px] ml-1 inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-700 ">Copied!</span>) : (<label onClick={() => handleCopiedURL(postedJobs)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-1 cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
</svg>

                                         
                                        </label>)}
                                        </div>
                                 <label
                                          for="hs-pro-dactmt"
                                          class="block  text-md font-medium text-gray-800"
                                        >
                                          Gig-work
                                        </label>
                                       

                                        {postedJobs.isHourly ? (
                                          <div class="space-y-1 ">
                                            <div class="flex align-items-center">
                                              <p className=" text-sm font-medium">
                                                $
                                              </p>
                                              <label
                                                for="hs-pro-dactmt"
                                                class="block text-sm font-medium text-gray-800 "
                                              >
                                                {postedJobs.lowerRate}
                                              </label>
                                              <p className=" text-sm font-medium">
                                                /hour - $
                                              </p>
                                              <label
                                                for="hs-pro-dactmt"
                                                class="block  text-sm font-medium text-gray-800 "
                                              >
                                              {postedJobs.upperRate}
                                              </label>
                                              <p className=" text-sm font-medium">
                                                /hour
                                              </p>
                                            </div>
                                          </div>
                                        ) :  <div class="flex align-items-center">
                                             <label
                                          for="hs-pro-dactmt"
                                          class="block  text-md font-medium text-gray-800"
                                        >
                                          Budget:
                                        </label>
                                       
                                      
                                        <label
                                          for="hs-pro-dactmt"
                                          class="block  ml-1 text-md font-medium text-gray-800 "
                                        >
                                          ${postedJobs.flatRate}
                                        </label>
                                        <p className=" ml-1 text-md font-medium">
                                           total
                                        </p>
                                      </div>}

                                        {postedJobs.isFlatRate ? (
                                           <div class="space-y-2 ">
                                           <div class="flex align-items-center">
                                             <p className=" text-sm font-medium">
                                               $
                                             </p>
                                             <label
                                               for="hs-pro-dactmt"
                                               class="block  text-sm font-medium text-gray-800 "
                                             >
                                               {postedJobs.lowerRate}
                                             </label>
                                             <p className="ml-1 text-sm font-medium ">
                                                /yr - $
                                             </p>
                                             <label
                                               for="hs-pro-dactmt"
                                               class="block  text-sm font-medium text-gray-800 "
                                             >
                                               {postedJobs.upperRate}
                                             </label>
                                             <p className=" ml-1 text-sm font-medium">
                                                /yr
                                             </p>
                                           </div>
                                         </div>
                                        ) : null}
  <p class="block  text-sm font-medium text-gray-800 ">{postedJobs.streetAddress}, {postedJobs.city}, {postedJobs.state}</p>
<p class="font-semibold text-sm text-gray-500  cursor-default">
                                          <span className="font-semibold text-sm text-slate-700">
                                            {" "}
                                            Posted:
                                          </span>{" "}
                                          {postedJobs.datePosted}
                                        </p>
                                       
                                        <div className="flex">
                                        {postedJobs.employerProfilePicture ? (
<> <p class="font-semibold text-sm text-slate-700  mt-2 cursor-pointer">
                                         Posted by:
                                        </p>
                                          <div class="flex flex-col justify-center items-center size-[56px]  ">
                                           
                                              <img
                                                src={
                                                  postedJobs.employerProfilePicture
                                                }
                                                class="flex-shrink-0 size-[64px] rounded-full"
                                              />
                                            
                                            <div className="flex flex-col ml-4">
                                            <p class="font-semibold text-sm text-gray-500  mt-2 cursor-pointer">
                                              {postedJobs.businessName}
                                            </p>
                                            <p class="font-semibold text-sm text-gray-500 cursor-default ">
                                              {postedJobs.city}, Minnesota
                                            </p>
                                          </div>
                                            
                                          </div>
                                        
                                          </>  ) : ( <div className="flex flex-row">
                                            <p class="font-semibold text-sm text-slate-700  mt-2 cursor-pointer">
                                         Posted by:
                                        </p>
                                        <p class="ml-1 font-semibold text-sm text-gray-500  mt-2 cursor-pointer">
                                              {postedJobs.firstName}
                                            </p>
                                            </div>)}
                                          <div className="flex flex-col">
                                           
                                            
                                          </div>
                                       
                                       </div>
                                      </div>
                                     


                                     
                                      <div class="space-y-2 mt-10 mb-4">
                                        <label
                                          for="dactmi"
                                          class="block mb-2 text-md font-medium text-gray-800 "
                                        >
                                        Description
                                        </label>

                                        <div class="mb-4">
                                          <p>{postedJobs.description}</p>
                                        </div>
                                      </div>
                                                {postedJobs.bio ? (
                                                   <div class="space-y-2 mt-10 mb-4">
                                                   <label
                                                     for="dactmi"
                                                     class="block mb-2 text-md font-medium text-gray-800 "
                                                   >
                                                   About {postedJobs.companyName}
                                                   </label>
           
                                                   <div class="mb-4">
                                                     <p>{postedJobs.bio}</p>
                                                   </div>
                                                 </div>
                                                ) : (null)}
                                     

                                  
                                     
                                    </div>


                                       
                                    <div class="p-4 flex justify-between gap-x-2">
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => onOpen()}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
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
                                  </div>
                                </div>
                              </div>
                            </DrawerBody>
                          </DrawerContent>
                        </Drawer>
                      ) : null}
                    </>
                  ))}
         

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
                <p class="mt-2 text-sm text-gray-600">
                  It's fast and free
                  
                </p>
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
                     onClick={() => validate()}
                     value="Sign up"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                   
                    </input>
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
       
          <ModalCloseButton />
          <ModalBody>
          <div class="mt-5 bg-white rounded-xl ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
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
                     value="Sign up"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                   
                    </input>
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
      {/* <Modal isOpen={isOpenEmailSignUp} onClose={onCloseEmailSignUp} >
   
        <ModalContent    pointerEvents="all"
    containerProps={{ pointerEvents: "none" }}>
        
          <ModalBody>      
            <div id="cookies-simple-with-icon-and-dismiss-button" class="fixed bottom-0 end-0 z-[60] w-auto items-center justify-center mx-auto p-6">
  <div class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm ">
    <div class="gap-x-4">
      <p class="text-sm font-semibold text-gray-800">
        Not seeing a job that suites you? Enter your email to get updates about new jobs <a class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium ">near you.</a>
      </p>
      <div>
        <div className="flex mt-2">
      <div class="w-full space-y-3">
  <input type="text" onChange={(e) => setSubscriberEmail(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="Enter your email here" />
</div>
        <button type="button"   class="w-1/4 ml-1 py-1 px-2  items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none" onClick={() => handleNewEmailSignUp()}>
          <span >Stay Notified</span>
        </button>
        </div>
      </div>
    </div>
  </div>

</div>
</ModalBody>
</ModalContent>
</Modal> */}

<Modal  isCentered isOpen={isOpenEmailSignUp} onClose={onCloseEmailSignUp} size={"md"} >
   <ModalOverlay />
   <ModalContent >
   
     <ModalBody>      
    
  <div class="  mt-0   sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div class=" ">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h2 class="block text-2xl font-bold text-gray-800 ">Not seeing a job that suites you?</h2>
          <p class="mt-2 text-sm text-gray-600">
          Enter your email to get updates about new jobs <a class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium ">near you.</a>
          
          </p>
        </div>

        <div class="mt-5">
 
          
            <div class="grid gap-y-4">
          
              <div>
                <label for="email" class="block text-sm mb-2 ">Email address</label>
                <div class="relative">
                  <input type="email" id="email" name="email" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" onChange={(e) => setSubscriberEmail(e.target.value)}/>
                  <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                    <svg class="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                  </div>
                </div>
                <p class="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
              </div>
            

              <button type="submit" onClick={() => handleNewEmailSignUp()} class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 ">Keep me updated!</button>
            </div>
        
    
        </div>
      </div>
    </div>
  </div>

</ModalBody>
</ModalContent>
</Modal>

<Modal isOpen={isOpenEmailSignUpSuccess} onClose={onCloseEmailSignUpSuccess} isCentered >
   <ModalOverlay />
   <ModalContent >
   
     <ModalBody>      
    
  <div class="  mt-0   sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div class=" ">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h2 class="block text-2xl font-bold text-gray-800 ">We'll keep you updated!</h2>
          <p class="mt-2 text-sm text-gray-600">
        Check your inbox regularly for job opprotunities near you
          
          </p>
        </div>

        <div class="mt-5">
 
       
            <div class="grid gap-y-4">
          
             
            

              <button type="submit" onClick={() => onCloseEmailSignUpSuccess()} class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 ">Continue browsing</button>
            </div>
      
    
        </div>
      </div>
    </div>
  </div>

</ModalBody>
</ModalContent>
</Modal>


 <div id="cookies-simple-with-dismiss-button" class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-auto mx-auto px-2">
                                         <div class="p-2 bg-transparent rounded-sm shadow-sm ">
                                        <div class="p-2 flex justify-between gap-x-2">
                                      <div class="w-full flex justify-center items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="border shadow-sm border-slate-800 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => navigate("/DoerListViewLoggedOut")}
                                        >
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>


                                         List View
                                        </button>
                                      
                                      </div>
                                    </div>
                                    </div>
                                    </div>
{/* <div id="cookies-simple-with-dismiss-button" class="  fixed bottom-0 flex justify-end  z-[60] sm:max-w-4xl w-auto  p-6">
 
  <div class="p-4 bg-white border border-gray-200 rounded-xl shadow-sm ">
    <div class="flex justify-between items-center gap-x-5 sm:gap-x-10" onClick={() => navigate("/DoerListViewLoggedOut")}>
      <h2 class="text-md font-semibold text-slate-800 cursor-pointer ">
        List View 
      </h2>
    
    </div>
  </div>
</div> */}

<Modal isOpen={isOpenPlumber} onClose={onClosePlumber} size="xl"  scrollBehavior={scrollBehavior}>
        <ModalOverlay />
        <ModalContent   >
       
          <ModalCloseButton />
          <ModalBody scrollBehavior={scrollBehavior} >
          <div class="">
            <div class="bg-white  rounded-xl shadow-sm  ">
              <div class="p-4 sm:p-7">
                <div class="text-start">
                  <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800">
                    Plumber career path
                  </h2>
                  <div class=" mx-auto">
                    
                    <p class="mt-2 text-base text-gray-600 ">
                    <p class="mt-4 text-base text-black "> Entry level:</p>
                   
Entry level plumbers include plumbing apprentices, employees with no certifications, and employees fresh out of school.<span class="mt-4 text-xs text-gray-500 ">(1)</span>
 <ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black "> Plumbing Apprentice: $43,680</li>
           <li class="mt-2 text-base text-black "> Plumber’s Assistant: roughly $56,000 - $74,225</li>

           </ol>

   <p class="mt-4 text-base text-black ">Mid level:</p>

  

Mid-Level plumbers typically have 2-3 years of experience and have the certifications necessary to work independently.<span class="mt-4 text-xs text-gray-500 ">(1)</span>

<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black "> Residential Service Technician: $55k-$65k <span class="mt-4 text-xs text-gray-500 ">(3)</span></li>
          Residential Service Technician:  clean all types of drains and sewers using special electromechanical equipment. 
           <li class="mt-2 text-base text-black "> Commercial Service Technician:</li>
           Same as residential, but in commercial spaces. 
           <li class="mt-2 text-base text-black "> Commercial Service Technician:</li>
           </ol>
 <p class="mt-4 text-base text-black ">Senior plumbing positions:</p>

Senior-level plumbers typically have 7-10 years of experience in the plumbing industry.<span class="mt-4 text-xs text-gray-500 ">(1)</span>


<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black ">Residential Contractor</li>
          Installs, maintains, and repairs pipes and fixtures associated with heating, cooling, water distribution, and sanitation systems in residential and commercial structures. Fixes domestic appliances, such as dishwashers and gas cookers. Inspects drainage and other plumbing systems for compliance with local and national regulations. <span class="mt-4 text-xs text-gray-500 ">(4)</span> Average pay: $68,763
           <li class="mt-2 text-base text-black ">Commercial Contractor:</li>
           Same as residential, but in commercial spaces. Average pay: $63,009
           <li class="mt-2 text-base text-black ">Project Manager:</li>
           $80,281
           </ol>

 <p class="mt-4 text-xs text-gray-500 ">Sources:</p>
  <p class="text-xs text-gray-500 ">1 https://faradaycareers.com/careers/plumber-career-path</p>
    <p class="text-xs text-gray-500 ">3 https://www.rotorooter.com/careers/service-tech/</p>
      <p class="text-xs text-gray-500 ">4 https://www.monster.co.uk/advertise-a-job/resources/job-description-templates/construction/plumber-job-description/</p>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end items-center ">
                <button
                  onClick={() => onClosePlumber()}
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                  href="#"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
          </ModalBody>

        
        </ModalContent>
      </Modal>

      
<Modal isOpen={isOpenServer} onClose={onCloseServer} >
        <ModalOverlay />
        <ModalContent height="100vh">
          
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
          <div class="rounded-xl sm:max-w-lg sm:w-full m-3 sm:mx-auto ">
            <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
              <div class="p-4 sm:p-7">
                <div class="text-start">
                  <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800">
                  Server career path
                  </h2>
                  <div class=" mx-auto">
                    
                    <p class="mt-2 text-base text-gray-600 ">
                    <p class="mt-4 text-base text-black "> Entry level:</p>
                   
 <ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black "> Waiter/Waitress<span class="mt-4 text-xs text-gray-500 ">(1)</span> : $20,000 and $31,000<span class="mt-4 text-xs text-gray-500 ">(2)</span></li>
          The waiter or waitress is generally delegated an area within the restaurant that he or she attends to. In this area they are responsible for ensuring that guests are properly attended to. 

          

           </ol>

   <p class="mt-4 text-base text-black ">Mid level:</p>

  



<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black ">  FoH Supervisor <span class="mt-4 text-xs text-gray-500 ">(1)</span> : Average salary: $47k-$73k <span class="mt-4 text-xs text-gray-500 ">(3)</span></li>
          Front of house supervisor is generally responsible for all front of house staff and operations. They oversee all the various duties and responsibilities of other team members and ensure operations are running smoothly. 
         
           </ol>
 <p class="mt-4 text-base text-black ">Senior level:</p>




<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black ">General Manager <span class="mt-4 text-xs text-gray-500 ">(1)</span>. Average Salary: $56,521 <span class="mt-4 text-xs text-gray-500 ">(4)</span></li>
          The general manager has more logistical responsibility and is often responsible for overseeing the functioning of both the Front of House operations and Back of House operations. 
           </ol>

 <p class="mt-4 text-xs text-gray-500 ">Sources:</p>
  <p class="text-xs text-gray-500 ">1 https://advice.hosco.com/en/the-career-path-of-a-waiter-waitress-an-exciting-journey/</p>
  <p class="text-xs text-gray-500 ">2 https://pos.toasttab.com/blog/on-the-line/restaurant-server-salary</p>
    <p class="text-xs text-gray-500 ">3 https://www.glassdoor.com/Salaries/front-of-house-supervisor-salary-SRCH_KO0,25.htm</p>
      <p class="text-xs text-gray-500 ">4 https://www.zippia.com/salaries/restaurant-general-manager/</p>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end items-center ">
                <button
                  onClick={() => onCloseServer()}
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                  href="#"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
          </ModalBody>

        
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenCNC} onClose={onCloseCNC} >
        <ModalOverlay />
        <ModalContent height="100vh">
          
          <ModalCloseButton />
          <ModalBody overflowY="scroll">
          <div class="rounded-xl sm:max-w-lg sm:w-full m-3 sm:mx-auto ">
            <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
              <div class="p-4 sm:p-7">
                <div class="text-start">
                  <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800">
                 CNC Machinist career path
                  </h2>
                  <div class=" mx-auto">
                    
                    <p class="mt-2 text-base text-gray-600 ">
                    <p class="mt-4 text-base text-black "> Entry level:</p>
                   
 <ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black "> Long-term operator . Average salary: $51,703<span class="mt-4 text-xs text-gray-500 ">(2)</span></li>
          Most entry-level CNC machinists start as machine operators, gaining skills and experience as they progress. 

<span class="mt-4 text-xs text-gray-500 ">(1)</span>
          

           </ol>

   <p class="mt-4 text-base text-black ">Mid level:</p>

  



<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black ">  Set-up machinist. Average Salary: $84,142 <span class="mt-4 text-xs text-gray-500 ">(3)</span> </li>
From a machine operator, many machinists transition into being put in charge of setting-up CNC machines. This includes understanding GD&T (geometric dimensioning and tolerancing) and making changes at the CNC machine’s controller. <span class="mt-4 text-xs text-gray-500 ">(1)</span>
           
           <li class="mt-2 text-base text-black "> CNC programmer – average salary: $77,226 <span class="mt-4 text-xs text-gray-500 ">(5)</span> </li>
           As a CNC programmer, your job is to create the code that tells the CNC systems how to make the part you need. This includes programming, designing parts and optimizing  performance. Often, you will also be responsible for inspection of your parts. <span class="mt-4 text-xs text-gray-500 ">(1)</span> 
           </ol>
 <p class="mt-4 text-base text-black ">Senior level:</p>




<ol class="ml-7 list-disc">
          <li class="mt-2 text-base text-black "> Manager – Average pay: $100k  <span class="mt-4 text-xs text-gray-500 ">(4)</span>.</li>
         As you progress, you can eventually lead and manage others. Managers train employees in the proper use of equipment, enforce safety regulations, assign tasks, and oversee employees' work. They also interpret blueprints and develop plans for how to complete a project. This is as well as upgrading and maintaining machinery, ordering parts, and making sure repair records are kept up to date. (1)

           </ol>

 <p class="mt-4 text-xs text-gray-500 ">Sources:</p>
  <p class="text-xs text-gray-500 ">1 https://www.trscraftservices.com/blogs/2020-9/what-is-the-career-path-for-a-cnc-machinist</p>
  <p class="text-xs text-gray-500 ">2 https://www.indeed.com/career/cnc-operator/salaries</p>
    <p class="text-xs text-gray-500 ">3 https://www.indeed.com/career/machinist/salaries/Minneapolis--MN</p>
      <p class="text-xs text-gray-500 ">4 https://www.indeed.com/career/cnc-programmer/salaries</p>
      <p class="text-xs text-gray-500 ">4 https://www.indeed.com/career/cnc-programmer/salaries</p>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end items-center ">
                <button
                  onClick={() => onCloseCNC()}
                  class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                  href="#"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
          </ModalBody>

        
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
