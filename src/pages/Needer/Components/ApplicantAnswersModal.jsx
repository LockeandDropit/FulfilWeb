import React from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
    doc,
    getDoc,
    query,
    collection,
  } from "firebase/firestore";
  import { useUserStore } from "../Chat/lib/userStore";
import { db } from "../../../firebaseConfig";


const ApplicantAnswersModal = ({ applicant, job, questions}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {currentUser} = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
const [hasRun, setHasRun] = useState(false)

useEffect(() => {
 if (hasRun === false) {
    setHasRun(true)
    onOpen()
 }
}, [])

  //call for data here

  console.log(applicant, job, questions)

  const [answers, setAnswers] = useState([])

  const [hasbeenOpened, setHasBeenOpened] = useState(false)

 

  useEffect(() => {   
      if ( hasbeenOpened === false) {
          setHasBeenOpened(true)
          let answers = []

            const docRef = doc(db, "employers", currentUser.uid, "Posted Jobs", job.jobTitle, "Applicants", applicant.uid );

          const fetchAnswers = async () => {

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("here", docSnap.data().answer1)
              if (docSnap.data().answer1) {
                answers.push(docSnap.data().answer1)
              }
              if (docSnap.data().answer2) {
                answers.push(docSnap.data().answer2)
              }
              if (docSnap.data().answer3) {
                answers.push(docSnap.data().answer3)
              }

            } else {
              // docSnap.data() will be undefined in this case
              console.log("No such document!");

            
         
          }
           setIsLoading(false)
           setAnswers(answers)}

          fetchAnswers()
       
      }
  }, [])



  console.log("a", answers)


  return (
    <>
      {isLoading ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Screening Question Answers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

        {/* <p className="font-medium text-gray-800">{questions[0]}</p>
        <p>{answers[0]}</p> */}
                
            </ModalBody>

            <ModalFooter>
              <button></button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Screening Question Answers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <p className="text-lg font-medium text-gray-800">{questions[0]}</p>
            <p>{answers[0]}</p>
            <p className="text-lg mt-2 font-medium text-gray-800">{questions[1]}</p>
            <p>{answers[1]}</p>
            <p className="text-lg mt-2 font-medium text-gray-800">{questions[2]}</p>
            <p>{answers[2]}</p>
            </ModalBody>

            <ModalFooter>
              <button></button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ApplicantAnswersModal;
