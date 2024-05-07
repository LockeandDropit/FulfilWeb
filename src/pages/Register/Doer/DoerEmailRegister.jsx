import React, { useState, useEffect } from "react";

import Header from "../../../components/Header.jsx";
import MapScreen from "../../MapScreen.jsx";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import Planning from "../../../images/Planning.jpg";
import LadderWomanMedium from "../../../images/LadderWomanMedium.jpg";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { FcGoogle } from "react-icons/fc";

const DoerEmailRegister = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
 
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [input, setInput] = useState("");

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
        navigate("/DoerAddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };


  const handleGoogleSignUp = async () => {
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log("result", result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log("google user", user);

        Promise.all([
          getDoc(doc(db, "users", result.user.uid)),
          getDoc(doc(db, "employers", result.user.uid)),
        ])
          .then((results) =>
         
            navigate(
              results[0]._document === null && results[1]._document === null
                ? "/DoerAddProfileInfo"
                : ( results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer)
                ? "/DoerMapScreen"
                : "/NeederMapScreen"
            )
          )
          .catch();

        //check if user is already in DB
        //if so, navigate accordingly
        //if not, navigate to new profile register
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("hello", error);
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
      setPasswordValidationMessage( "Password Invalid. Must be at least 6 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number");
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
  
  // https://regexr.com/3bfsi
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
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

  const [openModal, setOpenModal] = useState(null)

  const handleOpenModal = () => {
    setOpenModal(true)
    setTimeout(() => {
      setOpenModal(false)
    }, 200)
  }


  //this is here to circumnavigate the bug where if the info marker is open and the user tries to enter their email they are stopped after enetering one letter and redirected to the infomarker

const [closeInfoWindow, setCloseInfoWindow] = useState(false)
  
const handleFocus = () => {
   setCloseInfoWindow(true)
   setTimeout(() => {
setCloseInfoWindow(false)
   }, 200)
  };

 //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
      <Header props={openModal}/>
 
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }} marginLeft={{base: 0, lg: 16}}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"} >
            <Center flexDirection="column">
              <Heading fontSize={"3xl"}>Create an account</Heading>
             
              <Heading fontSize={"2xl"}>Find Work Today</Heading>
            </Center>
           
            <Center>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
            Get access to available work in your area. Find jobs that fit your speciality.
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
                onFocus={handleFocus} 
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
                  onFocus={() => handleFocus()} 
                />
                <InputRightElement>
                  <ViewIcon onClick={() => handlePasswordVisible()} />
                </InputRightElement>
              </InputGroup>
              {passwordValidationBegun === true ? (
                <Text color="red">{passwordValidationMessage}</Text>
              ) : null}
            </FormControl>
            <Stack spacing={{base: 1, lg: 6}}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              ></Stack>
              <Button   bg="#01A2E8"
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={() => validate()}>
                Sign up
              </Button>
              <Button
                w={"full"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
                onClick={() => handleGoogleSignUp()}
              >
                <Center>
                  <Text>Sign up with Google</Text>
                </Center>
              </Button>
              <Button backgroundColor="white" onClick={() => handleOpenModal()}>Already have an account?&nbsp;<Text>Log In</Text></Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={2}>
        <Box w={{base: "70vw", lg: "60vw"}} h={{base: "50vh", lg: "70vh"}} padding="2"  alignContent="center">
            <Box w={{base: "70vw" , lg: "60vw"}} h={{base: "50vh", lg: "70vh"}} >
              <MapScreen props={closeInfoWindow}/>
            </Box>
          </Box>
{/* 
          <Box w="60vw" h="70vh" padding="8" alignContent="center">
            <Box w="60vw" h="70vh" >
              <MapScreen props={closeInfoWindow}/>
            </Box>
          </Box> */}
          
        </Flex>
      </Stack>
    </>
  );
};

export default DoerEmailRegister;
