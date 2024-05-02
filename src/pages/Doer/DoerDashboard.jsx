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
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
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
        height="90vh"
        width="280px"
        borderRadius="6"
        boxShadow="sm"
        rounded="md"
        backgroundColor="white"
      >
        
        <Flex direction="column">
       
        <Box mt={3} fontWeight="600">
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
             
            >
            Dashboard
            </Flex>
          </Box>
          <Center>
          <Divider width="240px"/>
          </Center>
        <Box mt={3} fontWeight="600" href="#"  onClick={() => {
              navigate("/DoerMapScreen");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
               
                height: "42px"
              }}
            >
              Explore
            </Flex>
          </Box>
       
          <Box fontWeight="600" href="#"   onClick={() => {
              navigate("/DoerMessageList");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
                height: "42px"
              }}
            >
              Messages
            </Flex>
          </Box>
          <Box fontWeight="600" href="#"   onClick={() => {
              navigate("/DoerProfile");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
                height: "42px"
             
              }}
            >
             My Profile
            </Flex>
          </Box>
          </Flex>

          <Center flexDirection="column">
          
          {isLoading ? ( 
          <Skeleton position="absolute" bottom="16" width="240px">
          <div>contents wrapped</div>
  <div>won't be visible</div>
  <div>contents wrapped</div>
  
     
          </Skeleton>) : isPremium ? (<Box position="absolute" bottom="16">
             <Heading size="sm">You're a premium member!</Heading>
            {/* <Button
              background="#01A2E8"
              textColor="white"
              _hover={{ bg: "#018ecb", textColor: "white" }}
              ml={3}
              mt={3}
              // onClick={() => onOpen()}
            >
              Manage my Account
            </Button>  */}
           
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
                  $29/month.
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
                    Save 50% on all transaction fees
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
