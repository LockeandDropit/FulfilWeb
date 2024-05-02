import React from "react";

import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  Avatar,
  Center,
  Image,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { auth, db } from "../../../firebaseConfig";
import {
  query,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { useEffect, useState, useCallback } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

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
function MarkCompleteModal(props) {
  console.log("props", props);

  const [hasRun, setHasRun] = useState(false);
  const [user, setUser] = useState(null);
 
  const navigate = useNavigate();

  const [userHasRun, setUserHasRun] = useState(false);

  useEffect(() => {
    if (hasRun) {
    } else {
      onOpenMarkComplete();
      setHasRun(true);
    }
  }, []);

  useEffect(() => {
    if (userHasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setUserHasRun(true);
    } else {
    }
  }, []);

  //logic for marking job complete
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [defaultRating, setDefaultRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isOpenMarkComplete,
    onOpen: onOpenMarkComplete,
    onClose: onCloseMarkComplete,
  } = useDisclosure();
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenHourly,
    onOpen: onOpenHourly,
    onClose: onCloseHourly,
  } = useDisclosure();

  const handleCloseRatingModal = () => {
    setHasRun(false);
    onCloseMarkComplete();
  };

  //make all needed props one object in ChannelHireHEader and pass them here
  //then addRating()... etc.

  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [addressNumber, setAddressNumber] = useState(null);
  const [addressName, setAddressName] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [addressSuffix, setAddressSuffix] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [employerID, setEmployerID] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [flatRate, setFlatRate] = useState(null);
  const [isHourly, setIsHourly] = useState(null);
  const [category, setCategory] = useState(null);
  const [isOneTime, setIsOneTime] = useState(null);
  const [lowerCaseJobTitle, setLowerCaseJobTitle] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null);
  const [confirmHours, setConfirmHours] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [channelID, setChannelID] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState(null);

  const handleCloseAndOpen = () => {
    if (isHourly === true) {
      onCloseMarkComplete();
      onOpenHourly();
    } else {
      onCloseMarkComplete();
      addWithNoRating();
    }
  };

  
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
    
      setConfirmHours(confirmHours);
    } else {
      setConfirmHoursValidationMessage();
      setConfirmHours(confirmHours);
    }
  };

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmHours);

    if (
      !rateValid ||
      typeof confirmHours === "undefined" ||
      !confirmHours ||
      confirmHours === "0"
    ) {
      alert("Please enter valid rate");
    } else {
      addHoursWorkedNavigate();
    }
  };

  useEffect(() => {
    if (props && user) {
      getDoc(doc(db, "users", user.uid, "Jobs In Progress", props.props.jobTitle))
        .then((snapshot) => {
            console.log(snapshot.data())
            setConfirmedRate(snapshot.data().confirmedRate)
            setJobID(snapshot.data().jobID)
          setFlatRate(snapshot.data().flatRate);
          setChannelID(snapshot.data().channelID)
          setJobTitle(snapshot.data().jobTitle);
          setLowerRate(snapshot.data().lowerRate);
          setUpperRate(snapshot.data().upperRate);
          setCity(snapshot.data().city);
          setIsOneTime(snapshot.data().isOneTime);
          setLowerCaseJobTitle(snapshot.data().lowerCaseJobTitle);
          setEmployerID(snapshot.data().employerID);
          setEmployerFirstName(snapshot.data().firstName);
          setZipCode(snapshot.data().zipCode);
          setDescription(snapshot.data().description);
          setIsHourly(snapshot.data().isHourly);
          setIsFlatRate(snapshot.data().isFlatRate);
          setLocationLat(snapshot.data().locationLat);
          setLocationLng(snapshot.data().locationLng);
          setCategory(snapshot.data().category);
          setState(snapshot.data().state);
          setBusinessName(snapshot.data().businessName);
          setStreetAddress(snapshot.data().streetAddress);
          setRequirements(snapshot.data().requirements);
          setBusinessName(snapshot.data().businessName);
          setNiceToHave(snapshot.data().niceToHave);
          setRequirements2(snapshot.data().requirements2);
          setRequirements3(snapshot.data().requirements3);
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [props, user]);


  const addHoursWorkedNavigate = () => {
    //push to respective In Review dbs, user and employer

    setIsLoading(true)

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
      channelID: channelID,
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
      
      })
      .catch((error) => {
       
      });

    setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
      confirmedRate: confirmedRate,
      confirmHours: confirmHours,
      employerID: employerID,
      jobTitle: jobTitle,
      jobID: jobID,
      isHourly: isHourly,
      description: description,
      city: city,
      channelID: channelID,
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
    })
      .then(() => {
   
      })
      .catch((error) => {
    
      });

    deleteDoc(doc(db, "users", user.uid, "Jobs In Progress", jobTitle))
      .then(() => {
        //all good
      
      })
      .catch((error) => {
        // no bueno
      
      });

    deleteDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle))
      .then(() => {
        //all good
       
      })
      .catch((error) => {
        // no bueno
       
      });

    //submit data
    setDoc(doc(db, "employers", employerID, "Ratings", jobTitle), {
      rating: defaultRating,
    })
      .then(() => {
        //all good
      
      })
      .catch((error) => {
        // no bueno
     
      });

    setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
      ratingComplete: false,
    })
      .then(() => {})
      .catch((error) => {
     
      });

    setTimeout(() => {
      setIsLoading(false)
      
      onCloseHourly();
      onOpenSuccess()
      navigate("/DoerMessageList");
    }, 2500);
  };

  const addWithNoRating = () => {
    if (isHourly === true) {
      //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
      onCloseMarkComplete();
      onOpenHourly();
    } else {
      //move to under Review.. should this be for both users? Most likely

      setIsLoading(true);

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
        channelID: channelID,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: false,
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
         
        })
        .catch((error) => {
          
        });

      setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
        confirmedRate: confirmedRate,
        employerID: employerID,
        jobTitle: jobTitle,
        isHourly: isHourly,
        jobID: jobID,
        description: description,
        locationLat: locationLat,
        locationLng: locationLng,
        channelID: channelID,
        city: city,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: false,
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
          
        })
        .catch((error) => {
         
        });

      deleteDoc(
        doc(db, "users", user.uid, "Jobs In Progress", jobTitle)
      )
        .then(() => {
          //all good
       
        })
        .catch((error) => {
          // no bueno
       
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
        
        })
        .catch((error) => {
         
        });

      setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
        ratingComplete: false,
      })
        .then(() => {
          setIsLoading(true);
        })
        .catch((error) => {
         
        });

      setTimeout(() => {
        setIsLoading(false);
        
        onCloseMarkComplete();
        onOpenSuccess()
        navigate("/DoerMessageList");
      }, 2500);
    }
  };

    const addRating = () => {
      if (isHourly === true) {
        //modal opened then hours worked confirmed, sent to addHoursWorkedNavigate()
        onCloseMarkComplete();
        onOpenHourly();
      } else {
        //move to under Review.. should this be for both users? Most likely

        setIsLoading(true)

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
          channelID: channelID,
          city: city,
          lowerRate: lowerRate,
          upperRate: upperRate,
          isVolunteer: false,
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

          })
          .catch((error) => {

          });

        setDoc(doc(db, "employers", employerID, "In Review", jobTitle), {
          confirmedRate: confirmedRate,
          employerID: employerID,
          jobTitle: jobTitle,
          isHourly: isHourly,
          jobID: jobID,
          description: description,
          locationLat: locationLat,
          locationLng: locationLng,
          channelID: channelID,
          city: city,
          lowerRate: lowerRate,
          upperRate: upperRate,
          isVolunteer: false,
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

          })
          .catch((error) => {

          });

        deleteDoc(doc(db, "users", user.uid, "Jobs In Progress", jobTitle))
          .then(() => {
            //all good

          })
          .catch((error) => {
            // no bueno

          });

        deleteDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle))
          .then(() => {
            //all good

          })
          .catch((error) => {
            // no bueno

          });

        //submit data

        setDoc(doc(db, "employers", employerID, "Ratings", jobTitle), {
          rating: defaultRating,
        })
          .then(() => {
            //all good

          })
          .catch((error) => {
            // no bueno

          });

        setDoc(doc(db, "users", user.uid, "Ratings", jobTitle), {
          ratingComplete: false,
        })
          .then(() => {})
          .catch((error) => {

          });

        setTimeout(() => {
          setIsLoading(false)

          onCloseMarkComplete();
          onOpenSuccess()
          navigate("/DoerMessageList");
        }, 2500);
      }
    };


    const handleBothModalClose = () => {
        onCloseHourly()
        onCloseMarkComplete()
        onCloseSuccess()
      }

  return (
    <>
      <Modal
        isOpen={isOpenMarkComplete}
        onClose={() => handleCloseRatingModal()}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rate This User (optional)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Center>
                {" "}
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  marginTop="24px"
                />
              </Center>
            ) : (
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
                          src={
                            item <= defaultRating ? star_filled : star_corner
                          }
                        ></Image>
                      </Button>
                    );
                  })}
                </Flex>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => handleCloseAndOpen()}
            >
              Skip
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => addRating()}
            >
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
                      {isLoading ? (
                        <Center>
                          {" "}
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                            marginTop="36px"
                          />
                        </Center>
                      ) : (
                        <>
                          {" "}
                          <FormLabel marginTop="8" width>
                            How many hours did you work?
                          </FormLabel>
                          <Flex>
                            <Input
                              width="240px"
                              placeholder="Enter hours worked here"
                              onChange={(e) =>
                                confirmHoursValidate(e.target.value)
                              }
                            />{" "}
                            <Heading size="sm" marginTop="8px" marginLeft="8px">
                              {" "}
                              Hours
                            </Heading>
                          </Flex>
                          {confirmHoursValidationBegun === true ? (
                            <Text color="red">
                              {confirmHoursValidationMessage}
                            </Text>
                          ) : null}
                          <Text>{confirmHours}</Text>
                        </>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      {/* <Button variant="ghost" mr={3} onClick={onCloseHourly}>
              Skip
            </Button> */}
                      <Button
                        colorScheme="blue"
                        onClick={() => checkLength()}
                      >
                        Submit
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Success!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                     
                       <Text>This job has been completed and the person who posted this job has been notified.</Text>
                       <Text>Payment will be sent when they confirm the job has been completed.</Text>
                    </ModalBody>

                    <ModalFooter>
                      
                      <Button
                        colorScheme="blue"
                        onClick={() => handleBothModalClose()}
                      >
                        Continue
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
    </>
  );
}

export default MarkCompleteModal;
