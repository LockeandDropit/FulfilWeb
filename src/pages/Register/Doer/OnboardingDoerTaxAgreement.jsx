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

const OnboardingDoerTaxAgreement = () => {
  const navigate = useNavigate();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);

        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);
  // const agreeAndNavigate = () => {
  //   const docRef = doc(db, "users", user.uid);

  //   updateDoc(doc(db, "users", user.uid), {
  //     PrivacyPolicyAgree: true,
  //   });

  //  navigate("/OnboardingDoerIDVerify");
  // };
  const skipAndNavigate = () => {
    const docRef = doc(db, "users", user.uid);

    updateDoc(doc(db, "users", user.uid), {
      TaxAgreementConfirmed: false,
    });

    navigate("/OnboardingDoerIDVerify");
  };

  const agreeAndContinue = () => {
    const docRef = doc(db, "users", user.uid);

    updateDoc(doc(db, "users", user.uid), {
      TaxAgreementConfirmed: true,
    });

    navigate("/OnboardingDoerIDVerify");
  };

  return (
    <>
      <Header />

      <Center>
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
          height="85vh"
          boxShadow="lg"
          rounded="lg"
          padding="8"
          overflowY="scroll"
        >
          <Center>
            <Heading size="lg" marginTop="16px" marginRight="45px">
              Tax Agreement
            </Heading>
          </Center>
          <Text marginTop="8px">
            By continuing I agree and understand that I am a 1099 contractor and
            not an employee of Fulfil.
          </Text>
          <Text marginTop="8px">
            By continuing I verify that I am 18 years of age or older.
          </Text>

          <Center marginTop="16px">
            <Button
              colorScheme="blue"
              width="240px"
              onClick={() => skipAndNavigate()}
            >
              Skip
            </Button>
            <Button
              colorScheme="blue"
              width="240px"
              marginLeft="32px"
              onClick={() => agreeAndContinue()}
            >
              I Agree
            </Button>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default OnboardingDoerTaxAgreement;
