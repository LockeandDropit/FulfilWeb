import React, { useState, useEffect } from "react";
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";

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

const NeederPaymentHistory = () => {
  const [completedJobs, setCompletedJobs] = useState(null);

  //validate & set current user
  const [hasRun, setHasRun] = useState(false);

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
  const [user, setUser] = useState();

  //define navigation capabilities
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Past Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          setCompletedJobs(0);
        } else {
          setCompletedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [seeMore, setSeeMore] = useState(false)

  return (
    <>
      <NeederHeader />

      <Flex justifyContent="center" >
        <Box position="absolute" left="0">
          <NeederDashboard />
        </Box>
     
       
        <Box
             w={{base: "100vw", lg: "36vw"}}
             alignItems="center"
             alignContent="center"
             justifyContent="center"
        
             height={{base: "100vh", lg: "90vh"}}
          boxShadow=""
          rounded="lg"
          padding="8"
          overflowY="scroll"
        >
       
            <Heading size="lg" marginTop="16px">
              Payment History
            </Heading>

            {!completedJobs ? (
              <Text>Nothing here yet!</Text>
            ) : (
              completedJobs?.map((completedJobs) => (
                <div>
                  <Card
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                    variant="outline"
                    width="auto"
                   
                    height="auto"
                    marginTop="16px"
                    boxShadow=""
                    rounded="lg"
                  >
                    <Stack>
                      <CardBody>
                        <Heading size={{base: "md" , lg: "md"}}>
                          {completedJobs.jobTitle}
                        </Heading>
                        <Heading
                          size="sm"
                          position="absolute"
                          right="10"
                          top="5"
                        >
                          Total Pay ${completedJobs.confirmedRate}
                        </Heading>
                        <Heading size="sm" marginTop="0">
                          {completedJobs.city}, MN
                        </Heading>

                        <Heading size="sm" marginTop="2">
                          Description
                        </Heading>
                        <Text>{completedJobs.description}</Text>
                        <Heading size="sm" marginTop="8">
                          Requirements
                        </Heading>
                        {completedJobs.requirements ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {completedJobs.requirements}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : (
                          <Text>No requirements listed</Text>
                        )}

                        {completedJobs.requirements2 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {completedJobs.requirements2}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        {completedJobs.requirements3 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {completedJobs.requirements3}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        <Heading size="sm" marginTop="2">
                          Additional Notes
                        </Heading>
                        {completedJobs.niceToHave ? (
                          <Text>{completedJobs.niceToHave}</Text>
                        ) : (
                          <Text>Nothing listed</Text>
                        )}
                      </CardBody>
                      {/* <CardFooter>
    <Button colorScheme='blue'>View here</Button> <Button colorScheme='blue'>View here</Button>
  </CardFooter> */}
                    </Stack>
                  </Card>
                </div>
              ))
            )}
        
        </Box>
      </Flex>
    </>
  );
};

export default NeederPaymentHistory;
