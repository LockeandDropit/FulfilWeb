import React from 'react'
import { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Text
  } from '@chakra-ui/react'

const NoCategoryMatchModal = (  ) => {
    const { isOpen, onOpen, onClose } = useDisclosure()


    setTimeout(() => {
onOpen()
    }, 100)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Oops!</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
       <Text> Sorry! There are no jobs currently available in that category</Text>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
        
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default NoCategoryMatchModal