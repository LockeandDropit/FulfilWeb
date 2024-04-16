import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";

import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import fulfil180 from "../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

const Header = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";


  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);


  const logIn = () => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
   
    // New sign-in will be persisted with local persistence.
    signInWithEmailAndPassword(auth, email, password).then(
      (response) => {
        // setLoggingIn(true);

        //stream chat log in
        const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

      
        // Signed in
        // setCurrentUser(response.user.uid)
        setIsSignedIn(true);
        const currentUser = response.user.uid;

        chatClient.connectUser({id: response.user.uid}, chatClient.devToken(response.user.uid));
        console.log("userConnected!", chatClient._user.id);
        // const docRefUsers = doc(db, "users", response.user.uid);
        // const docRefEmployers = doc(db, "employers", response.user.uid);
        console.log("current user", currentUser);
        // Thanks Jake :)
        Promise.all([
          getDoc(doc(db, "users", response.user.uid)),
          getDoc(doc(db, "employers", response.user.uid)),
        ])
          .then((results) =>
            navigate(
              (results[0]._document !== null &&
                results[0]._document.data.value.mapValue.fields.isEmployer) 
                ? "/DoerMapScreen"
                : "/NeederMapScreen"
            )
       
          )
          .catch(console.log("issue"));
      }
    )
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  })
 

  // template credit simple log in card https://chakra-templates.vercel.app/forms/authentication

  };
  return (
    <>
    <div className="header">
      <div className="headerLogo" onClick={() => navigate(`/`)}>
        <img marginTop="4px" src={fulfil180} alt="Fulfil Logo"></img>
      </div>

      <div className="headerRight">
        <Button backgroundColor="white" onClick={() => navigate("/NeederEmailRegister")}>Post A Job</Button>
        {/* <Button backgroundColor="white">Categories</Button> */}
        <Button backgroundColor="white" onClick={() => navigate(`/DoerEmailRegister`)} marginRight="8px">Become A Doer</Button>
      
       
       
        <Button backgroundColor="#01A2E8" color="white"     _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => onOpen()} marginRight="4" width="160px">Log In</Button>
      </div>
    </div>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <Flex
      minH={'60vh'}
      align={'center'}
      justify={'center'}
     >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
         
        </Stack>
        <Box
          rounded={'lg'}
      
          p={8}>
          <Stack spacing={4}>
          <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
              borderColor="grey"
               borderWidth=".5px"
                type="email"
                value={email}
                onChange={handleInputChange}
             
              />
              {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl >
              <FormLabel>Password</FormLabel>
              <Input
                type="email"
                borderColor="grey"
                borderWidth=".5px"
                value={password}
                onChange={handlePasswordInputChange}
            
              />
              {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
              
              </Stack>
              <Stack spacing={0}>
              <Button
                 bg="#01A2E8"
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}     onClick={() => logIn()}>
                Sign in
              </Button>
              <Text align="center" marginTop="2" color={'gray.500'}>or</Text>
              <Button backgroundColor="white" textColor="#01A2E8"  onClick={() => navigate("/NeederEmailRegister")}>Register</Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
        </ModalContent>
      </Modal>
    
    </>
  );
};

export default Header;
