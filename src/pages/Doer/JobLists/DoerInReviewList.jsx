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

import InReviewCard from "../Jobs/InReviewCard";



const DoerInReviewList = () => {
  // const [user, setUser] = useState(null);
  const [userIDStreamChat, setUserIDStreamChat] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState();

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    // setUser(currentUser);
    setUserIDStreamChat(currentUser.uid);
    console.log(currentUser.uid);
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

const apiKey = 'gheexx2834gr';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGl2aW5lLWZvZy03In0.q3bDCm0MTnXGLGYgoaUwHDGv7dXl4DRA-LNPWWa_IhU';

const chatClient = new StreamChat(apiKey);

useEffect(() => {
  if (userIDStreamChat && chatClient) {
    chatClient.connectUser(user, chatClient.devToken(userIDStreamChat));
    console.log("userConnected!", chatClient._user.id)
  } else {

  }

}, [userIDStreamChat])



  

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
          <Heading size="lg" marginLeft="6px">In Review</Heading>
          {/* <Center flexDirection="column"> */}
         <InReviewCard />
         
         
        </Box>
      </Flex>
      </Box>
    </>
  );
};

export default DoerInReviewList;
