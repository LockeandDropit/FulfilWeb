import React, { useState, useEffect } from "react";
import NeederHeader from "../../Needer/NeederHeader";
import NeederDashboard from "../../Needer/NeederDashboard";

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

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";


const NeederTaxAgreement = () => {
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState();
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserEmail(currentUser.email);
        console.log(currentUser.uid);
      });
      setHasRun(true);
      setLoading(false);
    } else {
    }
  }, []);

  const agreeAndNavigate = () => {


    updateDoc(doc(db, "employers", user.uid), {
      TaxAgreementConfirmed: true,
    });

    navigate("/NeederAccountManager");
  };
  return (
    <>
      <NeederHeader />

      <Flex>
        <NeederDashboard />
      
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
            <Center flexDirection="column">
      
              
           
             
        
                <Heading size="lg" marginTop="16px">
                Tax Agreement
                </Heading>

                <Text marginTop="32px">
                By continuing I agree and understand that I am a 1099 contractor
          and not an employee of Fulfil.
                </Text>
                <Text marginTop="8px">
                By continuing I verify that I am 18 years of age or older.
                </Text>
       

              <Button colorScheme="blue" marginTop="16px" onClick={() => agreeAndNavigate()}> Agree & Continue</Button>


             
           
              </Center>
              </Box>
      </Flex>
    </>
  );
};

export default NeederTaxAgreement;
