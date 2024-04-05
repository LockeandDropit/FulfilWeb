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
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { query, collection, onSnapshot } from "firebase/firestore";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Avatar,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { ChatIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";

const CompletedJobCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const [user, setUser] = useState();

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Past Jobs"));

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
  const [seeMore, setSeeMore] = useState(true);

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor
  return (
    <div>
      {!postedJobs ? (
        <Text>No completed jobs</Text>
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
                    <Flex
                      direction="column"
                      position="absolute"
                      right="8"
                      alignItems="center"
                      marginTop="10"
                    >
                      {postedJobs.paymentCompletedAndPending === true ? (
                        <Alert status='info'>
    <AlertIcon />
    Payment transfer pending
  </Alert>
                      ) : (
<Alert status="success">
                        <AlertIcon />
                        Payment completed!
                      </Alert>
                      )}
                      
                    </Flex>
                  </Flex>
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginLeft="16px"
                  >
                    <Heading fontSize="24">{postedJobs.jobTitle}</Heading>
                  </Flex>

                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginTop="4"
                    marginLeft="16px"
                  >
                     <Avatar src='https://bit.ly/broken-link' bg="#01A2E8" size="lg" />

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

export default CompletedJobCard;
