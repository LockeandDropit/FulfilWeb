import React from "react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { query, collection, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import {  ChatIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const InReviewCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "In Review"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });

        if (!results || !results.length) {
          setPostedJobs(0);
        } else {
          setPostedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor

  
  //attemtp to query needer and doer's caht channel using jobTitle as filter

  const [channelID, setChannelID] = useState(null)
  
 const getChannelID = (x) => {
  console.log("this is whats being passed",x)
    if (user != null) {
    const docRef = doc(db, "users", user.uid, "In Review", x);
    getDoc(docRef).then((snapshot) => {
      console.log(snapshot.data().channelID);
    
      setChannelID(snapshot.data().channelID)
    });
    
    } else {
      console.log("oops!");
    }
  }


 
  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);



  const [selectedChannel, setSelectedChannel] = useState(null)

  const filter = { type: 'messaging', members: { $in: [userID] } };

  const getChannels = async () => {
    const channelSort = await chatClient.queryChannels(filter, {
      
  });
  
  channelSort.map((channelSort) => {
    // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
    if (channelSort.cid == channelID) {
      setSelectedChannel(channelSort)
      console.log("channel found", channelSort.cid)
      console.log("channel from FB", channelID)
      //or just navigate from here to selected channel??
      //pass whole channel object to navigate
    } else {
      console.log("no luck", channelSort.cid)
    
    }

})
console.log("channel from FB", channelID)
  
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChannel !== null) {
     
      console.log("selected channel", selectedChannel)
      // navigate("TrialSelectedChat", { props: selectedChannel, isFirstInterview: false });
    } else {
      console.log("nope");
    }
  }, [selectedChannel]);
  return (
    <div>
      {!postedJobs ? (
        <Text>No jobs in review</Text>
      ) : (
        postedJobs?.map((postedJobs) => (
          <div>
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            width="auto"
            borderWidth="1px"
            borderColor="#E3E3E3"
            // borderLeftWidth="4px"
            // borderRightWidth="4px"
            height="auto"
            marginTop="16px"
            boxShadow="md"
            rounded="lg"
          >
            <Stack>
              <CardBody>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap"
                marginLeft="16px">
                  <Heading fontSize="24">{postedJobs.jobTitle}</Heading>
                  {/* <Flex
                    direction="column"
                    position="absolute"
                    right="8"
                    alignItems="center"
                    marginTop="36"
                  >
                    <ChatIcon boxSize={6} color="#01A2E8"></ChatIcon>
                    <Text>Messages</Text>
                  </Flex> */}
                </Flex>

                {/* <Text size="sm">Total Pay ${postedJobs.confirmedRate}</Text> */}
                <Flex
                  flex="1"
                  gap="4"
                  alignItems="center"
                  flexWrap="wrap"
                  marginTop="4"
                  marginLeft="16px"
                >
                    <Avatar src='https://bit.ly/broken-link' bg="#01A2E8" size="lg" />


                  <Box marginTop="2">
                    <Heading size="sm"> {postedJobs.employerName}</Heading>
                    <Text> {postedJobs.city}, MN</Text>

                    {postedJobs.isHourly ? (<Text size="sm">
                      Total Pay Pending  
                    </Text>) : (
                        <Text size="sm">
                        Total Pay ${postedJobs.confirmedRate}
                      </Text>
                    )}
                    
                  </Box>
                </Flex>

                {/* <Button
                  colorScheme="white"
                  textColor="#01A2E8"
                  outlineColor="#01A2E8"
                  width="240px"
                  marginRight="240"
                  position="absolute"
                  right="0"
                >
                  Go To Messages
                </Button> */}
  <Flex direction="column" marginLeft="16px">
                <Heading size="sm" marginTop="2">
                  Description
                </Heading>
                <Text>{postedJobs.description}</Text>
                </Flex>
                <Accordion allowMultiple>
                  <AccordionItem  >
                   <Flex direction="row-reverse" width="890px">
                      <AccordionButton width="120px" position="flex-start" bottom="8px">
                        <Box>See More</Box>
                        <AccordionIcon />
                      </AccordionButton>
                      </Flex>
                    <AccordionPanel pb={4}>
                      <Heading size="sm" marginTop="2">
                        Requirements
                      </Heading>
                      {postedJobs.requirements ? (
                        <Flex direction="row">
                          {" "}
                          <Text fontSize="14">{"\u25CF"} </Text>
                          <Text marginLeft="1">
                            {postedJobs.requirements}{" "}
                          </Text>{" "}
                        </Flex>
                      ) : (
                        <Text>No requirements listed</Text>
                      )}

                      {postedJobs.requirements2 ? (
                        <Flex direction="row">
                          {" "}
                          <Text fontSize="14">{"\u25CF"} </Text>
                          <Text marginLeft="1">
                            {postedJobs.requirements2}{" "}
                          </Text>{" "}
                        </Flex>
                      ) : null}
                      {postedJobs.requirements3 ? (
                        <Flex direction="row">
                          {" "}
                          <Text fontSize="14">{"\u25CF"} </Text>
                          <Text marginLeft="1">
                            {postedJobs.requirements3}{" "}
                          </Text>{" "}
                        </Flex>
                      ) : null}
                      <Heading size="sm" marginTop="2">
                        Additional Notes
                      </Heading>
                      {postedJobs.niceToHave ? (
                        <Text marginBottom="48px">
                          {postedJobs.niceToHave}
                        </Text>
                      ) : (
                        <Text marginBottom="48px">Nothing listed</Text>
                      )}

                      {/* <Button
                        colorScheme="blue"
                        textColor="white"
                        width="180px"
                        height="40px"
                        position="absolute"
                        right="10"
                        bottom="8"
                        alignItems="center"
                        // onClick={() => getChannels(postedJobs)}
                        // onClick={() => navigateToChannel(postedJobs)}
                      >
                        Messages{" "}
                        <ArrowForwardIcon marginLeft="2" marginTop="2px" />
                      </Button> */}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
            
              </CardBody>
            </Stack>
          </Card>
        </div>
        ))
      )}
    </div>
  );
};

export default InReviewCard;
