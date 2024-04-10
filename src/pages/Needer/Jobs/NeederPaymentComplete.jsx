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
import { useNavigate } from "react-router-dom";
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

  
    const navigate = useNavigate();

    const [requirements, setRequirements] = useState(null);
    const [requirements2, setRequirements2] = useState(null);
    const [requirements3, setRequirements3] = useState(null);
    const [niceToHave, setNiceToHave] = useState(null);
    const [streetAddress, setStreetAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    const [zipCode, setZipCode] = useState(null);
    const [description, setDescription] = useState(null);
    const [lowerRate, setLowerRate] = useState(null);
    const [upperRate, setUpperRate] = useState(null);
    const [businessName, setBusinessName] = useState(null);
    const [isOneTime, setIsOneTime] = useState(null);
    const [isVolunteer, setIsVolunteer] = useState(null);
    const [confirmedRate, setConfirmedRate] = useState(null);
    const [isHourly, setIsHourly] = useState(null);
    const [confirmHours, setConfirmHours] = useState(null);
    const [isFlatRate, setIsFlatRate] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [jobID, setJobID] = useState(null);
    const [paymentComplete, setPaymentComplete] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [hiredApplicantID, setHiredApplicantID] = useState(null);


    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
  
    //  const [confirmedPrice, setConfirmedPrice] = useState(null);
    const [confirmedPriceUI, setConfirmedPriceUI] = useState(null);
    const [confirmedPrice, setConfirmedPrice] = useState(null);

    //needed useEffect?
    useEffect(() => {
      if (confirmedPrice !== null) {
        setConfirmedPriceUI(confirmedPrice * 0.01);
      } else {
      }
    }, [confirmedPrice]);
  
    const [isReady, setIsReady] = useState(false);
  
    const getJobDataAgain = (data) => {
      const docRef = doc(
        db,
        "employers",
        data.userID,
        "In Review",
        data.jobTitle
      );
  
      getDoc(docRef)
        .then((snapshot) => {
          console.log("getdatAgain", snapshot.data());
          setHiredApplicantID(snapshot.data().hiredApplicant);
          setJobTitle(snapshot.data().jobTitle);
          setJobID(snapshot.data().jobID);
          setIsHourly(snapshot.data().isHourly);
          setConfirmHours(snapshot.data().confirmHours);
          setConfirmedRate(snapshot.data().confirmedRate);
          setLowerRate(snapshot.data().lowerRate);
          setUpperRate(snapshot.data().upperRate);
          setCity(snapshot.data().city);
          setIsHourly(snapshot.data().isHourly);
          // setEmployerID(snapshot.data().employerID);
          setDescription(snapshot.data().description);
          setZipCode(snapshot.data().zipCode);
          setHiredApplicantID(snapshot.data().hiredApplicant);
          setState(snapshot.data().state);
          setBusinessName(snapshot.data().businessName);
          setStreetAddress(snapshot.data().streetAddress);
          setRequirements(snapshot.data().requirements);
          setBusinessName(snapshot.data().businessName);
          setNiceToHave(snapshot.data().niceToHave);
          setRequirements2(snapshot.data().requirements2);
          setRequirements3(snapshot.data().requirements3);
          setIsOneTime(snapshot.data().isOneTime);
          setIsVolunteer(snapshot.data().IsVolunteer);
        })
        .then(() => {
          setTimeout(() => {
            setIsReady(true);
          }, 2000);
        });
    };
  
    useEffect(() => {
      if (isReady === true) {
        moveAllData();
      } else {
      }
    }, [isReady]);
  
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");
  
      console.log("client return", queryString, urlParams, sessionId);
  
      if (sessionId) {
        setHasRun(false);
        fetch(
          `https://fulfil-api.onrender.com/session-status?session_id=${sessionId}`
        
        )
          .then((res) => res.json())
          .then((data) => {
            setStatus(data.status);
            setCustomerEmail(data.customer_email);
            setJobTitle(data.jobTitle);
            setUserID(data.userID);
            setConfirmedPriceUI(data.confirmedPrice * 0.1);
            console.log("data final retuirn", data);
            if (data.status === "complete" && data.jobTitle) {
              setIsLoading(true);
              getJobDataAgain(data);
              setTimeout(() => {
                //add loading logic here
                // checkData();
              //   moveAllData()
              }, 2000);
            } else {
              alert(
                "There was an error processing your payment. Please try again later."
              );
            }
          });
      } else {
      }
    }, []);
  
    const [dateCompleted, setDateCompleted] = useState(null);
  
    useEffect(() => {
      //credit https://stackoverflow.com/questions/37271356/how-to-get-the-current-date-in-reactnative Irfan wani
      setDateCompleted(new Date().toLocaleString());
    }, []);
  
    const moveAllData = () => {
      //this was all taken from ReviewWorker (in case something doesnt work and it needs to be moved back)
      console.log(
        "employerID",
        userID,
        "jobTitle",
        jobTitle,
        "jobID",
        jobID,
        " confirmedRate",
        confirmedRate,
        "confirmHours",
        confirmHours,
        " totalPay",
        confirmedPriceUI,
        " isHourly",
        isHourly,
        " confirmedRate",
        confirmedRate,
        " businessName",
        businessName,
        " description",
        description,
        " city",
        city,
        " lowerRate",
        lowerRate,
        "upperRate",
        upperRate,
        " isVolunteer",
        isVolunteer,
        " isOneTime",
        isOneTime,
        " streetAddress",
        streetAddress,
        "state",
        state,
        "zipCode",
        zipCode,
        "requirements ",
        requirements,
        "requirements2",
        requirements2,
        "requirements3",
        requirements3,
        "niceToHave",
        niceToHave,
        // locationLat: locationLat,
        // locationLng: locationLng,
        "hiredApplicant",
        hiredApplicantID
      );
  
      //delete from In Review
      deleteDoc(doc(db, "employers", userID, "In Review", jobTitle))
        .then(() => {
          //all good
          console.log("removed from users saved Jobs");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
  
      deleteDoc(doc(db, "users", hiredApplicantID, "In Review", jobTitle))
        .then(() => {
          //all good
          console.log("removed from users db");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
  
      // //  //add to Jobs Completed
  
      // //  //add to Jobs Completed
      setDoc(doc(db, "users", hiredApplicantID, "Past Jobs", jobTitle), {
        employerID: userID ? userID : null,
        jobTitle: jobTitle ? jobTitle : null,
        jobID: jobID ? jobID : null,
        confirmedRate: confirmedRate ? confirmedRate : null,
        paymentComplete: paymentComplete ? paymentComplete : null,
        dateCompleted: dateCompleted ? dateCompleted : null,
        confirmHours: confirmHours ? confirmHours : null,
        totalPay: confirmedPriceUI ? confirmedPriceUI : null,
        isHourly: isHourly ? isHourly : null,
        paymentId: paymentId ? paymentId : null,
        description: description ? description : null,
        city: city ? city : null,
        lowerRate: lowerRate ? lowerRate : null,
        upperRate: upperRate ? upperRate : null,
        isVolunteer: isVolunteer ? isVolunteer : false,
        isOneTime: isOneTime ? isOneTime : null,
        streetAddress: streetAddress ? streetAddress : null,
        state: state ? state : null,
        zipCode: zipCode ? zipCode : null,
        requirements: requirements ? requirements : null,
        requirements2: requirements2 ? requirements2 : null,
        requirements3: requirements3 ? requirements3 : null,
        niceToHave: niceToHave ? niceToHave : null,
        hiredApplicant: hiredApplicantID ? hiredApplicantID : null,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
        paymentCompletedAndPending: true,
      })
        .then(() => {
          console.log("moved to completed for user");
        })
        .catch((error) => {
          console.log(error);
        });
  
      setDoc(doc(db, "employers", userID, "Past Jobs", jobTitle), {
        employerID: userID ? userID : null,
        jobTitle: jobTitle ? jobTitle : null,
        jobID: jobID ? jobID : null,
        confirmedRate: confirmedRate ? confirmedRate : null,
        paymentComplete: paymentComplete ? paymentComplete : null,
        dateCompleted: dateCompleted ? dateCompleted : null,
        confirmHours: confirmHours ? confirmHours : null,
        totalPay: confirmedPriceUI ? confirmedPriceUI : null,
        isHourly: isHourly ? isHourly : null,
        paymentId: paymentId ? paymentId : null,
        description: description ? description : null,
        city: city ? city : null,
        lowerRate: lowerRate ? lowerRate : null,
        upperRate: upperRate ? upperRate : null,
        isVolunteer: isVolunteer ? isVolunteer : false,
        isOneTime: isOneTime ? isOneTime : null,
        streetAddress: streetAddress ? streetAddress : null,
        state: state ? state : null,
        zipCode: zipCode ? zipCode : null,
        requirements: requirements ? requirements : null,
        requirements2: requirements2 ? requirements2 : null,
        requirements3: requirements3 ? requirements3 : null,
        niceToHave: niceToHave ? niceToHave : null,
        hiredApplicant: hiredApplicantID ? hiredApplicantID : null,
        jobCompleteApplicant: true,
        jobCompleteEmployer: false,
        paymentCompletedAndPending: true,
      })
        .then(() => {
          console.log("moved to completed for Employer");
        })
        .catch((error) => {
          console.log(error);
        });
  
      setIsLoading(false);
      setPaymentAlertShow(true);
    };
  
    const [ratingLoading, setRatingLoading] = useState(true);
  

  
    const [paymentAlertShow, setPaymentAlertShow] = useState(false);
  


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

         
           
            <Center  flexDirection="column">
           
             <Box height="33vh" width="33vw" marginLeft="330px" alignContent="center" textAlign="center">
              <Heading size="md" >Payment Complete!</Heading>
              <Text marginTop="8px">Thank you for using our services.</Text>
              <Button  backgroundColor="#01A2E8" marginTop="8px"
          color="white"
          _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => navigate("/NeederMapScreen")}>Continue</Button>
             </Box>
            </Center>
         
        </Flex>
      </Box>
    </>
  );
};

export default NeederPaymentComplete;
