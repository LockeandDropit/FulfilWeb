import React from "react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
  Button,
  Box,
  Flex,
  Avatar,
  Center,
  Image,
  CloseButton
} from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { auth, db } from "../../../firebaseConfig";
import {
  query,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { useEffect, useState, useCallback } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'

import { ChatIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";

import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";

const stripePromise = loadStripe(
process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

const NeederInReviewCard = () => {
  const [postedJobs, setPostedJobs] = useState(null);

  //validate & set current user
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
  }, [hasRun]);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "In Review"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          //review what thiss does
          results.push({ ...doc.data(), id: doc.id });
        });

        if (!results || !results.length) {
          setPostedJobs(0);
        } else {
          setPostedJobs(results);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //unicode sizing https://stackoverflow.com/questions/23750346/how-to-resize-unicode-characters-via-cssZoe is on Strike & Raptor

  //attemtp to query needer and doer's caht channel using jobTitle as filter

  const [channelID, setChannelID] = useState(null);

  const getChannelID = (x) => {
    console.log("this is whats being passed", x);
    if (user != null) {
      const docRef = doc(db, "employers", user.uid, "In Review", x);
      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data().channelID);

        setChannelID(snapshot.data().channelID);
      });
    } else {
      console.log("oops!");
    }
  };



  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  // const client = StreamChat.getInstance(STREAM_CHAT_API_KEY);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const filter = { type: "messaging", members: { $in: [userID] } };

  const getChannels = async () => {
    const channelSort = await chatClient.queryChannels(filter, {});

    channelSort.map((channelSort) => {
      // console.log("list of channels user is in", channelSort.data.name, channelSort.cid)
      if (channelSort.cid == channelID) {
        setSelectedChannel(channelSort);
        console.log("channel found", channelSort.cid);
        console.log("channel from FB", channelID);
        //or just navigate from here to selected channel??
        //pass whole channel object to navigate
      } else {
        console.log("no luck", channelSort.cid);
      }
    });
    console.log("channel from FB", channelID);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChannel !== null) {
      console.log("selected channel", selectedChannel);
      // navigate("TrialSelectedChat", { props: selectedChannel, isFirstInterview: false });
    } else {
      console.log("nope");
    }
  }, [selectedChannel]);

  //all the new code

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

  //unmute when ready, set useEffects to functyions that are set.

  // useEffect(() => {
  //   if (user != null) {
  //     const docRef = doc(db, "All Jobs", jobID);

  //     getDoc(docRef).then((snapshot) => {
  //       console.log(snapshot.data());
  //       // setIsVolunteer(snapshot.data().isVolunteer);
  //       // setIsHourly(snapshot.data().isHourly)
  //       setIsFlatRate(snapshot.data().isFlatRate);
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [user]);

  const [hiredApplicantID, setHiredApplicantID] = useState(null);

  const getSelectedData = (postedJobs) => {
    const docRef = doc(
      db,
      "employers",
      user.uid,
      "In Review",
      postedJobs.jobTitle
    );

    getDoc(docRef)
      .then((snapshot) => {
        console.log("get selected data fx", snapshot.data());
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

        // setHiredApplicantID(snapshot.data().hiredApplicant)
      })
      .then(() => {
        setTimeout(() => {
          getStripeID(postedJobs);
        }, 1000);
      });
  };

  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenPayment,
    onOpen: onOpenPayment,
    onClose: onClosePayment,
  } = useDisclosure();
  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();

  const [totalPay, setTotalPay] = useState(null);

  useEffect(() => {
    if (confirmedRate !== null && confirmHours !== null) {
      setTotalPay(confirmedRate * confirmHours);
    } else {
    }
  }, [confirmedRate, confirmHours]);

  const handleModalOpen = (postedJobs) => {
    getSelectedData(postedJobs);
    retrieveConfirmedPaymentAmount(postedJobs);
    // pushToJobInfo(postedJobs);
    onOpen();
    setTimeout(() => {
      setRatingLoading(false);
    }, 1500);
  };

  //get all info for payments
  const [hiredApplicantStripeID, setHiredApplicantStripeID] = useState(null);

  const getStripeID = (postedJobs) => {
    console.log(postedJobs);
    const docRef = doc(db, "users", postedJobs.hiredApplicant);

    getDoc(docRef).then((snapshot) => {
      console.log(
        "hired applicant stripe ID from FB",
        snapshot.data().stripeID
      );
      setHiredApplicantStripeID(snapshot.data().stripeID);
    });
  };

  const [confirmedPrice, setConfirmedPrice] = useState(null);

  const retrieveConfirmedPaymentAmount = (postedJobs) => {
    console.log("postedJobs from retreive", postedJobs);
    if (postedJobs.isHourly == true) {
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "In Review",
        postedJobs.jobTitle
      );

      getDoc(docRef).then((snapshot) => {
        // console.log(
        //   snapshot.data().confirmedRate * 100 * snapshot.data().confirmHours
        // );
        // console.log(snapshot.data().confirmHours);
        setConfirmedPrice(
          snapshot.data().confirmedRate * 100 * snapshot.data().confirmHours
        );
      });
    } else {
      //flat rate code goes here

      const docRef = doc(
        db,
        "employers",
        user.uid,
        "In Review",
        postedJobs.jobTitle
      );

      getDoc(docRef).then((snapshot) => {
        // console.log("confirmed rate fetched from fb via useEffect",snapshot.data().confirmedRate);
        setConfirmedPrice(snapshot.data().confirmedRate * 100);
      });
    }

    console.log("confirmedPrice", confirmedPrice);
  };

  console.log("confirmedPrice", confirmedPrice);

  const [stripeOpen, setStripeOpen] = useState(false);

  const sendPaymentInfo = () => {
    // setPaymentStatusFB(postedJobs)
    onClose();
    onClosePayment();
    // paymentForm();
    // fetchClientSecret();
    setStripeOpen(true);
  };

  const [sessionUrl, setSessionUrl] = useState(null);
  // const [hiredApplicantStripeID, setHiredApplicantStripeID] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(null);

  //fires and holds spot in associated job file in "employers" db
  //  const setPaymentStatusFB = (postedJobs) => {
  //   console.log(postedJobs)
  //   if (paymentId !== null && paymentComplete !== null) {
  //     console.log("paymentpending useEffect fired", postedJobs)
  //     updateDoc(doc(db, "employers", user.uid, "In Review", postedJobs.jobTitle), {
  //       paymentComplete: paymentComplete,
  //       paymentId: paymentId,
  //       paymentStartedPending: true
  //     });
  //   }
  // }

  const [jobInfo, setJobInfo] = useState([]);

  const pushToJobInfo = () => {
    jobInfo.push(
      { workerStripeID: hiredApplicantStripeID },
      { confirmedPrice: confirmedPrice },
      { doerUID: hiredApplicantID },
      { jobID: jobID },
      { neederUID: user.uid },
      { jobTitle: jobTitle }
    );
  };

  const [clientSecret, setClientSecret] = useState(null);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    console.log("job info", jobInfo);

      return fetch("https://fulfil-api.onrender.com/create-checkout-web-embedded", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobInfo),
    })
      .then((res) => res.json())
      .then((data) => data)


    //pass data or data.clientSecret?
    // const { client_secret } = await response.json()
    // setClientSecret(data.clientSecret)
    // console.log("session", client_secret);
    // onOpenStripe()
  }, []);

  const options = { fetchClientSecret };

  const paymentForm = async () => {
    console.log("job info", jobInfo);
    console.log("jobTitle", jobInfo[5]);

    const response = await fetch(
      //this one is the live one
      // "https://fulfil-api.onrender.com/create-checkout-web",

      //this is test
      "https://fulfil-api.onrender.com/create-checkout-web",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobInfo),
      }
    );

    const { session } = await response.json();

    console.log("session", session);

    if (!session) {
      alert(
        "There was an issue starting your payment. Please try again later. If this issue persists please contact us at fulfilhelp@gmail.com"
      );
    } else {
      if (session.payment_status === "succeeded") {
        console.log("you got it bubba");
      }
    }

    setPaymentId(session.id);
    setPaymentComplete(session.payment_status);

    setSessionUrl(session.url);

    updateDoc(
      doc(db, "employers", user.uid, "In Review", jobInfo[5].jobTitle),
      {
        paymentComplete: session.payment_status,
        paymentId: session.id,
        paymentStartedPending: true,
      }
    );
  };

  useEffect(() => {
    if (sessionUrl !== null) {
      setTimeout(() => {
        // setPaymentsLoading(false)
        window.location.replace(sessionUrl);
      }, 1000);
    } else {
    }
  });

  useEffect(() => {
    onOpenStripe();
  });

  const handleReviewOpen = (postedJobs) => {
    onOpenPayment();
    pushToJobInfo(postedJobs);
  };

  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  //  const [confirmedPrice, setConfirmedPrice] = useState(null);
  const [confirmedPriceUI, setConfirmedPriceUI] = useState(null);

  useEffect(() => {
    if (confirmedPrice !== null) {
      setConfirmedPriceUI(confirmedPrice * 0.01);
    } else {
    }
  }, [confirmedPrice]);

  const [isReady, setIsReady] = useState(false) 

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
         setIsReady(true)
        }, 2000)
      })
      
  };


  useEffect(() => {
    if (isReady === true) {
      moveAllData()
    } else {

    }
  }, [isReady])

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    console.log("client return", queryString, urlParams, sessionId);

    if (sessionId) {
      setHasRun(false);
      fetch(`https://fulfil-api.onrender.com/session-status?session_id=${sessionId}`)
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
              // moveAllData()

          
            }, 2000);
          } else {
            alert(
              "There was an error processing your paymetn. Please try again later."
            );
          }
        });
    } else {
    }
  }, []);

  const checkData = () => {
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
  };

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
      jobID: jobID ? jobID :null,
      confirmedRate: confirmedRate ? confirmedRate : null,
      paymentComplete: paymentComplete ? paymentComplete : null,
      dateCompleted: dateCompleted ? dateCompleted : null,
      confirmHours: confirmHours ? confirmHours : null,
      
      totalPay: confirmedPriceUI ? confirmedPriceUI : null,
      isHourly: isHourly ? isHourly : null,
      paymentId: paymentId ? paymentId : null,
      description: description ? description : null,
      city: city ? city  : null,
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
      jobID: jobID ? jobID :null,
      confirmedRate: confirmedRate ? confirmedRate : null,
      paymentComplete: paymentComplete ? paymentComplete : null,
      dateCompleted: dateCompleted ? dateCompleted : null,
      confirmHours: confirmHours ? confirmHours : null,
      
      totalPay: confirmedPriceUI ? confirmedPriceUI : null,
      isHourly: isHourly ? isHourly : null,
      paymentId: paymentId ? paymentId : null,
      description: description ? description : null,
      city: city ? city  : null,
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
    setPaymentAlertShow(true)
  };

  const [ratingLoading, setRatingLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [paymentAlertShow, setPaymentAlertShow] = useState(false)

  const {
    isOpen: isVisible,
    onClose: onCloseAlert,
    onOpen : onOpenAlert,
  } = useDisclosure()

  if (isLoading === true) {
    return (
      <>
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      </>
    );
  }
  return (
    <div> 
      {paymentAlertShow && ( <Alert status='success'>
    <AlertIcon />
    Payment completed!
    <CloseButton
        alignSelf='flex-start'
        position='absolute'
        right={-1}
        top={-1}
        onClick={() => setPaymentAlertShow(false)}
      />
  </Alert>)}
     
      {!postedJobs ? (
        <Text>No jobs in review</Text>
      ) : (
        postedJobs?.map((postedJobs) => (
          <div>
            
  
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              width="auto"
              borderWidth="1px"
              borderColor="#E3E3E3"
              // borderLeftWidth="4px"
              // borderRightWidth="4px"
              height="auto"
              marginTop="16px"
              boxShadow="md"
              rounded="lg"
            >
              <Stack>
                <CardBody>
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginLeft="16px"
                  >
                    <Heading fontSize="24">{postedJobs.jobTitle}</Heading>
                    {/* <Flex
                    direction="column"
                    position="absolute"
                    right="8"
                    alignItems="center"
                    marginTop="36"
                  >
                    <ChatIcon boxSize={6} color="#01A2E8"></ChatIcon>
                    <Text>Messages</Text>
                  </Flex> */}
                  </Flex>

                  {/* <Text size="sm">Total Pay ${postedJobs.confirmedRate}</Text> */}
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    marginTop="4"
                    marginLeft="16px"
                  >
                     <Avatar src='https://bit.ly/broken-link' bg="#01A2E8" size="lg" />


                    <Box marginTop="2">
                      <Heading size="sm"> {postedJobs.employerName}</Heading>
                      <Text> {postedJobs.city}, MN</Text>
                      {postedJobs.isHourly ? (
                        <Text size="sm">
                          {postedJobs.confirmHours} hours at $
                          {postedJobs.confirmedRate}/hour
                        </Text>
                      ) : (
                        <Text size="sm">
                          Total Pay ${postedJobs.confirmedRate}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  {/* <Button
                  colorScheme="white"
                  textColor="#01A2E8"
                  outlineColor="#01A2E8"
                  width="240px"
                  marginRight="240"
                  position="absolute"
                  right="0"
                >
                  Go To Messages
                </Button> */}
                  <Flex direction="column" marginLeft="16px">
                    <Heading size="sm" marginTop="2">
                      Description
                    </Heading>
                    <Text>{postedJobs.description}</Text>
                  </Flex>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <Flex direction="row-reverse" width="890px">
                        <AccordionButton
                          width="120px"
                          position="flex-start"
                          bottom="8px"
                        >
                          <Box>See More</Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Flex>
                      <AccordionPanel pb={4}>
                        <Heading size="sm" marginTop="2">
                          Requirements
                        </Heading>
                        {postedJobs.requirements ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : (
                          <Text>No requirements listed</Text>
                        )}

                        {postedJobs.requirements2 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements2}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        {postedJobs.requirements3 ? (
                          <Flex direction="row">
                            {" "}
                            <Text fontSize="14">{"\u25CF"} </Text>
                            <Text marginLeft="1">
                              {postedJobs.requirements3}{" "}
                            </Text>{" "}
                          </Flex>
                        ) : null}
                        <Heading size="sm" marginTop="2">
                          Additional Notes
                        </Heading>
                        {postedJobs.niceToHave ? (
                          <Text marginBottom="48px">
                            {postedJobs.niceToHave}
                          </Text>
                        ) : (
                          <Text marginBottom="48px">Nothing listed</Text>
                        )}
                        <Center>
                          <Button
                            colorScheme="blue"
                            width="240px"
                            height="40px"
                            onClick={() => handleModalOpen(postedJobs)}
                          >
                            Mark Complete & Pay
                          </Button>
                        </Center>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Stack>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Rate This User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <>
                    {ratingLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        <Flex>
                          {maxRating.map((item, key) => {
                            return (
                              <Button
                                activeopacity={0.7}
                                key={item}
                                marginTop="8px"
                                onClick={() => setDefaultRating(item)}
                              >
                                <Image
                                  boxSize="24px"
                                  src={
                                    item <= defaultRating
                                      ? star_filled
                                      : star_corner
                                  }
                                ></Image>
                              </Button>
                            );
                          })}
                        </Flex>
                      </>
                    )}
                  </>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" onClick={() => handleReviewOpen()}>
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isOpenPayment}
              onClose={onClosePayment}
              size="xl"
              alignContent="center"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirm Payment Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex direction="column">
                    {isHourly ? (
                      <>
                        <Flex direction="row" marginTop="8px">
                          <Heading size="sm">Hourly Rate</Heading>

                          <Heading size="sm" position="absolute" right="40">
                            ${confirmedRate}/hour
                          </Heading>
                        </Flex>
                        <Flex direction="row" marginTop="8px">
                          <Heading size="sm">Hours Worked</Heading>
                          <Heading size="sm" position="absolute" right="40">
                            {confirmHours} hours
                          </Heading>
                        </Flex>
                        <Flex direction="row" marginTop="16px">
                          <Heading size="sm">Payment Total</Heading>
                          <Heading size="sm" position="absolute" right="40">
                            ${totalPay}
                          </Heading>
                        </Flex>
                      </>
                    ) : (
                      <Flex direction="row" marginTop="16px">
                        <Heading size="sm">Payment Total</Heading>
                        <Heading size="sm" position="absolute" right="40">
                          ${confirmedRate}
                        </Heading>
                      </Flex>
                    )}
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    onClick={() => sendPaymentInfo(postedJobs)}
                  >
                    Go to payment
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        ))
      )}

      {stripeOpen && (
        <Modal
          isOpen={isOpenStripe}
          onClose={() => setStripeOpen(false)}
          size="xl"
          alignContent="center"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />

            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default NeederInReviewCard;
