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
navigate("SelectedCategory", {state: {category: x }})
}

  return (
    <Box marginTop="64px" padding="0">
      <Center>
        <Heading>Categories</Heading>
      </Center>

      <Center>
        <SimpleGrid columns={[2, null, 3]} spacing="64px" marginTop="16">
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />

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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1711856714981-ff6c4d937a34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuJTIwc2hvdmVsaW5nfGVufDB8MHwwfHx8Mg%3D%3D"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
          <Card maxW="sm">
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1711856714981-ff6c4d937a34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuJTIwc2hvdmVsaW5nfGVufDB8MHwwfHx8Mg%3D%3D"
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
  );
};

export default Categories;
