import React, { useState, useEffect } from "react";
import DoerHeader from "../DoerHeader";
import DoerDashboard from "../DoerDashboard";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
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
import { Spinner } from "@chakra-ui/react";

import { StreamChat } from "stream-chat";

import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const DoerAccountManager = () => {
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserEmail(currentUser.email);
        console.log(currentUser.uid);
      });
      setHasRun(true);
      setLoading(false);
    } else {
    }
  }, []);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    const storage = getStorage();
    const reference = ref(storage, "users/" + user.uid + "/profilePicture.jpg");
    
 

    // if (!reference._service._url) {
    
    // } else {
    //   await getDownloadURL(reference).then((response) => {
    //     setProfilePicture(response);
    //   });
    // }
  };

  const [userFirstName, setUserFirstName] = useState("User");

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const [loggingOut, setLoggingOut] = useState(false);

  const postDeleteRequest = () => {
    setDoc(doc(db, "Delete Requests", user.uid), {
      userID: user.uid,
      requestTermination: true,
    });
  };

  const client = StreamChat.getInstance(
    process.env.REACT_APP_STREAM_CHAT_API_KEY
  );

  const handleLogOut = async () => {
    setLoading(true);
    postDeleteRequest();
    auth.signOut();
    await client.disconnectUser();

    setTimeout(() => {
      alert(
        "Sorry to see you go! We need to double check a few things. You will receive a confirmation email in 2-3 days stating your account has been deleted. "
      );
      navigate("/");
    }, 2000);
  };

  //Onboarding/verification

  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [IDVerified, setIDVerified] = useState(false);
  const [taxAgreementConfirmed, setTaxAgreementConfirmed] = useState(false);
  const [paymentsActive, setPaymentsActive] = useState(false);
  const [stripeIDFromFB, setStripeIDFromFB] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);

        getDoc(docRef).then((snapshot) => {
          console.log(snapshot.data());
          setPrivacyAgreement(snapshot.data().PrivacyPolicyAgree);
          setIDVerified(snapshot.data().IDVerified);
          setTaxAgreementConfirmed(snapshot.data().TaxAgreementConfirmed);
          setPaymentsActive(snapshot.data().stripeActive);
          if (snapshot.data().stripeID) {
            setStripeIDFromFB(snapshot.data().stripeID);
          }
        });
      } else {
        console.log("sospsjs!");
      }
    }, 50);
  }, [user]);

  useEffect(() => {
    if (
      user !== null &&
      privacyAgreement === true &&
      IDVerified === true &&
      taxAgreementConfirmed === true &&
      paymentsActive === true
    ) {
      updateDoc(doc(db, "users", user.uid), {
        isOnboarded: true,
      });
    } else {
    }
  }, [privacyAgreement, IDVerified, taxAgreementConfirmed, paymentsActive]);

  const [stripeID, setStripeID] = useState(null);
  const [getIDHasRun, setGetIDHasRun] = useState(false);

 

  useEffect(() => {
    if (getIDHasRun === false) {
      if (stripeIDFromFB) {
        setStripeID({ stripeID: stripeIDFromFB });
        setGetIDHasRun(true);
        console.log(stripeID)
      }
    } else {
    }
  }, [stripeIDFromFB]);

  useEffect(() => {
    if (stripeID && user !== null) {
      setTimeout(() => {
        verifyStripeStatus()
      }, 1500);
   
    } else {
    }
  }, [stripeID]);

  const verifyStripeStatus = async () => {
    // const interval = setInterval( async () => {
    const response = await fetch(
      `https://fulfil-api.onrender.com/verify-stripe-account`,

      // "https://fulfil-api.onrender.com/create-stripe-account",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stripeID),
      }
    );
    const { chargesEnabled, payoutsEnabled } = await response.json();

    console.log(chargesEnabled, payoutsEnabled);

    if (chargesEnabled === true && payoutsEnabled === true) {
      setStripeActive(true);

      updateDoc(doc(db, "users", user.uid), {
        stripeActive: true,
      })
        .then(() => {
          //all good
          console.log("all stripe info updated and active");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    } else {
      // alert(
      //   "Stripe not active. Please finish onboarding through the sidebar menu on your profile page"
      // );
    }
    // }, 2000);
    // return () => clearInterval(interval);
  };

  //Stripe onboarding

  const [stripeActive, setStripeActive] = useState(false);

  const [onboardURL, setOnboardURL] = useState(null);

  const [stripeIDToFireBase, setStripeIDToFireBase] = useState(null);

  const initializeOnboarding = async () => {
    //setLoadingTrue for button once clicked to allow for redirect
    setPaymentsLoading(true);
    const response = await fetch(
      "https://fulfil-api.onrender.com/create-stripe-account-web",
      // "http://192.168.0.9:3001/test",
      // "https://fulfil-api.onrender.com/create-stripe-account",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { accountLink, error, accountID } = await response.json();

    console.log(JSON.stringify(accountLink));
    console.log("this is ID", accountID);

    // setOnboardURL(accountLink.url);
    setStripeID({ stripeID: accountID });
    setStripeIDToFireBase(accountID);

    //help from https://codefrontend.com/reactjs-redirect-to-url/#navigating-to-an-external-page-in-react
    setTimeout(() => {
      setPaymentsLoading(false);
      window.location.replace(accountLink.url);
    }, 2000);

    return { accountLink, error };
  };

  // const [stripeIDFromFB, setStripeIDFromFB] = useState(null);
  // useEffect(() => {
  //   if (user !== null) {

  //   const docRef = doc(db, "users", user.uid);

  //   getDoc(docRef).then((snapshot) => {
  //     console.log("this one works...",snapshot.data().stripeID)
  //     setStripeID({"stripeID" : snapshot.data().stripeID});
  //   });

  // } else {
  //   console.log("oh nooo")
  // }
  // }, [user]);

  useEffect(() => {
    if (stripeIDToFireBase !== null && user !== null) {
      updateDoc(doc(db, "users", user.uid), {
        stripeID: stripeIDToFireBase,
      })
        .then(() => {
          //all good
          console.log("ID submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    }
  }, [stripeID, user]);
  //text flex end credit (margin-left: auto) https://www.glennstovall.com/flex-row-end-position/
  return (
    <>
      <DoerHeader />

      <Flex>
        <DoerDashboard />
        {!loading ? (
          <Box
            width="67vw"
            // alignContent="center"
            // justifyContent="center"
            // display="flex"
            // alignItems="baseline"
            borderWidth="2px"
            borderColor="#E3E3E3"
            borderLeftWidth="4px"
            borderRightWidth="4px"
            height="auto"
            boxShadow="lg"
            rounded="lg"
            padding="8"
            //   overflowY="scroll"
          >
            <Center flexDirection="column">
              <Heading size="lg" marginTop="16px">
                My Account
              </Heading>
              <Avatar
                bg="#01A2E8"
                size="2xl"
                marginTop="16"
                src={profilePicture}
              />
            </Center>
            <Center flexDirection="column">
              <Heading size="md" marginTop="16px">
                Name
              </Heading>
              <Text>{userFirstName}</Text>
              <Heading size="md" marginTop="4px">
                E-mail
              </Heading>
              <Text>{userEmail}</Text>
              <Heading size="md" marginTop="16px">
                Onboarding
              </Heading>
            </Center>
            <Center flexDirection="column" marginTop="8px">
              <Box width="50vw" marginTop="4" marginBottom="64px">
                {privacyAgreement ? (
                  <Flex direction="row" marginTop="4">
                    <Text>Privacy Agreement</Text>{" "}
                    <CheckCircleIcon
                      color="green"
                      boxSize={5}
                      marginLeft="auto"
                      marginRight="8"
                      marginTop="0.5"
                    />
                  </Flex>
                ) : (
                  <Flex direction="row" marginTop="4">
                    <Text>Privacy Policy Agreement</Text>{" "}
                    <Button
                      colorScheme="red"
                      height="32px"
                      marginLeft="auto"
                      // variant="ghost"
                      onClick={() => navigate("/DoerUserAgreement")}
                    >
                      update
                    </Button>
                  </Flex>
                )}
                {IDVerified ? (
                  <Flex direction="row" marginTop="4">
                    <Text>ID Verified</Text>{" "}
                    <CheckCircleIcon
                      color="green"
                      boxSize={5}
                      marginLeft="auto"
                      marginRight="8"
                      marginTop="0.5"
                    />
                  </Flex>
                ) : (
                  <Flex direction="row" marginTop="4">
                    <Text>ID Verified</Text>{" "}
                    <Button
                      colorScheme="red"
                      height="32px"
                      marginLeft="auto"
                      onClick={() => navigate("/DoerIDVerify")}
                    >
                      update
                    </Button>
                  </Flex>
                )}
                {taxAgreementConfirmed ? (
                  <Flex direction="row" marginTop="4">
                    <Text>Tax Agreement</Text>{" "}
                    <CheckCircleIcon
                      color="green"
                      boxSize={5}
                      marginRight="8"
                      marginLeft="auto"
                      marginTop="0.5"
                    />
                  </Flex>
                ) : (
                  <Flex direction="row" marginTop="4">
                    <Text>Tax Agreement</Text>{" "}
                    <Button
                      colorScheme="red"
                      height="32px"
                      marginLeft="auto"
                      onClick={() => navigate("/DoerTaxAgreement")}
                    >
                      update
                    </Button>
                  </Flex>
                )}
                {paymentsActive ? (
                  <Flex direction="row" marginTop="4">
                    <Text>Payments Status</Text>{" "}
                    <CheckCircleIcon
                      color="green"
                      boxSize={5}
                      marginLeft="auto"
                      marginRight="8"
                      marginTop="0.5"
                    />
                  </Flex>
                ) : paymentsLoading ? (
                  <Flex direction="row" marginTop="4">
                    <Text>Payments Status</Text>{" "}
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue"
                      size="lg"
                      marginLeft="auto"
                      marginRight="8"
                    />
                  </Flex>
                ) : (
                  <Flex direction="row" marginTop="4">
                    <Text>Payments Status</Text>{" "}
                    <Button
                      colorScheme="blue"
                      height="32px"
                      marginLeft="auto"
                      onClick={() => initializeOnboarding()}
                    >
                      Set up payments
                    </Button>
                  </Flex>
                )}
              </Box>
            </Center>

            <Center>
              <Button
                colorScheme="red"
                position="absolute"
                bottom="8"
                onClick={() => handleLogOut()}
              >
                Delete Account
              </Button>
            </Center>
          </Box>
        ) : (
          <Center>
            {" "}
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              marginTop="240px"
            />
          </Center>
        )}
      </Flex>
    </>
  );
};

export default DoerAccountManager;
