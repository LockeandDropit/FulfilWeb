import React from "react";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Header from "./Header";
import { Input, Button, Text, Box } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  CloseButton,
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
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  collectionGroup,
  getDocs,
  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LandingNeederMapScreen = () => {
  const [user, setUser] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const navigate = useNavigate();

  //Pulls in Posted Job info from DB.. initial rendering
  useEffect(() => {
    // should this be done on log ina nd stored in redux store so it's cheaper?
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
          results.push({ ...doc.data(), id: doc.id });
        }
      });
     

      setPostedJobs(results);
    });
    // } else {
    //   console.log("oops!");
    // }
  }, []);

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
          alert("sorry! No jobs currently available in that category");
        } else {
          setPostedJobs(secondResults);
        }
      });
    }
  };

  return (
    <div>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <Box h={{base: "50vh", lg: "70vh"}} w={{base: "90vw", lg: "50vw"}}>
          <Map
            defaultCenter={{ lat: 44.89929301068098, lng: -93.3413753387615}}
            defaultZoom={12}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            //move to env
            mapId="6cc03a62d60ca935"
            onClick={() => setOpenInfoWindowMarkerID(null)}
          >
            {allJobs !== null &&
              allJobs.map((allJobs) => (
                //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN

                <AdvancedMarker
                  key={allJobs.jobID}
                  position={{
                    lat: allJobs.locationLat
                      ? allJobs.locationLat
                      : 44.89929301068098,
                    lng: allJobs.locationLng
                      ? allJobs.locationLng
                      : -93.3413753387615,
                  }}
                  onClick={() => handleToggleOpen(allJobs.jobID)}
                >
                  <div
                  // style={{

                  //   backgroundColor: "#01A2E8",
                  //   padding: 5,
                  //   width: 80,
                  //   borderRadius: 12,
                  //   alignContent: "center",
                  //   alignText: "center",
                  //   justifyContent: "center"
                  //   // borderWidth: "10px"
                  // }}
                  >
                    <Button colorScheme="blue" height="24px" marginRight={5}>
                      {allJobs.isVolunteer ? (
                        <Text>Volunteer!</Text>
                      ) : allJobs.isFlatRate ? (
                        <Text>Your Job Here!</Text>
                      ) : (
                        <Text>
                          ${allJobs.lowerRate} - ${allJobs.upperRate}/hr
                        </Text>
                      )}
                    </Button>
                  </div>
                  /
                  {openInfoWindowMarkerID === allJobs.id ? (
                    <InfoWindow
                      key={openInfoWindowMarkerID}
                      position={{
                        lat: allJobs.locationLat
                          ? allJobs.locationLat
                          : 44.96797106363888,
                        lng: allJobs.locationLng
                          ? allJobs.locationLng
                          : -93.26177106829272,
                      }}
                      onCloseClick={() => setOpenInfoWindowMarkerID(null)}
                    >


                      <Card >
                        <CardBody>
                          <Stack>
                            <Heading size="md">{allJobs.jobTitle}</Heading>
                            <Flex>
                            
                              <Heading size="sm">Set Your Budget</Heading>
                            </Flex>
                            <Text fontSize="md">{allJobs.description}</Text>
                          </Stack>
                        </CardBody>

                        <Box marginTop="4px">
                          <Center>
                            <Button
                              bg="#01A2E8"
                              color={'white'}
                              _hover={{
                                bg: 'blue.500',
                              }}
                              width="240px"
                              onClick={() => navigate(`/NeederEmailRegister`)}
                            >
                              Post My Job
                            </Button>
                          </Center>
                        </Box>
                      </Card>
                    </InfoWindow>
                  ) : null}
                  {/* {openInfoWindowMarkerID === allJobs.id ? ( <Card
                align="center"
                border="1px"
                borderColor="gray.400"
                borderWidth="1.5px"
                //   width="24%"
                boxShadow="lg"
                flexDirection="row"
              >
                <CardBody
                height="400">
                  
                </CardBody>
                <Button colorScheme="blue" width="240px" marginRight={5}>
                  Search
                </Button>
              </Card>) : null} */}
                </AdvancedMarker>
              ))}
          </Map>
        </Box>
      </APIProvider>
    </div>
  );
};

export default LandingNeederMapScreen;
