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
import { Spinner } from "@chakra-ui/react";

import { StreamChat } from "stream-chat";

import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const NeederAccountManager = () => {
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState();
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

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

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    const storage = getStorage();
    const reference = ref(
      storage,
      "employers/" + user.uid + "/profilePicture.jpg"
    );
    if (!reference.service) {
    } else {
      await getDownloadURL(reference).then((response) => {
        setProfilePicture(response);
      });
    }
  };

  const [userFirstName, setUserFirstName] = useState("User");

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [loggingOut, setLoggingOut] = useState(false);

  const postDeleteRequest = () => {
    setDoc(doc(db, "Delete Requests", user.uid), {
      userID: user.uid,
      requestTermination: true,
    });
  };

  //Move to env
  const client = StreamChat.getInstance(
    process.env.REACT_APP_STREAM_CHAT_API_KEY
  );

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenLogOut, onOpen: onOpenLogOut, onClose: onCloseLogOut } = useDisclosure()
  const [unpaidJobs, setUnpaidJobs] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkIfUnpaid = () => {
    const q = query(collection(db, "employers", user.uid, "In Review"));

    onSnapshot(q, (snapshot) => {
      let unpaidDocs = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        if (doc.data()) {
          unpaidDocs.push(doc.data());
        } else {
         
        }
      });
     if (!unpaidDocs || !unpaidDocs.length) {
setUnpaidJobs(null)
     } else {
setUnpaidJobs(unpaidDocs)
     }
    });

   
  }

  const handleConfirmDelete = () => {
    onOpen()
    checkIfUnpaid()
  setTimeout(() => {
setIsLoading(false)
  }, 1000)
  }

  const handleLogOut = async () => {
    setLoading(true);
    postDeleteRequest();
    auth.signOut();
    await client.disconnectUser();

    setTimeout(() => {
     onOpenLogOut()
      navigate("/");
    }, 2000);
  };

  //Onboarding/verification

  const [privacyAgreement, setPrivacyAgreement] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      if (user != null) {
        const docRef = doc(db, "employers", user.uid);

        getDoc(docRef).then((snapshot) => {
          console.log(snapshot.data());
          setPrivacyAgreement(snapshot.data().PrivacyPolicyAgree);

        });
      } else {
        console.log("sospsjs!");
      }
    }, 50);
  }, [user]);






  useEffect(() => {
    if (user !== null && privacyAgreement === true) {
      updateDoc(doc(db, "employers", user.uid), {
        isOnboarded: true,
      });
    } else {
    }
  }, [privacyAgreement]);

  //Stripe onboarding

  const [stripeID, setStripeID] = useState(null);
  const [stripeActive, setStripeActive] = useState(false);

  const [onboardURL, setOnboardURL] = useState(null);





  const [lastName, setLastName] = useState(null)
  const [city, setCity] = useState(null)
  const [state, setState] = useState(null)

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setLastName(snapshot.data().lastName);
        setCity(snapshot.data().city)
        setState(snapshot.data().state)

      });
    } else {
   
    }
  }, [user]);

  //text flex end credit (margin-left: auto) https://www.glennstovall.com/flex-row-end-position/
  return (
    <>
      <NeederHeader />

      <Box width="100vw" height="85vh" alignItems="center" justifyContent="center">
      <Flex justifyContent="center">
        <Box position="absolute" left="0">
        <NeederDashboard />
        </Box>
        {!loading ? (
             <Box justifyContent="center" marginTop="64px">
             <Center >
          <Box
            width="34vw"
            height="auto"
            boxShadow=""
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
      
              <Heading size="md" marginTop="16px">
                Account Settings
              </Heading>
             
              <Heading size="sm" marginTop="16px">
                Name
              </Heading>
              <Text>{userFirstName}{" "}{lastName}</Text>
              <Heading size="sm" marginTop="4px">
                Location
              </Heading>
              <Text>{city},{" "}{state}</Text>
              <Heading size="sm" marginTop="4px">
                E-mail
              </Heading>
              <Text>{userEmail}</Text>
            


            <Box  marginTop="16" marginBottom="64px" flexDirection="column" >
              <Heading size="sm" marginTop="16px">
                Onboarding
              </Heading>
             
                {privacyAgreement ? (
                  <Flex direction="row" marginTop="4">
                    <Text>Privacy Agreement</Text>{" "}
                    <CheckCircleIcon
                      color="green"
                      boxSize={5}
                      marginLeft="auto"
                      marginRight="8"
                      marginTop="0.5"
                    />
                  </Flex>
                ) : (
                  <Flex direction="row" marginTop="4">
                    <Text>Privacy Policy Agreement</Text>{" "}
                    <Button
                      colorScheme="red"
                      height="32px"
                      marginLeft="auto"
                      // variant="ghost"
                      onClick={() => navigate("/DoerUserAgreement")}
                    >
                      update
                    </Button>
                  </Flex>
                )}
              
           
              </Box>
          

            <Center>
              <Button
                colorScheme="red"
                position="absolute"
                bottom="8"
                onClick={() => handleConfirmDelete()}
              >
                Delete Account
              </Button>
            </Center>
           
          </Box>
          </Center>
            </Box>
        ) : (
          <Center>
            {" "}
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              marginTop="240px"
            />
          </Center>
        )}
      </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
       
          {isLoading ? (
           <ModalContent> 
       
           <ModalBody>
          
          <Center>
            {" "}
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
             
            />
          </Center>
        </ModalBody> </ModalContent>) : unpaidJobs ? (
          
            <ModalContent> <ModalHeader>Oops!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
         <Text>Looks like you have one or more pending payments.</Text>
         <Text>Once paid, you can delete your account.</Text>
          </ModalBody>

          <ModalFooter>
          
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Continue
            </Button>
          </ModalFooter> </ModalContent>
          ) : (<ModalContent> <ModalHeader>Are You Sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
         <Text>Are you sure you want to delete your account?</Text>
         <Text>Once deleted, this can not be undone.</Text>
          </ModalBody>

          <ModalFooter>
          <Button variant='ghost' onClick={onClose}>Nevermind</Button>
          <Button colorScheme='red' mr={3} onClick={() => handleLogOut()}>
             Delete my Account
            </Button>
          </ModalFooter> </ModalContent>) }
      </Modal>


      <Modal isOpen={isOpenLogOut} onClose={onCloseLogOut}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <Text> Sorry to see you go! </Text> 
            <Text>We need to double check a few things. You will receive a confirmation email in 2-3 days stating your account has been deleted.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseLogOut}>
              Close
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NeederAccountManager;
