import React from "react";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Box,
  Center,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import LandingNeederMapScreen from "./LandingNeederMapScreen";

const LandingPageMap = () => {

    const navigate = useNavigate();

    //credit template hero split screen with image https://chakra-templates.vercel.app/page-sections/hero

  return (

    
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }} padding={2}>
       <Flex flex={1}>
        <Center>
       <Box w={{base: "70vw", lg: "50vw"}} h={{base: "50vh", lg: "70vh"}} padding={{base: "3 ", lg: "16" }} alignContent="center" justifyContent="center">
            <Box w={{base: "70vw", lg: "50vw"}} h={{base: "50vh", lg: "70vh"}}>
              <LandingNeederMapScreen />
            </Box>
          </Box>
          </Center>
      </Flex>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
        <Center>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }}>
          <Center>
            <Text
              // as={'span'}
              // position={'relative'}
            
              >
              Have your task seen by motivated contractors
            </Text>
         
           </Center>
          </Heading>
          </Center>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
          The jobs you post will be on visible to contractors who are available in your area.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button backgroundColor="#01A2E8" color="white" _hover={{ bg: "#018ecb", textColor: "white" }}  onClick={() => navigate("/NeederEmailRegister")}>Post My Job</Button>
         
          </Stack>
        </Stack>
      </Flex>
     
    </Stack>
  )
};

export default LandingPageMap;