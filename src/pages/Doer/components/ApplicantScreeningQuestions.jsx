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
import { doc, updateDoc, collection, query, getDocs, setDoc, increment } from "firebase/firestore"; 
import { db } from '../../../firebaseConfig';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useUserStore } from '../Chat/lib/userStore';

const ApplicantScreeningQuestions = ( props ) => {

  const x = props.props

    const jobTitle = props.props.jobTitle
    const jobID = props.props.jobID
    const {currentUser} = useUserStore()
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true)

    //make it sloppy first, then tighten up
    const [question1, setQuestion1] = useState(null)
    const [question2, setQuestion2] = useState(null)
    const [question3, setQuestion3] = useState(null)

    const [answer1, setAnswer1] = useState(null)
    const [answer2, setAnswer2] = useState(null)
    const [answer3, setAnswer3] = useState(null)

    const [hasbeenOpened, setHasBeenOpened] = useState(false)

 

    useEffect(() => {
      
      // add back to conditional call hasbeenOpened === false
        if (props && hasbeenOpened === false) {
            onOpen()
            setHasBeenOpened(true)
            console.log("props from questrions", props.props)
            let questions = []
            const q = query(collection(db, "Map Jobs", props.props.jobID, "Screening Questions"));

            const fetchQuestions = async () => {
              const querySnapshot =  await getDocs(q);
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
              
                questions.push(doc.data().question)
              });
              setQuestion1(questions[0])
              setQuestion2(questions[1])
              setQuestion3(questions[2] ? questions[2] : null)
              setIsLoading(false)
            }

            fetchQuestions()
         
        }
    }, [props])

    const applyAndNavigate = () => {

    updateDoc(doc(db, "employers", x.employerID, "Posted Jobs", x.jobTitle), {
      hasNewApplicant: true,
    })
      .then(() => {
        //user info submitted to Job applicant file
      })
      .catch((error) => {
        //uh oh
      });

    setDoc(
      doc(
        db,
        "employers",
        x.employerID,
        "Posted Jobs",
        x.jobTitle,
        "Applicants",
        currentUser.uid
      ),
      {
        applicantID: currentUser.uid,
        isNewApplicant: true,
        dateApplied: dateApplied,
        answer1: answer1 ? answer1 : null,
        answer2: answer2 ? answer2 : null,
        answer3: answer3 ? answer3 : null,
      }
    )
      .then(() => {
        //user info submitted to Job applicant file
        // navigation.navigate("BottomUserTab");
      })
      .catch((error) => {
        //uh oh
      });

    const docRef = doc(
      db,
      "employers",
      x.employerID,
      "Posted Jobs",
      x.jobTitle
    );

    updateDoc(docRef, { totalApplicants: increment(1) });

    setDoc(doc(db, "users", currentUser.uid, "Applied", x.jobTitle), {
      requirements: x.requirements ? x.requirements : null,
      requirements2: x.requirements2 ? x.requirements2 : null,
      requirements3: x.requirements3 ? x.requirements3 : null,
      isFlatRate: x.isFlatRate ? x.isFlatRate : null,
      niceToHave: x.niceToHave ? x.niceToHave : null,
      datePosted: x.datePosted ? x.datePosted : null,

      jobID: x.jobID,
      jobTitle: x.jobTitle ? x.jobTitle : null,
      hourlyRate: x.hourlyRate ? x.hourlyRate : null,
      streetAddress: x.streetAddress ? x.streetAddress : null,
      city: x.city ? x.city : null,
      state: x.state ? x.state : null,
      zipCode: x.zipCode ? x.zipCode : null,
      description: x.description ? x.description : null,
      addressNumber: x.addressNumber ? x.addressNumber : null,
      addressName: x.addressName ? x.addressName : null,
      lowerRate: x.lowerRate ? x.lowerRate : null,
      upperRate: x.upperRate ? x.upperRate : null,
      addressSuffix: x.addressSuffix ? x.addressSuffix : null,
      locationLat: x.locationLat ? x.locationLat : null,
      locationLng: x.locationLng ? x.locationLng : null,
      businessName: x.businessName ? x.businessName : null,
      employerID: x.employerID ? x.employerID : null,
      employerFirstName: x.employerFirstName ? x.employerFirstName : null,
      flatRate: x.flatRate ? x.flatRate : null,
      isHourly: x.isHourly ? x.isHourly : null,
      category: x.category ? x.category : null,
      isOneTime: x.isOneTime ? x.isOneTime : null,
      lowerCaseJobTitle: x.lowerCaseJobTitle ? x.lowerCaseJobTitle : null,
    })
      .then(() => {
        onClose()
  onOpenModal()
      })
      .catch((error) => {
        //uh oh
      });

    handleSendEmail(x);
    }


    
  const handleSendEmail = async (x) => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendNewApplicantEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: x.employerEmail }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
  };

  const [dateApplied, setDateApplied] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=3 mohshbool & Samuel Meddows
    let initialDate = new Date();
    var dd = String(initialDate.getDate()).padStart(2, "0");
    var mm = String(initialDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + "/" + dd + "/" + yyyy;

    setDateApplied(today);
  }, []);
  
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





// const addAnswers = () => {
//   setDoc(doc(db, "employers", props.props.employerID, "Posted Jobs", jobTitle, "Applicants", currentUser.uid ), {
//       answer1: answer1 ? answer1 : null,
//       answer2: answer2 ? answer2 : null,
//       answer3: answer3 ? answer3 : null,
//     })
// }



//answers
const [answerToQuestion1, setAnswerToQuestion1] = useState(null)
const [answerToQuestion2, setAnswerToQuestion2] = useState(null)
const [answerToQuestion3, setAnswerToQuestion3] = useState(null)

  return (
  <>
  <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
        <DrawerOverlay />
        <DrawerContent>
    <DrawerHeader>Application Questions</DrawerHeader>
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
    <div class="col-span-full mt-6">
          <label for="about" class="block text-lg font-medium leading-6 text-gray-900">{question1}</label>
        
          <div class="mt-3">
            <textarea onChange={(e) => setAnswerToQuestion1(e.target.value)} id="about" name="about" rows="6" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>  
{question2 ? (
   <div class="col-span-full mt-6">
   <label for="about" class="block text-lg font-medium leading-6 text-gray-900">{question2}</label>
   <div class="mt-3">
     <textarea onChange={(e) => setAnswerToQuestion2(e.target.value)} id="about" name="about" rows="6" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
   </div>
 </div>
) : (null)}
       
       {question3 ? (
   <div class="col-span-full mt-6">
   <label for="about" class="block text-lg font-medium leading-6 text-gray-900">{question3}</label>
   <div class="mt-3">
     <textarea onChange={(e) => setAnswerToQuestion3(e.target.value)} id="about" name="about" rows="6" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"></textarea>
   </div>
 </div>
) : (null)}</>)}



       
        {/* <button class="flex flex-row block mt-3 ml-auto font-semibold leading-6 text-sky-500 mb-2 hover:text-sky-500 "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4 font-semibold mr-1 mt-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>Add another question 
</button> */}
      
    </DrawerBody>
        <DrawerFooter>
          <div className="ml-auto flex flex-row ">
        <button onClick={() => onClose()} class="block ml-auto mr-2 py-3 px-4  justify-center items-center gap-x-2 text-start bg-white hover:text=red-700 text-red-600 font-medium rounded-md shadow-sm align-middle hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-300 ">Cancel</button>
        <button onClick={() => applyAndNavigate()} class="block ml-auto py-3 px-4  justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-md shadow-sm align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 ">Finish</button>
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
            <p className="text-gray-800 text-base">Your application has been submited.</p>
            

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

export default ApplicantScreeningQuestions