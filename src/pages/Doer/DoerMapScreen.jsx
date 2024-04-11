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
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import DoerDashboard from "./DoerDashboard";
import { Select } from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";

const DoerMapScreen = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const navigate = useNavigate();

  const [hasRun, setHasRun] = useState(false);

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
    // should this be done on log ina nd stored in redux store so it's cheaper?
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        results.push({ ...doc.data(), id: doc.id });
      });
      console.log(results);
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
        console.log(results);
        setAppliedJobs(results);
      });
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
    getData(x);
  };

  const handleToggleAppliedOpen = (x) => {
    console.log("handle toggle open Applied", x.jobID);
    setOpenInfoWindowMarkerID(x.jobID);
    getData(x.jobID);
  };

  useEffect(() => {
    console.log("window id", openInfoWindowMarkerID);
  }, [openInfoWindowMarkerID]);

  useEffect(() => {
    if (appliedJobs.length !== 0 && postedJobs.length !== 0) {
      appliedJobs.forEach((appliedJob) => {
        postedJobs.forEach((postedJob) => {
          if (appliedJob.jobID === postedJob.jobID) {
            console.log("match", postedJob.jobID);

            //credit user1438038 & Niet the Dark Absol https://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property
           
           
            // for (var i = postedJobs.length - 1; i >= 0; --i) {
            //   if (postedJobs[i].jobID == postedJob.jobID) {
            //     postedJobs.splice(i, 1);
            //     console.log("did it")
            //   }
            // }

            for (var i = allJobs.length - 1; i >= 0; --i) {
              if (allJobs[i].jobID == postedJob.jobID) {
                allJobs.splice(i, 1);
                console.log("did it all")
              }
            }
          } else {
            console.log("no luck");
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

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setIsOnboarded(snapshot.data().isOnboarded);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          console.log(error);
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

          console.log("Application submitted");
          // navigation.navigate("BottomUserTab");
        })
        .catch((error) => {
          //uh oh
          console.log(error);
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
          console.log(error);
        });
    } else {
      alert("Please finish onboarding before applying");
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
      console.log("this is the selected job", snapshot.data());
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
        console.log("submitted to users saved Jobs");
        // navigation.navigate("BottomUserTab");
        alert("Job Saved");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
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
          }
        });

        if (secondResults.length === 0) {
          alert("sorry! No jobs currently available in that category");
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  return (
    <div>
      <DoerHeader />
      <Flex marginTop="4">
        <DoerDashboard />
        {process.env.REACT_APP_GOOGLE_API_KEY ? (
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <div style={{ height: "90vh", width: "93vw" }}>
              <Map
                defaultCenter={{ lat: defaultLat, lng: defaultLong }}
                defaultZoom={12}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                //move to env
                mapId="6cc03a62d60ca935"
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
                                  {allJobs.jobTitle} (all Jobs Card)
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
                              >
                                <Button
                                  backgroundColor="#01A2E8"
                                  textColor="white"
                                  width="320px"
                                  marginTop="8px"
                                  // onClick={() => applyAndNavigate()}
                                >
                                  already applied
                                </Button>{" "}
                              </CardFooter>
                            </CardBody>
                          </Card>
                        </Flex>
                      ) : null}
                    </>
                  ))}
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
