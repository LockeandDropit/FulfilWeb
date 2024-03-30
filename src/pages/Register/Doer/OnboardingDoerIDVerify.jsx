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
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

const OnboardingDoerIDVerify = () => {
  const navigate = useNavigate();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState();
  const [IDFrontUploaded, setIDFrontUploaded] = useState(false);
  const [IDBackUploaded, setIDBackUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [callTrigger, setCallTrigger] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);

        getDoc(docRef).then((snapshot) => {
          console.log(snapshot.data().IDBackUploaded);
          setIDFrontUploaded(snapshot.data().IDFrontUploaded);
          setIDBackUploaded(snapshot.data().IDBackUploaded);
        });
      } else {
        console.log("sospsjs!");
      }
    }, 50);
  }, [user, callTrigger]);

  const {
    isOpen: isOpenFront,
    onOpen: onOpenFront,
    onClose: onCloseFront,
  } = useDisclosure();

  const {
    isOpen: isOpenBack,
    onOpen: onOpenBack,
    onClose: onCloseBack,
  } = useDisclosure();

  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("new pp", imageList[0].data_url);
    setImages(imageList[0].data_url);
    // setProfilePicture(imageList[0].data_url)
  };

  const uploadToFirebaseFront = async () => {
    const storage = getStorage();
    const pictureRef = ref(storage, "users/" + user.uid + "/photoIDFront.jpg");
    console.log("images", images);
    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {
      console.log(snapshot);
    });

    updateDoc(doc(db, "users", user.uid), {
      IDFrontUploaded: true,
    });

    setLoading(true);
    setTimeout(() => {
      onCloseFront();
      setCallTrigger("reload please")
      setLoading(false)
    }, 1000);
  };

  const [imagesBack, setImagesBack] = React.useState(null);

  const onChangeBack = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("new pp", imageList[0].data_url);
    setImagesBack(imageList[0].data_url);
    // setProfilePicture(imageList[0].data_url)
  };

  const uploadToFirebaseBack = async () => {
    const storage = getStorage();
    const pictureRef = ref(storage, "users/" + user.uid + "/photoIDBack.jpg");
    console.log("images back", imagesBack);
    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(imagesBack);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {
      console.log(snapshot);
    });

    updateDoc(doc(db, "users", user.uid), {
      IDBackUploaded: true,
    });

    setLoading(true);
    setTimeout(() => {
      onCloseBack();
      setCallTrigger("reload please")
      setLoading(false)
    }, 1000);
  };

  const handleSkip = () => {
    updateDoc(doc(db, "users", user.uid), {
      IDBackUploaded: false,
      IDFrontUploaded: false
    }).then(() => {
     navigate("/StripeSetUp")
    });
  }

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
       
          borderColor="#E3E3E3"
     
          height="auto"
          boxShadow="md"
          rounded="md"
          padding="8"
          //   overflowY="scroll"
        >
          <Center flexDirection="column">
            <Heading size="lg" marginTop="16px">
              Upload Pictures of your State ID
            </Heading>
            <Box width="30vw" marginTop="8">
              {IDFrontUploaded ? (
                <Flex direction="row" marginTop="4">
                  <Text>Front of State ID</Text>{" "}
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
                  <Text>Front of State ID</Text>{" "}
                  <Button
                    colorScheme="red"
                    height="32px"
                    marginLeft="auto"
                    // variant="ghost"
                    onClick={() => onOpenFront()}
                  >
                    update
                  </Button>
                </Flex>
              )}
              <Modal
                isOpen={isOpenFront}
                onClose={onCloseFront}
                size="xl"
                height="420px"
              >
                <ModalOverlay />
                <ModalContent
                  alignContent="center"
                  alignItems="center"
                  height="420px"
                >
                  <ModalCloseButton />
                  <ModalHeader>Upload</ModalHeader>

                  {/* {!profilePicture ? (
                    <Avatar bg="#01A2E8" size="2xl" />
                  ) : !images ? (
                    <Avatar bg="#01A2E8" size="2xl" src={profilePicture} />
                  ) :  <Avatar bg="#01A2E8" size="2xl" src={images} />} */}
                  <Image
                    bg="grey"
                    height="160px"
                    width="320px"
                    src={images ? images : null}
                  />

                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper">
                        <Button
                          // variant="ghost"
                          colorScheme="blue"
                          marginTop="16px"
                          onClick={() => onImageUpdate()}
                          {...dragProps}
                        >
                          Click here to upload a picture of the front of your
                          State ID
                        </Button>
                        &nbsp;
                        {/* <button onClick={onImageRemoveAll}>
                          Remove all images
                        </button> */}
                        {/* {imageList.map((image, index) => (
                          <div key={index} className="image-item">
                            <img src={image["data_url"]} alt="" width="0" />
                            <div className="image-item__btn-wrapper">
                              <button onClick={() => onImageUpdate(index)}>
                                Update
                              </button>
                              <button onClick={() => onImageRemove(index)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </ImageUploading>

                  {/* <Button colorScheme="blue" marginTop="16px"  onClick={onImageUpload}
                          {...dragProps}>
                    Update Profile Picture
                  </Button> */}

                  <ModalFooter marginTop="40px">
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={onCloseFront}
                      width="160px"
                      marginTop="36px"
                    >
                      Close
                    </Button>

                    {loading ? (
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                    ) : (
                      <Button
                        width="160px"
                        colorScheme="blue"
                        onClick={() => uploadToFirebaseFront()}
                      >
                        Save
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {IDBackUploaded ? (
                <Flex direction="row" marginTop="4">
                  <Text>Back of State ID</Text>{" "}
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
                  <Text>Back of State ID</Text>{" "}
                  <Button
                    colorScheme="red"
                    height="32px"
                    marginLeft="auto"
                    // variant="ghost"
                    onClick={() => onOpenBack()}
                  >
                    update
                  </Button>
                </Flex>
              )}
              <Center marginTop="120px">
                
                <Button
                  // position="absolute"
                  bottom="8"
                  colorScheme="blue"
                  onClick={() => handleSkip()}
                >
                 I'll do this later
                </Button>
                <Button
                  // position="absolute"
                  bottom="8"
                  colorScheme="blue"
                  marginLeft="32px"
                  width="180px"
                  onClick={() => navigate("/StripeSetUp")}
                >
                  Continue
                </Button>
              </Center>
              <Modal
                isOpen={isOpenBack}
                onClose={onCloseBack}
                size="xl"
                height="420px"
              >
                <ModalOverlay />
                <ModalContent
                  alignContent="center"
                  alignItems="center"
                  height="420px"
                >
                  <ModalCloseButton />
                  <ModalHeader>Upload</ModalHeader>

                  {/* {!profilePicture ? (
                    <Avatar bg="#01A2E8" size="2xl" />
                  ) : !images ? (
                    <Avatar bg="#01A2E8" size="2xl" src={profilePicture} />
                  ) :  <Avatar bg="#01A2E8" size="2xl" src={images} />} */}
                  {/* <Avatar bg="#01A2E8" size="2xl"  src={profilePicture ? profilePicture : (images ? images : <Avatar  />)}/> */}
                  <Image
                    bg="grey"
                    height="160px"
                    width="320px"
                    src={imagesBack ? imagesBack : null}
                  />
                  <ImageUploading
                    multiple
                    value={imagesBack}
                    onChange={onChangeBack}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper">
                        <Button
                          variant="ghost"
                          marginTop="16px"
                          onClick={() => onImageUpdate()}
                          {...dragProps}
                        >
                          Click here to upload back of state ID
                        </Button>
                        &nbsp;
                        {/* <button onClick={onImageRemoveAll}>
                          Remove all images
                        </button> */}
                        {/* {imageList.map((image, index) => (
                          <div key={index} className="image-item">
                            <img src={image["data_url"]} alt="" width="0" />
                            <div className="image-item__btn-wrapper">
                              <button onClick={() => onImageUpdate(index)}>
                                Update
                              </button>
                              <button onClick={() => onImageRemove(index)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </ImageUploading>

                  {/* <Button colorScheme="blue" marginTop="16px"  onClick={onImageUpload}
                          {...dragProps}>
                    Update Profile Picture
                  </Button> */}

                  <ModalFooter marginTop="80px">
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={onCloseBack}
                      width="160px"
                    >
                      Close
                    </Button>

                    {loading ? (
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                    ) : (
                      <Button
                        width="160px"
                        colorScheme="blue"
                        onClick={() => uploadToFirebaseBack()}
                      >
                        Save
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default OnboardingDoerIDVerify;
