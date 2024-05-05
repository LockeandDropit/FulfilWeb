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
  useDisclosure,
  InputGroup,
  InputRightElement,
  Center
} from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";
import React from "react";
import { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
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
import { FcGoogle } from "react-icons/fc";
import { useMediaQuery } from '@chakra-ui/react'


const Header = (props) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenWrongInfo, onOpen: onOpenWrongInfo, onClose: onCloseWrongInfo } = useDisclosure()

  useEffect(() => {
    if (props.props === true) {
      onOpen()
    }
  }, [props])

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
   
        // const docRefUsers = doc(db, "users", response.user.uid);
        // const docRefEmployers = doc(db, "employers", response.user.uid);
      
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
          .catch();
      }
    )
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      setPasswordValidationMessage(
        "Oops! Wrong email or password"
      );
    });
  })
 

  // template credit simple log in card https://chakra-templates.vercel.app/forms/authentication

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

  const [visibleToggle, setVisibleToggle] = useState("password");

  const handlePasswordVisible = () => {
    if (visibleToggle === "password") {
      setVisibleToggle("email");
    } else if (visibleToggle === "email") {
      setVisibleToggle("password");
    }
  };
  
  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  //credit alex gittemeier https://stackoverflow.com/questions/17439917/regex-to-accept-alphanumeric-and-some-special-character-in-javascript
  // const passwordRegex = /^[A-Za-z0-9_@./#&+-]{6,20}$/;

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  const passwordRegex = /[^\>]*/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

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
      
    } else {
      setPasswordValidationMessage();
  
    }

    if (isValid && isValidPassword) {
      logIn();
    }
  };


  const handleClose = () => {
    onClose() 
  }

  const handleModalClose = () => {
    onClose()
    navigate("/NeederEmailRegister")
  }
  const [isDesktop] = useMediaQuery('(min-width: 500px)')

  return (
    <>
    <Box flexDirection="row" display="flex" alignContent="center" alignItems="center" >
      <Box onClick={() => navigate(`/`)}><img marginTop="4px" src={fulfil180} alt="Fulfil Logo"></img></Box>
     
    {isDesktop ? ( <Box marginLeft="auto">
        <Button backgroundColor="white" onClick={() => navigate("/NeederEmailRegister")} fontSize={{base: "0px", md: "md"}}>Post a Job</Button>
        {/* <Button backgroundColor="white">Categories</Button> */}
        <Button backgroundColor="white" onClick={() => navigate(`/DoerEmailRegister`)} marginRight="8px" fontSize={{base: "0px", md: "md"}}>Become a Doer</Button>
      
       
       
        <Button backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => onOpen()} marginRight="4" width="160px">Log In</Button>
        </Box>) : ( <Box marginLeft="auto">
       
      
       
       
        <Button backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => onOpen()} marginRight="4" width="160px">Log In</Button>
        </Box>)}
    
      </Box>

    <Modal isOpen={isOpen} onClose={() => handleClose()} size={{base: "xs" , lg: "md"}}>
        <ModalOverlay />
        <ModalContent>
        <Flex
      minH={'60vh'}
      align={'center'}
      justify={'center'}
     >
      <Stack spacing={6} mx={'auto'} maxW={'lg'} >
        <Stack align={'center'}>
          
        <Heading fontSize={{base: "xs" , lg: "4xl"}} textColor="white">Sign in to your account</Heading>
          <Heading fontSize={{base: "2xl" , lg: "3xl"}}>Sign in to your account</Heading>
         
        </Stack>
        <Box
          rounded={'lg'}
      
          p={4}>
          <Stack spacing={2}>
          <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
              borderColor="grey"
               borderWidth=".5px"
         
                type="email"
                value={email}
                onChange={handleInputChange}
             
              />
              {emailValidationBegun === true ? (
                <Text color="red">{validationMessage}</Text>
              ) : null}
            </FormControl>
            <FormControl >
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
            </FormControl>
            <Stack spacing={4} mt={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
              
              </Stack>
              <Stack spacing={1}>
              <Button
                 bg="#01A2E8"
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}     onClick={() => validate()}>
                Sign in
              </Button>
              <Button
              marginTop={2}
                w={"full"}
                variant={"outline"}
                leftIcon={<FcGoogle />}
                onClick={() => handleGoogleSignUp()}
              >
                <Center>
                  <Text>Sign in with Google</Text>
                </Center>
              </Button>
              <Stack spacing={0} mt={6}>
              <Button backgroundColor="white" onClick={() => handleModalClose()}  position="relative" height="" _hover={{bg: "white"}}>
                Don't have an account?&nbsp;<Text>Register</Text>
              </Button>
              <Button backgroundColor="white" onClick={() => navigate("/DoerEmailRegister")}  position="relative"  height="" _hover={{bg: "white"}} mt={1} >
               Want to become a Doer?&nbsp;<Text textColor="#01A2E8">Click here</Text>
              </Button>
              </Stack>
              {passwordValidationBegun === true ? (
                <Text color="red" textAlign="center">{passwordValidationMessage}</Text>
              ) : null}
              {/* <Text align="center" marginTop="2" color={'gray.500'}>or</Text> */}
              
          
              
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
