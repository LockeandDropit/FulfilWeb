import React from "react";
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";
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





import { StreamChat } from "stream-chat";
import NeederPostedJobCard from "../Jobs/NeederPostedJobCard";



const NeederPostedList = () => {
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
      <NeederHeader />
      <Box paddingTop="4" paddingRight="72" height="90vh">
      <Flex>
        <NeederDashboard />

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
          <Heading size="lg" marginLeft="6px">Posted</Heading>
          {/* <Center flexDirection="column"> */}
          <NeederPostedJobCard />
          {/* </Center> */}
         
        </Box>
      </Flex>
      </Box>
    </>
  );
};

export default NeederPostedList;
