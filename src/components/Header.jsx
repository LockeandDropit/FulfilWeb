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
} from "@chakra-ui/react";
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
  return (
    <>
    <div className="header">
      <div className="headerLogo" onClick={() => navigate(`/`)}>
        <img marginTop="4px" src={fulfil180} alt="Fulfil Logo"></img>
      </div>

      <div className="headerRight">
        <Button backgroundColor="white" onClick={() => navigate("/NeederEmailRegister")}>Post a Job</Button>
        {/* <Button backgroundColor="white">Categories</Button> */}
        <Button backgroundColor="white" onClick={() => navigate(`/DoerEmailRegister`)} marginRight="8px">Become a Doer</Button>
      
       
       
        <Button backgroundColor="#01A2E8" color="white"     _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => onOpen()} marginRight="4" width="160px">Log In</Button>
      </div>
    </div>

    <Modal isOpen={isOpen} onClose={() => handleClose()}>
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
                }}     onClick={() => validate()}>
                Sign in
              </Button>
              {passwordValidationBegun === true ? (
                <Text color="red" textAlign="center">{passwordValidationMessage}</Text>
              ) : null}
              <Text align="center" marginTop="2" color={'gray.500'}>or</Text>
              <Button backgroundColor="white" textColor="#01A2E8"  onClick={() => onClose()}>Register</Button>
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
