import React from "react";
import { Center, Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import {
  query,
  collection,
  onSnapshot,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Box,
  Avatar,
  Input,
} from "@chakra-ui/react";

import { ChatIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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
} from "@chakra-ui/react";

import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";

const InProgressCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
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

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Jobs In Progress"));

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

  //attemtp to query needer and doer's caht channel using jobTitle as filter

  const [channelID, setChannelID] = useState(null);

  const getChannelID = (x) => {
    console.log("this is whats being passed", x.channelID);
    // if (user != null) {
    // const docRef = doc(db, "users", user.uid, "In Progress", x.jobTitle);
    // getDoc(docRef).then((snapshot) => {
    //   console.log(snapshot.data().channelID);

    //   // setChannelID(snapshot.data().channelID)
    // });

    // } else {
    //   console.log("oops!");
    // }
  };

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };

  const [userConnected, setUserConnected] = useState(false);

  const filter = { type: "messaging", members: { $in: [userID] } };

  // useEffect(() => {
  //   if (userID && chatClient && userConnected === false) {
  //     chatClient.connectUser(userInfo, chatClient.devToken(userID));
  //     console.log("userConnected!", chatClient._user.id);
  //     setUserConnected(true)
  //   } else {
  //   }
  // }, [userID, chatClient]);

  // const client = StreamChat.getInstance(STREAM_CHAT_API_KEY);
  const [selectedChannel, setSelectedChannel] = useState(null);
  //props passed https://stackoverflow.com/questions/64566405/react-router-dom-v6-usenavigate-passing-value-to-another-component
  const navigateToChannel = (x) => {
    navigate("/DoerMessageList", { state: { selectedChannel: x.channelID } });
    console.log(x.channelID);
  };

  const getChannels = async (x) => {
    const channelSort = await chatClient.queryChannels(filter, {});

    setTimeout(() => {
      channelSort.map((channelSort) => {
        // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
        if (channelSort.cid == x.channelID) {
          setSelectedChannel(channelSort);
          console.log("channel found", channelSort.cid);
          console.log("channel from FB", x.channelID);
          //or just navigate from here to selected channel??
          //pass whole channel object to navigate
        } else {
          console.log("no luck", channelSort.cid);
        }
      });
    }, 1000);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChannel !== null) {
      console.log("selected channel", selectedChannel);
      // navigate("TrialSelectedChat", { props: selectedChannel, isFirstInterview: false });
    } else {
      console.log("nope");
    }
  }, [selectedChannel]);

  //get and set data
  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [isOneTime, setIsOneTime] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState(null);
  const [isHourly, setIsHourly] = useState(null);
  const [confirmHours, setConfirmHours] = useState(null);
  const [category, setCategory] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);
  const [jobTitle, setJobTitle] = useState(null)
  const [employerID, setEmployerID] = useState(null)
  const [jobID, setJobID] = useState(null)


  //get data
  const getSelectedData = (postedJobs) => {
   console.log("is this the one Im clicking on?",postedJobs)
   setJobTitle(postedJobs.jobTitle)
   setEmployerID(postedJobs.employerID)
   setJobID(postedJobs.jobID)
    setChannelID(postedJobs.channelID)
    setConfirmedRate(postedJobs.confirmedRate);
    setLowerRate(postedJobs.lowerRate);
    setUpperRate(postedJobs.upperRate);
    setDescription(postedJobs.description);
    setCity(postedJobs.city);
    setIsHourly(postedJobs.isHourly);
    setLocationLat(postedJobs.locationLat);
    setLocationLng(postedJobs.locationLng);
    // setEmployerID(snapshot.data().employerID);
    setZipCode(postedJobs.zipCode);
    setCategory(postedJobs.category);
    setState(postedJobs.state);

    setBusinessName(postedJobs.businessName);
    setStreetAddress(postedJobs.streetAddress);
    setRequirements(postedJobs.requirements);
    setNiceToHave(postedJobs.niceToHave);
    setRequirements2(postedJobs.requirements2);
    setRequirements3(postedJobs.requirements3);
    setIsOneTime(postedJobs.isOneTime);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenHourly,
    onOpen: onOpenHourly,
    onClose: onCloseHourly,
  } = useDisclosure();

  //rate then
  //if flatrate, submit rating and disperse all other necissary info
  //else if hourly: confirm hours worked and submit to employer, move all other data

  const handleModalOpen = (postedJobs) => {
    getSelectedData(postedJobs);
    onOpen();
  };

  // credit: https://www.youtube.com/watch?v=276IyIIdJnA

  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,3}$/;

  const [confirmHoursValidationMessage, setConfirmHoursValidationMessage] =
    useState();

  const [confirmHoursValidationBegun, setConfirmHoursValidationBegun] =
    useState(false);

  const confirmHoursValidate = (confirmHours) => {
    setConfirmHoursValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(confirmHours);
    if (!isValid) {
      setConfirmHoursValidationMessage("Please enter valid hours");
      console.log(confirmHoursValidationMessage);
      setConfirmHours(confirmHours);
    } else {
      setConfirmHoursValidationMessage();
      setConfirmHours(confirmHours);
    }
  };

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = (postedJobs) => {
    const rateValid = minLengthRegEx.test(confirmHours);

    if (
      !rateValid ||
      typeof confirmHours === "undefined" ||
      !confirmHours ||
      confirmHours === "0"
    ) {
      alert("Please enter valid rate");
    } else {
      addHoursWorkedNavigate(postedJobs);
    }
  };

  const addHoursWorkedNavigate = () => {
    //push to respective In Review dbs, user and employer

    // setIsLoading(true)

    //set hasbeenRated to false so employer can check if they have been rated yet

    setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
      ratingComplete: false,
    });

    setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
      confirmedRate: confirmedRate,
      confirmHours: confirmHours,
      employerID: employerID,
      isHourly: isHourly,
      jobTitle: jobTitle,
      jobID: jobID,
      description: description,
      city: city,
      lowerRate: lowerRate,
      upperRate: upperRate,
channelID : channelID,
      isOneTime: isOneTime,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      locationLat: locationLat,
      locationLng: locationLng,
      hiredApplicant: user.uid,
      jobCompleteApplicant: true,
      jobCompleteEmployer: false,
    })
      .then(() => {
        console.log("moved to review for USER");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(
      doc(
        db,
        "employers",
        employerID,
        "In Review",
        jobTitle
      ),
      {
        confirmedRate: confirmedRate,
        confirmHours: confirmHours,
        employerID: employerID,
        jobTitle: jobTitle,
        jobID: jobID,
        isHourly: isHourly,
        description: description,
        city: city,
        channelID : channelID,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        locationLat: locationLat,
        locationLng: locationLng,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      }
    )
      .then(() => {
        console.log("moved to review for USER");
      })
      .catch((error) => {
        console.log(error);
      });

    deleteDoc(
      doc(db, "users", user.uid, "Jobs In Progress", jobTitle)
    )
      .then(() => {
        //all good
        console.log("removed from users saved Jobs");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(
      doc(
        db,
        "employers",
        employerID,
        "Jobs In Progress",
        jobTitle
      )
    )
      .then(() => {
        //all good
        console.log("removed from users saved Jobs");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    //submit data
    setDoc(
      doc(
        db,
        "employers",
        employerID,
        "Ratings",
       jobTitle
      ),
      {
        rating: defaultRating,
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

    setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
      ratingComplete: false,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => {
      // setIsLoading(false)
      alert(
        "Job complete! Payment pending verification from employer. Paymenty can take 3-5 business days to transfer."
      );
      onCloseHourly();
      navigate("/DoerInProgressList");
    }, 2500);
  };

  const addRating = () => {
   
    if (isHourly === true) {
      //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
      onClose();
      onOpenHourly();
    } else {
      //move to under Review.. should this be for both users? Most likely

      // setIsLoading(true)

      //submitted if flat rate

      setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        channelID : channelID,
        city: city,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {
          console.log("moved to review for USER");
        })
        .catch((error) => {
          console.log(error);
        });

      setDoc(
        doc(
          db,
          "employers",
         employerID,
          "In Review",
          jobTitle
        ),
        {
          confirmedRate: confirmedRate,
          employerID: employerID,
          jobTitle: jobTitle,
          isHourly: isHourly,
          jobID: jobID,
          description: description,
          locationLat: locationLat,
          locationLng: locationLng,
          channelID : channelID,
          city: city,
          lowerRate: lowerRate,
          upperRate: upperRate,
          isVolunteer: isVolunteer,
          isOneTime: isOneTime,
          streetAddress: streetAddress,
          state: state,
          zipCode: zipCode,
          requirements: requirements,
          requirements2: requirements2,
          requirements3: requirements3,
          niceToHave: niceToHave,
          // locationLat: locationLat,
          // locationLng: locationLng,
          hiredApplicant: user.uid,
          jobCompleteApplicant: true,
          jobCompleteEmployer: false,
        }
      )
        .then(() => {
          console.log("moved to review for USER");
        })
        .catch((error) => {
          console.log(error);
        });

      deleteDoc(
        doc(db, "users", user.uid, "Jobs In Progress", jobTitle)
      )
        .then(() => {
          //all good
          console.log("removed from users saved Jobs");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      deleteDoc(
        doc(
          db,
          "employers",
        employerID,
          "Jobs In Progress",
          jobTitle
        )
      )
        .then(() => {
          //all good
          console.log("removed from users saved Jobs");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      //submit data

      setDoc(
        doc(
          db,
          "employers",
          employerID,
          "Ratings",
          jobTitle
        ),
        {
          rating: defaultRating,
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

      setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
        ratingComplete: false,
      })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

      setTimeout(() => {
        // setIsLoading(false)
        alert(
          "Job complete! Payment pending verification from employer. Paymenty can take 3-5 business days to transfer."
        );
        onClose();
        navigate("/DoerInProgressList");
      }, 2500);
    }
  };

  const addWithNoRating = () => {
    if (isHourly === true) {
      //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
      onClose();
      onOpenHourly();
    } else {
      //move to under Review.. should this be for both users? Most likely

      // setIsLoading(true)

      //submitted if flat rate

      setDoc(doc(db, "users", user.uid, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        city: city,
        channelID : channelID,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        hiredApplicant: user.uid,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
      })
        .then(() => {
          console.log("moved to review for USER");
        })
        .catch((error) => {
          console.log(error);
        });

      setDoc(
        doc(
          db,
          "employers",
          employerID,
          "In Review",
          jobTitle
        ),
        {
          confirmedRate: confirmedRate,
          employerID: employerID,
          jobTitle: jobTitle,
          isHourly: isHourly,
          jobID: jobID,
          description: description,
          locationLat: locationLat,
          locationLng: locationLng,
          channelID : channelID,
          city: city,
          lowerRate: lowerRate,
          upperRate: upperRate,
          isVolunteer: isVolunteer,
          isOneTime: isOneTime,
          streetAddress: streetAddress,
          state: state,
          zipCode: zipCode,
          requirements: requirements,
          requirements2: requirements2,
          requirements3: requirements3,
          niceToHave: niceToHave,
    
          hiredApplicant: user.uid,
          jobCompleteApplicant: true,
          jobCompleteEmployer: false,
        }
      )
        .then(() => {
          console.log("moved to review for USER");
        })
        .catch((error) => {
          console.log(error);
        });

      deleteDoc(
        doc(db, "users", user.uid, "Jobs In Progress", postedJobs[0].jobTitle)
      )
        .then(() => {
          //all good
          console.log("removed from users saved Jobs");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      deleteDoc(
        doc(
          db,
          "employers",
          postedJobs[0].employerID,
          "Jobs In Progress",
          postedJobs[0].jobTitle
        )
      )
        .then(() => {
          //all good
          console.log("removed from users saved Jobs");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

      setDoc(doc(db, "users", user.uid, "Ratings", postedJobs[0].jobTitle), {
        ratingComplete: false,
      })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

      setTimeout(() => {
        // setIsLoading(false)
        alert(
          "Job complete! Payment pending verification from employer. Paymenty can take 3-5 business days to transfer."
        );
        onClose();
        navigate("/DoerInProgressList");
      }, 2500);
    }
  };

  const handleCloseAndOpen = (postedJobs) => {
    if (isHourly === true) {
      onClose();
      onOpenHourly();
    } else {
      onClose();
      addWithNoRating(postedJobs);
    }
  };
  return (
    <div>
      {!postedJobs ? (
        <Text marginLeft="6px" marginTop="4">
          No jobs in progress
        </Text>
      ) : (
        postedJobs?.map((postedJobs) => (
          <div>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              width="auto"
              borderWidth="1px"
              borderColor="#E3E3E3"
              // borderLeftWidth="4px"
              // borderRightWidth="4px"
              height="auto"
              marginTop="16px"
              boxShadow="md"
              rounded="lg"
            >
              <Stack>
                <CardBody>
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginLeft="16px"
                  >
                    <Heading fontSize="24">{postedJobs.jobTitle}</Heading>
                    {/* <Flex
                      direction="column"
                      position="absolute"
                      right="8"
                      alignItems="center"
                      marginTop="36"
                    >
                      <ChatIcon boxSize={6} color="#01A2E8"></ChatIcon>
                      <Text>Messages</Text>
                    </Flex> */}
                  </Flex>

                  {/* <Text size="sm">Total Pay ${postedJobs.confirmedRate}</Text> */}
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginTop="4"
                    marginLeft="16px"
                  >
                    <Avatar
                      src="https://bit.ly/broken-link"
                      bg="#01A2E8"
                      size="lg"
                    />

                    <Box marginTop="2">
                      <Heading size="sm"> {postedJobs.employerName}</Heading>
                      <Text> {postedJobs.city}, MN</Text>
                      <Text size="sm">
                        Total Pay ${postedJobs.confirmedRate}
                      </Text>
                    </Box>
                  </Flex>

                  {/* <Button
                    colorScheme="white"
                    textColor="#01A2E8"
                    outlineColor="#01A2E8"
                    width="240px"
                    marginRight="240"
                    position="absolute"
                    right="0"
                  >
                    Go To Messages
                  </Button> */}
                  <Flex direction="column" marginLeft="16px">
                    <Heading size="sm" marginTop="2">
                      Description
                    </Heading>
                    <Text>{postedJobs.description}</Text>
                  </Flex>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <Flex direction="row-reverse" width="890px">
                        <AccordionButton
                          width="120px"
                          position="flex-start"
                          bottom="8px"
                        >
                          <Box>See More</Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={4}>
                        <Heading size="sm" marginTop="2">
                          Requirements
                        </Heading>
                        {postedJobs.requirements ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : (
                          <Text>No requirements listed</Text>
                        )}

                        {postedJobs.requirements2 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements2}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        {postedJobs.requirements3 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements3}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        <Heading size="sm" marginTop="2">
                          Additional Notes
                        </Heading>
                        {postedJobs.niceToHave ? (
                          <Text marginBottom="48px">
                            {postedJobs.niceToHave}
                          </Text>
                        ) : (
                          <Text marginBottom="48px">Nothing listed</Text>
                        )}

                        {/* <Button
                    colorScheme="white"
                    textColor="#01A2E8"
                    outlineColor="#01A2E8"
                    width="180px"
                    height="32px"
                    position="absolute"
                    right="10"
                    bottom="8"
                    alignItems="center"
                  >
                   Messages <ArrowForwardIcon marginLeft="4" />
                  </Button> */}
                        <Center>
                          <Button
                            backgroundColor="white"
                            textColor="black"
                            borderWidth=".5px"
                            // borderColor="black"
                            width="240px"
                            height="40px"
                            // position="absolute"
                            // right="10"
                            // bottom="8"
                            alignItems="center"
                            marginRight="16px"
                            // onClick={() => getChannels(postedJobs)}
                            onClick={() => navigateToChannel(postedJobs)}
                          >
                            Go To Messages
                            {/* <ArrowForwardIcon marginLeft="2" marginTop="2px" /> */}
                          </Button>

                          <Button
                            colorScheme="blue"
                            width="240px"
                            height="40px"
                            onClick={() => handleModalOpen(postedJobs)}
                          >
                            Mark Complete
                          </Button>
                        </Center>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Stack>
            </Card>
          </div>
        ))
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rate This User (optional)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Flex>
                {maxRating.map((item, key) => {
                  return (
                    <Button
                      activeopacity={0.7}
                      key={item}
                      marginTop="8px"
                      onClick={() => setDefaultRating(item)}
                    >
                      <Image
                        boxSize="24px"
                        src={item <= defaultRating ? star_filled : star_corner}
                      ></Image>
                    </Button>
                  );
                })}
              </Flex>
            </>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => handleCloseAndOpen(postedJobs)}
            >
              Skip
            </Button>
            <Button colorScheme="blue" 
            onClick={() => addRating(postedJobs)}>
       
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenHourly} onClose={onCloseHourly} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hours worked</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <FormLabel marginTop="8" width>
                How many hours did you work?
              </FormLabel>
              <Flex>
                <Input
                  width="240px"
                  placeholder="Enter hours worked here"
                  onChange={(e) => confirmHoursValidate(e.target.value)}
                />{" "}
                <Heading size="sm" marginTop="8px" marginLeft="8px">
                  {" "}
                  Hours
                </Heading>
              </Flex>
              {confirmHoursValidationBegun === true ? (
                <Text color="red">{confirmHoursValidationMessage}</Text>
              ) : null}
              <Text>{confirmHours}</Text>
            </>
          </ModalBody>

          <ModalFooter>
            {/* <Button variant="ghost" mr={3} onClick={onCloseHourly}>
              Skip
            </Button> */}
            <Button colorScheme="blue" onClick={() => checkLength(postedJobs)}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InProgressCard;
