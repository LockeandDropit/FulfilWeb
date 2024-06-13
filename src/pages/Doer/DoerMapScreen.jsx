import React from "react";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import DoerHeader from "./DoerHeader";
import { Input, Button, Text, Box } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Image,
  Spinner,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  collectionGroup,
  getDocs,
  query,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import DoerDashboard from "./DoerDashboard";
import { Select } from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";
import NoCategoryMatchModal from "../../components/NoCategoryMatchModal";
import { useChatContext } from "stream-chat-react";
import { useMediaQuery } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import DoerFirstVisitModal from "./components/DoerFirstVisitModal";
import JobFilter from "./components/JobFilter";

import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
const DoerMapScreen = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);
  const navigate = useNavigate();

  const [hasRun, setHasRun] = useState(false);

  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);

  const location = useLocation();

  const [firstVisitModalVisible, setFirstVisitModalVisible] = useState(false);

  useEffect(() => {
    if (location.state === null) {
    } else {
      if (location.state.firstVisit) {
        setFirstVisitModalVisible(true);
      }
    }
  }, [location]);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  //Pulls in Posted Job info from DB.. initial rendering
  useEffect(() => {
    // should this be done on log ina nd stored in redux store so it's cheaper?
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
    // } else {
    //   console.log("oops!");
    // }
  }, []);

  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "Applied"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });

        setAppliedJobs(results);
      });
    }
  }, [user]);

  const [jobsInProgress, setJobsInProgress] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Jobs In Progress"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does

          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          //this was crashing everything??
          // setPostedJobs(0);
        } else {
          setJobsInProgress(results);
        }
      });
    } else {
    }
  }, [user]);

  const [jobsInReview, setJobsInReview] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "In Review"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does

          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          //this was crashing everything??
          // setPostedJobs(0);
        } else {
          setJobsInReview(results);
        }
      });
    } else {
    }
  }, [user]);

  const [allJobs, setAllJobs] = useState([]);

  const [completedJobsMap, setCompletedJobsMap] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Past Jobs Map"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does

          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          //this was crashing everything??
          // setPostedJobs(0);
        } else {
          setCompletedJobsMap(results);
        }
      });
    } else {
    }
  }, [user]);

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
    } else {
      filteredLocations(postedJobs);
    }
  }, [postedJobs]);

  useEffect(() => {
    allJobs.map((allJobs) => {});
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

  const handlePostedToggleOpen = (x) => {
    setOpenInfoWindowMarkerID(x.jobID);
    updateJobListingViews(x);
  };

  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID(x.jobID);
    updateJobListingViews(x);
    onOpenDrawer();
  };

  const handleToggleOpen = (x) => {
    console.log("here", x);
    setOpenInfoWindowMarkerID(x);

    //this (getData(x)) was throwing an error. Idk whatit was even for tbh.
    // getData(x);
  };

  const handleToggleAppliedOpen = (x) => {
    setOpenInfoWindowMarkerID(x);
    console.log(x);
    getData(x);
  };

  useEffect(() => {}, [openInfoWindowMarkerID]);

  useEffect(() => {
    if (appliedJobs.length !== 0 && postedJobs.length !== 0) {
      appliedJobs.forEach((appliedJob) => {
        postedJobs.forEach((postedJob) => {
          if (appliedJob.jobID === postedJob.jobID ) {
            //credit user1438038 & Niet the Dark Absol https://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property

            for (var i = allJobs.length - 1; i >= 0; --i) {
              if (allJobs[i].jobID == postedJob.jobID) {
                allJobs.splice(i, 1);
                console.log("is this one firing")
              }
            }
          } else {
          }
        });
      });

      //if sop, remove it from posted jobs locally
    }

    //add all jobs to this to get stuff removed?
  }, [appliedJobs, postedJobs, allJobs]);

  useEffect(() => {
    if (appliedJobs.length !== 0 && businessPostedJobs.length !== 0) {
      appliedJobs.forEach((appliedJob) => {
        businessPostedJobs.forEach((businessPostedJobs) => {
          if (appliedJob.jobID === businessPostedJobs.jobID ) {
            //credit user1438038 & Niet the Dark Absol https://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property
      
          } else {
          }
        });

        // I do not know why this works, but it does
        // This removes the business post marker if the user has applied to it.
        //this incluses having "all jobs" as a dependency 

        // ty my friend leonheess and Pablo Francisco Perez Hidalgo https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
        const index = businessPostedJobs.map(e => e.jobID).indexOf(businessPostedJobs.jobID)
            
        businessPostedJobs.splice(index, 1);
        
      });
    }


  }, [appliedJobs, businessPostedJobs, allJobs]);

  //passing props credit Cory House & Treycos https://stackoverflow.com/questions/42173786/react-router-pass-data-when-navigating-programmatically

  const [userID, setUserID] = useState();
  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [addressNumber, setAddressNumber] = useState(null);
  const [addressName, setAddressName] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [addressSuffix, setAddressSuffix] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [employerID, setEmployerID] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [flatRate, setFlatRate] = useState(null);
  const [isHourly, setIsHourly] = useState(null);
  const [category, setCategory] = useState(null);
  const [isOneTime, setIsOneTime] = useState(null);
  const [lowerCaseJobTitle, setLowerCaseJobTitle] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null);
  const [confirmHours, setConfirmHours] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setIsOnboarded(snapshot.data().isOnboarded);
      });
    } else {
    }
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const {
    isOpen: isOpenNoResults,
    onOpen: onOpenNoResults,
    onClose: onCloseNoResults,
  } = useDisclosure();
  const {
    isOpen: isOpenNotOnboarded,
    onOpen: onOpenNotOnboarded,
    onClose: onCloseNotOnboarded,
  } = useDisclosure();

  const {
    isOpen: isOpenMarkComplete,
    onOpen: onOpenMarkComplete,
    onClose: onCloseMarkComplete,
  } = useDisclosure();
  const {
    isOpen: isOpenHourly,
    onOpen: onOpenHourly,
    onClose: onCloseHourly,
  } = useDisclosure();
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const {
    isOpen: isOpenSaved,
    onOpen: onOpenSaved,
    onClose: onCloseSaved,
  } = useDisclosure();

  const {
    isOpen: isOpenApplied,
    onOpen: onOpenApplied,
    onClose: onCloseApplied,
  } = useDisclosure();

  const handleNotOboarded = () => {
    onCloseNotOnboarded();
    navigate("/DoerAccountManager");
  };

  //this sends an email to the receiving use notifying them of their new message
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

  //apply logic
  const applyAndNavigate = (x) => {
    //If anything is going wring in the application or saved job flow it's because I changed this on 5/27/24 at 2:30. Revert to previous if any issues

    if (isOnboarded === true) {
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
    } else {
      onOpenNotOnboarded();
    }
  };

  //Save Logic

  //get data

  useEffect(() => {
    if (openInfoWindowMarkerID) {
      const docRef = doc(db, "Map Jobs", openInfoWindowMarkerID);

      getDoc(docRef).then((snapshot) => {
        if (!snapshot.data()) {
          //Keep Comment: this is here so that when the user clicks on any job that is from "Applied, In Progress", etc. the application will not crash. This info is only neccesary to set when applying for a new job
        } else {
          setEmployerID(snapshot.data().employerID);
          setEmployerFirstName(snapshot.data().firstName);
          setJobTitle(snapshot.data().jobTitle);
        }
      });
    } else {
    }
  }, [openInfoWindowMarkerID]);

  const getData = async (openInfoWindowMarkerID) => {
    const docRef = doc(db, "Map Jobs", openInfoWindowMarkerID);

    console.log(openInfoWindowMarkerID);
    await getDoc(docRef).then((snapshot) => {
      console.log(snapshot.data());
      setFlatRate(snapshot.data().flatRate);
      setJobTitle(snapshot.data().jobTitle);
      setLowerRate(snapshot.data().lowerRate);
      setUpperRate(snapshot.data().upperRate);
      setCity(snapshot.data().city);
      setIsOneTime(snapshot.data().isOneTime);
      setLowerCaseJobTitle(snapshot.data().lowerCaseJobTitle);
      setEmployerID(snapshot.data().employerID);
      setEmployerFirstName(snapshot.data().firstName);
      setZipCode(snapshot.data().zipCode);
      setDescription(snapshot.data().description);
      setIsHourly(snapshot.data().isHourly);
      setIsFlatRate(snapshot.data().isFlatRate);
      setLocationLat(snapshot.data().locationLat);
      setLocationLng(snapshot.data().locationLng);
      setCategory(snapshot.data().category);
      setState(snapshot.data().state);
      setBusinessName(snapshot.data().businessName);
      setStreetAddress(snapshot.data().streetAddress);
      setRequirements(snapshot.data().requirements);
      setBusinessName(snapshot.data().businessName);
      setNiceToHave(snapshot.data().niceToHave);
      setRequirements2(snapshot.data().requirements2);
      setRequirements3(snapshot.data().requirements3);
    });
  };

  const handleToggleInProgressOpen = (x) => {
    setOpenInfoWindowMarkerID(x.jobID);
  };
  const handleToggleInReviewOpen = (x) => {
    setOpenInfoWindowMarkerID(x.jobID);
  };

  const getDataInProgress = async (openInfoWindowMarkerID) => {
    const docRef = doc(db, "user", openInfoWindowMarkerID);

    await getDoc(docRef).then((snapshot) => {
      setFlatRate(snapshot.data().flatRate);
      setJobTitle(snapshot.data().jobTitle);
      setLowerRate(snapshot.data().lowerRate);
      setUpperRate(snapshot.data().upperRate);
      setCity(snapshot.data().city);
      setIsOneTime(snapshot.data().isOneTime);
      setLowerCaseJobTitle(snapshot.data().lowerCaseJobTitle);
      setEmployerID(snapshot.data().employerID);
      setEmployerFirstName(snapshot.data().firstName);
      setZipCode(snapshot.data().zipCode);
      setDescription(snapshot.data().description);
      setIsHourly(snapshot.data().isHourly);
      setIsFlatRate(snapshot.data().isFlatRate);
      setLocationLat(snapshot.data().locationLat);
      setLocationLng(snapshot.data().locationLng);
      setCategory(snapshot.data().category);
      setState(snapshot.data().state);
      setBusinessName(snapshot.data().businessName);
      setStreetAddress(snapshot.data().streetAddress);
      setRequirements(snapshot.data().requirements);
      setBusinessName(snapshot.data().businessName);
      setNiceToHave(snapshot.data().niceToHave);
      setRequirements2(snapshot.data().requirements2);
      setRequirements3(snapshot.data().requirements3);
    });
  };

  const saveJob = (x) => {
    setDoc(doc(db, "users", user.uid, "Saved Jobs", x.jobID), {
      requirements: x.requirements ? x.requirements : null,
      requirements2: x.requirements2 ? x.requirements2 : null,
      requirements3: x.requirements3 ? x.requirements3 : null,
      isFlatRate: x.isFlatRate ? x.isFlatRate : null,
      niceToHave: x.niceToHave ? x.niceToHave : null,
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
        //all good

        // navigation.navigate("BottomUserTab");
        onOpenSaved();
      })
      .catch((error) => {
        // no bueno
      });

    //submit data
  };

  //category search

  //update total view count for needer
  const updateJobListingViews = (x) => {
    console.log("this is it", x);
    const docRef = doc(
      db,
      "employers",
      x.employerID,
      "Posted Jobs",
      x.jobTitle
    );

    updateDoc(docRef, { totalViews: increment(1) });
  };

  const [searchJobCategory, setSearchJobCategory] = useState(null);

  useEffect(() => {
    if (searchJobCategory && searchJobCategory !== null) {
      searchCategory(searchJobCategory);
    } else {
    }
  }, [searchJobCategory]);

  const searchCategory = (value) => {
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
          } else {
          }
        });

        if (secondResults.length === 0) {
          onOpenNoResults();
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  //chat channel navigation
  const navigateToChannel = (x) => {
    navigate("/DoerChatHolder", { state: { selectedChannel: x.channelID } });
    // console.log("mesage channel",x);
  };

  //remove newHireNotification
  const handleInProgressNavigate = (x) => {
    if (x.firstHiredNotification === true) {
      updateDoc(doc(db, "users", user.uid, "Jobs In Progress", x.jobTitle), {
        firstHiredNotification: false,
      })
        .then(() => {
          navigateToChannel(x);
        })
        .catch(() => {});
    } else {
      navigateToChannel(x);
    }
  };

  //logic for marking job complete
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [defaultRating, setDefaultRating] = useState(0);

  const handleCompleteModalOpen = (jobsInProgress) => {
    getSelectedData(jobsInProgress);
    onOpenMarkComplete();
  };

  const [jobID, setJobID] = useState(null);
  const [channelID, setChannelID] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);

  const getSelectedData = (jobsInProgress) => {
    setJobTitle(jobsInProgress.jobTitle);
    setEmployerID(jobsInProgress.employerID);
    setJobID(jobsInProgress.jobID);
    setChannelID(jobsInProgress.channelID);
    setConfirmedRate(jobsInProgress.confirmedRate);
    setLowerRate(jobsInProgress.lowerRate);
    setUpperRate(jobsInProgress.upperRate);
    setDescription(jobsInProgress.description);
    setCity(jobsInProgress.city);
    setIsHourly(jobsInProgress.isHourly);
    setLocationLat(jobsInProgress.locationLat);
    setLocationLng(jobsInProgress.locationLng);
    // setEmployerID(snapshot.data().employerID);
    setZipCode(jobsInProgress.zipCode);
    setCategory(jobsInProgress.category);
    setState(jobsInProgress.state);

    setBusinessName(jobsInProgress.businessName);
    setStreetAddress(jobsInProgress.streetAddress);
    setRequirements(jobsInProgress.requirements);
    setNiceToHave(jobsInProgress.niceToHave);
    setRequirements2(jobsInProgress.requirements2);
    setRequirements3(jobsInProgress.requirements3);
    setIsOneTime(jobsInProgress.isOneTime);
  };

  const addRating = () => {
    if (isHourly === true) {
      //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
      onClose();
      onOpenHourly();
    } else {
      //move to under Review.. should this be for both users? Most likely

      setIsLoading(true);

      //submitted if flat rate

      setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        channelID: channelID,
        city: city,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {})
        .catch((error) => {});

      setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        channelID: channelID,
        city: city,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        // locationLat: locationLat,
        // locationLng: locationLng,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {})
        .catch((error) => {});

      deleteDoc(doc(db, "users", user.uid, "Jobs In Progress", jobTitle))
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });

      deleteDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle))
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });

      //submit data

      setDoc(doc(db, "employers", employerID, "Ratings", jobTitle), {
        rating: defaultRating,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });

      setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
        ratingComplete: false,
      })
        .then(() => {})
        .catch((error) => {});

      setTimeout(() => {
        setIsLoading(false);

        onClose();
        onOpenSuccess();
        navigate("/DoerMapScreen");
      }, 2500);
    }
  };

  const addHoursWorkedNavigate = () => {
    //push to respective In Review dbs, user and employer

    setIsLoading(true);

    //set hasbeenRated to false so employer can check if they have been rated yet

    setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
      ratingComplete: false,
    });

    setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
      confirmedRate: confirmedRate,
      confirmHours: confirmHours,
      employerID: employerID,
      isHourly: isHourly,
      jobTitle: jobTitle,
      jobID: jobID,
      description: description,
      city: city,
      lowerRate: lowerRate,
      upperRate: upperRate,
      channelID: channelID,
      isOneTime: isOneTime,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      locationLat: locationLat,
      locationLng: locationLng,
      hiredApplicant: user.uid,
      jobCompleteApplicant: true,
      jobCompleteEmployer: false,
    })
      .then(() => {})
      .catch((error) => {});

    setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
      confirmedRate: confirmedRate,
      confirmHours: confirmHours,
      employerID: employerID,
      jobTitle: jobTitle,
      jobID: jobID,
      isHourly: isHourly,
      description: description,
      city: city,
      channelID: channelID,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isOneTime: isOneTime,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      locationLat: locationLat,
      locationLng: locationLng,
      hiredApplicant: user.uid,
      jobCompleteApplicant: true,
      jobCompleteEmployer: false,
    })
      .then(() => {})
      .catch((error) => {});

    deleteDoc(doc(db, "users", user.uid, "Jobs In Progress", jobTitle))
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    deleteDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle))
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    //submit data
    setDoc(doc(db, "employers", employerID, "Ratings", jobTitle), {
      rating: defaultRating,
    })
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
      ratingComplete: false,
    })
      .then(() => {})
      .catch((error) => {});

    setTimeout(() => {
      setIsLoading(false);

      onCloseHourly();
      onOpenSuccess();
      navigate("/DoerMapScreen");
    }, 2500);
  };

  const addWithNoRating = () => {
    if (isHourly === true) {
      //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
      onClose();
      onOpenHourly();
    } else {
      //move to under Review.. should this be for both users? Most likely

      setIsLoading(true);

      //submitted if flat rate

      setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        city: city,
        channelID: channelID,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {})
        .catch((error) => {});

      setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        channelID: channelID,
        city: city,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,

        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {})
        .catch((error) => {});

      deleteDoc(
        doc(db, "users", user.uid, "Jobs In Progress", postedJobs[0].jobTitle)
      )
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });

      deleteDoc(
        doc(
          db,
          "employers",
          postedJobs[0].employerID,
          "Jobs In Progress",
          postedJobs[0].jobTitle
        )
      )
        .then(() => {
          //all good
        })
        .catch((error) => {});

      setDoc(doc(db, "users", user.uid, "Ratings", postedJobs[0].jobTitle), {
        ratingComplete: false,
      })
        .then(() => {
          setIsLoading(true);
        })
        .catch((error) => {});

      setTimeout(() => {
        setIsLoading(false);

        onClose();
        onOpenSuccess();
        navigate("/DoerMapScreen");
      }, 2500);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,3}$/;

  const [confirmHoursValidationMessage, setConfirmHoursValidationMessage] =
    useState();

  const [confirmHoursValidationBegun, setConfirmHoursValidationBegun] =
    useState(false);

  const confirmHoursValidate = (confirmHours) => {
    setConfirmHoursValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(confirmHours);
    if (!isValid) {
      setConfirmHoursValidationMessage("Please enter valid hours");

      setConfirmHours(confirmHours);
    } else {
      setConfirmHoursValidationMessage();
      setConfirmHours(confirmHours);
    }
  };

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = (jobsInProgress) => {
    const rateValid = minLengthRegEx.test(confirmHours);

    if (
      !rateValid ||
      typeof confirmHours === "undefined" ||
      !confirmHours ||
      confirmHours === "0"
    ) {
      alert("Please enter valid rate");
    } else {
      addHoursWorkedNavigate(jobsInProgress);
    }
  };

  const handleCloseAndOpen = (jobsInProgress) => {
    if (isHourly === true) {
      onCloseMarkComplete();
      onOpenHourly();
    } else {
      onCloseMarkComplete();
      addWithNoRating(jobsInProgress);
    }
  };

  const handleBothModalClose = () => {
    onCloseHourly();
    onCloseMarkComplete();
    onCloseSuccess();
  };

  //handle stripe log in

  const [sessionUrl, setSessionUrl] = useState(null);

  const [stripeID, setStripeID] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setStripeID({ stripeID: snapshot.data().stripeID });
      });
    } else {
    }
  }, [user]);

  const logInStripe = async () => {
    const response = await fetch(
      //this one is the live one
      // "https://fulfil-api.onrender.com/create-checkout-web",

      //this is test
      "https://fulfil-api.onrender.com/stripe-log-in",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stripeID),
      }
    );

    const { loginLink } = await response.json();

    setTimeout(() => {
      if (loginLink) {
        setSessionUrl(loginLink);
        setLoadingPayment(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (sessionUrl !== null) {
      setTimeout(() => {
        // setPaymentsLoading(false)
        // window.location.replace(sessionUrl);
        // help from gun https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
        window.open(sessionUrl, "_blank").then(() => {
          setSessionUrl(null);
        });
      }, 1000);
    } else {
    }
  }, []);

  const [loadingPayment, setLoadingPayment] = useState(false);

  const handleSeePayment = (x) => {
    setLoadingPayment(true);
    if (x.firstViewNotification === true) {
      updateDoc(doc(db, "users", user.uid, "Past Jobs Map", x.jobTitle), {
        firstViewNotification: false,
      }).then(() => {
        logInStripe();
      });
    } else {
      logInStripe();
    }
  };

  const handleRemoveFromMap = (x) => {
    deleteDoc(doc(db, "users", user.uid, "Past Jobs Map", x.jobTitle), {});
  };
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  return (
    <div>
      <Header />
      <Flex marginTop="4">
        <Dashboard />
        {process.env.REACT_APP_GOOGLE_API_KEY ? (
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <Box
              h={{ base: "100vh", lg: "94vh" }}
              w={{ base: "100vw", lg: "100vw" }}
              mt={10}
            >
              <Map
                // center={{ lat: selectedLat ? selectedLat : defaultLat, lng: selectedLng ? selectedLng : defaultLong }}
                defaultCenter={{
                  lat: selectedLat ? selectedLat : defaultLat,
                  lng: selectedLng ? selectedLng : defaultLong,
                }}
                defaultZoom={isDesktop ? 12 : 11}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                //move to env
                mapId="6cc03a62d60ca935"
                onClick={() => setOpenInfoWindowMarkerID(null)}
              >
                {/* <div className="items-center justify-center z-30">
                <JobFilter />
                </div> */}
                <Center  ml={24}>
                  
                  <Card
                    align="center"
                
                    width={{ base: "full", md: "auto" }}
                    
                 
                    mr={{ base: "80px", md: "0" }}
                    ml={{ base: "0px", md: "80px" }}
                  >
                      <JobFilter />
                    
                  </Card>
                </Center>

                {allJobs !== null &&
                  allJobs.map((allJobs) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
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
                        onClick={() => handlePostedToggleOpen(allJobs)}
                      >
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {allJobs.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : allJobs.isFlatRate ? (
                            <p>${allJobs.flatRate}</p>
                          ) : (
                            <p>
                              ${allJobs.lowerRate} - ${allJobs.upperRate}/hr
                            </p>
                          )}
                        </button>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === allJobs.jobID ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div className=" ml-auto mt-4">
                                <button
                                  onClick={() =>
                                    setOpenInfoWindowMarkerID(null)
                                  }
                                  class="mt-1 size-8  inline-flex justify-center items-center  rounded-full border border-transparent  text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                >
                                  <span class="sr-only">Close</span>
                                  <svg
                                    class="flex-shrink-0 size-4"
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
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div className="w-full "></div>
                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-x-4 space-y-2">
                                      <div class="">
                                        <div className=" w-full flex ">
                                          <p class="font-semibold text-lg text-gray-800 cursor-default">
                                            {allJobs.jobTitle}
                                          </p>
                                        </div>
                                        <div className="flex">
                                          <p className="font-semibold text-sm text-slate-700 ">
                                            Budget:{" "}
                                          </p>
                                          {allJobs.isHourly ? (
                                            <p class="ml-1 font-semibold text-sm text-gray-500  cursor-default">
                                              ${allJobs.lowerRate}/hr - $
                                              {allJobs.upperRate}/hr
                                            </p>
                                          ) : (
                                            <p class="ml-1 font-semibold text-sm text-gray-500  cursor-default">
                                              ${allJobs.flatRate} total
                                            </p>
                                          )}
                                        </div>
                                        <p class="font-semibold text-sm text-gray-500  cursor-default">
                                          <span className="font-semibold text-sm text-slate-700">
                                            {" "}
                                            Posted:
                                          </span>{" "}
                                          {allJobs.datePosted}
                                        </p>
                                        <p class="font-semibold text-sm text-slate-700  mt-2 cursor-pointer">
                                          Employer:
                                        </p>
                                        <div className="flex">
                                          <div class="flex flex-col justify-center items-center size-[56px]  ">
                                            {allJobs.employerProfilePicture ? (
                                              <img
                                                src={
                                                  allJobs.employerProfilePicture
                                                }
                                                class="flex-shrink-0 size-[64px] rounded-full"
                                              />
                                            ) : (
                                              <svg
                                                class="size-full text-gray-500"
                                                width="36"
                                                height="36"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <rect
                                                  x="0.62854"
                                                  y="0.359985"
                                                  width="15"
                                                  height="15"
                                                  rx="7.5"
                                                  fill="white"
                                                ></rect>
                                                <path
                                                  d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                                                  fill="currentColor"
                                                ></path>
                                                <path
                                                  d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                                                  fill="currentColor"
                                                ></path>
                                              </svg>
                                            )}
                                          </div>
                                          <div className="flex flex-col ml-4">
                                            <p class="font-semibold text-sm text-gray-500  mt-2 cursor-pointer">
                                              {allJobs.employerFirstName}
                                            </p>
                                            <p class="font-semibold text-sm text-gray-500 cursor-default ">
                                              {allJobs.city}, Minnesota
                                            </p>
                                          </div>
                                        </div>
                                        {/* <p class="mt-3 font-semibold text-sm text-gray-500  cursor-default">
                                          Posted {allJobs.datePosted}
                                        </p> */}

                                        <div class=" flex-row  items-center  "></div>
                                      </div>

                                      <div class="">
                                        <p class="font-semibold text-md text-gray-800 cursor-default mt-4">
                                          Description
                                        </p>

                                        <p class=" text-md  cursor-default">
                                          {allJobs.description}
                                        </p>
                                      </div>
                                      <div>
                                        <div class=" mt-10 p-4 flex justify-between gap-x-2  absolute right-0 ">
                                          <div class="w-full flex justify-end items-center gap-x-2">
                                            <button
                                              type="button"
                                              onClick={() => saveJob(allJobs)}
                                              class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-white  hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                              data-hs-overlay="#hs-pro-datm"
                                            >
                                              Save Job
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                applyAndNavigate(allJobs)
                                              }
                                              //  onClick={() =>    console.log(allJobs)}
                                              class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                              data-hs-overlay="#hs-pro-datm"
                                            >
                                              Apply
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>
                      ) : null}
                    </>
                  ))}

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
                                          onClick={() =>
                                            applyAndNavigate(businessPostedJobs)
                                          }
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

                {appliedJobs !== null &&
                  appliedJobs.map((appliedJobs) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={appliedJobs.jobID}
                        position={{
                          lat: appliedJobs.locationLat
                            ? appliedJobs.locationLat
                            : 44.96797106363888,
                          lng: appliedJobs.locationLng
                            ? appliedJobs.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() => handleToggleOpen(appliedJobs.jobID)}
                      >
                        <div>
                          {appliedJobs.hasUnreadMessage ? (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {appliedJobs.isVolunteer ? (
                                <p>Volunteer!</p>
                              ) : appliedJobs.isFlatRate ? (
                                <p>${appliedJobs.flatRate}</p>
                              ) : (
                                <p>
                                  ${appliedJobs.lowerRate} - $
                                  {appliedJobs.upperRate}/hr
                                </p>
                              )}

                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                New
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {appliedJobs.isVolunteer ? (
                                <p>Volunteer!</p>
                              ) : appliedJobs.isFlatRate ? (
                                <p>${appliedJobs.flatRate}</p>
                              ) : (
                                <p>
                                  ${appliedJobs.lowerRate} - $
                                  {appliedJobs.upperRate}/hr
                                </p>
                              )}
                            </button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === appliedJobs.jobID ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div className=" ml-auto mt-4">
                                <button
                                  onClick={() =>
                                    setOpenInfoWindowMarkerID(null)
                                  }
                                  class="mt-1 size-8  inline-flex justify-center items-center  rounded-full border border-transparent  text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                >
                                  <span class="sr-only">Close</span>
                                  <svg
                                    class="flex-shrink-0 size-4"
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
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div className="w-full "></div>
                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-x-4 space-y-2">
                                      <div class="">
                                        <div className=" w-full flex ">
                                          <p class="font-semibold text-lg text-gray-800 ">
                                            {appliedJobs.jobTitle}
                                          </p>
                                        </div>
                                        {appliedJobs.isHourly ? (
                                          <p class="font-semibold text-sm text-gray-500  ">
                                            ${appliedJobs.lowerRate}/hr - $
                                            {appliedJobs.upperRate}/hr
                                          </p>
                                        ) : (
                                          <p class="font-semibold text-sm text-gray-500  ">
                                            ${appliedJobs.flatRate} total
                                          </p>
                                        )}
                                        <p class="font-semibold text-sm text-gray-500  ">
                                          {appliedJobs.city}, Minnesota
                                        </p>

                                        <p class="font-semibold text-sm text-gray-500  ">
                                          Posted {appliedJobs.datePosted}
                                        </p>

                                        <div class=" flex-row  items-center  "></div>
                                      </div>

                                      <div class="">
                                        <p class="font-semibold text-lg text-gray-800 ">
                                          Description
                                        </p>

                                        <p class=" text-md  ">
                                          {appliedJobs.description}
                                        </p>
                                      </div>

                                      {appliedJobs.interviewStarted ? (
                                        <>
                                          <div class="py-3  flex-column  items-center  ">
                                            <label
                                              for="hs-pro-dactmt"
                                              class="block  text-xl font-medium text-gray-800 "
                                            >
                                              Interview Started
                                            </label>
                                            <p class="block mb-2 text-sm font-medium text-gray-500 ">
                                              Continue to your messages to
                                              respond to messages
                                            </p>
                                          </div>

                                          {appliedJobs.hasUnreadMessage ? (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                navigateToChannel(appliedJobs)
                                              }
                                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                              See Messages
                                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                                New
                                              </span>
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                navigateToChannel(appliedJobs)
                                              }
                                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                              See Messages
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <div class="py-3  flex-column  items-center  ">
                                            <label
                                              for="hs-pro-dactmt"
                                              class="block  text-xl font-medium text-gray-800 "
                                            >
                                              Application pending
                                            </label>
                                            <p class="block mb-2 text-sm font-medium text-gray-500 ">
                                              {" "}
                                              Message notifications will appear
                                              here if the person who posted this
                                              job contacts you.
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>
                      ) : null}
                    </>
                  ))}

                {jobsInProgress !== null &&
                  jobsInProgress.map((jobsInProgress) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={jobsInProgress.jobID}
                        position={{
                          lat: jobsInProgress.locationLat
                            ? jobsInProgress.locationLat
                            : 44.96797106363888,
                          lng: jobsInProgress.locationLng
                            ? jobsInProgress.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() =>
                          handleToggleInProgressOpen(jobsInProgress)
                        }
                      >
                        <div>
                          {jobsInProgress.hasUnreadMessage ||
                          jobsInProgress.firstHiredNotification ? (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              In Progress
                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                New
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              In Progress
                            </button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === jobsInProgress.jobID ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div class="py-3 px-4 flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenInfoWindowMarkerID(null)
                                      }
                                      class="mt-8 size-8 absolute right-0 inline-flex justify-center items-center  rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                    >
                                      <span class="sr-only">Close</span>
                                      <svg
                                        class="flex-shrink-0 size-4"
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
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                      </svg>
                                    </button>
                                  </div>

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 space-y-2">
                                      <div class="">
                                        <div class="py-3  flex-column  items-center  ">
                                          <label
                                            for="hs-pro-dactmt"
                                            class="block mb-2 text-xl font-medium text-gray-800 "
                                          >
                                            {jobsInProgress.jobTitle}
                                          </label>
                                          <p>
                                            {jobsInProgress.city}, Minnesota
                                          </p>
                                        </div>

                                        <div class=" flex-row  items-center  ">
                                          {jobsInProgress.isHourly ? (
                                            <p>
                                              $ {jobsInProgress.confirmedRate}
                                              /hr
                                            </p>
                                          ) : (
                                            <div className="flex flex-row items-center">
                                              <p>
                                                Confirmed pay: $
                                                {jobsInProgress.confirmedRate}{" "}
                                                total
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div class="">
                                        <label
                                          for="dactmi"
                                          class=" text-lg font-medium text-gray-800 "
                                        >
                                          Description
                                        </label>

                                        <p class=" text-md  ">
                                          {jobsInProgress.description}
                                        </p>
                                      </div>

                                      <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          You've been hired for this position!
                                        </label>
                                      </div>
                                      {jobsInProgress.hasUnreadMessage ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleInProgressNavigate(
                                              jobsInProgress
                                            )
                                          }
                                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                          See Messages
                                          <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                            New
                                          </span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleInProgressNavigate(
                                              jobsInProgress
                                            )
                                          }
                                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                          See Messages
                                        </button>
                                      )}
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2  w-full absolute bottom-12 right-0 ">
                                      <div class="w-full flex justify-center items-center gap-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCompleteModalOpen(
                                              jobsInProgress
                                            )
                                          }
                                          class="py-2 px-3 w-3/4 inline-flex  justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Mark Complete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>
                      ) : null}
                    </>
                  ))}

                {jobsInReview !== null &&
                  jobsInReview.map((jobsInReview) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={jobsInReview.jobID}
                        position={{
                          lat: jobsInReview.locationLat
                            ? jobsInReview.locationLat
                            : 44.96797106363888,
                          lng: jobsInReview.locationLng
                            ? jobsInReview.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() => handleToggleInReviewOpen(jobsInReview)}
                      >
                        <div>
                          {jobsInReview.hasUnreadMessage ||
                          jobsInReview.firstHiredNotification ? (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Awaiting Payment
                              <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                New
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Awaiting Payment
                            </button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === jobsInReview.jobID ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div class="py-3 px-4 flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenInfoWindowMarkerID(null)
                                      }
                                      class="mt-8 size-8 absolute right-0 inline-flex justify-center items-center  rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                    >
                                      <span class="sr-only">Close</span>
                                      <svg
                                        class="flex-shrink-0 size-4"
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
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                      </svg>
                                    </button>
                                  </div>

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 space-y-2">
                                      <div class="">
                                        <div class="mt-3 mb-1  flex-column  items-center  ">
                                          <label
                                            for="hs-pro-dactmt"
                                            class="block text-xl font-medium text-gray-800 "
                                          >
                                            {jobsInReview.jobTitle}
                                          </label>
                                          <p>{jobsInReview.city}, Minnesota</p>
                                        </div>

                                        <div class=" flex-row  items-center  ">
                                          {jobsInReview.isHourly ? (
                                            <p>
                                              {jobsInReview.confirmHours} hours
                                              worked at $
                                              {jobsInReview.confirmedRate}/hour
                                            </p>
                                          ) : (
                                            <div className="flex flex-row items-center">
                                              <p>
                                                Pending payment: $
                                                {jobsInReview.confirmedRate}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div class="">
                                        <label
                                          for="dactmi"
                                          class=" text-lg mt-2 font-medium text-gray-800 "
                                        >
                                          Description
                                        </label>

                                        <p class=" text-md  ">
                                          {jobsInReview.description}
                                        </p>
                                      </div>

                                      <div class=" ">
                                        <label
                                          for="dactmm"
                                          class="block  mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          You've completed this job
                                        </label>
                                        <p className="text-md mb-2 text-gray-500">
                                          Payment pending confirmation
                                        </p>
                                      </div>
                                      {jobsInReview.hasUnreadMessage ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            navigateToChannel(jobsInReview)
                                          }
                                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                          See Messages
                                          <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                                            New
                                          </span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            navigateToChannel(jobsInReview)
                                          }
                                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                          See Messages
                                        </button>
                                      )}
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2  w-full absolute bottom-12 right-0 ">
                                      <div class="w-full flex justify-center items-center gap-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCompleteModalOpen(
                                              jobsInReview
                                            )
                                          }
                                          class="py-2 px-3 w-3/4 inline-flex  justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Mark Complete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Card
                            // align="flex-end"
                            border="1px"
                            borderColor="gray.400"
                            borderWidth="1.5px"
                            width="400px"
                            boxShadow="lg"
                            height="90vh"
                            flexDirection="row"
                          >
                            <CloseButton
                              position="absolute"
                              right="2"
                              size="lg"
                              onClick={() => setOpenInfoWindowMarkerID(null)}
                            >
                              X
                            </CloseButton>
                            <CardBody>
                              <Flex direction="row" alignContent="center">
                                {" "}
                                <Heading fontSize="24" marginTop="16px">
                                  {jobsInReview.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {jobsInReview.city}, MNs
                              </Heading>
                              {jobsInReview.isHourly ? (
                                <Heading size="sm">
                                  {jobsInReview.confirmHours} hours worked at $
                                  {jobsInReview.confirmedRate}/hour
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${jobsInReview.confirmedRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{jobsInReview.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {jobsInReview.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReview.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {jobsInReview.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReview.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {jobsInReview.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReview.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {jobsInReview.niceToHave ? (
                                <Text>{jobsInReview.niceToHave}</Text>
                              ) : (
                                <Text>Nothing listed</Text>
                              )}
                              <Divider />
                              <CardFooter
                                flexDirection="column"
                                marginTop="16px"
                                alignContent="center"
                                justifyContent="center"
                                textAlign="center"
                              >
                                <>
                                  <Heading
                                    alignContent="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    size="md"
                                  >
                                    You've completed this job
                                  </Heading>
                                  <Text
                                    alignContent="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    size="md"
                                    marginTop="8px"
                                  >
                                    Payment pending confirmation
                                  </Text>

                                  {jobsInReview.hasUnreadMessage ? (
                                    <Button
                                      marginTop="24px"
                                      backgroundColor="white"
                                      color="#01A2E8"
                                      _hover={{
                                        bg: "#01A2E8",
                                        textColor: "white",
                                      }}
                                      onClick={() =>
                                        navigateToChannel(jobsInReview)
                                      }
                                    >
                                      See Messages
                                      <Badge
                                        backgroundColor="#df4b4b"
                                        textColor="white"
                                        top="-2"
                                        position="absolute"
                                        right="8"
                                      >
                                        New
                                      </Badge>
                                    </Button>
                                  ) : (
                                    <Button
                                      marginTop="24px"
                                      backgroundColor="white"
                                      color="#01A2E8"
                                      _hover={{
                                        bg: "#01A2E8",
                                        textColor: "white",
                                      }}
                                      onClick={() =>
                                        navigateToChannel(jobsInReview)
                                      }
                                    >
                                      See Messages
                                    </Button>
                                  )}
                                </>
                              </CardFooter>
                            </CardBody>
                          </Card>
                        </Flex>
                      ) : null}
                    </>
                  ))}

                {completedJobsMap !== null &&
                  completedJobsMap.map((completedJobsMap) => (
                    //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                    <>
                      <AdvancedMarker
                        key={completedJobsMap.jobID}
                        position={{
                          lat: completedJobsMap.locationLat
                            ? completedJobsMap.locationLat
                            : 44.96797106363888,
                          lng: completedJobsMap.locationLng
                            ? completedJobsMap.locationLng
                            : -93.26177106829272,
                        }}
                        onClick={() =>
                          handleToggleInReviewOpen(completedJobsMap)
                        }
                      >
                        <div>
                          {completedJobsMap.hasUnreadMessage ||
                          completedJobsMap.firstViewNotification ? (
                            <Button
                              backgroundColor="white"
                              textColor="#018ecb"
                              // borderWidth="1px"
                              borderBottomWidth="1px"
                              borderTopWidth="1px"
                              borderRightWidth="1px"
                              borderLeftWidth="1px"
                              borderColor="#018ecb"
                              _hover={{ bg: "#018ecb", textColor: "white" }}
                              height="24px"
                              marginRight={5}
                            >
                              <Text>Paid</Text>

                              <Badge
                                backgroundColor="#df4b4b"
                                textColor="white"
                                top="-2"
                                position="absolute"
                                right="-4"
                              >
                                New
                              </Badge>
                            </Button>
                          ) : (
                            <Button
                              backgroundColor="white"
                              textColor="#018ecb"
                              // borderWidth="1px"
                              borderBottomWidth="1px"
                              borderTopWidth="1px"
                              borderRightWidth="1px"
                              borderLeftWidth="1px"
                              borderColor="#018ecb"
                              _hover={{ bg: "#018ecb", textColor: "white" }}
                              height="24px"
                              marginRight={5}
                            >
                              <Text>Paid</Text>
                            </Button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === completedJobsMap.jobID ? (
                        <Flex direction="row-reverse">
                          <Card
                            // align="flex-end"
                            border="1px"
                            borderColor="gray.400"
                            borderWidth="1.5px"
                            width="400px"
                            boxShadow="lg"
                            height="90vh"
                            flexDirection="row"
                          >
                            <CloseButton
                              position="absolute"
                              right="2"
                              size="lg"
                              onClick={() => setOpenInfoWindowMarkerID(null)}
                            >
                              X
                            </CloseButton>
                            <CardBody>
                              <Flex direction="row" alignContent="center">
                                {" "}
                                <Heading fontSize="24" marginTop="16px">
                                  {completedJobsMap.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {completedJobsMap.city}, MNs
                              </Heading>
                              {completedJobsMap.isHourly ? (
                                <Heading size="sm">
                                  {completedJobsMap.confirmHours} hours worked
                                  at ${completedJobsMap.confirmedRate}/hour
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${completedJobsMap.confirmedRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{completedJobsMap.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {completedJobsMap.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {completedJobsMap.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {completedJobsMap.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {completedJobsMap.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {completedJobsMap.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {completedJobsMap.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {completedJobsMap.niceToHave ? (
                                <Text>{completedJobsMap.niceToHave}</Text>
                              ) : (
                                <Text>Nothing listed</Text>
                              )}
                              <Divider />
                              <CardFooter
                                flexDirection="column"
                                marginTop="16px"
                                alignContent="center"
                                justifyContent="center"
                                textAlign="center"
                              >
                                <>
                                  <Heading
                                    alignContent="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    size="md"
                                  >
                                    Payment complete!
                                  </Heading>
                                  <Text
                                    alignContent="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    size="md"
                                    marginTop="8px"
                                  ></Text>
                                  {loadingPayment ? (
                                    <Center>
                                      {" "}
                                      <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                        size="xl"
                                        marginTop="24px"
                                      />
                                    </Center>
                                  ) : (
                                    <Button
                                      marginTop="24px"
                                      backgroundColor="#01A2E8"
                                      color="white"
                                      _hover={{
                                        bg: "#018ecb",
                                        textColor: "white",
                                      }}
                                      onClick={() =>
                                        // navigateToChannel(completedJobsMap)
                                        //go to stripe account, add li

                                        handleSeePayment(completedJobsMap)
                                      }
                                    >
                                      See Payment
                                    </Button>
                                  )}
                                  <Button
                                    marginTop="24px"
                                    backgroundColor="white"
                                    textColor="#df4b4b"
                                    onClick={() =>
                                      // navigateToChannel(completedJobsMap)
                                      //go to stripe account, add li

                                      handleRemoveFromMap(completedJobsMap)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </>
                              </CardFooter>
                            </CardBody>
                          </Card>
                        </Flex>
                      ) : null}
                    </>
                  ))}
                <Modal
                  isOpen={isOpenMarkComplete}
                  onClose={onCloseMarkComplete}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Rate This User (optional)</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {isLoading ? (
                        <Center>
                          {" "}
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                            marginTop="24px"
                          />
                        </Center>
                      ) : (
                        <>
                          <Flex>
                            {maxRating.map((item, key) => {
                              return (
                                <Button
                                  activeopacity={0.7}
                                  key={item}
                                  marginTop="8px"
                                  onClick={() => setDefaultRating(item)}
                                >
                                  <Image
                                    boxSize="24px"
                                    src={
                                      item <= defaultRating
                                        ? star_filled
                                        : star_corner
                                    }
                                  ></Image>
                                </Button>
                              );
                            })}
                          </Flex>
                        </>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => handleCloseAndOpen(jobsInProgress)}
                      >
                        Skip
                      </Button>
                      <Button
                        colorScheme="blue"
                        onClick={() => addRating(jobsInProgress)}
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal isOpen={isOpenHourly} onClose={onCloseHourly} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Hours worked</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {isLoading ? (
                        <Center>
                          {" "}
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                            marginTop="36px"
                          />
                        </Center>
                      ) : (
                        <>
                          {" "}
                          <FormLabel marginTop="8" width>
                            How many hours did you work?
                          </FormLabel>
                          <Flex>
                            <Input
                              width="240px"
                              placeholder="Enter hours worked here"
                              onChange={(e) =>
                                confirmHoursValidate(e.target.value)
                              }
                            />{" "}
                            <Heading size="sm" marginTop="8px" marginLeft="8px">
                              {" "}
                              Hours
                            </Heading>
                          </Flex>
                          {confirmHoursValidationBegun === true ? (
                            <Text color="red">
                              {confirmHoursValidationMessage}
                            </Text>
                          ) : null}
                          <Text>{confirmHours}</Text>
                        </>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      {/* <Button variant="ghost" mr={3} onClick={onCloseHourly}>
              Skip
            </Button> */}
                      <Button
                        colorScheme="blue"
                        onClick={() => checkLength(jobsInProgress)}
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal
                  isOpen={isOpenSuccess}
                  onClose={onCloseSuccess}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Success!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>
                        This job has been completed and the person who posted
                        this job has been notified.
                      </Text>
                      <Text>
                        Payment will be sent when they confirm the job has been
                        completed.
                      </Text>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleBothModalClose()}
                      >
                        Continue
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal
                  isOpen={isOpenNoResults}
                  onClose={onCloseNoResults}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>No Results</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>
                        There are currently no jobs posted in this category.
                      </Text>
                      <Text>Try a different category or try again later</Text>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        onClick={() => onCloseNoResults()}
                      >
                        Continue
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal
                  isOpen={isOpenNotOnboarded}
                  onClose={onCloseNotOnboarded}
                  size="xl"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Oops!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>Looks like your account isn't fully set up!</Text>
                      <Text>
                        Finish the onbaording process before applying.
                      </Text>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleNotOboarded()}
                      >
                        Finish Onboarding
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>

                <Modal isOpen={isOpenApplied} onClose={onCloseApplied}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Success!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>Your job has been posted.</Text>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => onCloseApplied}
                      >
                        Close
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
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => onCloseSaved()}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Map>
            </Box>
            {firstVisitModalVisible ? <DoerFirstVisitModal /> : null}
          </APIProvider>
        ) : (
          <Text>loading...</Text>
        )}
      </Flex>
    </div>
  );
};

export default DoerMapScreen;
