import {InfoWindow, useMap} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Marker, MarkerClusterer} from '@googlemaps/markerclusterer';
import {Tree} from './trees';
import {TreeMarker} from './tree-marker';
import { auth, db } from "../../firebaseConfig.js";


import {Helmet} from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
    doc,
    getDoc,
    collectionGroup,
  
    query,
    collection,
    onSnapshot,
  } from "firebase/firestore";

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
    import JobFilter from "../../pages/Doer/components/JobFilter.jsx"
    import { useSearchResults } from "../../pages/Doer/Chat/lib/searchResults"
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



import { FcGoogle } from "react-icons/fc";
// import LoggedOutHeader from "./Landing/LoggedOutHeader.jsx";
import { useMediaQuery } from "@chakra-ui/react";

import Plausible from 'plausible-tracker'
// import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";


/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredTreeMarkers = ({trees}) => {
  const [markers, setMarkers] = useState({});
  const [selectedTreeKey, setSelectedTreeKey] = useState(null);

  const selectedTree = useMemo(
    () =>
      trees && selectedTreeKey
        ? trees.find(t => t.jobID === selectedTreeKey)
        : null,
    [trees, selectedTreeKey]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({map});
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker, key) => {
    setMarkers(markers => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return {...markers, [key]: marker};
      } else {
        const {[key]: _, ...newMarkers} = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedTreeKey(null);
  }, []);

  const handleMarkerClick = useCallback((tree) => {
    setSelectedTreeKey(tree.key);
  }, []);


//   all imported logic from DoerMapLoggedOut
const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  const { searchResults, searchIsMobile, setSearchIsMobile } = useSearchResults()

//   const closeInfoWindow = props.props

//   useEffect(() => {
// console.log(closeInfoWindow)
//     if (closeInfoWindow === true) {
//       setOpenInfoWindowMarkerID(null)
//     } 


//   }, [closeInfoWindow])

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

  return (
    <>
      {trees.map(tree => (
        <TreeMarker
          key={tree.key}
          tree={tree}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedTreeKey && (
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
      )}
    </>
  );
};
