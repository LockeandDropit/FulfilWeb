import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Select,
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
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { StreamChat } from "stream-chat";

const DoerAddProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [test, setTest] = useState(null);
  const [isEmployer, setIsEmployer] = useState(true);

  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);
  const showID = () => {
    //  console.log(user.uid)
    console.log("this is the first name", firstName);
  };

  const navigate = useNavigate();



  // create new Chat User
  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const createNewChatUser = async () => {
    await client.connectUser(
      {
        id: user.uid,
        name: firstName,
      },
      client.devToken(user.uid)
    );
  };

  //yeah baby it WORKS. The below connects the user's auth ID with the firebase user document ID.. hopefully this helps in persistant auth and redux.

  //firestore help came from https://www.youtube.com/@NetNinja

  const updateUserProfileFirestore = () => {
    //submit data
    setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      city: city,
      state: state,
      test: test,
      idStreamChat: user.uid,
      isEmployer: true,
      email: user.email,
      streamChatID: user.uid,
      isOnboarded: false,
      emailVerified: false,
      stripeOnboarded: false,
    });
    createNewChatUser()
      .then(() => {
        //all good

        console.log("data submitted, new chat profile created");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

  navigate("/OnboardingDoerUserAgreement");
  };

  // big ty man regex https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  const minLengthRegEx = /^.{1,}$/;

  //cited elsewhere
  const checkLength = () => {
    const firstNameValid = minLengthRegEx.test(firstName);
    const lastNameValid = minLengthRegEx.test(lastName);
    const cityValid = minLengthRegEx.test(city);
    const stateValid = minLengthRegEx.test(state);

    if (!firstName || !lastName || !city || !state) {
      alert("Please fill out all fields");
    } else {
      updateUserProfileFirestore();
    }
  };

  return (
    <>
      <Header />

      <Flex>
        <Center>
          <Box
            width="60vw"
            // alignContent="center"
            // justifyContent="center"
            // display="flex"
            // alignItems="baseline"

            borderColor="#E3E3E3"
            height="auto"
            // boxShadow="md"
            rounded="lg"
            // padding="8"
            paddingLeft="8"
            paddingTop="8"
            paddingRight="8"
            marginLeft="96"
           
            //   overflowY="scroll"
          >
            <Center>
              <Flex direction="column">
                <Heading size="lg">Basic Info</Heading>
                <FormControl isRequired>
                  <FormLabel marginTop="8">First Name</FormLabel>
                  <Input
                    borderColor="black"
                    borderWidth=".5px"
                    placeholder="First Name"
                    width="640px"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <FormLabel marginTop="8">Last Name</FormLabel>
                  <Input
                    placeholder="Last Name"
                    borderColor="black"
                    borderWidth=".5px"
                    width="640px"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel marginTop="4">Enter your city</FormLabel>
                  <Input
                    placeholder="City"
                    borderColor="black"
                    borderWidth=".5px"
                    width="640px"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel marginTop="4">Enter your state</FormLabel>
                  <Input
                    placeholder="State"
                    borderColor="black"
                    borderWidth=".5px"
                    width="640px"
                    onChange={(e) => setState(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  width="240px"
                  marginTop="48px"
                  // bottom="2"
                  // right="500"
                  left="400px"
                  onClick={() => checkLength()}
                  // onClick={() => testButtonNavigate()}
                >
                  Next{" "}
                </Button>
              </Flex>
            </Center>
          </Box>
        </Center>
      </Flex>
    </>
  );
};

export default DoerAddProfileInfo;
