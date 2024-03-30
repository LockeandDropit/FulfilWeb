import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ViewIcon } from "@chakra-ui/icons";

import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CheckIcon,
  CloseIcon,
  EditIcon,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

const StripeSetUp = () => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);

  console.log(email, password)




  //Stripe onboarding
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [stripeID, setStripeID] = useState(null);
  const [stripeActive, setStripeActive] = useState(false);

  const [onboardURL, setOnboardURL] = useState(null);

  const initializeOnboarding = async () => {
    //setLoadingTrue for button once clicked to allow for redirect
    setPaymentsLoading(true)
    const response = await fetch(
      "http://192.168.0.9:3001/create-stripe-account-web",
      // "http://192.168.0.9:3001/test",
      // "https://fulfil-api.onrender.com/create-stripe-account",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { accountLink, error, accountID } = await response.json();

    console.log(JSON.stringify(accountLink));
    // console.log("this is ID", accountID);

    // setOnboardURL(accountLink.url);
    // setStripeID(accountID);


    //help from https://codefrontend.com/reactjs-redirect-to-url/#navigating-to-an-external-page-in-react
    setTimeout(() => {
      
      setPaymentsLoading(false)
      window.location.replace(accountLink.url);
    }, 1000)

    return { accountLink, error };

    
  };

  return (
    <>
      <Header />

      <Center color="white" marginTop="100px">
        <Card
          align="center"
          border="2px"
          borderColor="gray.400"
          borderWidth="1.5px"
          width="33%"
          height="560px"
          boxShadow="lg"
        >
          <CardHeader marginTop="60px">
            <Heading size="lg">Set Up Payments With</Heading>
          </CardHeader>
          <CardBody marginTop="30px">
           
          </CardBody>
          <CardFooter flexDirection="column">
            <Button
              colorScheme="blue"
              marginBottom="24px"
              width="240px"
              // onClick={() => logIn()}
              onClick={() => initializeOnboarding()}
            >
              Begin Onboarding
            </Button>
            <Button
              colorScheme="blue"
              marginBottom="24px"
              width="240px"
              // onClick={() => logIn()}
              onClick={() => navigate("/DoerInProgressList")}
            >
              I'll do this later
            </Button>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
};

export default StripeSetUp;
