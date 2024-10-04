import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

import { SingleMarker } from "./SingleMarker.jsx";
import { auth, db } from "../../../firebaseConfig.js";

import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  collection,
  onSnapshot,
  updateDoc,
  setDoc,
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
import { useUserStore } from "../Chat/lib/userStore.js";
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
  FacebookShareButton,
  FacebookIcon,
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
import SingleMarkerApplied from "./SingleMarkerApplied.jsx";
import ApplicantScreeningQuestions from "../components/ApplicantScreeningQuestions.jsx";

// import LoggedOutHeaderNoGap from "./Landing/LoggedOutHeaderNoGap.jsx";

/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredMarkers = ({ trees, sameLocationJobs, user }) => {
  //this is where credited code starts
  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  const [markers, setMarkers] = useState({});
  const [selectedTreeKey, setSelectedTreeKey] = useState(null);

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

  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  // const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  const { searchResults, searchIsMobile, setSearchIsMobile } =
    useSearchResults();

  const { currentUser } = useUserStore();

  console.log("current user", currentUser);

  //map help https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
  const [open, setOpen] = useState(false);

  //opening one window at a time help from https://github.com/Developer-Nijat/React-Google-Map-Markers/blob/main/src/App.jsx & https://www.youtube.com/watch?v=Uq-0tA0f_X8 & Vadim Gremyachev https://stackoverflow.com/questions/50903246/react-google-maps-multiple-info-windows-opening-up

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState({
    lat: 1,
    lng: 1,
  });

  const [openInfoWindowMarkerIDSingle, setOpenInfoWindowMarkerIDSingle] =
    useState({
      lat: 1,
      lng: 1,
    });

  const handleToggleOpen = (x) => {
    console.log(x);
    setOpenInfoWindowMarkerID(x);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenNoResume,
    onOpen: onOpenNoResume,
    onClose: onCloseNoResume,
  } = useDisclosure();
  const {
    isOpen: isOpenSaved,
    onOpen: onOpenSaved,
    onClose: onCloseSaved,
  } = useDisclosure();
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
    isOpen: isOpenDrawerSingleFromGroup,
    onOpen: onOpenDrawerSingleFromGroup,
    onClose: onCloseDrawerSingleFromGroup,
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

  const [selectedJobFromGroup, setSelectedJobFromGroup] = useState(null);

  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
    // updateJobListingViews(x);

    onCloseDrawer();
    onOpenDrawerSingle();

    console.log("from on click", x);
  };

  const handleOpenSingleJobFromGroup = (x) => {
    setOpenInfoWindowMarkerIDSingle(x.jobID);
    // updateJobListingViews(x);
    setSelectedJobFromGroup(x);
    onCloseDrawer();
    console.log("opened single from group");

    handleOpenSeperately();
  };

  const handleOpenSeperately = () => {
    onOpenDrawerSingleFromGroup();
  };

  const handleCloseOfSingleFromGroup = (x) => {
    onCloseDrawerSingleFromGroup();
    handleGroupLocationToggleOpen(x);
  };

  const handleGroupLocationToggleOpen = (x) => {
    console.log("group open toggle", x.jobID);
    setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
    //  setOpenInfoWindowMarkerID(x.jobID);
    // updateJobListingViews(x);
    onOpenDrawer();
    console.log("same locationJobs", sameLocationJobs);
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

  const [dateApplied, setDateApplied] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=3 mohshbool & Samuel Meddows
    let initialDate = new Date();
    var dd = String(initialDate.getDate()).padStart(2, "0");
    var mm = String(initialDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + "/" + dd + "/" + yyyy;

    setDateApplied(today);
  }, []);

  //apply logic

  const [screeningQuestionsVisible, setScreeningQuestionsVisible] = useState(false)

const checkForScreeningQuestions = (x) => {

  if (x.hasScreeningQuestions === true ) {
    //open screening questions here.. pass componenet
    if (currentUser.resumeUploaded) {
    onCloseDrawerSingle();

    onCloseDrawerSingleFromGroup();

    setScreeningQuestionsVisible(!screeningQuestionsVisible);
    } else {
      onOpenNoResume();
    }
  } else {

    applyAndNavigate(x);

  }
}





  const applyAndNavigate = (x) => {
    //If anything is going wring in the application or saved job flow it's because I changed this on 5/27/24 at 2:30. Revert to previous if any issues

    if (currentUser.resumeUploaded) {
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
          dateApplied: dateApplied,
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
    } else {
      onOpenNoResume();
      // pop modal here
    }
  };

  //save logic
  const saveJob = (x) => {

    
    setDoc(doc(db, "users", user.uid, "Saved Jobs", x.jobID), {
      companyName: x.companyName,
      isPostedByBusiness: true,
      isSalaried: x.isSalaried,
      applicantDescription: x.applicantDescription,
      benefitsDescription: x.benefitsDescription ? x.benefitsDescription : null,
      isFullTimePosition: x.isFullTimePosition,
      employerID: x.employerID,
      // employerEmail: user.email,
      employerFirstName: x.employerFirstName,
      employerLastName: x.employerLastName,
      employerProfilePicture: x.employerProfilePicture,
      jobTitle: x.jobTitle,
      jobID: x.jobID,
      firstName: x.firstName,
      lowerRate: x.lowerRate,
      upperRate: x.upperRate,
      isVolunteer: x.isVolunteer,
      isOneTime: x.isOneTime,
      flatRate: x.flatRate,
      isHourly: x.isHourly,
      lowerCaseJobTitle: x.lowerCaseJobTitle,
      datePosted: x.datePosted,
      category: x.category,
      city: x.city,
      streetAddress: x.streetAddress,
      state: x.state,
      zipCode: x.zipCode,
      locationLat: x.locationLat,
      locationLng: x.locationLng,
      description: x.description,
      requirements: x.requirements,
      requirements2: x.requirements2,
      requirements3: x.requirements3,
      niceToHave: x.niceToHave,
    })
      .then(() => {
        //all good

        // navigation.navigate("BottomUserTab");
        onOpenSaved();
      })
      .catch((error) => {
        // no bueno
      });

    

    //submit data
  };

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

  const handleStoreAndNavigatePosted = (x) => {
    // console.log(x.jobTitle, x.jobID);

    // fetchJobInfo(currentUser.uid, x.jobID, "Posted Jobs", x.jobTitle);
    // if (x.hasNewApplicant === true) {
    //   updateDoc(
    //     doc(db, "employers", currentUser.uid, "Posted Jobs", x.jobTitle),
    //     {
    //       hasNewApplicant: false,
    //     }
    //   )
    //     .then(() => {
    //       //user info submitted to Job applicant file
    //     })
    //     .catch((error) => {
    //       //uh oh
    //       console.log(error);
    //     });
    // }
    setTimeout(() => navigate("/JobDetails"), 500);
  };

  const [newTrees, setNewTrees] = useState([]);

//this is to check which jobs the user has already applied to.

const [appliedJobIds, setAppliedJobIds] = useState([])

useEffect(() => {
  if (currentUser) {
  let jobIds = [];

  const q = query(collection(db, "users", currentUser.uid, "Applied"));

  async function getAppliedJobIds() {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      jobIds.push(doc.data().jobID)
      // console.log("here are all the docs", doc.data());
    });

    setAppliedJobIds(jobIds)
    
  }


  getAppliedJobIds()
}
}, []);




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

  const [groupJobs, setGroupJobs] = useState([]);

  useEffect(() => {
    if (trees && sameLocationJobs) {
      filterOutSameLocation();
      console.log("1");
      setGroupJobs(sameLocationJobs);
    } else if (trees && !sameLocationJobs) {
      setNewTrees(trees);
    }
  }, [sameLocationJobs, trees]);

  //set lat lng of job passed so you can pass it to AddJobBusiness component and also reopen(?) the appropriate drawer when closed.

  const [heldSelected, setHeldSelected] = useState(null);

  const handleToggleAddJobSameLocation = (x) => {
    setHeldSelected(x);

    setShowAddJobBusiness(!showAddJobBusiness);
    onCloseDrawer();
    onCloseDrawerSingle();
  };

  const handleGroupDrawerClose = () => {
    // addJobInfo(null)
    setShowAddJobBusiness(false);
    setTimeout(() => {
      onCloseDrawer();
    }, 100);
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
                          {selectedJobFromGroup.employerProfilePicture ? (
                                <>
                                  <div class="flex flex-row items-center">
                                    <div className="justify-center items-center "> 
                                    <img
                                      src={
                                        selectedJobFromGroup.employerProfilePicture
                                      }
                                      class="flex-shrink-0 size-[48px] rounded-full"
                                      alt="company logo"
                                    />
                                    </div>
                                    
                                    <p class="ml-2 font-semibold text-xl text-gray-800 cursor-pointer">
                                      {selectedJobFromGroup.companyName}
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
                                  onClick={() =>
                                    checkForScreeningQuestions(selectedJobFromGroup)
                                  }
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
                  onClick={() => saveJob(selectedJobFromGroup)}
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
                  onClick={() => checkForScreeningQuestions(selectedJobFromGroup)}
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
        {appliedJobIds.indexOf(businessPostedJobs.jobID) !== -1 ? (<SingleMarkerApplied props={businessPostedJobs}/>) : (
          <>
          <SingleMarker
            key={businessPostedJobs.key}
            tree={businessPostedJobs}
            onClick={() => handlePostedByBusinessToggleOpen(businessPostedJobs)}
            setMarkerRef={setMarkerRef}
          />

          {openInfoWindowMarkerID.lat === businessPostedJobs.locationLat ? (
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
                  class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                  data-hs-overlay="#hs-pro-datm"
                  onClick={() => saveJob(businessPostedJobs)}
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
                                      onClick={() =>
                                        checkForScreeningQuestions(businessPostedJobs)
                                      }
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
                      onClick={() => saveJob(businessPostedJobs)}
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
                    onClick={() => checkForScreeningQuestions(businessPostedJobs)}
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
              {screeningQuestionsVisible ? (<ApplicantScreeningQuestions props={businessPostedJobs} />) : (null)}
            </>
          ) : null}
          
          </>
          
        )}
        </>
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Application submitted.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenSaved} onClose={onCloseSaved}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You've saved this job</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => onCloseSaved()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenNoResume} onClose={onCloseNoResume}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete your profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please upload a resume to your profile before applying for open
              positions
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => navigate("/UserProfile")}
            >
              Upload my resume
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
