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
  Badge,
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
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
} from "stream-chat-react";
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
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";
import CreateOfferModal from "../NeederComponents/CreateOfferModal";
import NeederChannelHireHeader from "./NeederChannelHireHeader";
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
import { useMediaQuery } from "@chakra-ui/react";

const NeederMessageList = () => {
  // const { chatClient } = useChatContext();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");

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

  const [profilePicture, setProfilePicture] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "employers", user.uid)).then((snapshot) => {
        if (!snapshot.data().profilePictureResponse) {
          setUserName(snapshot.data().firstName);
        } else {
          setProfilePicture(snapshot.data().profilePictureResponse);
          setUserName(snapshot.data().firstName);
        }
      });
    }
  }, [user]);

  const filter = { members: { $in: [userID] } };

  const userInfo = {
    id: userID,
    name: userName,
    image: profilePicture,
  };

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const [clientIsSet, setClientIsSet] = useState(false);

  //unmute to start working
  useEffect(() => {
    if (userID && userName && chatClient) {
      chatClient.connectUser(userInfo, chatClient.devToken(userID));
      console.log("userConnected!", chatClient._user.id);
      console.log("what it should look like", chatClient);
      setClientIsSet(true);
    } else {
    }
  }, [userID, chatClient, clientIsSet, userName]);

  const [doneLoading, setDoneLoading] = useState(false);

  setTimeout(() => {
    setDoneLoading(true);
  }, 1000);

  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState(null);

  const location = useLocation();

  const [passedChannel, setPasseChannel] = useState(null);

  useEffect(() => {
    if (location.state === null) {
      console.log("no channel passed");
      setSelectedChannel(null);
    } else {
      if (!chatClient) {
        console.log("waiting on chatClient");
      } else {
        if (location.state.selectedChannel) {
          setPasseChannel(location.state.selectedChannel);
        } else {
        }
      }
    }
  }, [chatClient]);

  useEffect(() => {
    if (location.state) {
      console.log(location.state);
      if (location.state.showList) {
        setShowList(location.state.showList);
      }
    }
  }, [location]);

  //testing why...

  const [endRun, setEndRun] = useState(false);

  const loadTest = async (passedChannel) => {
    if (clientIsSet) {
      chatClient.connectUser(userInfo, chatClient.devToken(userID));
      const channelSort = await chatClient.queryChannels(filter, {});

      channelSort.map((channelSort) => {
        // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
        if (channelSort.cid === passedChannel) {
          setSelectedChannel(channelSort);

          //or just navigate from here to selected channel??
          //pass whole channel object to navigate
          setEndRun(true);
        } else {
          console.log("no luck", channelSort.cid);
        }
      });
    } else {
    }
  };

  useEffect(() => {
    if (userID && chatClient && passedChannel && !endRun) {
      loadTest(passedChannel);
      console.log("ladies and gentlemen... we got him");
    } else {
      console.log("uhhhh");
    }
  }, [passedChannel, userID, chatClient, endRun]);

  useEffect(() => {
    //debuggin
    console.log("debug", selectedChannel);
  }, [selectedChannel]);

  //this handles the price setting and job offer

  const [isHourly, setIsHourly] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null);

  useEffect(() => {
    //get rid of useEffect that calls this data from FB. Check if is hourly, then set isFlat rate based off of that. This will negate that weird crash???

    if (isHourly === true) {
    } else {
      setIsFlatRate(true);
    }
  }, [isHourly]);

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

  const options = { limit: 11 };

  //get all user chat cid's and put them in filter. Check them against FB, if match, put that cid/stream channel object into the filter list of the associtated tab

  //where is chat id?
  // find chat id
  //map over ids and put them in filter tabs on top.

  //get channels and put them into proper channel list.. create a filter for that one with channel id

  //holders for array of cids
  const [acceptedCIDs, setAcceptedCIDs] = useState([]);
  const [interviewCIDs, setInterviewCIDs] = useState([]);
  const [interviewCIDsLength, setInterviewCIDsLength] = useState([]);
  const [requestCIDs, setRequestCIDs] = useState([]);
  const [completedCIDs, setCompletedCIDs] = useState([]);
  //interviewCIDs come from "Posted Jobs", postedJobTitle, "Applicants" .channelID in FB

  const [acceptedJobData, setAcceptedJobData] = useState(null);
  const [acceptedJobDataLength, setAcceptedJobDataLength] = useState(null);

  const [interviewJobData, setInterviewJobData] = useState(null);
  const [interviewJobDataLength, setInterviewJobDataLength] = useState(null);

  const [completedJobData, setCompletedJobData] = useState(null);
  const [completedJobDataLength, setCompletedJobDataLength] = useState(null);

  const [requestData, setRequestData] = useState(null);
  const [requestDataLength, setRequestDataLength] = useState(null);

  //accepted logic

  const getAcceptedDocs = () => {
    //set the name of each jobTitle in collection

    setAcceptedMobile(true);
    setInterviewMobile(false);
    setCompletedMobile(false);
    setRequestsMobile(false);

    const jobQuery = query(
      collection(db, "employers", user.uid, "Jobs In Progress")
    );

    onSnapshot(jobQuery, (snapshot) => {
      let jobData = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        if (doc.data().channelID) {
          jobData.push(doc.data().channelID);
        }
      });

      // setInterviewJobData(jobData);

      if (!jobData || !jobData.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        setAcceptedJobData(null);
        setAcceptedCIDs(null);
        setToggleAcceptedTab(true);
        setToggleInterviewTab(false);
        setToggleCompletedTab(false);
        setToggleRequestsTab(false);
        console.log("nada");
        setAcceptedJobDataLength(0);
      } else {
        setAcceptedJobData(jobData);
        setAcceptedJobDataLength(jobData.length);
      }
    });
  };

  const [firstRender, setFirstRender] = useState(false);

  //this si to initially get the accepted job cids, then on any re-renders it wont reset to the accepted jobs tab
  useEffect(() => {
    if (user && firstRender === false) {
      getAcceptedDocs();
      setFirstRender(true);
    }
  }, [firstRender, user]);

  useEffect(() => {
    if (acceptedJobData) {
      console.log("final set");
      console.log(acceptedJobData);
      //credit Shadow Wizard Love Zelda https://stackoverflow.com/questions/5289403/convert-javascript-array-to-string
      setAcceptedCIDs(acceptedJobData);
      setToggleAcceptedTab(true);
      setToggleInterviewTab(false);
      setToggleCompletedTab(false);
      setToggleRequestsTab(false);
    } else {
      setAcceptedCIDs(null);
      setToggleAcceptedTab(true);
      setToggleInterviewTab(false);
      setToggleCompletedTab(false);
      setToggleRequestsTab(false);
    }
  }, [acceptedJobData]);

  //completed logic (comes from "In Review" in FB)

  const [completedNewMessagesLength, setCompletedNewMessageLength] =
    useState(null);
  const [requestNewMessagesLength, setRequestNewMessageLength] = useState(null);
  const [acceptedNewMessagesLength, setAcceptedNewMessageLength] =
    useState(null);
  const [interviewNewMessagesLength, setInterviewNewMessageLength] =
    useState(null);
  const [interviewMessageData, setInterviewMessageData] = useState(null);
  const [newMessagesSet, setNewMessagesSet] = useState(false);

  //initial setting of number of new messages in each section
  useEffect(() => {
    if (newMessagesSet === false && user) {
      // Interview section, needs ewextra qwuery which is in seperate useEfffect
      const jobQuery = query(
        collection(db, "employers", user.uid, "Posted Jobs")
      );

      onSnapshot(jobQuery, (snapshot) => {
        let jobData = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          // console.log("test",doc.data())
          jobData.push({ jobTitle: doc.data().jobTitle, id: doc.data().jobID });
        });

        if (!jobData || !jobData.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          // setInterviewNewMessageLength(null);
        } else {
          setInterviewMessageData(jobData);
        }
      });

      const requestQuery = query(
        collection(db, "employers", user.uid, "Requests")
      );

      onSnapshot(requestQuery, (snapshot) => {
        let newMessages = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().hasUnreadMessage === true) {
            newMessages.push(1);
          }
        });

        if (!newMessages || !newMessages.length) {
          setRequestNewMessageLength(null);
        } else {
          setRequestNewMessageLength(newMessages.length);
        }
      });

      const reviewQuery = query(
        collection(db, "employers", user.uid, "In Review")
      );

      onSnapshot(reviewQuery, (snapshot) => {
        let newMessages = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().hasUnreadMessage === true) {
            newMessages.push(1);
          } else if (doc.data().jobCompleteApplicant === true) {
            newMessages.push(1);
          }
        });
        if (!newMessages || !newMessages.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setCompletedNewMessageLength(null);
        } else {
          setCompletedNewMessageLength(newMessages.length);
        }
      });

      const acceptedQuery = query(
        collection(db, "employers", user.uid, "Jobs In Progress")
      );

      onSnapshot(acceptedQuery, (snapshot) => {
        let newMessages = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().hasUnreadMessage === true) {
            newMessages.push(1);
          }
        });
        if (!newMessages || !newMessages.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setAcceptedNewMessageLength(null);
        } else {
          setAcceptedNewMessageLength(newMessages.length);
        }
      });

      setNewMessagesSet(true);
    }
  }, [user, newMessagesSet]);

  //seperate useEffect for getting interview message data

  useEffect(() => {
    if (interviewMessageData) {
      interviewMessageData.forEach((job) => {
        const applicantQuery = query(
          collection(
            db,
            "employers",
            user.uid,
            "Posted Jobs",
            job.jobTitle,
            "Applicants"
          )
        );

        onSnapshot(applicantQuery, (snapshot) => {
          let newMessages = [];
          snapshot.docs.forEach((doc) => {
            if (doc.data().hasUnreadMessage === true) {
              newMessages.push(1);
            }
          });

          if (!newMessages || !newMessages.length) {
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
            // setInterviewNewMessageLength(null);
          } else {
            setInterviewNewMessageLength(newMessages.length);
          }
        });
      });
    }
  }, [interviewMessageData, newMessagesSet]);

  const getCompletedDocs = () => {
    //set the name of each jobTitle in collection

    setAcceptedMobile(false);
    setInterviewMobile(false);
    setCompletedMobile(true);
    setRequestsMobile(false);

    const jobQuery = query(collection(db, "employers", user.uid, "In Review"));

    onSnapshot(jobQuery, (snapshot) => {
      let jobData = [];
      let newMessages = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        if (doc.data().channelID) {
          jobData.push(doc.data().channelID);
        }
        if (doc.data().hasUnreadMessage === true) {
          newMessages.push(1);
        }
      });

      // setInterviewJobData(jobData);

      if (!jobData || !jobData.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        setCompletedJobData(null);
        setCompletedJobDataLength(0);
        setCompletedCIDs(null);
        setToggleAcceptedTab(false);
        setToggleInterviewTab(false);
        setToggleCompletedTab(true);
        setToggleRequestsTab(false);
      } else {
        setCompletedJobData(jobData);
        setCompletedJobDataLength(jobData.length);
      }
    });
  };

  useEffect(() => {
    if (completedJobData) {
      //credit Shadow Wizard Love Zelda https://stackoverflow.com/questions/5289403/convert-javascript-array-to-string
      setCompletedCIDs(completedJobData);

      setToggleCompletedTab(true);
      setToggleAcceptedTab(false);
      setToggleInterviewTab(false);
      setToggleRequestsTab(false);
    } else {
      setCompletedCIDs(null);
    }
  }, [completedJobData]);

  const getRequestDocs = () => {
    //set the name of each jobTitle in collection

    setAcceptedMobile(false);
    setInterviewMobile(false);
    setCompletedMobile(false);
    setRequestsMobile(true);

    const jobQuery = query(collection(db, "employers", user.uid, "Requests"));

    onSnapshot(jobQuery, (snapshot) => {
      let jobData = [];
      let newMessages = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        if (doc.data().channelID) {
          jobData.push(doc.data().channelID);
          console.log("requests", doc.data());
        }
      });

      // setInterviewJobData(jobData);

      if (!jobData || !jobData.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        console.log("no requests");
        setRequestCIDs(null);
        setToggleCompletedTab(false);
        setToggleAcceptedTab(false);
        setToggleInterviewTab(false);
        setToggleRequestsTab(true);
      } else {
        setRequestData(jobData);
        setRequestDataLength(jobData.length);
      }
    });
  };

  useEffect(() => {
    if (requestData) {
      //credit Shadow Wizard Love Zelda https://stackoverflow.com/questions/5289403/convert-javascript-array-to-string
      setRequestCIDs(requestData);
      console.log("final request data", requestData);

      setToggleCompletedTab(false);
      setToggleAcceptedTab(false);
      setToggleInterviewTab(false);
      setToggleRequestsTab(true);
    } else {
      setRequestCIDs(null);
    }
  }, [requestData]);

  useEffect(() => {
    if (completedJobData) {
      //credit Shadow Wizard Love Zelda https://stackoverflow.com/questions/5289403/convert-javascript-array-to-string
      setCompletedCIDs(completedJobData);

      setToggleCompletedTab(true);
      setToggleAcceptedTab(false);
      setToggleInterviewTab(false);
      setToggleRequestsTab(false);
    } else {
      setCompletedCIDs(null);
      setToggleCompletedTab(true);
      setToggleAcceptedTab(false);
      setToggleInterviewTab(false);
      setToggleRequestsTab(false);
    }
  }, [completedJobData]);

  //interview logic

  const getInterviewDocs = () => {
    //set the name of each jobTitle in collection
    setAcceptedMobile(false);
    setInterviewMobile(true);
    setCompletedMobile(false);
    setRequestsMobile(false);

    const jobQuery = query(
      collection(db, "employers", user.uid, "Posted Jobs")
    );

    onSnapshot(jobQuery, (snapshot) => {
      let jobData = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        console.log("check 1");
        jobData.push({ jobTitle: doc.data().jobTitle, id: doc.data().jobID });
      });

      // setInterviewJobData(jobData);

      if (!jobData || !jobData.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        setInterviewCIDs(null);
        setInterviewJobDataLength(0);
        setToggleCompletedTab(false);
        setToggleAcceptedTab(false);
        setToggleInterviewTab(true);
        setToggleRequestsTab(false);
      } else {
        setInterviewJobData(jobData);
        setInterviewJobDataLength(jobData.length);
      }
    });

    //for each job title (go over all documents and for each document doc.channelID and set those as the interviewCIDs)
  };

  const [dirtyInterviewCIDs, setDirtyInterviewCIDs] = useState([]);
  const [dirtyInterviewRun, setDirtyInterviewRun] = useState(false);
  useEffect(() => {
    if (interviewJobData && dirtyInterviewRun === false) {
      interviewJobData.forEach((job) => {
        const applicantQuery = query(
          collection(
            db,
            "employers",
            user.uid,
            "Posted Jobs",
            job.jobTitle,
            "Applicants"
          )
        );

        onSnapshot(applicantQuery, (snapshot) => {
          let applicantData = [];
          snapshot.docs.forEach((doc) => {
            //review what this does
            if (doc.data().channelID) {
              dirtyInterviewCIDs.push({
                channelID: doc.data().channelID,
              });
            }
          });
        });
      });
      setDirtyInterviewRun(true);
    }
  }, [interviewJobData]);

  useEffect(() => {
    //how to map over array of objects and push the value of each key value pair to a new array that only consists of the values
    if (dirtyInterviewRun === true) {
      let readyInterviewCIDS = [];
      dirtyInterviewCIDs.forEach((cid) => {
        readyInterviewCIDS.push(cid.channelID);
      });

      //needed to join this array bc stream chat wouldnt accept array.
      //credit Shadow Wizard Love Zelda https://stackoverflow.com/questions/5289403/convert-javascript-array-to-string

      if (!readyInterviewCIDS || !readyInterviewCIDS.length) {
        setInterviewCIDs(null);
      } else {
        setInterviewCIDs(readyInterviewCIDS);
      }

      setToggleAcceptedTab(false);
      setToggleInterviewTab(true);
      setToggleCompletedTab(false);
      setToggleRequestsTab(false);
      setDirtyInterviewRun(false);
    }
  }, [dirtyInterviewRun]);

  //Filters
  const acceptedFilter = {
    cid: { $in: acceptedCIDs },
    members: { $in: [userID] },
  };
  const Interviewfilter = {
    cid: { $in: interviewCIDs },
    members: { $in: [userID] },
  };
  const requestFilter = {
    cid: { $in: requestCIDs ? requestCIDs : null },
    members: { $in: [userID] },
  };

  const completedFilter = {
    cid: { $in: completedCIDs },
    members: { $in: [userID] },
  };

  const [toggleAcceptedTab, setToggleAcceptedTab] = useState(false);
  const [toggleInterviewTab, setToggleInterviewTab] = useState(false);
  const [toggleRequestsTab, setToggleRequestsTab] = useState(false);
  const [toggleCompletedTab, setToggleCompletedTab] = useState(false);

  const [showList, setShowList] = useState(true);

  const [acceptedMobile, setAcceptedMobile] = useState(false);
  const [interviewMobile, setInterviewMobile] = useState(false);
  const [completedMobile, setCompletedMobile] = useState(false);
  const [requestsMobile, setRequestsMobile] = useState(false);

  return (
    <>
      <NeederHeader />

      {/* <Heading width="500px" marginLeft="320px" marginBottom="16px">
        Messages
      </Heading> */}

      <Flex direction="row">
        <Box
          marginBottom={{ base: "", lg: "22px" }}
          marginTop={{ base: "0", lg: "4" }}
        >
          <NeederDashboard />
        </Box>
        <Box height={{ base: "90vh", lg: "80vh" }}>
          {doneLoading ? (
            chatClient ? (
              selectedChannel ? (
                <>
                  <Heading
                    size="lg"
                    width={{ base: "auto", lg: "500px" }}
                    marginBottom="16px"
                  >
                    Messages
                  </Heading>

                  <Flex marginTop="4">
                    <Chat client={chatClient}>
                      <Box height="75vh">
                        {/* <ChannelList
                        filters={filter}
                        Paginator={InfiniteScroll}
                      /> */}
                      </Box>
                      <Box
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        alignSelf="center"
                        textAlign="center"
                        marginLeft="240px"
                      >
                        <Channel channel={selectedChannel}>
                          <Box width="50vw" height="75vh">
                            <Window>
                              <NeederChannelHireHeader />
                              <MessageList />
                              <MessageInput />
                            </Window>
                          </Box>
                          <Thread />
                        </Channel>
                      </Box>
                    </Chat>
                  </Flex>
                </>
              ) : toggleAcceptedTab === true ? (
                isDesktop ? (
                  <>
                    <Flex direction="column">
                      <Box marginLeft="24px">
                        <Heading
                          size="lg"
                          width={{ base: "120px", lg: "500px" }}
                          marginBottom={{ base: 2, lg: "16px" }}
                          marginTop="16px"
                        >
                          Messages
                        </Heading>
                        {isDesktop ? (
                          <Flex direction="row">
                            {acceptedNewMessagesLength ? (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {acceptedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs
                              </Button>
                            )}

                            {interviewNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getInterviewDocs()}
                              >
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                onClick={() => getInterviewDocs()}
                              >
                                Interviewing
                              </Button>
                            )}
                            {completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs
                              </Button>
                            )}

                            {requestNewMessagesLength ? (
                              <Button onClick={() => getRequestDocs()}>
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getRequestDocs()}
                                marginLeft={1}
                              >
                                Requests
                              </Button>
                            )}
                          </Flex>
                        ) : null}

                        <Flex direction={{ base: "column", lg: "row" }}>
                          <Chat client={chatClient}>
                            <Box
                              height={{ base: "40vh", lg: "80vh" }}
                              w={{ base: "85vw", lg: "auto" }}
                            >
                              <ChannelList
                                filters={acceptedFilter}
                                Paginator={InfiniteScroll}
                              />
                            </Box>

                            {acceptedCIDs === null ? (
                              <Box
                                width="50vw"
                                h={{ base: "50vh", lg: "75vh" }}
                              >
                                <Heading
                                  size="sm"
                                  marginTop="24px"
                                  marginLeft="8px"
                                >
                                  No messages here!
                                </Heading>
                              </Box>
                            ) : (
                              <Channel>
                                <Box
                                  width={{ base: "90vw", lg: "50vw" }}
                                  height={{ base: "75vh", lg: "75vh" }}
                                >
                                  <Window>
                                    <NeederChannelHireHeader />
                                    <MessageList />
                                    <MessageInput />
                                  </Window>
                                </Box>
                                <Thread />
                              </Channel>
                            )}
                          </Chat>
                        </Flex>
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <Box>
                    {" "}
                    <Heading
                      size="lg"
                      width={{ base: "120px", lg: "500px" }}
                      marginBottom={{ base: 2, lg: "16px" }}
                      marginTop="16px"
                    >
                      Messages
                    </Heading>{" "}
                    <Flex direction={{ base: "column", lg: "row" }}>
                      <Chat client={chatClient}>
                        <Box
                          height={{ base: "75vh", lg: "80vh" }}
                          w={{ base: "auto", lg: "auto" }}
                          onClick={() => setShowList(false)}
                        >
                          {showList ? (
                            <ChannelList
                              filters={acceptedFilter}
                              Paginator={InfiniteScroll}
                            />
                          ) : (
                            <Channel>
                              <Box
                                width={{ base: "100vw", lg: "50vw" }}
                                height={{ base: "75vh", lg: "75vh" }}
                              >
                                <Window>
                                  <NeederChannelHireHeader />
                                  <MessageList />
                                  <MessageInput />
                                </Window>
                              </Box>
                              <Thread />
                            </Channel>
                          )}
                        </Box>
                      </Chat>
                    </Flex>
                  </Box>
                )
              ) : toggleInterviewTab ? (
                isDesktop ? (
                  <>
                    <Flex direction="column">
                      <Box marginLeft="24px">
                        <Heading
                          size="lg"
                          width={{ base: "120px", lg: "500px" }}
                          marginBottom={{ base: 2, lg: "16px" }}
                          marginTop="16px"
                        >
                          Messages
                        </Heading>
                        {isDesktop ? (
                          <Flex direction="row">
                            {acceptedNewMessagesLength ? (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {acceptedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs
                              </Button>
                            )}

                            {interviewNewMessagesLength ? (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Interviewing
                              </Button>
                            )}
                            {completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs
                              </Button>
                            )}

                            {requestNewMessagesLength ? (
                              <Button onClick={() => getRequestDocs()}>
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getRequestDocs()}
                                marginLeft={1}
                              >
                                Requests
                              </Button>
                            )}
                          </Flex>
                        ) : null}

                        <Flex direction={{ base: "column", lg: "row" }}>
                          <Chat client={chatClient}>
                            <Box
                              height={{ base: "40vh", lg: "80vh" }}
                              w={{ base: "85vw", lg: "auto" }}
                            >
                              <ChannelList
                                filters={Interviewfilter}
                                Paginator={InfiniteScroll}
                              />
                            </Box>

                            {acceptedCIDs === null ? (
                              <Box
                                width="50vw"
                                h={{ base: "50vh", lg: "75vh" }}
                              >
                                <Heading
                                  size="sm"
                                  marginTop="24px"
                                  marginLeft="8px"
                                >
                                  No messages here!
                                </Heading>
                              </Box>
                            ) : (
                              <Channel>
                                <Box
                                  width={{ base: "90vw", lg: "50vw" }}
                                  height={{ base: "75vh", lg: "75vh" }}
                                >
                                  <Window>
                                    <NeederChannelHireHeader />
                                    <MessageList />
                                    <MessageInput />
                                  </Window>
                                </Box>
                                <Thread />
                              </Channel>
                            )}
                          </Chat>
                        </Flex>
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <Box>
                    {" "}
                    <Heading
                      size="lg"
                      width={{ base: "120px", lg: "500px" }}
                      marginBottom={{ base: 2, lg: "16px" }}
                      marginTop="16px"
                    >
                      Messages
                    </Heading>{" "}
                    <Flex direction={{ base: "column", lg: "row" }}>
                      <Chat client={chatClient}>
                        <Box
                          height={{ base: "75vh", lg: "80vh" }}
                          w={{ base: "auto", lg: "auto" }}
                          onClick={() => setShowList(false)}
                        >
                          {showList ? (
                            <ChannelList
                              filters={Interviewfilter}
                              Paginator={InfiniteScroll}
                            />
                          ) : (
                            <Channel>
                              <Box
                                width={{ base: "100vw", lg: "50vw" }}
                                height={{ base: "75vh", lg: "75vh" }}
                              >
                                <Window>
                                  <NeederChannelHireHeader />
                                  <MessageList />
                                  <MessageInput />
                                </Window>
                              </Box>
                              <Thread />
                            </Channel>
                          )}
                        </Box>
                      </Chat>
                    </Flex>
                  </Box>
                )
              ) : toggleRequestsTab ? (
                isDesktop ? (
                  <>
                    <Flex direction="column">
                      <Box marginLeft="24px">
                        <Heading
                          size="lg"
                          width={{ base: "120px", lg: "500px" }}
                          marginBottom={{ base: 2, lg: "16px" }}
                          marginTop="16px"
                        >
                          Messages
                        </Heading>
                        {isDesktop ? (
                          <Flex direction="row">
                            {acceptedNewMessagesLength ? (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {acceptedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs
                              </Button>
                            )}

                            {interviewNewMessagesLength ? (
                              <Button marginLeft={1}>
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button marginLeft={1}>Interviewing</Button>
                            )}
                            {completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed Jobs
                              </Button>
                            )}

                            {requestNewMessagesLength ? (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Requests
                              </Button>
                            )}
                          </Flex>
                        ) : null}

                        <Flex direction={{ base: "column", lg: "row" }}>
                          <Chat client={chatClient}>
                            <Box
                              height={{ base: "40vh", lg: "80vh" }}
                              w={{ base: "85vw", lg: "auto" }}
                            >
                              <ChannelList
                                filters={requestFilter}
                                Paginator={InfiniteScroll}
                              />
                            </Box>

                            {acceptedCIDs === null ? (
                              <Box
                                width="50vw"
                                h={{ base: "50vh", lg: "75vh" }}
                              >
                                <Heading
                                  size="sm"
                                  marginTop="24px"
                                  marginLeft="8px"
                                >
                                  No messages here!
                                </Heading>
                              </Box>
                            ) : (
                              <Channel>
                                <Box
                                  width={{ base: "90vw", lg: "50vw" }}
                                  height={{ base: "75vh", lg: "75vh" }}
                                >
                                  <Window>
                                    <NeederChannelHireHeader />
                                    <MessageList />
                                    <MessageInput />
                                  </Window>
                                </Box>
                                <Thread />
                              </Channel>
                            )}
                          </Chat>
                        </Flex>
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <Box>
                    {" "}
                    <Heading
                      size="lg"
                      width={{ base: "120px", lg: "500px" }}
                      marginBottom={{ base: 2, lg: "16px" }}
                      marginTop="16px"
                    >
                      Messages
                    </Heading>{" "}
                    <Flex direction={{ base: "column", lg: "row" }}>
                      <Chat client={chatClient}>
                        <Box
                          height={{ base: "75vh", lg: "80vh" }}
                          w={{ base: "auto", lg: "auto" }}
                          onClick={() => setShowList(false)}
                        >
                          {showList ? (
                            <ChannelList
                              filters={requestFilter}
                              Paginator={InfiniteScroll}
                            />
                          ) : (
                            <Channel>
                              <Box
                                width={{ base: "100vw", lg: "50vw" }}
                                height={{ base: "75vh", lg: "75vh" }}
                              >
                                <Window>
                                  <NeederChannelHireHeader />
                                  <MessageList />
                                  <MessageInput />
                                </Window>
                              </Box>
                              <Thread />
                            </Channel>
                          )}
                        </Box>
                      </Chat>
                    </Flex>
                  </Box>
                )
              ) : toggleCompletedTab ? (
                isDesktop ? (
                  <>
                    <Flex direction="column">
                      <Box marginLeft="24px">
                        <Heading
                          size="lg"
                          width={{ base: "120px", lg: "500px" }}
                          marginBottom={{ base: 2, lg: "16px" }}
                          marginTop="16px"
                        >
                          Messages
                        </Heading>
                        {isDesktop ? (
                          <Flex direction="row">
                            {acceptedNewMessagesLength ? (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {acceptedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getAcceptedDocs()}
                                size={{ base: "sm", lg: "md" }}
                              >
                                Accepted Jobs
                              </Button>
                            )}

                            {interviewNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getInterviewDocs()}
                              >
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => getInterviewDocs()}
                                marginLeft={1}
                              >
                                Interviewing
                              </Button>
                            )}
                            {completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Completed Jobs{" "}
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Completed Jobs
                              </Button>
                            )}

                            {requestNewMessagesLength ? (
                              <Button>
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  marginBottom={0}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button marginLeft={1}>Requests</Button>
                            )}
                          </Flex>
                        ) : null}

                        <Flex direction={{ base: "column", lg: "row" }}>
                          <Chat client={chatClient}>
                            <Box
                              height={{ base: "40vh", lg: "80vh" }}
                              w={{ base: "85vw", lg: "auto" }}
                            >
                              <ChannelList
                                filters={completedFilter}
                                Paginator={InfiniteScroll}
                              />
                            </Box>

                            {acceptedCIDs === null ? (
                              <Box
                                width="50vw"
                                h={{ base: "50vh", lg: "75vh" }}
                              >
                                <Heading
                                  size="sm"
                                  marginTop="24px"
                                  marginLeft="8px"
                                >
                                  No messages here!
                                </Heading>
                              </Box>
                            ) : (
                              <Channel>
                                <Box
                                  width={{ base: "90vw", lg: "50vw" }}
                                  height={{ base: "75vh", lg: "75vh" }}
                                >
                                  <Window>
                                    <NeederChannelHireHeader />
                                    <MessageList />
                                    <MessageInput />
                                  </Window>
                                </Box>
                                <Thread />
                              </Channel>
                            )}
                          </Chat>
                        </Flex>
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <Box>
                    {" "}
                    <Heading
                      size="lg"
                      width={{ base: "120px", lg: "500px" }}
                      marginBottom={{ base: 2, lg: "16px" }}
                      marginTop="16px"
                    >
                      Messages
                    </Heading>{" "}
                    <Flex direction={{ base: "column", lg: "row" }}>
                      <Chat client={chatClient}>
                        <Box
                          height={{ base: "75vh", lg: "80vh" }}
                          w={{ base: "auto", lg: "auto" }}
                          onClick={() => setShowList(false)}
                        >
                          {showList ? (
                            <ChannelList
                              filters={completedFilter}
                              Paginator={InfiniteScroll}
                            />
                          ) : (
                            <Channel>
                              <Box
                                width={{ base: "100vw", lg: "50vw" }}
                                height={{ base: "75vh", lg: "75vh" }}
                              >
                                <Window>
                                  <NeederChannelHireHeader />
                                  <MessageList />
                                  <MessageInput />
                                </Window>
                              </Box>
                              <Thread />
                            </Channel>
                          )}
                        </Box>
                      </Chat>
                    </Flex>
                  </Box>
                )
              ) : (
                <>
                  <Flex direction="column">
                    <Box marginLeft="24px">
                      <Heading
                        width={{ base: "auto", lg: "500px" }}
                        marginBottom="16px"
                        marginTop="16px"
                      >
                        Messages
                      </Heading>
                      <Flex direction="row">
                        <Button>Accepted Jobs</Button>
                        <Button onClick={() => getInterviewDocs()}>
                          Interviewing
                        </Button>
                        <Button>Completed Jobs</Button>
                        <Button>Requests</Button>
                      </Flex>
                      <Flex>
                        <Chat client={chatClient}>
                          <Box height="75vh">
                            <ChannelList
                              filters={requestFilter}
                              Paginator={InfiniteScroll}
                            />
                          </Box>
                          <Channel>
                            <Box width="50vw" height="75vh">
                              <Window>
                                <NeederChannelHireHeader />
                                <MessageList />
                                <MessageInput />
                              </Window>
                            </Box>
                            <Thread />
                          </Channel>
                        </Chat>
                      </Flex>
                    </Box>
                  </Flex>
                </>
              )
            ) : (
              <Text>
                An error occured with our messaging server. Please try again
                later. If the issue persists, please contact us.
              </Text>
            )
          ) : (
            <Center>
              {" "}
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                marginTop="400px"
                marginLeft="600px"
              />
            </Center>
          )}
        </Box>

        {isDesktop ? null : (
          <Box
            height={{ base: "auto", lg: "0" }}
            width={{ base: "100vw" }}
            backgroundColor="white"
            borderTopWidth="1px"
            borderTopColor="#e3e3e3"
            position="fixed"
            bottom={0}
          >
            <Flex direction="row">
              {acceptedMobile ? (
                acceptedNewMessagesLength ? (
                  <Button
                    backgroundColor="white"
                    textColor="#01A2E8"
                  
                  >
                    Accepted 
                    <Badge
                      variant="solid"
                      colorScheme="red"
                      position="absolute"
                      top={1}
                      right="-1"
                      borderRadius="10px"
                    >
                      {acceptedNewMessagesLength}
                    </Badge>
                  </Button>
                ) : (
                  <Button
                    backgroundColor="white"
                    textColor="#01A2E8"
          
                  >
                    Accepted 
                  </Button>
                )
              ) : acceptedNewMessagesLength ? (
                <Button  onClick={() => getAcceptedDocs()}>
                  Accepted 
                  <Badge
                    variant="solid"
                    colorScheme="red"
                    position="absolute"
                    top={1}
                    right="-1"
                    borderRadius="10px"
                  >
                    {acceptedNewMessagesLength}
                  </Badge>
                </Button>
              ) : (
                <Button  onClick={() => getAcceptedDocs()}>Accepted </Button>
              )}
             {interviewMobile ? 
             (interviewNewMessagesLength ? (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Interviewing
                              </Button>
                            )) : (interviewNewMessagesLength ? (
                              <Button
                              onClick={() => getInterviewDocs()}
                                marginLeft={1}
                              >
                                Interviewing
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {interviewNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                               onClick={() => getInterviewDocs()}
                                marginLeft={1}
                              >
                                Interviewing
                              </Button>
                            ))}
           {completedMobile ? (completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Completed 
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                marginLeft={1}
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Completed 
                              </Button>
                            )) : (completedNewMessagesLength ? (
                              <Button
                                marginLeft={1}
                                onClick={() => getCompletedDocs()}
                              >
                                Completed 
                                <Badge
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {completedNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                              onClick={() => getCompletedDocs()}
                                marginLeft={1}
                             
                              >
                                Completed 
                              </Button>
                            ))}

              {requestsMobile ? (requestNewMessagesLength ? (
                              <Button
                              marginLeft={1}
                                backgroundColor="white"
                                textColor="#01A2E8"
                              >
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                                backgroundColor="white"
                                textColor="#01A2E8"
                                marginLeft={1}
                              >
                                Requests
                              </Button>
                            )) : (requestNewMessagesLength ? (
                              <Button
                              marginLeft={1}
                              onClick={() => getRequestDocs()}
                              >
                                Requests
                                <Badge
                                  marginLeft={1}
                                  variant="solid"
                                  colorScheme="red"
                                  position="absolute"
                                  top={1}
                                  right="-1"
                                  borderRadius="10px"
                                >
                                  {requestNewMessagesLength}
                                </Badge>
                              </Button>
                            ) : (
                              <Button
                              marginLeft={1}
                              onClick={() => getRequestDocs()}
                              
                              >
                                Requests
                              </Button>
                            ))}
             
            </Flex>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default NeederMessageList;
