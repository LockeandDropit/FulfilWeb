//make this another split screen

//left side is text about finding the right professional.
//followed by copy to sign up or sign in.

//right side is scrollview of featured contractors in that category.

import React, { useState, useEffect } from "react";

import NeederHeader from "./NeederHeader";

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
  Spinner,
} from "@chakra-ui/react";
import { StreamChat } from "stream-chat";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import { auth, db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import NeederDashboard from "./NeederDashboard";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";

const NeederAllCategories = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
 

  const handleNavigation = (x) => {
    navigate("/NeederSelectedCategory", { state: { category: x } });
  };

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  //Card Social User PRofile Sample Template credit https://chakra-templates.vercel.app/components/cards
  return (
    <>
      <NeederHeader />

<Flex justifyContent="center">
      <Stack
        minH={"100vh"}
        direction={{ base: "column", md: "row" }}
        marginTop="16px"
      >
        <Box position="absolute" left="0">
        <NeederDashboard />
        </Box>
        <Flex flex={2}>
          <Box w="60vw" h="90vh" padding="8">
            {/* <Center> */}
            <Heading size="md">
              All Categories
            </Heading>
       
          
            <Center>
        <SimpleGrid columns={[2, null, 3]} spacing="64px" marginTop="8">
          
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/DrivewayAsphalt.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Asphalt
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Asphalt")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/CarpentryTrim.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Carpentry
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Carpentry")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
              //credit Towfiqu Barbhuiya https://unsplash.com/photos/person-in-blue-long-sleeve-shirt-sitting-beside-black-laptop-computer--9gPKrsbGmc
                src="/landingImages/Cleaning.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Cleaning
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Cleaning")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/ConcreteAsphalt.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Concrete
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Concrete")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>

          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image src="/landingImages/Drywall.jpg" borderRadius="lg" />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Drywall
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Drywall")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/electrical.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Electrical Work
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Electrical Work")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/Handyman.jpg"
                alt="Group cutting wood"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  General Handyman
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("General Handyman")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/GutterCleaning.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Gutter Cleaning
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Gutter Cleaning")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/NewHVAC.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  HVAC
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("HVAC")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/NewLandscaping2.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Landscaping
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Landscaping")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/Painting.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Painting
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Painting")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/Plumbing.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Plumbing
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Plumbing")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/PressureWashing.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Pressure Washing
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Pressure Washing")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/RoofingSiding.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Roofing
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Roofing")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/Shoveling.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Snow Removal
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Snow Removal")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/WindowInstallation.jpg"
     
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Window Installation
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Window Installation")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/NewYardWork.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  Yard Work
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Yard Work")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/Moving.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
                height="240px"
              />

              <Flex direction="row">
                {" "}
                <Heading size="md" marginTop="8px">
                  See More
                </Heading>{" "}
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  position="absolute"
                  right="4"
                  onClick={() => handleNavigation("Concrete")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Center>
           
          </Box>
        </Flex>
        
      </Stack>
      </Flex>
    </>
  );
};

export default NeederAllCategories;
