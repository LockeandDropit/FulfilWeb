import React, { useState, useEffect } from "react";

import Header from "../../../components/Header.jsx";
import MapScreen from "../../MapScreen.jsx";
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
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
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

const DoerEmailRegister = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  console.log(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum rhoncus ac arcu vitae tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque augue neque, ullamcorper vitae aliquet vitae, rutrum et mi. Mauris a purus sapien. Etiam elit sapien, condimentum quis imperdiet in, auctor a neque. Donec tincidunt pulvinar neque, ac fermentum metus consectetur sed. Duis consectetur risus ut dui malesuada, ut dapibus sem dictum. Aenean velit risus, viverra non aliquet eget, ultrices id enim. Duis sodales semper velit, ac finibus tortor. Integer viverra tellus lacus, eu feugiat neque fermentum in. Curabitur efficitur vel est sed semper."
  );
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

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const validate = (email) => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
    }
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  const passwordRegex = /^[a-zA-Z]{6,20}$/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = (password) => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
      setPassword(password);
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



  return (
    <>
      <Header />
      <Flex>
        <Box w="33vw" h="90vh" alignContent="center">
          <Center>
            <Flex direction="column" marginLeft="120px">
              <Center>
                <Heading type="blackAlpha" size="lg" marginBottom="16px">
               Create an account
                </Heading>
              </Center>
              {/* <Flex direction="row" alignContent="baseline" marginTop="16px" onClick={() => navigate("/NeederAccountCreation")}>
                  
                  <Heading size="sm" >Find the professional thats right for you. </Heading>
                  <Heading size="sm" marginLeft="4px" color="#01A2E8">Get started</Heading>
                  <ArrowForwardIcon marginTop="2px"/>
                </Flex> */}{" "}
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  borderColor="grey"
                  borderWidth=".25px"
                  type="email"
                  value={email}
                  onChange={(e) => validate(e.target.value)}
                  width="360px"
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
                    onChange={(e) => validatePassword(e.target.value)}
                    width="360px"
                  />
                  <InputRightElement>
                    <ViewIcon onClick={() => handlePasswordVisible()} />
                  </InputRightElement>
                </InputGroup>
                {passwordValidationBegun === true ? (
                  <Text color="red">{passwordValidationMessage}</Text>
                ) : null}
              </FormControl>
              <Button
                backgroundColor="#01A2E8"
                color="white"
                _hover={{ bg: "#018ecb", textColor: "white" }}
                marginTop="32px"
                onClick={() => onSignUp()}
              >
               Sign up{" "}
                <ArrowForwardIcon
                  marginTop="2px"
                  marginLeft="4px"
                  boxSize={6}
                />
              </Button>

              
            </Flex>
          </Center>
        </Box>
        <Center>
          <Box w="66vw" h="90vh" padding="16" alignContent="center">
            <Box
            
              w="66vw"
              h="88vh"
              marginLeft="80px"
            >
              <MapScreen />
            </Box>
          </Box>
        </Center>
      </Flex>

      {/* <Center>

      <Box width="320px">
        <InputGroup size="lg" width="320px">
          <Input placeholder="mysite" />
          <Button   backgroundColor="#01A2E8" color="white"  onClick={() => navigate(`/MapScreen`)}>Search</Button>
        </InputGroup>
      </Box>
      </Center> */}
      {/* <Categories /> */}
    </>
  );
};

export default DoerEmailRegister;
