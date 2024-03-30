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

import { useEffect, useState } from "react";

const MapSelectedJob = () => {
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
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);



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
              width="800px"
              borderWidth="2px"
              borderColor="#E3E3E3"
              borderLeftWidth="4px"
              borderRightWidth="4px"
              height="auto"
              marginTop="16px"
              boxShadow="lg"
              rounded="lg"
            >
              <Stack>
                <CardBody>
                  <Heading fontSize="24">{postedJobs.jobTitle}</Heading>

                  <Heading size="sm" marginTop="2">
                    {postedJobs.city}, MN
                  </Heading>
                  {postedJobs.isHourly ? ( <Heading size="sm">
                  ${postedJobs.lowerRate}/hr-${postedJobs.upperRate}/hr
                  </Heading>) : ( <Heading size="sm">
                  ${postedJobs.flatRate} 
                  </Heading>)}
                 

                  <Heading size="sm" marginTop="2">
                    Description
                  </Heading>
                  <Text>{postedJobs.description}</Text>
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
                    <Text>{postedJobs.niceToHave}</Text>
                  ) : (
                    <Text>Nothing listed</Text>
                  )}
                </CardBody>
                <CardFooter  >
                  <Button
                    backgroundColor="#01A2E8"
                    textColor="white"
                    width="240px"
                  
                  >
                    Apply
                  </Button>{" "}
                  
                </CardFooter>
              </Stack>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};

export default MapSelectedJob;
