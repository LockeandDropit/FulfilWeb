import React from "react";
import { useState, useEffect } from "react";
import NeederHeader from "./NeederHeader";
import NeederDashboard from "./NeederDashboard";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Editable
} from "@chakra-ui/react";

import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
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

const NeederNewProfile = () => {
  const [user, setUser] = useState(null);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);
  
  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("new pp", imageList[0].data_url);
    setImages(imageList);
    setProfilePicture(imageList[0].data_url);
  };

  const uploadToFirebase = async () => {
    const storage = getStorage();
    const pictureRef = ref(
      storage,
      "employers/" + user.uid + "/profilePicture.jpg"
    );
    console.log("images", images);
    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images[0].data_url);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {
      console.log(snapshot);
    });

    // onCloseAvatar()
  };

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

  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userBio, setUserBio] = useState();
  const [userState, setUserState] = useState();
  const [userExperience, setUserExperience] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userCity, setUserCity] = useState();
  const [individualReviews, setIndividualReviews] = useState(null);

  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);
        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);
        if (snapshot.data().bio) {
            setUserBio(snapshot.data().bio);
          } else {
            console.log("orrr", snapshot.data().bio);
          }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
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
            // borderWidth="2px"
            borderColor="#E3E3E3"
            // borderLeftWidth="4px"
            // borderRightWidth="4px"
            height="auto"
            boxShadow="md"
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
              <Center flexDirection="column">
      
        <Avatar
                bg="#01A2E8"
                size="2xl"
                src={
                  profilePicture ? profilePicture : images ? images : <Avatar />
                }
              />

              <Heading size="lg">
                {" "}
                {userFirstName} {userLastName}
              </Heading>
              <Heading size="md">
                {" "}
                {userCity}, {userState}
              </Heading>
                <Heading size="lg" marginTop="16px" marginRight="545px">
                  About Me
                </Heading>

                <Button
                  onClick={onOpen}
                  // position="absolute"
                  // right="0"
                  marginTop="8px"
                  marginRight="42px"
                  backgroundColor="white"
                  textColor="#01A2E8"
                >
                  Edit
                </Button>
              
              <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                // variant="outline"
                width="800px"
                // borderWidth="2px"
                // borderLeftWidth="4px"
                // borderRightWidth="4px"
                // borderColor="#E3E3E3"
                // boxShadow="lg"
                // rounded="lg"
                height="auto"
                // marginTop="32px"
                // padding="6"
              >
                <Stack>
                  <CardBody>
                    <Editable
                      textAlign="flex-start"
                      // value={userBio ? userBio : " "}
                      fontSize="md"
                      height="auto"
                      width="auto"
                      isPreviewFocusable={false}
                      //help from my man RubenSmn. Docs aren't clear the Editable component was the one that needed the onSubmit prop https://stackoverflow.com/questions/75431868/chakra-editable-component-does-not-submit-when-input-blurs
                      // onSubmit={() => handleSubmit()}
                    >
                      {/* <Flex direction="row">
                        <Heading size="md">Bio</Heading>
                        <Button
                          onClick={onOpenBio}
                          position="absolute"
                          right="0"
                          top="3"
                          marginRight="42px"
                          backgroundColor="white"
                          textColor="#01A2E8"
                        >
                          Edit
                        </Button>
                      </Flex> */}
                      {/* <EditablePreview /> */}
                      {/* Here is the custom input */}
                      <Text
                        aria-multiline="true"
                        textAlign="flex-start"
                        height="auto"
                        width="700px"
                        marginBottom="32px"
                      >
                        {userBio ? userBio : <Text>Add your bio here</Text>}
                      </Text>
                      {/* <EditableControls />{" "} */}

                      {/* <EditableControls /> */}
                    </Editable>
                  </CardBody>
                </Stack>
              </Card>
              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader fontSize="16px">Edit Bio</ModalHeader>
                  <ModalCloseButton />
                  <ModalHeader>About Me</ModalHeader>
                  <Textarea
                    defaultValue={userBio}
                    height="240px"
                    onChange={(e) => setUpdatedBio(e.target.value)}
                  ></Textarea>

                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      colorScheme="blue"
                    //   onClick={() => updateUserProfileFirestore()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              </Center>
              </Box>

      </Flex>
    </>
  );
};

export default NeederNewProfile;
