import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";
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
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

import { StreamChat } from "stream-chat";

import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

const NeederAccountManager = () => {
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
    const reference = ref(storage, "employers/" + user.uid + "/profilePicture.jpg");

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
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        setUserEmail(snapshot.data().email)
        setCity(snapshot.data().city);
        setState(snapshot.data().state);
        if (snapshot.data().isPremium) {
          setIsPremium(snapshot.data().isPremium)
        }
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

    deleteDoc(doc(db, "employers", user.uid), {

    })
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

  const {
    isOpen: isOpenError,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();

  const handleConfirmDelete = () => {
    onOpen();
  };

  const handleLogOut = async () => {
    // setLoading(true);
    postDeleteRequest();
    try {
      user.delete()
      console.log("user",user)
    } catch (error) {
      console.log("error", error)
      onOpenError()
    }

    // auth.signOut();
    // await client.disconnectUser();

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
  const [stripeIDFromFB, setStripeIDFromFB] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (user != null) {
        const docRef = doc(db, "employers", user.uid);

        getDoc(docRef).then((snapshot) => {
          setPrivacyAgreement(snapshot.data().PrivacyPolicyAgree);
          // setIDVerified(snapshot.data().IDVerified);
         
        });
      } else {
      }
    }, 50);
  }, [user]);

  useEffect(() => {
    if (
      user !== null &&
      privacyAgreement === true
     
    ) {
      updateDoc(doc(db, "employers", user.uid), {
        isOnboarded: true,
      });
    } else {
    }
  }, [privacyAgreement, taxAgreementConfirmed, paymentsActive]);

  //link to account management billing.stripe.com/p/login/dR6eX2bAJ2qzaIM000
  const manageSubscription = () => {
    window.open("https://billing.stripe.com/p/login/dR6eX2bAJ2qzaIM000", "_blank");
  }


  //text flex end credit (margin-left: auto) https://www.glennstovall.com/flex-row-end-position/
  return (
    <>
      <Header />

      <Dashboard />
      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <ol class="md:hidden py-3 px-2 sm:px-5 flex items-center whitespace-nowrap">
          <li class="flex items-center text-sm text-gray-600 ">
            Account
            <svg
              class="flex-shrink-0 mx-1 overflow-visible size-4 text-gray-400 "
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </li>

          <li
            class="text-sm font-semibold text-gray-800 truncate "
            aria-current="page"
          >
            Preferences
          </li>
        </ol>

        <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-3">
          <div class="w-full flex flex-row whitespace-nowrap overflow-x-auto overflow-y-hidden pb-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
           
          </div>

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
             
                

                
                  
                
             
             

              <div class="mb-4 xl:mb-8">
              <h1 class="text-lg font-semibold text-gray-800 ">Account Management</h1>
              <p class="text-sm text-gray-500 ">
                All actions pertaining to your account
              </p>
            </div>
{isPremium === true ? (
   <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 ">
   <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
     <div class="sm:col-span-4 2xl:col-span-2">
       <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
        Manage Subscription
       </label>
     </div>

     <div class="sm:col-span-8 xl:col-span-6 2xl:col-span-5">
      
         <button
           type="button"
           class="py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
           data-hs-overlay="#hs-pro-dasadpm"
           onClick={() => manageSubscription()}
         >
         Manage subscription
         </button>
     
     </div>
     
   </div>
 </div>
) : (null)}
           

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

      <Modal isOpen={isOpenError} onClose={onCloseError}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>There was an error deleting you account</Text>
            <Text>Please contact support at john@getfulfil.com</Text>
          </ModalBody>

          <ModalFooter>
        
            <Button colorScheme="blue" mr={3} onClick={() => onCloseError()}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenLogOut} onClose={onCloseLogOut}>
        <ModalOverlay />
        <ModalContent>
   
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

export default NeederAccountManager;

