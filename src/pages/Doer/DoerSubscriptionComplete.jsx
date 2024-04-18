import React, { useState, useEffect } from "react";
import DoerHeader from "../Doer/DoerHeader";
import DoerDashboard from "../Doer/DoerDashboard";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
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
  deleteField,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
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

const DoerSubscriptionComplete = () => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const navigate = useNavigate();

  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  //  const [confirmedPrice, setConfirmedPrice] = useState(null);
  const [confirmedPriceUI, setConfirmedPriceUI] = useState(null);
  const [confirmedPrice, setConfirmedPrice] = useState(null);
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setSessionID(snapshot.data().subscriptionID)
        // sessionID.push(
        //   {sessionID: snapshot.data().subscriptionID});
      });
    }
  }, [user]);

  useEffect(() => {
 
//credit and help from https://github.com/pagecow/stripe-subscribe-payments
    if (sessionID) {
      setHasRun(false);
      fetch(
        "http://localhost:80/check-subscription-status", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({sessionID: sessionID}),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);

          console.log("data final retuirn", data);
          if (data.status === "complete") {
            updateDoc(doc(db, "users", user.uid), {
              isPremium: true,
              stripeSubscriptionEmail: data.customer_email
            })

           
          } else {
            //set state true to display that there was something wrong with their subscription
          }
        });
    } else {
    }
  }, [sessionID]);

  const [dateCompleted, setDateCompleted] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/37271356/how-to-get-the-current-date-in-reactnative Irfan wani
    setDateCompleted(new Date().toLocaleString());
  }, []);

  const [ratingLoading, setRatingLoading] = useState(true);

  const [paymentAlertShow, setPaymentAlertShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading === true) {
    return (
      <>
        <DoerHeader />
        <Box paddingTop="4" paddingRight="72" height="90vh">
          <DoerDashboard />
          <Center>
            <Box
              height="33vh"
              width="33vw"
              marginLeft="330px"
              alignContent="center"
              textAlign="center"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Box>
          </Center>
        </Box>
      </>
    );
  }
  return (
    <>
      <DoerHeader />

      <Box paddingTop="4" paddingRight="72" height="90vh">
        <Flex>
          <DoerDashboard />

          <Center flexDirection="column">
            <Box
              height="33vh"
              width="33vw"
              marginLeft="330px"
              alignContent="center"
              textAlign="center"
            >
              <Heading size="md">You're subscribed!</Heading>
              <Text marginTop="8px">You can now display which categories you specialize in on your profile.</Text>
              <Button
                backgroundColor="#01A2E8"
                marginTop="8px"
                color="white"
                _hover={{ bg: "#018ecb", textColor: "white" }}
                onClick={() => navigate("/DoerProfile")}
              >
                Go to my profile 
              </Button>
            </Box>
          </Center>
        </Flex>
      </Box>
    </>
  );
};

export default DoerSubscriptionComplete;
