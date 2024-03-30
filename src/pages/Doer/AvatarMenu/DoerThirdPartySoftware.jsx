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

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

const DoerThirdPartySoftware= () => {


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
            height="85vh"
            boxShadow="lg"
            rounded="lg"
            padding="8"
              overflowY="scroll"
          >
       
      
              
           
             
            <Center>
                <Heading size="lg" marginTop="16px" marginRight="45px">
                 Privacy Policy
                </Heading>
                </Center>
                <Text marginTop="8">
               Place here when done
                </Text>
               
            


             
           
           
              </Box>
      </Flex>
    </>
  );
};

export default DoerThirdPartySoftware;
