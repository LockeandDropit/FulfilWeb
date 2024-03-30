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
import { auth } from "../../../firebaseConfig";
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
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";



const NeederChannelHireHeader = () => {

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



const confirmJobAccept = () => {
    // hire code here.
    // post under in progress for employer and applicant

    // postInProgress();

    //delete from Posted under employer

    // deletePostedEmployer();

    //make notification in chat for both

    // chatNotifications();

    //delete from global jobs/maps

    // deleteFromMaps();

    //delete from paid v volunteer db

    // deleteFromJobs();

  };

  return (
    <>
    {isHired ? (
        <Card >
          <Box >
            <Text>
              Congrats! You've been hired for
            </Text>
            <Button
              onPress={() =>
                navigate("PostedJobSingleNoButtons", {
                  props: jobID,
                })
              }
            >
              <Text >{jobTitle}</Text>
            </Button>
          </Box>
        </Card>
      ) : !jobOffered ? (
        <Card >
          <Box>
            <Text >You're interviewing for:</Text>
            <Button
              onPress={() =>
                navigate("PostedJobSingleNoButtons", {
                  props: jobID,
                })
              }
            >
              <Text >{jobTitle}</Text>
            </Button>
          </Box>
        </Card>
      ) : (
        <Box>
          <Card >
            <Box >
              <Text >
                Congratulations! You've been offered this position.
                Would you like to accept for
              </Text>
              <Button
                onPress={() =>
                navigate("PostedJobSingleNoButtons", {
                    props: jobID,
                  })
                }
              >
                <Text >{jobTitle}?</Text>
              </Button>
              <Text >Pay Rate:</Text>
              {isHourly ? (
                <Text >
                  ${confirmedRate}/hr
                </Text>
              ) : isVolunteer ? (
                <Text >
                  {" "}
                 No Charge
                </Text>
              ): (
                <Text >
                {" "}
                ${confirmedRate} total{" "}
              </Text>
              )}
            </Box>
            <Box >
              <Box>
                <Button
           
                  onPress={() => confirmJobAccept()}
                >
                  <Text>Yes!</Text>
                </Button>
              
              </Box>
            </Box>
          </Card>
        </Box>
      )}
  </>
  )
  
}

export default NeederChannelHireHeader