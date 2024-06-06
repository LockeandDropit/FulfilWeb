import React, { useState, useEffect } from "react";

import Header from "../../../components/Header.jsx";

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
import { FcGoogle } from "react-icons/fc";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { auth } from "../../../firebaseConfig";
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
import NeederRegisterMapScreen from "../../../components/NeederRegisterMapScreen.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Plausible from 'plausible-tracker'
import LoggedOutHeader from "../../../components/Landing/LoggedOutHeader.jsx";

import { useMediaQuery } from "@chakra-ui/react";

const OnboardingOne = () => {
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



  const { trackEvent } = Plausible()

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        trackEvent('Needer Register')
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
      setPasswordValidationMessage(
        "Password Invalid. Must be at least 6 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
    } else {
      setPasswordValidationMessage();
      // setPassword(password);
      console.log("password valid");
    }

    if (isValid && isValidPassword) {
      onSignUp();
    }
  };



  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  //credit alex gittemeier https://stackoverflow.com/questions/17439917/regex-to-accept-alphanumeric-and-some-special-character-in-javascript
  // const passwordRegex = /^[A-Za-z0-9_@./#&+-]{6,20}$/;

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  
  
  //credit https://regexr.com/3bfsi
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = () => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage(
        "Password Invalid. Must be 6 characters or longer"
      );
    } else {
      setPasswordValidationMessage();
      // setPassword(password);
      console.log("password valid");
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

  //this is here to circumnavigate the bug where if the info marker is open and the user tries to enter their email they are stopped after enetering one letter and redirected to the infomarker
  // help from https://www.dhiwise.com/post/how-to-use-the-onfocus-event-in-react-for-enhanced-user-interactions
  const [closeInfoWindow, setCloseInfoWindow] = useState(false);

  const handleFocus = () => {
    setCloseInfoWindow(true);
    setTimeout(() => {
      setCloseInfoWindow(false);
    }, 200);
  };


  //credit https://www.youtube.com/watch?v=-YA5kORugeI
  const handleGoogleSignUp = async () => {
    
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        trackEvent('Needer Register')
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
                ? "/AddProfileInfo"
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
  const [isDesktop] = useMediaQuery("(min-width: 500px)");


  const [isIndividual, setIsIndividual] = useState(false)
  const [isBusiness, setIsBusiness] = useState(false)
  const [errorTextVisible, setErrorTextVisible] = useState(false)


  useEffect(() => {
    if (isBusiness === true) {
      setIsIndividual(false) 
    } 
  }, [isBusiness])

  useEffect(() => {
    if (isIndividual === true) {
      setIsBusiness(false)
    }
  }, [isIndividual])

  //credit google sign up button https://chakra-templates.vercel.app/components/social-media-buttons
  //credit google sign in https://www.youtube.com/watch?v=-YA5kORugeI
  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  console.log(isBusiness, isIndividual)

  const handleNextStep = () => {
    if (isBusiness === true) {
      navigate("/BusinessEmailRegister")
    } else if (isIndividual === true) {
      navigate("/NeederEmailRegister")
    } else {
     setErrorTextVisible(true)
    }
  }


  return (
    <>
      {/* <Header props={openModal} /> */}
      <LoggedOutHeader props={openModal} />

<div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex">
<div class="grow px-5">
        <div class="h-full sm:w-[480px] flex flex-col justify-center mx-auto space-y-5">
 
          <div>
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">
              Tell us about yourself!
            </h1>
            <p class="mt-1 text-sm text-gray-500 ">
              We'll make sure you get the perfect set up to meet your needs
            </p>
          </div>
       
          <form>
            <div class="grid grid-cols-2 gap-3">
            
              <label for="hs-pro-gpromf" class="relative py-3 px-4 flex border border-transparent rounded-xl cursor-pointer focus:outline-none">
                <input  onChange={(e) => setIsBusiness(e.target.checked)} type="radio" id="hs-pro-gpromf" class="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 rounded-xl cursor-pointer appearance-none focus:ring-white checked:border-2 checked:border-sky-500 checked:hover:border-sky-500 checked:focus:border-sky-500 checked:bg-none checked:text-transparent disabled:opacity-50 disabled:pointer-events-none 

                before:absolute before:top-3.5 before:end-3.5 before:border before:border-gray-200 before:size-5 before:rounded-full " value="Free" name="hs-pro-gpromn"  />
                <span class="peer-checked:flex hidden absolute top-4 end-4">
                  <span class="block size-5 flex justify-center items-center rounded-full bg-sky-400">
                    <svg class="flex-shrink-0 size-3 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                </span>
                <span class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6  mb-4 sm:mb-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
</svg>

                  
                  <span class="block font-semibold text-gray-800 ">
                    Business
                  </span>
                  <span class="block text-sm text-gray-500 ">
                    I am a company looking to hire someone for a full-time or part-time role
                  </span>
                </span>
              </label>
          
              <label for="hs-pro-gproms" class="relative py-3 px-4 flex border border-transparent rounded-xl cursor-pointer focus:outline-none">
                <input  onChange={(e) => setIsIndividual(e.target.checked)} type="radio" id="hs-pro-gproms" class="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 rounded-xl cursor-pointer appearance-none focus:ring-white checked:border-2 checked:border-sky-500 checked:hover:border-sky-500 checked:focus:border-sky-500 checked:bg-none checked:text-transparent disabled:opacity-50 disabled:pointer-events-none 

                before:absolute before:top-3.5 before:end-3.5 before:border before:border-gray-200 before:size-5 before:rounded-full " value="Startup" name="hs-pro-gpromn" />
                <span class="peer-checked:flex hidden absolute top-4 end-4">
                  <span class="block size-5 flex justify-center items-center rounded-full bg-sky-400">
                    <svg class="flex-shrink-0 size-3 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                </span>
                <span class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mb-4 sm:mb-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>

                  <span class="block font-semibold text-gray-800 ">
                    Individual
                  </span>
                  <span class="block text-sm text-gray-500 ">
                    I'm an individual who needs a general task completed (i.e. landscaping, general repairs)
                  </span>
                </span>
              </label>
            
              
          
            
            </div>

            <button onClick={() => handleNextStep()} type="button" class="mt-4 sm:mt-6 py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none ">
              Continue
            </button>
            {errorTextVisible ? ( <span class="text-center block text-md text-red-500 ">
                    You must select an option before continuing
                  </span>) : (null)}
         
          </form>
        
        </div>
      </div>
  
 

    {isDesktop ? ( <div class="w-full rounded-lg ml-6">
    {/* <Flex flex={1}> */}

    <NeederRegisterMapScreen props={closeInfoWindow} />
         
      
    </div>) : (null)}
  
 
</div>

{isDesktop ? ( null) : (<div class="w-full rounded-lg mt-10">
   

<NeederRegisterMapScreen props={closeInfoWindow} />
         
      
    </div>)}

      {/* <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Center flexDirection="column">
              <Heading fontSize={"3xl"}>Join Fulfil</Heading>
           
            </Center>
            <Center>
              <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                Get access to contractors by posting the work you need done.
                Browse through contractors to find the right fit.
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
                onFocus={() => handleFocus()}
              />
              {emailValidationBegun === true ? (
                <Text color="red">{validationMessage}</Text>
              ) : null}
            </FormControl>
            <FormControl marginTop="4px">
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
            <Stack spacing={3}>
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
              <Button backgroundColor="white" onClick={() => handleOpenModal()}>
                Already have an account?&nbsp;<Text>Log In</Text>
              </Button>
             
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Box w={{base: "70vw", lg: "60vw"}} h={{base: "50vh", lg: "70vh"}} padding="2" alignContent="center">
            <Box w={{base: "70vw" , lg: "60vw"}} h={{base: "50vh", lg: "70vh"}}>
              <NeederRegisterMapScreen props={closeInfoWindow} />
            </Box>
          </Box>
        </Flex>
      </Stack> */}
    </>
  );
};

export default OnboardingOne;
