import React, { useState, useEffect } from "react";




import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  Text
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";


const DoerFirstVisitModal = (props) => {
  console.log("passed props", props);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  const navigate = useNavigate();

  const [hasRun, setHasRun] = useState(false);

  //help loading map async codmitu https://github.com/Tintef/react-google-places-autocomplete/issues/342

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Heading size="md" marginTop="16px">
              Welcome to Fulfil!
            </Heading>
           
           
            
            <Text marginTop="16px">Update your profile to increase your chances of getting hired or contacted for work. </Text>
            <Text marginTop="8px">The more information you provide, the better!</Text>
            
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button  backgroundColor="#01A2E8"
          color="white"
          _hover={{ bg: "#018ecb", textColor: "white" }} width="160px" onClick={() => navigate("/UserProfile")}>
              Edit My Profile
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerFirstVisitModal;
