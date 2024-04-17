import React, { useState, useEffect } from "react";
import DoerHeader from "../DoerHeader";
import DoerDashboard from "../DoerDashboard";


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
import { v4 as uuidv4 } from "uuid";
import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

const DoerContactForm = () => {

  //validate & set current user
  const [hasRun, setHasRun] = useState(false);

  const [userID, setUserID] = useState(null);
  
  const [userEmail, setUserEmail] = useState(null);
 const [issue, setIssue] = useState(null)
 const [issueID, setIssueID] = useState(null)


  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        setUserEmail(currentUser.email);
       
      });
      setHasRun(true);
    } else {
    }
  }, []);

  useEffect(() => {
    setIssueID(uuidv4());
  }, []);


  const [user, setUser] = useState(null);
  const [issueSubmitted, setIssueSubmitted] = useState(false)

  
 const submitIssue = () => {
   
  if (!issue ) {
    alert("Please fill out all fields before submitting")
  } else {

    setDoc(doc(db, "Complaints", issueID), {
      userID: userID,
      userEmail: userEmail,
      issue: issue
  })
  .then(() => {

    setIssueSubmitted(true)

    })
    .catch((error) => {
      // no bueno
      
    });

  
  }
    
 }
 

  return (
    <>
      <DoerHeader />

      <Flex>
        <DoerDashboard />
      
          <Box
            width="67vw"
            // alignContent="center"
            // justifyContent="center"
            // display="flex"
            // alignItems="baseline"
            borderWidth="2px"
            borderColor="#E3E3E3"
            borderLeftWidth="4px"
            borderRightWidth="4px"
            height="auto"
            boxShadow="lg"
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
            {issueSubmitted ? ( <Center flexDirection="column">
      
              
           
             
           
      <Heading size="lg" marginTop="16px" >
      Thank you for your feedback!
      </Heading>
      <Text width="500px" marginTop="16px">We appreciate your feedback. We will respond within 2 business days.</Text>
     
 
    </Center>) : ( <Center flexDirection="column">
      
              
           
             
           
      <Heading size="lg" marginTop="16px" marginRight="50px">
      Contact Us
      </Heading>
      <Text width="400px" marginTop="16px">Have a concern, question, or complaint? Don't hesitate to reach out and we'll respond as quickly as possible.</Text>

      <Textarea width="560px" height="360" borderWidth="1px" borderColor="black" marginTop="16px" onChange={(e) => setIssue(e.target.value)}></Textarea>
      <Button colorScheme="blue" marginTop="8" width="240px" onClick={() => submitIssue()}>Submit</Button>
     
 
    </Center>)}
           
              </Box>
      </Flex>
    </>
  );
};

export default DoerContactForm;
