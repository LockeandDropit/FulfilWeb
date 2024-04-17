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

const DoerPaymentHistory = () => {
  const [completedJobs, setCompletedJobs] = useState(null);

  //validate & set current user
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
       
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
      const q = query(collection(db, "users", user.uid, "Past Jobs"));

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
     
    }
  }, [user]);

  const [seeMore, setSeeMore] = useState(false)

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
          <Center flexDirection="column">
            <Heading size="lg" marginTop="16px" marginRight="545px">
              Payment History
            </Heading>

            {!completedJobs ? (
              <Text>No completed jobs</Text>
            ) : (
              completedJobs?.map((completedJobs) => (
                <div>
                  <Card
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                    variant="outline"
                    width="800px"
                    borderWidth="2px"
                    borderColor="#E3E3E3"
                    borderLeftWidth="4px"
                    borderRightWidth="4px"
                    height="130px"
                    marginTop="16px"
                    boxShadow="lg"
                    rounded="lg"
                  >
                    <Stack>
                      <CardBody>
                        <Heading fontSize="24">
                          {completedJobs.jobTitle}
                        </Heading>
                        <Heading
                          size="sm"
                          position="absolute"
                          right="10"
                          top="6"
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
          </Center>
        </Box>
      </Flex>
    </>
  );
};

export default DoerPaymentHistory;
