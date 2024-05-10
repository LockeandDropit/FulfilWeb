import React from "react";
import TryMe from "../../images/TryMe.jpg";
import fulfil180 from "../../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { query, collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Center,
  Spinner,
  Box,
  Image,
} from "@chakra-ui/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StreamChat } from "stream-chat";
import { useMediaQuery } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const NeederHeader = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

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
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [userFirstName, setUserFirstName] = useState("User");

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    getDoc(doc(db, "employers", user.uid)).then((snapshot) => {
      if (!snapshot.data().profilePictureResponse) {
      } else {
        setProfilePicture(snapshot.data().profilePictureResponse);
      }
    });
  };

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  //drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
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
      ) : (
        <>
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
                        navigate("/NeederMapScreen");
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
                        My Jobs
                      </Flex>
                    </Box>
                    <Box
                      fontWeight="600"
                      href="#"
                      onClick={() => {
                        navigate(`/NeederAllCategories`);
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
                        Find A Pro
                      </Flex>
                    </Box>
                    <Box
                      fontWeight="600"
                      href="#"
                      onClick={() => {
                        navigate("/NeederMessageList");
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
                        navigate("/NeederProfile");
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
                    <Center>
                      <Button
                        marginTop="16px"
                        marginBottom="24px"
                        fontSize="18px"
                        as="b"
                        width="220px"
                        backgroundColor="#01A2E8"
                        color="white"
                        _hover={{ bg: "#018ecb", textColor: "white" }}
                        onClick={() => {
                          navigate("/AddJobStart");
                        }}
                      >
                        Post A Job
                      </Button>
                    </Center>
                  </Flex>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      <Box marginLeft="auto" alignContent="center" alignItems="center">
        {isDesktop ? null : (
          <Button
            backgroundColor="#01A2E8"
            color="white"
            _hover={{ bg: "#018ecb", textColor: "white" }}
            marginTop="24px"
            marginRight="24px"
            height="36px"
            onClick={() => navigate("/AddJobStart")}
          >
            Post A Job
          </Button>
        )}

        <Menu>
          <MenuButton>
            <Avatar
              bg="#01A2E8"
              mt={{ base: "1px", lg: 2 }}
              mr={{ base: "16px", lg: "24px" }}
              src={profilePicture ? profilePicture : <Avatar />}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate("/NeederAccountManager")}>
              Account Settings
            </MenuItem>
            <MenuItem onClick={() => navigate("/NeederProfile")}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => navigate("/NeederPaymentHistory")}>
              Payment History
            </MenuItem>

            <MenuItem onClick={() => navigate("/NeederPrivacyPolicy")}>
              Privacy Policy
            </MenuItem>

            <MenuItem onClick={() => navigate("/NeederContactForm")}>
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
  );
};

export default NeederHeader;
