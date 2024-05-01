//make this another split screen

//left side is text about finding the right professional.
//followed by copy to sign up or sign in.

//right side is scrollview of featured contractors in that category.

import React, { useState, useEffect } from "react";

import NeederHeader from "./NeederHeader";

import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
  Spinner,
} from "@chakra-ui/react";
import { StreamChat } from "stream-chat";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import { auth, db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import NeederDashboard from "./NeederDashboard";
import { useLocation } from "react-router-dom";
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
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";

const NeederSelectedCategory = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
 
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [input, setInput] = useState("");
  const location = useLocation();

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);



  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        navigate("/AddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const validate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
    }
    if (isValid && isValidPassword) {
      onSignUp();
    }
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  const passwordRegex = /[^\>]*/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = () => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
    }
  };

  const [visibleToggle, setVisibleToggle] = useState("password");

  const handlePasswordVisible = () => {
    if (visibleToggle === "password") {
      setVisibleToggle("email");
    } else if (visibleToggle === "email") {
      setVisibleToggle("password");
    }
  };

  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = (x) => {
    getProExp(x);
    onOpen();
  };



//set user 
const [user, setUser] = useState(null);
const [hasRun, setHasRun] = useState(false)
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

const [employerFirstName, setEmployerFirstName] = useState(null)
const [employerLastName, setEmployerLastName] = useState(null)
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




  //handle selected category

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [premiumUsersIds, setPremiumUsersIds] = useState(null);
  const [premiumUsers, setPremiumUsers] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (location.state === null) {
    } else {
      console.log("is this the bug?", location.state.category);
      setSelectedCategory(location.state.category);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCategory) {
      const q = query(collection(db, "categories", selectedCategory, "Tier 1"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        let finalResults = [];
        snapshot.docs.forEach((doc) => {
          console.log(doc.id);
          results.push(doc.id);
        });

        results.forEach((results) => {
          const ref = doc(db, "users", results);

          getDoc(ref).then((snapshot) => {
            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              console.log(
                "premium doer in this category info",
                snapshot.data()
              );

              finalResults.push({
                ...snapshot.data(),
              });
            }
          });
        });

        setTimeout(() => {
          if (!finalResults || !finalResults.length) {
            setPremiumUsers(null)
          } else {
            setPremiumUsers(finalResults);
          }
         
         
        }, 200);

        // if (!results || !results.length) {
        //     setPremiumUsersIds(null)
        // } else {
        //     setPremiumUsersIds(results)
        // }
      });
    }
  }, [selectedCategory]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userExperience, setUserExperience] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState(0);

  const getProExp = (x) => {
    console.log(x, x.streamChatID);
    // should this be done on log ina nd stored in redux store so it's cheaper?
    const skillsQuery = query(
      collection(db, "users", x.streamChatID, "User Profile Skills")
    );
    const experienceQuery = query(
      collection(db, "users", x.streamChatID, "User Profile Experience")
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
  };

  const [jobID, setJobID] = useState(null);
  const [jobIDSet, setJobIDSet] = useState(false)


  useEffect(() => {
    if (jobIDSet === false) {
      setJobID(uuidv4());
      setJobIDSet(true)
    }
    
  }, [user])


const getDoerID = (premiumUser) => {
  console.log( premiumUser.streamChatID)
}

  const initiateRequest = (premiumUser) => {
//bring in Doer ID via props.



//get all info about job and set in various places
setDoc(doc(db, "Messages", "intermediate", jobID, "Info"), {
  jobTitle: "Request",
  applicantFirstName: premiumUser.firstName,
  applicantLastName: premiumUser.lastName,
  applicantID: premiumUser.streamChatID,
  employerFirstName: employerFirstName,
  employerLastName: employerLastName,
  employerID: user.uid,
  isHired: false,
  isHourly: false,
  isFlatRate: false,
  isVolunteer: false,
  needsDeposit: false,
  isRequest: true

})
  .then(() => {
    console.log("new chat created global");
  })
  .catch((error) => {
    console.log(error);
  });

setDoc(doc(db, "Messages", jobID), {
  jobTitle: "Request",
  jobID: jobID,
  applicantFirstName: premiumUser.firstName,
  applicantLastName: premiumUser.lastName,
  employerFirstName: employerFirstName,
  employerLastName: employerLastName,
  applicantID: premiumUser.streamChatID,
  employerID: user.uid,
  isHired: false,
  isHourly: false,
  isFlatRate: false,
  confirmedRate: 0,
  jobOffered: false,
  applicationSent: false,
  isVolunteer: false,
  isRequest: true,
  requestOfferMade: false
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

setDoc(doc(db, "users", premiumUser.streamChatID, "User Messages", jobID), {
  placeholder: null,
})
  .then(() => {
    console.log("new chat created applicant");
    // navigation.navigate("MessagesFinal", { props: jobID, firstInterview: true, applicantFirstName: userFirstName });
  })
  .catch((error) => {
    console.log(error);
  });

  setDoc(doc(db, "users", premiumUser.streamChatID, "Requests", jobID), {
    placeholder: null,
    jobTitle: "Request",
    jobID: jobID,
    applicantFirstName: premiumUser.firstName,
    applicantLastName: premiumUser.lastName,
    employerFirstName: employerFirstName,
    employerLastName: employerLastName,
    applicantID: premiumUser.streamChatID,
    employerID: user.uid,
    hasUnreadMessages: false,
    interviewStarted: true,
    offerMade: false,
    isRequest: true,
    requestOfferMade: false
  })
    .then(() => {
      console.log("new chat created applicant");
      // navigation.navigate("MessagesFinal", { props: jobID, firstInterview: true, applicantFirstName: userFirstName });
    })
    .catch((error) => {
      console.log(error);
    });
    setDoc(doc(db, "employers", user.uid, "Requests", jobID), {
     
      jobTitle: "Request",
      jobID: jobID,
      applicantFirstName: premiumUser.firstName,
      applicantLastName: premiumUser.lastName,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      applicantID: premiumUser.streamChatID,
      employerID: user.uid,
      hasUnreadMessage: false,
      interviewStarted: true,
      offerMade: false,
      isRequest: true,
      requestOfferMade: false
    })
      .then(() => {
        console.log("new chat created applicant");
        // navigation.navigate("MessagesFinal", { props: jobID, firstInterview: true, applicantFirstName: userFirstName });
      })
      .catch((error) => {
        console.log(error);
      });
//create chat channel with user and Doer ID.
//navigate to chat channel.
testNewChannel(premiumUser)
  }

  const [isLoading, setIsLoading] = useState(false)
  const client = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);
  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };

  const testNewChannel = async (premiumUser) => {
    setIsLoading(true)
    client.connectUser(userInfo, client.devToken(userID));
    
    const channel = client.channel("messaging", jobID, {
      members: [premiumUser.streamChatID, user.uid],
      name: "Request",
    });

    await channel.create();
    // setNewChannel(newChannel);

    // trying to see if this will return access to "unread" message count
    const startWatching = channel.watch();
    console.log(startWatching);

    setTimeout(() => {

      updateDoc(doc(db, "users", premiumUser.streamChatID, "Requests", jobID), {
        hasUnreadMessage: true,
        interviewStarted: true,
        channelID: channel.cid
      })
        .then(() => {

          // console.log("new message updated in Applied")
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

        updateDoc(doc(db, "employers", userID, "Requests", jobID), {
       
          channelID: channel.cid
        })
          .then(() => {
  
            console.log("new message updated in Applied")
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });

          updateDoc(doc(db, "Messages", jobID), {
       
            channelID: channel.cid
          })
            .then(() => {
    
              console.log("new message updated in Applied")
            })
            .catch((error) => {
              // no bueno
              console.log(error);
            });
          setTimeout(() => {

          }, 1000)
      navigate("/NeederMessageList", {
        state: {
          selectedChannel: channel.cid,
        
        },
      });

      setIsLoading(false)
    }, 1000);
  };

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  //Card Social User PRofile Sample Template credit https://chakra-templates.vercel.app/components/cards
  return (
    <>
      <NeederHeader />

      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        marginTop="16px"
      >
        <NeederDashboard />
        <Flex flex={2}>
          <Box w="60vw" h="90vh" padding="8">
            {/* <Center> */}
            <Heading size="md" marginBottom="24px">
              {selectedCategory} Pros
            </Heading>
            {premiumUsers ? (
              premiumUsers.map((premiumUser) => (
                <>
                  <Box
                    ml={2}
                    mr={2}
                    maxW={"320px"}
                    w={"full"}
                    //   bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={"lg"}
                    rounded={"lg"}
                    p={5}
                    textAlign={"center"}
                    key={premiumUsers.id}
                  >
                    <Avatar
                      size={"xl"}
                      src={premiumUser.profilePictureResponse}
                      mb={4}
                      pos={"relative"}
                      _after={{
                        content: '""',
                        w: 4,
                        h: 4,
                        bg: "green.300",
                        border: "2px solid white",
                        rounded: "full",
                        pos: "absolute",
                        bottom: 0,
                        right: 3,
                      }}
                    />
                    <Heading fontSize={"2xl"} fontFamily={"body"}>
                      {premiumUser.firstName}
                    </Heading>
                    <Center>
                      {premiumUser.numberOfRatings ? (
                        <Flex>
                          {maxRating.map((item, key) => {
                            return (
                              <Box
                                activeopacity={0.7}
                                key={item}
                                marginTop="5px"
                              >
                                <Image
                                  boxSize="16px"
                                  src={
                                    item <= premiumUser.rating
                                      ? star_filled
                                      : star_corner
                                  }
                                ></Image>
                              </Box>
                            );
                          })}
                          <Text marginLeft="4px">
                            ({premiumUser.numberOfRatings} reviews)
                          </Text>
                        </Flex>
                      ) : (
                        <Text marginTop="4px">No reviews yet!</Text>
                      )}
                    </Center>
                    <Box minHeight="72px">
                      <Text
                        textAlign={"center"}
                        // color={useColorModeValue('gray.700', 'gray.400')}
                        px={3}
                        noOfLines={3}
                      >
                        {premiumUser.bio}
                      </Text>
                    </Box>
                    <Heading size="xs" mt={4} mb={2}>
                      Specializes in:
                    </Heading>
                    <Stack
                      align={"center"}
                      justify={"center"}
                      direction={"row"}
                    >
                      {premiumUser.premiumCategoryOne ? (
                        <Tag
                          sz="sm"
                          variant="outline"
                          colorScheme="blue"
                          px={2}
                          py={1}
                        >
                          <TagLabel> {premiumUser.premiumCategoryOne}</TagLabel>
                        </Tag>
                      ) : (
                        <Tag sz="sm" backgroundColor="white" px={2} py={1}>
                          <TagLabel> {premiumUser.premiumCategoryOne}</TagLabel>
                        </Tag>
                      )}

                      {premiumUser.premiumCategoryTwo ? (
                        <Tag
                          sz="sm"
                          variant="outline"
                          colorScheme="blue"
                          px={2}
                          py={1}
                        >
                          <TagLabel> {premiumUser.premiumCategoryTwo}</TagLabel>
                        </Tag>
                      ) : null}
                      {premiumUser.premiumCategoryThree ? (
                        <Tag
                          sz="sm"
                          variant="outline"
                          colorScheme="blue"
                          px={2}
                          py={1}
                        >
                          <TagLabel>
                            {" "}
                            {premiumUser.premiumCategoryThree}
                          </TagLabel>
                        </Tag>
                      ) : null}
                    </Stack>

                    <Stack mt={8} direction={"row"} spacing={4}>
                      {/* <Button
                        flex={1}
                        fontSize={"sm"}
                        rounded={"full"}
                        _focus={{
                          bg: "gray.200",
                        }}
                        onClick={() => handleOpenModal(premiumUser)}
                      >
                        See profile
                      </Button> */}
                      <Button
                        flex={1}
                        fontSize={"sm"}
                        // rounded={"full"}
                        backgroundColor="#01A2E8"
                        color="white"
                        _hover={{ bg: "#018ecb", textColor: "white" }}
                       
                      
                        
                        onClick={() => handleOpenModal(premiumUser)}
                      >
                        See Profile
                      </Button>
                    </Stack>
                  </Box>
                  <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader></ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Center flexDirection="column">
                          <Avatar
                            bg="#01A2E8"
                            size="2xl"
                            src={
                              premiumUser.profilePictureResponse ? (
                                premiumUser.profilePictureResponse
                              ) : (
                                <Avatar />
                              )
                            }
                          />

                          <Heading size="lg"> {premiumUser.firstName}</Heading>
                          <Heading size="md">
                            {" "}
                            {premiumUser.city}, {premiumUser.state}
                          </Heading>

                          {premiumUser.numberOfRatings ? (
                            <Flex>
                              {maxRating.map((item, key) => {
                                return (
                                  <Box
                                    activeopacity={0.7}
                                    key={item}
                                    marginTop="8px"
                                  >
                                    <Image
                                      boxSize="24px"
                                      src={
                                        item <= premiumUser.rating
                                          ? star_filled
                                          : star_corner
                                      }
                                    ></Image>
                                  </Box>
                                );
                              })}

                              <Text marginTop="8px" marginLeft="4px">
                                ({premiumUser.numberOfRatings} reviews)
                              </Text>
                            </Flex>
                          ) : (
                            <Text marginTop="8px" marginLeft="4px">
                              No reviews yet
                            </Text>
                          )}

                          <Stack
                            align={"center"}
                            justify={"center"}
                            direction={"row"}
                            mt={2}
                          >
                            {premiumUser.premiumCategoryOne ? (
                              <Tag
                                sz="sm"
                                variant="outline"
                                colorScheme="blue"
                                px={2}
                                py={1}
                              >
                                <TagLabel>
                                  {" "}
                                  {premiumUser.premiumCategoryOne}
                                </TagLabel>
                              </Tag>
                            ) : (
                              <Tag
                                sz="sm"
                                backgroundColor="white"
                                px={2}
                                py={1}
                              >
                                <TagLabel>
                                  {" "}
                                  {premiumUser.premiumCategoryOne}
                                </TagLabel>
                              </Tag>
                            )}

                            {premiumUser.premiumCategoryTwo ? (
                              <Tag
                                sz="sm"
                                variant="outline"
                                colorScheme="blue"
                                px={2}
                                py={1}
                              >
                                <TagLabel>
                                  {" "}
                                  {premiumUser.premiumCategoryTwo}
                                </TagLabel>
                              </Tag>
                            ) : null}
                            {premiumUser.premiumCategoryThree ? (
                              <Tag
                                sz="sm"
                                variant="outline"
                                colorScheme="blue"
                                px={2}
                                py={1}
                              >
                                <TagLabel>
                                  {" "}
                                  {premiumUser.premiumCategoryThree}
                                </TagLabel>
                              </Tag>
                            ) : null}
                          </Stack>
                        </Center>

                        <Heading size="md" mt={8}>
                          About Me
                        </Heading>

                        <Text
                          aria-multiline="true"
                          textAlign="flex-start"
                          height="auto"
                        >
                          {premiumUser.bio}
                        </Text>

                        <Heading size="md" marginTop="16px">
                          Experience
                        </Heading>
                        {!userExperience ? (
                          <Text>No experience to show</Text>
                        ) : (
                          userExperience.map((userExperience) => (
                            <>
                              <Box key={userExperience.id}>
                                {/* lets just open up a modal to edit this I feel like that would be easier */}
                                <Box marginLeft={5} mt={2}>
                                  <Heading size="md">
                                    {userExperience.Title}
                                  </Heading>

                                  <Text>{userExperience.Years} Years</Text>
                                  <Text>{userExperience.Description}</Text>
                                </Box>
                              </Box>
                            </>
                          ))
                        )}

                        <Box></Box>

                        <Heading size="md" marginTop="16px">
                          Qualifications
                        </Heading>
                        {!userSkills ? (
                          <Text>No experience to show</Text>
                        ) : (
                          userSkills.map((userSkills) => (
                            <>
                              <Box key={userSkills.id}>
                                <Box marginLeft={5} marginTop="4px">
                                  <Heading size="md">
                                    {userSkills.Title}
                                  </Heading>

                                  <Text> {userSkills.Description}</Text>
                                </Box>
                              </Box>
                            </>
                          ))
                        )}
                      </ModalBody>

                      <ModalFooter>
                      
                        {isLoading ? (<Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="#01A2E8"
                      size="lg"
                      marginTop="24px"
                    
                    />) : (<>
                      <Button variant="ghost" marginRight="8px">
                      Close
                    </Button>
<Button
                          backgroundColor="#01A2E8"
                          color="white"
                          _hover={{ bg: "#018ecb", textColor: "white" }}
                          onClick={() => initiateRequest(premiumUser)}
                        >
                          Contact
                        </Button>
                        </>
                    )}
                        
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              ))
            ) : (
              <>
              <Text>Sorry! No {selectedCategory} pros in your area.</Text>
              <Text>Try posting your project for contractors to see instead.</Text>
              <Button
          backgroundColor="#01A2E8"
          color="white"
          _hover={{ bg: "#018ecb", textColor: "white" }}
          marginTop="16px"
          marginRight="24px"
          height="36px"
          onClick={() => navigate("/AddJobStart")}
        >
          Post A Job
        </Button>
              </>
            )}
          
         
           
          </Box>
        </Flex>
      </Stack>
    </>
  );
};

export default NeederSelectedCategory;
