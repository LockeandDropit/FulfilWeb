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
  Flex,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { query, collection, onSnapshot, getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Box,
  Avatar,
  useDisclosure
} from "@chakra-ui/react";

import { ChatIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NeederInProgressCard = () => {
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
      const q = query(
        collection(db, "employers", user.uid, "Jobs In Progress")
      );

      onSnapshot(q, (snapshot) => {
        let results = [];

        snapshot.docs.forEach((doc) => {
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

  //attemtp to query needer and doer's caht channel using jobTitle as filter

  const [channelID, setChannelID] = useState(null);

  const getChannelID = (x) => {
    console.log("this is whats being passed", x.channelID);
    // if (user != null) {
    // const docRef = doc(db, "users", user.uid, "In Progress", x.jobTitle);
    // getDoc(docRef).then((snapshot) => {
    //   console.log(snapshot.data().channelID);

    //   // setChannelID(snapshot.data().channelID)
    // });

    // } else {
    //   console.log("oops!");
    // }
  };

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };

  const [userConnected, setUserConnected] = useState(false);

  const filter = { type: "messaging", members: { $in: [userID] } };

  // useEffect(() => {
  //   if (userID && chatClient && userConnected === false) {
  //     chatClient.connectUser(userInfo, chatClient.devToken(userID));
  //     console.log("userConnected!", chatClient._user.id);
  //     setUserConnected(true)
  //   } else {
  //   }
  // }, [userID, chatClient]);

  // const client = StreamChat.getInstance(STREAM_CHAT_API_KEY);
  const [selectedChannel, setSelectedChannel] = useState(null);
  //props passed https://stackoverflow.com/questions/64566405/react-router-dom-v6-usenavigate-passing-value-to-another-component
  const navigateToChannel = (x) => {
    navigate("/NeederMessageList", { state: { selectedChannel: x.channelID } });
    console.log(x.channelID);
  };

  const getChannels = async (x) => {
    const channelSort = await chatClient.queryChannels(filter, {});

    setTimeout(() => {
      channelSort.map((channelSort) => {
        // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
        if (channelSort.cid == x.channelID) {
          setSelectedChannel(channelSort);
          console.log("channel found", channelSort.cid);
          console.log("channel from FB", x.channelID);
          //or just navigate from here to selected channel??
          //pass whole channel object to navigate
        } else {
          console.log("no luck", channelSort.cid);
        }
      });
    }, 1000);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChannel !== null) {
      console.log("selected channel", selectedChannel);
      // navigate("TrialSelectedChat", { props: selectedChannel, isFirstInterview: false });
    } else {
      console.log("nope");
    }
  }, [selectedChannel]);

  //modal control
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleCancel = (jobTitle) => {
console.log("jobtitle",jobTitle)
onOpen()
  }

  const handleDelete = (postedJobs) => {


    setDoc(doc(db, "Canceled Jobs", postedJobs.jobID), {
      employerID: user.uid,
      doerID: postedJobs.hiredApplicant,
      jobTitle: postedJobs.jobTitle,
     
  })
  .then(() => {



    })
    .catch((error) => {
      // no bueno
      console.log(error);
    });

    deleteDoc(doc(db, "Map Jobs", user.uid, "Posted Jobs", postedJobs.jobTitle), {

    })
      .then(() => {
        //all good
      
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

      deleteDoc(doc(db, "employers", user.uid, "Jobs In Progress", postedJobs.jobTitle), {

      })
        .then(() => {
          //all good
          onOpen()
     
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

        
  }


  const handleCloseModal = () => {
    onClose()
  }

  return (
    <div>
      {!postedJobs ? (
        <Flex direction="column">
          <Text marginLeft="6px" marginTop="4">
            No jobs in progress
          </Text>
          <Button
            colorScheme="blue"
            marginTop="16px"
            marginRight="24px"
            height="36px"
            width="240px"
            onClick={() => navigate("/AddJobStart")}
          >
            Post A Job
          </Button>
        </Flex>
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
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginLeft="16px"
                  >
                    <Heading fontSize="24">{postedJobs.jobTitle}</Heading>
                    <Box position="absolute" right="0" marginTop="8px">
                      <Button height="36px" marginRight="8px" backgroundColor="white" textColor="black" _hover={{ bg: "#DFDFDF", textColor: "black" }}>See More</Button>
                      {/* <Button height="36px" width="120px" backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => navigateToChannel(postedJobs)}>Messages</Button> */}
                    </Box>
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
                    <Avatar
                      src="https://bit.ly/broken-link"
                      bg="#01A2E8"
                      size="lg"
                    />

                    <Box marginTop="2">
                      <Heading size="sm"> {postedJobs.employerName}</Heading>
                      <Text> {postedJobs.city}, MN</Text>
                      <Text size="sm">
                        Total Pay ${postedJobs.confirmedRate}
                      </Text>
                    </Box>
                  </Flex>
                  {/* <Box>
                  <Button marginLeft="16px" marginTop="16px" height="36px" width="160px" backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => navigateToChannel(postedJobs)}>See Messages</Button>
                  </Box> */}

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
                  <Flex direction="column" marginLeft="16px" marginBottom="60px">
                    <Heading size="sm" marginTop="2">
                      Description
                    </Heading>
                    <Text>{postedJobs.description}</Text>
                    
                  </Flex>
                  <Box bottom="2" >
                    
                  <Button  height="36px" width="160px" backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => navigateToChannel(postedJobs)}>See Messages</Button>
                  <Button height="36px"  marginLeft="8px" backgroundColor="white" textColor="#d8504d" _hover={{ bg: "#f1807e", textColor: "white" }} onClick={() => handleDelete(postedJobs)}>Cancel Job</Button>
                  </Box>

                  
                  {/* <Accordion allowMultiple>
                    <AccordionItem>
                      <Flex direction="row-reverse" width="890px">
                        <AccordionButton
                          width="120px"
                          position="flex-start"
                          bottom="8px"
                        >
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

                      
                        <Button
                          colorScheme="blue"
                          textColor="white"
                          width="180px"
                          height="40px"
                          position="absolute"
                          right="10"
                          bottom="8"
                          alignItems="center"
                          // onClick={() => getChannels(postedJobs)}
                          onClick={() => navigateToChannel(postedJobs)}
                        >
                          Messages{" "}
                          <ArrowForwardIcon marginLeft="2" marginTop="2px" />
                        </Button>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion> */}
                </CardBody>
              </Stack>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This job has been canceled
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => handleCloseModal()}>
              Great!
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
          </div>
        ))
      )}
    </div>
  );
};

export default NeederInProgressCard;
