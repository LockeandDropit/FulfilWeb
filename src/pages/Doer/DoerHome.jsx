import React from "react";
import DoerHeader from "./DoerHeader";
import DoerDashboard from "./DoerDashboard";
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
import { auth } from "../../firebaseConfig";

import InProgressCard from "./Jobs/InProgressCard";
import CompletedJobCard from "./Jobs/CompletedJobCard";
import InReviewCard from "./Jobs/InReviewCard";
import SavedJobCard from "./Jobs/SavedJobCard copy";
import { StreamChat } from "stream-chat";



const DoerHome = () => {
  // const [user, setUser] = useState(null);
  const [userIDStreamChat, setUserIDStreamChat] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState();

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    // setUser(currentUser);
    setUserIDStreamChat(currentUser.uid);
   
  });

  //log into stream chat

  // const apiKey = process.env.REACT_APP_STREAM_CHAT_API_KEY

  // const client = StreamChat.getInstance(
  //   process.env.REACT_APP_STREAM_CHAT_API_KEY
  // );

  // console.log(apiKey)

  //test from site 

  const userId = 'divine-fog-7';
const userName = 'divine-fog-7';

const user = {
  id: userIDStreamChat,
  // name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};





  

  // useEffect(() => {

  //   if (userIDStreamChat) {
  //   async function init () {
  //     const chatClient = StreamChat.getInstance("hsng75wrkvns")
  //     await chatClient.connectUser(
  //       {id: userIDStreamChat, image: profilePictureURL,}, chatClient.devToken(userIDStreamChat)
  //     )
  //   }
  //   init()
  // } else {

  // }
  // }, [userIDStreamChat]);

  // credit y scroll claire lin https://stackoverflow.com/questions/54837266/scrollview-like-component-in-react-js
  return (
    <>
      <DoerHeader />
      <Box paddingTop="4" backgroundColor="#fff9e6" paddingRight="72" height="90vh">
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
        
        >
          <Heading size="lg" marginLeft="6px">In Progress</Heading>
          {/* <Center flexDirection="column"> */}
          <InProgressCard />
          {/* </Center> */}
          <Heading size="lg" marginTop="16px"  marginLeft="6px">
            In Review
          </Heading>
          <Center>
          <InReviewCard />
          </Center>
          <Heading size="lg" marginTop="16px"  marginLeft="6px">
            Saved
          </Heading>
          <SavedJobCard />
          <Heading size="lg" marginTop="16px"  marginLeft="6px">
            Completed Jobs
          </Heading>
          <CompletedJobCard />
        </Box>
      </Flex>
      </Box>
    </>
  );
};

export default DoerHome;
