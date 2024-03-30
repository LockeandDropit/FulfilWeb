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

import NeederChannelHireHeader from "./NeederChannelHireHeader";

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

  const filter = { members: { $in: [userID] } };

  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };

  const apiKey = "gheexx2834gr";

  const chatClient = new StreamChat(apiKey);

  const [clientIsSet, setClientIsSet] = useState(false);

  useEffect(() => {
    if (userID && chatClient) {
      chatClient.connectUser(userInfo, chatClient.devToken(userID));
      console.log("userConnected!", chatClient._user.id);
      setClientIsSet(true);
    } else {
    }
  }, [userID, chatClient, clientIsSet]);

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
      setSelectedChannel(null)
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

  const [endRun, setEndRun] = useState(false)

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
          setEndRun(true)
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
console.log("debug", selectedChannel)
  }, [selectedChannel])

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
        {doneLoading ? (
          chatClient ? (
            selectedChannel ? (
              <>
              <Heading width="500px" marginLeft="320px" marginBottom="16px">
              Messages
            </Heading>
              <Flex marginTop="4">
                <Chat client={chatClient}>
                  <ChannelList filters={filter} Paginator={InfiniteScroll} />

                  <Channel channel={selectedChannel}>
                    <Box
                      width="50vw"
                      height="80vh"
                      borderWidth="1"
                      borderColor="red"
                    >
                      <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                      </Window>
                    </Box>
                    <Thread />
                  </Channel>
                </Chat>
              </Flex>
              </>
            ) : (
              <>
              <Flex direction="column">
                <Box marginLeft="24px" >
              <Heading width="500px"  marginBottom="16px" marginTop="16px">
              Messages
            </Heading>
              <Flex>
                <Chat client={chatClient}>
                  <ChannelList filters={filter} Paginator={InfiniteScroll} />

                  <Channel>
                    <Box
                      width="50vw"
                      height="80vh"
                      borderWidth="1"
                      borderColor="red"
                    >
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
      </Flex>
    </>
  );
};

export default NeederMessageList;
