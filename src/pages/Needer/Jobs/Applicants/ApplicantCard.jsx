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
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import {
  query,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { ChatIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ApplicantCard = (props) => {
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

  console.log("here are props", props.props.jobID);

  const isHourly = props.props.isHourly;
  const jobID = props.props.jobID;
  const jobTitle = props.props.jobTitle;

  // useEffect(() => {
  //   if (user != null) {
  //     // should this be done on log ina nd stored in redux store so it's cheaper?
  //     const q = query(collection(db, "employers", user.uid, "In Review"));

  //     onSnapshot(q, (snapshot) => {
  //       let results = [];
  //       snapshot.docs.forEach((doc) => {
  //         //review what thiss does
  //         results.push({ ...doc.data(), id: doc.id });
  //       });

  //       if (!results || !results.length) {
  //         setPostedJobs(0);
  //       } else {
  //         setPostedJobs(results);
  //       }
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [user]);

  const [applicant, setApplicant] = useState(null);

  useEffect(() => {
    if (user && jobTitle) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(
          db,
          "employers",
          user.uid,
          "Posted Jobs",
          jobTitle,
          "Applicants"
        )
      );

      onSnapshot(q, (snapshot) => {
        let results = [];
        let finalResults = [];
        snapshot.docs.forEach((doc) => {
          if (doc.id.length > 25) {
            results.push(doc.id);
            console.log("here?", doc.id);
          } else {
          }
        });

        results.forEach((results) => {
          const secondQuery = doc(db, "users", results);

          getDoc(secondQuery).then((snapshot) => {
            // if empty https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
            // if (Object.keys(snapshot.data()).length !== 0) {
            //   finalResults.push({ ...snapshot.data() });
            // } else {
            //   console.log("ehh");
            // }

            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              finalResults.push({ ...snapshot.data() });
            }
            // finalResults.push({ ...snapshot.data() });

            //this is so dirty but why is this the only way I could get it to render???

            //ATTN: THIS IS ONLY ALLOWING ONE APPLICANT TO SHOW UP.
            //CHANGE [finalResults[0]] back to finalResults to access all
            //this is because all message instances are being merged under the jobIDs in StremChat instead of making new ones. Need to fix that.
            setTimeout(() => {
              setApplicant([finalResults[0]]);
              console.log("this is your applicant(s)", finalResults[0]);
            }, 50);
          });
        });
      });
    } else {
      console.log("oops!");
    }
  }, [user, jobTitle]);

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor

  //attemtp to query needer and doer's caht channel using jobTitle as filter

  const [channelID, setChannelID] = useState(null);

  const getChannelID = (x) => {
    console.log("this is whats being passed", x);
    if (user != null) {
      const docRef = doc(db, "employers", user.uid, "In Review", x);
      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data().channelID);

        setChannelID(snapshot.data().channelID);
      });
    } else {
      console.log("oops!");
    }
  };

  const apiKey = "gheexx2834gr";

  const chatClient = new StreamChat(apiKey);

  // const client = StreamChat.getInstance(STREAM_CHAT_API_KEY);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const filter = { type: "messaging", members: { $in: [userID] } };

  const getChannels = async () => {
    const channelSort = await chatClient.queryChannels(filter, {});

    channelSort.map((channelSort) => {
      // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
      if (channelSort.cid == channelID) {
        setSelectedChannel(channelSort);
        console.log("channel found", channelSort.cid);
        console.log("channel from FB", channelID);
        //or just navigate from here to selected channel??
        //pass whole channel object to navigate
      } else {
        console.log("no luck", channelSort.cid);
      }
    });
    console.log("channel from FB", channelID);
  };
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (selectedChannel !== null) {

  //     console.log("selected channel", selectedChannel)
  //     // navigate("TrialSelectedChat", { props: selectedChannel, isFirstInterview: false });
  //   } else {
  //     console.log("nope");
  //   }
  // }, [selectedChannel]);

  const navigateApplicantProfile = (applicant) => {
    navigate("/ApplicantProfile", {
      state: {
        applicant: applicant,
        jobTitle: jobTitle,
        jobID: jobID,
        isHourly: isHourly,
      },
    });
  };

  // console.log(toString(applicant).length);

  // useEffect(() => {
  //   if (applicant) {
  //     console.log(applicant.toString());
  //   } else {
  //   }
  // }, [applicant]);

  return (
    <div>
      {applicant ? (
        applicant?.map((applicant) => (
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
                    <Heading fontSize="24">
                      {applicant.firstName} {applicant.lastName}
                    </Heading>
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
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                      size="lg"
                    />

                    {/* <Box marginTop="2">
                          <Heading size="sm"> {postedJobs.employerName}</Heading>
                          <Text> {postedJobs.city}, MN</Text>
                          <Text size="sm">
                            Total Pay ${postedJobs.confirmedRate}
                          </Text>
                        </Box> */}
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
                      About
                    </Heading>
                    <Text>{applicant.bio}</Text>
                    <Button
                      colorScheme="blue"
                      textColor="white"
                      width="180px"
                      height="40px"
                      // position="absolute"
                      // right="10"
                      bottom="0"
                      left="720px"
                      alignItems="center"
                      // onClick={() => getChannels(postedJobs)}
                      onClick={() => navigateApplicantProfile(applicant)}
                    >
                      See More
                      <ArrowForwardIcon marginLeft="2" marginTop="2px" />
                    </Button>
                  </Flex>

                  {/* <Heading size="sm" marginTop="2">
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
                        <Text>{postedJobs.niceToHave}</Text>
                      ) : (
                        <Text>Nothing listed</Text>
                      )} */}
                </CardBody>
              </Stack>
            </Card>
          </div>
        ))
      ) : (
        <Text>No applicants yet!</Text>
      )}
    </div>
  );
};

export default ApplicantCard;
