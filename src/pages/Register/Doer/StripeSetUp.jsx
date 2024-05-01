import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image,
  Spinner,
  Progress
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

import smallStripe from "../../../images/smallStripe.png";

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

  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState(null);

  console.log(email, password);

  //Stripe onboarding

  const [stripeIDToFireBase, setStripeIDToFireBase] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [stripeID, setStripeID] = useState(null);

  const [sessionURL, setSessionURL] = useState(null);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        // setUserEmail(currentUser.email);
        // console.log(currentUser.uid);
      });
      setHasRun(true);
      // setLoading(false);
    } else {
    }
  }, []);

  const initializeOnboarding = async () => {
    //setLoadingTrue for button once clicked to allow for redirect
    setPaymentsLoading(true);
    const response = await fetch(
      "https://fulfil-api.onrender.com/create-stripe-account-web",
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
    console.log("this is ID", accountID);

    // setOnboardURL(accountLink.url);
    setStripeID({ stripeID: accountID });
    setStripeIDToFireBase(accountID);

    setSessionURL(accountLink.url);

    //help from https://codefrontend.com/reactjs-redirect-to-url/#navigating-to-an-external-page-in-react
    // setTimeout(() => {
    //   // setPaymentsLoading(false);
    //   window.location.replace(accountLink.url);
    // }, 1000);

    return { accountLink, error };
  };

  useEffect(() => {
    if (sessionURL) {
      window.location.replace(sessionURL);
    }
  }, [sessionURL]);

  useEffect(() => {
    if (stripeIDToFireBase !== null && user !== null) {
      updateDoc(doc(db, "users", user.uid), {
        stripeID: stripeIDToFireBase,
      })
        .then(() => {
          //all good
          console.log("ID submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    }
  }, [stripeID, user]);

  return (
    <>
      <Header />

      <Center  >
    
        <Box
        
          borderColor="#E3E3E3"
          height="auto"
          boxShadow="md"
          rounded="md"
          padding="8"
          width="33vw"
          // height="80vh"
        >
          
          
          <Progress hasStripe value={75} /> 
            <Flex direction="column" marginTop="24px">
              
              <Heading size="md">Lets make sure you get paid</Heading>
        
           
            {/* <Image src={smallStripe}></Image> */}
            <Box width="25vw" marginTop="16px">
         
                <Text>
                  We use Stripe, a third-party payment processor, to handle all
                  payment transactions to ensure the safety and security of all
                  of our users. If you choose to skip this step now you can complete it later by accessing your "My Account".
                </Text>
           
            </Box>
            <Center flexDirection="column">
          <Box marginLeft="140px" marginTop="16px">
            {paymentsLoading ? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#018ecb"
                size="lg"
                marginLeft="auto"
                marginRight="28"
                marginBottom="8px"
              />
            ) : (
              <Button
              backgroundColor="#01A2E8"
                 marginTop="24px"
                  textColor="white"
                marginBottom="8px"
                _hover={{ bg: "#018ecb", textColor: "white" }}
                width="240px"
                // onClick={() => logIn()}
                onClick={() => initializeOnboarding()}
              >
                Begin Onboarding
              </Button>
            )}

            <Button
              backgroundColor="white"
                 
              textColor="#01A2E8"
              marginBottom="24px"
              width="240px"
              // onClick={() => logIn()}
              onClick={() => navigate("/DoerMapScreen")}
            >
              I'll do this later
            </Button>
            
          </Box>
          </Center>
          </Flex>
        </Box>
        
      </Center>
      
    </>
  );
};

export default StripeSetUp;
