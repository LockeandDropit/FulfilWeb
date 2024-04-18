import React, { useState, useEffect } from "react";
import DoerHeader from "./DoerHeader";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Divider,
  Heading,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  VStack,
  Skeleton
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { Container, Text, Flex, Box, Center } from "@chakra-ui/react";
import { useClickable } from "@chakra-ui/clickable";
import { chakra } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DoerDashboard = () => {
 

  const [user, setUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid)
      });
      setHasRun(true);
    } else {
    }
  },[]);

  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(null)

  const [test, setTest] = useState("test")

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((snapshot) => {
     console.log(snapshot.data())
        setIsPremium(snapshot.data().isPremium)
      })
        .then(() => {
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        
        })
        .catch((error) => {
          // no buen
          console.log(error)
        });
    }
  }, [user]);


  useEffect(() => {
    console.log(isLoading, isPremium)
  }, [isLoading, isPremium])

  const navigate = useNavigate();

  const [subscriptionID, setSubscriptionID] = useState(null);

  const initializeSubscription = () => {
    //credit and help from https://github.com/pagecow/stripe-subscribe-payments
    fetch("http://localhost:80/create-subscription-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ session }) => {
        setSubscriptionID(session.id);
        window.open(session.url, "_blank");
      })
      // .then(({ url }) => {
      //   // window.location = url
      //   window.open(url, "_blank")
      // })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "users", user.uid), {
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);

 
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        height="800px"
        width="320px"
        borderRadius="6"
        boxShadow="sm"
        rounded="md"
        backgroundColor="white"
      >
        {/* <Text fontSize="24px" as="b" marginTop="4" marginLeft="2">
            Dashboard
          </Text> */}
        <Center flexDirection="column">
          {/* <Button
              fontSize="20px"
              as="b"
              marginTop="8"
              width="320px"
              _hover={{ bg: "#01A2E8", textColor: "white" }}
              _active={{  bg: '#dddfe2',
              // transform: 'scale(0.98)',
              borderColor: "#01A2E8", }}
              onClick={() => {navigate("/DoerHome")}}
            >
             My Jobs (Make Accordion)
            </Button> */}
          <Accordion allowMultiple>
            {/* <AccordionItem>
              <AccordionButton
                height="80px"
                width="320px"
                backgroundColor="white"
                _expanded={{ bg: "white", color: "black" }}
              >
                <Button
                marginLeft="16px"
                  fontSize="20px"
                  as="b"
                  backgroundColor="white"
                  // marginTop="8"
                  width="320px"
                  _hover={{ bg: "#01A2E8", textColor: "white" }}
                  // _active={{  bg: '#dddfe2',
                  // transform: 'scale(0.98)',
                  // borderColor: "#01A2E8", }}
                >
                  My Jobs
                </Button>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Flex direction="column">
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/DoerInProgressList");
                    }}
                  >
                    In Progress
                  </Button>
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/DoerSavedList");
                    }}
                  >
                    Saved
                  </Button>
                  <Button
                    width="320px"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    backgroundColor="white"
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/DoerInReviewList");
                    }}
                  >
                    In Review
                  </Button>
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/DoerCompletedList");
                    }}
                  >
                    Completed
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem> */}
          </Accordion>
          <Button
            fontSize="20px"
            as="b"
            // marginTop="4"
            width="320px"
            backgroundColor="white"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{ backgroundColor: "#01A2E8", textColor: "white" }}
            //  colorScheme="white"
            onClick={() => {
              navigate("/DoerMapScreen");
            }}
          >
            My Jobs
          </Button>
          <Button
            fontSize="20px"
            as="b"
            marginTop="4"
            width="320px"
            backgroundColor="white"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            onClick={() => {
              navigate("/DoerMessageList");
            }}
          >
            Messages
          </Button>
          <Button
            //   colorScheme="black"
            fontSize="20px"
            as="b"
            marginTop="4"
            width="320px"
            backgroundColor="white"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            onClick={() => {
              navigate("/DoerProfile");
            }}
          >
            Profile
          </Button>

          
          {isLoading ? ( 
          <Skeleton position="absolute" bottom="16" width="240px">
          <div>contents wrapped</div>
  <div>won't be visible</div>
  <div>contents wrapped</div>
  
     
          </Skeleton>) : isPremium ? (<Box position="absolute" bottom="16">
             <Heading size="sm">You're a premium member!</Heading>
            <Button
              background="#01A2E8"
              textColor="white"
              _hover={{ bg: "#018ecb", textColor: "white" }}
              ml={3}
              mt={3}
              // onClick={() => onOpen()}
            >
              Manage my Account
            </Button> 
           
          </Box>) : ( <Box position="absolute" bottom="16">
             <Heading size="sm">Want to make more money?</Heading>
            <Button
              background="#01A2E8"
              textColor="white"
              _hover={{ bg: "#018ecb", textColor: "white" }}
              ml={3}
              mt={3}
              onClick={() => onOpen()}
            >
              Upgrade to Premium
            </Button> 
           
          </Box>)}
          
         
        </Center>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Center py={6}>
            <Box
              maxW={"330px"}
              w={"full"}
              bg={useColorModeValue("white", "gray.800")}
              rounded={"md"}
              overflow={"hidden"}
            >
              <VStack spacing={1} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                  Upgrade to premium
                </Heading>
                <Text fontSize="lg" color={"gray.500"}>
                  Get the frist 2 months for $1/month. Then continue at
                  $79/month.
                </Text>

                <Text fontSize="md" color={"gray.500"}>
                  Cancel at anytime.
                </Text>
              </VStack>
              <Stack
                textAlign={"center"}
                p={5}
                color={useColorModeValue("gray.800", "white")}
                align={"center"}
              >
                <Text
                  fontSize={"md"}
                  fontWeight={500}
                  textColor="#01A2E8"
                  p={2}
                  px={3}
                  rounded={"full"}
                >
                  Premium Subscription
                </Text>
                <Stack direction={"row"} align={"center"} justify={"center"}>
                  <Text fontSize={"3xl"}>$</Text>
                  <Text fontSize={"6xl"} fontWeight={800}>
                    1
                  </Text>
                  <Text color={"gray.500"}>/month</Text>
                </Stack>
              </Stack>

              <Box px={1} py={6}>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Save 7% on all transaction fees
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Get noticed by customers as a Premium Contractor
                  </ListItem>

                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Be seen by customers who are looking for contractors in your
                    category
                  </ListItem>
                </List>

                <Button
                  mt={10}
                  w={"full"}
                  bg="#01A2E8"
                  color={"white"}
                  rounded={"xl"}
                  boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
                  _hover={{ bg: "#018ecb", textColor: "white" }}
                  onClick={() => initializeSubscription()}
                >
                  Start your trial
                </Button>
              </Box>
            </Box>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerDashboard;
