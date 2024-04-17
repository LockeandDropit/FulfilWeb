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
  Spinner
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

const NeederMapScreen = () => {
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
    setApplicant(null)
    setOpenInfoWindowMarkerID(x.jobID);
console.log("handle passed location", x.locationLat, x.locationLng )
    //center map on spot selected
    setSelectedLat(x.locationLat)
    setSelectedLng(x.locationLng)
setIsLoading(true)
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
           

            setIsLoading(false)
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
      setIsLoading(false)
      
    }, 1000)
  
  };



  useEffect(() => {
    if (selectedLat) {
      setTimeout(() => {
        setSelectedLat(null)
        setSelectedLng(null)
      }, 100)
    }
  }, [selectedLat])

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

  const [paymentsVisible, setPaymentsVisible] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState(null);

  const handlePaymentsVisible = (x) => {
    console.log("handle payments", x);
    setPaymentsVisible(true);
    setSelectedJobForPayment(x);
  };

  //handle canceling job
  const handleDelete = (x) => {
    console.log("cancel this one", x);
    setDoc(doc(db, "Canceled Jobs", x.jobID), {
      employerID: user.uid,
      doerID: x.hiredApplicant,
      jobTitle: x.jobTitle,
    })
      .then(() => {})
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(doc(db, "Map Jobs", user.uid, "Posted Jobs", x.jobTitle), {})
      .then(() => {
        //all good
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
  };

  const handleEdit = (x) => {
    navigate("/EditPostedJob", { state: { jobID: x.jobID, jobTitle: x.jobTitle, isHourly: x.isHourly }})
      };

const [isLoading, setIsLoading] = useState(false)
  //payment verification and data movement initially taken from EmbeddedPayments component

const handleCloseInfoWindow = () => {
  setOpenInfoWindowMarkerID(null)
  setApplicant(null)
}

  return (
    <div>
      <NeederHeader />
      <Flex marginTop="4">
        <NeederDashboard />

        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <div style={{ height: "90vh", width: "93vw" }}>
            <Map
           
            //   defaultCenter={{ lat: defaultLat, lng: defaultLong }}
              defaultCenter={{ lat: selectedLat ? selectedLat : defaultLat, lng: selectedLng ? selectedLng : defaultLong }}
              defaultZoom={12}
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
                        <div>
                          <Button
                            colorScheme="blue"
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
                            <Badge
                              backgroundColor="#df4b4b"
                              textColor="white"
                              marginBottom="16px"
                              position="absolute"
                              right="-4"
                            >
                              New
                            </Badge>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button
                            colorScheme="blue"
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
                      )}
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
                              <Button
                                backgroundColor="white"
                                _hover={{
                                  bg: "white",
                                }}
                                onClick={() => handleEdit(allJobs)}
                              >
                                <EditIcon />
                              </Button>
                              {/* <CloseButton position="absolute" right="2" size="lg" onClick={() => setOpenInfoWindowMarkerID(!openInfoWindowMarkerID)}>X</CloseButton> */}
                            </Flex>

                            <Heading size="sm" marginTop="2">
                              {allJobs.city}, MN
                            </Heading>
                            {allJobs.isHourly ? (
                              <Heading size="sm">
                                ${allJobs.lowerRate}/hr-${allJobs.upperRate}/hr
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
                            <Heading
                              size="md"
                              marginTop="24px"
                              marginBottom="16px"
                            >
                              Applicants
                            </Heading>
                            {isLoading ? (<Center  marginTop="32px">
           <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="#01A2E8"
                      size="lg"
                    
                    />
        </Center>) : applicant ? (
                              applicant.map((applicant) => (
                                <>
                                  {applicant.hasUnreadMessage ||
                                  applicant.channelID ? (
                                    <Card
                                      padding="3"
                                      marginTop="4px"
                                      boxShadow="md"
                                      key={applicant.id}
                                    >
                                      <Flex>
                                        <Avatar
                                          src={applicant.profilePictureResponse}
                                          bg="#01A2E8"
                                          size="md"
                                        />
                                        {/* <Box position="absolute" right="0" onClick={() => onOpen()}><CloseButton color='red.500'/></Box> */}
                                        <Flex
                                          direction="column"
                                          marginLeft="4px"
                                        >
                                          <Heading size="md">
                                            {" "}
                                            {applicant.firstName}{" "}
                                            {applicant.lastName}
                                          </Heading>
                                          {applicant.numberOfRatings ? (
                                            <Flex>
                                              {maxRating.map((item, key) => {
                                                return (
                                                  <Box
                                                    activeopacity={0.7}
                                                    key={item}
                                                    marginTop="5px"
                                                  >
                                                    <Image
                                                      boxSize="16px"
                                                      src={
                                                        item <= applicant.rating
                                                          ? star_filled
                                                          : star_corner
                                                      }
                                                    ></Image>
                                                  </Box>
                                                );
                                              })}
                                              <Text marginLeft="4px">
                                                ({applicant.numberOfRatings} reviews)
                                              </Text>
                                            </Flex>
                                          ) : (
                                            <Text marginTop="4px">
                                              No reviews yet!
                                            </Text>
                                          )}
                                        </Flex>
                                      </Flex>
                                      <Flex direction="column">
                                        {" "}
                                        <Heading
                                          size="sm"
                                          marginTop="2px"
                                          marginBottom="2px"
                                        >
                                          About
                                        </Heading>
                                        <Text
                                          noOfLines={[1, 2]}
                                          marginBottom="32px"
                                        >
                                          {applicant.bio}
                                        </Text>
                                        {applicant.hasUnreadMessage ? (
                                          <Button
                                            backgroundColor="#01A2E8"
                                            textColor="white"
                                            _hover={{
                                              bg: "#018ecb",
                                              textColor: "white",
                                            }}
                                            position="absolute"
                                            right="0"
                                            bottom="2"
                                            height="32px"
                                            onClick={() =>
                                              navigateToChannel(applicant)
                                            }
                                          >
                                            See Messages
                                            <Badge
                                              backgroundColor="#df4b4b"
                                              textColor="white"
                                              marginBottom="24px"
                                              position="absolute"
                                              right="-2"
                                            >
                                              New
                                            </Badge>
                                          </Button>
                                        ) : (
                                          <Button
                                            backgroundColor="#01A2E8"
                                            textColor="white"
                                            _hover={{
                                              bg: "#018ecb",
                                              textColor: "white",
                                            }}
                                            position="absolute"
                                            right="0"
                                            bottom="2"
                                            height="32px"
                                            onClick={() =>
                                              navigateToChannel(applicant)
                                            }
                                          >
                                            See Messages
                                          </Button>
                                        )}
                                      </Flex>
                                    </Card>
                                  ) : (
                                    <Card
                                      padding="3"
                                      marginTop="4px"
                                      boxShadow="md"
                                      key={applicant.id}
                                    >
                                      <Flex>
                                        <Avatar
                                          // src="https://bit.ly/broken-link"
                                          src={applicant.profilePictureResponse}
                                          bg="#01A2E8"
                                          size="md"
                                        />
                                        {/* <Box position="absolute" right="0" onClick={() => onOpen()}><CloseButton color='red.500'/></Box> */}
                                        <Flex
                                          direction="column"
                                          marginLeft="8px"
                                        >
                                          <Heading size="md">
                                            {" "}
                                            {applicant.firstName}{" "}
                                            {applicant.lastName}
                                          </Heading>
                                          {applicant.numberOfRatings ? (
                                            <Flex>
                                              {maxRating.map((item, key) => {
                                                return (
                                                  <Box
                                                    activeopacity={0.7}
                                                    key={item}
                                                    marginTop="5px"
                                                  >
                                                    <Image
                                                      boxSize="16px"
                                                      src={
                                                        item <= applicant.rating
                                                          ? star_filled
                                                          : star_corner
                                                      }
                                                    ></Image>
                                                  </Box>
                                                );
                                              })}
                                              <Text marginLeft="4px">
                                                ({applicant.numberOfRatings} reviews)
                                              </Text>
                                            </Flex>
                                          ) : (
                                            <Text marginTop="4px">
                                              No reviews yet!
                                            </Text>
                                          )}
                                        </Flex>
                                      </Flex>
                                      <Flex direction="column">
                                        {" "}
                                        <Heading
                                          size="sm"
                                          marginTop="2px"
                                          marginBottom="2px"
                                        >
                                          About
                                        </Heading>
                                        <Text
                                          noOfLines={[1, 2]}
                                          marginBottom="24px"
                                        >
                                          {applicant.bio}
                                        </Text>
                                        <Button
                                          backgroundColor="white"
                                          _hover={{
                                            bg: "#01A2E8",
                                            textColor: "white",
                                          }}
                                          position="absolute"
                                          right="0"
                                          bottom="0"
                                          height="32px"
                                          onClick={() =>
                                            navigateApplicantProfile(
                                              applicant,
                                              allJobs
                                            )
                                          }
                                        >
                                          See more
                                        </Button>
                                      </Flex>
                                    </Card>
                                  )}
                                    <Button
                                position="absolute"
                                bottom="8"
                                  colorScheme="white"
                                  textColor="red"
                                  borderWidth="1px"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() =>
                                    handleDelete(allJobs)
                                  }
                                >
                                  Cancel Job
                                </Button>
                                </>
                              ))
                              
                            ) : (
                              <CardFooter
                                flexDirection="column"
                                marginTop="4px"
                              >
                                <Text
                                  alignContent="center"
                                  justifyContent="center"
                                  textAlign="center"
                                  size="md"
                                >
                                  No applicants yet
                                </Text>

                                <Button
                                position="absolute"
                                bottom="8"
                                  colorScheme="white"
                                  textColor="red"
                                  borderWidth="1px"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() =>
                                    handleDelete(allJobs)
                                  }
                                >
                                  Cancel Job
                                </Button>
                              </CardFooter>
                            )}
                          </CardBody>
                        </Card>
                      </Flex>
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
                        <div>
                          <Button
                            colorScheme="green"
                            height="24px"
                            marginRight={5}
                          >
                            {jobsInProgressMap.isVolunteer ? (
                              <Text>Volunteer!</Text>
                            ) : jobsInProgressMap.isFlatRate ? (
                              <Text>${jobsInProgressMap.flatRate}</Text>
                            ) : (
                              <Text>
                                ${jobsInProgressMap.lowerRate} - $
                                {jobsInProgressMap.upperRate}/hr
                              </Text>
                            )}
                            <Badge
                              backgroundColor="#df4b4b"
                              textColor="white"
                              marginBottom="16px"
                              position="absolute"
                              right="-4"
                            >
                              New
                            </Badge>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Button
                            colorScheme="green"
                            height="24px"
                            marginRight={5}
                          >
                            {/* {jobsInProgressMap.isVolunteer ? (
                              <Text>Volunteer!</Text>
                            ) : jobsInProgressMap.isHourly ? (
                              <Text>${jobsInProgressMap.confirmedRate}/hr</Text>
                            ) : (
                              <Text>
                               ${jobsInProgressMap.confirmedRate}
                              </Text>
                            )} */}
                            <Text>In Progress</Text>
                          </Button>
                        </div>
                      )}
                    </AdvancedMarker>
                    {openInfoWindowMarkerID === jobsInProgressMap.jobID ? (
                      hiredApplicant ? (
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
                                  {jobsInProgressMap.jobTitle}
                                </Heading>
                                {/* <CloseButton position="absolute" right="2" size="lg" onClick={() => setOpenInfoWindowMarkerID(!openInfoWindowMarkerID)}>X</CloseButton> */}
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {jobsInProgressMap.city}, MN
                              </Heading>
                              {jobsInProgressMap.isHourly ? (
                                <Heading size="sm">
                                  ${jobsInProgressMap.confirmedRate}/hr
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${jobsInProgressMap.confirmedRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{jobsInProgressMap.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {jobsInProgressMap.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgressMap.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {jobsInProgressMap.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgressMap.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {jobsInProgressMap.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInProgressMap.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {jobsInProgressMap.niceToHave ? (
                                <Text>{jobsInProgressMap.niceToHave}</Text>
                              ) : (
                                <Text>Nothing listed</Text>
                              )}
                              <Divider />
                              <Heading
                                size="md"
                                marginTop="24px"
                                marginBottom="16px"
                              >
                                You've Hired:
                              </Heading>

                              <>
                                <Card
                                  padding="3"
                                  marginTop="4px"
                                  boxShadow="md"
                                  key={hiredApplicant.id}
                                >
                                  <Flex>
                                    <Avatar
                                      src={hiredApplicant.profilePictureResponse}
                                      bg="#01A2E8"
                                      size="md"
                                    />
                                    {/* <Box position="absolute" right="0" onClick={() => onOpen()}><CloseButton color='red.500'/></Box> */}
                                    <Flex direction="column" marginLeft="4px">
                                      <Heading size="md">
                                        {" "}
                                        {hiredApplicant.firstName}{" "}
                                        {hiredApplicant.lastName}
                                      </Heading>
                                      {hiredApplicant.numberOfRatings ? (
                                        <Flex>
                                          {maxRating.map((item, key) => {
                                            return (
                                              <Box
                                                activeopacity={0.7}
                                                key={item}
                                                marginTop="5px"
                                              >
                                                <Image
                                                  boxSize="16px"
                                                  src={
                                                    item <= hiredApplicant.rating
                                                      ? star_filled
                                                      : star_corner
                                                  }
                                                ></Image>
                                              </Box>
                                            );
                                          })}
                                          <Text marginLeft="4px">
                                            ({hiredApplicant.numberOfRatings} reviews)
                                          </Text>
                                        </Flex>
                                      ) : (
                                        <Text marginTop="4px">
                                          No reviews yet!
                                        </Text>
                                      )}
                                    </Flex>
                                  </Flex>
                                  <Flex direction="column">
                                    {" "}
                                    <Heading
                                      size="sm"
                                      marginTop="2px"
                                      marginBottom="2px"
                                    >
                                      About
                                    </Heading>
                                    <Text
                                      noOfLines={[1, 2]}
                                      marginBottom="24px"
                                    >
                                      {hiredApplicant.bio}
                                    </Text>
                                    {/* <Button
                                    backgroundColor="white"
                                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                                    position="absolute"
                                    right="0"
                                    bottom="0"
                                    height="32px"
                                    onClick={() => navigateApplicantProfile(hiredApplicant, jobsInProgressMap)}
                                  >
                                    See more
                                  </Button> */}
                                  </Flex>
                                </Card>
                                <Modal
                                  isCentered
                                  onClose={onClose}
                                  isOpen={isOpen}
                                  motionPreset="slideInBottom"
                                >
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader>Success!</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <Text>This job was cancelled.</Text>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Continue
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </>

                              <CardFooter
                                flexDirection="column"
                                marginTop="16px"
                              >
                                <Button
                                  backgroundColor="#01A2E8"
                                  _hover={{ bg: "#018ecb", textColor: "white" }}
                                  textColor="white"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() =>
                                    navigateToChannel(jobsInProgressMap)
                                  }
                                >
                                  See Messages
                                </Button>{" "}
                                <Button
                                  colorScheme="white"
                                  textColor="red"
                                  borderWidth="1px"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() =>
                                    handleDelete(jobsInProgressMap)
                                  }
                                >
                                  Cancel Job
                                </Button>
                              </CardFooter>
                            </CardBody>
                          </Card>
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
                      <div>
                        <Button
                          colorScheme="green"
                          height="24px"
                          marginRight={5}
                        >
                          {/* {jobsInProgressMap.isVolunteer ? (
                              <Text>Volunteer!</Text>
                            ) : jobsInProgressMap.isHourly ? (
                              <Text>${jobsInProgressMap.confirmedRate}/hr</Text>
                            ) : (
                              <Text>
                               ${jobsInProgressMap.confirmedRate}
                              </Text>
                            )} */}
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
                      </div>
                    </AdvancedMarker>
                    {openInfoWindowMarkerID === jobsInReviewMap.jobID ? (
                      hiredApplicant ? (
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
                                  {jobsInReviewMap.jobTitle}
                                </Heading>
                                {/* <CloseButton position="absolute" right="2" size="lg" onClick={() => setOpenInfoWindowMarkerID(!openInfoWindowMarkerID)}>X</CloseButton> */}
                              </Flex>

                              <Heading size="sm" marginTop="2">
                                {jobsInReviewMap.city}, MN
                              </Heading>
                              {jobsInReviewMap.isHourly ? (
                                <Heading size="sm">
                                  ${jobsInReviewMap.confirmedRate}/hr
                                </Heading>
                              ) : (
                                <Heading size="sm">
                                  ${jobsInReviewMap.confirmedRate}
                                </Heading>
                              )}

                              <Heading size="sm" marginTop="2">
                                Description
                              </Heading>
                              <Text>{jobsInReviewMap.description}</Text>
                              <Heading size="sm" marginTop="2">
                                Requirements
                              </Heading>
                              {jobsInReviewMap.requirements ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReviewMap.requirements}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : (
                                <Text>No requirements listed</Text>
                              )}

                              {jobsInReviewMap.requirements2 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReviewMap.requirements2}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              {jobsInReviewMap.requirements3 ? (
                                <Flex direction="row">
                                  {" "}
                                  <Text fontSize="14">{"\u25CF"} </Text>
                                  <Text marginLeft="1">
                                    {jobsInReviewMap.requirements3}{" "}
                                  </Text>{" "}
                                </Flex>
                              ) : null}
                              <Heading size="sm" marginTop="2">
                                Additional Notes
                              </Heading>
                              {jobsInReviewMap.niceToHave ? (
                                <Text>{jobsInReviewMap.niceToHave}</Text>
                              ) : (
                                <Text>Nothing listed</Text>
                              )}
                              <Divider />
                              <Heading
                                size="md"
                                marginTop="24px"
                                marginBottom="16px"
                              >
                                You've Hired:
                              </Heading>

                              <>
                                <Card
                                  padding="3"
                                  marginTop="4px"
                                  boxShadow="md"
                                  key={hiredApplicant.id}
                                >
                                  <Flex>
                                    <Avatar
                                      src={hiredApplicant.profilePictureResponse}
                                      bg="#01A2E8"
                                      size="md"
                                    />
                                    {/* <Box position="absolute" right="0" onClick={() => onOpen()}><CloseButton color='red.500'/></Box> */}
                                    <Flex direction="column" marginLeft="4px">
                                      <Heading size="md">
                                        {" "}
                                        {hiredApplicant.firstName}{" "}
                                        {hiredApplicant.lastName}
                                      </Heading>
                                      {hiredApplicant.numberOfRatings ? (
                                        <Flex>
                                          {maxRating.map((item, key) => {
                                            return (
                                              <Box
                                                activeopacity={0.7}
                                                key={item}
                                                marginTop="5px"
                                              >
                                                <Image
                                                  boxSize="16px"
                                                  src={
                                                    item <= hiredApplicant.rating
                                                      ? star_filled
                                                      : star_corner
                                                  }
                                                ></Image>
                                              </Box>
                                            );
                                          })}
                                          <Text marginLeft="4px">
                                            ({hiredApplicant.numberOfRatings} reviews)
                                          </Text>
                                        </Flex>
                                      ) : (
                                        <Text marginTop="4px">
                                          No reviews yet!
                                        </Text>
                                      )}
                                    </Flex>
                                  </Flex>
                                  <Flex direction="column">
                                    {" "}
                                    <Heading
                                      size="sm"
                                      marginTop="2px"
                                      marginBottom="2px"
                                    >
                                      About
                                    </Heading>
                                    <Text
                                      noOfLines={[1, 2]}
                                      marginBottom="24px"
                                    >
                                      {hiredApplicant.bio}
                                    </Text>
                                    {/* <Button
                                    backgroundColor="white"
                                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                                    position="absolute"
                                    right="0"
                                    bottom="0"
                                    height="32px"
                                    onClick={() => navigateApplicantProfile(hiredApplicant, jobsInProgressMap)}
                                  >
                                    See more
                                  </Button> */}
                                  </Flex>
                                </Card>
                                <Modal
                                  isCentered
                                  onClose={onClose}
                                  isOpen={isOpen}
                                  motionPreset="slideInBottom"
                                >
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader>
                                      {allJobs.jobTitle}
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <Text>{hiredApplicant.firstName}</Text>
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                      <Button variant="ghost">
                                        Secondary Action
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </>

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
                                  onClick={() =>
                                    handlePaymentsVisible(jobsInReviewMap)
                                  }
                                >
                                  Pay now
                                </Button>{" "}
                                {jobsInReviewMap.hasUnreadMessage ? (
                                  <Button
                                    backgroundColor="white"
                                    textColor="#01A2E8"
                                    width="320px"
                                    marginTop="8px"
                                    onClick={() =>
                                      navigateToChannel(jobsInReviewMap)
                                    }
                                  >
                                    See Messages
                                    <Badge
                                      backgroundColor="#df4b4b"
                                      textColor="white"
                                      marginBottom="24px"
                                      position="absolute"
                                      right="20"
                                    >
                                      New
                                    </Badge>
                                  </Button>
                                ) : (
                                  <Button
                                    backgroundColor="white"
                                    textColor="#01A2E8"
                                    width="320px"
                                    marginTop="8px"
                                    onClick={() =>
                                      navigateToChannel(jobsInReviewMap)
                                    }
                                  >
                                    See Messages
                                  </Button>
                                )}
                              </CardFooter>
                            </CardBody>
                          </Card>
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
            </Map>
          </div>
        </APIProvider>
      </Flex>
    </div>
  );
};

export default NeederMapScreen;
