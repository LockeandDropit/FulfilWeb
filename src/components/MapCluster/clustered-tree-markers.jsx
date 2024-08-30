import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { Tree } from "./trees";
import { TreeMarker } from "./tree-marker";
import { auth, db } from "../../firebaseConfig.js";

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
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
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
import JobFilter from "../../pages/Doer/components/JobFilter.jsx";
import { useSearchResults } from "../../pages/Doer/Chat/lib/searchResults";
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

import Plausible from "plausible-tracker";
import IframeResizer from "@iframe-resizer/react"
// import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";

/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredTreeMarkers = ({ trees, sameLocationJobs }) => {
  //this is where credited code starts
  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  const [markers, setMarkers] = useState({});
  const [selectedTreeKey, setSelectedTreeKey] = useState(null);
  const [jobsViewed, setJobsViewed] = useState(0);

  const selectedTree = useMemo(
    () =>
      trees && selectedTreeKey
        ? trees.find((t) => t.jobID === selectedTreeKey)
        : null,
    [trees, selectedTreeKey]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map });
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

  const handlePostedByBusinessToggleOpen = (x) => {
    setJobsViewed(jobsViewed + 1);
    setOpenInfoWindowMarkerID(x);
    // updateJobListingViews(x);
    onOpenDrawerSingle();
    console.log("from on click", x);
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
                ? "/DoerAddProfileInfo"
                : results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer
                ? "/DoerMapView"
                : "/NeederMapView"
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

  const handleSendEmail = async (x) => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendNewApplicantEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: x.employerEmail }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
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
                  ? "/DoerMapView"
                  : "/NeederMapView"
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

  const addEmailToFirebase = () => {
    setDoc(doc(db, "Landing Page Email Collection", subscriberEmail), {
      email: subscriberEmail,
    })
      .then(() => {
        //user info submitted to Job applicant file
        // navigation.navigate("BottomUserTab");
      })
      .catch((error) => {
        //uh oh
      });
  }

  const handleNewEmailSignUp = async () => {
    // insert email regex, if then

  //  addEmailToFirebase()

    console.log("subscriberEmail", subscriberEmail);

    // const response = await fetch(
    //   "https://emailapi-qi7k.onrender.com/newEmailSignUp",

    //   {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email: subscriberEmail }),
    //   }
    // );

    // const { data, error } = await response.json();
    // console.log("Any issues?", error);

    onCloseEmailSignUp();
    onOpenEmailSignUpSuccess();
  };

  const applyAndNavigate = (x) => {
    //If anything is going wring in the application or saved job flow it's because I changed this on 5/27/24 at 2:30. Revert to previous if any issues

    updateDoc(doc(db, "employers", x.employerID, "Posted Jobs", x.jobTitle), {
      hasNewApplicant: true,
    })
      .then(() => {
        //user info submitted to Job applicant file
      })
      .catch((error) => {
        //uh oh
      });

    setDoc(
      doc(
        db,
        "employers",
        x.employerID,
        "Posted Jobs",
        x.jobTitle,
        "Applicants",
        user.uid
      ),
      {
        applicantID: user.uid,
        isNewApplicant: true,
      }
    )
      .then(() => {
        //user info submitted to Job applicant file
        // navigation.navigate("BottomUserTab");
      })
      .catch((error) => {
        //uh oh
      });

    const docRef = doc(
      db,
      "employers",
      x.employerID,
      "Posted Jobs",
      x.jobTitle
    );

    updateDoc(docRef, { totalApplicants: increment(1) });

    setDoc(doc(db, "users", user.uid, "Applied", x.jobTitle), {
      requirements: x.requirements ? x.requirements : null,
      requirements2: x.requirements2 ? x.requirements2 : null,
      requirements3: x.requirements3 ? x.requirements3 : null,
      isFlatRate: x.isFlatRate ? x.isFlatRate : null,
      niceToHave: x.niceToHave ? x.niceToHave : null,
      datePosted: x.datePosted ? x.datePosted : null,

      jobID: x.jobID,
      jobTitle: x.jobTitle ? x.jobTitle : null,
      hourlyRate: x.hourlyRate ? x.hourlyRate : null,
      streetAddress: x.streetAddress ? x.streetAddress : null,
      city: x.city ? x.city : null,
      state: x.state ? x.state : null,
      zipCode: x.zipCode ? x.zipCode : null,
      description: x.description ? x.description : null,
      addressNumber: x.addressNumber ? x.addressNumber : null,
      addressName: x.addressName ? x.addressName : null,
      lowerRate: x.lowerRate ? x.lowerRate : null,
      upperRate: x.upperRate ? x.upperRate : null,
      addressSuffix: x.addressSuffix ? x.addressSuffix : null,
      locationLat: x.locationLat ? x.locationLat : null,
      locationLng: x.locationLng ? x.locationLng : null,
      businessName: x.businessName ? x.businessName : null,
      employerID: x.employerID ? x.employerID : null,
      employerFirstName: x.employerFirstName ? x.employerFirstName : null,
      flatRate: x.flatRate ? x.flatRate : null,
      isHourly: x.isHourly ? x.isHourly : null,
      category: x.category ? x.category : null,
      isOneTime: x.isOneTime ? x.isOneTime : null,
      lowerCaseJobTitle: x.lowerCaseJobTitle ? x.lowerCaseJobTitle : null,
    })
      .then(() => {
        onOpen();
      })
      .catch((error) => {
        //uh oh
      });

    handleSendEmail(x);
    console.log(x.employerEmail);
  };

  const [newTrees, setNewTrees] = useState([]);

  // useEffect(() => {
  //   if (trees) {
  //       setNewTrees(trees)
  //   }
  // }, [trees])

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
        // console.log("new treess", newTrees);
      });
    });
    //with each one check it against all other listed positions in singlePostedJobs.
    //If it does exist, remove it from the array
  };

  const [groupJobs, setGroupJobs] = useState([]);

  useEffect(() => {
    if (trees && sameLocationJobs && !searchResults) {
      filterOutSameLocation();
      console.log("1");
      setGroupJobs(sameLocationJobs);
    } else if (trees && sameLocationJobs && searchResults) {
      setNewTrees(trees);
      setGroupJobs([]);
      console.log("2");
    } else if (trees && !sameLocationJobs) {
      setNewTrees(trees);
      setGroupJobs([]);
    }
  }, [sameLocationJobs, trees]);

  const handleGroupLocationToggleOpen = (x) => {
    console.log("group open toggle", x.jobID);
    setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
    //  setOpenInfoWindowMarkerID(x.jobID);
    // updateJobListingViews(x);
    onOpenDrawer();
    console.log("same locationJobs", sameLocationJobs);
  };

  const handleGroupDrawerClose = () => {
    // addJobInfo(null)

    setTimeout(() => {
      onCloseDrawer();
    }, 100);
  };

  const [locationJobs, setLocationJobs] = useState([]);

  useEffect(() => {
    if (openInfoWindowMarkerID) {
      try {
        const q = query(collection(db, "Map Jobs"));

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

  const [openInfoWindowMarkerIDSingle, setOpenInfoWindowMarkerIDSingle] =
    useState({
      lat: 1,
      lng: 1,
    });

  const {
    isOpen: isOpenDrawerSingle,
    onOpen: onOpenDrawerSingle,
    onClose: onCloseDrawerSingle,
  } = useDisclosure();

  const [selectedJobFromGroup, setSelectedJobFromGroup] = useState(null);

  const {
    isOpen: isOpenDrawerSingleFromGroup,
    onOpen: onOpenDrawerSingleFromGroup,
    onClose: onCloseDrawerSingleFromGroup,
  } = useDisclosure();

  const handleOpenSeperately = () => {
    onOpenDrawerSingleFromGroup();
  };

  const handleCloseOfSingleFromGroup = (x) => {
    onCloseDrawerSingleFromGroup();
    handleGroupLocationToggleOpen(x);
  };

  const handleOpenSingleJobFromGroup = (x) => {
    setJobsViewed(jobsViewed + 1);
    setOpenInfoWindowMarkerIDSingle(x.jobID);
    // updateJobListingViews(x);
    setSelectedJobFromGroup(x);
    onCloseDrawer();
    console.log("opened single from group");

    handleOpenSeperately();
  };

  //bettter useEffect than I write https://www.youtube.com/watch?v=QQYeipc_cik&t=788s
  useEffect(() => {
    if (jobsViewed === 3) {
      onOpenEmailSignUp();
    }
  }, [jobsViewed]);

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
              <Drawer
                onClose={() => handleGroupDrawerClose()}
                isOpen={isOpenDrawer}
                size={"xl"}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Jobs at this location</DrawerHeader>
                  <DrawerBody>
                    <div class="p-2 space-y-4 flex flex-col bg-white  shadow-sm rounded-xl ">
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
                                          Job
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
                                          Pay
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
                                          Type
                                        </button>
                                      </div>
                                    </th>

                                    {/* <th scope="col">
                                    <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                      <button
                                        id="hs-pro-dutems"
                                        type="button"
                                        class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-gray-800 focus:outline-none focus:bg-gray-100"
                                      >
                                        Date Posted
                                      </button>
                                    </div>
                                  </th> */}

                                    <th scope="col">
                                      <div class="hs-dropdown relative inline-flex w-full cursor-pointer">
                                        <button
                                          id="hs-pro-dutphs"
                                          type="button"
                                          class="px-5 py-2.5 text-start w-full flex items-center gap-x-1 font-bold text-md text-white focus:outline-none focus:bg-gray-100 "
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
                                        onClick={() =>
                                          handleOpenSingleJobFromGroup(job)
                                        }
                                      >
                                        <div class="w-full flex items-center gap-x-3">
                                          <div class="grow">
                                            <span class="text-md font-medium text-gray-800 ">
                                              {job.jobTitle}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      <td class="size-px whitespace-nowrap px-4 py-1">
                                        {job.isVolunteer ? (
                                          <p>Volunteer!</p>
                                        ) : job.isSalaried ? (
                                          <p class="font-semibold">
                                            ${job.shortenedSalary} - $
                                            {job.shortenedUpperSalary}/year
                                          </p>
                                        ) : job.upperRate > job.lowerRate ? (
                                          <p class="font-semibold">
                                            ${job.lowerRate}/hr +
                                          </p>
                                        ) : (
                                          <p class="font-semibold">
                                            ${job.lowerRate}/hr
                                          </p>
                                        )}
                                      </td>
                                      {job.isFullTimePosition ? (
                                        <td class="size-px whitespace-nowrap px-4 py-1">
                                          <p class=" text-color-gray-700">
                                            Full-time
                                          </p>
                                        </td>
                                      ) : (
                                        <td class="size-px whitespace-nowrap px-4 py-1">
                                          <p class=" text-color-gray-700">
                                            Part-time
                                          </p>
                                        </td>
                                      )}

                                      {/* <td class="size-px whitespace-nowrap px-4 py-1">
                                      <span class="text-sm text-gray-600 ">
                                        {job.datePosted}
                                      </span>
                                    </td> */}
                                      <td class="size-px py-2 px-3 space-x-2">
                                        <div className=" flex  w-full ">
                                          <button
                                            onClick={() =>
                                              handleOpenSingleJobFromGroup(job)
                                            }
                                            className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                          >
                                            See More
                                          </button>
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

      {selectedJobFromGroup?.jobID === openInfoWindowMarkerIDSingle ? (
        <>
          <Drawer
            onClose={() => handleCloseOfSingleFromGroup(selectedJobFromGroup)}
            isOpen={isOpenDrawerSingleFromGroup}
            size={"xl"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{selectedJobFromGroup.jobTitle}</DrawerHeader>
              <DrawerBody>
                <div class="">
                  <Helmet>
                    <meta charSet="utf-8" />
                    <title>{selectedJobFromGroup.jobTitle}</title>
                    <meta
                      name="description"
                      content={selectedJobFromGroup.description}
                    />
                    {/* <link rel="canonical" href=`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}` /> */}
                  </Helmet>
                  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                      <div class="p-4">
                        <div class=" ">
                          <div className="flex">
                            <label
                              for="hs-pro-dactmt"
                              class="block mb-2 text-xl font-medium text-gray-900"
                            >
                              {selectedJobFromGroup.jobTitle}
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
                          {selectedJobFromGroup.isFullTimePosition === true ? (
                            <label
                              for="hs-pro-dactmt"
                              class="block  text-lg font-medium text-gray-800"
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

                          {selectedJobFromGroup.isHourly ? (
                            <div class="space-y-1 ">
                              <div class="flex align-items-center">
                                <p className=" text-md font-medium">$</p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block text-md font-medium text-gray-800 "
                                >
                                  {selectedJobFromGroup.lowerRate}
                                </label>
                                <p className=" text-md font-medium">
                                  /hour - $
                                </p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {selectedJobFromGroup.upperRate}
                                </label>
                                <p className=" text-md font-medium">/hour</p>
                              </div>
                            </div>
                          ) : null}

                          {selectedJobFromGroup.isSalaried ? (
                            <div class="space-y-2 ">
                              <div class="flex align-items-center">
                                <p className=" text-md font-medium">$</p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {selectedJobFromGroup.lowerRate}
                                </label>
                                <p className="ml-1 text-md font-medium ">
                                  yearly - $
                                </p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {selectedJobFromGroup.upperRate}
                                </label>
                                <p className=" ml-1 c font-medium">yearly</p>
                                {selectedJobFromGroup.isEstimatedPay ? (
                                  <p>*</p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          {selectedJobFromGroup.isEstimatedPay ? (
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
                            {selectedJobFromGroup.streetAddress},{" "}
                            {selectedJobFromGroup.city},{" "}
                            {selectedJobFromGroup.state}
                          </p>
                          {selectedJobFromGroup.isEstimatedAddress ? (
                            <p class="block italic text-sm  text-gray-800 ">
                              Address may not be exact
                            </p>
                          ) : null}
                          <p class="font-semibold text-md text-gray-500  cursor-default">
                            <span className="font-semibold text-md text-slate-700">
                              {" "}
                              Posted:
                            </span>{" "}
                            {selectedJobFromGroup.datePosted}
                          </p>
                          <p class="font-semibold text-md text-slate-700 cursor-pointer">
                            Employer:
                          </p>
                          <div className="flex">
                            {selectedJobFromGroup.employerProfilePicture ? (
                              <>
                                <div class="flex flex-col justify-center items-center size-[56px]  ">
                                  <img
                                    src={
                                      selectedJobFromGroup.employerProfilePicture
                                    }
                                    class="flex-shrink-0 size-[64px] rounded-full"
                                  />

                                  <div className="flex flex-col ml-4">
                                    <p class="font-semibold text-md text-gray-500  mt-2 cursor-pointer">
                                      {selectedJobFromGroup.businessName}
                                    </p>
                                    <p class="font-semibold text-md text-gray-500 cursor-default ">
                                      {selectedJobFromGroup.city}, Minnesota
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            <div className="flex flex-col">
                              <p class="font-semibold text-md text-gray-500  mt-1 cursor-pointer">
                                {selectedJobFromGroup.companyName}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="space-y-2 mt-10 mb-4 ">
                          <label
                            for="dactmi"
                            class="block mb-2 text-lg font-medium text-gray-900 "
                          >
                            What you'll be doing
                          </label>
                          <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                            <Markdown>
                              {selectedJobFromGroup.description}
                            </Markdown>
                          </div>
                        </div>
                        {selectedJobFromGroup.bio ? (
                          <div class="space-y-2 mt-10 mb-4">
                            <label
                              for="dactmi"
                              class="block mb-2 text-md font-medium text-gray-800 "
                            >
                              About {selectedJobFromGroup.companyName}
                            </label>

                            <div class="mb-4">
                              <p>{selectedJobFromGroup.bio}</p>
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
                              {selectedJobFromGroup.applicantDescription}
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
                            {selectedJobFromGroup.benefitsDescription ? (
                              <Markdown>
                                {selectedJobFromGroup.benefitsDescription}
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
                            {selectedJobFromGroup.jobTitle.includes(
                              "Plumber"
                            ) ? (
                              <button
                                type="button"
                                class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                data-hs-overlay="#hs-pro-datm"
                                onClick={() => onOpenPlumber()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="size-4 ml-1"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                  />
                                </svg>
                                See career path
                              </button>
                            ) : null}
                            {selectedJobFromGroup.jobTitle.includes(
                              "Server" || "server"
                            ) ? (
                              <button
                                type="button"
                                class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                data-hs-overlay="#hs-pro-datm"
                                onClick={() => onOpenServer()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="size-4 ml-1"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                  />
                                </svg>
                                See career path
                              </button>
                            ) : null}
                            {selectedJobFromGroup.jobTitle.includes(
                              "Machinist" || "CNC"
                            ) ? (
                              <button
                                type="button"
                                class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                data-hs-overlay="#hs-pro-datm"
                                onClick={() => onOpenCNC()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="size-4 ml-1"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                  />
                                </svg>
                                See career path
                              </button>
                            ) : null}
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
                                {selectedJobFromGroup.jobTitle.includes(
                                  "Plumber"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200 bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenPlumber()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
                                {selectedJobFromGroup.jobTitle.includes(
                                  "Server" || "server"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenServer()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
                                {selectedJobFromGroup.jobTitle.includes(
                                  "Machinist" || "CNC"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenCNC()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
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
              <DrawerFooter>
                <button
                  type="button"
                  class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
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
                  class="py-3 px-8 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                  data-hs-overlay="#hs-pro-datm"
                  onClick={() => onOpen()}
                >
                  Apply
                </button>
              </DrawerFooter>
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
                      url={`https://getfulfil.com/DoerMapLoggedOut/?session_id=${selectedJobFromGroup.jobID}`}
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
                        onClick={() => handleCopiedURL(selectedJobFromGroup)}
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

      {newTrees.map((businessPostedJobs) => (
        <>
          <TreeMarker
            key={businessPostedJobs.key}
            tree={businessPostedJobs}
            onClick={() => handlePostedByBusinessToggleOpen(businessPostedJobs)}
            setMarkerRef={setMarkerRef}
          />

          {openInfoWindowMarkerID.locationLat ===
          businessPostedJobs.locationLat ? (
            <>
              <Drawer
                onClose={onCloseDrawerSingle}
                isOpen={isOpenDrawerSingle}
                size={"xl"}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>{businessPostedJobs.jobTitle}</DrawerHeader>
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
                      <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                        <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                          <div class="p-4">
                            <div class=" ">
                              <div className="flex">
                                <label
                                  for="hs-pro-dactmt"
                                  class="block mb-2 text-xl font-medium text-gray-900"
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
                                  <div class="flex flex-col justify-center items-center size-[64px]  ">
                                    <img
                                      src={
                                        businessPostedJobs.employerProfilePicture
                                      }
                                      class="flex-shrink-0 size-[64px] rounded-full"
                                      alt="company logo"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <p class="font-semibold text-xl text-gray-800 cursor-pointer">
                                      {businessPostedJobs.companyName}
                                    </p>
                                  </div>
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
                                  class="block  text-lg font-medium text-gray-800"
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
                                  {businessPostedJobs.applicantDescription}
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
                                    {businessPostedJobs.benefitsDescription}
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
                                {businessPostedJobs.jobTitle.includes(
                                  "Plumber"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenPlumber()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
                                {businessPostedJobs.jobTitle.includes(
                                  "Server" || "server"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenServer()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
                                {businessPostedJobs.jobTitle.includes(
                                  "Machinist" || "CNC"
                                ) ? (
                                  <button
                                    type="button"
                                    class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                    data-hs-overlay="#hs-pro-datm"
                                    onClick={() => onOpenCNC()}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="size-4 ml-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                      />
                                    </svg>
                                    See career path
                                  </button>
                                ) : null}
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
                                    {businessPostedJobs.jobTitle.includes(
                                      "Plumber"
                                    ) ? (
                                      <button
                                        type="button"
                                        class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200 bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        data-hs-overlay="#hs-pro-datm"
                                        onClick={() => onOpenPlumber()}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke-width="1.5"
                                          stroke="currentColor"
                                          class="size-4 ml-1"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                          />
                                        </svg>
                                        See career path
                                      </button>
                                    ) : null}
                                    {businessPostedJobs.jobTitle.includes(
                                      "Server" || "server"
                                    ) ? (
                                      <button
                                        type="button"
                                        class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                        data-hs-overlay="#hs-pro-datm"
                                        onClick={() => onOpenServer()}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke-width="1.5"
                                          stroke="currentColor"
                                          class="size-4 ml-1"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                          />
                                        </svg>
                                        See career path
                                      </button>
                                    ) : null}
                                    {businessPostedJobs.jobTitle.includes(
                                      "Machinist" || "CNC"
                                    ) ? (
                                      <button
                                        type="button"
                                        class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start border border-gray-200  bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300"
                                        data-hs-overlay="#hs-pro-datm"
                                        onClick={() => onOpenCNC()}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke-width="1.5"
                                          stroke="currentColor"
                                          class="size-4 ml-1"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                          />
                                        </svg>
                                        See career path
                                      </button>
                                    ) : null}
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
                      <Drawer
                        isOpen={isOpenCNC}
                        onClose={onCloseCNC}
                        size={isDesktop ? "lg" : "full"}
                      >
                        <DrawerOverlay />
                        <DrawerContent>
                          <DrawerCloseButton />
                          <DrawerHeader>CNC Machinist career path</DrawerHeader>
                          <DrawerBody>
                            <div class="rounded-xl sm:max-w-lg sm:w-full m-3  max-h-full ">
                              <div class="bg-white  rounded-xl shadow-sm pointer-events-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                                <div class="p-1 sm:p-2">
                                  <div class="text-start">
                                    <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800"></h2>
                                    <div class=" mx-auto">
                                      <p class="mt-2 text-base text-gray-600 ">
                                        <p class="mt-4 text-base text-black ">
                                          {" "}
                                          Entry level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Long-term operator . Average salary:
                                            $51,703
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (2)
                                            </span>
                                          </li>
                                          Most entry-level CNC machinists start
                                          as machine operators, gaining skills
                                          and experience as they progress.
                                          <span class="mt-4 text-xs text-gray-500 ">
                                            (1)
                                          </span>
                                        </ol>

                                        <p class="mt-4 text-base text-black ">
                                          Mid level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Set-up machinist. Average Salary:
                                            $84,142{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (3)
                                            </span>{" "}
                                          </li>
                                          From a machine operator, many
                                          machinists transition into being put
                                          in charge of setting-up CNC machines.
                                          This includes understanding GD&T
                                          (geometric dimensioning and
                                          tolerancing) and making changes at
                                          the CNC machine’s controller.{" "}
                                          <span class="mt-4 text-xs text-gray-500 ">
                                            (1)
                                          </span>
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            CNC programmer – average salary:
                                            $77,226{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (5)
                                            </span>{" "}
                                          </li>
                                          As a CNC programmer, your job is to
                                          create the code that tells the CNC
                                          systems how to make the part you need.
                                          This includes programming, designing
                                          parts and optimizing performance.
                                          Often, you will also be responsible
                                          for inspection of your parts.{" "}
                                          <span class="mt-4 text-xs text-gray-500 ">
                                            (1)
                                          </span>
                                        </ol>
                                        <p class="mt-4 text-base text-black ">
                                          Senior level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Manager – Average pay: $100k{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (4)
                                            </span>
                                            .
                                          </li>
                                          As you progress, you can eventually
                                          lead and manage others. Managers train
                                          employees in the proper use of
                                          equipment, enforce safety regulations,
                                          assign tasks, and oversee employees'
                                          work. They also interpret blueprints
                                          and develop plans for how to complete
                                          a project. This is as well as
                                          upgrading and maintaining machinery,
                                          ordering parts, and making sure repair
                                          records are kept up to date. (1)
                                        </ol>

                                        <p class="mt-4 text-xs text-gray-500 ">
                                          Sources:
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          1
                                          https://www.trscraftservices.com/blogs/2020-9/what-is-the-career-path-for-a-cnc-machinist
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          2
                                          https://www.indeed.com/career/cnc-operator/salaries
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          3
                                          https://www.indeed.com/career/machinist/salaries/Minneapolis--MN
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          4
                                          https://www.indeed.com/career/cnc-programmer/salaries
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          4
                                          https://www.indeed.com/career/cnc-programmer/salaries
                                        </p>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div class="flex justify-end items-center ">
                                  <button
                                    onClick={() => onCloseCNC()}
                                    class="py-2 w-full px-3 mt-2 mb-3 items-center text-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                    href="#"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </DrawerBody>
                        </DrawerContent>
                      </Drawer>

                      <Drawer
                        isOpen={isOpenServer}
                        onClose={onCloseServer}
                        size={isDesktop ? "lg" : "full"}
                      >
                        <DrawerOverlay />
                        <DrawerContent height="100vh">
                          <DrawerCloseButton />
                          <DrawerBody overflowY="scroll">
                            <div class="rounded-xl sm:max-w-lg sm:w-full m-3 sm:mx-auto ">
                              <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
                                <div class="p-1 sm:p-2">
                                  <div class="text-start">
                                    <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800">
                                      Server career path
                                    </h2>
                                    <div class=" mx-auto">
                                      <p class="mt-2 text-base text-gray-600 ">
                                        <p class="mt-4 text-base text-black ">
                                          {" "}
                                          Entry level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Waiter/Waitress
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (1)
                                            </span>{" "}
                                            : $20,000 and $31,000
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (2)
                                            </span>
                                          </li>
                                          The waiter or waitress is generally
                                          delegated an area within the
                                          restaurant that he or she attends to.
                                          In this area they are responsible for
                                          ensuring that guests are properly
                                          attended to.
                                        </ol>

                                        <p class="mt-4 text-base text-black ">
                                          Mid level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            FoH Supervisor{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (1)
                                            </span>{" "}
                                            : Average salary: $47k-$73k{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (3)
                                            </span>
                                          </li>
                                          Front of house supervisor is generally
                                          responsible for all front of house
                                          staff and operations. They oversee all
                                          the various duties and
                                          responsibilities of other team members
                                          and ensure operations are running
                                          smoothly.
                                        </ol>
                                        <p class="mt-4 text-base text-black ">
                                          Senior level:
                                        </p>

                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            General Manager{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (1)
                                            </span>
                                            . Average Salary: $56,521{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (4)
                                            </span>
                                          </li>
                                          The general manager has more
                                          logistical responsibility and is often
                                          responsible for overseeing the
                                          functioning of both the Front of House
                                          operations and Back of House
                                          operations.
                                        </ol>

                                        <p class="mt-4 text-xs text-gray-500 ">
                                          Sources:
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          1
                                          https://advice.hosco.com/en/the-career-path-of-a-waiter-waitress-an-exciting-journey/
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          2
                                          https://pos.toasttab.com/blog/on-the-line/restaurant-server-salary
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          3
                                          https://www.glassdoor.com/Salaries/front-of-house-supervisor-salary-SRCH_KO0,25.htm
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          4
                                          https://www.zippia.com/salaries/restaurant-general-manager/
                                        </p>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div class="flex justify-end items-center ">
                                  <button
                                    onClick={() => onCloseServer()}
                                    class="py-2 w-full px-3 mt-2 mb-3 items-center text-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                    href="#"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </DrawerBody>
                        </DrawerContent>
                      </Drawer>

                      <Drawer
                        isOpen={isOpenPlumber}
                        onClose={onClosePlumber}
                        size={isDesktop ? "lg" : "full"}
                      >
                        <DrawerOverlay />
                        <DrawerContent>
                          <DrawerCloseButton />
                          <DrawerBody>
                            <div class="">
                              <div class="bg-white  rounded-xl shadow-sm  ">
                                <div class="p-1 sm:p-2">
                                  <div class="text-start">
                                    <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800">
                                      Plumber career path
                                    </h2>
                                    <div class=" mx-auto">
                                      <p class="mt-2 text-base text-gray-600 ">
                                        <p class="mt-4 text-base text-black ">
                                          {" "}
                                          Entry level:
                                        </p>
                                        Entry level plumbers include plumbing
                                        apprentices, employees with no
                                        certifications, and employees fresh out
                                        of school.
                                        <span class="mt-4 text-xs text-gray-500 ">
                                          (1)
                                        </span>
                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Plumbing Apprentice: $43,680
                                          </li>
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Plumber’s Assistant: roughly $56,000
                                            - $74,225
                                          </li>
                                        </ol>
                                        <p class="mt-4 text-base text-black ">
                                          Mid level:
                                        </p>
                                        Mid-Level plumbers typically have 2-3
                                        years of experience and have the
                                        certifications necessary to work
                                        independently.
                                        <span class="mt-4 text-xs text-gray-500 ">
                                          (1)
                                        </span>
                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Residential Service Technician:
                                            $55k-$65k{" "}
                                            <span class="mt-4 text-xs text-gray-500 ">
                                              (3)
                                            </span>
                                          </li>
                                          Residential Service Technician: clean
                                          all types of drains and sewers using
                                          special electromechanical equipment.
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Commercial Service Technician:
                                          </li>
                                          Same as residential, but in commercial
                                          spaces.
                                          <li class="mt-2 text-base text-black ">
                                            {" "}
                                            Commercial Service Technician:
                                          </li>
                                        </ol>
                                        <p class="mt-4 text-base text-black ">
                                          Senior plumbing positions:
                                        </p>
                                        Senior-level plumbers typically have
                                        7-10 years of experience in the plumbing
                                        industry.
                                        <span class="mt-4 text-xs text-gray-500 ">
                                          (1)
                                        </span>
                                        <ol class="ml-7 list-disc">
                                          <li class="mt-2 text-base text-black ">
                                            Residential Contractor
                                          </li>
                                          Installs, maintains, and repairs pipes
                                          and fixtures associated with heating,
                                          cooling, water distribution, and
                                          sanitation systems in residential and
                                          commercial structures. Fixes domestic
                                          appliances, such as dishwashers and
                                          gas cookers. Inspects drainage and
                                          other plumbing systems for compliance
                                          with local and national regulations.{" "}
                                          <span class="mt-4 text-xs text-gray-500 ">
                                            (4)
                                          </span>{" "}
                                          Average pay: $68,763
                                          <li class="mt-2 text-base text-black ">
                                            Commercial Contractor:
                                          </li>
                                          Same as residential, but in commercial
                                          spaces. Average pay: $63,009
                                          <li class="mt-2 text-base text-black ">
                                            Project Manager:
                                          </li>
                                          $80,281
                                        </ol>
                                        <p class="mt-4 text-xs text-gray-500 ">
                                          Sources:
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          1
                                          https://faradaycareers.com/careers/plumber-career-path
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          3
                                          https://www.rotorooter.com/careers/service-tech/
                                        </p>
                                        <p class="text-xs text-gray-500 ">
                                          4
                                          https://www.monster.co.uk/advertise-a-job/resources/job-description-templates/construction/plumber-job-description/
                                        </p>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div class="flex justify-end items-center ">
                                  <button
                                    onClick={() => onClosePlumber()}
                                    class="py-2 w-full px-3 mt-2 mb-3 items-center text-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                    href="#"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </DrawerBody>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </DrawerBody>
                  <DrawerFooter>
                    <button
                      type="button"
                      class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
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
                      class="py-3 px-8 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                      data-hs-overlay="#hs-pro-datm"
                      onClick={() => onOpen()}
                    >
                      Apply
                    </button>
                  </DrawerFooter>
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

      <Modal
        isOpen={isOpenSignIn}
        onClose={onCloseSignIn}
        size={{ base: "full", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <div class="mt-7 bg-white rounded-xl ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
                <p class="mt-2 text-sm text-gray-600">It's fast and free</p>
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
                          label="email"
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
                      value="Sign In"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    ></input>

                    <p class="mt-2 text-sm text-gray-600">
                      Don't have an account yet?
                      <button
                        class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                        onClick={() => navigate("/DoerEmailRegister")}
                      >
                        Sign up here
                      </button>
                    </p>
                    <p class="mt-2 text-sm text-gray-600">
                      Forgot your password?
                      <button
                        class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                        onClick={() => navigate("/ResetPasswordLoggedOut")}
                      >
                        Reset your password
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* <Modal
        isCentered
        isOpen={isOpenEmailSignUp}
        onClose={onCloseEmailSignUp}
        size={"md"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <div class="  mt-0   sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div class=" ">
                <div class="p-4 sm:p-7">
                  <div class="text-center">
                    <h2 class="block text-2xl font-bold text-gray-800 ">
                      Find more opprotunities near you!
                    </h2>
                    <p class="mt-2 text-sm text-gray-600">
                      Enter your email to get updates about new jobs{" "}
                      <a class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 font-medium ">
                        near you.
                      </a>
                    </p>
                  </div>

                  <div class="mt-5">
                    <div class="grid gap-y-4">
                      <div>
                        <label for="email" class="block text-sm mb-2 ">
                          Email address
                        </label>
                        <div class="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            onChange={(e) => setSubscriberEmail(e.target.value)}
                          />
                          <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                            <svg
                              class="size-5 text-red-500"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              aria-hidden="true"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                            </svg>
                          </div>
                        </div>
                        <p
                          class="hidden text-xs text-red-600 mt-2"
                          id="email-error"
                        >
                          Please include a valid email address so we can get
                          back to you
                        </p>
                      </div>

                      <button
                        type="submit"
                        onClick={() => handleNewEmailSignUp()}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 "
                      >
                        Keep me updated!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal> */}

<Modal
        isCentered
        isOpen={isOpenEmailSignUp}
        onClose={onCloseEmailSignUp}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
          <IframeResizer
  // license="xxxx"
src="https://cdn.forms-content-1.sg-form.com/90536fa1-6711-11ef-95dd-8a66f6c330b7"
  style={{ width: '100%',  height: '40vh' }}
  waitForLoad
/>
          {/* <div class="h-60">
          <iframe src="https://cdn.forms-content-1.sg-form.com/90536fa1-6711-11ef-95dd-8a66f6c330b7"/>
            </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenEmailSignUpSuccess}
        onClose={onCloseEmailSignUpSuccess}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <div class="  mt-0   sm:max-w-lg sm:w-full m-3 sm:mx-auto">
              <div class=" ">
                <div class="p-4 sm:p-7">
                  <div class="text-center">
                    <h2 class="block text-2xl font-bold text-gray-800 ">
                      We'll keep you updated!
                    </h2>
                    <p class="mt-2 text-sm text-gray-600">
                      Check your inbox regularly for job opprotunities near you
                    </p>
                  </div>

                  <div class="mt-5">
                    <div class="grid gap-y-4">
                      <button
                        type="submit"
                        onClick={() => onCloseEmailSignUpSuccess()}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 "
                      >
                        Continue browsing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
