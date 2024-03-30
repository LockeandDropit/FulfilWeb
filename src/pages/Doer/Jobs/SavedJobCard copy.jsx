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
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Avatar,
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { query, collection, onSnapshot, updateDoc, setDoc, doc, getDoc } from "firebase/firestore";

import { useEffect, useState } from "react";

const SavedJobCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const [user, setUser] = useState();

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Saved Jobs"));

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
          console.log(results)
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);




  const [jobTitle, setJobTitle] = useState(null);
  const [employerID, setEmployerID] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [flatRate, setFlatRate] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setIsOnboarded(snapshot.data().isOnboarded);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

    //apply logic
    const applyAndNavigate = (postedJobs) => {
      if (isOnboarded === true) {
        updateDoc(doc(db, "employers", postedJobs.employerID, "Posted Jobs", postedJobs.jobTitle), {
          hasNewApplicant: true,
        })
          .then(() => {
            //user info submitted to Job applicant file
          })
          .catch((error) => {
            //uh oh
            console.log(error);
          });
        setDoc(
          doc(
            db,
            "employers",
            postedJobs.employerID,
            "Posted Jobs",
            postedJobs.jobTitle,
            "Applicants",
            user.uid
          ),
          {
            applicantID: user.uid,
            isNewApplicant: true,
          }
        )
          .then(() => {
            //user info submitted to Job applicant file
            alert("Application Submitted!");
            console.log("Application submitted");
            // navigation.navigate("BottomUserTab");
          })
          .catch((error) => {
            //uh oh
            console.log(error);
          });
      } else {
        alert("Please finish onboarding (Under the My Account tab) before applying");
      }
    };

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor
  return (
    <div>
      {!postedJobs ? (
        <Text>No saved jobs</Text>
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
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                      size="lg"
                    />

                    <Box marginTop="2">
                      <Heading size="sm"> {postedJobs.employerName}</Heading>
                      <Text> {postedJobs.city}, MN</Text>

                      {postedJobs.isHourly ? (
                        <Text size="sm">
                          ${postedJobs.lowerRate}/hour - ${postedJobs.upperRate}
                          /hour
                        </Text>
                      ) : (
                        <Text size="sm">Total Offer ${postedJobs.flatRate}</Text>
                      )}
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

                        <Button
                          colorScheme="blue"
                          textColor="white"
                          width="180px"
                          height="40px"
                          position="absolute"
                          right="10"
                          bottom="8"
                          alignItems="center"
                          // onClick={() => getChannels(postedJobs)}
                          onClick={() => applyAndNavigate(postedJobs)}
                        >
                          Apply
                        </Button>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Stack>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobCard;
