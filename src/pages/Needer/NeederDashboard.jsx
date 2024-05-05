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
import { useMediaQuery } from "@chakra-ui/react";


const NeederDashboard = () => {
  const isOpen = true;

  const navigate = useNavigate();

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  //partial credit to simple sidebar code (see box) https://chakra-templates.vercel.app/navigation/sidebar
  return (
    <>

    {isDesktop ? (<Box
        // height="800px"
        height="90vh"
        // width="320px"
        width="280px"
        borderRadius="6"
        boxShadow="sm"
        rounded="md"
        backgroundColor="white"
      >
        <Flex direction="column">
        
        <Box  fontWeight="600">
            <Flex
              align="center"
              p="3"
              mx="4"
              borderRadius="md"
              fontSize="18px"
              height="42px"
             
            >
            Dashboard
            </Flex>
          </Box>
          <Center>
          <Divider width="240px"/>
          </Center>
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
              width="220px"
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
      </Box>) : (null)}
      
    </>
  );
};

export default NeederDashboard;
