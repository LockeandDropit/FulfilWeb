import React from "react";
import DoerHeader from "../DoerHeader";
import DoerDashboard from "../DoerDashboard";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Text, Box, Container } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import InProgressCard from "../Jobs/InProgressCard";



import { StreamChat } from "stream-chat";
import CompletedJobCard from "../Jobs/CompletedJobCard";




const DoerCompletedList = () => {
  // const [user, setUser] = useState(null);
  const [userIDStreamChat, setUserIDStreamChat] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState();

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    // setUser(currentUser);
    setUserIDStreamChat(currentUser.uid);
    console.log(currentUser.uid);
  });



  // credit y scroll claire lin https://stackoverflow.com/questions/54837266/scrollview-like-component-in-react-js
  return (
    <>
      <DoerHeader />
      <Box paddingTop="4"  paddingRight="72" height="90vh">
      <Flex>
        <DoerDashboard />

        <Box
          width="67vw"
          // alignContent="center"
          // justifyContent="center"
          // display="flex"
          // alignItems="baseline"
          
          borderColor="#e4e4e4"
          backgroundColor="white"
          
          height="800px"
          boxShadow="sm"
          rounded="md"
          padding="4"
          overflowY="scroll"
          marginLeft="48"
          marginRight="16"
        >
          <Heading size="lg" marginLeft="6px">Completed</Heading>
          {/* <Center flexDirection="column"> */}
          <CompletedJobCard />
          {/* </Center> */}
         
        </Box>
      </Flex>
      </Box>
    </>
  );
};

export default DoerCompletedList;
