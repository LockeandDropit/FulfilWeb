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
const Detail = (props) => {
  const [data, setData] = useState(null);

  const [jobTitle, setJobTitle] = useState(null);

  const [jobData, setJobData] = useState(null);
  const { currentUser } = useUserStore();

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
    if (jobTitle) {
      getData();
    }
  }, [jobTitle]);

  const getData = async () => {
    const docRef = doc(
      db,
      "employers",
      currentUser.uid,
      "Posted Jobs",
      jobTitle
    );

    await getDoc(docRef).then((snapshot) => {
      setJobData(snapshot.data());
      console.log("is this working", snapshot.data());
    });
  };


  useEffect(() => {
    let initialDate = new Date()
    var dd = String(initialDate.getDate()).padStart(2, '0');
    var mm = String(initialDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + '/' + dd + '/' + yyyy;


    console.log(today)
  }, [])

  return (
    <div className="flex flex-1">
      {jobData ? (
        <div class="w-full max-h-full flex flex-col border-l boredr-gray-300 bg-white rounded-lg pointer-events-auto  ">
          <div class="py-3 px-4 flex justify-between items-center  ">
            <div class="w-100 max-h-full   bg-white rounded-xl  ">
              <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                <div class="p-4 space-y-2">
                  <div class="">
                    <p class="font-semibold text-lg text-gray-800 ">
                      {jobData.jobTitle}
                    </p>
                    {jobData.isHourly ? (
                        <p class="font-semibold text-sm text-gray-500  ">${jobData.lowerRate}/hr - ${jobData.upperRate}/hr</p>
                    ) : (  <p class="font-semibold text-sm text-gray-500  ">${jobData.flatRate} total</p>)

                    }
                    <p class="font-semibold text-sm text-gray-500  ">
                      {jobData.city}, Minnesota
                    </p>

                    <p class="font-semibold text-sm text-gray-500  ">
                      Posted {jobData.datePosted} 
                    </p>
                   

                    <div class=" flex-row  items-center  ">
              
                    </div>
                  </div>

                  <div class="">
                    <p class="font-semibold text-lg text-gray-800 ">
                      Description
                    </p>

                    <p class=" font-semibold text-md text-gray-500  ">
                      {jobData.description}
                    </p>
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
      ) : null}
    </div>
  );
};

export default Detail;
