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
  CloseButton,
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

import { useJobStore } from "../HomePage/lib/jobsStoreDashboard";


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
import { useToast } from "@chakra-ui/react";

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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const EmbeddedPaymentsJobDetails = (props) => {
  const [propsHasSet, setPropsHasSet] = useState(false);

  const [postedJobs, setPostedJobs] = useState(null);

  const {job} = useJobStore()

  //validate & set current user
  // const [user, setUser] = useState(null);
  // const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);


  const { setJobHiringState } = useJobStore();

  console.log("props", props)

  // useEffect(() => {
  //   if (hasRun === false) {
  //     onAuthStateChanged(auth, (x) => {
  //       setCurrentUser(x.uid)
  //       // setUserID(x.uid);
  //       console.log("still got it", x);
  //     });
  //     setHasRun(true);
  //   } else {
  //   }
  // }, [hasRun]);

  const currentUser = props.props.currentUser

  useEffect(() => {
    if (currentUser !== null) {
      console.log(currentUser.uid);
 
      setTimeout(() => {
handleModalOpen(props)
      }, 500)
    } else {
    }
  }, [currentUser]);

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

  const [hiredApplicantID, setHiredApplicantID] = useState(null);

  const getSelectedData = (props) => {
    const docRef = doc(
      db,
      "employers",
      currentUser.uid,
      "In Review",
      props.props.job.jobTitle
    );

    getDoc(docRef)
      .then((snapshot) => {
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
          getStripeID(props);
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

  const handleModalOpen = (props) => {
    getSelectedData(props);
    retrieveConfirmedPaymentAmount(props);
    // pushToJobInfo(postedJobs);
    onOpen();
    setTimeout(() => {
      setRatingLoading(false);
    }, 1500);
  };

  //get all info for payments
  const [hiredApplicantStripeID, setHiredApplicantStripeID] = useState(null);

  const getStripeID = (props) => {
    const docRef = doc(db, "users", props.props.job.hiredApplicant);

    getDoc(docRef).then((snapshot) => {
      setHiredApplicantStripeID(snapshot.data().stripeID);
    });
  };

  const [confirmedPrice, setConfirmedPrice] = useState(null);

  const retrieveConfirmedPaymentAmount = (props) => {
    if (props.props.job.isHourly == true) {
      const docRef = doc(
        db,
        "employers",
        currentUser.uid,
        "In Review",
        props.props.job.jobTitle
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
        currentUser.uid,
        "In Review",
        props.props.job.jobTitle
      );

      getDoc(docRef).then((snapshot) => {
        // console.log("confirmed rate fetched from fb via useEffect",snapshot.data().confirmedRate);
        setConfirmedPrice(snapshot.data().confirmedRate * 100);
      });
    }
  };

  const [stripeOpen, setStripeOpen] = useState(false);

  const sendPaymentInfo = () => {
    // setPaymentStatusFB(postedJobs)
    onClose();
    onClosePayment();
    // paymentForm();
    // fetchClientSecret();
    onOpenStripe();
    setStripeOpen(true);
  };

  const [sessionUrl, setSessionUrl] = useState(null);
  // const [hiredApplicantStripeID, setHiredApplicantStripeID] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(null);


  //as of now we do not need this... did I not hook it up right or is there no need for it?
  // const handleJobState = async () => {
  //   //first pull all data... do I already have it?

  //   const confirmedRateInt = parseInt(confirmedRate, 10);

  //   try {
  //     const userIDs = [currentUser.uid, user.uid];

  //     userIDs.forEach(async (id) => {
  //       const userChatsRef = doc(db, "User Messages", id);
  //       const userChatsSnapshot = await getDoc(userChatsRef);

  //       if (userChatsSnapshot.exists()) {
  //         const userChatsData = userChatsSnapshot.data();

  //         const chatIndex = userChatsData.chats.findIndex(
  //           (c) => c.chatId === chatId
  //         );

  //         userChatsData.chats[chatIndex].isPaid = true;

  //         userChatsData.chats[chatIndex].isSeen =
  //           id === currentUser.id ? true : false;
  //         userChatsData.chats[chatIndex].updatedAt = Date.now();

  //         await updateDoc(userChatsRef, {
  //           chats: userChatsData.chats,
  //         });

  //         setJobHiringState(userChatsData.chats);
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };



  const [jobInfo, setJobInfo] = useState([]);

  const pushToJobInfo = () => {
    jobInfo.push(
      { workerStripeID: hiredApplicantStripeID },
      { confirmedPrice: confirmedPrice },
      { doerUID: hiredApplicantID },
      { jobID: jobID },
      { neederUID: currentUser.uid },
      { jobTitle: jobTitle }
    );
  };

  const [clientSecret, setClientSecret] = useState(null);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    return (
      fetch(
        "https://fulfil-api.onrender.com/create-checkout-web-embedded",

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobInfo),
        }
      )
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => data.clientSecret)
    );

    //pass data or data.clientSecret?
    // const { client_secret } = await response.json()
    // setClientSecret(data.clientSecret)
    // console.log("session", client_secret);
    // onOpenStripe()
  }, []);

  const options = { fetchClientSecret };

  const paymentForm = async () => {
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

    if (!session) {
      alert(
        "There was an issue starting your payment. Please try again later. If this issue persists please contact us at fulfilhelp@gmail.com"
      );
    } else {
      if (session.payment_status === "succeeded") {
      }
    }

    setPaymentId(session.id);
    setPaymentComplete(session.payment_status);

    setSessionUrl(session.url);

    updateDoc(
      doc(db, "employers", currentUser.uid, "In Review", jobInfo[5].jobTitle),
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

  //reactivate this
  //   useEffect(() => {
  //     onOpenStripe();
  //   });

  const handleReviewOpen = (postedJobs) => {
    setDoc(doc(db, "users", hiredApplicantID, "Ratings", jobTitle), {
      rating: defaultRating,
    }).then(() => {
      setTimeout(() => {
        averageAndTotalRating();
      }, 300);
    });

    onOpenPayment();
    pushToJobInfo(postedJobs);
  };

  //total rating calulation and submission to doer profile

  const [rating, setRating] = useState(null);
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  const averageAndTotalRating = () => {
    const ratingsQuery = query(
      collection(db, "users", hiredApplicantID, "Ratings")
    );

    onSnapshot(ratingsQuery, (snapshot) => {
      let ratingResults = [];
      snapshot.docs.forEach((doc) => {
        //review what this does
        if (isNaN(doc.data().rating)) {
        } else {
          ratingResults.push(doc.data().rating);
        }
      });
      //cited elsewhere
      if (!ratingResults || !ratingResults.length) {
        //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        setRating(0);
      } else {
        setRating(ratingResults.reduce((a, b) => a + b) / ratingResults.length);
        setNumberOfRatings(ratingResults.length);
      }

      //   setTimeout(() => {
      // updateDoc(doc(db, "users", hiredApplicantID), {
      //   Rating: rating,
      //   numberOfRatings: numberOfRatings
      // })
      //   }, 3000)
    });
  };

  useEffect(() => {
    if (rating && numberOfRatings) {
      updateDoc(doc(db, "users", hiredApplicantID), {
        rating: rating,
        numberOfRatings: numberOfRatings,
      });
    }
  }, [rating, numberOfRatings]);

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

  const [isReady, setIsReady] = useState(false);

  const getJobDataAgain = (data) => {
    const docRef = doc(
      db,
      "employers",
      currentUser.uid,
      "In Review",
      data.jobTitle
    );

    getDoc(docRef)
      .then((snapshot) => {
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
          // setUserID(data.userID);
          setConfirmedPriceUI(data.confirmedPrice * 0.1);

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

  const checkData = () => {
    console.log(
      // "employerID",
      // userID,
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

    //delete from In Review
    deleteDoc(doc(db, "employers", currentUser.uid, "In Review", jobTitle))
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    deleteDoc(doc(db, "users", hiredApplicantID, "In Review", jobTitle))
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
      });

    // //  //add to Jobs Completed

    // //  //add to Jobs Completed
    setDoc(doc(db, "users", hiredApplicantID, "Past Jobs", jobTitle), {
      employerID: currentUser ? currentUser.uid : null,
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
      .then(() => {})
      .catch((error) => {});

    setDoc(doc(db, "employers", currentUser.uid, "Past Jobs", jobTitle), {
      employerID: currentUser ? currentUser.uid : null,
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
      .then(() => {})
      .catch((error) => {});

    setIsLoading(false);
    setPaymentAlertShow(true);
  };

  const [ratingLoading, setRatingLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [paymentAlertShow, setPaymentAlertShow] = useState(false);

  const {
    isOpen: isVisible,
    onClose: onCloseAlert,
    onOpen: onOpenAlert,
  } = useDisclosure();

  //new code

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
      {paymentAlertShow && (
        // <Alert status="success">
        //   <AlertIcon />
        //   Payment completed! If you'd like to revisit this post at any time you can find it in your "Job History".
        //   <CloseButton
        //     alignSelf="flex-start"
        //     position="absolute"
        //     right={-1}
        //     top={-1}
        //     onClick={() => setPaymentAlertShow(false)}
        //   />
        // </Alert>

        <Modal>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Success!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Your payment was successful.</Text>
              <Text>
                If you'd like to review this job, go to "Completed Jobs" to see
                all details.
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Continue
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {!props ? (
        <Text>No jobs in review</Text>
      ) : (
        <div>
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
                <Button colorScheme="blue" onClick={() => sendPaymentInfo()}>
                  Go to payment
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {stripeOpen && (
            <Modal
              isOpen={isOpenStripe}
              onClose={() => setStripeOpen(false)}
              size="xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />

                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </ModalContent>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default EmbeddedPaymentsJobDetails;
