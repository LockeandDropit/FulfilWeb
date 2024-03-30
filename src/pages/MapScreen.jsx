import React from "react";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import Header from "../components/Header";
import { Input, Button, Text, Box } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Stack, } from "@chakra-ui/react";
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

const MapScreen = () => {
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
  };

  return (
    <div>
      <Header />

      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <div style={{ height: "100vh" }}>
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
                //   width="24%"
                boxShadow="lg"
                flexDirection="row"
              >
                <CardBody>
                  <FormControl>
                    <Input
                      type="Zip Code"
                      value={input}
                      onChange={handleInputChange}
                      width="360px"
                      placeholder="Enter your zip code"
                    />
                    {/* {!isError ? (
                null
              ) : (
                <FormErrorMessage>Please enter valid zip code</FormErrorMessage>
              )} */}
                  </FormControl>
                </CardBody>
                <Button colorScheme="blue" width="240px" marginRight={5}>
                  Search
                </Button>
              </Card>
            </Center>

            {allJobs !== null &&
              allJobs.map((allJobs) => (
                //credit https://www.youtube.com/watch?v=PfZ4oLftItk&list=PL2rFahu9sLJ2QuJaKKYDaJp0YqjFCDCtN
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
                        <Text>${allJobs.flatRate}</Text>
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
                    >
                     <Card maxW='sm'>
  <CardBody>
    <Stack  spacing='3'>
      <Heading size='md'>{allJobs.jobTitle}</Heading>
      <Flex >
      {allJobs.isOneTime ? (
                            <Text >
                              One time {"\u25CF"}{" "}
                            </Text>
                          ) : (
                            <Text >
                              Recurring {"\u25CF"}{" "}
                            </Text>
                          )}
                          {allJobs.isVolunteer ? (
                            <Text>
                              Volunteer Position
                            </Text>
                          ) : allJobs.isFlatRate ? (
                            <Text marginLeft="4px">
                              ${allJobs.flatRate}
                            </Text>
                          ) : (
                            <Text marginLeft="4px" >
                              ${allJobs.lowerRate} - ${allJobs.upperRate}
                              /hr
                            </Text>
                          )}
                          </Flex>
      <Text>
        {allJobs.description}
      </Text>
      
    </Stack>
  </CardBody>
  <Divider />
<Box marginTop="8px" >
  <Center>
      <Button variant='ghost' colorScheme='blue' outline="blue" width="146px"  onClick={() => navigate(`/Login`)}>
        Save
      </Button>
      <Button variant='solid' colorScheme='blue' marginLeft="32px" width="146px"  onClick={() => navigate(`/Login`)}>
        Apply Now
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
        </div>
      </APIProvider>
    </div>
  );
};

export default MapScreen;
