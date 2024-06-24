import React from 'react'
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
  import { useState, useEffect, useRef, useCallback } from "react";
  import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useUserStore } from "../Chat/lib/userStore";
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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const StarterPricingSubscriptionModal = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {

        onOpen()
        
    }, []);

    const {
        isOpen: isOpenStripe,
        onOpen: onOpenStripe,
        onClose: onCloseStripe,
      } = useDisclosure();


      const {fetchUserInfo, currentUser} = useUserStore()
      const [subscriptionID, setSubscriptionID] = useState(null);

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

  const [stripeOpen, setStripeOpen] = useState(false);

  const fetchClientSecret = useCallback(() => {

    console.log("starter sign up")

  return (
     
    fetch("https://fulfil-api.onrender.com/create-business-subscription-session-starter",
  
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

  const options = { fetchClientSecret };

  return (
    <div> <Modal
    isOpen={isOpen}
    onClose={onClose}
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
  </Modal></div>
  )
}

export default StarterPricingSubscriptionModal