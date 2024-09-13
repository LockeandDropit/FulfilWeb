import React from 'react'
import { Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
useDisclosure,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
} from '@chakra-ui/react'
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from '../../../../firebaseConfig';

import { useState, useEffect } from 'react'
import { useUserStore } from '../../Chat/lib/userStore';

const ScreeningQuestions = ( props ) => {

    const jobTitle = props.props
    const jobID = props.jobID
    const {currentUser} = useUserStore()

    //make it sloppy first, then tighten up
    const [question1, setQuestion1] = useState(null)
    const [question2, setQuestion2] = useState(null)
    const [question3, setQuestion3] = useState(null)

    const [hasbeenOpened, setHasBeenOpened] = useState(false)
    useEffect(() => {   
        if (props && hasbeenOpened === false) {
            onOpen()
            setHasBeenOpened(true)
            console.log("props from questrions", props)
        }
    }, [props])

    const {
        isOpen: isOpen,
        onOpen: onOpen,
        onClose: onClose,
      } = useDisclosure();
      const {
        isOpen: isOpenErrorModal,
        onOpen: onOpenErrorModal,
        onClose: onCloseErrorModal,
      } = useDisclosure();

      const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
      } = useDisclosure();


      const addQuestions = () => {
        if (question1) {
            addQuestion1()
            if (question2) {
              addQuestion2()
              if (question3) {
                addQuestion3()
            }
          }
        } else {
          onOpenErrorModal()
        }    
        if (question2) {
            addQuestion2()
        }
       
        onClose()
        onOpenModal()
    
    }



    const addQuestion1 = () => {
        updateDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle), {
            hasScreeningQuestions: true
        })
        updateDoc(doc(db, "Map Jobs", jobID), {
            hasScreeningQuestions: true
          })
        setDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 1"), {
            question: question1,
          })
          setDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 1"), {
            question: question1,
          })
    }

    const addQuestion2 = () => {
        setDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 2"), {
            question: question2,
          })
                 setDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 2"), {
            question: question2,
          })


//onpen success modal
    }

    const addQuestion3 = () => {
        setDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 3"), {
            question: question3,
          })
                 setDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 3"), {
            question: question3,
          })

//onpen success modal
    }

  return (
  <>
  <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
    <DrawerHeader>Add Questions</DrawerHeader>
<DrawerBody>
    <div class="col-span-full">
          <label for="about" class="block  font-medium leading-6 text-gray-900">Question 1</label>
          <div class="mt-2">
            <textarea onChange={(e) => setQuestion1(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>
        <div class="col-span-full mt-4">
          <label for="about" class="block font-medium leading-6 text-gray-900">Question 2 (optional)</label>
          <div class="mt-2">
            <textarea onChange={(e) => setQuestion2(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>
        <div class="col-span-full mt-4">
          <label for="about" class="block  font-medium leading-6 text-gray-900">Question 3 (optional)</label>
          <div class="mt-2">
            <textarea onChange={(e) => setQuestion3(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>
       
        {/* <button class="flex flex-row block mt-3 ml-auto font-semibold leading-6 text-sky-500 mb-2 hover:text-sky-500 "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4 font-semibold mr-1 mt-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>Add another question 
</button> */}
      
    </DrawerBody>
        <DrawerFooter>
        <button onClick={() => addQuestions()} class="block ml-auto py-3 px-4  justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-md shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 ">Submit</button>
        </DrawerFooter>
        </DrawerContent>
  </Drawer>

  <Modal isOpen={isOpenModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">Your post is live.</p>

          </ModalBody>

          <ModalFooter>
         
            <button
              type="button"
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => onCloseModal()}
            >
              Continue
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenErrorModal} onClose={onCloseErrorModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">Your post is live.</p>

          </ModalBody>

          <ModalFooter>
         
            <button
              type="button"
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => onCloseErrorModal()}
            >
              Continue
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
        </>
  )
}

export default ScreeningQuestions