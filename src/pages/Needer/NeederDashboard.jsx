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

  //partial credit to simple sidebar code (see box) https://chakra-templates.vercel.app/navigation/sidebar
  return (
    <>
      <Box
        // height="800px"
        height="auto"
        // width="320px"
        width="280px"
        borderRadius="6"
        boxShadow="sm"
        rounded="md"
        backgroundColor="white"
      >
        <Flex direction="column">
        
         
     
          <Box mt={3} fontWeight="600" href="#"  onClick={() => {
              navigate("/NeederMapScreen");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
               
                height: "42px"
              }}
            >
              My Jobs
            </Flex>
          </Box>
          <Box fontWeight="600" href="#"   onClick={() => {
              navigate(`/NeederAllCategories`);
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
             
              _hover={{
                bg: "#e3e3e3",
                height: "42px"
              }}
            >
              Find A Pro
            </Flex>
          </Box>
          <Box fontWeight="600" href="#"   onClick={() => {
              navigate("/NeederMessageList");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
                height: "42px"
              }}
            >
              Messages
            </Flex>
          </Box>
          <Box fontWeight="600" href="#"   onClick={() => {
              navigate("/NeederProfile");
            }}>
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
              _hover={{
                bg: "#e3e3e3",
                height: "42px"
             
              }}
            >
             My Profile
            </Flex>
          </Box>
          <Center>
            <Button
              marginTop="16px"
              marginBottom="24px"
              fontSize="18px"
              as="b"
              width="200px"
              backgroundColor="#01A2E8"
              color="white"
            
              _hover={{ bg: "#018ecb", textColor: "white" }}
              onClick={() => {
                navigate("/AddJobStart");
              }}
            >
              Post A Job
            </Button>
          </Center>
        </Flex>
      </Box>
    </>
  );
};

export default NeederDashboard;
