import React from "react";

import fulfil180 from "../../images/fulfil180.jpg";
import TryMe from "../../images/TryMe.jpg"
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Flex,
  Heading,
  Image,
  Box
} from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { query, collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Spinner,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Skeleton,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  VStack,
  Text
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StreamChat } from "stream-chat";
import { useMediaQuery } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const DoerHeader = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

  //hide this

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const [loggingOut, setLoggingOut] = useState(false);

  const auth = getAuth();
  const handleLogOut = async () => {
    setLoggingOut(true);
    await chatClient.disconnectUser();
    await signOut(auth)
      .then(
        setTimeout(() => {
          navigate("/");
        }, 2000)
      ) // undefined
      .catch((e) => console.log(e));
  };

  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [userFirstName, setUserFirstName] = useState("User");
  const [stripeID, setStripeID] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setStripeID({ stripeID: snapshot.data().stripeID });
      });
    } else {
      
    }
  }, [user]);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  const [sessionUrl, setSessionUrl] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    getDoc(doc(db, "users", user.uid)).then((snapshot) => {
      if (!snapshot.data().profilePictureResponse) {

      } else {
        setProfilePicture(snapshot.data().profilePictureResponse)
      }
    })
  };


  const logInStripe = async () => {
    const response = await fetch(
      //this one is the live one
      // "https://fulfil-api.onrender.com/create-checkout-web",

      //this is test
      "https://fulfil-api.onrender.com/stripe-log-in",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stripeID),
      }
    );

    const { loginLink } = await response.json();

    

    setTimeout(() => {
      if (loginLink) {
        setSessionUrl(loginLink);
      }
    }, 1000);
  };

  useEffect(() => {
    if (sessionUrl !== null) {
      setTimeout(() => {
        // setPaymentsLoading(false)
        // window.location.replace(sessionUrl);
        // help from gun https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
        window.open(sessionUrl, "_blank");
      }, 1000);
    } else {
    }
  });


  const initializeSubscription = () => {
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
      method: "POST"
    })
      .then(res => res.json())
      .then(({ url }) => {
        // window.location = url
        window.open(url, "_blank")
      })
      .catch(e => {
        console.error(e.error)
      })
  }

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

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

  //drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenSubscription, onOpen: onOpenSubscription, onClose: onCloseSubscription } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(null)

  return (
    <>
    <Box
      flexDirection="row"
      display="flex"
      alignContent="center"
      alignItems="center"
    >
     
     {isDesktop ? (
        <Box mx="4">
          <Image src={TryMe} onClick={() => navigate(`/`)}></Image>
        </Box>
      ) : (<>
        <HamburgerIcon onClick={() => onOpen()} ml={4} mt={4}/>{" "}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Dashboard</DrawerHeader>

            <DrawerBody>
              <Box
                // height="800px"

                // width="320px"
                // width="280px"
                borderRadius="6"
                boxShadow="sm"
                rounded="md"
                backgroundColor="white"
              >
                <Flex direction="column">
                  <Box
                    mt={3}
                    fontWeight="600"
                    href="#"
                    onClick={() => {
                      navigate("/DoerMapScreen");
                    }}
                  >
                    <Flex
                      align="center"
                      p="3"
                      mx="4"
                      borderRadius="md"
                      fontSize="18px"
                      height="42px"
                      _hover={{
                        bg: "#e3e3e3",

                        height: "42px",
                      }}
                    >
                      Explore
                    </Flex>
                  </Box>
                  
                  <Box
                    fontWeight="600"
                    href="#"
                    onClick={() => {
                      navigate("/DoerMessageList");
                    }}
                  >
                    <Flex
                      align="center"
                      p="3"
                      mx="4"
                      borderRadius="md"
                      fontSize="18px"
                      height="42px"
                      _hover={{
                        bg: "#e3e3e3",
                        height: "42px",
                      }}
                    >
                      Messages
                    </Flex>
                  </Box>
                  <Box
                    fontWeight="600"
                    href="#"
                    onClick={() => {
                      navigate("/DoerProfile");
                    }}
                  >
                    <Flex
                      align="center"
                      p="3"
                      mx="4"
                      borderRadius="md"
                      fontSize="18px"
                      height="42px"
                      _hover={{
                        bg: "#e3e3e3",
                        height: "42px",
                      }}
                    >
                      My Profile
                    </Flex>
                  </Box>
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
              onClick={() => onOpenSubscription()}
            >
              Upgrade to Premium
            </Button> 
           
          </Box>)}
                </Flex>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>)}

      
      <Box marginLeft="auto" alignContent="center" alignItems="center" >
        

        <Menu>
          <MenuButton>
            <Avatar
                mt={{ base: "1px", lg: 2 }}
                mr={{ base: "16px", lg: "24px" }}
              bg="#01A2E8"
              marginRight="16px"
              src={profilePicture ? profilePicture : <Avatar />}
            />
          </MenuButton>
          <MenuList>
          {/* <Button
                  width="160px"
                  backgroundColor="#01A2E8"
                  textColor="white"
                  height="32px"
                  marginTop="8px"
                  onClick={() => initializeSubscription()}
                >
                  Access Premium
                </Button> */}
            <MenuItem type="primary" onClick={() => logInStripe()}>
              Access Stripe Account
            </MenuItem>

            <MenuItem onClick={() => navigate("/DoerAccountManager")}>
              Account Settings
            </MenuItem>
            {/* <MenuItem onClick={() => navigate("/DoerPaymentHistory")}>Payment History</MenuItem> */}

            <MenuItem onClick={() => navigate("/DoerPrivacyPolicy")}>
              Privacy Policy
            </MenuItem>

            <MenuItem onClick={() => navigate("/DoerContactForm")}>
              Contact Us
            </MenuItem>
            {loggingOut ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Center>
                <Button
                  width="160px"
                  colorScheme="red"
                  height="32px"
                  marginTop="8px"
                  onClick={() => handleLogOut()}
                >
                  Log Out
                </Button>
              </Center>
            )}
          </MenuList>
        </Menu>
      </Box>
    </Box>

<Modal isOpen={isOpenSubscription} onClose={onCloseSubscription}>
<ModalOverlay />
<ModalContent>
  <ModalCloseButton />
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

export default DoerHeader;
