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
  Image
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
import NeederDashboard from "./NeederDashboard";
import { Select } from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";



const NeederMapScreen = () => {
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

  const [applicant, setApplicant] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState(null);

  const handleToggleOpen = (x) => {
    console.log("handle toggle open", x);
    setOpenInfoWindowMarkerID(x.jobID);

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
      snapshot.docs.forEach((doc) => {
        if (doc.id.length > 25) {
          results.push(doc.id);
          console.log("here?", doc.id);
        } else {
        }
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
            finalResults.push({ ...snapshot.data() });
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
            setApplicant([finalResults]);
            console.log("this is your applicant(s)", finalResults);
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
            }
          });
        });
      });
    });


  };

  console.log(rating)

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

  return (
    <div>
      <NeederHeader />
      <Flex marginTop="4">
        <NeederDashboard />

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
                      {allJobs.hasNewApplicant ? (
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

                            {applicant ? (
                              applicant.map((applicant) => (
                                <>
                                  <Heading
                                    size="md"
                                    marginTop="16px"
                                    marginBottom="16px"
                                  >
                                    Applicants 
                                  </Heading>
                                  <Card padding="2" >
                                   <Flex>
                                    <Avatar
                                      src="https://bit.ly/broken-link"
                                      bg="#01A2E8"
                                      size="md"
                                    />
                                    <Flex direction="column" marginLeft="4px">
                                      <Heading size="md">
                                        {" "}
                                        {applicant.firstName}{" "}
                                        {applicant.lastName}
                                      </Heading>
                                      <Flex>
                {maxRating.map((item, key) => {
                  return (
                    <Box activeopacity={0.7} key={item} marginTop="4px">
                      <Image
                        boxSize="18px"
                        src={item <= rating ? star_filled : star_corner}
                      ></Image>
                    </Box>
                  );
                })}
              </Flex>
                                    </Flex>
                                    </Flex>
                                    <Flex direction="column">
                                      {" "}
                                      <Heading size="sm" marginTop="2px" marginBottom="2px">About</Heading>
                                      <Text noOfLines={[1,2]} marginBottom="24px">{applicant.bio}</Text>
                                      <Button
                                        backgroundColor="white"
                                        position="absolute"
                                        right="0"
                                        bottom="0"
                                        height="32px"
                                      >
                                        See more
                                      </Button>
                                    </Flex>
                                  </Card>{" "}
                                </>
                              ))
                            ) : (
                              <CardFooter
                                flexDirection="column"
                                marginTop="16px"
                              >
                                <Button
                                  backgroundColor="#01A2E8"
                                  textColor="white"
                                  width="320px"
                                  marginTop="8px"
                                  onClick={() => viewApplicants(allJobs)}
                                >
                                  View Applicants
                                </Button>{" "}
                                <Button
                                  colorScheme="white"
                                  textColor="#01A2E8"
                                  borderColor="#01A2E8"
                                  borderWidth="1px"
                                  width="320px"
                                  marginTop="8px"
                                  // onClick={() => saveJob()}
                                >
                                  Edit
                                </Button>
                              </CardFooter>
                            )}
                          </CardBody>
                        </Card>
                      </Flex>
                    ) : null}
                  </>
                ))}
            </Map>
          </div>
        </APIProvider>
      </Flex>
    </div>
  );
};

export default NeederMapScreen;
