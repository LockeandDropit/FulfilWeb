import React, { useState, useEffect } from "react";
import NeederDashboard from "../../NeederDashboard";
import NeederHeader from "../../NeederHeader";
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
  Spinner,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StreamChat } from "stream-chat";
import { useChatContext } from "stream-chat-react";
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
  Image,
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
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import star_corner from "../../../../images/star_corner.png";
import star_filled from "../../../../images/star_filled.png";

const ApplicantProfile = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  //grabs client using streamChat api

  const starImgFilled = `url(${star_filled})`;
  const starImgCorner = `url(${star_corner})`;

  const [user, setUser] = useState(null);
  //New code
  const location = useLocation();

  const [applicant, setApplicant] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [employerLastName, setEmployerLastName] = useState(null);
  const [isHourly, setIsHourly] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (location.state === null) {
    } else {
      console.log("is this the bug?", location.state);
      setApplicant(location.state.applicant);
      setJobTitle(location.state.jobTitle);
      setJobID(location.state.jobID);
      setIsHourly(location.state.isHourly);
    }
  }, [location]);

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

  useEffect(() => {
    //get rid of useEffect that calls this data from FB. Check if is hourly, then set isFlat rate based off of that. This will negate that weird crash???

    if (isHourly === true) {
    } else {
      setIsFlatRate(true);
    }
  }, [isHourly]);

  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "users", applicant.streamChatID, "Ratings")
      );

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          ratingResults.push(doc.data().rating);
        });

        if (!ratingResults || !ratingResults.length) {
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  //gets employer info to place in db (messages) for applicant use
  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setEmployerFirstName(snapshot.data().firstName);
        setEmployerLastName(snapshot.data().lastName);
        //get profile picture here as well?
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture)

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (applicant) {
      getProfilePicture();
    } else {
    }
  }, [applicant]);

  const getProfilePicture = async () => {
    const storage = getStorage();
    const reference = ref(
      storage,
      "users/" + applicant.streamChatID + "/profilePicture.jpg"
    );
    await getDownloadURL(reference).then((response) => {
      setProfilePicture(response);
    });
  };

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
    if (applicant != null) {
      const docRef = doc(db, "users", applicant.streamChatID);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);
        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  useEffect(() => {
    if (applicant != null) {
      const docRef = doc(db, "users", applicant.streamChatID);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState(0);

  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const skillsQuery = query(
        collection(db, "users", applicant.streamChatID, "User Profile Skills")
      );
      const experienceQuery = query(
        collection(
          db,
          "users",
          applicant.streamChatID,
          "User Profile Experience"
        )
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
  }, [applicant]);

  //pulls cumulative reviews
  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "users", applicant.streamChatID, "Ratings")
      );

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
        }
      });
      // console.log(rating);
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  //help from https://www.youtube.com/watch?v=276IyIIdJnA fro star stuff.

  const navigate = useNavigate();

  const [isVolunteer, setIsVolunteer] = useState(null);

  //gets whether or not job is volunteer
  // useEffect(() => {
  //   if (jobID != null) {
  //     const docRef = doc(db, "All Jobs", jobID);

  //     getDoc(docRef).then((snapshot) => {
  //       if (snapshot.data()) {

  //       }
  //       setIsVolunteer(snapshot.data().isVolunteer);
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [jobID]);

  //deletes applicant
  const deleteApplicant = () => {
    deleteDoc(
      doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        jobTitle,
        "Applicants",
        applicant.streamChatID
      )
    )
      .then(() => {
        //user info submitted to Job applicant file
        console.log("Applicant Deleted");

        navigate(-1);
      })
      .catch((error) => {
        //uh oh
        console.log(error);
      });
  };

  const createInterviewChat = () => {
    setDoc(doc(db, "Messages", "intermediate", jobID, "Info"), {
      jobTitle: jobTitle,
      applicantFirstName: userFirstName,
      applicantLastName: userLastName,
      applicantID: applicant.streamChatID,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerID: user.uid,
      isHired: false,
      isHourly: isHourly,
      isFlatRate: isFlatRate,
      isVolunteer: false,
      needsDeposit: false,
      // applicantAvatar: profilePictureURL,
      // employerAvatar: employerProfilePictureURL
    })
      .then(() => {
        console.log("new chat created global");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "Messages", jobID), {
      jobTitle: jobTitle,
      jobID: jobID,
      applicantFirstName: userFirstName,
      applicantLastName: userLastName,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      applicantID: applicant.streamChatID,
      employerID: user.uid,
      isHired: false,
      isHourly: isHourly,
      isFlatRate: isFlatRate,
      confirmedRate: 0,
      jobOffered: false,
      applicationSent: false,
      isVolunteer: false,
      // applicantAvatar: profilePictureURL,
      // employerAvatar: employerProfilePictureURL,
      // applicantInitials: here,
      // employerInitials: here
    })
      .then(() => {
        console.log("new chat created global");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "employers", user.uid, "User Messages", jobID), {
      placeholder: null,
    })
      .then(() => {
        console.log("new chat created employer");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "users", applicant.streamChatID, "User Messages", jobID), {
      placeholder: null,
    })
      .then(() => {
        console.log("new chat created applicant");
        // navigation.navigate("MessagesFinal", { props: jobID, firstInterview: true, applicantFirstName: userFirstName });
      })
      .catch((error) => {
        console.log(error);
      });

    //add JobID to active chat list for both applicant and employer

    testNewChannel();
  };

  //modal control

  const [isFlatRate, setIsFlatRate] = useState(null);
  const [applicantFirstName, setApplicantFirstName] = useState(null);

  // useEffect(() => {
  //   if (user !== null) {
  //     const docRef = doc(db, "employers", user.uid, "Posted Jobs", jobTitle);

  //     getDoc(docRef).then((snapshot) => {
  //       if (snapshot.data()) {
  //         console.log("hellp", snapshot.data())
  //         setIsFlatRate(snapshot.data().isFlatRate);
  //         setIsHourly(snapshot.data().isHourly);
  //         // setApplicantFirstName(snapshot.data().applicantFirstName)
  //       } else {
  //       }
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [user]);

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

  console.log(isHourly);

  console.log("isFlat rate?", isFlatRate);

  const [jobOffered, setJobOffered] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState(null);

  const [isHired, setIsHired] = useState(null);

  //credit https://www.code-sample.com/2019/12/react-allow-only-numbers-in-textbox.html
  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,7}$/;

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);

  const flatRateValidate = (flatRate) => {
    setFlatRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);
    if (!isValid) {
      setFlatRateValidationMessage("Please enter valid rate");
      console.log(flatRateValidationMessage);
    } else {
      setFlatRateValidationMessage();
      setConfirmedRate(flatRate);
    }
  };

  //credit typeof help https://flaviocopes.com/how-to-check-undefined-property-javascript/

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmedRate);

    if (!rateValid || typeof confirmedRate === "undefined") {
      alert("Please enter valid rate");
      setFlatRateValidationMessage("Please enter valid rate");
    } else {
      // sendOffer();
    }
  };

  //initiate interview channel logic

  const client = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);
  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };

  const testNewChannel = async () => {
    setIsLoading(true);
    client.connectUser(userInfo, client.devToken(userID));

    const channel = client.channel("messaging", jobID, {
      members: [applicant.streamChatID, user.uid],
      name: jobTitle,
    });

    await channel.create();
    // setNewChannel(newChannel);

    // trying to see if this will return access to "unread" message count
    const startWatching = channel.watch();
    console.log(startWatching);

    setTimeout(() => {
      updateDoc(doc(db, "users", applicant.streamChatID, "Applied", jobTitle), {
        hasUnreadMessage: true,
        interviewStarted: true,
        channelID: channel.cid,
      })
        .then(() => {
          console.log("new message updated in Applied");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      updateDoc(
        doc(
          db,
          "employers",
          userID,
          "Posted Jobs",
          jobTitle,
          "Applicants",
          applicant.streamChatID
        ),
        {
          channelID: channel.cid,
        }
      )
        .then(() => {
          console.log("new message updated in Applied");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      navigate("/NeederMessageList", {
        state: {
          selectedChannel: channel.cid,
        },
      });

      setIsLoading(false);
    }, 1000);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <NeederHeader />

      <Flex justifyContent="center">
        <Box position="absolute" left="0">
          <NeederDashboard />
        </Box>
        {applicant ? (
          <Box
            w={{ base: "100vw", lg: "34vw" }}
            height="auto"
            boxShadow=""
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
            <Flex flexDirection="column">
              <Avatar bg="#01A2E8" size="xl" src={profilePicture} />

              <Heading size="md" marginTop="4px">
                {" "}
                {userFirstName}
              </Heading>
              <Heading size="sm" marginTop="4px">
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

              {/* <Center flexDirection="column"> */}
              <Flex>
                <Heading size="md" marginTop="16px">
                  About
                </Heading>
              </Flex>

              <Text
                aria-multiline="true"
                textAlign="flex-start"
                height="auto"
           
                marginBottom={{base: "16px", lg: "32px"}}
              >
                {userBio}
              </Text>

              <Heading size="md" marginTop="24px">
                Experience
              </Heading>

              {!userExperience ? (
                <Text>No experience to show</Text>
              ) : (
                userExperience.map((userExperience) => (
                  <>
                    <Box key={userExperience.id} mt={2}>
                      <Flex direction="column">
                        <Heading size="md">{userExperience.Title}</Heading>

                        <Flex>
                          <Text>Duration: {userExperience.Years}</Text>
                        </Flex>
                        <Text>{userExperience.Description}</Text>
                      </Flex>
                    </Box>
                  </>
                ))
              )}

              <Box></Box>
              <Heading size="md" marginTop="16px">
                Qualifications
              </Heading>
              {!userSkills
                ? null
                : userSkills.map((userSkills) => (
                    <>
                      <Box mt={2}>
                        <Heading size="sm">{userSkills.Title}</Heading>

                        <Text> {userSkills.Description}</Text>

                        <Box></Box>
                      </Box>
                    </>
                  ))}
              <Flex>
                {isLoading ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#01A2E8"
                    size="lg"
                    marginTop="56px"
                  />
                ) : (
                  <>
                    {" "}
                    <Button
                      color="red"
                      backgroundColor="white"
                      width="240px"
                      marginTop="60px"
                      // position="absolute"
                      bottom="2"
                      // right="500"
                      // left="300"
                      onClick={() => deleteApplicant()}
                    >
                      Delete
                    </Button>{" "}
                    <Button
                      colorScheme="blue"
                      width="240px"
                      marginTop="60px"
                      // position="absolute"
                      bottom="2"
                      marginLeft="60px"
                      // right="500"
                      // left="300"
                      onClick={() => createInterviewChat()}
                    >
                      Interview
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
          </Box>
        ) : null}
      </Flex>

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
                  placeholder="Enter budget here"
                  onChange={(e) => flatRateValidate(e.target.value)}
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
            <Button colorScheme="blue">Send Offer</Button>
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
                  placeholder="Enter budget here"
                  onChange={(e) => flatRateValidate(e.target.value)}
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

export default ApplicantProfile;
