import {useState, useEffect}  from 'react'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { useChatStore } from "./lib/chatStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
const Detail = (props) => {

  const [data, setData] = useState(null)
  const [userID, setUserID] = useState();
  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [addressNumber, setAddressNumber] = useState(null);
  const [addressName, setAddressName] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [addressSuffix, setAddressSuffix] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [employerID, setEmployerID] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [flatRate, setFlatRate] = useState(null);
  const [isFlatRate, setIsFlatRate] = useState(null)
  const [isHourly, setIsHourly] = useState(null)
  const [jobID, setJobID] = useState(null)
  const [jobData, setJobData] = useState(null)


  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
  useChatStore();
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setData(res.data());
      console.log(res.data())
      setJobTitle(res.data().jobTitle)
    });

    return () => {
      unSub();
    };
  }, [chatId]);



  useEffect(() => {
    if (jobTitle) {
      getData()

      
    }
  }, [jobTitle])



  const getData = async () => {
    const docRef = doc(
      db,
      "employers",
      user.uid,
      "Posted Jobs",
      jobTitle
    );

    await getDoc(docRef).then((snapshot) => {
      setJobData(snapshot.data())
      console.log(snapshot.data())
    })

  }
  console.log("details", jobData)
  return (

    <div className="flex flex-1">

{jobData ? (
    <div class="w-full max-h-full flex flex-col  bg-white rounded-lg pointer-events-auto  ">
    <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 space-y-2">
                                      <div class="">
                                        <div class="py-3  flex-column  items-center  ">
                                          <label
                                            for="hs-pro-dactmt"
                                            class="block mb-2 text-xl font-medium text-gray-800 "
                                          >
                                         {jobData.jobTitle}
                                          </label>
                                          <p>{jobData.city} Minnesota</p>
                                        </div>

                                        <div class=" flex-row  items-center  ">
                                      
                                            {/* <div className="flex flex-row items-center">
                                              <p>
                                               
                                                Offer: $
                                              </p>
                                            </div> */}
                                       
                                        </div>
                                      </div>

                                      <div class="">
                                        <label
                                          for="dactmi"
                                          class=" text-lg font-medium text-gray-800 "
                                        >
                                          Description
                                        </label>

                                        <p  class=" text-md  ">{jobData.description}</p>
                                      </div>

                                      {/* <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          Applicants
                                        </label>
                                        
                                      </div> */}
                                    </div>

                                 
                                  </div>
                                </div>
                              </div>
    </div>
    ) : (null)}
  </div>

  )
}

export default Detail