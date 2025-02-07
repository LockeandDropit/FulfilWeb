import React, { useState, useEffect } from "react";

import DoerDashboard from "../DoerDashboard";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

import { StreamChat } from "stream-chat";

import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import DoerHeader from "../components/DoerHeader";

const DoerAccountManager = () => {
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [userLastName, setUserLastName] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserEmail(currentUser.email);
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
  const [lastName, setLastName] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        setUserEmail(snapshot.data().email)
        setCity(snapshot.data().city);
        setState(snapshot.data().state);
      });
    } else {
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenLogOut,
    onOpen: onOpenLogOut,
    onClose: onCloseLogOut,
  } = useDisclosure();

  const handleConfirmDelete = () => {
    onOpen();
  };

  const handleLogOut = async () => {
    setLoading(true);
    postDeleteRequest();
    auth.signOut();
    await client.disconnectUser();

    setTimeout(() => {
      onOpenLogOut();
      navigate("/");
    }, 2000);
  };

  //Onboarding/verification

  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [IDVerified, setIDVerified] = useState(false);
  const [taxAgreementConfirmed, setTaxAgreementConfirmed] = useState(false);
  const [paymentsActive, setPaymentsActive] = useState(false);
  const [termsOfService, setTermsOfService] = useState(false)
  const [stripeIDFromFB, setStripeIDFromFB] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);

        getDoc(docRef).then((snapshot) => {
          setPrivacyAgreement(snapshot.data().PrivacyPolicyAgree);
          // setIDVerified(snapshot.data().IDVerified);
          setTaxAgreementConfirmed(snapshot.data().taxAgreementConfirmed);
          setTermsOfService(snapshot.data().termsOfService)
          //need tos agreement
          // setPaymentsActive(snapshot.data().stripeActive);
          if (snapshot.data().stripeID) {
            setStripeIDFromFB(snapshot.data().stripeID);
          }
        });
      } else {
      }
    }, 50);
  }, [user]);

  useEffect(() => {
    if (
      user !== null &&
      privacyAgreement === true &&
      // IDVerified === true &&
      taxAgreementConfirmed === true
      // paymentsActive === true
    ) {
      updateDoc(doc(db, "users", user.uid), {
        isOnboarded: true,
      });
    } else {
    }
  }, [privacyAgreement, taxAgreementConfirmed, paymentsActive]);

  const [stripeID, setStripeID] = useState(null);
  const [getIDHasRun, setGetIDHasRun] = useState(false);
  const [stripeActive, setStripeActive] = useState(null);

  useEffect(() => {
    if (getIDHasRun === false) {
      if (stripeIDFromFB) {
        setStripeID({ stripeID: stripeIDFromFB });
        setGetIDHasRun(true);
      }
    } else {
    }
  }, [stripeIDFromFB]);

  useEffect(() => {
    if (stripeID && user !== null && stripeActive === false) {
      setTimeout(() => {
        verifyStripeStatus();
      }, 1500);
    } else {
    }
  }, [stripeID, stripeActive]);

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

    if (chargesEnabled === true && payoutsEnabled === true) {
      setStripeActive(true);

      updateDoc(doc(db, "users", user.uid), {
        stripeActive: true,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
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

  useEffect(() => {
    if (stripeIDToFireBase !== null && user !== null) {
      updateDoc(doc(db, "users", user.uid), {
        stripeID: stripeIDToFireBase,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [stripeID, user]);
  //text flex end credit (margin-left: auto) https://www.glennstovall.com/flex-row-end-position/
  return (
    <>
      {/* <Header />

      <Dashboard /> */}
        <DoerHeader />
      <main id="content" class="pt-[59px]">
       
        <div class="max-w-6xl mx-auto sm:mt-5  sm:py-0 md:pt-5 space-y-3">
         

          <div class="p-5 md:p-8 bg-white border border-gray-200 shadow-sm rounded-xl ">
          <div class="mb-4 xl:mb-8">
              <h1 class="text-lg font-semibold text-gray-800 ">Account Settings</h1>
              <p class="text-sm text-gray-500 ">
                Your personal settings
              </p>
            </div>
            <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Full Name
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 mt-2 2xl:col-span-5">
                  <p class="text-sm text-black ">
                {userFirstName} {userLastName}
                </p>
                  </div>
                  
                </div>
              </div>
              <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Location
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 mt-2 2xl:col-span-5">
                  <p class="text-sm text-black ">
                {city} {state} 
                </p>
                  </div>
                  
                </div>
              </div>
              <div class="py-3 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                     Contact
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 mt-2 2xl:col-span-5">
                  <p class="text-sm text-black ">
                {userEmail}
                </p>
                  </div>
                  
                </div>
              </div>


            <div class="mb-4 xl:mb-8">
              <h1 class="text-lg font-semibold text-gray-800 ">Onboarding</h1>
              <p class="text-sm text-gray-500 ">
                You must complete all steps below before you can apply to posts.
              </p>
            </div>

            <form>
              <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Privacy Agreement
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
                    {privacyAgreement ? (
                      <CheckCircleIcon
                        color="green"
                        boxSize={5}
                        marginLeft="auto"
                        marginRight="8"
                        marginTop="0.5"
                      />
                    ) : (
                      <button
                        type="button"
                        class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-red-500  hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                        data-hs-overlay="#hs-pro-dasadpm"
                      >
                        update
                      </button>
                    )}
                  </div>
                  
                </div>
              </div>
              {/* <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Tax Agreement
                    </label>
                  </div>
                

                  <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
                    {taxAgreementConfirmed ? (
                      <CheckCircleIcon
                        color="green"
                        boxSize={5}
                        marginLeft="auto"
                        marginRight="8"
                        marginTop="0.5"
                      />
                    ) : (
                      <button
                        type="button"
                        class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-red-500  hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                        data-hs-overlay="#hs-pro-dasadpm"
                      >
                        update
                      </button>
                    )}
                  </div>
                  
                </div>
              </div> */}
              <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Terms of Service
                    </label>
                  </div>
                

                  <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
                    {termsOfService ? (
                      <CheckCircleIcon
                        color="green"
                        boxSize={5}
                        marginLeft="auto"
                        marginRight="8"
                        marginTop="0.5"
                      />
                    ) : (
                      <button
                        type="button"
                        class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-red-500  hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                        data-hs-overlay="#hs-pro-dasadpm"
                      >
                        update
                      </button>
                    )}
                  </div>
                  
                </div>
              </div>
              {/* <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                      Payments Active
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
                    {paymentsActive ? (
                      <CheckCircleIcon
                        color="green"
                        boxSize={5}
                        marginLeft="auto"
                        marginRight="8"
                        marginTop="0.5"
                      />
                    ) : paymentsLoading ? (
                      <div
                      class="animate-spin ml-4 inline-block size-6 border-[3px] border-current border-t-transparent text-red-600 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span class="sr-only">Loading...</span>
                    </div>
                    ) : (
                      <button
                        type="button"
                        class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                        data-hs-overlay="#hs-pro-dasadpm"
                        onClick={() => initializeOnboarding()}
                      >
                        update
                      </button>
                    )}
                  </div>
                  
                </div>
              </div> */}

              <div class="mb-4 xl:mb-8">
              <h1 class="text-lg font-semibold text-gray-800 ">Account Management</h1>
              <p class="text-sm text-gray-500 ">
                All actions pertaining to your account
              </p>
            </div>

            <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                  <div class="sm:col-span-4 2xl:col-span-2">
                    <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
                     Delete Account
                    </label>
                  </div>

                  <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
                   
                      <button
                        type="button"
                        class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-red-500  hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                        data-hs-overlay="#hs-pro-dasadpm"
                        onClick={() => handleConfirmDelete()}
                      >
                      Delete
                      </button>
                  
                  </div>
                  
                </div>
              </div>
              

            

     


            

             
            </form>
          </div>
        </div>
      </main>

    

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are You Sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete your account?</Text>
            <Text>Once deleted, this can not be undone.</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Nevermind
            </Button>
            <Button colorScheme="red" mr={3} onClick={() => handleLogOut()}>
              Delete my Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenLogOut} onClose={onCloseLogOut}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text> Sorry to see you go! </Text>
            <Text>
              We need to double check a few things. You will receive a
              confirmation email in 2-3 days stating your account has been
              deleted.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseLogOut}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoerAccountManager;
