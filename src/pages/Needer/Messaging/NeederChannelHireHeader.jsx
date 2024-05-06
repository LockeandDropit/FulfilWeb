import React from "react";
import NeederDashboard from "../NeederDashboard";
import NeederHeader from "../NeederHeader";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Text, Box, Container } from "@chakra-ui/react";
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
  deleteDoc,
  snapshotEqual,
} from "firebase/firestore";
import { ChannelFilters, ChannelOptions, ChannelSort, User } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  SearchBar,
  Thread,
  Window,
  useChatContext,
  InfiniteScroll,
  useChannelStateContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";
import CreateOfferModal from "../NeederComponents/CreateOfferModal";
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
import EmbeddedPayments from "../../../components/EmbeddedPayments";

import { ArrowBackIcon} from '@chakra-ui/icons'
import { useMediaQuery } from "@chakra-ui/react";


const NeederChannelHireHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHired, setIsHired] = useState();

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const [jobID, setJobID] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState();
  const [jobOffered, setJobOffered] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState();
  const [isHourly, setIsHourly] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);

  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        // console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const { channel, watchers } = useChannelStateContext();

  const [intermediateIDs, setIntermediateIDs] = useState(null);
  const [bothIDs, setBothIDs] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null);
  const [applicantFirstName, setApplicantFirstName] = useState(null);

  useEffect(() => {
    getChannels();
  }, [channel]);
  const [middleMembers, setMiddleMembers] = useState(null);

  const getChannels = async () => {
    const channels = await channel.queryMembers({});

    setMiddleMembers(channels.members);
  };

  useEffect(() => {
    let ids = [];

    if (middleMembers !== null) {
      middleMembers.map((middleMembers) => {
        ids.push(middleMembers.user.id);
        if (middleMembers.role === "member") {
          setApplicantFirstName(middleMembers.user.name);
        } else {
        }
      });
    } else {
    }

    setBothIDs(ids);
  }, [middleMembers]);

  useEffect(() => {
    // it works but I got a bit lost in the weeds on this one boys
    let results = [];
    if (intermediateIDs !== null) {
      for (var key in intermediateIDs) {
        if (intermediateIDs.hasOwnProperty(key)) {
          results.push(intermediateIDs[key].id);
        }
        setBothIDs(results);
      }
    } else {
      // console.log("duoh!");
    }
  }, [intermediateIDs]);

  const [applicantID, setApplicantID] = useState(null);

  useEffect(() => {
    if (bothIDs !== null) {
      bothIDs.map((x) => {
        if (x !== userID) {
          console.log("applicant", x);
          setApplicantID(x);
        } else {
        }
      });
    } else {
    }
  }, [bothIDs]);

  const [finalBlock, setFinalBlock] = useState([]);
  const [readyToSet, setReadyToSet] = useState(null);

  const [intermediateBlockReady, setIntermediateBlockReady] = useState(false);
  const [messageBlockReady, setMessageBlockReady] = useState(false);
  const [finalBlockReady, setFinalBlockReady] = useState(false);
  const [isRequest, setIsRequest] = useState(null);
  const [requestOfferMade, setRequestOfferMade] = useState(null);
  const [requestAccepted, setRequestAccepted] = useState(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const collectionRef = collection(db, "Messages");
    const q = query(collectionRef);

    let finalBlock = [];

    onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        if (
          doc._document.data.value.mapValue.fields.applicantID.stringValue ===
            applicantID &&
          doc._document.data.value.mapValue.fields.employerID.stringValue ===
            userID &&
          doc._document.data.value.mapValue.fields.jobTitle.stringValue ===
            channel.data.name &&
          doc._document.data.value.mapValue.fields.jobID.stringValue ===
            channel.id
        ) {
          if (
            doc._document.data.value.mapValue.fields.isRequest &&
            doc._document.data.value.mapValue.fields.requestOfferMade
          ) {
            setRequestOfferMade(
              doc._document.data.value.mapValue.fields.requestOfferMade
                .booleanValue
            );
          }

          // console.log("channel ID ", doc._document.data.value.mapValue.fields.channelID.stringValue, channel.cid)
          console.log("checking 2 ", doc._document.data.value.mapValue.fields);
          setFinalBlock([
            ...finalBlock,
            doc._document.data.value.mapValue.fields,
          ]);
          setApplicantFirstName(
            doc._document.data.value.mapValue.fields.applicantFirstName
              .stringValue
          );
          setJobTitle(
            doc._document.data.value.mapValue.fields.jobTitle.stringValue
          );
          setJobOffered(
            doc._document.data.value.mapValue.fields.jobOffered.booleanValue
          );
          setConfirmedRate(
            doc._document.data.value.mapValue.fields.confirmedRate.integerValue
          );
          setIsHourly(
            doc._document.data.value.mapValue.fields.isHourly.booleanValue
          );
          setIsHired(
            doc._document.data.value.mapValue.fields.isHired.booleanValue
          );
          // setNeedsDeposit(
          //   doc._document.data.value.mapValue.fields.needsDeposit.booleanValue
          // );
          setIsVolunteer(
            doc._document.data.value.mapValue.fields.isVolunteer.booleanValue
          );

          setJobID(doc._document.data.value.mapValue.fields.jobID.stringValue);
          setEmployerFirstName(
            doc._document.data.value.mapValue.fields.employerFirstName
              .stringValue
          );
        } else {
          console.log("either or");
        }
      });
    });
  }, [channel, userID, applicantID, isRequest]);

  const [jobCompleteEmployer, setJobCompleteEmployer] = useState(null)
  const [jobCompleteApplicant, setJobCompleteApplicant] = useState(null)
  const [selectedJobForPayment, setSelectedJobForPayment] = useState(null);

  const getPaymentData = () => {
    const q = query(collection(db, "employers", userID, "In Review"));
   
      onSnapshot(q, (snapshot) => {
        // const docRef = doc(db, "employers", employerID, "In Review", jobTitle);
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          if (doc.data().jobID === jobID) {        
         setSelectedJobForPayment(doc.data())
            }           
          }  
        )
      });
  }

  useEffect(() => {
    if (userID && jobTitle ) {

      const q = query(collection(db, "employers", userID, "In Review"));
   
      onSnapshot(q, (snapshot) => {
        // const docRef = doc(db, "employers", employerID, "In Review", jobTitle);
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          if (doc.data().jobID === jobID) {
            console.log("got it ", doc.data())
              setJobCompleteEmployer(doc.data().jobCompleteEmployer)
              setJobCompleteApplicant(doc.data().jobCompleteApplicant)
         
            }           
          }  
        )
      });
    }},[userID, jobTitle, isHired] )

  console.log(channel.data.name, userID, applicantID);

  const [channelUsers, setChannelUsers] = useState(null);
  const [parsedUsers, setParsedUsers] = useState(null);

  useEffect(() => {
    setChannelUsers(channel.state.read);
  }, [channel]);

  //separating object with things I could not access Nenad Vracar https://stackoverflow.com/questions/45035514/split-object-into-two-properties

  useEffect(() => {
    if (channelUsers) {
      var result = Object.keys(channelUsers).map((e) => ({
        user: e,
        body: channelUsers[e],
      }));

      setParsedUsers(result);
    }
  }, [channelUsers]);

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenOffer,
    onOpen: onOpenOffer,
    onClose: onCloseOffer,
  } = useDisclosure();

  //checking validity of docs help from DoesData https://stackoverflow.com/questions/47308159/whats-the-best-way-to-check-if-a-firestore-record-exists-if-its-path-is-known

  useEffect(() => {
    if (parsedUsers && userID && applicantID && jobTitle) {
      console.log(userID);
      parsedUsers.forEach((parsedUser) => {
        if (parsedUser.user === userID) {
          if (parsedUser.body.unread_messages === 0) {
            var appliedDocRef = doc(
              db,
              "employers",
              userID,
              "Applicants",
              jobTitle,
              applicantID
            );
            var inProgressDocRef = doc(
              db,
              "employers",
              userID,
              "In Progress",
              jobTitle
            );
            var inReviewDocRef = doc(
              db,
              "employers",
              userID,
              "In Review",
              jobTitle
            );

            getDoc(appliedDocRef).then((snapshot) => {
              if (!snapshot.data()) {
              } else {
                updateDoc(appliedDocRef, {
                  hasUnreadMessage: false,
                })
                  .then(() => {
                    console.log("new message updated in Applied");
                  })
                  .catch((error) => {
                    // no bueno
                    console.log(error);
                  });
              }
            });

            getDoc(inProgressDocRef).then((snapshot) => {
              if (!snapshot.data()) {
              } else {
                updateDoc(inProgressDocRef, {
                  hasUnreadMessage: false,
                })
                  .then(() => {
                    console.log("new message updated in Progress");
                  })
                  .catch((error) => {
                    // no bueno
                    console.log(error);
                  });
              }
            });

            getDoc(inReviewDocRef).then((snapshot) => {
              if (!snapshot.data()) {
              } else {
                updateDoc(inReviewDocRef, {
                  hasUnreadMessage: false,
                })
                  .then(() => {
                    console.log("new message updated in Review");
                  })
                  .catch((error) => {
                    // no bueno
                    console.log(error);
                  });
              }
            });
          }
        } else if (parsedUser.user === applicantID) {
        }
      });
    }
  }, [parsedUsers, userID, applicantID]);

  console.log("This is selected channel", channel);

  const deleteApplicant = () => {
    deleteDoc(
      doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        jobTitle,
        "Applicants",
        applicantID
      )
    )
      .then(async () => {
        //Employer removed applicant from list, retunrs to list of applicants for Posted Job
        alert("Applicant Removed");

        await channel.delete();
        navigate("EmployerChatList");
      })
      .catch((error) => {
        //uh oh
        console.log(error);
      });

    // deleteMessages();
  };

  useEffect(() => {
    if (user != null) {
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        channel.data.name
      );

      getDoc(docRef).then((snapshot) => {
        console.log("current job", snapshot.data());
        if (snapshot.data()) {
          setIsFlatRate(snapshot.data().isFlatRate);
          setIsHourly(snapshot.data().isHourly);
          // setApplicantFirstName(snapshot.data().applicantFirstName)
        } else {
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // check to see if its a Request
  useEffect(() => {
    if (user != null && jobID) {
      const docRef = doc(db, "employers", user.uid, "Requests", jobID);

      getDoc(docRef).then((snapshot) => {
        console.log("request", snapshot.data());
        if (snapshot.data()) {
          setIsRequest(true);
        } else {
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user, jobID]);

  const sendOffer = () => {
    //// uhh this code will remove the "do you want to hire this person" card in Messages
    // it will give a pop-up that allows them to solidify the amouint being paid. DONE.
    //this will also trigger the same header to accept the amount in the user's chat. INFO SENT
    //cue push notification to user (TO DO)//

    const confirmedRateInt = parseInt(confirmedRate, 10);

    //this needs to be done from worker side?

    // updateDoc(doc(db, "employers", user.uid, "Jobs In Progress", jobTitle), {
    //   confirmedRate: confirmedRateInt,
    // })
    //   .then(() => {
    //     console.log("all good");
    //     setModalVisible(false);
    //     alert("offer sent!");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    updateDoc(doc(db, "Messages", jobID), {
      jobOffered: true,
      confirmedRate: confirmedRateInt,
      isHourly: isHourly,
      applicationSent: true,
      isHired: false,
    })
      .then(() => {
        console.log("all good");
        if (isHourly === true) {
          onClose();
        } else {
        }
        if (isFlatRate === true) {
          onCloseFlatRate();
        } else {
        }
        onOpenSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //data for dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value != null) {
      setConfirmedRate(value);
    } else {
    }
  }, [value]);

  const dataLoaded = true;

  useEffect(() => {
    console.log("confirmedRate", confirmedRate);
  });

  useEffect(() => {
    //get rid of useEffect that calls this data from FB. Check if is hourly, then set isFlat rate based off of that. This will negate that weird crash???

    if (isHourly === true) {
    } else {
      setIsFlatRate(true);
    }
  }, [isHourly]);

  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const handleOfferOpen = () => {
    setOfferModalOpen(true);
  };

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

  //combo of https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers && maybe https://stackoverflow.com/questions/11197549/regular-expression-limit-string-size
  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,6}$/;

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);

  //
  const handleConfirmedRateChange = (confirmedRate) => {
    setConfirmedRate(confirmedRate);

    if (flatRateValidationMessage) {
      confirmedRateValidate(confirmedRate);
    }
  };

  const confirmedRateValidate = (confirmedRate) => {
    setFlatRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(confirmedRate);
    if (!isValid) {
      setFlatRateValidationMessage("Please enter valid rate");
      console.log(flatRateValidationMessage);
    } else {
      setFlatRateValidationMessage();
      setConfirmedRate(confirmedRate);
    }
  };

  //credit typeof help https://flaviocopes.com/how-to-check-undefined-property-javascript/

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmedRate);

    if (!rateValid || typeof confirmedRate === "undefined") {
      alert("Please enter valid rate");
    } else {
      sendOffer();
    }
  };

  const { client } = useChatContext();

  //testing event listeners
  useEffect(() => {
    if (client) {
      client.on((event) => {
        if (event.message) {
          setTimeout(() => {
            if (userID && jobTitle && applicantID) {
              console.log(
                "debug new message from logged in user",
                event.message.user.id,
                userID
              );
              if (event.message.user.id === userID) {
                console.log("new message from logged in user");
                newMessageFromNeeder();
              }
            }
          }, 50);
        }

        // console.log('channel.state', channel);
      });
    }
  }, [client, userID, jobTitle, applicantID]);

  useEffect(() => {
    if (channel) {
      channel.on((event) => {
        // console.log('channel event', event);
        // console.log('channel.state', channel.state);
      });
    }
  }, [channel]);

  const [channelQueriedUsers, setChannelQueriedUsers] = useState(null);

  useEffect(() => {
    if (client) {
      client.on((event) => {
        // console.log("event", event)
        if (event.queriedChannels) {
          console.log("working now queried");
          setTimeout(() => {
            if (userID && jobTitle && applicantID) {
              event.queriedChannels.channels[0].read.forEach((user) => {
                console.log("unread messages", user.unread_messages);
                if (user.user.id === userID && user.unread_messages === 0) {
                  console.log("working now");
                  neederMessagesRead();
                  // console.log("working niow")
                } else {
                  console.log("test failed");
                }
              }, 50);
            }
          });
          // setChannelQueriedUsers(event.queriedChannels.channels[0].read)
        }

        // console.log('channel.state', channel);
      });
    }
  }, [client, userID, jobID, applicantID]);

  const neederMessagesRead = () => {
    console.log(userID, jobTitle, applicantID);
    var appliedDocRef = doc(
      db,
      "employers",
      userID,
      "Posted Jobs",
      jobTitle,
      "Applicants",
      applicantID
    );
    var postedDocRef = doc(db, "employers", userID, "Posted Jobs", jobTitle);
    var inProgressDocRef = doc(
      db,
      "employers",
      userID,
      "Jobs In Progress",
      jobTitle
    );
    var inReviewDocRef = doc(db, "employers", userID, "In Review", jobTitle);

    getDoc(appliedDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(appliedDocRef, {
          hasUnreadMessage: false,
        })
          .then(() => {
            console.log("new message updated in Applied");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });
    getDoc(postedDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(postedDocRef, {
          hasUnreadMessage: false,
        })
          .then(() => {
            console.log("new message updated in Posted");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });

    getDoc(inProgressDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(inProgressDocRef, {
          hasUnreadMessage: false,
        })
          .then(() => {
            console.log("new message updated in Progress");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });

    getDoc(inReviewDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(inReviewDocRef, {
          hasUnreadMessage: false,
        })
          .then(() => {
            console.log("new message updated in Review");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });
  };

  const newMessageFromNeeder = () => {
    console.log(userID, jobTitle, applicantID);

    var appliedDocRefUnread = doc(
      db,
      "users",
      applicantID,
      "Applied",
      jobTitle
    );
    var inProgressDocRefUnread = doc(
      db,
      "users",
      applicantID,
      "Jobs In Progress",
      jobTitle
    );
    var inReviewDocRefUnread = doc(
      db,
      "users",
      applicantID,
      "In Review",
      jobTitle
    );

    getDoc(appliedDocRefUnread).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(appliedDocRefUnread, {
          hasUnreadMessage: true,
        })
          .then(() => {
            console.log("new message updated in Applied");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });

    getDoc(inProgressDocRefUnread).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(inProgressDocRefUnread, {
          hasUnreadMessage: true,
        })
          .then(() => {
            console.log("new message updated in Progress");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });

    getDoc(inReviewDocRefUnread).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(inReviewDocRefUnread, {
          hasUnreadMessage: true,
        })
          .then(() => {
            console.log("new message updated in Review");
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
      }
    });
  };

  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 500);

  return (
    <>
      {isLoading ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
          height="120px"
        >
          <Box
            alignContent="center"
            justifyContent="center"
            alignItems="center"
          >
            <Center>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#01A2E8"
                size="lg"
                marginTop="32px"
              />
            </Center>
          </Box>
        </Card>
      ) :  isHired && !jobCompleteApplicant  ? (
        <Card
        boxShadow="sm"
        rounded="md"
        borderColor="#e4e4e4"
        borderWidth="1px"
        marginLeft="4px"
        marginRight="4px"
      >
        {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/NeederMessageList", {state: {showList : true}})}/>)}
        <Box>
          <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px" marginBottom="8px">
                <Text>You've hired this applicant for </Text>
                <Button variant="ghost">
                  <Text>{jobTitle}</Text>
                </Button>
                <Text>
                  (Note: This applicant will mark the job complete when done,
                  which will then enable you to pay them)
                </Text>
              </Box>
            </Flex>
          </Center>
        </Box>
      </Card>
      ) : isHired  && jobCompleteApplicant ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          <Box>
            <Center>
              <Flex direction="column">
                <Box textAlign="center" marginTop="16px" marginBottom="8px">
                  <Text mb={4}>{jobTitle}has been completed by {applicantFirstName}</Text>
                  <Button mb={4} backgroundColor="#01A2E8" textColor="white"  _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => getPaymentData()}>Pay Now</Button>
                  
                </Box>
              </Flex>
            </Center>
          </Box>
        </Card>
      ) : jobOffered ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px">
                <Flex direction="row" textAlign="center" alignContent="center" justifyContent="center" mb={2}>
                  {" "}
                  <Text mt={1}>Offer Pending for</Text>
               
                  <Button  backgroundColor="white" textColor="#01A2E8"  height="32px" mb={2}   _hover={{ bg: "#018ecb", textColor: "white" }}>
                    <Text>{jobTitle}</Text>
                  </Button>{" "}
                </Flex>

                <Text>Did they reject your offer?</Text>
             
                <Button  backgroundColor="#01A2E8" textColor="white"  _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => handleModalOpen()} >
                  <Text>Make New Offer</Text>
                </Button>
              </Box>
            </Flex>
          </Center>
        </Card>
      ) : isRequest && requestOfferMade === false ? (
        <Box>
          <Card
            boxShadow="sm"
            rounded="md"
            borderColor="#e4e4e4"
            borderWidth="1px"
            marginLeft="4px"
            marginRight="4px"
          >
            <Box>
              <Center>
                <Flex direction="column">
                  <Box textAlign="center" marginTop="16px">
                    <Text>Do you want to hire this person?</Text>
                  </Box>
                  <Button
                    colorScheme="blue"
                    marginTop="8px"
                    marginBottom="8px"
                    onClick={() => handleOfferOpen()}
                  >
                    Make An Offer
                  </Button>
                  <Button variant="ghost" marginBottom="8px">
                    No
                  </Button>
                </Flex>
              </Center>

              {/* {isHourly ? (
              <Text>${confirmedRate}/hr</Text>
            ) : isVolunteer ? (
              <Text> No Charge</Text>
            ) : (
              <Text> ${confirmedRate} total </Text>
            )} */}
            </Box>
          </Card>
        </Box>
      ) : requestOfferMade === true ? (
        <Box>
          <Card
            boxShadow="sm"
            rounded="md"
            borderColor="#e4e4e4"
            borderWidth="1px"
            marginLeft="4px"
            marginRight="4px"
          >
            <Box>
              <Center>
                <Flex direction="column">
                  <Box textAlign="center" marginTop="16px" marginBottom="16px">
                    <Heading size="sm" marginBottom="8px">
                      Offer Sent!
                    </Heading>
                    <Text>
                      If the person you offered this job accepts your offer
                      these messages
                    </Text>
                    <Text>
                      will be moved to the "Accepted Jobs" messaging tab.
                    </Text>
                  </Box>
                  {/* <Button
                  colorScheme="blue"
                  marginTop="8px"
                  marginBottom="8px"
                  onClick={() => handleOfferOpen()}
                >
                  Make An Offer
                </Button>
                <Button variant="ghost" marginBottom="8px">
                  No
                </Button> */}
                </Flex>
              </Center>

              {/* {isHourly ? (
              <Text>${confirmedRate}/hr</Text>
            ) : isVolunteer ? (
              <Text> No Charge</Text>
            ) : (
              <Text> ${confirmedRate} total </Text>
            )} */}
            </Box>
          </Card>
        </Box>
      ) : (
        <Box>
          <Card
            boxShadow="sm"
            rounded="md"
            borderColor="#e4e4e4"
            borderWidth="1px"
            marginLeft="4px"
            marginRight="4px"
          >
            <Box>
              <Center>
                <Flex direction="column">
                  <Box textAlign="center" marginTop="16px">
                    <Text>Do you want to hire this person for</Text>
                    <Button variant="ghost">
                      <Text>{jobTitle}?</Text>
                    </Button>
                  </Box>
                  <Button
                    colorScheme="blue"
                    marginTop="8px"
                    marginBottom="8px"
                    onClick={() => handleModalOpen()}
                  >
                    Make An Offer
                  </Button>
                  <Button variant="ghost" marginBottom="8px">
                    No
                  </Button>
                </Flex>
              </Center>

              {/* {isHourly ? (
                <Text>${confirmedRate}/hr</Text>
              ) : isVolunteer ? (
                <Text> No Charge</Text>
              ) : (
                <Text> ${confirmedRate} total </Text>
              )} */}
            </Box>
          </Card>
        </Box>
      )}
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
                  placeholder="Enter offer here"
                  onChange={(e) => confirmedRateValidate(e.target.value)}
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
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => checkLength()}>
              Send Offer
            </Button>
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
                  placeholder="Enter offer here"
                  onChange={(e) => confirmedRateValidate(e.target.value)}
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
      <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your offer has been sent.</Text>
            <Text>
              You will receive a notification if the applicant accepts.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseSuccess()}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenOffer} onClose={onCloseOffer} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create An Offer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your offer has been sent.</Text>
            <Text>
              You will receive a notification if the applicant accepts.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseOffer()}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {offerModalOpen === true ? (
        <CreateOfferModal
          props={{ applicantID: applicantID, jobID: jobID, channel: channel }}
        />
      ) : null}

{selectedJobForPayment ? (
                <EmbeddedPayments props={selectedJobForPayment} />
              ) : null}

              
    </>
  );
};

export default NeederChannelHireHeader;
