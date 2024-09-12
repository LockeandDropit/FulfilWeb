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
import { doc, updateDoc, collection, query, getDocs } from "firebase/firestore"; 
import { db } from '../../../../firebaseConfig';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useUserStore } from '../../Chat/lib/userStore';

const EditScreeningQuestions = ( props ) => {

    const jobTitle = props.props.jobTitle
    const jobID = props.props.jobID
    const {currentUser} = useUserStore()
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true)

    //make it sloppy first, then tighten up
    const [question1, setQuestion1] = useState(null)
    const [question2, setQuestion2] = useState(null)
    const [question3, setQuestion3] = useState(null)

    const [updatedQuestion1, setUpdatedQuestion1] = useState(null)
    const [updatedQuestion2, setUpdatedQuestion2] = useState(null)
    const [updatedQuestion3, setUpdatedQuestion3] = useState(null)

    const [hasbeenOpened, setHasBeenOpened] = useState(false)

 

    useEffect(() => {   
        if (props && hasbeenOpened === false) {
            onOpen()
            setHasBeenOpened(true)
            console.log("props from questrions", props.props)
            let questions = []
            const q = query(collection(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions"));

            const fetchQuestions = async () => {
              const querySnapshot =  await getDocs(q);
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log("all results", doc.data());
                questions.push(doc.data().question)
              });
  
              setQuestion1(questions[0])
              setQuestion2(questions[1])
              setQuestion3(questions[2] ? questions[2] : null)
              setIsLoading(false)
           
            }

           fetchQuestions();
         
        }
    }, [props])


    console.log("q1", question1)

    const {
        isOpen: isOpen,
        onOpen: onOpen,
        onClose: onClose,
      } = useDisclosure();

      const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
      } = useDisclosure();

      const handleCloseSuccessModal = () => {
        onClose()
     navigate("/JobDetails", { state: { editReset: true } });
       
      }

//     const addQuestions = () => {
//         updateDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle), {
//             question1: updatedQuestion1? updatedQuestion1 : question1,
//             question2: updatedQuestion2? updatedQuestion2 : question2,
//             question3: updatedQuestion3? updatedQuestion3 : question3,
//           })

//        handleCloseSuccessModal()
//           onOpenModal()

// //onpen success modal
//     }

const addQuestions = () => {
  if (question1) {
      addQuestion1()
  }    
  if (question2) {
      addQuestion2()
  }
  if (question3) {
      addQuestion3()
  }
  onClose()
  onOpenModal()

}



const addQuestion1 = () => {
  updateDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 1"), {
      question: updatedQuestion1 ? updatedQuestion1 : question1,
    })
    updateDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 1"), {
      question: updatedQuestion1 ? updatedQuestion1 : question1,
    })
}

const addQuestion2 = () => {
  updateDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 2"), {
      question: updatedQuestion2 ? updatedQuestion2 : question2,
    })
    updateDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 2"), {
      question: updatedQuestion2 ? updatedQuestion2 : question2,
    })
}

const addQuestion3 = () => {
  updateDoc(doc(db, "employers", currentUser.uid, "Posted Jobs", jobTitle, "Screening Questions", "Question 3"), {
      question: updatedQuestion3 ? updatedQuestion3 : question3,
    })
    updateDoc(doc(db, "Map Jobs", jobID, "Screening Questions", "Question 3"), {
      question: updatedQuestion3 ? updatedQuestion3 : question3,
    })
}




  return (
  <>
  <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
    <DrawerHeader>Edit Screening questions</DrawerHeader>
<DrawerBody>

{isLoading ? (
  <div class="flex animate-pulse">
  <div class="ms-4 mt-2 w-full">
   
    <ul class="mt-5 space-y-3">
      <li class="w-1/4 h-4 bg-gray-200 rounded-full "></li>
      <li class="w-full h-16 bg-gray-200 rounded-lg "></li>
      <li class="w-1/4 h-4 bg-gray-200 rounded-full "></li>
      <li class="w-full h-16 bg-gray-200 rounded-lg "></li>
      <li class="w-1/4 h-4 bg-gray-200 rounded-full "></li>
      <li class="w-full h-16 bg-gray-200 rounded-;g "></li>
    </ul>
  </div>
</div>
) : (<>
    <div class="col-span-full">
          <label for="about" class="block  font-medium leading-6 text-gray-900">Question 1</label>
        
          <div class="mt-2">
            <textarea onChange={(e) => setUpdatedQuestion1(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6">{question1 ? question1 : null}</textarea>
          </div>
        </div>
        {/* <label for="about" class="block mt-2 leading-6 text-gray-900">Select the format of the applicant's answer to this question</label>
        <div class="flex mt-1">
        
  <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  id="hs-default-checkbox" />
  <label for="hs-default-checkbox" class="text-sm text-gray-800 ms-3 ">Free text</label>
</div>

<div class="flex mt-1">
  <input type="checkbox" class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-checked-checkbox"  />
  <label for="hs-checked-checkbox" class="text-sm text-gray-800 ms-3 ">Yes/No</label>
</div> */}

        <div class="col-span-full mt-4">
          <label for="about" class="block  font-medium leading-6 text-gray-900">Question 2 (optional)</label>
          <div class="mt-2">
            <textarea onChange={(e) => setUpdatedQuestion2(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6">{question2 ? question2 : null}</textarea>
          </div>
        </div>
        <div class="col-span-full mt-4">
          <label for="about" class="block font-medium leading-6 text-gray-900">Question 3 (optional)</label>
          <div class="mt-2">
            <textarea onChange={(e) => setUpdatedQuestion3(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6">{question3 ? question3 : null}</textarea>
          </div>
        </div></>)}



       
        {/* <button class="flex flex-row block mt-3 ml-auto font-semibold leading-6 text-sky-500 mb-2 hover:text-sky-500 "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4 font-semibold mr-1 mt-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>Add another question 
</button> */}
      
    </DrawerBody>
        <DrawerFooter>
          <div className="ml-auto flex flex-row ">
        <button onClick={() => onClose()} class="block ml-auto mr-2 py-3 px-4  justify-center items-center gap-x-2 text-start bg-white hover:text=red-700 text-red-600 font-medium rounded-md shadow-sm align-middle hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-300 ">Cancel</button>
        <button onClick={() => addQuestions()} class="block ml-auto py-3 px-4  justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-md shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 ">Update</button>
        </div>
        </DrawerFooter>
        </DrawerContent>
  </Drawer>

  <Modal isOpen={isOpenModal} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">Your screening questions have been updated.</p>
            <p className="text-gray-800 text-base">You'll see your updates in a little bit.</p>

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
  
        </>
  )
}

export default EditScreeningQuestions