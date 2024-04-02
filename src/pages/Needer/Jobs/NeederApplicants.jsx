import React, { useState, useEffect } from "react";
import NeederHeader from "../NeederHeader";
import NeederDashboard from "../NeederDashboard";
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

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ApplicantCard from "./Applicants/ApplicantCard";

const NeederApplicants = () => {
  const location = useLocation();
  const [jobTitle, setJobTitle] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [jobID, setJobID] = useState(null);
  const [isHourly, setIsHourly] = useState(null)

  useEffect(() => {
    if (location.state === null) {
    } else {
      setJobTitle(location.state.jobTitle);
      setJobID(location.state.jobID);
      setIsHourly(location.state.isHourly)
    }
  }, [location]);


  const navigate = useNavigate();


  return (
    <>
      <NeederHeader />
      <Box paddingTop="4"  paddingRight="72" height="90vh" >
      <Flex>
        <NeederDashboard />

        <Box
          width="60vw"
          // alignContent="center"
          // justifyContent="center"
          // display="flex"
          // alignItems="baseline"
         
          borderColor="#e4e4e4"
          backgroundColor="white"
          
          height="800px"
          boxShadow="sm"
          rounded="md"
          padding="4"
          overflowY="scroll"
          marginLeft="48"
          marginRight="16"
          //   overflowY="scroll"
        >
  
            <Flex>
              <Heading size="lg" marginTop="16px" >
              Applicants
              </Heading>
           
            </Flex>
            <ApplicantCard props={{jobID, jobTitle, isHourly}}/>
     
        </Box>
      </Flex>
      </Box>
    </>
  );
};

export default NeederApplicants;
