import React from "react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Divider,
} from "@chakra-ui/react";
import { Container, Text, Flex, Box, Center } from "@chakra-ui/react";
import { useClickable } from "@chakra-ui/clickable";
import { chakra } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const NeederDashboard = () => {
  const isOpen = true;

  const navigate = useNavigate();

  return (
    <>
      <Box
        height="800px"
        width="320px"
        borderRadius="6"
        boxShadow="sm"
        rounded="md"
        backgroundColor="white"
      >
        {/* <Text fontSize="24px" as="b" marginTop="4" marginLeft="2">
            Dashboard
          </Text> */}
        <Center flexDirection="column">
          {/* <Button
              fontSize="20px"
              as="b"
              marginTop="8"
              width="320px"
              _hover={{ bg: "#01A2E8", textColor: "white" }}
              _active={{  bg: '#dddfe2',
              // transform: 'scale(0.98)',
              borderColor: "#01A2E8", }}
              onClick={() => {navigate("/DoerHome")}}
            >
             My Jobs (Make Accordion)
            </Button> */}
          <Accordion allowMultiple>
            {/* <AccordionItem>
              <AccordionButton
                height="80px"
                width="320px"
                backgroundColor="white"
                _expanded={{ bg: "white", color: "black" }}
              >
                <Button
                marginLeft="16px"
                  fontSize="20px"
                  as="b"
                  backgroundColor="white"
                  width="320px"
                  _hover={{ bg: "#01A2E8", textColor: "white" }}
                  // _active={{  bg: '#dddfe2',
                  // transform: 'scale(0.98)',
                  // borderColor: "#01A2E8", }}
                >
                  My Jobs
                </Button>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4}>
                <Flex direction="column">
                  <Button
                          backgroundColor="white"
                    width="320px"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/NeederInProgressList");
                    }}
                  >
                    In Progress
                  </Button>
                 
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/NeederInReviewList");
                    }}
                  >
                    In Review
                  </Button>
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/NeederPostedList");
                    }}
                  >
                   Posted
                  </Button>
                  <Button
                    width="320px"
                    backgroundColor="white"
                    _hover={{ bg: "#01A2E8", textColor: "white" }}
                    _active={{
                      bg: "#dddfe2",
                      // transform: 'scale(0.98)',
                      borderColor: "#01A2E8",
                    }}
                    onClick={() => {
                      navigate("/NeederCompletedList");
                    }}
                  >
                    Completed
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem> */}
          </Accordion>
          <Button
            fontSize="20px"
            as="b"
            // marginTop="4"
            width="320px"
            backgroundColor="white"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            onClick={() => {
              navigate("/NeederMapScreen");
            }}
          >
            My Jobs
          </Button>
          <Button
            fontSize="20px"
            as="b"
            marginTop="4"
            backgroundColor="white"
            width="320px"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            onClick={() => {
              navigate("/NeederMessageList");
            }}
          >
            Messages
          </Button>
          <Button
            //   colorScheme="black"
            fontSize="20px"
            as="b"
            marginTop="4"
            backgroundColor="white"
            width="320px"
            _hover={{ bg: "#01A2E8", textColor: "white" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            onClick={() => {
              navigate("/NeederProfile");
            }}
          >
            Profile
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default NeederDashboard;
