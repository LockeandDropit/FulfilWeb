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

const NeederMessageList = () => {
  // const { chatClient } = useChatContext();

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
        console.log("channel passed", location.state);
        setPasseChannel(location.state.selectedChannel);
      }
    }
  }, [chatClient]);

  //testing why...

  const [endRun, setEndRun] = useState(false);

  const loadTest = async (passedChannel) => {
    if (clientIsSet) {
      chatClient.connectUser(userInfo, chatClient.devToken(userID));
      const channelSort = await chatClient.queryChannels(filter, {});
      console.log("in loadTest", passedChannel);

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
  const [interviewCIDs, setInterviewCIDs] = useState(null);
  const [interviewCIDsLength, setInterviewCIDsLength] = useState([]);
  const [requestsCIDs, setRequestsCIDs] = useState([]);
  const [completedCIDs, setCompletedCIDs] = useState([]);
  //interviewCIDs come from "Posted Jobs", postedJobTitle, "Applicants" .channelID in FB

  const [interviewJobData, setInterviewJobData] = useState([]);
  const [interviewJobDataLength, setInterviewJobDataLength] = useState(null);

  const getInterviewDocs = () => {
    //set the name of each jobTitle in collection

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

      // setInterviewJobData(jobData);

      if (!jobData || !jobData.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        setInterviewJobData(null);
        setInterviewJobDataLength(0);
      } else {
        setInterviewJobData(jobData);
        setInterviewJobDataLength(jobData.length);
      }
    });

    // if (interviewJobData) {
    //   interviewJobData.forEach((job) => {
    //   const applicantQuery = query(
    //     collection( db,
    //       "employers",
    //       user.uid,
    //       "Posted Jobs",
    //       job.jobTitle,
    //       "Applicants")

    //   );

    //   onSnapshot(applicantQuery, (snapshot) => {
    //     let applicantData = [];
    //     snapshot.docs.forEach((doc) => {
    //       //review what this does
    //       console.log("test",doc.data())
    //       applicantData.push({ data: doc.data()  });
    //     });

    //     // setInterviewJobData(jobData);

    //     if (!applicantData || !applicantData.length) {
    //       //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
    //       setInterviewJobData(null);
    //       setInterviewJobDataLength(0);
    //     } else {
    //       setInterviewJobData(applicantData);
    //       setInterviewJobDataLength(applicantData.length);
    //     }
    //   });
    // })
    // }

    //for each job title (go over all documents and for each document doc.channelID and set those as the interviewCIDs)
  };

  useEffect(() => {
    if (interviewJobData) {
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
              applicantData.push({ data: doc.data().channelID, id: doc.data().applicantID });
        console.log("is this breaking?",doc.data())
            }
          });

          // setInterviewJobData(jobData);

          if (!applicantData || !applicantData.length) {
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
            setInterviewCIDs(null);
            setInterviewCIDsLength(0);
          } else {
            setInterviewCIDs(applicantData);
            setInterviewCIDsLength(applicantData.length);
          }
        });
      });
    }
  }, [interviewJobData]);



  useEffect(() => {
   
      console.log("interviewCIDs", interviewCIDs)
    
  }, [interviewCIDs])

  const getInterviewCIDs = () => {
    interviewJobData.forEach((job) => {
      console.log("debug", job);
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        job.jobTitle,
        "Applicants"
      );

      let localCIDs = [];
      getDoc(docRef).then((snapshot) => {
        console.log("cids", snapshot.data().channelID);
        localCIDs.push({ cid: snapshot.data().channelID });
      });

      if (!localCIDs || localCIDs.length) {
        setInterviewCIDs(null);
        setInterviewCIDsLength(0);
      } else {
        setInterviewCIDs(localCIDs);
        setInterviewCIDsLength(localCIDs.length);
      }
    });
  };



  //Filters
  const Acceptedfilter = { members: { $in: [userID] } };
  const Interviewfilter = { members: { $in: [userID] } };
  const Requestsfilter = { members: { $in: [userID] } };

  const Completedfilter = { members: { $in: [userID] } };

  return (
    <>
      <NeederHeader />

      {/* <Heading width="500px" marginLeft="320px" marginBottom="16px">
        Messages
      </Heading> */}

      <Flex direction="row">
        <Box marginBottom="22px" marginTop="4">
          <NeederDashboard />
        </Box>
        <Box height="90vh">
          {doneLoading ? (
            chatClient ? (
              selectedChannel ? (
                <>
                  <Heading width="500px" marginBottom="16px">
                    Messages
                  </Heading>

                  <Flex marginTop="4">
                    <Flex direction="row">
                      <Button>Accepted Jobs</Button>
                      <Button>Completed Jobs</Button>
                      <Button>Requests</Button>
                    </Flex>
                    <Chat client={chatClient}>
                      <Box height="800px">
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
                          <Box width="50vw" height="80vh">
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
              ) : (
                <>
                  <Flex direction="column">
                    <Box marginLeft="24px">
                      <Heading
                        width="500px"
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
                          <Box height="800px">
                            <ChannelList
                              filters={filter}
                              Paginator={InfiniteScroll}
                            />
                          </Box>
                          <Channel>
                            <Box width="50vw" height="80vh">
                              <Window>
                                {/* <ChannelHeader /> */}
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
                marginTop="240px"
              />
            </Center>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default NeederMessageList;
