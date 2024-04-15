import React, { useState, useEffect } from "react";
import DoerHeader from "./DoerHeader";
import DoerDashboard from "./DoerDashboard";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image
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

import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";

import { useChatContext } from "stream-chat-react";

const DoerProfile = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";

  const [user, setUser] = useState();




  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] = useState(false)



  const { client } = useChatContext()

  useEffect(() => {
    if (client) {
      console.log("is the user in the client?", client)
    } else {
    }
  }, [client]);

  // const getProfilePicture = async () => {
  //   const storage = getStorage();
  //   const reference = ref(storage, "users/" + user.uid + "/profilePicture.jpg");
  
     

    
    
  // };




  //redux store
  // const firstName = useSelector(selectUserFirstName);
  // const lastName = useSelector(selectUserLastName);
  // const bio = useSelector(selectUserBio);
  // const state = useSelector(selectUserState);
  // const experience = useSelector(selectUserExperience);
  // const skills = useSelector(selectUserSkills);

  //for test only

  //firestore

  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userBio, setUserBio] = useState(null);
  const [userState, setUserState] = useState();
  const [userExperience, setUserExperience] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userCity, setUserCity] = useState();
  const [individualReviews, setIndividualReviews] = useState(null);
  const [] = useState();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);

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

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setProfilePicture(snapshot.data().profilePictureResponse)
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);
        setUserState(snapshot.data().state);
        

        setUserCity(snapshot.data().city);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState(0);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const skillsQuery = query(
        collection(db, "users", user.uid, "User Profile Skills")
      );
      const experienceQuery = query(
        collection(db, "users", user.uid, "User Profile Experience")
      );

      onSnapshot(skillsQuery, (snapshot) => {
        let skills = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          skills.push({ ...doc.data(), id: doc.id });
        });
        console.log(skills);
        setUserSkills(skills);

        if (!skills || !skills.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserSkills(null);
          setUserSkillsLength(0);
        } else {
          setUserSkills(skills);
          setUserSkillsLength(skills.length);
        }
      });

      onSnapshot(experienceQuery, (snapshot) => {
        let experience = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          experience.push({ ...doc.data(), id: doc.id });
        });
        console.log(experience);
        // setUserExperience(experience);
        if (!experience || !experience.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserExperience(null);
          setUserExperienceLength(0);
        } else {
          setUserExperience(experience);
          setUserExperienceLength(experience.length);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null)
  
  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          ratingResults.push(doc.data().rating);
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length)
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // The following proivides the editable UI

  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button
          backgroundColor="#01A2E8"
          textColor="white"
          width="320px"
          marginTop="8px"
          {...getSubmitButtonProps()}
        >
          {" "}
          Finish Editing
        </Button>

        <IconButton
          icon={<Button>Cancel</Button>}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={
            <Button
              backgroundColor="white"
              textColor="#01A2E8"
              width="120px"
              marginTop="8px"
            >
              Edit
            </Button>
          }
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }

  // modal stuff

  //varying modal control credit Prem G and Alireza Khanamani https://stackoverflow.com/questions/65988633/chakra-ui-using-multiple-models-in-a-single-component
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAvatar,
    onOpen: onOpenAvatar,
    onClose: onCloseAvatar,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpenBio,
    onOpen: onOpenBio,
    onClose: onCloseBio,
  } = useDisclosure();
  const {
    isOpen: isOpenAddExperience,
    onOpen: onOpenAddExperience,
    onClose: onCloseAddExperience,
  } = useDisclosure();
  const {
    isOpen: isOpenAddQualification,
    onOpen: onOpenAddQualification,
    onClose: onCloseAddQualification,
  } = useDisclosure();
  //firebase submission after edit

  // const handleAddQualificationOpen = () => {
  //   if (userExperienceLength > 2) {
  //     alert(
  //       "Can't have more than 3 listed experiences. Either edit or delete a prior listed experience."
  //     );
  //   } else {
  //     onOpenAddExperience();
  //   }
  // };

  const handleAddExperienceOpen = () => {
    if (userExperienceLength > 2) {
      alert(
        "Can't have more than 3 listed experiences. Either edit or delete a prior listed experience."
      );
    } else {
      onOpenAddExperience();
    }
  };

  const updateUserProfileFirestore = () => {
    //check if null

    //submit data
    updateDoc(doc(db, "users", user.uid), {
      bio: updatedBio,
    })
      .then(() => {
        //all good
        console.log("data submitted");
        setUserBio(updatedBio);
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    onCloseBio();
  };

  const [experienceTitle, setExperienceTitle1] = useState(null);
  const [experienceDescription, setExperienceDescription] = useState(null);
  const [experienceYears, setExperienceYears] = useState(null);

  const [addExperienceTitle, setAddExperienceTitle] = useState(null);
  const [addExperienceDescription, setAddExperienceDescription] =
    useState(null);
  const [addExperienceYears, setAddExperienceYears] = useState(null);

  const updateUserExperience = (userExperience) => {
    //submit data and update bio

    console.log(
      "here buddy",
      userExperience.Description,
      userExperience.Title,
      userExperience.Years
    );

    updateDoc(
      doc(db, "users", user.uid, "User Profile Experience", userExperience.id),
      {
        Title: experienceTitle ? experienceTitle : userExperience.Title,

        Description: experienceDescription
          ? experienceDescription
          : userExperience.Description,

        Years: experienceYears ? experienceYears : userExperience.Years,
      }
    )
      .then(() => {
        //all good
        console.log("data submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    setExperienceTitle1(null);
    setExperienceDescription(null);
    setExperienceYears(null);

    onClose();
  };

  //check how many experiences listed in FB

  const addNewUserExperience = () => {
    if (userExperienceLength === 0 || null) {
      setDoc(
        doc(db, "users", user.uid, "User Profile Experience", "Employer1"),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddExperience();
    } else if (userExperienceLength === 1) {
      setDoc(
        doc(db, "users", user.uid, "User Profile Experience", "Employer2"),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddExperience();
    } else if (userExperienceLength === 2) {
      setDoc(
        doc(db, "users", user.uid, "User Profile Experience", "Employer3"),
        {
          Title: addExperienceTitle,
          Description: addExperienceDescription,
          Years: addExperienceYears,
        }
      )
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddExperience();
    } else {
      alert(
        "You can not add more than 3! Consider editing one of your prior experiences"
      );
    }

    onCloseAddExperience();
  };

  const [skillTitle1, setSkillTitle1] = useState();
  const [skillDescription, setSkillDescription] = useState();

  const handleAddQualificationOpen = () => {
    if (userSkillsLength > 2) {
      alert(
        "You can only have 3 qualifications. Edit one of your other qualifications"
      );
    } else {
      onOpenAddQualification();
    }
  };

  const updateUserQualification = (props) => {
    //submit data and update bio

    console.log("here", props);
    updateDoc(doc(db, "users", user.uid, "User Profile Skills", props.id), {
      Title: skillTitle1 ? skillTitle1 : props.Title,
      Description: skillDescription ? skillDescription : props.Description,
    })
      .then(() => {
        //all good
        console.log("data submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    setSkillTitle1(null);
    setSkillDescription(null);

    onClose2();
  };

  const addNewUserQualification = () => {
    if (userSkillsLength === 0 || null) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", "Skill 1"), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 1) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", "Skill 2"), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 2) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", "Skill 3"), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
          console.log("data submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      onCloseAddQualification();
    } else {
      alert(
        "You can not add more than 3! Consider editing one of your prior experiences"
      );
    }

    onCloseAddQualification();
  };

  //this set is for handling edit qualification modal

  const [openEditQualificationModalID, setOpenEditQualificaionModalID] =
    useState(null);

  const handleOpenEditQualificaionModal = (x) => {
    setOpenEditQualificaionModalID(x);
    onOpen2(x);
  };

  //this set id for experience

  const [openModalID, setOpenModalID] = useState(null);

  const handleOpenEditExperienceModal = (x) => {
    setOpenModalID(x);
    onOpen(x);
  };

  //alert handling

  //avatar image handling

  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("new pp",imageList[0].data_url);
    setImages(imageList);
    setProfilePicture(imageList[0].data_url)
  };


  const uploadToFirebase = async () => {
    const storage = getStorage();
    const pictureRef = ref(
      storage,
      "users/" + user.uid + "/profilePicture.jpg"
    );
      console.log("images", images)
    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images[0].data_url);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {
      console.log(snapshot);
    });

    await getDownloadURL(pictureRef).then((response) => {
      updateDoc(doc(db, "users", user.uid), {
        profilePictureResponse: response
        
      })
        .then(() => {
          //all good
     
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      
    });

    setTimeout(() => {
      updateDoc(doc(db, "users", user.uid), {
        hasUploadedProfilePicture: hasUploadedProfilePicture,
        
      })
        .then(() => {
          //all good
          console.log("data submitted");
          setHasUploadedProfilePicture(hasUploadedProfilePicture);
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    })
  



    onCloseAvatar()
  }

  return (
    <>
      <DoerHeader />

      <Flex>
        <DoerDashboard />
        {user ? (
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
            boxShadow="ms"
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
            <Center flexDirection="column">
              {/* {!profilePicture ? (
                <Avatar bg="#01A2E8" size="2xl" onClick={onOpenAvatar} />
              ) : (
                <Avatar
                  bg="#01A2E8"
                  size="2xl"
                  src={profilePicture}
                  onClick={onOpenAvatar}
                />
              )} */}
               <Avatar bg="#01A2E8" size="2xl"   onClick={onOpenAvatar} src={profilePicture ? profilePicture : (images ? images : <Avatar  onClick={onOpenAvatar} />)}/>
              <Modal isOpen={isOpenAvatar} onClose={onCloseAvatar} size="xl" height="420px">
                <ModalOverlay />
                <ModalContent alignContent="center" alignItems="center" height="420px">
                  <ModalCloseButton />
                  <ModalHeader>About Me</ModalHeader>

                  {/* {!profilePicture ? (
                    <Avatar bg="#01A2E8" size="2xl" />
                  ) : !images ? (
                    <Avatar bg="#01A2E8" size="2xl" src={profilePicture} />
                  ) :  <Avatar bg="#01A2E8" size="2xl" src={images} />} */}
                   <Avatar bg="#01A2E8" size="2xl"  src={profilePicture ? profilePicture : (images ? images : <Avatar  />)}/>

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
                         <Button variant="ghost"  marginTop="16px"  onClick={() => onImageUpdate()}
                          {...dragProps}>
                    Update Profile Picture
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
                    <Button variant="ghost" mr={3} onClick={onCloseAvatar} width="160px">
                      Close
                    </Button>
                    <Button width="160px" colorScheme="blue" onClick={() => uploadToFirebase()}>Save</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Heading size="lg">
                {" "}
                {userFirstName} {userLastName}
              </Heading>
              <Heading size="md">
                {" "}
                {userCity}, {userState}
              </Heading>
           
              {numberOfRatings ? ( <Flex>
                {maxRating.map((item, key) => {
                  return (
                    <Box activeopacity={0.7} key={item} marginTop="8px">
                      <Image
                       boxSize='24px'
                        src={item <= rating ? star_filled : star_corner}
                        
                      ></Image>
                    
                    </Box>
                  );
                })}

                
                  <Text marginTop="8px" marginLeft="4px">({numberOfRatings} reviews)</Text>
                </Flex>) : ( <Text marginTop="8px" marginLeft="4px">No reviews yet</Text>)}
              <Flex>
                <Heading size="lg" marginTop="16px" marginRight="545px">
                  About Me
                </Heading>
                <Button
                  onClick={onOpenBio}
                  // position="absolute"
                  // right="0"
                  marginTop="8px"
                  marginRight="42px"
                  backgroundColor="white"
                  textColor="#01A2E8"
                >
                  Edit
                </Button>
              </Flex>
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
                        {userBio}
                      </Text>
                      {/* <EditableControls />{" "} */}

                      {/* <EditableControls /> */}
                    </Editable>
                  </CardBody>
                </Stack>
              </Card>
              <Modal isOpen={isOpenBio} onClose={onCloseBio} size="xl">
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
                    <Button variant="ghost" mr={3} onClick={onCloseBio}>
                      Close
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => updateUserProfileFirestore()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Heading size="lg" marginTop="16px" marginRight="640px">
                Experience
              </Heading>
              {!userExperience ? (
                <Text>No experience to show</Text>
              ) : (
                userExperience.map((userExperience) => (
                  <>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                      width="800px"
                      // borderWidth="2px"
                      // borderLeftWidth="4px"
                      // borderRightWidth="4px"
                      borderColor="#E3E3E3"
                      height="auto"
                      marginTop="24px"
                      key={userExperience.id}
                    >
                      <Stack>
                        <CardBody>
                          <Box>
                            {/* lets just open up a modal to edit this I feel like that would be easier */}

                            <Heading size="md">{userExperience.Title}</Heading>

                            <Text>{userExperience.Years} Years</Text>
                            <Text>{userExperience.Description}</Text>
                            <Box></Box>
                            <Button
                              onClick={() =>
                                handleOpenEditExperienceModal(userExperience.id)
                              }
                              // onClick={() => userExperienceModal(userExperience)}
                              position="absolute"
                              right="0"
                              top="3"
                              marginRight="42px"
                              backgroundColor="white"
                              textColor="#01A2E8"
                            >
                              Edit
                            </Button>
                          </Box>
                        </CardBody>
                      </Stack>
                    </Card>

                    {openModalID === userExperience.id ? (
                      <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        size="xl"
                        key={userExperience.id}
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader fontSize="16px">
                            Edit Experience
                          </ModalHeader>
                          <ModalCloseButton />
                          <ModalHeader>Experience Title</ModalHeader>
                          <Textarea
                            defaultValue={userExperience.Title}
                            onChange={(e) =>
                              setExperienceTitle1(e.target.value)
                            }
                          ></Textarea>
                          <ModalHeader>Experience Length</ModalHeader>
                          <Textarea
                            defaultValue={userExperience.Years}
                            onChange={(e) => setExperienceYears(e.target.value)}
                          ></Textarea>
                          <ModalHeader>Experience Description</ModalHeader>
                          <Textarea
                            defaultValue={userExperience.Description}
                            onChange={(e) =>
                              setExperienceDescription(e.target.value)
                            }
                          ></Textarea>

                          <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                              Close
                            </Button>
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                updateUserExperience(userExperience)
                              }
                            >
                              Save
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    ) : null}
                  </>
                ))
              )}
              <Modal
                isOpen={isOpenAddExperience}
                onClose={onCloseAddExperience}
                size="xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader fontSize="16px">Add Experience</ModalHeader>
                  <ModalCloseButton />
                  <ModalHeader>Experience Title</ModalHeader>
                  <Textarea
                    onChange={(e) => setAddExperienceTitle(e.target.value)}
                  ></Textarea>
                  <ModalHeader>Experience Length</ModalHeader>
                  <Textarea
                    onChange={(e) => setAddExperienceYears(e.target.value)}
                  ></Textarea>
                  <ModalHeader>Experience Description</ModalHeader>
                  <Textarea
                    onChange={(e) =>
                      setAddExperienceDescription(e.target.value)
                    }
                  ></Textarea>

                  <ModalFooter>
                    <Button colorScheme="ghost" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => addNewUserExperience()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Button
                onClick={() => handleAddExperienceOpen()}
                backgroundColor="white"
                textColor="#01A2E8"
              >
                Add More
              </Button>
              <Box></Box>

              <Heading size="lg" marginTop="16px" marginRight="595px">
                Qualifications
              </Heading>
              {!userSkills ? (
                <Text>No experience to show</Text>
              ) : (
                userSkills.map((userSkills) => (
                  <>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                      width="800px"
                      borderWidth="2px"
                      borderLeftWidth="4px"
                      borderRightWidth="4px"
                      borderColor="#E3E3E3"
                      height="auto"
                      marginTop="24px"
                      key={userSkills.id}
                    >
                      <Stack>
                        <CardBody>
                          <Box>
                            <Heading size="md">{userSkills.Title}</Heading>

                            <Text> {userSkills.Description}</Text>
                            <Button
                              onClick={() =>
                                handleOpenEditQualificaionModal(userSkills.id)
                              }
                              position="absolute"
                              right="0"
                              top="3"
                              marginRight="42px"
                              backgroundColor="white"
                              textColor="#01A2E8"
                            >
                              Edit
                            </Button>
                            <Box></Box>
                          </Box>
                        </CardBody>
                      </Stack>
                    </Card>

                    {openEditQualificationModalID === userSkills.id ? (
                      <Modal isOpen={isOpen2} onClose={onClose2} size="xl">
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader fontSize="16px">
                            Edit Qualification
                          </ModalHeader>
                          <ModalCloseButton />
                          <ModalHeader>Title</ModalHeader>
                          <Textarea
                            defaultValue={userSkills.Title}
                            onChange={(e) => setSkillTitle1(e.target.value)}
                          ></Textarea>

                          <ModalHeader>Description</ModalHeader>
                          <Textarea
                            height="120px"
                            defaultValue={userSkills.Description}
                            onChange={(e) =>
                              setSkillDescription(e.target.value)
                            }
                          ></Textarea>

                          <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose2}>
                              Close
                            </Button>
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                updateUserQualification(userSkills)
                              }
                            >
                              Save
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    ) : null}
                  </>
                ))
              )}
              <Modal
                isOpen={isOpenAddQualification}
                onClose={onCloseAddQualification}
                size="xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader fontSize="16px">Add Qualification</ModalHeader>
                  <ModalCloseButton />
                  <ModalHeader>Title</ModalHeader>
                  <Textarea
                    onChange={(e) => setSkillTitle1(e.target.value)}
                  ></Textarea>

                  <ModalHeader>Description</ModalHeader>
                  <Textarea
                    height="120px"
                    onChange={(e) => setSkillDescription(e.target.value)}
                  ></Textarea>

                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose2}>
                      Close
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => addNewUserQualification()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Button
                onClick={() => handleAddQualificationOpen()}
                backgroundColor="white"
                textColor="#01A2E8"
              >
                Add More
              </Button>
            </Center>
          </Box>
        ) : null}
      </Flex>
    </>
  );
};

export default DoerProfile;
