import React from "react";
import { useState, useEffect, useRef } from "react";
import { useJobStore } from "../Chat/lib/jobsStore";
import { useUserStore } from "../Chat/lib/userStore";
import { useChatStore } from "../Chat/lib/chatStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Input,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  deleteDoc,
  snapshotEqual,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import { job, jobHiringState} from "../Chat/lib/jobsStore"

const OfferModal = () => {


    const { job, jobHiringState, setJobHiringState } = useJobStore() 


    const { currentUser } = useUserStore();
    const { chatId, user } = useChatStore()
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isOpenFlatRate,
      onOpen: onOpenFlatRate,
      onClose: onCloseFlatRate,
    } = useDisclosure();
  
    const {
      isOpen: isOpenSuccess,
      onOpen: onOpenSuccess,
      onClose: onCloseSuccess,
    } = useDisclosure();
    const {
      isOpen: isOpenOffer,
      onOpen: onOpenOffer,
      onClose: onCloseOffer,
    } = useDisclosure();
  
    useEffect(() => {
      if (job.isHourly === true) {
        //set hourly modal open
  
        onOpen();
      } else if (job.isFlatRate === true) {
        //setFlat rate modal open
  
        onOpenFlatRate();
      }
    }, [job]);

    
    const handleSendOfferAcceptedEmail = async () => {
      const response = await fetch(
      
        "https://emailapi-qi7k.onrender.com/sendOfferAcceptedEmail",
  
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: user.email}),
        }
      );
  
      const { data, error } = await response.json();
      console.log("Any issues?", error)
    }

console.log("what info do I have from current user?", currentUser)

    //brought in from previous set up

    const postInProgress = () => {
        // employer
    
        //convert to int

        handleSendOfferAcceptedEmail()

    
        setDoc(doc(db, "employers", user.uid, "Jobs In Progress", job.jobTitle), {
          employerID: job.employerID,
          jobTitle: job.jobTitle,
          jobID: job.jobID,
          isHourly: job.isHourly,
          channelId: job.channelId,
          category: job.category,
          // businessName: businessName,
          description: job.description,
          confirmedRate: jobHiringState.confirmedRate,
          city: job.city,
          lowerRate: job.lowerRate ? job.lowerRate : null,
          upperRate: job.upperRate ? job.upperRate : null,
          hiredApplicantFirstName: job.hiredApplicantFirstName,
          hiredApplicantLastName: job.hiredApplicantLastName,
          hiredApplicantProfilePicture: job.hiredApplicantProfilePicture,
          hasNewNotification: true,
          datePosted: job.datePosted,
          isOneTime: job.isOneTime,
          streetAddress: job.streetAddress,
          state: job.state,
          zipCode: job.zipCode,
          requirements: job.requirements,
          requirements2: job.requirements2,
          requirements3: job.requirements3,
          niceToHave: job.niceToHave,
          locationLat: job.locationLat,
          locationLng: job.locationLng,
          hiredApplicant: currentUser.uid,
          hiredApplicantFirstName: currentUser.firstName,
          hiredApplicantLastName: currentUser.lastName,
          hiredApplicantProfilePicture: currentUser.profilePictureResponse,
          jobCompleteApplicant: false,
          jobCompleteEmployer: false,
          employerFirstName: job.employerFirstName,
        })
          .then(() => {
            //all good
            console.log("data submitted employer");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "post in progress");
          });
    
        // applicant
    
        deleteDoc(doc(db, "users", currentUser.uid, "Appled", job.jobTitle), {})
          .then(() => {
            //all good
            console.log("data deleted user applied");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "post in progress");
          });
    
        setDoc(doc(db, "users", currentUser.uid, "Jobs In Progress", job.jobTitle), {
          firstHiredNotification: true,
          employerID: job.employerID,
          jobTitle: job.jobTitle,
          jobID: job.jobID,
          isHourly: job.isHourly,
          category: job.category,
          // businessName: businessName,
          channelId: job.channelId,
          description: job.description,
          city: job.city,
          confirmedRate: jobHiringState.confirmedRate,
          lowerRate: job.lowerRate ? job.lowerRate : null,
          upperRate: job.upperRate ? job.upperRate : null,
      
          isOneTime: job.isOneTime,
          streetAddress: job.streetAddress,
          state: job.state,
          zipCode: job.zipCode,
          requirements: job.requirements,
          requirements2: job.requirements2,
          requirements3: job.requirements3,
          niceToHave: job.niceToHave,
          locationLat: job.locationLat,
          locationLng: job.locationLng,
          hiredApplicant: currentUser.uid,
          jobCompleteApplicant: false,
          jobCompleteEmployer: false,
          employerFirstName: job.employerFirstName,
        })
          .then(() => {
            //all good
            console.log("data submitted applicant in progress");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "post in progress");
          });
      };

      const deletePostedEmployer = () => {
        deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", job.jobTitle))
          .then(() => {
            //all good
            console.log("removed from employers Posted Jobs");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "from delete posted employer");
          });
    
        // delete from user saved (if saved)
        deleteDoc(doc(db, "users", currentUser.uid, "Saved Jobs", job.jobID))
          .then(() => {
            //all good
            console.log("removed from employers Posted Jobs");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "from delete posted employer");
          });
    
        //delete from user Applied Jobs
        deleteDoc(doc(db, "users", currentUser.uid, "Applied", job.jobTitle))
          .then(() => {
            //all good
            console.log("removed from employers Posted Jobs");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "from delete posted employer");
          });
      };
    
      const deleteRequestEmployer = () => {
        deleteDoc(doc(db, "employers", user.uid, "Requests", job.jobID))
          .then(() => {
            //all good
            console.log("removed from needer Requests");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "from delete posted employer");
          });
    
        //delete from user Applied Jobs
        deleteDoc(doc(db, "users", currentUser.uid, "Requests", job.jobID))
          .then(() => {
            //all good
            console.log("removed from users Requests");
          })
          .catch((error) => {
            // no bueno
            console.log(error, "from delete posted employer");
          });
      };
    
      const chatNotifications = () => {
        //// uhh this code will remove the "do you want to hire this person" card in Messages
    
        updateDoc(doc(db, "Messages", job.jobID), {
          isHired: true,
        })
          .then(() => {
            console.log("all good");
            onOpenSuccess();
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const deleteFromMaps = () => {
        //needs to also delete from paid v Volunteer DB subsets.
    
        deleteDoc(doc(db, "Map Jobs", job.jobID))
          .then(() => {
            //all good
            console.log("removed from employers Posted Jobs");
            onOpenSuccess();
          })
          .catch((error) => {
            // no bueno
            console.log(error, "error from delete from Maps");
          });
      };
    
      const deleteFromJobs = () => {
      
          deleteDoc(doc(db, "Map Jobs Paid", job.jobID))
            .then(() => {
              //all good
              console.log("removed from employers Posted Jobs Paid");
            })
            .catch((error) => {
              // no bueno
              console.log(error, "error from delete from Maps");
            });
        
      };

      const updateJobState = () => {
        //update type of job,
        //mark hired true
        //set marked complete === false


        try {
       
          const userIDs = [currentUser.uid, user.uid];
    
          userIDs.forEach(async (id) => {
            const userChatsRef = doc(db, "User Messages", id);
            const userChatsSnapshot = await getDoc(userChatsRef);
    
            if (userChatsSnapshot.exists()) {
              const userChatsData = userChatsSnapshot.data();
    
              const chatIndex = userChatsData.chats.findIndex(
                (c) => c.chatId === chatId
              );
              userChatsData.chats[chatIndex].isMarkedCompleteDoer = false
              userChatsData.chats[chatIndex].jobType = "Jobs In Progress" 
              userChatsData.chats[chatIndex].isJobOffered = true;
              userChatsData.chats[chatIndex].isHired = true
              userChatsData.chats[chatIndex].isSeen =
                id === currentUser.id ? true : false;
              userChatsData.chats[chatIndex].updatedAt = Date.now();
    
              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              });

              setJobHiringState(userChatsData.chats)
            }
          });
        } catch (err) {
          console.log(err);
        }
   
      }

    const confirmJobAccept = () => {
        // hire code here.
        // post under in progress for employer and applicant
    
        postInProgress();
    
        //delete from Posted under employer
        if (jobHiringState.isRequest) {
          deleteRequestEmployer();
        } else {
          deletePostedEmployer();
          deleteFromMaps();
          deleteFromJobs();
        }
    
        //make notification in chat for both
    
        chatNotifications();


        updateJobState()


        onClose()
    
        //delete from global jobs/maps
    
        //delete from paid v volunteer db
    
        // deleteFromJobs();
      };

  return (
    <div>   <div>
    {" "}
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>her it is</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
         
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
       
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Modal isOpen={isOpenFlatRate} onClose={onCloseFlatRate} size="xl">
      <ModalOverlay />
      <ModalContent>
     
   
  <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0  sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h2 class="block text-xl sm:text-2xl font-semibold text-gray-800 ">Job Offer</h2>
          <div class="max-w-sm mx-auto">
            <p class="mt-2 text-sm text-gray-600 ">
              Review the details below and confirm or decline the offer
              
            </p>
          </div>
         
        </div>

        <div class="mt-2 sm:mt-10 ">

          <div class="flex gap-x-7 py-3 first:pt-0 last:pb-0">
          

            <div>
              <h3 class="font-semibold text-lg text-gray-800 ">
            {job.jobTitle}
              </h3>
             
            </div>
          </div>
  
          <div class="flex gap-x-7 py-1 first:pt-0 last:pb-0">
           

            <div>
              <h3 class="font-semibold text-gray-800 ">
                Job Decription:
              </h3>
              <p class="text-sm text-gray-500 ">
                {job.description}
              </p>
            </div>
          </div>
     
          <div class="flex gap-x-7 py-1 first:pt-0 last:pb-0">
          

            <div>
              <h3 class="font-semibold text-gray-800 ">
              Pay:
              </h3>
              <p class="text-sm text-gray-500 ">
               ${jobHiringState.confirmedRate} Total
              </p>
            </div>
          </div>
         
        </div>
      </div>

      <div class="flex justify-end items-center gap-x-2 p-4 sm:px-7 border-t ">
        <button type="button" onClick={() => onCloseFlatRate()}class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none " data-hs-overlay="#hs-notifications">
          Cancel
        </button>
        <button onClick={() => confirmJobAccept()} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none" href="#">
       Accept
        </button>
      </div>

    </div>
  </div>


      </ModalContent>
    </Modal>
    <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Success!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>You've accepted this job</Text>
          <Text>
            When you've completed this job, mark it as complete in your message tab to make sure you get paid!
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={() => onCloseSuccess()}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
   
  </div></div>
  )
}

export default OfferModal