import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { useUserStore } from "../Chat/lib/userStore";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionModal = () => {



useEffect(() => {

    onOpen()
    
}, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();


  const {fetchUserInfo, currentUser} = useUserStore()
  const [subscriptionID, setSubscriptionID] = useState(null);



  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

 

    return (
     
  fetch("https://fulfil-api.onrender.com/create-business-subscription-session",

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => data.clientSecret)
    );
  }, []);

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "employers", currentUser.uid), {
        // isPremium: true,
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);

  const options = { fetchClientSecret };

  const [stripeOpen, setStripeOpen] = useState(false);

  const handleStripeOpen = () => {
    onClose()
    onOpenStripe();
    setStripeOpen(true);
  }


  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0  sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div class="bg-white  rounded-xl shadow-sm pointer-events-auto ">
          <div class="flex flex-col  text-center p-8">
      <p class="mb-3"><span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 ">Premium Subscription</span></p>
      <h4 class="font-medium text-lg text-gray-800 ">All-Access</h4>
      <span class="mt-5 font-bold text-5xl text-gray-800">
        <span class="font-bold text-2xl ">$</span>
        29
      </span>
      <p class="mt-2 text-sm text-gray-500 ">Get unlimited everything for one monthly price.</p>

      <ul class="mt-7 space-y-2.5 text-sm">
        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
           Unlimited active job listings
          </span>
        </li>

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
            Listings stay up for as long as you'd like
          </span>
        </li>

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
            Priority support
          </span>
        </li>
      </ul>

      <a  onClick={() => handleStripeOpen()} class="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
        Sign up
      </a>
    </div>

           
          </div>
        </div>
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
       </>
  );
};

export default SubscriptionModal;
