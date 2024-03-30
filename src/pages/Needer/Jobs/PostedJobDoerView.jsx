import React from 'react'
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../../firebaseConfig"
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";
import { Input, Button, Text, Box, Container } from "@chakra-ui/react";
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
import { useLocation } from 'react-router-dom';

const PostedJobDoerView = ( props ) => {
    
const {state} = useLocation()

const { jobID } = state

console.log("here it is",jobID)
    // const jobID = props.route.params.props;


    const [currentJob, setCurrentJob] = useState(null);
    const [user, setUser] = useState();
    const [userID, setUserID] = useState();
    const [requirements, setRequirements] = useState(null);
    const [requirements2, setRequirements2] = useState(null);
    const [requirements3, setRequirements3] = useState(null);
    const [niceToHave, setNiceToHave] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [hourlyRate, setHourlyRate] = useState(null);
    const [streetAddress, setStreetAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [jobState, setJobState] = useState(null);
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
    const [employerFirstName, setEmployerFirstName] = useState(null)
    const [flatRate, setFlatRate] = useState(null)


    useEffect(() => {
        
          const docRef = doc(db, "Map Jobs", jobID);
    
          getDoc(docRef).then((snapshot) => {
            console.log(snapshot.data());
            setFlatRate(snapshot.data().flatRate)
            setJobTitle(snapshot.data().jobTitle);
            setLowerRate(snapshot.data().lowerRate);
            setUpperRate(snapshot.data().upperRate);
            setCity(snapshot.data().city);
            setEmployerID(snapshot.data().employerID);
            setEmployerFirstName(snapshot.data().firstName)
            setZipCode(snapshot.data().zipCode);
            setDescription(snapshot.data().description);
            setCurrentJob(snapshot.data());
            // setEmployerFirstName(snapshot.data().firstName)
            setJobState(snapshot.data().state);
            setBusinessName(snapshot.data().businessName);
            setStreetAddress(snapshot.data().streetAddress);
            setRequirements(snapshot.data().requirements);
            setBusinessName(snapshot.data().businessName);
            setNiceToHave(snapshot.data().niceToHave);
            setRequirements2(snapshot.data().requirements2);
            setRequirements3(snapshot.data().requirements3);
          });
       
          console.log("oops!");
      
      }, []);

  return (
    <>
  <NeederHeader />
  <Flex>
        <NeederDashboard />
  <Box
          width="1200px"
        //   borderWidth="1px"
        //   borderColor="red"
          alignContent="center"
          justifyContent="center"
          // display="flex"
          alignItems="baseline"
        //   backgroundColor="#E3E3E3"
          padding="8"
        >
            
          {/* <Center flexDirection="column"> */}
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              width="66vw"
              borderWidth="2px"
              borderColor="#E3E3E3"
              height="800px"
              boxShadow="lg"
              rounded='lg'
              borderLeftWidth="4px"
          borderRightWidth="4px"
            //   marginTop="16px"
            >
              <Stack>
                <CardBody padding="8">
                  <Heading size="lg">Job Title</Heading>
                  <Heading size="md" marginTop="2">Employer Name</Heading>
                  <Heading size="md" >City, MN {"\u25CF"}{" "} $$$</Heading>
                  <Heading size="md" marginTop="4">Description</Heading>
                  <Text py="2">
                    Caffè latte is a coffee beverage of Italian origin made with
                    espresso and steamed milk.
                  </Text>
                  <Heading size="md">Requirements</Heading>
                  <Text marginTop="2">{"\u25CF"}{" "}The perfect latte</Text>
                  <Text marginTop="2">{"\u25CF"}{" "}The perfect latte</Text>
                  <Text marginTop="2">{"\u25CF"}{" "}The perfect latte</Text>
                  <Heading size="md"marginTop="4">Nice To Have</Heading>
                  <Text marginTop="2">Description ofd things that are nice to have</Text>

                </CardBody>
              </Stack>
            </Card>
          {/* </Center> */}
        </Box>
      </Flex>
    </>)
}

export default PostedJobDoerView