import React from "react";
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Text, Box, Container } from "@chakra-ui/react";
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
  deleteDoc,
} from "firebase/firestore";
import { ChannelFilters, ChannelOptions, ChannelSort, User } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  SearchBar,
  Thread,
  Window,
  useChatContext,
  InfiniteScroll,
  useChannelStateContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";

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



const NeederChannelHireHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHired, setIsHired] = useState();

  const [jobID, setJobID] = useState();
  const [jobTitle, setJobTitle] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState();
  const [jobOffered, setJobOffered] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState();
  const [isHourly, setIsHourly] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);

  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        // console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const { channel, watchers } = useChannelStateContext();

  const [intermediateIDs, setIntermediateIDs] = useState(null);
  const [bothIDs, setBothIDs] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null);
  const [applicantFirstName, setApplicantFirstName] = useState(null);

  useEffect(() => {
    getChannels();
  }, [channel]);
  const [middleMembers, setMiddleMembers] = useState(null);

  const getChannels = async () => {
    const channels = await channel.queryMembers({});

    setMiddleMembers(channels.members);
  };

  useEffect(() => {
    let ids = [];

    if (middleMembers !== null) {
      middleMembers.map((middleMembers) => {
        ids.push(middleMembers.user.id);
        if (middleMembers.role === "member") {
          setApplicantFirstName(middleMembers.user.name);
        } else {
        }
      });
    } else {
    }

    setBothIDs(ids);
  }, [middleMembers]);

  useEffect(() => {
    // it works but I got a bit lost in the weeds on this one boys
    let results = [];
    if (intermediateIDs !== null) {
      for (var key in intermediateIDs) {
        if (intermediateIDs.hasOwnProperty(key)) {
          results.push(intermediateIDs[key].id);
        }
        setBothIDs(results);
      }
    } else {
      // console.log("duoh!");
    }
  }, [intermediateIDs]);

  const [applicantID, setApplicantID] = useState();

  useEffect(() => {
    if (bothIDs !== null) {
      bothIDs.map((x) => {
        if (x !== userID) {
          console.log("applicant", x);
          setApplicantID(x);
        } else {
        }
      });
    } else {
    }
  }, [bothIDs]);

  const [finalBlock, setFinalBlock] = useState([]);
  const [readyToSet, setReadyToSet] = useState(null);

  const [intermediateBlockReady, setIntermediateBlockReady] = useState(false);
  const [messageBlockReady, setMessageBlockReady] = useState(false);
  const [finalBlockReady, setFinalBlockReady] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const collectionRef = collection(db, "Messages");
    const q = query(collectionRef);

    let finalBlock = [];

    onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        if (
          doc._document.data.value.mapValue.fields.applicantID.stringValue ===
            applicantID &&
          doc._document.data.value.mapValue.fields.employerID.stringValue ===
            userID &&
          doc._document.data.value.mapValue.fields.jobTitle.stringValue ===
            channel.data.name
        ) {
          console.log(
            doc._document.data.value.mapValue.fields.jobTitle.stringValue
          );

          console.log("checking 2 ", doc._document.data.value.mapValue.fields);
          setFinalBlock([
            ...finalBlock,
            doc._document.data.value.mapValue.fields,
          ]);
          setApplicantFirstName(
            doc._document.data.value.mapValue.fields.applicantFirstName
              .stringValue
          );
          setJobTitle(
            doc._document.data.value.mapValue.fields.jobTitle.stringValue
          );
          setJobOffered(
            doc._document.data.value.mapValue.fields.jobOffered.booleanValue
          );
          setConfirmedRate(
            doc._document.data.value.mapValue.fields.confirmedRate.integerValue
          );
          setIsHourly(
            doc._document.data.value.mapValue.fields.isHourly.booleanValue
          );
          setIsHired(
            doc._document.data.value.mapValue.fields.isHired.booleanValue
          );
          // setNeedsDeposit(
          //   doc._document.data.value.mapValue.fields.needsDeposit.booleanValue
          // );
          setIsVolunteer(
            doc._document.data.value.mapValue.fields.isVolunteer.booleanValue
          );
          setJobID(doc._document.data.value.mapValue.fields.jobID.stringValue);
          setEmployerFirstName(
            doc._document.data.value.mapValue.fields.employerFirstName
              .stringValue
          );
        } else {
          console.log("either or");
        }
      });
    });
  }, [channel, userID, applicantID]);

  console.log(channel.data.name, userID, applicantID);

  console.log("ss", jobID);

  console.log("This is selected channel", channel);

  const deleteApplicant = () => {
    deleteDoc(
      doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        jobTitle,
        "Applicants",
        applicantID
      )
    )
      .then(async () => {
        //Employer removed applicant from list, retunrs to list of applicants for Posted Job
        alert("Applicant Removed");

        await channel.delete();
        navigate("EmployerChatList");
      })
      .catch((error) => {
        //uh oh
        console.log(error);
      });

    // deleteMessages();
  };

  useEffect(() => {
    if (user != null) {
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        channel.data.name
      );

      getDoc(docRef).then((snapshot) => {
        console.log("current job", snapshot.data());
        if (snapshot.data()) {
          setIsFlatRate(snapshot.data().isFlatRate);
          setIsHourly(snapshot.data().isHourly);
          // setApplicantFirstName(snapshot.data().applicantFirstName)
        } else {
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const sendOffer = () => {
    //// uhh this code will remove the "do you want to hire this person" card in Messages
    // it will give a pop-up that allows them to solidify the amouint being paid. DONE.
    //this will also trigger the same header to accept the amount in the user's chat. INFO SENT
    //cue push notification to user (TO DO)//

    const confirmedRateInt = parseInt(confirmedRate, 10);

    //this needs to be done from worker side?

    // updateDoc(doc(db, "employers", user.uid, "Jobs In Progress", jobTitle), {
    //   confirmedRate: confirmedRateInt,
    // })
    //   .then(() => {
    //     console.log("all good");
    //     setModalVisible(false);
    //     alert("offer sent!");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    updateDoc(doc(db, "Messages", jobID), {
      jobOffered: true,
      confirmedRate: confirmedRateInt,
      isHourly: isHourly,
      applicationSent: true,
      isHired: false,
    })
      .then(() => {
        console.log("all good");
        if (isHourly === true) {
          onClose();
        } else {
        }
        if (isFlatRate === true) {
          onCloseFlatRate();
        } else {
        }
        alert("offer sent!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //data for dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value != null) {
      setConfirmedRate(value);
    } else {
    }
  }, [value]);

  const dataLoaded = true;

  useEffect(() => {
    console.log("confirmedRate", confirmedRate);
  });

  useEffect(() => {
    //get rid of useEffect that calls this data from FB. Check if is hourly, then set isFlat rate based off of that. This will negate that weird crash???

    if (isHourly === true) {
    } else {
      setIsFlatRate(true);
    }
  }, [isHourly]);

  const handleModalOpen = () => {
    if (isHourly === true) {
      onOpen();
    } else {
    }
    if (isFlatRate === true) {
      onOpenFlatRate();
    } else {
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFlatRate,
    onOpen: onOpenFlatRate,
    onClose: onCloseFlatRate,
  } = useDisclosure();

  //combo of https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers && maybe https://stackoverflow.com/questions/11197549/regular-expression-limit-string-size
  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,6}$/;

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);

  //
  const handleConfirmedRateChange = (confirmedRate) => {
    setConfirmedRate(confirmedRate);

    if (flatRateValidationMessage) {
      confirmedRateValidate(confirmedRate);
    }
  };

  const confirmedRateValidate = (confirmedRate) => {
    setFlatRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(confirmedRate);
    if (!isValid) {
      setFlatRateValidationMessage("Please enter valid rate");
      console.log(flatRateValidationMessage);
    } else {
      setFlatRateValidationMessage();
      setConfirmedRate(confirmedRate);
    }
  };

  //credit typeof help https://flaviocopes.com/how-to-check-undefined-property-javascript/

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmedRate);

    if (!rateValid || typeof confirmedRate === "undefined") {
      alert("Please enter valid rate");
    } else {
      sendOffer();
    }
  };

  return (
    <>
      {isHired ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          <Box>
            <Center>
              <Flex direction="column">
                <Box textAlign="center" marginTop="16px" marginBottom="8px">
                  <Text>You've hired this applicant for </Text>
                  <Button
                   variant="ghost"
                  >
                    <Text>{jobTitle}</Text>
                  </Button>
                  <Text>(Note: This applicant will mark the job complete when done, which will then enable you to pay them)</Text>
                </Box>
              </Flex>
            </Center>
          </Box>
        </Card>
      ) : jobOffered ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px">
                <Text>Offer Pending for</Text>
                <Button variant="ghost">
                  <Text>{jobTitle}</Text>
                </Button>
              </Box>
            </Flex>
          </Center>
        </Card>
      ) : (
        <Box>
          <Card
            boxShadow="sm"
            rounded="md"
            borderColor="#e4e4e4"
            borderWidth="1px"
            marginLeft="4px"
            marginRight="4px"
          >
            <Box>
              <Center>
                <Flex direction="column">
                  <Box textAlign="center" marginTop="16px">
                    <Text>Do you want to hire this person for</Text>
                    <Button variant="ghost">
                      <Text>{jobTitle}?</Text>
                    </Button>
                  </Box>
                  <Button
                    colorScheme="blue"
                    marginTop="8px"
                    marginBottom="8px"
                    onClick={() => handleModalOpen()}
                  >
                    Yes
                  </Button>
                  <Button variant="ghost" marginBottom="8px">
                    No
                  </Button>
                </Flex>
              </Center>

              {/* {isHourly ? (
                <Text>${confirmedRate}/hr</Text>
              ) : isVolunteer ? (
                <Text> No Charge</Text>
              ) : (
                <Text> ${confirmedRate} total </Text>
              )} */}
            </Box>
          </Card>
        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offer Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <FormLabel marginTop="8" width>
                Enter your offer
              </FormLabel>
              <Flex>
                <Heading size="sm" marginTop="8px">
                  {" "}
                  $
                </Heading>
                <Input
                  marginLeft="8px"
                  width="240px"
                  placeholder="Enter offer here"
                  onChange={(e) => confirmedRateValidate(e.target.value)}
                />
              </Flex>
              {flatRateValidationBegun === true ? (
                <Text color="red" marginLeft="32px">
                  {flatRateValidationMessage}
                </Text>
              ) : null}
            </>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => checkLength()}>Send Offer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenFlatRate} onClose={onCloseFlatRate} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offer Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <FormLabel marginTop="8" width>
                Enter your offer
              </FormLabel>
              <Flex>
                <Heading size="sm" marginTop="8px">
                  {" "}
                  $
                </Heading>
                <Input
                  marginLeft="8px"
                  width="240px"
                  placeholder="Enter offer here"
                  onChange={(e) => confirmedRateValidate(e.target.value)}
                />
              </Flex>
              {flatRateValidationBegun === true ? (
                <Text color="red" marginLeft="32px">
                  {flatRateValidationMessage}
                </Text>
              ) : null}
            </>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseFlatRate}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => checkLength()}>
              Send Offer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NeederChannelHireHeader;
