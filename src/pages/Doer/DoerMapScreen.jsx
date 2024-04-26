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

const DoerMapScreen = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const navigate = useNavigate();

  const [hasRun, setHasRun] = useState(false);

  const [selectedLat, setSelectedLat] = useState(null)
  const [selectedLng, setSelectedLng] = useState(null)




 

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
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
         //ignore this job is for Needer map screen
        } else {
          results.push({ ...doc.data(), id: doc.id });
        }
       
      });
    
      setPostedJobs(results);
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
    allJobs.map((allJobs) => {
    
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
  
    setOpenInfoWindowMarkerID(x);
    getData(x);
  };

  const handleToggleAppliedOpen = (x) => {
    
    setOpenInfoWindowMarkerID(x.jobID);
    getData(x.jobID);
  };

  useEffect(() => {
 
  }, [openInfoWindowMarkerID]);

  useEffect(() => {
    if (appliedJobs.length !== 0 && postedJobs.length !== 0) {
      appliedJobs.forEach((appliedJob) => {
        postedJobs.forEach((postedJob) => {
          if (appliedJob.jobID === postedJob.jobID) {
            

            //credit user1438038 & Niet the Dark Absol https://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property

            for (var i = allJobs.length - 1; i >= 0; --i) {
              if (allJobs[i].jobID == postedJob.jobID) {
                allJobs.splice(i, 1);
               
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
    isOpen: isOpenNoResults,
    onOpen: onOpenNoResults,
    onClose: onCloseNoResults,
  } = useDisclosure();
  const {
    isOpen:   isOpenNotOnboarded,
    onOpen:   onOpenNotOnboarded,
    onClose:  onCloseNotOnboarded,
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


const handleNotOboarded = () => {
  onCloseNotOnboarded()
  navigate("/DoerAccountManager")
}



  //apply logic
  const applyAndNavigate = () => {
    if (isOnboarded === true) {
      updateDoc(doc(db, "employers", employerID, "Posted Jobs", jobTitle), {
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
          employerID,
          "Posted Jobs",
          jobTitle,
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

      setDoc(doc(db, "users", user.uid, "Applied", jobTitle), {
        requirements: requirements ? requirements : null,
        requirements2: requirements2 ? requirements2 : null,
        requirements3: requirements3 ? requirements3 : null,
        isFlatRate: isFlatRate ? isFlatRate : null,
        niceToHave: niceToHave ? niceToHave : null,
        jobID: openInfoWindowMarkerID,
        jobTitle: jobTitle ? jobTitle : null,
        hourlyRate: hourlyRate ? hourlyRate : null,
        streetAddress: streetAddress ? streetAddress : null,
        city: city ? city : null,
        state: state ? state : null,
        zipCode: zipCode ? zipCode : null,
        description: description ? description : null,
        addressNumber: addressNumber ? addressNumber : null,
        addressName: addressName ? addressName : null,
        lowerRate: lowerRate ? lowerRate : null,
        upperRate: upperRate ? upperRate : null,
        addressSuffix: addressSuffix ? addressSuffix : null,
        locationLat: locationLat ? locationLat : null,
        locationLng: locationLng ? locationLng : null,
        businessName: businessName ? businessName : null,
        employerID: employerID ? employerID : null,
        employerFirstName: employerFirstName ? employerFirstName : null,
        flatRate: flatRate ? flatRate : null,
        isHourly: isHourly ? isHourly : null,
        category: category ? category : null,
        isOneTime: isOneTime ? isOneTime : null,
        lowerCaseJobTitle: lowerCaseJobTitle ? lowerCaseJobTitle : null,
      })
        .then(() => {
          onOpen();
        })
        .catch((error) => {
          //uh oh
          
        });
    } else {
     onOpenNotOnboarded()
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

  const saveJob = () => {
    setDoc(doc(db, "users", user.uid, "Saved Jobs", openInfoWindowMarkerID), {
      requirements: requirements ? requirements : null,
      requirements2: requirements2 ? requirements2 : null,
      requirements3: requirements3 ? requirements3 : null,
      jobID: openInfoWindowMarkerID,
      niceToHave: niceToHave ? niceToHave : null,
      jobTitle: jobTitle ? jobTitle : null,
      hourlyRate: hourlyRate ? hourlyRate : null,
      streetAddress: streetAddress ? streetAddress : null,
      city: city ? city : null,
      state: state ? state : null,
      zipCode: zipCode ? zipCode : null,
      description: description ? description : null,
      addressNumber: addressNumber ? addressNumber : null,
      addressName: addressName ? addressName : null,
      lowerRate: lowerRate ? lowerRate : null,
      upperRate: upperRate ? upperRate : null,
      addressSuffix: addressSuffix ? addressSuffix : null,
      locationLat: locationLat ? locationLat : null,
      locationLng: locationLng ? locationLng : null,
      businessName: businessName ? businessName : null,
      employerID: employerID ? employerID : null,
      employerFirstName: employerFirstName ? employerFirstName : null,
      flatRate: flatRate ? flatRate : null,
      isHourly: isHourly ? isHourly : null,
      category: category ? category : null,
      isOneTime: isOneTime ? isOneTime : null,
      lowerCaseJobTitle: lowerCaseJobTitle ? lowerCaseJobTitle : null,
    })
      .then(() => {
        //all good
       
        // navigation.navigate("BottomUserTab");
        alert("Job Saved");
      })
      .catch((error) => {
        // no bueno
    
      });

    //submit data
  };

  //category search

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
       onOpenNoResults()
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  //chat channel navigation
  const navigateToChannel = (x) => {
    navigate("/DoerMessageList", { state: { selectedChannel: x.channelID } });
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

      setIsLoading(true)

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
        .then(() => {
         
        })
        .catch((error) => {
       
        });

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
        .then(() => {
         
        })
        .catch((error) => {
         
        });

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
        .catch((error) => {
        
        });

      setTimeout(() => {
        setIsLoading(false)
       
        onClose();
        onOpenSuccess()
        navigate("/DoerMapScreen");
      }, 2500);
    }
  };

  const addHoursWorkedNavigate = () => {
    //push to respective In Review dbs, user and employer

    setIsLoading(true)

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
      .then(() => {
      
      })
      .catch((error) => {
       
      });

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
      .then(() => {
   
      })
      .catch((error) => {
    
      });

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
      .catch((error) => {
     
      });

    setTimeout(() => {
      setIsLoading(false)
      
      onCloseHourly();
      onOpenSuccess()
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
        .then(() => {
         
        })
        .catch((error) => {
          
        });

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
        .then(() => {
          
        })
        .catch((error) => {
         
        });

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
        .catch((error) => {
         
        });

      setDoc(doc(db, "users", user.uid, "Ratings", postedJobs[0].jobTitle), {
        ratingComplete: false,
      })
        .then(() => {
          setIsLoading(true);
        })
        .catch((error) => {
         
        });

      setTimeout(() => {
        setIsLoading(false);
        
        onClose();
        onOpenSuccess()
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
    onCloseHourly()
    onCloseMarkComplete()
    onCloseSuccess()
  }



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
      setLoadingPayment(false)
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
        setSessionUrl(null)
      })
    }, 1000);
  } else {
  }
}, []);

const [loadingPayment, setLoadingPayment] = useState(false)

const handleSeePayment = (x) => {
  setLoadingPayment(true)
  if (x.firstViewNotification === true) {
    updateDoc(doc(db, "users", user.uid, "Past Jobs Map", x.jobTitle), {
      firstViewNotification: false,
    }).then(() => {
      logInStripe()

    })
  } else {
    logInStripe()
  }

}

const handleRemoveFromMap = (x) => {


    deleteDoc(doc(db, "users", user.uid, "Past Jobs Map", x.jobTitle), {
    })
  

}

  return (
    <div>
      <DoerHeader />
      <Flex marginTop="4">
        <DoerDashboard />
        {process.env.REACT_APP_GOOGLE_API_KEY ? (
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <div style={{ height: "90vh", width: "93vw" }}>
              <Map
                // center={{ lat: selectedLat ? selectedLat : defaultLat, lng: selectedLng ? selectedLng : defaultLong }}
                defaultCenter={{ lat: selectedLat ? selectedLat : defaultLat, lng: selectedLng ? selectedLng : defaultLong }}
                defaultZoom={12}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                //move to env
                mapId="6cc03a62d60ca935"
                onClick={() => setOpenInfoWindowMarkerID(null)}
              >
                <Center marginTop="8px">
                  <Card
                    align="center"
                    border="1px"
                    borderColor="gray.400"
                    borderWidth="1.5px"
                    width="auto"
                    boxShadow="lg"
                    flexDirection="row"
                  >
                    <Select
                      placeholder="Looking for something specific?"
                      width="360px"
                      onChange={(e) => setSearchJobCategory(e.target.value)}
                    >
                      <option value="all">Clear Selection</option>
                      <option>--------------------------------</option>
                      <option value="asphalt">Asphalt</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="concrete">Concrete</option>
                      <option value="drywall">Drywall</option>
                      <option value="electrical work">Electrical Work</option>
                      <option value="general handyman">General Handyman</option>
                      <option value="gutter cleaning">Gutter Cleaning</option>
                      <option value="hvac">HVAC</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="painting">Painting</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="pressure washing">Pressure Washing</option>
                      <option value="roofing">Roofing</option>
                      <option value="siding">Siding</option>
                      <option value="snow removal">Snow Removal</option>
                      <option value="window installation">
                        Window Installation
                      </option>
                      <option value="window washing">Window Washing</option>
                      <option value="yard work">Yard Work</option>
                    </Select>
                    {/* <Button colorScheme="blue" width="240px">
                    Search
                  </Button> */}
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
                        onClick={() => handleToggleOpen(allJobs.jobID)}
                      >
                        <div>
                          <Button
                            backgroundColor="#01A2E8"
                            color="white"
                            _hover={{ bg: "#018ecb", textColor: "white" }}
                            height="24px"
                            marginRight={5}
                          >
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
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === allJobs.jobID ? (
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
                                  {allJobs.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {allJobs.city}, MN
                              </Heading>
                              {allJobs.isHourly ? (
                                <Heading size="sm">
                                  ${allJobs.lowerRate}/hr-${allJobs.upperRate}
                                  /hr
                                </Heading>
                              ) : (
                                <Heading size="sm">${allJobs.flatRate}</Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{allJobs.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {allJobs.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {allJobs.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {allJobs.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {allJobs.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {allJobs.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {allJobs.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {allJobs.niceToHave ? (
                                <Text>{allJobs.niceToHave}</Text>
                              ) : (
                                <Text>Nothing listed</Text>
                              )}
                              <Divider />
                              <CardFooter
                                flexDirection="column"
                                marginTop="16px"
                              >
                                <Button
                                  backgroundColor="#01A2E8"
                                  textColor="white"
                                  _hover={{ bg: "#018ecb", textColor: "white" }}
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() => applyAndNavigate()}
                                >
                                  Apply
                                </Button>{" "}
                                <Button
                                  colorScheme="white"
                                  textColor="#01A2E8"
                                  borderColor="#01A2E8"
                                  borderWidth="1px"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() => saveJob()}
                                >
                                  Save
                                </Button>
                              </CardFooter>
                            </CardBody>
                          </Card>
                        </Flex>
                      ) : null}
                    </>
                  ))}

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Success!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>Application submitted</Text>
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
                        onClick={() => handleToggleAppliedOpen(appliedJobs)}
                      >
                        <div>
                          {appliedJobs.hasUnreadMessage ? (
                            <Button
                              colorScheme="blue"
                              height="24px"
                              marginRight={5}
                            >
                              {appliedJobs.isVolunteer ? (
                                <Text>Volunteer!</Text>
                              ) : appliedJobs.isFlatRate ? (
                                <Text>${appliedJobs.flatRate}</Text>
                              ) : (
                                <Text>
                                  ${appliedJobs.lowerRate} - $
                                  {appliedJobs.upperRate}/hr
                                </Text>
                              )}
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
                              colorScheme="blue"
                              height="24px"
                              marginRight={5}
                            >
                              {appliedJobs.isVolunteer ? (
                                <Text>Volunteer!</Text>
                              ) : appliedJobs.isFlatRate ? (
                                <Text>${appliedJobs.flatRate}</Text>
                              ) : (
                                <Text>
                                  ${appliedJobs.lowerRate} - $
                                  {appliedJobs.upperRate}/hr
                                </Text>
                              )}
                            </Button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === appliedJobs.jobID ? (
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
                                  {appliedJobs.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {appliedJobs.city}, MNs
                              </Heading>
                              {appliedJobs.isHourly ? (
                                <Heading size="sm">
                                  ${appliedJobs.lowerRate}/hr-$
                                  {appliedJobs.upperRate}
                                  /hr
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${appliedJobs.flatRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{appliedJobs.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {appliedJobs.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {appliedJobs.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {appliedJobs.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {appliedJobs.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {appliedJobs.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {appliedJobs.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {appliedJobs.niceToHave ? (
                                <Text>{appliedJobs.niceToHave}</Text>
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
                                {appliedJobs.interviewStarted ? (
                                  <>
                                    <Heading
                                      alignContent="center"
                                      justifyContent="center"
                                      textAlign="center"
                                      size="md"
                                    >
                                      {" "}
                                      Interview Started
                                    </Heading>

                                    {appliedJobs.hasUnreadMessage ? (
                                      <Button
                                        marginTop="16px"
                                        backgroundColor="#01A2E8"
                                        color="white"
                                        _hover={{
                                          bg: "#018ecb",
                                          textColor: "white",
                                        }}
                                        onClick={() =>
                                          navigateToChannel(appliedJobs)
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
                                        marginTop="16px"
                                        backgroundColor="#01A2E8"
                                        color="white"
                                        _hover={{
                                          bg: "#018ecb",
                                          textColor: "white",
                                        }}
                                        onClick={() =>
                                          navigateToChannel(appliedJobs)
                                        }
                                      >
                                        See Messages
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Heading
                                      alignContent="center"
                                      justifyContent="center"
                                      textAlign="center"
                                      size="md"
                                    >
                                      {" "}
                                      Application pending
                                    </Heading>
                                    <Text
                                      alignContent="center"
                                      justifyContent="center"
                                      textAlign="center"
                                      marginTop="16px"
                                    >
                                      Message notifications will appear here if
                                      the person who posted this job contacts
                                      you.
                                    </Text>
                                  </>
                                )}
                              </CardFooter>
                            </CardBody>
                          </Card>
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
                            <Button
                              colorScheme="green"
                              height="24px"
                              marginRight={5}
                            >
                              <Text>In Progress</Text>

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
                              colorScheme="green"
                              height="24px"
                              marginRight={5}
                            >
                              <Text>In Progress</Text>
                            </Button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === jobsInProgress.jobID ? (
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
                                  {jobsInProgress.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {jobsInProgress.city}, MN
                              </Heading>
                              {jobsInProgress.isHourly ? (
                                <Heading size="sm">
                                  ${jobsInProgress.confirmedRate}/hr
                                  
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${jobsInProgress.confirmedRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{jobsInProgress.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {jobsInProgress.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgress.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {jobsInProgress.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgress.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {jobsInProgress.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgress.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {jobsInProgress.niceToHave ? (
                                <Text>{jobsInProgress.niceToHave}</Text>
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
                                    You've been hired for this position!
                                  </Heading>

                                  {jobsInProgress.hasUnreadMessage ? (
                                    <Button
                                      marginTop="24px"
                                      backgroundColor="white"
                                      color="#01A2E8"
                                      _hover={{
                                        bg: "#01A2E8",
                                        textColor: "white",
                                      }}
                                      onClick={() =>
                                        handleInProgressNavigate(jobsInProgress)
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
                                        handleInProgressNavigate(jobsInProgress)
                                      }
                                    >
                                      See Messages
                                    </Button>
                                  )}
                                </>

                                <Button
                                  marginTop="24px"
                                  backgroundColor="#01A2E8"
                                  color="white"
                                  _hover={{
                                    bg: "#018ecb",
                                    textColor: "white",
                                  }}
                                  onClick={() =>
                                    handleCompleteModalOpen(jobsInProgress)
                                  }
                                >
                                  Mark Complete
                                </Button>
                              </CardFooter>
                            </CardBody>
                          </Card>
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
                        onClick={() =>
                          handleToggleInReviewOpen(jobsInReview)
                        }
                      >
                        <div>
                          {jobsInReview.hasUnreadMessage ||
                          jobsInReview.firstHiredNotification ? (
                            <Button
                              colorScheme="green"
                              height="24px"
                              marginRight={5}
                            >
                              <Text>Awaiting Payment</Text>

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
                              colorScheme="green"
                              height="24px"
                              marginRight={5}
                            >
                              <Text>Awaiting Payment</Text>
                            </Button>
                          )}
                        </div>
                        /
                      </AdvancedMarker>
                      {openInfoWindowMarkerID === jobsInReview.jobID ? (
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
                                  {jobsInReview.jobTitle}
                                </Heading>
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {jobsInReview.city}, MNs
                              </Heading>
                              {jobsInReview.isHourly ? (
                                <Heading size="sm">
                                  {jobsInReview.confirmHours} hours worked at ${jobsInReview.confirmedRate}/hour 
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
                                  {completedJobsMap.confirmHours} hours worked at ${completedJobsMap.confirmedRate}/hour 
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
                                  >
                                    
                                  </Text>
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
                <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Success!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                     
                       <Text>This job has been completed and the person who posted this job has been notified.</Text>
                       <Text>Payment will be sent when they confirm the job has been completed.</Text>
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
                <Modal isOpen={isOpenNoResults} onClose={onCloseNoResults} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>No Results</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                     
                       <Text>There are currently no jobs posted in this category.</Text>
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
                <Modal isOpen={isOpenNotOnboarded} onClose={onCloseNotOnboarded} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Oops!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                     
                       <Text>Looks like your account isn't fully set up!</Text>
                       <Text>Finish the onbaording process before applying.</Text>
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
              </Map>
            </div>
          </APIProvider>
        ) : (
          <Text>loading...</Text>
        )}
      </Flex>
    </div>
  );
};

export default DoerMapScreen;
