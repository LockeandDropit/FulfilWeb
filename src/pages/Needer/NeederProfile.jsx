import React, { useState, useEffect } from "react";
import NeederDashboard from "./NeederDashboard";
import NeederHeader from "./NeederHeader";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image
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
import NeederCompletedJobCard from "./Jobs/NeederCompletedJobCard";
import NeederPostedJobCard from "./Jobs/NeederPostedJobCard";
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

import ImageUploading from "react-images-uploading";

import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";

const NeederProfile = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";

  const [user, setUser] = useState(null);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] = useState(false)

  // useEffect(() => {
  //   if (user) {
  //     getProfilePicture();
  //   } else {
  //   }
  // }, [user]);

  // const getProfilePicture = async () => {
  //   const storage = getStorage();
  //   const reference = ref(
  //     storage,
  //     "employers/" + user.uid + "/profilePicture.jpg"
  //   );

  //   console.log(reference)
  //   if (!reference.service) {
    
  //   } else {
  //     await getDownloadURL(reference).then((response) => {
  //       setProfilePicture(response);
  //     });
  //   }
  // };

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
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setProfilePicture(snapshot.data().profilePictureResponse)
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);
        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);
        // if (snapshot.data().bio) {
        //   setUserBio(snapshot.data().bio);
        // } else {
        //   console.log("orrr", snapshot.data().bio);
        // }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        // setUserBio(snapshot.data().bio);
        // console.log(snapshot.data().bio);

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

  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState("change");
  const [postedJobs, setPostedJobs] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Posted Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });
        if (!results || !results.length) {
          setPostedJobs(0);
        } else {
          setPostedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [pastJobs, setPastJobs] = useState(null);

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
        // console.log(results);
        if (!results || !results.length) {
          setPastJobs(0);
        } else {
          setPastJobs(results);
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
      const q = query(collection(db, "employers", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          if (isNaN(doc.data().rating)) {
            console.log("not a number");
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
          setNumberOfRatings(ratingResults.length)
          console.log("here",ratingResults.length)
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // modal stuff

  //varying modal control credit Prem G and Alireza Khanamani https://stackoverflow.com/questions/65988633/chakra-ui-using-multiple-models-in-a-single-component

  //firebase submission after edit

  const updateUserProfileFirestore = () => {
    //check if null

    //submit data
    updateDoc(doc(db, "employers", user.uid), {
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

    onClose();
  };

  //alert handling

  //avatar image handling

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

    await getDownloadURL(pictureRef).then((response) => {
      updateDoc(doc(db, "employers", user.uid), {
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
      updateDoc(doc(db, "employers", user.uid), {
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
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAvatar,
    onOpen: onOpenAvatar,
    onClose: onCloseAvatar,
  } = useDisclosure();

  return (
    <>
      <NeederHeader />

      <Flex justifyContent="center">
        <Box position="absolute" left="0">
          <NeederDashboard />
        </Box>
        {user ? (
          <Box
            w={{base: "100vw", lg: "34vw"}}
          
         
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
                src={
                  profilePicture ? profilePicture : images ? images : <Avatar />
                }
                onClick={onOpenAvatar}
              />
              <Modal isOpen={isOpenAvatar} onClose={onCloseAvatar} size="xl" height="420px">
                <ModalOverlay />
                <ModalContent alignContent="center" alignItems="center" height="420px">
                  <ModalCloseButton />
                  <ModalHeader>Profile Picture</ModalHeader>

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

              <Heading size="md" marginTop="4px">
                {" "}
                {userFirstName} {userLastName}
              </Heading>
              <Heading size="sm" marginTop="4px" >
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
                </Flex>) : ( <Text marginTop="4px">No reviews yet</Text>)}

             
              <Flex>
                <Heading size="md" marginTop="16px" >
                  About Me
                </Heading>
                <Button
                  onClick={onOpen}
                  marginTop="8px"
                  marginLeft="auto"
                  backgroundColor="white"
                  textColor="#01A2E8"
                >
                  Edit
                </Button>
              </Flex>
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
                      onClick={() => updateUserProfileFirestore()}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              
                      <Text
                        aria-multiline="true"
                        textAlign="flex-start"
                        height="auto"
                        
                        marginBottom="32px"
                      >
                        {userBio ? userBio : <Text>Add your bio here</Text>}
                      </Text>
                      {/* <EditableControls />{" "} */}

                      {/* <EditableControls /> */}
                   
            </Flex>
           
          </Box>
        ) : null}


      </Flex>
    </>
  );
};

export default NeederProfile;
