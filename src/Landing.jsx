import React from "react";
import Header from "./components/Header.jsx";
import HeroMd from "./images/HeroMd.jpg";
import Categories from "./components/Categories.jsx";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Planning from "./images/Planning.jpg"
import ManWorking from "./images/ManWorking.jpg"
import house from "./images/house.jpg"
import rotar from "./images/rotar.jpg"

const Landing = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();

  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Nate Johnson https://unsplash.com/photos/a-group-of-men-standing-around-a-white-sheet-of-paper-DowtEyavqsY

  return (
    <>
      <Header />
      <Flex>
        <Box w="50vw" h="90vh" alignContent="center" >
          <Container >
           <Center>
              <Flex direction="column">
                <Heading type="blackAlpha" size="xl">Need work done?</Heading>
                <Flex direction="row">
                  
                  <Heading size="xl">Find the right person</Heading>
                  <Heading marginLeft="8px" color="#01A2E8" size="xl">
                    today.
                  </Heading>
                </Flex>
                {/* <Flex direction="row" alignContent="baseline" marginTop="16px" onClick={() => navigate("/NeederAccountCreation")}>
                  
                  <Heading size="sm" >Find the professional thats right for you. </Heading>
                  <Heading size="sm" marginLeft="4px" color="#01A2E8">Get started</Heading>
                  <ArrowForwardIcon marginTop="2px"/>
                </Flex> */}
                <Button backgroundColor="#01A2E8" color="white" marginTop="16px" onClick={() => navigate("/NeederAccountCreation")}>Get Started <ArrowForwardIcon marginTop="2px" marginLeft="4px" boxSize={6}/></Button>
              </Flex>
              </Center>
          </Container>
        </Box>
        <Center>
        <Box w="50vw" h="90vh" padding="16" alignContent="center">
                <Box backgroundImage={`url(${Planning})`} w="30vw" h="75vh" marginLeft="80px"></Box>
        </Box>
        </Center>
      </Flex>

      {/* <Center>

      <Box width="320px">
        <InputGroup size="lg" width="320px">
          <Input placeholder="mysite" />
          <Button   backgroundColor="#01A2E8" color="white"  onClick={() => navigate(`/MapScreen`)}>Search</Button>
        </InputGroup>
      </Box>
      </Center> */}
      {/* <Categories /> */}
    </>
  );
};

export default Landing;
