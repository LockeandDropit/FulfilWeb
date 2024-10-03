import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import AddJobBusiness from "../Components/AddJobBusiness.jsx";
import { SingleMarker } from "./SingleMarker.jsx";
import { auth, db } from "../../../firebaseConfig.js";
import { useJobStore } from "../HomePage/lib/jobsStoreDashboard.js";
import { Helmet } from "react-helmet";
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
  updateDoc,
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
  useDisclosure,
} from "@chakra-ui/react";

import { useSearchResults } from "../../../pages/Doer/Chat/lib/searchResults";
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
import Markdown from "react-markdown";

import { FcGoogle } from "react-icons/fc";
// import LoggedOutHeader from "./Landing/LoggedOutHeader.jsx";
import { useMediaQuery } from "@chakra-ui/react";
import { addJobStore } from "../HomePage/lib/addJobStore";
import Plausible from "plausible-tracker";
import { useUserStore } from "../../../pages/Needer/Chat/lib/userStore.js";
// import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";

/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredMarkers = ({ trees, sameLocationJobs }) => {
  //this is where credited code starts
  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  const [markers, setMarkers] = useState({});
  const [selectedTreeKey, setSelectedTreeKey] = useState(null);
  const { fetchUserInfo, currentUser } = useUserStore();

  const selectedTree = useMemo(
    () =>
      trees && selectedTreeKey
        ? trees.find((t) => t.jobID === selectedTreeKey)
        : null,
    [trees, selectedTreeKey]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  var options = { zoomOnClick: false };
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map, options });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  //   all imported logic from DoerMapLoggedOut


  const { jobHeld, addJobInfo} = addJobStore()



  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  const { searchResults, searchIsMobile, setSearchIsMobile } =
    useSearchResults();

  //map help https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
  const [open, setOpen] = useState(false);

  //opening one window at a time help from https://github.com/Developer-Nijat/React-Google-Map-Markers/blob/main/src/App.jsx & https://www.youtube.com/watch?v=Uq-0tA0f_X8 & Vadim Gremyachev https://stackoverflow.com/questions/50903246/react-google-maps-multiple-info-windows-opening-up

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState({
    lat: 1,
    lng: 1,
  });

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

  const {
    isOpen: isOpenDrawerSingle,
    onOpen: onOpenDrawerSingle,
    onClose: onCloseDrawerSingle,
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

  const [searchJobCategory, setSearchJobCategory] = useState(null);

  const [showAddJobBusiness, setShowAddJobBusiness] = useState(false);

  const toggleModal = () => {
    setShowAddJobBusiness(!showAddJobBusiness);
  };

  useEffect(() => {
    if (jobHeld) {
     handleGroupLocationToggleOpen(jobHeld)
     setShowAddJobBusiness(false)
     console.log("firing 1")
    //  onOpenDrawer()
    }
  },[jobHeld])

  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
    // updateJobListingViews(x);
    onOpenDrawerSingle();
    console.log("from on click", x);
  };

  const handleGroupLocationToggleOpen = (x) => {
    console.log("group open toggle", x.jobID);
    setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
    // setOpenInfoWindowMarkerID(x.jobID);
    // updateJobListingViews(x);
    onOpenDrawer();
    console.log("same locationJobs", sameLocationJobs);
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
          setIsSignedIn(true);
          const currentUser = response.user.uid;
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

  //bettter useEffect than I write https://www.youtube.com/watch?v=QQYeipc_cik&t=788s
  // useEffect(() => {
  //   const openEmail = () => setTimeout(() => {
  //     onOpenEmailSignUp()
  //     }, 120000
  //     );

  //       openEmail()

  // }, [])

  const [locationJobs, setLocationJobs] = useState([]);

  useEffect(() => {
    if (openInfoWindowMarkerID) {
      try {
        const q = query(
          collection(db, "employers", currentUser.uid, "Posted Jobs")
        );

        onSnapshot(q, (snapshot) => {
          let results = [];
          let postedByBusiness = [];

          snapshot.docs.forEach((doc) => {

            if (
              openInfoWindowMarkerID.lat === doc.data().locationLat &&
              openInfoWindowMarkerID.lng === doc.data().locationLng
            )
              postedByBusiness.push({ ...doc.data(), id: doc.id, key: doc.id });
          });

          //   setIsLoading(false);

          setLocationJobs(postedByBusiness);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [openInfoWindowMarkerID]);

  const { fetchJobInfo, setJobHiringState } = useJobStore();

  const handleStoreAndNavigatePosted = (x) => {
    console.log(x.jobTitle, x.jobID)

    fetchJobInfo(currentUser.uid, x.jobID, "Posted Jobs", x.jobTitle);
    if (x.hasNewApplicant === true) {
      updateDoc(
        doc(db, "employers", currentUser.uid, "Posted Jobs", x.jobTitle),
        {
          hasNewApplicant: false,
        }
      )
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
          console.log(error);
        });
    }
    setTimeout(() => navigate("/JobDetails"), 0);
  };


  const [newTrees, setNewTrees] = useState([]);



  const filterOutSameLocation = () => {
    //map over and create lat lng object for each grouped lat/lng value

    let newTrees = [];
    sameLocationJobs.forEach((job) => {
      let thisLocation = { lat: job.locationLat, lng: job.locationLng };
      // console.log(thisLocation)
      trees.forEach((tree) => {
        let treeLocation = { lat: tree.locationLat, lng: tree.locationLng };
        // console.log(treeLocation)
        if (job.locationLat === tree.locationLat) {
            //credit https://stackoverflow.com/questions/21659888/find-and-remove-objects-in-an-array-based-on-a-key-value-in-javascript
          trees = trees.filter(function (obj) {
            return obj.id !== tree.id;
          });
        } else {
          // console.log(thisLocation, treeLocation)
        }
        setNewTrees(trees);
        console.log("new treess", newTrees);
      });
    });
    //with each one check it against all other listed positions in singlePostedJobs.
    //If it does exist, remove it from the array
  };

  const [groupJobs, setGroupJobs] = useState([])

  useEffect(() => {
    if (trees && sameLocationJobs) {
      filterOutSameLocation();
      console.log("1");
      setGroupJobs(sameLocationJobs)
    } else if (trees && !sameLocationJobs) {
      setNewTrees(trees)
    
    }
  }, [sameLocationJobs, trees]);

  //set lat lng of job passed so you can pass it to AddJobBusiness component and also reopen(?) the appropriate drawer when closed.
 
  const [heldSelected, setHeldSelected] = useState(null)

  const handleToggleAddJobSameLocation = (x) => {
    setHeldSelected(x)

    setShowAddJobBusiness(!showAddJobBusiness)
    onCloseDrawer()
    onCloseDrawerSingle()
  }

  const handleGroupDrawerClose = () => {
    addJobInfo(null)
    setShowAddJobBusiness(false)
    setTimeout(() => {
 onCloseDrawer() 
    }, 100)

  }


  const { isOpenActivity, onOpenActivity, onCloseActivity } = useDisclosure();

  const handleChangeJobActivity = () => {
    onOpen();
  };
  const changeJobActivityStatus = (x) => {
    //change local store so changes are displayed

    //update firebase
    updateDoc(doc(db, "Map Jobs", x.jobID), {
      isActive: !x.isActive,
    });
    updateDoc(
      doc(db, "employers", currentUser.uid, "Posted Jobs", x.jobTitle),
      {
        isActive: !x.isActive,
      }
    )
      .then(() => {
        onClose();

        fetchJobInfo(currentUser.uid, x.jobID, "Posted Jobs", x.jobTitle);
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  // what I can do... is I can
  // remove all positions that have repeated lat/lngs (matching positions) and put them in a seperate array.
  //The clustering will then take care of everything until a certain zoom level, but when they are all grouped together they wont unbundle because they've always been bundled...

  //what if I did it here and got rid of clustering...



//so i have to make a store that accepts the heldJob object from AddJobBusiness
// read it here, if not null then trigger an opening of the drawer below


  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  return (
    <>
      {groupJobs.map((group) => (
        <>
        <AdvancedMarker
          zIndex={800}
          position={{
            lat: group.locationLat ? group.locationLat : 44.96797106363888,
            lng: group.locationLng ? group.locationLng : -93.26177106829272,
          }}
          onClick={() => handleGroupLocationToggleOpen(group)}
        >
          <button
            type="button"
            class=" z-50 py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
          >
            Multiple positions
          </button>
        </AdvancedMarker>
        {openInfoWindowMarkerID.lat === group.locationLat ? (
            <>
              <Drawer onClose={() => handleGroupDrawerClose()} isOpen={isOpenDrawer} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Jobs at this location</DrawerHeader>
                  <DrawerBody>
                    <div class="p-2 space-y-4 flex flex-col bg-white  shadow-sm rounded-xl ">
                      <div className="ml-auto flex flex-col mb-2">
                        <p>Add another job at this location?</p>
                        <a
                          class="mt-1 ml-auto w-3/4 cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() =>
                            handleToggleAddJobSameLocation(group)
                      
                          }
                        >
                          <svg
                            class="hidden sm:block flex-shrink-0 size-3"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
                            />
                          </svg>
                          Create Job Listing
                        </a>
                       
                      </div>

                      <div>
                        <div
                          id="hs-pro-tabs-dut-all"
                          role="tabpanel"
                          aria-labelledby="hs-pro-tabs-dut-item-all"
                        >
                          <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                            <div class="min-w-full inline-block align-middle">
                              <table class="min-w-full divide-y divide-gray-200 ">
                                <thead>
                                  <tr class="border-t border-gray-200 divide-x divide-gray-200 ">
                                    <th scope="col" class="min-w-[250px]">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutnms"
                                          type="button"
                                          class=" font-bold text-md px-4 py-2.5 text-start w-full flex items-center gap-x-1  text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Post Title
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-24">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-default">
                                        <button
                                          id="hs-pro-dutads"
                                          type="button"
                                          class="px-3 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Applicants
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-36">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutsgs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Status
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutems"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100"
                                        >
                                        Posted
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutphs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Actions
                                        </button>
                                      </div>
                                    </th>

                                    {/* <th scope="col"></th> */}
                                  </tr>
                                </thead>

                                {locationJobs.map((job) => (
                                  <tbody class="divide-y divide-gray-200 ">
                                    <tr class="divide-x divide-gray-200 ">
                                      <td
                                        class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer"
                                          onClick={() => handleStoreAndNavigatePosted(job)}
                                      >  
                                        <div class="w-full flex items-center gap-x-3">
                                          <div class="grow" >
                                            <span class="text-sm font-medium text-gray-800 ">
                                              {job.jobTitle}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                        {job.totalApplicants ? (
                                          <span class="text-sm text-gray-600 ">
                                            {job.totalApplicants}
                                          </span>
                                        ) : (
                                          <span class="text-sm text-gray-600 ">
                                            0
                                          </span>
                                        )}
                                      </td>
                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                      <div class="flex items-center">
                                        
                              
                              <input
                                type="checkbox"
                                id="hs-basic-with-description"
                                class="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 

  before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                                checked={job.isActive}
                                onClick={() => changeJobActivityStatus(job)}
                              />

{job.isActive ? ( <label
                                for="hs-basic-with-description" 
                                class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
                              >
                                Active
                              </label>) : (null)}
                             
                            </div>
                            </td>
                                      {/* {job.isActive ? (<td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="py-2 ps-2 pe-3 inline-flex items-center gap-x-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                          <svg
                                            class="flex-shrink-0 size-4 mt-1"
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
                                          Active
                                        </span>
                                      </td>) : (<td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="py-2 ps-2 pe-3 inline-flex items-center gap-x-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                                          <svg
                                            class="flex-shrink-0 size-4 mt-1"
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
                                          Inactive
                                        </span>
                                      </td>)} */}
                       
                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="text-sm text-gray-600 ">
                                          {job.datePosted}
                                        </span>
                                      </td>
                                      <td class="size-px py-2 px-3 space-x-2">
                                        <div className=" flex  w-full ">
                                          {job.hasNewApplicant ||
                                          job.hasUnreadMessage ? (
                                            <button
                                              onClick={() =>
                                                handleStoreAndNavigatePosted(
                                                  job
                                                )
                                              }
                                              className="py-2 px-3 w-full   relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 "
                                            >
                                              View
                                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                                {job.totalApplicants}
                                              </span>
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() =>
                                                handleStoreAndNavigatePosted(
                                                  job
                                                )
                                              }
                                              className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                            >
                                              View
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                ))}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              {/* {showAddJobBusiness ? <AddJobBusiness /> : null} */}

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
                            onClick={() => handleCopiedURL(businessPostedJobs)}
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

      {newTrees.map((businessPostedJobs) => (
        <>
          <SingleMarker
            key={businessPostedJobs.key}
            tree={businessPostedJobs}
            onClick={() => handlePostedByBusinessToggleOpen(businessPostedJobs)}
            setMarkerRef={setMarkerRef}
          />

          {openInfoWindowMarkerID.lat === businessPostedJobs.locationLat ? (
            <>
              <Drawer onClose={onCloseDrawerSingle} isOpen={isOpenDrawerSingle} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Jobs at this location</DrawerHeader>
                  <DrawerBody>
                    <div class="p-2 space-y-4 flex flex-col bg-white  shadow-sm rounded-xl ">
                      <div className="ml-auto flex flex-col mb-2">
                        <p>Add another job at this location?</p>
                        <a
                          class="mt-1 ml-auto w-3/4 cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() =>
                            handleToggleAddJobSameLocation(businessPostedJobs)
                          }
                        >
                          <svg
                            class="hidden sm:block flex-shrink-0 size-3"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
                            />
                          </svg>
                          Create Job Listing
                        </a>
                      </div>

                      <div>
                        <div
                          id="hs-pro-tabs-dut-all"
                          role="tabpanel"
                          aria-labelledby="hs-pro-tabs-dut-item-all"
                        >
                          <div class="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                            <div class="min-w-full inline-block align-middle">
                              <table class="min-w-full divide-y divide-gray-200 ">
                                <thead>
                                  <tr class="border-t border-gray-200 divide-x divide-gray-200 ">
                                    <th scope="col" class="min-w-[250px]">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutnms"
                                          type="button"
                                          class=" font-bold text-md px-4 py-2.5 text-start w-full flex items-center gap-x-1  text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Post Title
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-24">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-default">
                                        <button
                                          id="hs-pro-dutads"
                                          type="button"
                                          class="px-3 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Applicants
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col" class="min-w-36">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutsgs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Status
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutems"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100"
                                        >
                                          Date Posted
                                        </button>
                                      </div>
                                    </th>

                                    <th scope="col">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutphs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100 "
                                        >
                                          Actions
                                        </button>
                                      </div>
                                    </th>

                                    {/* <th scope="col"></th> */}
                                  </tr>
                                </thead>

                                {locationJobs.map((job) => (
                                  <tbody class="divide-y divide-gray-200 ">
                                    <tr class="divide-x divide-gray-200 ">
                                      <td
                                        class="size-px whitespace-nowrap px-4 py-1 relative group cursor-pointer"
                                          onClick={() => handleStoreAndNavigatePosted(job)}
                                      >
                                        <div class="w-full flex items-center gap-x-3">
                                          <div class="grow">
                                            <span class="text-sm font-medium text-gray-800 ">
                                              {job.jobTitle}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                        {job.totalApplicants ? (
                                          <span class="text-sm text-gray-600 ">
                                            {job.totalApplicants}
                                          </span>
                                        ) : (
                                          <span class="text-sm text-gray-600 ">
                                            0
                                          </span>
                                        )}
                                      </td>
                                      {job.isActive ? (<td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="py-2 ps-2 pe-3 inline-flex items-center gap-x-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                          <svg
                                            class="flex-shrink-0 size-4 mt-1"
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
                                          Active
                                        </span>
                                      </td>) : (<td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="py-2 ps-2 pe-3 inline-flex items-center gap-x-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                                          <svg
                                            class="flex-shrink-0 size-4 mt-1"
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
                                          Inactive
                                        </span>
                                      </td>)}
                       
                                      
                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                        <span class="text-sm text-gray-600 ">
                                          {job.datePosted}
                                        </span>
                                      </td>
                                      <td class="size-px py-2 px-3 space-x-2">
                                        <div className=" flex  w-full ">
                                          {job.hasNewApplicant ||
                                          job.hasUnreadMessage ? (
                                            <button
                                              onClick={() =>
                                                handleStoreAndNavigatePosted(
                                                  job
                                                )
                                              }
                                              className="py-2 px-3 w-full   relative inline-flex justify-center items-center text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 "
                                            >
                                              View
                                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                                {job.totalApplicants}
                                              </span>
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() =>
                                                handleStoreAndNavigatePosted(
                                                  job
                                                )
                                              }
                                              className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                            >
                                              View
                                            </button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                ))}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              <AddJobBusiness heldSelected={heldSelected} modalOpen={showAddJobBusiness} toggle={toggleModal}/>

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
                            onClick={() => handleCopiedURL(businessPostedJobs)}
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
       <AddJobBusiness heldSelected={heldSelected} modalOpen={showAddJobBusiness} toggle={toggleModal}/>


      <Modal isOpen={isOpenActivity} onClose={onCloseActivity}>
                  <ModalOverlay />
                  <ModalContent>
                    <div class="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto ">
                      <div class="flex justify-between items-center py-3 px-4  ">
                        <h3
                          id="hs-scale-animation-modal-label"
                          class="font-bold text-gray-800 "
                        >
                          Change Job Status
                        </h3>
                        <button
                          onClick={() => onCloseActivity()}
                          type="button"
                          class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                          aria-label="Close"
                          data-hs-overlay="#hs-scale-animation-modal"
                        >
                          <span class="sr-only">Close</span>
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
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="p-4 overflow-y-auto">
                        <p class="mt-1 text-gray-800 ">
                          Are you sure you want to change the active status of
                          this job post?
                        </p>
                      </div>
                      <div class="flex justify-end items-center gap-x-2 py-3 px-4 ">
                        <button
                          onClick={() => onCloseActivity()}
                          type="button"
                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
                          data-hs-overlay="#hs-scale-animation-modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={() => changeJobActivityStatus()}
                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Change status
                        </button>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>
    </>
  );
};
