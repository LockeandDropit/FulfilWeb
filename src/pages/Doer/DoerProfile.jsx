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
  Image,
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
  Select,
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
  deleteDoc,
  setDoc,
  col,
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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
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
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] =
    useState(false);

  const { client } = useChatContext();

  useEffect(() => {
    if (client) {
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
  const [isPremium, setIsPremium] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  });

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserInfo(snapshot.data());
        setIsPremium(snapshot.data().isPremium);
        setProfilePicture(snapshot.data().profilePictureResponse);
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);
        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);

        if (snapshot.data().premiumCategoryOne) {
          setPremiumCategoryOne(snapshot.data().premiumCategoryOne);
          setInitialPremiumCategoryOne(snapshot.data().premiumCategoryOne);
        }
        if (snapshot.data().premiumCategoryTwo) {
          setPremiumCategoryTwo(snapshot.data().premiumCategoryTwo);
          setInitialPremiumCategoryTwo(snapshot.data().premiumCategoryTwo);
        }
        if (snapshot.data().premiumCategoryThree) {
          setPremiumCategoryThree(snapshot.data().premiumCategoryThree);
          setInitialPremiumCategoryThree(snapshot.data().premiumCategoryThree);
        }
      });
    } else {
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
      });
    } else {
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
    }
  }, [user]);

  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          if (isNaN(doc.data().rating)) {
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
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
    isOpen: isOpenCategories,
    onOpen: onOpenCategories,
    onClose: onCloseCategories,
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

        setUserBio(updatedBio);
      })
      .catch((error) => {
        // no bueno
      });

    onCloseBio();
  };

  const [premiumCategoryOne, setPremiumCategoryOne] = useState(null);
  const [premiumCategoryTwo, setPremiumCategoryTwo] = useState(null);
  const [premiumCategoryThree, setPremiumCategoryThree] = useState(null);

  //this state is held to track changes between old and new categories to delete old ones in the database.

  const [initialPremiumCategoryOne, setInitialPremiumCategoryOne] =
    useState(null);
  const [initialPremiumCategoryTwo, setInitialPremiumCategoryTwo] =
    useState(null);
  const [initialPremiumCategoryThree, setInitialPremiumCategoryThree] =
    useState(null);

  const [isUploaded, setIsUploaded] = useState(false);

  const handleAllFBCategoryChange = () => {
    handlePremiumCategoryUpload();
    handleGlobalCategoryUpload();

    handleGlobalCategoryRemoval();
  };

  const handlePremiumCategoryUpload = () => {
    console.log(premiumCategoryOne, premiumCategoryTwo, premiumCategoryThree);

    updateDoc(doc(db, "users", user.uid), {
      premiumCategoryOne: premiumCategoryOne ? premiumCategoryOne : null,
      premiumCategoryTwo: premiumCategoryTwo ? premiumCategoryTwo : null,
      premiumCategoryThree: premiumCategoryThree ? premiumCategoryThree : null,
    })
      .then(() => {
        //all good

        setIsUploaded(true);
        setPremiumCategoryOne(premiumCategoryOne);
        setPremiumCategoryTwo(premiumCategoryTwo);
        setPremiumCategoryThree(premiumCategoryOne);
      })
      .catch((error) => {
        // no bueno
      });
  };

  //need to add user id to selected category, tier one

  const handleGlobalCategoryUpload = () => {
    if (premiumCategoryOne) {
      setDoc(doc(db, "categories", premiumCategoryOne, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }

    if (premiumCategoryTwo) {
      setDoc(doc(db, "categories", premiumCategoryTwo, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }

    if (premiumCategoryThree) {
      setDoc(doc(db, "categories", premiumCategoryThree, "Tier 1", user.uid), {
        placeholder: "placeholder",
      })
        .then(() => {
          //all good
          setIsUploaded(true);
        })
        .catch((error) => {
          // no bueno
        });
    }
  };

  const handleGlobalCategoryRemoval = () => {
    // [x] on page load set premium categories already being used by the user.
    // [] check to see if the initial values are different than the new values

    let initialValues = [
      initialPremiumCategoryOne,
      initialPremiumCategoryTwo,
      initialPremiumCategoryThree,
    ];
    let newValues = [
      premiumCategoryOne,
      premiumCategoryTwo,
      premiumCategoryThree,
    ];

    //credit zcoop98 & Luis Sieira https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    let difference = initialValues.filter((x) => !newValues.includes(x));

    //if so, delete onl value in fb
    if (difference) {
      difference.forEach((category) => {
        deleteDoc(doc(db, "categories", category, "Tier 1", user.uid));
      });
    }
  };
  //need to remove from unselected or changed category, if applicable
  //

  const handleCloseCategories = () => {
    onCloseCategories();
    setIsUploaded(false);
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
      })
      .catch((error) => {
        // no bueno
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
        })
        .catch((error) => {
          // no bueno
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
        })
        .catch((error) => {
          // no bueno
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
        })
        .catch((error) => {
          // no bueno
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

    updateDoc(doc(db, "users", user.uid, "User Profile Skills", props.id), {
      Title: skillTitle1 ? skillTitle1 : props.Title,
      Description: skillDescription ? skillDescription : props.Description,
    })
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
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
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 1) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", "Skill 2"), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
      onCloseAddQualification();
    } else if (userSkillsLength === 2) {
      setDoc(doc(db, "users", user.uid, "User Profile Skills", "Skill 3"), {
        Title: skillTitle1,
        Description: skillDescription,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
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

    setImages(imageList);
    setProfilePicture(imageList[0].data_url);
  };

  const uploadToFirebase = async () => {
    const storage = getStorage();
    const pictureRef = ref(
      storage,
      "users/" + user.uid + "/profilePicture.jpg"
    );

    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images[0].data_url);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {});

    await getDownloadURL(pictureRef).then((response) => {
      updateDoc(doc(db, "users", user.uid), {
        profilePictureResponse: response,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    });

    setTimeout(() => {
      updateDoc(doc(db, "users", user.uid), {
        hasUploadedProfilePicture: hasUploadedProfilePicture,
      })
        .then(() => {
          setHasUploadedProfilePicture(hasUploadedProfilePicture);
        })
        .catch((error) => {
          // no bueno
        });
    });

    onCloseAvatar();
  };

  return (
    <>
      <DoerHeader />

      <Flex justifyContent="center">
        <Box position="absolute" left="0">
          <DoerDashboard />
        </Box>
        {user ? (
          <Box
            width="38vw"
            // alignContent="center"
            // justifyContent="center"
            // display="flex"
            // alignItems="baseline"
            // borderWidth="2px"
            borderColor="#E3E3E3"
            // borderLeftWidth="4px"
            // borderRightWidth="4px"
            height="auto"
            boxShadow=""
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
            <Flex direction="column">
              <Avatar
                bg="#01A2E8"
                size="xl"
                onClick={onOpenAvatar}
                src={
                  profilePicture ? (
                    profilePicture
                  ) : images ? (
                    images
                  ) : (
                    <Avatar onClick={onOpenAvatar} />
                  )
                }
              />
              <Modal
                isOpen={isOpenAvatar}
                onClose={onCloseAvatar}
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
                  <ModalHeader>About Me</ModalHeader>

                  {/* {!profilePicture ? (
                    <Avatar bg="#01A2E8" size="2xl" />
                  ) : !images ? (
                    <Avatar bg="#01A2E8" size="2xl" src={profilePicture} />
                  ) :  <Avatar bg="#01A2E8" size="2xl" src={images} />} */}
                  <Avatar
                    bg="#01A2E8"
                    size="xl"
                    src={
                      profilePicture ? (
                        profilePicture
                      ) : images ? (
                        images
                      ) : (
                        <Avatar />
                      )
                    }
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
                          variant="ghost"
                          marginTop="16px"
                          onClick={() => onImageUpdate()}
                          {...dragProps}
                        >
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
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={onCloseAvatar}
                      width="160px"
                    >
                      Close
                    </Button>
                    <Button
                      width="160px"
                      colorScheme="blue"
                      onClick={() => uploadToFirebase()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Heading size="md" marginTop="4px">
                {" "}
                {userFirstName} {userLastName}
              </Heading>
              <Heading size="sm" marginTop="4px" >
                {" "}
                {userCity}, {userState}
              </Heading>

              {numberOfRatings ? (
                <Flex>
                  {maxRating.map((item, key) => {
                    return (
                      <Box activeopacity={0.7} key={item} marginTop="8px">
                        <Image
                          boxSize="24px"
                          src={item <= rating ? star_filled : star_corner}
                        ></Image>
                      </Box>
                    );
                  })}

                  <Text marginTop="8px" marginLeft="4px">
                    ({numberOfRatings} reviews)
                  </Text>
                </Flex>
              ) : (
                <Text marginTop="4px">No reviews yet</Text>
              )}
              <Flex>
                <Heading size="md" marginTop="16px">
                  About Me
                </Heading>
                <Button
                  onClick={onOpenBio}
                  marginTop="8px"
                 
                  marginLeft="auto"
                  backgroundColor="white"
                  textColor="#01A2E8"
                >
                  Edit
                </Button>
              </Flex>

              <Text
                aria-multiline="true"
                textAlign="flex-start"
                height="auto"
                width="700px"
                marginBottom="32px"
                placeholder="asdas"
              >
                {userBio ? userBio : "Tell us a little bit about yourself"}
              </Text>

              <Modal isOpen={isOpenBio} onClose={onCloseBio} size="xl">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader fontSize="16px">Edit Bio</ModalHeader>
                  <ModalCloseButton />
                  <ModalHeader>About Me</ModalHeader>
                  <ModalBody>
                    <Textarea
                      defaultValue={userBio}
                      placeholder="Tell us a little about yourself"
                      height="240px"
                      onChange={(e) => setUpdatedBio(e.target.value)}
                    ></Textarea>
                  </ModalBody>
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

              {isPremium ? (
                <>
                  <Flex>
                    <Heading size="md" marginTop="8px" >
                      Specialties
                    </Heading>
                    <Button
                      onClick={onOpenCategories}
                      // position="absolute"
                      // right="0"
                      marginLeft="auto"
                      backgroundColor="white"
                      textColor="#01A2E8"
                    >
                      Edit
                    </Button>
                  </Flex>
                 
                        <List spacing={3}>
                          {!userInfo.premiumCategoryOne &&
                          !userInfo.premiumCategoryTwo &&
                          !userInfo.premiumCategoryThree ? (
                            <Button
                              background="#01A2E8"
                              textColor="white"
                              height="36px"
                              _hover={{ bg: "#018ecb", textColor: "white" }}
                              ml={3}
                              mt={3}
                              onClick={onOpenCategories}
                            >
                              Add Specialty
                            </Button>
                          ) : (
                            <>
                              {userInfo.premiumCategoryOne ? (
                                <>
                                  <ListItem>
                                    {" "}
                                    <ListIcon as={StarIcon} color="#01A2E8" />
                                    {userInfo.premiumCategoryOne}
                                  </ListItem>

                                  {userInfo.premiumCategoryTwo ? null : (
                                    <Button
                                      background="#01A2E8"
                                      textColor="white"
                                      height="36px"
                                      _hover={{
                                        bg: "#018ecb",
                                        textColor: "white",
                                      }}
                                      ml={3}
                                      mt={3}
                                      onClick={onOpenCategories}
                                    >
                                      Add Specialty
                                    </Button>
                                  )}
                                </>
                              ) : null}

                              {userInfo.premiumCategoryTwo ? (
                                <>
                                  <ListItem>
                                    {" "}
                                    <ListIcon as={StarIcon} color="#01A2E8" />
                                    {userInfo.premiumCategoryTwo}
                                  </ListItem>{" "}
                                  {userInfo.premiumCategoryThree ? null : (
                                    <Button
                                      background="#01A2E8"
                                      textColor="white"
                                      height="36px"
                                      _hover={{
                                        bg: "#018ecb",
                                        textColor: "white",
                                      }}
                                      ml={3}
                                      mt={3}
                                      onClick={onOpenCategories}
                                    >
                                      Add Specialty
                                    </Button>
                                  )}
                                </>
                              ) : null}
                              {userInfo.premiumCategoryThree ? (
                                <ListItem>
                                  {" "}
                                  <ListIcon as={StarIcon} color="#01A2E8" />
                                  {userInfo.premiumCategoryThree}
                                </ListItem>
                              ) : null}
                            </>
                          )}
                        </List>
                     
                </>
              ) : null}

              <Modal
                isOpen={isOpenCategories}
                onClose={onCloseCategories}
                size="xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader fontSize="16px">Edit Specialties</ModalHeader>
                  <ModalCloseButton />

                  {isUploaded ? (
                    <>
                      <Box padding={8}>
                        <Heading size="md">Success!</Heading>
                        <Text>
                          Your choices have been updated successfully! It may
                          take a few minutes before it shows on your profile.
                        </Text>
                      </Box>{" "}
                    </>
                  ) : isPremium ? (
                    <>
                      <Flex
                        direction="row"
                        marginLeft="24px"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Heading size="sm">Category 1:</Heading>
                        <Select
                          placeholder={
                            userInfo.premiumCategoryOne
                              ? userInfo.premiumCategoryOne
                              : "Choose a category"
                          }
                          width="240px"
                          height="36px"
                          marginLeft="4px"
                          onChange={(e) =>
                            setPremiumCategoryOne(e.target.value)
                          }
                        >
                          <option value="null">Clear Selection</option>
                          <option>--------------------------------</option>
                          <option value="Asphalt">Asphalt</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Concrete">Concrete</option>
                          <option value="Drywall">Drywall</option>
                          <option value="Electrical Work">
                            Electrical Work
                          </option>
                          <option value="General Handyman">
                            General Handyman
                          </option>
                          <option value="Gutter Cleaning">
                            Gutter Cleaning
                          </option>
                          <option value="Hvac">HVAC</option>
                          <option value="Landscaping">Landscaping</option>
                          <option value="Painting">Painting</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Pressure Washing">
                            Pressure Washing
                          </option>
                          <option value="Roofing">Roofing</option>
                          <option value="Siding">Siding</option>
                          <option value="Snow Removal">Snow Removal</option>
                          <option value="Window Installation">
                            Window Installation
                          </option>
                          <option value="Window Washing">Window Washing</option>
                          <option value="Yard Work">Yard Work</option>
                        </Select>
                      </Flex>
                      <Flex
                        direction="row"
                        marginLeft="24px"
                        alignContent="center"
                        alignItems="center"
                        marginTop="8px"
                      >
                        <Heading size="sm">Category 2:</Heading>
                        <Select
                          placeholder={
                            userInfo.premiumCategoryTwo
                              ? userInfo.premiumCategoryTwo
                              : "Choose a category"
                          }
                          width="240px"
                          height="36px"
                          marginLeft="4px"
                          onChange={(e) =>
                            setPremiumCategoryTwo(e.target.value)
                          }
                        >
                          <option value="null">Clear Selection</option>
                          <option>--------------------------------</option>
                          <option value="Asphalt">Asphalt</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Concrete">Concrete</option>
                          <option value="Drywall">Drywall</option>
                          <option value="Electrical Work">
                            Electrical Work
                          </option>
                          <option value="General Handyman">
                            General Handyman
                          </option>
                          <option value="Gutter Cleaning">
                            Gutter Cleaning
                          </option>
                          <option value="Hvac">HVAC</option>
                          <option value="Landscaping">Landscaping</option>
                          <option value="Painting">Painting</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Pressure Washing">
                            Pressure Washing
                          </option>
                          <option value="Roofing">Roofing</option>
                          <option value="Siding">Siding</option>
                          <option value="Snow Removal">Snow Removal</option>
                          <option value="Window Installation">
                            Window Installation
                          </option>
                          <option value="Window Washing">Window Washing</option>
                          <option value="Yard Work">Yard Work</option>
                        </Select>
                      </Flex>
                      <Flex
                        direction="row"
                        marginLeft="24px"
                        alignContent="center"
                        alignItems="center"
                        marginTop="8px"
                      >
                        <Heading size="sm">Category 3:</Heading>
                        <Select
                          placeholder={
                            userInfo.premiumCategoryThree
                              ? userInfo.premiumCategoryThree
                              : "Choose a category"
                          }
                          width="240px"
                          height="36px"
                          marginLeft="4px"
                          onChange={(e) =>
                            setPremiumCategoryThree(e.target.value)
                          }
                        >
                          <option value="null">Clear Selection</option>
                          <option>--------------------------------</option>
                          <option value="Asphalt">Asphalt</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Concrete">Concrete</option>
                          <option value="Drywall">Drywall</option>
                          <option value="Electrical Work">
                            Electrical Work
                          </option>
                          <option value="General Handyman">
                            General Handyman
                          </option>
                          <option value="Gutter Cleaning">
                            Gutter Cleaning
                          </option>
                          <option value="Hvac">HVAC</option>
                          <option value="Landscaping">Landscaping</option>
                          <option value="Painting">Painting</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Pressure Washing">
                            Pressure Washing
                          </option>
                          <option value="Roofing">Roofing</option>
                          <option value="Siding">Siding</option>
                          <option value="Snow Removal">Snow Removal</option>
                          <option value="Window Installation">
                            Window Installation
                          </option>
                          <option value="Window Washing">Window Washing</option>
                          <option value="Yard Work">Yard Work</option>
                        </Select>
                      </Flex>
                    </>
                  ) : null}
                  {isUploaded ? (
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleCloseCategories()}
                      >
                        Continue
                      </Button>
                    </ModalFooter>
                  ) : (
                    <ModalFooter>
                      <Button
                        variant="ghost"
                        mr={3}
                        onClick={onCloseCategories}
                      >
                        Close
                      </Button>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleAllFBCategoryChange()}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  )}
                </ModalContent>
              </Modal>

              <Heading size="md" marginTop="24px">
                Experience
              </Heading>
              {!userExperience ? (
                <Text>No experience to show</Text>
              ) : (
                userExperience.map((userExperience) => (
                  <>
                    <Box key={userExperience.id}>
                      {/* lets just open up a modal to edit this I feel like that would be easier */}

                      <Flex alignItems="center">
                        <Heading size="sm">{userExperience.Title}</Heading>
                        <Button
                          onClick={() =>
                            handleOpenEditExperienceModal(userExperience.id)
                          }
                          marginLeft="auto"
                          backgroundColor="white"
                          textColor="#01A2E8"
                        >
                          Edit
                        </Button>
                      </Flex>

                      <Flex>
                        <Text>Duration: {userExperience.Years}</Text>
                      </Flex>

                      <Text>{userExperience.Description}</Text>
                    </Box>

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
                  <ModalBody>
                    <Heading size="md" marginBottom="4px">
                      Title
                    </Heading>
                    <Input
                      placeholder="ex: Snow removal"
                      onChange={(e) => setAddExperienceTitle(e.target.value)}
                    ></Input>
                    <Heading size="md" marginBottom="4px" marginTop="8px">
                      Length of Experience
                    </Heading>
                    <Input
                      placeholder="ex: 2 years"
                      onChange={(e) => setAddExperienceYears(e.target.value)}
                    ></Input>
                    <Heading size="md" marginBottom="4px" marginTop="8px">
                      Description
                    </Heading>
                    <Textarea
                      placeholder="ex: I operated a plow truck for 2 years in the metro area over the past few winters."
                      onChange={(e) =>
                        setAddExperienceDescription(e.target.value)
                      }
                    ></Textarea>
                  </ModalBody>
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

              <Heading size="md" marginTop="16px">
                Qualifications
              </Heading>
              {!userSkills ? (
                <Text>No qualifications to show</Text>
              ) : (
                userSkills.map((userSkills) => (
                  <>
                    <Box key={userSkills.id}>
                      <Flex alignItems="center">
                        <Heading size="sm">{userSkills.Title}</Heading>
                        <Button
                          onClick={() =>
                            handleOpenEditQualificaionModal(userSkills.id)
                          }
                          marginLeft="auto"
                          backgroundColor="white"
                          textColor="#01A2E8"
                        >
                          Edit
                        </Button>
                      </Flex>
                      <Text> {userSkills.Description}</Text>
                    </Box>

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
                  <ModalBody>
                    <Heading size="md" marginBottom="4px">
                      Title
                    </Heading>
                    <Input
                      onChange={(e) => setSkillTitle1(e.target.value)}
                    ></Input>

                    <Heading size="md" marginBottom="4px" marginTop="8px">
                      Description
                    </Heading>
                    <Textarea
                      height="120px"
                      onChange={(e) => setSkillDescription(e.target.value)}
                    ></Textarea>
                  </ModalBody>
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
            </Flex>
          </Box>
        ) : null}
      </Flex>
    </>
  );
};

export default DoerProfile;
