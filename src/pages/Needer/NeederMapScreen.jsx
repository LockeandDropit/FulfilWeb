import React from "react";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { Input, Button, Text, Box } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import NeederHeader from "../Needer/NeederHeader";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  CloseButton,
  Badge,
  Avatar,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
import NeederDashboard from "./NeederDashboard";
import { Select } from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import EmbeddedPayments from "../../components/EmbeddedPayments";
import { useLocation } from "react-router-dom";
import NewVisitModal from "./NeederComponents/NewVisitModal";
import { useMediaQuery } from "@chakra-ui/react";

import Dashboard from "./Components/Dashboard";
import Header from "./Components/Header";
import EditSelectedJob from "./Components/EditSelectedJob";

const NeederMapScreen = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();

  const [firstVisitModalVisible, setFirstVisitModalVisible] = useState(false);

  useEffect(() => {
    if (location.state === null) {
    } else {
      if (location.state.editReset) {
        setEditVisible(false);
      } else if (location.state.firstVisit) {
        setFirstVisitModalVisible(true);
      }
    }
  }, [location]);

  const [hasRun, setHasRun] = useState(false);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  //Pulls in Posted Job info from DB.. initial rendering

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Posted Jobs"));

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
          setPostedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [jobsInProgressMap, setJobsInProgressMap] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "employers", user.uid, "Jobs In Progress")
      );

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
          setJobsInProgressMap(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [jobsInReviewMap, setJobsInReviewMap] = useState([]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "In Review"));

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
          setJobsInReviewMap(results);
          console.log("in review", results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

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

  const defaultLat = 44.96797106363888;
  const defaultLong = -93.26177106829272;
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";

  //map help https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
  const [open, setOpen] = useState(false);

  //opening one window at a time help from https://github.com/Developer-Nijat/React-Google-Map-Markers/blob/main/src/App.jsx & https://www.youtube.com/watch?v=Uq-0tA0f_X8 & Vadim Gremyachev https://stackoverflow.com/questions/50903246/react-google-maps-multiple-info-windows-opening-up

  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState(null);

  const handleToggleOpen = (x) => {
    setApplicant(null);
    setOpenInfoWindowMarkerID(x.jobID);
    console.log("handle passed location", x.locationLat, x.locationLng);
    //center map on spot selected
    setSelectedLat(x.locationLat);
    setSelectedLng(x.locationLng);
    setIsLoading(true);
    if (x.hasNewApplicant === true) {
      updateDoc(doc(db, "employers", user.uid, "Posted Jobs", x.jobTitle), {
        hasNewApplicant: false,
      })
        .then(() => {
          //user info submitted to Job applicant file
        })
        .catch((error) => {
          //uh oh
          console.log(error);
        });
    }
    const q = query(
      collection(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        x.jobTitle,
        "Applicants"
      )
    );

    onSnapshot(q, (snapshot) => {
      let results = [];
      let finalResults = [];
      let toMergeResults = [];
      snapshot.docs.forEach((doc) => {
        if (doc.id.length > 25) {
          results.push(doc.id);
          console.log("here?", doc.id);
        } else {
        }
      });

      results.forEach((results) => {
        const messageRef = doc(
          db,
          "employers",
          user.uid,
          "Posted Jobs",
          x.jobTitle,
          "Applicants",
          results
        );

        getDoc(messageRef).then((snapshot) => {
          if (!snapshot.data()) {
            console.log("nothing");
            // console.log(snapshot.data())
          } else {
            console.log(
              "applicant messageinfo from employer fb",
              snapshot.data()
            );
            toMergeResults.push({
              ...snapshot.data(),
              id: snapshot.data().applicantID,
            });
          }
        });
      });

      results.forEach((results) => {
        const secondQuery = doc(db, "users", results);

        getDoc(secondQuery).then((snapshot) => {
          // if empty https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
          // if (Object.keys(snapshot.data()).length !== 0) {
          //   finalResults.push({ ...snapshot.data() });
          // } else {
          //   console.log("ehh");
          // }

          if (!snapshot.data()) {
            console.log("nothing");
            // console.log(snapshot.data())
          } else {
            finalResults.push({
              ...snapshot.data(),
              id: snapshot.data().streamChatID,
            });
          }

          // finalResults.push({ ...snapshot.data() });

          //this is so dirty but why is this the only way I could get it to render???

          //ATTN: THIS IS ONLY ALLOWING ONE APPLICANT TO SHOW UP.
          //CHANGE [finalResults[0]] back to finalResults to access all
          //this is because all message instances are being merged under the jobIDs in StremChat instead of making new ones. Need to fix that.

          //working code
          // setTimeout(() => {
          //   setApplicant([finalResults[0]]);
          //   console.log("this is your applicant(s)", finalResults);
          // }, 50);
          setTimeout(() => {
            //credit Andreas Tzionis https://stackoverflow.com/questions/19480008/javascript-merging-objects-by-id
            setApplicant(
              finalResults.map((t1) => ({
                ...t1,
                ...toMergeResults.find((t2) => t2.id === t1.id),
              }))
            );

            setIsLoading(false);
          }, 500);

          const ratingsQuery = query(
            collection(db, "users", finalResults[0].streamChatID, "Ratings")
          );

          onSnapshot(ratingsQuery, (snapshot) => {
            let ratingResults = [];
            snapshot.docs.forEach((doc) => {
              //review what this does
              if (isNaN(doc.data().rating)) {
                console.log("not a number");
              } else {
                ratingResults.push(doc.data().rating);
              }
            });
            //cited elsewhere
            if (!ratingResults || !ratingResults.length) {
              //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
              setRating(0);
            } else {
              setRating(
                ratingResults.reduce((a, b) => a + b) / ratingResults.length
              );
              setNumberOfRatings(ratingResults.length);
            }
          });
        });
      });
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (selectedLat) {
      setTimeout(() => {
        setSelectedLat(null);
        setSelectedLng(null);
      }, 100);
    }
  }, [selectedLat]);

  const [hiredApplicant, setHiredApplicant] = useState(null);
  const handleToggleInProgressOpen = (x) => {
    console.log("handle toggle open", x);
    setOpenInfoWindowMarkerID(x.jobID);

    // if (x.hasNewApplicant === true) {
    //   updateDoc(doc(db, "employers", user.uid, "Jobs In Progress", x.jobTitle), {
    //     hasNewApplicant: false,
    //   })
    //     .then(() => {
    //       //user info submitted to Job applicant file
    //     })
    //     .catch((error) => {
    //       //uh oh
    //       console.log(error);
    //     });
    // }
    const secondQuery = doc(db, "users", x.hiredApplicant);
    let finalResults = [];
    getDoc(secondQuery).then((snapshot) => {
      // if empty https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
      // if (Object.keys(snapshot.data()).length !== 0) {
      //   finalResults.push({ ...snapshot.data() });
      // } else {
      //   console.log("ehh");
      // }

      if (!snapshot.data()) {
        console.log("nothing");
        // console.log(snapshot.data())
      } else {
        finalResults.push({
          ...snapshot.data(),
          id: snapshot.data().hiredApplicant,
        });
      }
      // finalResults.push({ ...snapshot.data() });

      //this is so dirty but why is this the only way I could get it to render???

      //ATTN: THIS IS ONLY ALLOWING ONE APPLICANT TO SHOW UP.
      //CHANGE [finalResults[0]] back to finalResults to access all
      //this is because all message instances are being merged under the jobIDs in StremChat instead of making new ones. Need to fix that.

      //working code
      // setTimeout(() => {
      //   setApplicant([finalResults[0]]);
      //   console.log("this is your applicant(s)", finalResults);
      // }, 50);
      setTimeout(() => {
        setHiredApplicant(finalResults[0]);
        console.log("this is your applicant(s)", finalResults[0]);
      }, 50);

      const ratingsQuery = query(
        collection(db, "users", finalResults[0].streamChatID, "Ratings")
      );

      onSnapshot(ratingsQuery, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          if (isNaN(doc.data().rating)) {
            console.log("not a number");
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    });
  };

  const handleToggleInReviewOpen = (x) => {
    console.log("handle toggle open", x);
    setOpenInfoWindowMarkerID(x.jobID);

    // if (x.hasNewApplicant === true) {
    //   updateDoc(doc(db, "employers", user.uid, "Jobs In Progress", x.jobTitle), {
    //     hasNewApplicant: false,
    //   })
    //     .then(() => {
    //       //user info submitted to Job applicant file
    //     })
    //     .catch((error) => {
    //       //uh oh
    //       console.log(error);
    //     });
    // }
    const secondQuery = doc(db, "users", x.hiredApplicant);
    let finalResults = [];
    getDoc(secondQuery).then((snapshot) => {
      // if empty https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
      // if (Object.keys(snapshot.data()).length !== 0) {
      //   finalResults.push({ ...snapshot.data() });
      // } else {
      //   console.log("ehh");
      // }

      if (!snapshot.data()) {
        console.log("nothing");
        // console.log(snapshot.data())
      } else {
        finalResults.push({
          ...snapshot.data(),
          id: snapshot.data().hiredApplicant,
        });
      }
      // finalResults.push({ ...snapshot.data() });

      //this is so dirty but why is this the only way I could get it to render???

      //ATTN: THIS IS ONLY ALLOWING ONE APPLICANT TO SHOW UP.
      //CHANGE [finalResults[0]] back to finalResults to access all
      //this is because all message instances are being merged under the jobIDs in StremChat instead of making new ones. Need to fix that.

      //working code
      // setTimeout(() => {
      //   setApplicant([finalResults[0]]);
      //   console.log("this is your applicant(s)", finalResults);
      // }, 50);
      setTimeout(() => {
        setHiredApplicant(finalResults[0]);
        console.log("this is your applicant(s)", finalResults[0]);
      }, 50);

      const ratingsQuery = query(
        collection(db, "users", finalResults[0].streamChatID, "Ratings")
      );

      onSnapshot(ratingsQuery, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          if (isNaN(doc.data().rating)) {
            console.log("not a number");
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    });
  };

  // console.log(rating);

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

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setIsOnboarded(snapshot.data().isOnboarded);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //Save Logic

  //get data

  const getData = async () => {
    const docRef = doc(
      db,
      "employers",
      user.uid,
      "Posted Jobs",
      openInfoWindowMarkerID
    );

    await getDoc(docRef).then((snapshot) => {
      console.log("this is the selected job", snapshot.data());
      setFlatRate(snapshot.data().flatRate);
      setJobTitle(snapshot.data().jobTitle);
      setLowerRate(snapshot.data().lowerRate);
      setUpperRate(snapshot.data().upperRate);
      setCity(snapshot.data().city);
      // setEmployerID(snapshot.data().employerID);
      // setEmployerFirstName(snapshot.data().firstName);
      setZipCode(snapshot.data().zipCode);
      setDescription(snapshot.data().description);

      // setEmployerFirstName(snapshot.data().firstName)
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

  const viewApplicants = (x) => {
    navigate("/NeederApplicants", {
      state: { jobID: x.jobID, jobTitle: x.jobTitle, isHourly: x.isHourly },
    });
  };

  const navigateToChannel = (x) => {
    navigate("/NeederMessageList", { state: { selectedChannel: x.channelID } });
    // console.log("mesage channel",x);
  };

  const navigateApplicantProfile = (applicant, allJobs) => {
    console.log("accepting", applicant, allJobs);
    navigate("/ApplicantProfile", {
      state: {
        applicant: applicant,
        jobTitle: allJobs.jobTitle,
        jobID: allJobs.jobID,
        isHourly: allJobs.isHourly,
      },
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCancelConfirm,
    onOpen: onOpenCancelConfirm,
    onClose: onCloseCancelConfirm,
  } = useDisclosure();

  const [addJobVisible, setAddJobVisible] = useState(false);
  const [paymentsVisible, setPaymentsVisible] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState(null);

  const handlePaymentsVisible = (x) => {
    console.log("handle payments", x);
    setPaymentsVisible(true);
    setSelectedJobForPayment(x);
  };

  const handleAddNewJob = () => {
    setAddJobVisible(true);
  };

  //handle canceling job
  const confirmCancelModal = (x) => {
    console.log("confirm cancel this", x);
    onOpenCancelConfirm();
  };

  const handleDelete = (x) => {
    console.log("cancel this one", x);
    setDoc(doc(db, "Canceled Jobs", x.jobID), {
      employerID: user.uid,

      doerID: x.hiredApplicant ? x.hiredApplicant : null,
      jobTitle: x.jobTitle,
    })
      .then(() => {})
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(doc(db, "Map Jobs", x.jobID), {})
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", x.jobTitle), {})
      .then(() => {
        //all good
        onOpen();
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(
      doc(db, "employers", user.uid, "Jobs In Progress", x.jobTitle),
      {}
    )
      .then(() => {
        //all good
        onOpen();
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    onCloseCancelConfirm();
  };

  const handleEdit = (x) => {
    navigate("/EditPostedJob", {
      state: { jobID: x.jobID, jobTitle: x.jobTitle, isHourly: x.isHourly },
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  //payment verification and data movement initially taken from EmbeddedPayments component

  const handleCloseInfoWindow = () => {
    setOpenInfoWindowMarkerID(null);
    setApplicant(null);
  };

  const [editVisible, setEditVisible] = useState(false);

  const handleEditJob = (x) => {
    setEditVisible(true);
  };

  const [showList, setShowList] = useState(true);
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  return (
    <div>
      <Header />
      <Flex>
        <Dashboard />

        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <Box
            h={{ base: "98vh", lg: "100vh" }}
            w={{ base: "100vw", lg: "100vw" }}
            mt={10}
          >
            <Map
              //   defaultCenter={{ lat: defaultLat, lng: defaultLong }}
              defaultCenter={{
                lat: selectedLat ? selectedLat : defaultLat,
                lng: selectedLng ? selectedLng : defaultLong,
              }}
              defaultZoom={isDesktop ? 12 : 11}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              //move to env
              mapId="6cc03a62d60ca935"
              onClick={() => handleCloseInfoWindow()}
            >
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
                      // onClick={() => handleToggleOpen(allJobs.jobID)}
                      onClick={() => handleToggleOpen(allJobs)}
                    >
                      {allJobs.hasNewApplicant || allJobs.hasUnreadMessage ? (
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

                          <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                            New
                          </span>
                        </button>
                      ) : (
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
                      )}
                    </AdvancedMarker>
                    {openInfoWindowMarkerID === allJobs.jobID ? (
                      <>
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div class="py-3 px-4 flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleCloseInfoWindow()}
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
                                            {allJobs.jobTitle}
                                          </label>
                                          <p>{allJobs.city}, Minnesota</p>
                                          {allJobs.isHourly ? (
                                            <p>
                                              ${allJobs.lowerRate}/hr-$
                                              {allJobs.upperRate}
                                              /hr
                                            </p>
                                          ) : (
                                            <p>${allJobs.flatRate}</p>
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

                                        <p>{allJobs.description}</p>
                                      </div>

                                      <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          Applicants
                                        </label>
                                        {isLoading ? (
                                          <Center marginTop="32px">
                                            <Spinner
                                              thickness="4px"
                                              speed="0.65s"
                                              emptyColor="gray.200"
                                              color="#01A2E8"
                                              size="lg"
                                            />
                                          </Center>
                                        ) : applicant ? (
                                          applicant.map((applicant) => (
                                            <>
                                              <div className="mt-2 ">
                                                {" "}
                                                <li className="flex justify-between gap-x-6 py-1 ">
                                                  <div className="flex min-w-0 gap-x-4">
                                                    {applicant.profilePictureResponse ? (
                                                      <img
                                                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                                        src={
                                                          applicant.profilePictureResponse
                                                        }
                                                        alt=""
                                                      />
                                                    ) : ( <span class="inline-block size-[46px] bg-gray-100 rounded-full overflow-hidden">
                                                    <svg class="size-full text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                                                      <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                                                      <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                                                    </svg>
                                                  </span>)}

                                                    <div className="min-w-0 flex-auto">
                                                      <p className="text-md font-semibold leading-6 text-gray-900">
                                                        {applicant.firstName}
                                                      </p>

                                                      <p className="mt-1 truncate text-xs leading-5 text-gray-500"></p>
                                                      {applicant.numberOfRatings ? (
                                                        <Flex>
                                                          {maxRating.map(
                                                            (item, key) => {
                                                              return (
                                                                <Box
                                                                  activeopacity={
                                                                    0.7
                                                                  }
                                                                  key={item}
                                                                  marginTop="5px"
                                                                >
                                                                  <Image
                                                                    boxSize="16px"
                                                                    src={
                                                                      item <=
                                                                      applicant.rating
                                                                        ? star_filled
                                                                        : star_corner
                                                                    }
                                                                  ></Image>
                                                                </Box>
                                                              );
                                                            }
                                                          )}
                                                          <p marginLeft="4px">
                                                            (
                                                            {
                                                              applicant.numberOfRatings
                                                            }{" "}
                                                            reviews)
                                                          </p>
                                                        </Flex>
                                                      ) : (
                                                        <p marginTop="2px">
                                                          No reviews yet!
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                    {applicant.isPremium ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-green-100 text-green-500 ">
                                                        Premium Contractor
                                                      </span>
                                                    ) : null}
                                                  </div>
                                                </li>
                                                <div className="flex-column min-w-0 gap-x-4 mb-16">
                                                  {applicant.isPremium ? (
                                                    <>
                                                      {applicant.premiumCategoryOne ? (
                                                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                                          {
                                                            applicant.premiumCategoryOne
                                                          }
                                                        </span>
                                                      ) : null}

                                                      {applicant.premiumCategoryTwo ? (
                                                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                          {
                                                            applicant.premiumCategoryTwo
                                                          }
                                                        </span>
                                                      ) : null}
                                                      {applicant.premiumCategoryThree ? (
                                                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                          {
                                                            applicant.premiumCategoryThree
                                                          }
                                                        </span>
                                                      ) : null}
                                                    </>
                                                  ) : null}
                                                  <div className="mt-2">
                                                    <p>{applicant.bio}</p>
                                                  </div>
                                                  {applicant.hasUnreadMessage ||
                                                  applicant.channelID ? (
                                                    <>
                                                      {" "}
                                                      <button
                                                        class="w-auto  py-2 px-2 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500  "
                                                        onClick={() =>
                                                          navigateApplicantProfile(
                                                            applicant,
                                                            allJobs
                                                          )
                                                        }
                                                      >
                                                        See Profile
                                                      </button>
                                                      <button
                                                        class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                                        onClick={() =>
                                                          navigateToChannel(
                                                            applicant
                                                          )
                                                        }
                                                      >
                                                        See Messages
                                                        <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                                          New
                                                        </span>
                                                      </button>
                                                    </>
                                                  ) : (
                                                    <button
                                                      class="w-auto py-2 px-2 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500  "
                                                      onClick={() =>
                                                        navigateApplicantProfile(
                                                          applicant,
                                                          allJobs
                                                        )
                                                      }
                                                    >
                                                      See Profile
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            </>
                                          ))
                                        ) : (
                                          <p>No applicants yet</p>
                                        )}
                                      </div>
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2  absolute right-0 bottom-12">
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            // handleDelete(allJobs)
                                            setEditVisible(true)
                                          }
                                          class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-white border hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Edit Post
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            // handleDelete(allJobs)
                                            handleEditJob(allJobs)
                                          }
                                          class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-red-600 border hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Cancel Job
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>

                        {editVisible ? (
                          <EditSelectedJob props={allJobs} />
                        ) : null}

                        <Modal
                          isCentered
                          onClose={onCloseCancelConfirm}
                          isOpen={isOpenCancelConfirm}
                          motionPreset="slideInBottom"
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader></ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Text>
                                Are you sure you want to cancel{" "}
                                {allJobs.jobTitle}?
                              </Text>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() => handleDelete(allJobs)}
                              >
                                Continue
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </>
                    ) : null}
                  </>
                ))}

              {jobsInProgressMap !== null &&
                jobsInProgressMap.map((jobsInProgressMap) => (
                  //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                  <>
                    <AdvancedMarker
                      key={jobsInProgressMap.jobID}
                      position={{
                        lat: jobsInProgressMap.locationLat
                          ? jobsInProgressMap.locationLat
                          : 44.96797106363888,
                        lng: jobsInProgressMap.locationLng
                          ? jobsInProgressMap.locationLng
                          : -93.26177106829272,
                      }}
                      // onClick={() => handleToggleOpen(allJobs.jobID)}
                      onClick={() =>
                        handleToggleInProgressOpen(jobsInProgressMap)
                      }
                    >
                      {jobsInProgressMap.hasNewApplicant ? (
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
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

                          <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                            New
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <p>In Progress</p>
                        </button>
                      )}
                    </AdvancedMarker>
                    {openInfoWindowMarkerID === jobsInProgressMap.jobID ? (
                      hiredApplicant ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div class="py-3 px-4 flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleCloseInfoWindow()}
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
                                            {jobsInProgressMap.jobTitle}
                                            <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">In Progress</span>
                                          </label>
                                          <p>
                                            {jobsInProgressMap.city}, Minnesota
                                          </p>
                                          {jobsInProgressMap.isHourly ? (
                                            <p>
                                              ${jobsInProgressMap.lowerRate}
                                              /hr-$
                                              {jobsInProgressMap.upperRate}
                                              /hr
                                            </p>
                                          ) : (
                                            <p>${jobsInProgressMap.flatRate}</p>
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

                                        <p>{jobsInProgressMap.description}</p>
                                      </div>

                                      <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          You've hired:
                                        </label>
                                        {isLoading ? (
                                          <Center marginTop="32px">
                                            <Spinner
                                              thickness="4px"
                                              speed="0.65s"
                                              emptyColor="gray.200"
                                              color="#01A2E8"
                                              size="lg"
                                            />
                                          </Center>
                                        ) : (
                                          <>
                                            <div className="mt-2 ">
                                              {" "}
                                              <li className="flex justify-between gap-x-6 py-1 ">
                                                <div className="flex min-w-0 gap-x-4">
                                                  {hiredApplicant.profilePictureResponse ? (
                                                    <img
                                                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                                      src={
                                                        hiredApplicant.profilePictureResponse
                                                      }
                                                      alt=""
                                                    />
                                                  ) : ( <span class="inline-block size-[46px] bg-gray-100 rounded-full overflow-hidden">
                                                  <svg class="size-full text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                                                    <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                                                    <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                                                  </svg>
                                                </span>)}

                                                  <div className="min-w-0 flex-auto">
                                                    <p className="text-md font-semibold leading-6 text-gray-900">
                                                      {hiredApplicant.firstName}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500"></p>
                                                    {hiredApplicant.numberOfRatings ? (
                                                      <Flex>
                                                        {maxRating.map(
                                                          (item, key) => {
                                                            return (
                                                              <Box
                                                                activeopacity={
                                                                  0.7
                                                                }
                                                                key={item}
                                                                marginTop="5px"
                                                              >
                                                                <Image
                                                                  boxSize="16px"
                                                                  src={
                                                                    item <=
                                                                    hiredApplicant.rating
                                                                      ? star_filled
                                                                      : star_corner
                                                                  }
                                                                ></Image>
                                                              </Box>
                                                            );
                                                          }
                                                        )}
                                                        <p marginLeft="4px">
                                                          (
                                                          {
                                                            hiredApplicant.numberOfRatings
                                                          }{" "}
                                                          reviews)
                                                        </p>
                                                      </Flex>
                                                    ) : (
                                                      <p marginTop="2px">
                                                        No reviews yet!
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                  {hiredApplicant.isPremium ? (
                                                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-green-100 text-green-500 ">
                                                      Premium Contractor
                                                    </span>
                                                  ) : null}
                                                </div>
                                              </li>
                                              <div className="flex-column min-w-0 gap-x-4 mb-16">
                                                {hiredApplicant.isPremium ? (
                                                  <>
                                                    {hiredApplicant.premiumCategoryOne ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                                        {
                                                          hiredApplicant.premiumCategoryOne
                                                        }
                                                      </span>
                                                    ) : null}

                                                    {hiredApplicant.premiumCategoryTwo ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                        {
                                                          hiredApplicant.premiumCategoryTwo
                                                        }
                                                      </span>
                                                    ) : null}
                                                    {hiredApplicant.premiumCategoryThree ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                        {
                                                          hiredApplicant.premiumCategoryThree
                                                        }
                                                      </span>
                                                    ) : null}
                                                  </>
                                                ) : null}
                                                <div className="mt-2">
                                                  <p>{hiredApplicant.bio}</p>
                                                </div>
                                                {hiredApplicant.hasUnreadMessage ? (
                                                  <>
                                                    <button
                                                      class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                                      onClick={() =>
                                                        navigateToChannel(
                                                          jobsInProgressMap
                                                        )
                                                      }
                                                    >
                                                      See Messages
                                                      <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                                        New
                                                      </span>
                                                    </button>
                                                  </>
                                                ) : (
                                                  <button
                                                    class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                                    onClick={() =>
                                                      navigateToChannel(
                                                        jobsInProgressMap
                                                      )
                                                    }
                                                  >
                                                    See Messages
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2  absolute right-0 bottom-12">
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            // handleDelete(allJobs)
                                            confirmCancelModal(
                                              jobsInProgressMap
                                            )
                                          }
                                          class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-red-600 border hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Cancel Job
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>
                      ) : (
                        <Text>No applicant here goes spinner</Text>
                      )
                    ) : null}
                  </>
                ))}

              {jobsInReviewMap !== null &&
                jobsInReviewMap.map((jobsInReviewMap) => (
                  //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
                  <>
                    <AdvancedMarker
                      key={jobsInReviewMap.jobID}
                      position={{
                        lat: jobsInReviewMap.locationLat
                          ? jobsInReviewMap.locationLat
                          : 44.96797106363888,
                        lng: jobsInReviewMap.locationLng
                          ? jobsInReviewMap.locationLng
                          : -93.26177106829272,
                      }}
                      // onClick={() => handleToggleOpen(allJobs.jobID)}
                      onClick={() => handleToggleInReviewOpen(jobsInReviewMap)}
                    >
                      {/* <div>
                        <Button
                          colorScheme="green"
                          height="24px"
                          marginRight={5}
                        >
                          
                          <Text>Ready To Pay</Text>
                          <Badge
                            backgroundColor="#df4b4b"
                            textColor="white"
                            marginBottom="16px"
                            position="absolute"
                            right="-4"
                          >
                            Pay
                          </Badge>
                        </Button>
                      </div> */}

                      <button
                        type="button"
                        class="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <p>Ready To Pay</p>

                        <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                          New
                        </span>
                      </button>
                    </AdvancedMarker>
                    {openInfoWindowMarkerID === jobsInReviewMap.jobID ? (
                      hiredApplicant ? (
                        <Flex direction="row-reverse">
                          <div
                            class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
                            tabindex="-1"
                          >
                            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                              <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  <div class="py-3 px-4 flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleCloseInfoWindow()}
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
                                            {jobsInReviewMap.jobTitle}
                                            <span class=" ml-2 inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-green-100 text-green-500 ">
                                                     Ready To Pay
                                                    </span>
                                          </label>
                                          
                                          <p>
                                            {jobsInReviewMap.city}, Minnesota
                                          </p>
                                          {jobsInReviewMap.isHourly ? (
                                            <p>
                                              ${jobsInReviewMap.lowerRate}/hr-$
                                              {jobsInReviewMap.upperRate}
                                              /hr
                                            </p>
                                          ) : (
                                            <p>${jobsInReviewMap.flatRate}</p>
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

                                        <p>{jobsInReviewMap.description}</p>
                                      </div>

                                      <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          You've hired:
                                        </label>
                                        {isLoading ? (
                                          <Center marginTop="32px">
                                            <Spinner
                                              thickness="4px"
                                              speed="0.65s"
                                              emptyColor="gray.200"
                                              color="#01A2E8"
                                              size="lg"
                                            />
                                          </Center>
                                        ) : (
                                          <>
                                            <div className="mt-2  ">
                                              {" "}
                                              <li className="flex justify-between gap-x-6 py-1 ">
                                                <div className="flex min-w-0 gap-x-4">
                                                  {hiredApplicant.profilePictureResponse ? (
                                                    <img
                                                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                                      src={
                                                        hiredApplicant.profilePictureResponse
                                                      }
                                                      alt=""
                                                    />
                                                  ) : ( <span class="inline-block size-[46px] bg-gray-100 rounded-full overflow-hidden">
                                                  <svg class="size-full text-gray-300" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                                                    <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                                                    <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                                                  </svg>
                                                </span>)}

                                                  <div className="min-w-0 flex-auto">
                                                    <p className="text-md font-semibold leading-6 text-gray-900">
                                                      {hiredApplicant.firstName}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500"></p>
                                                    {hiredApplicant.numberOfRatings ? (
                                                      <Flex>
                                                        {maxRating.map(
                                                          (item, key) => {
                                                            return (
                                                              <Box
                                                                activeopacity={
                                                                  0.7
                                                                }
                                                                key={item}
                                                                marginTop="5px"
                                                              >
                                                                <Image
                                                                  boxSize="16px"
                                                                  src={
                                                                    item <=
                                                                    hiredApplicant.rating
                                                                      ? star_filled
                                                                      : star_corner
                                                                  }
                                                                ></Image>
                                                              </Box>
                                                            );
                                                          }
                                                        )}
                                                        <p marginLeft="4px">
                                                          (
                                                          {
                                                            hiredApplicant.numberOfRatings
                                                          }{" "}
                                                          reviews)
                                                        </p>
                                                      </Flex>
                                                    ) : (
                                                      <p marginTop="2px">
                                                        No reviews yet!
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>

                                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                  {hiredApplicant.isPremium ? (
                                                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-green-100 text-green-500 ">
                                                      Premium Contractor
                                                    </span>
                                                  ) : null}
                                                </div>
                                              </li>
                                              <div className="flex-column min-w-0 gap-x-4 mb-16">
                                                {hiredApplicant.isPremium ? (
                                                  <>
                                                    {hiredApplicant.premiumCategoryOne ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs rounded-md font-medium bg-blue-100 text-sky-500 ">
                                                        {
                                                          hiredApplicant.premiumCategoryOne
                                                        }
                                                      </span>
                                                    ) : null}

                                                    {hiredApplicant.premiumCategoryTwo ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                        {
                                                          hiredApplicant.premiumCategoryTwo
                                                        }
                                                      </span>
                                                    ) : null}
                                                    {hiredApplicant.premiumCategoryThree ? (
                                                      <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium rounded-md bg-blue-100 text-sky-500  m-1">
                                                        {
                                                          hiredApplicant.premiumCategoryThree
                                                        }
                                                      </span>
                                                    ) : null}
                                                  </>
                                                ) : null}
                                                <div className="mt-2">
                                                  <p>{hiredApplicant.bio}</p>
                                                </div>
                                                {hiredApplicant.hasUnreadMessage ? (
                                                  <>
                                                    <button
                                                      class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                                      onClick={() =>
                                                        navigateToChannel(
                                                          jobsInReviewMap
                                                        )
                                                      }
                                                    >
                                                      See Messages
                                                      <span class=" top-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2  bg-red-500 text-white">
                                                        New
                                                      </span>
                                                    </button>
                                                  </>
                                                ) : (
                                                  <button
                                                    class=" mr-2 w-auto py-2 px-0 float-right mb-6 mt-2 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-sky-400 hover:bg-white hover:text-sky-600  "
                                                    onClick={() =>
                                                      navigateToChannel(
                                                        jobsInReviewMap
                                                      )
                                                    }
                                                  >
                                                    See Messages
                                                  </button>
                                                )}
                                                <div class=" ml-8 w-3/4 flex justify-center items-center gap-x-2 absolute bottom-16">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      // handleDelete(allJobs)
                                                      handlePaymentsVisible(
                                                        jobsInReviewMap
                                                      )
                                                    }
                                                    class="py-2 px-3 inline-flex w-full  justify-center  items-center gap-x-2 text-start bg-sky-400 border hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                    data-hs-overlay="#hs-pro-datm"
                                                  >
                                                    Pay Now
                                                   
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Flex>
                      ) : (
                        <Text>No applicant here goes spinner</Text>
                      )
                    ) : null}
                  </>
                ))}
              {selectedJobForPayment ? (
                <EmbeddedPayments props={selectedJobForPayment} />
              ) : null}

              {firstVisitModalVisible ? <NewVisitModal /> : null}
            </Map>
          </Box>
        </APIProvider>
      </Flex>
    </div>
  );
};

export default NeederMapScreen;
