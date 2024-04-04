import React, { useState, useEffect } from "react";
import NeederHeader from "../NeederHeader";
import NeederDashboard from "../NeederDashboard";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
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
  deleteField,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CheckIcon,
  CloseIcon,
  EditIcon,
} from "@chakra-ui/react";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

const NeederPaymentComplete = () => {

    const [user, setUser] = useState(null);
    const [userID, setUserID] = useState(null);
    const [hasRun, setHasRun] = useState(false);
    useEffect(() => {
      if (hasRun === false) {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setUserID(currentUser.uid);
          console.log(currentUser.uid);
        });
        setHasRun(true);
      } else {
      }
    }, []);

   const [status, setStatus] = useState(null)
   const [customerEmail ,setCustomerEmail] = useState(null)
     
    
        useEffect(() => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const sessionId = urlParams.get('session_id');
        
            fetch(`/session-status?session_id=${sessionId}`)
              .then((res) => res.json())
              .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
              });
          }, []);


//     const [paymentId, setPaymentId] = useState(null);
//     const [paymentComplete, setPaymentComplete] = useState(null);

//     const paymentInfo = {paymentId: paymentId}

    
// //get all IN REVIEW jobs

// const [jobsInReview, setJobsInReview] = useState(null)


// useEffect(() => {
//  if (user !== null) {
  
//   const q = query(collection(db, "employers", user.uid, "In Review"));
//   onSnapshot(q, (snapshot) => {
//     let results = [];
//     snapshot.docs.forEach((doc) => {
//       //review what thiss does
//       results.push({ ...doc.data(), id: doc.id });
//     });
//     if (!results || !results.length) {
//       setJobsInReview(0);
//     } else {
//       setJobsInReview(results);
//     }
//   });
// } 
//   else {

//  }


// }, [user])





// //check to see if any have paymentStartedPending === true 

// const [activeJob, setActiveJob] = useState(null)

// useEffect(() => {

//   const activePayment = []

// if (jobsInReview !== 0 && jobsInReview !== null) {
//   jobsInReview.map((jobsInReview) => {
//     console.log("???? ",jobsInReview.paymentStartedPending)
//     if (jobsInReview.paymentStartedPending === true) {
//       activePayment.push(jobsInReview)
//     } 
//     else {

//     }
//   })
//   if (!activePayment || !activePayment.length) {
//     // setActiveJob(0);
//   } else {
//     setActiveJob(activePayment);
//   }
// } else {

// }
// console.log("activepppayment",activePayment)
// }, [jobsInReview])


// const [isRunning, setIsRunning] = useState(true)

// useEffect(() => {
 
//   if (activeJob !== null && isRunning === true ) {
//     setIsRunning(false)
//     console.log("is running", isRunning)
//     console.log("active job id", activeJob[0].paymentId)
//     setPaymentId(activeJob[0].paymentId)
   


//   } else {

//   }


//   }, [activeJob])
 

//     //fixed memory leak with interval ID structure from Black Mathhttps://stackoverflow.com/questions/64406295/clearinterval-not-stopping-my-counter-in-useeffect
//     let intervalID 
   
   
//     useEffect(() => {
//        if (paymentId !== null) {
//        intervalID = setInterval( async () => {
//          console.log("payment id ", paymentId)
         
//          const response = await fetch(
//            "http://192.168.0.9:3000/check-payment-status",
//         //    "https://fulfil-api.onrender.com/check-payment-status",
//            {
//              method: "POST",
//              headers: {
//                Accept: "application/json",
//                "Content-Type": "application/json",
//              },
     
//              body: JSON.stringify(paymentInfo)
//            }
//          );
     
//          const { session } = await response.json();
     
//          console.log(session.payment_status);
//          setPaymentComplete(session.payment_status)
//        }, 1000);
   
   
//          return () => clearInterval(intervalID)
      
     
     
//      } else {

//      }
    
//      }, [paymentId])
   
   
   
   
//      useEffect(() => {
//        if (paymentId !== null && paymentComplete == "paid") {
//          setIsLoading(true)
//         //    moveAllData()
//            checkData()
//            setTimeout(() => {
//              alert("Payment Successful!")
//              setIsLoading(false)
        
//            }, 2000)
           
       
//        } else {
//          console.log("hello", paymentId, paymentComplete)
//        }
//      }, [paymentId, paymentComplete])

//      const [confirmedPrice, setConfirmedPrice] = useState(null);
//      const [confirmedPriceUI, setConfirmedPriceUI] = useState(null)
//      useEffect(() => {
//         if (user != null) {
//           if (activeJob[0].isHourly == true) {
//             const docRef = doc(db, "employers", user.uid, "In Review", activeJob[0].jobTitle);
    
//             getDoc(docRef).then((snapshot) => {
           
//               setConfirmedPrice(
//                 snapshot.data().confirmedRate * 100 * snapshot.data().confirmHours
//               );
//             });
//           } else {
//             //flat rate code goes here
    
//             const docRef = doc(db, "employers", user.uid, "In Review", activeJob[0].jobTitle);
    
//             getDoc(docRef).then((snapshot) => {
            
//               setConfirmedPrice(snapshot.data().confirmedRate * 100);
//             });
//           }
//         } else {
      
//         }
//       }, [user, activeJob]);

//      useEffect(() => {
//    if (confirmedPrice !== null) {
//    setConfirmedPriceUI(confirmedPrice *.01)
//    } else{

//    }
//      }, [confirmedPrice])
     
//   const checkData = () => {
//     console.log(
//         activeJob,
//       "employerID", user.uid,
//       "jobTitle", activeJob[0].jobTitle,
//       "jobID", activeJob[0].jobID,
//      " confirmedRate", confirmedRate,
//       "confirmHours", confirmHours,
//      " totalPay", confirmedPriceUI,
//      " isHourly", activeJob[0].isHourly,
//      " confirmedRate", confirmedRate,
//      " businessName", businessName,
//      " description", description,
//      " city", city,
//      " lowerRate", lowerRate,
//       "upperRate", upperRate,
//      " isVolunteer", isVolunteer,
//      " isOneTime", isOneTime,
//      " streetAddress", streetAddress,
//       "state", state,
//       "zipCode", zipCode,
//       "requirements ",requirements,
//       "requirements2", requirements2,
//       "requirements3", requirements3,
//       "niceToHave", niceToHave,
//       // locationLat: locationLat,
//       // locationLng: locationLng,
//       "hiredApplicant", hiredApplicantID,
     
//     )
//   }
//   const [requirements, setRequirements] = useState(null);
//   const [requirements2, setRequirements2] = useState(null);
//   const [requirements3, setRequirements3] = useState(null);
//   const [niceToHave, setNiceToHave] = useState(null);
//   const [streetAddress, setStreetAddress] = useState(null);
//   const [city, setCity] = useState(null);
//   const [state, setState] = useState(null);
//   const [zipCode, setZipCode] = useState(null);
//   const [description, setDescription] = useState(null);
//   const [lowerRate, setLowerRate] = useState(null);
//   const [upperRate, setUpperRate] = useState(null);
//   const [businessName, setBusinessName] = useState(null);
//   const [isOneTime, setIsOneTime] = useState(null);
//   const [isVolunteer, setIsVolunteer] = useState(null);
//   const [confirmedRate, setConfirmedRate] = useState(null);
//   const [confirmHours, setConfirmHours] = useState(null);
//   const [employerID, setEmployerID] = useState(null)
//   const [isFlatRate, setIsFlatRate] = useState(null)
//   const [currentJob, setCurrentJob] = useState(null)
//   const [totalPay, setTotalPay] = useState(null)
//   const [hiredApplicantID, setHiredApplicantID] = useState(null)


//   useEffect(() => {
//     if (user != null && activeJob !== null) {
//       const docRef = doc(db, "employers", user.uid, "In Review", activeJob[0].jobTitle);

//       getDoc(docRef).then((snapshot) => {
//         console.log("heyy", snapshot.data());
//         setConfirmHours(snapshot.data().confirmHours);
//         setConfirmedRate(snapshot.data().confirmedRate);
//         setLowerRate(snapshot.data().lowerRate);
//         setUpperRate(snapshot.data().upperRate);
//         setCity(snapshot.data().city);
//         // setIsHourly(snapshot.data().isHourly);
//         setEmployerID(snapshot.data().employerID);
//         setDescription(snapshot.data().description);
//         setZipCode(snapshot.data().zipCode);
//         setCurrentJob(snapshot.data());
//         setState(snapshot.data().state);
//         setBusinessName(snapshot.data().businessName);
//         setStreetAddress(snapshot.data().streetAddress);
//         setRequirements(snapshot.data().requirements);
//         setBusinessName(snapshot.data().businessName);
//         setNiceToHave(snapshot.data().niceToHave);
//         setRequirements2(snapshot.data().requirements2);
//         setRequirements3(snapshot.data().requirements3);
//         setIsOneTime(snapshot.data().isOneTime);
//         setIsVolunteer(snapshot.data().IsVolunteer);
//         setHiredApplicantID(snapshot.data().hiredApplicant)
//       });
//     } else {
//       console.log("oops!");
//     }
//   }, [user]);


//   useEffect(() => {
//     if (user != null && activeJob) {
//       const docRef = doc(db, "All Jobs", activeJob[0].jobID);

//       getDoc(docRef).then((snapshot) => {
//         console.log(snapshot.data());
//         setIsVolunteer(snapshot.data().isVolunteer)
//         // setIsHourly(snapshot.data().isHourly)
//         setIsFlatRate(snapshot.data().isFlatRate)
//       });
//     } else {
//       console.log("oops!");
//     }
//   }, [user]);


//   useEffect(() => {
//     if (confirmedRate !== null && confirmHours !== null) {
//       setTotalPay(confirmedRate * confirmHours);
//     } else {
      
//     }

//     console.log(totalPay);
//   }, [confirmedRate, confirmHours]);


    //  const moveAllData = () => {
    //     //this was all taken from ReviewWorker (in case something doesnt work and it needs to be moved back)
    
     
    //      //delete from In Review
    //      deleteDoc(doc(db, "employers", user.uid, "In Review", jobTitle))
    //      .then(() => {
    //        //all good
    //        console.log("removed from users saved Jobs");
    //      })
    //      .catch((error) => {
    //        // no bueno
    //        console.log(error);
    //      });
    
    //    deleteDoc(doc(db, "users", hiredApplicantID, "In Review", jobTitle))
    //      .then(() => {
    //        //all good
    //        console.log("removed from users db");
    //      })
    //      .catch((error) => {
    //        // no bueno
    //        console.log(error);
    //      });
    
    //    //add to Jobs Completed
    
    //    //add to Jobs Completed
    //    setDoc(doc(db, "users", hiredApplicantID, "Past Jobs", jobTitle), {
    //      employerID: user.uid,
    //      jobTitle: jobTitle,
    //      jobID: jobID,
    //      confirmedRate: confirmedRate,
    //      paymentComplete: paymentComplete,
    //      dateCompleted: dateCompleted,
    //      confirmHours: confirmHours,
    //      totalPay: confirmedPriceUI,
    //      isHourly: isHourly,
    //      confirmedRate: confirmedRate,
    //      paymentId: paymentId,
    //     //  businessName: businessName,
    //      description: description,
    //      city: city,
    //      lowerRate: lowerRate,
    //      upperRate: upperRate,
    //      isVolunteer: isVolunteer,
    //      isOneTime: isOneTime,
    //      streetAddress: streetAddress,
    //      state: state,
    //      zipCode: zipCode,
    //      requirements: requirements,
    //      requirements2: requirements2,
    //      requirements3: requirements3,
    //      niceToHave: niceToHave,
    //      // locationLat: locationLat,
    //      // locationLng: locationLng,
    //      hiredApplicant: hiredApplicantID,
    //      jobCompleteApplicant: true,
    //      jobCompleteEmployer: false,
    //    })
    //      .then(() => {
    //        console.log("moved to completed for user");
    //      })
    //      .catch((error) => {
    //        console.log(error);
    //      });
    
    //    setDoc(doc(db, "employers", user.uid, "Past Jobs", jobTitle), {
    //      employerID: user.uid,
    //      jobTitle: jobTitle,
    //      jobID: jobID,
    //      confirmedRate: confirmedRate,
    //      paymentComplete: paymentComplete,
    //      dateCompleted: dateCompleted,
    //      confirmHours: confirmHours,
    //     paymentId: paymentId,
    //      totalPay: confirmedPriceUI,
    //      isHourly: isHourly,
    //     //  businessName: businessName,
    //      description: description,
    //      city: city,
    //      lowerRate: lowerRate,
    //      upperRate: upperRate,
    //      isVolunteer: isVolunteer,
    //      isOneTime: isOneTime,
    //      streetAddress: streetAddress,
    //      state: state,
    //      zipCode: zipCode,
    //      requirements: requirements,
    //      requirements2: requirements2,
    //      requirements3: requirements3,
    //      niceToHave: niceToHave,
    //      // locationLat: locationLat,
    //      // locationLng: locationLng,
    //      hiredApplicant: hiredApplicantID,
    //      jobCompleteApplicant: true,
    //      jobCompleteEmployer: false,
       
    //    })
    //      .then(() => {
    //        console.log("moved to completed for Employer");
         
    //      })
    //      .catch((error) => {
    //        console.log(error);
    //      });
    //   }
  const [isLoading, setIsLoading] = useState(false);

  

  if (isLoading === true) {
    return (
      <>
        <NeederHeader />
        <Box paddingTop="4" paddingRight="72" height="90vh">
          <NeederDashboard />
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </Box>
      </>
    );
  }
  return (
    <>
      <NeederHeader />
      <Box paddingTop="4" paddingRight="72" height="90vh">
        <Flex>
          <NeederDashboard />

          <Box
            width="60vw"
            // alignContent="center"
            // justifyContent="center"
            // display="flex"
            // alignItems="baseline"
            borderColor="#e4e4e4"
            backgroundColor="white"
            height="800px"
            boxShadow="sm"
            rounded="md"
            padding="4"
            overflowY="scroll"
            marginLeft="48"
            marginRight="16"
            //   overflowY="scroll"
          >
            <Center flexDirection="column">
              <Flex>
                <Heading size="lg" marginTop="16px" marginRight="545px">
                  Payment History
                </Heading>
           
              </Flex>
            </Center>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default NeederPaymentComplete;
