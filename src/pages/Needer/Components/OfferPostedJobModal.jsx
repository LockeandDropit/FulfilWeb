import React from "react";
import { useState, useEffect, useRef } from "react";
import { useJobStore } from "../Chat/lib/jobsStore";
import { useUserStore } from "../Chat/lib/userStore";
import { useChatStore } from "../Chat/lib/chatStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Input,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
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
  snapshotEqual,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";


const OfferPostedJobModal = () => {
  const { job, setJobHiringState } = useJobStore();
  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore()

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFlatRate,
    onOpen: onOpenFlatRate,
    onClose: onCloseFlatRate,
  } = useDisclosure();

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenOffer,
    onOpen: onOpenOffer,
    onClose: onCloseOffer,
  } = useDisclosure();

  useEffect(() => {
    if (job.isHourly === true) {
      //set hourly modal open

      onOpen();
    } else if (job.isFlatRate === true) {
      //setFlat rate modal open

      onOpenFlatRate();
    }
  }, [job]);

  //this is going to handle the db management, updating the that the job has beem offered

  
  const handleSendNewOfferEmail = async () => {
    const response = await fetch(
    
      "https://emailapi-qi7k.onrender.com/sendPaymentCompleteEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: user.email}),
      }
    );

    const { data, error } = await response.json();

    console.log("Any issues?", error)
  }


  const sendOffer = () => {
    //// uhh this code will remove the "do you want to hire this person" card in Messages
    // it will give a pop-up that allows them to solidify the amouint being paid. DONE.
    //this will also trigger the same header to accept the amount in the user's chat. INFO SENT
    //cue push notification to user (TO DO)//

    handleSendNewOfferEmail()


    handleJobState()

    const confirmedRateInt = parseInt(confirmedRate, 10);

    //this needs to be done from worker side?

    //This code can probably go after this is up and working
    updateDoc(doc(db, "Messages", job.jobID), {
      jobOffered: true,
      confirmedRate: confirmedRateInt,
      isHourly: job.isHourly,
      isFlatRate: job.isFlatRate,
      applicationSent: true,
      isHired: false,
    })
      .then(() => {
        console.log("all good");
        if (job.isHourly === true) {
          onClose();
        } else {
        }
        if (job.isFlatRate === true) {
          onCloseFlatRate();
        } else {
        }
        onOpenSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);
  const [confirmedRate, setConfirmedRate] = useState();

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value != null) {
      setConfirmedRate(value);
    } else {
    }
  }, [value]);

  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,6}$/;
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

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmedRate);

    if (!rateValid || typeof confirmedRate === "undefined") {
      alert("Please enter valid rate");
    } else {
      sendOffer();
    }
  };

  const handleJobState = async () => {

    //first pull all data... do I already have it?  

    
    const confirmedRateInt = parseInt(confirmedRate, 10);

        try {
       
          const userIDs = [currentUser.uid, user.uid];
    
          userIDs.forEach(async (id) => {
            const userChatsRef = doc(db, "User Messages", id);
            const userChatsSnapshot = await getDoc(userChatsRef);
    
            if (userChatsSnapshot.exists()) {
              const userChatsData = userChatsSnapshot.data();
    
              const chatIndex = userChatsData.chats.findIndex(
                (c) => c.chatId === chatId
              );
    
              userChatsData.chats[chatIndex].isJobOffered = true;
              userChatsData.chats[chatIndex].confirmedRate = confirmedRateInt;
              userChatsData.chats[chatIndex].isHourly = job.isHourly;
              userChatsData.chats[chatIndex].isHired = false
              userChatsData.chats[chatIndex].isSeen =
                id === currentUser.uid ? true : false;
              userChatsData.chats[chatIndex].updatedAt = Date.now();
    
              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              });

              setJobHiringState(userChatsData.chats)
            }
          });
        } catch (err) {
          console.log(err);
        }
   
  };

  return (
    <div>
      {" "}
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
            <Button colorScheme="blue" onClick={() => checkLength()}>
              Send Offer
            </Button>
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
      <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your offer has been sent.</Text>
            <Text>
              You will receive a notification if the applicant accepts.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseSuccess()}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenOffer} onClose={onCloseOffer} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create An Offer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your offer has been sent.</Text>
            <Text>
              You will receive a notification if the applicant accepts.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseOffer()}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OfferPostedJobModal;
