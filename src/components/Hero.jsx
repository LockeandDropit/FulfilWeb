import React from "react";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  Center,
  Box
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from '@chakra-ui/react'

const Hero = () => {

    const navigate = useNavigate();
    const [isDesktop] = useMediaQuery('(min-width: 500px)')

    //credit template hero split screen with image https://chakra-templates.vercel.app/page-sections/hero
//credit image Nate Johnson https://unsplash.com/photos/a-group-of-men-standing-around-a-white-sheet-of-paper-DowtEyavqsY
  return (

    
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }} padding={4}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={{base: 2, lg: 6}} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }}>
            <Text
              as={'span'}
              position={'relative'}
            
              >
              {/* Need Work Done? */}
              Modified
            </Text>
            <br />{' '}
            <Text
              as={'span'}
              position={'relative'}
            
              >
              Find the right person. 
            </Text>
            <Text color="#01A2E8" as={'span'}>
            {' '} Today. 
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
           Get connected with contractors in your area who specialize in what you need done.
          </Text>
          <Stack direction={{ base: 'column' }} spacing={2}>
           
            
            <Button backgroundColor="#01A2E8" color="white" w={{base: "auto" , lg: "240px"}} mt={{base: 2 , lg: 0}} _hover={{ bg: "#018ecb", textColor: "white" }}  onClick={() => navigate("/NeederEmailRegister")}>Get Started</Button>
            {isDesktop ? (null) : ( <Button backgroundColor="white" w={{base: "auto" , lg: "240px"}} onClick={() => navigate("/DoerEmailRegister")}    height="" _hover={{bg: "white"}} mt={1} >
               Want to become a Doer?&nbsp;<Text textColor="#01A2E8">Click here</Text>
              </Button>)}
            
            {/* <Button rounded={'full'}>How It Works</Button> */}
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Box marginLeft={{base: "12px", lg: "96px"}}>
        <Image
        alignContent="center"
        justifyContent="center"
        height={{base: "50vh", lg: "90vh"}}
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            "https://images.unsplash.com/photo-1632862378069-4ad0348cea4f?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
        />
        </Box>
        
      </Flex>
    </Stack>
  )
};

export default Hero;