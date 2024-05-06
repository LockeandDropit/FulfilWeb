import React from "react";
import {
  SimpleGrid,
  Box,
  Text,
  Header,
  Center,
  Heading,
  Card,
  CardBody,
  Image,
  Stack,
  Divider,
  Flex,
  CardFooter,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const handleNavigation = (x) => {
    navigate("/SelectedCategory", { state: { category: x } });
  };

  return (
    <Box marginTop={{base: "", lg: "64px"}} padding="0">
      <Center>
        <Heading>Categories</Heading>
      </Center>

      <Center>
        <SimpleGrid columns={[1, null, 3]} spacing="64px" marginTop={{base: "4", lg: "16"}}>
          <Card maxW="sm" boxShadow=''>
            <CardBody>
              <Image
                src="/landingImages/DrivewayAsphalt.jpg"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Asphalt
                </Heading>{" "}
                <Button
                  w= {{base: "72px", lg: "auto"}}
                  h= {{base: "12px", lg: "auto"}}
                  variant="ghost"
                  colorScheme="blue"
                 marginLeft= {{base: "", lg: "auto"}}
              
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Carpentry
                </Heading>{" "}
                <Button
                  w= {{base: "72px", lg: "auto"}}
                  h= {{base: "12px", lg: "auto"}}
                  variant="ghost"
                  colorScheme="blue"
                 marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Cleaning
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Concrete
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Drywall
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Electrical Work
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  General Handyman
                </Heading>{" "}
                <Button
                  w= {{base: "72px", lg: "auto"}}
                  h= {{base: "12px", lg: "auto"}}
                  variant="ghost"
                  colorScheme="blue"
                 marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Gutter Cleaning
                </Heading>{" "}
                <Button
                   w= {{base: "72px", lg: "auto"}}
                   h= {{base: "12px", lg: "auto"}}
                   variant="ghost"
                   colorScheme="blue"
                  marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  HVAC
                </Heading>{" "}
                <Button
                w= {{base: "72px", lg: "auto"}}
                h= {{base: "12px", lg: "auto"}}
                variant="ghost"
                colorScheme="blue"
               marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Landscaping
                </Heading>{" "}
                <Button
                   w= {{base: "72px", lg: "auto"}}
                   h= {{base: "12px", lg: "auto"}}
                   variant="ghost"
                   colorScheme="blue"
                  marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Painting
                </Heading>{" "}
                <Button
                   w= {{base: "72px", lg: "auto"}}
                   h= {{base: "12px", lg: "auto"}}
                   variant="ghost"
                   colorScheme="blue"
                  marginLeft= {{base: "", lg: "auto"}}
                 
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Plumbing
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Pressure Washing
                </Heading>{" "}
                <Button

                  w= {{base: "72px", lg: "auto"}}
                  h= {{base: "12px", lg: "auto"}}
                  variant="ghost"
                  colorScheme="blue"
                 marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Roofing
                </Heading>{" "}
                <Button
                   w= {{base: "72px", lg: "auto"}}
                   h= {{base: "12px", lg: "auto"}}
                   variant="ghost"
                   colorScheme="blue"
                  marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Snow Removal
                </Heading>{" "}
                <Button
                   w= {{base: "72px", lg: "auto"}}
                   h= {{base: "12px", lg: "auto"}}
                   variant="ghost"
                   colorScheme="blue"
                  marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Window Installation
                </Heading>{" "}
                <Button
                  w= {{base: "72px", lg: "auto"}}
                  h= {{base: "12px", lg: "auto"}}
                  variant="ghost"
                  colorScheme="blue"
                 marginLeft= {{base: "", lg: "auto"}}
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

              <Flex direction={{base: "column", lg: "row" }}>
                {" "}
                <Heading size="md" marginTop="8px">
                  Yard Work
                </Heading>{" "}
                <Button
                 w= {{base: "72px", lg: "auto"}}
                 h= {{base: "12px", lg: "auto"}}
                 variant="ghost"
                 colorScheme="blue"
                marginLeft= {{base: "", lg: "auto"}}
                  onClick={() => handleNavigation("Yard Work")}
                >
                  See More
                </Button>
              </Flex>
            </CardBody>
          </Card>
         
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default Categories;
