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


const NewVisitModal = (props) => {
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
           
            <Text marginTop="16px">The easiest way to get started is to post your first job.</Text>
            <Text marginTop="8px">Once posted, contractors can apply to that job and you'll be able choose the one you want.</Text>
            <Text marginTop= "8px">If you'd like to browse our list of contractors, you can click the "Find A Pro" tab on the left hand side of your screen.</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button  backgroundColor="#01A2E8"
          color="white"
          _hover={{ bg: "#018ecb", textColor: "white" }} width="160px" onClick={() => navigate("/AddJobStart")}>
              Post my job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewVisitModal;
