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

 //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
      <Header />
      {/* <Flex>
        <Box w="33vw" h="90vh" alignContent="center">
          <Center>
            <Flex direction="column" marginLeft="120px">
              <Center>
                <Heading type="blackAlpha" size="lg" marginBottom="16px">
                  Create an account
                </Heading>
              </Center>
             
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  borderColor="grey"
                  borderWidth=".25px"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
                onClick={() => validate()}
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
            <Box w="66vw" h="88vh" marginLeft="80px">
              <MapScreen />
            </Box>
          </Box>
        </Center>
      </Flex> */}

      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }} marginLeft={16}>
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
              <Button   bg="#01A2E8"
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={() => validate()}>
                Sign up
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={2}>
        <Box w="60vw" h="70vh" padding="8" alignContent="center">
            <Box w="60vw" h="70vh" >
              <MapScreen />
            </Box>
          </Box>
          {/* <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={"/LadderWoman.jpg"}
          /> */}
        </Flex>
      </Stack>
    </>
  );
};

export default DoerEmailRegister;
