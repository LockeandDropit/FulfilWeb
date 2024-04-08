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
} from "@chakra-ui/react";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NeederPostedJobCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Posted Jobs"));

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

  const viewApplicants = (x) => {
    navigate("/NeederApplicants", {
      state: { jobID: x.jobID, jobTitle: x.jobTitle, isHourly: x.isHourly },
    });
  };

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor
  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState(null);

  const handleEdit = (x) => {
navigate("/EditPostedJob", { state: { jobID: x.jobID, jobTitle: x.jobTitle, isHourly: x.isHourly }})
  };


  return (
    <div>
      {!postedJobs ? (
        <Flex direction="column">
          <Text>No posted jobs</Text>
          <Button
            colorScheme="blue"
            marginTop="16px"
            marginRight="24px"
            height="36px"
            width="240px"
            onClick={() => navigate("/AddJobStart")}
          >
            Post A Job
          </Button>
        </Flex>
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
                      marginTop="4"
                    >
                   
                     <Button colorScheme="red" height="24px">Delete</Button>
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

                      {postedJobs.isHourly ? (
                        <Text size="sm">
                          ${postedJobs.lowerRate}/hour - ${postedJobs.upperRate}
                          /hour
                        </Text>
                      ) : (
                        <Text size="sm">
                          Total Offer ${postedJobs.flatRate}
                        </Text>
                      )}
                    </Box>
                  </Flex>

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
                        <Box position="absolute" right="10" bottom="8"></Box>
                        <Button
                          backgroundColor="#01A2E8"
                          color="white"
                          _hover={{ bg: "#018ecb", textColor: "white" }}
                          width="180px"
                          height="40px"
                          alignItems="center"
                          onClick={() => viewApplicants(postedJobs)}
                        >
                          View Applicants
                        </Button>
                        <Button
                          variant="ghost"
                          marginLeft="16px"
                          width="180px"
                          height="40px"
                          _hover={{
                            backgroundColor: "#e2e2e2",
                            textColor: "black",
                          }}
                          alignItems="center"
                          onClick={() => handleEdit(postedJobs)}
                        >
                          Edit Post
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

export default NeederPostedJobCard;
