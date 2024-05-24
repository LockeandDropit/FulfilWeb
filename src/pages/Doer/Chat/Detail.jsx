import { useState, useEffect } from "react";
import React from "react";
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
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useJobStore } from "./lib/jobsStore";
import { useCloseDetail } from "./lib/closeDetail";



const Detail = (props) => {
  const [data, setData] = useState(null);

  const [jobTitle, setJobTitle] = useState(null);

  const [jobData, setJobData] = useState(null);
  const { currentUser } = useUserStore();
  const {job, jobHiringState} = useJobStore()

  const { setDetailClose, setDetailOpen } = useCloseDetail()

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setData(res.data());
      setJobTitle(res.data().jobTitle);
    });

    return () => {
      unSub();
    };
  }, [chatId]);


  useEffect(() => {
    setDetailOpen()
  }, [])

const handleClose = () => {
  setDetailClose()
}

console.log(job)


  return (
    <div className="flex flex-1">
      
      {job ? (
        
        <div class="w-full max-h-full flex flex-col border-l boredr-gray-300 bg-white rounded-lg pointer-events-auto  ">
          <div className=" ml-auto">
                 <button  onClick={() => handleClose()}class="mt-1 size-8  inline-flex justify-center items-center  rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none ">
                 <span class="sr-only">Close</span>
                                      <svg
                                        class="flex-shrink-0 size-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                      </svg>
                 </button>
                    </div>
          <div class="py-3 px-4 flex justify-between items-center  ">
            
            <div class="w-100 max-h-full   bg-white rounded-xl  ">
            <div className="w-full " >
            
                                    </div>
              <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
              
                <div class="p-x-4 space-y-2">
                  <div class="">
                    <div className=" w-full flex ">
                    <p class="font-semibold text-lg text-gray-800 ">
                      {job.jobTitle}
                    </p>
                 
                    </div>
                    {job.isHourly ? (
                      jobHiringState.isHired ? (  <p class="font-semibold text-sm text-gray-500  ">${jobHiringState.confirmedRate}/hr </p>) : (  <p class="font-semibold text-sm text-gray-500  ">${jobHiringState.lowerRate}/hr - ${jobHiringState.upperRate}/hr</p>)
                      
                    ) : (  <p class="font-semibold text-sm text-gray-500  ">${jobHiringState.confirmedRate} total</p>)

                    }
                    <p class="font-semibold text-sm text-gray-500  ">
                      {job.city}, Minnesota
                    </p>

                    <p class="font-semibold text-sm text-gray-500  ">
                      Posted {job.datePosted} 
                    </p>
                   

                    <div class=" flex-row  items-center  ">
              
                    </div>
                  </div>

                  <div class="">
                    <p class="font-semibold text-lg text-gray-800 ">
                      Description
                    </p>

                    <p class=" font-semibold text-md text-gray-500  ">
                      {job.description}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        
        </div>
      ) : null}
    </div>
  );
};

export default Detail;