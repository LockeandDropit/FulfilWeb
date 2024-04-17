//make this another split screen

//left side is text about finding the right professional.
//followed by copy to sign up or sign in.

//right side is scrollview of featured contractors in that category.

import React, { useState, useEffect } from "react";

import Header from "./Header.jsx";

import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Tag, 
  TagLabel
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import star_corner from "../images/star_corner.png";
import star_filled from "../images/star_filled.png";

const SelectedCategory = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  console.log(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rhoncus ac arcu vitae tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque augue neque, ullamcorper vitae aliquet vitae, rutrum et mi. Mauris a purus sapien. Etiam elit sapien, condimentum quis imperdiet in, auctor a neque. Donec tincidunt pulvinar neque, ac fermentum metus consectetur sed. Duis consectetur risus ut dui malesuada, ut dapibus sem dictum. Aenean velit risus, viverra non aliquet eget, ultrices id enim. Duis sodales semper velit, ac finibus tortor. Integer viverra tellus lacus, eu feugiat neque fermentum in. Curabitur efficitur vel est sed semper."
  );
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [input, setInput] = useState("");
  const location = useLocation();

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);

  console.log(email, password);

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        navigate("/AddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const validate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
    }
    if (isValid && isValidPassword) {
      onSignUp();
    }
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  const passwordRegex = /[^\>]*/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = () => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
    }
  };

  const [visibleToggle, setVisibleToggle] = useState("password");

  const handlePasswordVisible = () => {
    if (visibleToggle === "password") {
      setVisibleToggle("email");
    } else if (visibleToggle === "email") {
      setVisibleToggle("password");
    }
  };

  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
    }, 200);
  };

  //handle selected category

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [premiumUsersIds, setPremiumUsersIds] = useState(null);
  const [premiumUsers, setPremiumUsers] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (location.state === null) {
    } else {
      console.log("is this the bug?", location.state.category);
      setSelectedCategory(location.state.category);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCategory) {
      const q = query(collection(db, "categories", selectedCategory, "Tier 1"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        let finalResults = [];
        snapshot.docs.forEach((doc) => {
          console.log(doc.id);
          results.push(doc.id);
        });

        results.forEach((results) => {
          const ref = doc(db, "users", results);

          getDoc(ref).then((snapshot) => {
            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              console.log(
                "premium doer in this category info",
                snapshot.data()
              );

              finalResults.push({
                ...snapshot.data(),
              });
            }
          });
        });

        setTimeout(() => {
          setPremiumUsers(finalResults);
        }, 200);

        // if (!results || !results.length) {
        //     setPremiumUsersIds(null)
        // } else {
        //     setPremiumUsersIds(results)
        // }
      });
    }
  }, [selectedCategory]);

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  //Card Social User PRofile Sample Template credit https://chakra-templates.vercel.app/components/cards
  return (
    <>
      <Header props={openModal} />

      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        marginLeft={16}
      >
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Center flexDirection="column">
              <Heading fontSize={"3xl"}>Choose from top contractors who specialize in {selectedCategory}</Heading>

              
            </Center>

            <Center>
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                Get access to available work in your area. Find jobs that fit
                your speciality.
              </Text>
            </Center>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                borderColor="grey"
                borderWidth=".25px"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailValidationBegun === true ? (
                <Text color="red">{validationMessage}</Text>
              ) : null}
            </FormControl>
            <FormControl marginTop="8px">
              <FormLabel>Password</FormLabel>

              <InputGroup>
                <Input
                  borderColor="grey"
                  borderWidth=".5px"
                  type={visibleToggle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <ViewIcon onClick={() => handlePasswordVisible()} />
                </InputRightElement>
              </InputGroup>
              {passwordValidationBegun === true ? (
                <Text color="red">{passwordValidationMessage}</Text>
              ) : null}
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              ></Stack>
              <Button
                bg="#01A2E8"
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => validate()}
              >
                Sign up
              </Button>
              <Button backgroundColor="white" onClick={() => handleOpenModal()}>
                Already have an account?&nbsp;<Text>Log In</Text>
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={2}>
          <Box w="60vw" h="70vh" padding="8" alignContent="center">
            <Center>
              {premiumUsers ? (
                premiumUsers.map((premiumUser) => (
                    <Center py={6}>
                    <Box
                    ml={2}
                    mr={2}
                      maxW={'320px'}
                      w={'full'}
                    //   bg={useColorModeValue('white', 'gray.900')}
                      boxShadow={'lg'}
                      rounded={'lg'}
                      p={5}
                      textAlign={'center'}>
                      <Avatar
                        size={'xl'}
                        src={
                          premiumUser.profilePictureResponse
                        }
                        mb={4}
                        pos={'relative'}
                        _after={{
                          content: '""',
                          w: 4,
                          h: 4,
                          bg: 'green.300',
                          border: '2px solid white',
                          rounded: 'full',
                          pos: 'absolute',
                          bottom: 0,
                          right: 3,
                        }}
                      />
                      <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {premiumUser.firstName}
                      </Heading>
                      <Center>
                      {premiumUser.numberOfRatings ? (
                                            <Flex>
                                              {maxRating.map((item, key) => {
                                                return (
                                                  <Box
                                                    activeopacity={0.7}
                                                    key={item}
                                                    marginTop="5px"
                                                  >
                                                    <Image
                                                      boxSize="16px"
                                                      src={
                                                        item <= premiumUser.rating
                                                          ? star_filled
                                                          : star_corner
                                                      }
                                                    ></Image>
                                                  </Box>
                                                );
                                              })}
                                              <Text marginLeft="4px">
                                                ({premiumUser.numberOfRatings} reviews)
                                              </Text>
                                            </Flex>
                                          ) : (
                                            <Text marginTop="4px">
                                              No reviews yet!
                                            </Text>
                                          )}
                                          </Center>
                     <Box minHeight="72px">
                      <Text
                        textAlign={'center'}
                        // color={useColorModeValue('gray.700', 'gray.400')}
                        px={3}
                        noOfLines={3}
                        >
                       {premiumUser.bio}
                      </Text>
                      </Box>
                    <Heading size="xs" mt={4} mb={2} >Specializes in:</Heading>     
                      <Stack align={'center'} justify={'center'} direction={'row'} >
                        {premiumUser.premiumCategoryOne ? (
                    <Tag sz="sm"  variant='outline' colorScheme='blue'  px={2}
                    py={1}>
                    <TagLabel> {premiumUser.premiumCategoryOne}</TagLabel>
                    
                  </Tag>) : (<Tag sz="sm"  backgroundColor="white" px={2}
                    py={1}>
                    <TagLabel> {premiumUser.premiumCategoryOne}</TagLabel>
                    
                  </Tag>)}
                        
                  {premiumUser.premiumCategoryTwo ? (
                    <Tag sz="sm"  variant='outline' colorScheme='blue'  px={2}
                    py={1}>
                    <TagLabel> {premiumUser.premiumCategoryTwo}</TagLabel>
                    
                  </Tag>) : (null)}
                  {premiumUser.premiumCategoryThree ? (
                    <Tag sz="sm"  variant='outline' colorScheme='blue'  px={2}
                    py={1}>
                    <TagLabel> {premiumUser.premiumCategoryThree}</TagLabel>
                    
                  </Tag>) : (null)}
                      </Stack>
              
                      <Stack mt={8} direction={'row'} spacing={4}>
                        <Button
                          flex={1}
                          fontSize={'sm'}
                          rounded={'full'}
                          _focus={{
                            bg: 'gray.200',
                          }}
                          
                          onClick={() => handleOpenModal()}>
                         See profile
                        </Button>
                        <Button
                          flex={1}
                          fontSize={'sm'}
                          rounded={'full'}
                          bg={'blue.400'}
                          color={'white'}
                          boxShadow={
                            '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                          }
                          _hover={{
                            bg: 'blue.500',
                          }}
                          _focus={{
                            bg: 'blue.500',
                          }}
                          onClick={() => handleOpenModal()}>
                          Contact
                        </Button>
                      </Stack>
                    </Box>
                  </Center>
                ))
              ) : (
                <Text> No premium users</Text>
              )}
            </Center>
          </Box>
        </Flex>
      </Stack>
    </>
  );
};

export default SelectedCategory;
