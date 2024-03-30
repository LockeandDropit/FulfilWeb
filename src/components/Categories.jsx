import React from "react";
import { SimpleGrid, Box, Text, Header, Center, Heading } from "@chakra-ui/react";

const Categories = () => {
  return (
    <Box marginTop="64px" padding="0">
      <Heading marginLeft="405">Categories</Heading>
      <Center>
        <SimpleGrid columns={[2, null, 3]} spacing="64px" marginTop="16">
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
          <Box bg="tomato" height="240px" width="320px"></Box>
        </SimpleGrid>
      </Center>
    </Box>
  );
};

export default Categories;
