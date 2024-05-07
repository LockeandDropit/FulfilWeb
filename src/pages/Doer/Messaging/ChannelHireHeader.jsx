import React from "react";
import DoerHeader from "../DoerHeader";
import DoerDashboard from "../DoerDashboard";
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
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";
import MarkCompleteModal from "./MarkCompleteModal";
import { ArrowBackIcon} from '@chakra-ui/icons'
import { useMediaQuery } from "@chakra-ui/react";

const ChannelHireHeader = () => {
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

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const { channel, watchers } = useChannelStateContext();

  // console.log("here is the channel",channel)

  const navigate = useNavigate();
  const location = useLocation();
  const [isHired, setIsHired] = useState();

  const [jobID, setJobID] = useState();
  const [jobTitle, setJobTitle] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState();
  const [jobOffered, setJobOffered] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState();
  const [isHourly, setIsHourly] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);

  const [intermediateIDs, setIntermediateIDs] = useState(null);
  const [bothIDs, setBothIDs] = useState([]);

  const [finalBlock, setFinalBlock] = useState([]);

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
      });
    } else {
    }

    setBothIDs(ids);
  }, [middleMembers]);

  const [channelID, setChannelID] = useState(null);

  useEffect(() => {
    if (channel !== null) {
      // console.log("early collection", selectedChannel._client.state.users )
      setIntermediateIDs(channel._client.state.users);
      // console.log("intermittent", selectedChannel)
      setJobTitle(channel.data.name);
      setChannelID(channel.cid);
    } else {
      console.log("no bueno");
    }
  }, [channel, intermediateIDs]);

  const [employerID, setEmployerID] = useState(null);

  useEffect(() => {
    if (bothIDs !== null) {
      bothIDs.map((x) => {
        if (x !== userID) {
          // console.log("employerID", x);
          setEmployerID(x);
        } else {
        }
      });
    } else {
    }
  }, [bothIDs]);

  const [isRequest, setIsRequest] = useState(null);
  const [requestOfferMade, setRequestOfferMade] = useState(null);
  const [requestAccepted, setRequestAccepted] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, "Messages");
    const q = query(collectionRef);

    let finalBlock = [];

    onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        if (
          doc._document.data.value.mapValue.fields.applicantID.stringValue ===
            userID &&
          doc._document.data.value.mapValue.fields.employerID.stringValue ===
            employerID &&
          doc._document.data.value.mapValue.fields.jobTitle.stringValue ===
            channel.data.name
        ) {
          if (
            doc._document.data.value.mapValue.fields.isRequest &&
            doc._document.data.value.mapValue.fields.requestOfferMade
          ) {
            setRequestOfferMade(
              doc._document.data.value.mapValue.fields.requestOfferMade
                .booleanValue
            );
            setIsRequest(true);
            console.log("got em");
          }
          console.log("checking 2 ", doc._document.data.value.mapValue.fields);
          setFinalBlock([
            ...finalBlock,
            doc._document.data.value.mapValue.fields,
          ]);
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
  }, [channel, userID, employerID]);

  console.log("is hired", isHired);

  useEffect(() => {
    if (isRequest && requestOfferMade && jobID) {
      if (
        (userID != null && isHired === false) ||
        (undefined && employerID != null && jobTitle !== null) ||
        undefined
      ) {
        console.log("here?");
        const docRef = doc(db, "employers", employerID, "Requests", jobID);

        getDoc(docRef).then((snapshot) => {
          console.log("current job request", snapshot.data());
          setNiceToHave(snapshot.data().niceToHave);
          setDescription(snapshot.data().description);
          setJobTitle(snapshot.data().jobTitle);
          setCategory(snapshot.data().category);
          setCity(snapshot.data().city);
          setLocationLat(snapshot.data().locationLat);
          setLocationLng(snapshot.data().locationLng);
          setLowerRate(snapshot.data().lowerRate);
          setUpperRate(snapshot.data().upperRate);
          setRequirements(snapshot.data().requirements);
          setRequirements2(snapshot.data().requirements2);
          setRequirements3(snapshot.data().requirements3);
          setIsVolunteer(snapshot.data().isVolunteer);
          setIsOneTime(snapshot.data().isOneTime);
          setStreetAddress(snapshot.data().streetAddress);
          setState(snapshot.data().state);
          setZipCode(snapshot.data().zipCode);

          setEmployerFirstName(snapshot.data().firstName);
        });
      } else {
        console.log("oops!a", userID, isHired, employerID, jobTitle);
      }
    } else if (
      (userID != null && isHired === false && !isRequest) ||
      (undefined && employerID != null && jobTitle !== null) ||
      undefined
    ) {
      console.log("here?");
      const docRef = doc(db, "employers", employerID, "Posted Jobs", jobTitle);

      getDoc(docRef).then((snapshot) => {
        console.log("current job", snapshot.data());
        setNiceToHave(snapshot.data().niceToHave);
        setDescription(snapshot.data().description);
        // setBusinessName(snapshot.data().businessName);
        setCategory(snapshot.data().category);
        setCity(snapshot.data().city);
        setLocationLat(snapshot.data().locationLat);
        setLocationLng(snapshot.data().locationLng);
        setLowerRate(snapshot.data().lowerRate);
        setUpperRate(snapshot.data().upperRate);
        setRequirements(snapshot.data().requirements);
        setRequirements2(snapshot.data().requirements2);
        setRequirements3(snapshot.data().requirements3);
        setIsVolunteer(snapshot.data().isVolunteer);
        setIsOneTime(snapshot.data().isOneTime);
        setStreetAddress(snapshot.data().streetAddress);
        setState(snapshot.data().state);
        setZipCode(snapshot.data().zipCode);
        setEmployerFirstName(snapshot.data().firstName);
      });
    } else {
      console.log("oops!a", userID, isHired, employerID, jobTitle);
    }
  }, [userID, employerID, jobTitle, isHired]);

  useEffect(() => {
    if (userID && jobTitle && employerID) {

      const q = query(collection(db, "employers", employerID, "In Review"));
   
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
    }},[userID, employerID, jobTitle, isHired] )
 

  const [jobCompleteEmployer, setJobCompleteEmployer] = useState(null)
  const [jobCompleteApplicant, setJobCompleteApplicant] = useState(null)
  const [category, setCategory] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [description, setDescription] = useState(null);
  const [city, setCity] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  // const [isVolunteer, setIsVolunteer] = useState(null);
  const [isOneTime, setIsOneTime] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);

  const postInProgress = () => {
    // employer

    //convert to int
    const confirmedRateInt = parseInt(confirmedRate, 10);

    setDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle), {
      employerID: employerID,
      jobTitle: jobTitle,
      jobID: jobID,
      isHourly: isHourly,
      channelID: channelID,
      category: category,
      // businessName: businessName,
      description: description,
      confirmedRate: confirmedRateInt,
      city: city,
      lowerRate: lowerRate ? lowerRate : null,
      upperRate: upperRate ? upperRate : null,
      isVolunteer: isVolunteer,
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
      hiredApplicant: userID,
      jobCompleteApplicant: false,
      jobCompleteEmployer: false,
      employerFirstName: employerFirstName,
    })
      .then(() => {
        //all good
        console.log("data submitted employer");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "post in progress");
      });

    // applicant

    deleteDoc(doc(db, "users", userID, "Appled", jobTitle), {})
      .then(() => {
        //all good
        console.log("data deleted user applied");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "post in progress");
      });

    setDoc(doc(db, "users", userID, "Jobs In Progress", jobTitle), {
      firstHiredNotification: true,
      employerID: employerID,
      jobTitle: jobTitle,
      jobID: jobID,
      isHourly: isHourly,
      category: category,
      // businessName: businessName,
      channelID: channelID,
      description: description,
      city: city,
      confirmedRate: confirmedRateInt,
      lowerRate: lowerRate ? lowerRate : null,
      upperRate: upperRate ? upperRate : null,
      isVolunteer: isVolunteer,
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
      hiredApplicant: userID,
      jobCompleteApplicant: false,
      jobCompleteEmployer: false,
      employerFirstName: employerFirstName,
    })
      .then(() => {
        //all good
        console.log("data submitted applicant in progress");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "post in progress");
      });
  };

  const deletePostedEmployer = () => {
    deleteDoc(doc(db, "employers", employerID, "Posted Jobs", jobTitle))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "from delete posted employer");
      });

    // delete from user saved (if saved)
    deleteDoc(doc(db, "users", userID, "Saved Jobs", jobID))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "from delete posted employer");
      });

    //delete from user Applied Jobs
    deleteDoc(doc(db, "users", userID, "Applied", jobTitle))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "from delete posted employer");
      });
  };

  const deleteRequestEmployer = () => {
    deleteDoc(doc(db, "employers", employerID, "Requests", jobID))
      .then(() => {
        //all good
        console.log("removed from needer Requests");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "from delete posted employer");
      });

    //delete from user Applied Jobs
    deleteDoc(doc(db, "users", userID, "Requests", jobID))
      .then(() => {
        //all good
        console.log("removed from users Requests");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "from delete posted employer");
      });
  };

  const chatNotifications = () => {
    //// uhh this code will remove the "do you want to hire this person" card in Messages

    updateDoc(doc(db, "Messages", jobID), {
      isHired: true,
    })
      .then(() => {
        console.log("all good");
        onOpenSuccess();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  const deleteFromMaps = () => {
    //needs to also delete from paid v Volunteer DB subsets.

    deleteDoc(doc(db, "Map Jobs", jobID))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs");
        onOpenSuccess();
      })
      .catch((error) => {
        // no bueno
        console.log(error, "error from delete from Maps");
      });
  };

  const deleteFromJobs = () => {
    if (isVolunteer === true) {
      deleteDoc(doc(db, "Map Jobs Volunteer", jobID))
        .then(() => {
          //all good
          console.log("removed from employers Posted Jobs Paid");
        })
        .catch((error) => {
          // no bueno
          console.log(error, "error from delete from Maps");
        });
    } else {
      deleteDoc(doc(db, "Map Jobs Paid", jobID))
        .then(() => {
          //all good
          console.log("removed from employers Posted Jobs Paid");
        })
        .catch((error) => {
          // no bueno
          console.log(error, "error from delete from Maps");
        });
    }
  };

  const confirmJobAccept = () => {
    // hire code here.
    // post under in progress for employer and applicant

    postInProgress();

    //delete from Posted under employer
    if (isRequest) {
      deleteRequestEmployer();
    } else {
      deletePostedEmployer();
      deleteFromMaps();
      deleteFromJobs();
    }

    //make notification in chat for both

    chatNotifications();

    //delete from global jobs/maps

    //delete from paid v volunteer db

    // deleteFromJobs();
  };

  //chat notification control

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

  //checking validity of docs help from DoesData https://stackoverflow.com/questions/47308159/whats-the-best-way-to-check-if-a-firestore-record-exists-if-its-path-is-known

  useEffect(() => {
    if (parsedUsers) {
      // console.log(parsedUsers)
      parsedUsers.forEach((parsedUser) => {
        if (parsedUser.user === userID) {
          console.log("bababooy", jobTitle, parsedUser.body.unread_messages);
          if (parsedUser.body.unread_messages === 0) {
            // var appliedDocRef = doc(
            //   db,
            //   "users",
            //   userID,
            //   "Applied",
            //   jobTitle
            // );
            var inProgressDocRef = doc(
              db,
              "users",
              userID,
              "In Progress",
              jobTitle
            );
            var inReviewDocRef = doc(
              db,
              "users",
              userID,
              "In Review",
              jobTitle
            );

            getDoc(doc(db, "users", userID, "Applied", jobTitle)).then(
              (snapshot) => {
                if (!snapshot.data()) {
                } else {
                  updateDoc(doc(db, "users", userID, "Applied", jobTitle), {
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
              }
            );

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
        }
      });
    }
  }, [parsedUsers, userID]);

  const { client } = useChatContext();

  const doerMessagesRead = () => {
    // var appliedDocRef = doc(
    //   db,
    //   "users",
    //   userID,
    //   "Applied",
    //   jobTitle
    // );
    var inProgressDocRef = doc(
      db,
      "users",
      userID,
      "Jobs In Progress",
      jobTitle
    );
    var inReviewDocRef = doc(db, "users", userID, "In Review", jobTitle);

    getDoc(doc(db, "users", userID, "Applied", jobTitle)).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(doc(db, "users", userID, "Applied", jobTitle), {
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
  };

  useEffect(() => {
    if (client) {
      client.on((event) => {
        // console.log("event", event)
        if (event.queriedChannels) {
          console.log("working now queried");
          setTimeout(() => {
            if (userID && jobTitle && employerID) {
              event.queriedChannels.channels[0].read.forEach((user) => {
                console.log("unread messages", user.unread_messages);
                if (user.user.id === userID && user.unread_messages === 0) {
                  console.log("working now");
                  doerMessagesRead();
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
  }, [client, userID, jobID, employerID]);

  //testing event listeners
  useEffect(() => {
    if (client) {
      client.on((event) => {
        if (event.message) {
          setTimeout(() => {
            if (userID && jobTitle && employerID) {
              console.log(
                "debug new message from logged in user",
                event.message.user.id,
                userID
              );
              if (event.message.user.id === userID) {
                console.log("new message from logged in user");
                newMessageFromDoer();
              }
            }
          }, 50);
        }

        // console.log('channel.state', channel);
      });
    }
  }, [client, userID, jobTitle, employerID]);

  const newMessageFromDoer = () => {
    var appliedDocRef = doc(
      db,
      "employers",
      employerID,
      "Posted Jobs",
      jobTitle
    );
    var applicantDocRef = doc(
      db,
      "employers",
      employerID,
      "Posted Jobs",
      jobTitle,
      "Applicants",
      userID
    );
    var inProgressDocRef = doc(
      db,
      "employers",
      employerID,
      "Jobs In Progress",
      jobTitle
    );
    var inReviewDocRef = doc(
      db,
      "employers",
      employerID,
      "In Review",
      jobTitle
    );

    getDoc(appliedDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(appliedDocRef, {
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

    getDoc(applicantDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(applicantDocRef, {
          hasUnreadMessage: true,
          applicantID: userID,
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

    getDoc(inReviewDocRef).then((snapshot) => {
      if (!snapshot.data()) {
      } else {
        updateDoc(inReviewDocRef, {
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

  const handleOpenDetails = () => {
    onOpenDetails();
  };


  const [readyMarkComplete, setReadyMarkComplete] = useState(false)

  const handleOpenMarkComplete = () => {
    setReadyMarkComplete(true)
    // setTimeout(() => {
    //   setReadyMarkComplete(false)
    // }, 200)
  }


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
      ) : isHired && !jobCompleteApplicant  ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
          <Box>
            <Center>
              <Flex direction="column">
                <Flex direction="row">
                  <Box textAlign="center" marginTop="16px">
                    <Text>Congratulations! You've been hired for</Text>
                    <Button variant="ghost">
                      <Text>{jobTitle}</Text>
                    </Button>
                  </Box>
                </Flex>
                <Center flexDirection="column">
                  <Text mb={2}>Did you finish this job?</Text>
                  <Button mb={4} backgroundColor="#01A2E8" textColor="white"  _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => handleOpenMarkComplete()}>Mark Complete</Button>
                </Center>
              </Flex>
            </Center>
          </Box>
        </Card>
      ) : isRequest && requestOfferMade === false ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
          <Box>
            <Center>
              <Flex direction="column">
                <Flex direction="row">
                  <Box textAlign="center" marginTop="16px">
                    <Text marginBottom="8px">
                      {employerFirstName} has started a conversation with you
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Center>
          </Box>
        </Card>
      ) : requestOfferMade === true ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
          <Box>
            <Center>
              <Flex direction="column">
                <Flex direction="row">
                  <Box
                    textAlign="center"
                    marginTop="16px"
                    flexDirection="row"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    justifyItems="center"
                  >
                    <Text>
                      {employerFirstName} has sent you an offer for
                      <Button
                        backgroundColor="white"
                        borderWidth="0.5px"
                        
                        borderColor="#01A2E8"
                        textColor="#01A2E8"
                        marginBottom="4px"
                        height="24px"
                        marginLeft="6px"
                        _hover={{  backgroundColor: "#01A2E8", 
                        
                        textColor: "white"}}
                        onClick={() => {
                          handleOpenDetails();
                        }}
                      >
                        <Text>{jobTitle}</Text>
                      </Button>
                    </Text>
                  </Box>
                </Flex>
                <Center>
                  <Flex direction="column">
                    <Text>Pay Rate:</Text>
                    {isHourly ? (
                      <Text>${confirmedRate}/hr</Text>
                    ) : isVolunteer ? (
                      <Text> No Charge</Text>
                    ) : (
                      <Text> ${confirmedRate} total </Text>
                    )}
                  </Flex>
                </Center>
                <Center>
                  <Box flexDirection="row" marginTop="16px" marginBottom="8px">
                    {/* <Button variant="ghost" width="160px">
                      <Text>Decline</Text>
                    </Button> */}
                    <Button
                      width="160px"
                      colorScheme="blue"
                      onClick={() => confirmJobAccept()}
                    >
                      <Text>Accept</Text>
                    </Button>
                  </Box>
                </Center>
              </Flex>
            </Center>
          </Box>
        </Card>
      ) : !jobOffered ? (
        <Card
          boxShadow="sm"
          rounded="md"
          borderColor="#e4e4e4"
          borderWidth="1px"
          marginLeft="4px"
          marginRight="4px"
        >
          {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
          <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px">
                <Text>You're interviewing for</Text>
                <Button variant="ghost">
                  <Text>{jobTitle}</Text>
                </Button>
              </Box>
            </Flex>
          </Center>
        </Card>
      ) : jobCompleteApplicant ? (  <Card
        boxShadow="sm"
        rounded="md"
        borderColor="#e4e4e4"
        borderWidth="1px"
        marginLeft="4px"
        marginRight="4px"
      >
        {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
        <Center>
          <Flex direction="column">
            <Box textAlign="center" marginTop="16px">
              <Text>You've completed </Text>
              <Button variant="ghost">
                <Text>{jobTitle}</Text>
              </Button>
              <Text>You're waiting on payment from {employerFirstName}</Text>
             
            </Box>
          </Flex>
        </Center>
      </Card>) : (
        <Box>
          <Card
            boxShadow="sm"
            rounded="md"
            borderColor="#e4e4e4"
            borderWidth="1px"
            marginLeft="4px"
            marginRight="4px"
          >
            {isDesktop ? (null) : (<ArrowBackIcon position="absolute" left={2} top={2} onClick={() => navigate("/DoerMessageList", {state: {showList : true}})}/>)}
            <Box>
              <Center>
                <Flex direction="column">
                  <Box textAlign="center" marginTop="16px">
                    <Text>
                      Congratulations! You've been offered this position. Would
                      you like to accept for
                    </Text>
                    <Button variant="ghost">
                      <Text>{jobTitle}</Text>
                    </Button>
                    <Text>Pay Rate:</Text>
                    {isHourly ? (
                      <Text>${confirmedRate}/hr</Text>
                    ) : isVolunteer ? (
                      <Text> No Charge</Text>
                    ) : (
                      <Text> ${confirmedRate} total </Text>
                    )}
                  </Box>
                  <Center>
                    <Box flexDirection="row" marginTop="16px">
                      <Button variant="ghost" width="240px">
                        <Text>Decline</Text>
                      </Button>
                      <Button
                        width="240px"
                        colorScheme="blue"
                        onClick={() => confirmJobAccept()}
                      >
                        <Text>Accept</Text>
                      </Button>
                    </Box>
                  </Center>
                </Flex>
              </Center>
            </Box>

            <Box>
              <Box></Box>
            </Box>
          </Card>
        </Box>
      )}

      <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You've accepted this position.</Text>
            <Text></Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseSuccess()}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDetails} onClose={onCloseDetails} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offer Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Job Title</FormLabel>
            <Text marginBottom="4px">{jobTitle}</Text>
            <FormLabel>Description</FormLabel>
            <Text marginBottom="4px">{description}</Text>
            <FormLabel>Location</FormLabel>
            <Text marginBottom="4px">
              {streetAddress}, {city}, {state}
            </Text>
            {category ? (
              <>
                <FormLabel>Category</FormLabel>
                <Text marginBottom="4px">{category}</Text>
              </>
            ) : null}

            <FormLabel>Frequency</FormLabel>
            <Text marginBottom="4px">One-time</Text>
            <FormLabel>Pay Rate</FormLabel>
            {isHourly ? (
              <Text marginBottom="4px">${confirmedRate}/hour</Text>
            ) : (
              <Text marginBottom="4px">${confirmedRate} total</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onCloseDetails()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {readyMarkComplete ? (<MarkCompleteModal props={{jobTitle: jobTitle, jobID: jobID}}/>) : (null)}
    </>
  );
};

export default ChannelHireHeader;
