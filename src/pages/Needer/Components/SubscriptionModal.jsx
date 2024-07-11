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
import StarterPricingSubscriptionModal from "./StarterPricingSubscriptionModal";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionModal = () => {

const [type, setType] = useState(null)

useEffect(() => {

    onOpen()
    
}, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();
  const {
    isOpen: isOpenSupportEmail,
    onOpen: onOpenSupportEmail,
    onClose: onCloseSupportEmail,
  } = useDisclosure();
  const {
    isOpen: isOpenStripeStarter,
    onOpen: onOpenStripeStarter,
    onClose: onCloseStripeStarter,
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
  const [stripeOpenStarter, setStripeOpenStarter] = useState(false);

  const handleStripeOpen = (type) => {


      if (type === "starter") {
        onClose()
        onOpenStripe()
        setStripeOpenStarter(true)
      } else {
        console.log("handle stripe open pressed")
        onClose()
          onOpenStripe()
          setStripeOpen(true)
          console.log("stripe open?", stripeOpen)
      
      }




  }


  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    //do i need a callback function or can I pass something here?
    //I could try storing it in a store and pullling from there?
    // also change the dollar amount on the stripe card entering field.
 console.log("fetch client secret called $29")


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


  const options = { fetchClientSecret };


  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
      <ModalOverlay />
      <ModalContent>
      <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

  <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
    <h2 class="text-2xl font-bold md:text-4xl md:leading-tight ">Pricing</h2>
    <p class="mt-1 text-gray-600 ">Whatever your status, our offers evolve according to your needs.</p>
  </div>

  {/* <div class="flex justify-center items-center">
    <label class="min-w-14 text-sm text-gray-500 me-3 ">Monthly</label>

    <input type="checkbox" id="hs-basic-with-description" class="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 

    before:inline-block before:size-6 before:bg-white checked:before:bg-white before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 " checked />

    <label class="relative min-w-14 text-sm text-gray-500 ms-3 ">
      Annual
      <span class="absolute -top-10 start-auto -end-28">
        <span class="flex items-center">
          <svg class="w-14 h-8 -me-6" width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z" fill="currentColor" class="fill-gray-300 "/>
          </svg>
          <span class="mt-3 inline-block whitespace-nowrap text-[11px] leading-5 font-semibold tracking-wide uppercase bg-blue-600 text-white rounded-full py-1 px-2.5">Save up to 10%</span>
        </span>
      </span>
    </label>
  </div> */}

 
  <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">

    <div class="flex flex-col border border-gray-200 text-center rounded-xl p-8 ">
      <h4 class="font-medium text-lg text-gray-800 ">Standard</h4>
      <span class="mt-7 font-bold text-3xl text-gray-800 ">   Free trial</span>
      <p class="mt-2 text-sm text-gray-500 ">Renews at <span className="font-semibold text-slate-700">$49/month</span></p>

      <ul class="mt-7 space-y-2.5 text-sm">
        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
            Up to 3 active listings
          </span>
        </li>

        {/* <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
            Plan features
          </span>
        </li> */}

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
          Visible to all users
          </span>
        </li>
        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 text-start">
          Link to your website and application process
                    </span>
        </li>
      </ul>

      <a onClick={() => handleStripeOpen("starter")} class="cursor-pointer mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none " >
        Sign up
      </a>
    </div>
  
    <div class="flex flex-col border-2 border-blue-600 text-center shadow-xl rounded-xl p-8">
      <p class="mb-3"><span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 ">Recommended</span></p>
      <h4 class="font-medium text-lg text-gray-800 ">Premium</h4>
      <span class="mt-5 font-bold text-3xl text-gray-800 ">
        {/* <span class="font-bold text-2xl">$</span>
        29 <span class="font-bold text-2xl ">/mo</span> */}
        Free trial
      </span>
      <p class="mt-2 text-sm text-gray-500 ">Renews at <span className="font-semibold text-slate-700">$99/month</span></p>

      <ul class="mt-7 space-y-2.5 text-sm">
        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
          Includes all features from standard
          </span>
        </li>

      

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 text-start ">
          Up to 5 posted positions
          </span>
        </li>

        <li class="flex space-x-2 ">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 text-start">
          Maintain a database of recent users that have shown interest in your company, so when a position opens, it can be filled quickly.          </span>
        
         
        </li>
      </ul>

      <button onClick={() => handleStripeOpen("$29 one")} class=" mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg  bg-blue-600 text-white hover:bg-blue-700">
        Sign up
      </button>
    </div>

  
  
    <div class="flex flex-col border border-gray-200 text-center rounded-xl p-8 ">
      <h4 class="font-medium text-lg text-gray-800 mt-4">Enterprise</h4>
      <span class="mt-5 font-bold text-2xl text-gray-800 ">
      
        Contact support
      </span>
      <p class="mt-2 text-sm text-gray-500 ">Hiring for large companies</p>

      <ul class="mt-7 space-y-2.5 text-sm">
        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 ">
            Listings at multiple business locations
          </span>
        </li>

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 text-start">
          Active promotion of open positions. 
          </span>
        </li>

        <li class="flex space-x-2">
          <svg class="flex-shrink-0 mt-0.5 size-4 text-blue-600 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-gray-800 text-start">
          Applicant Screening: Custom questions or tests that candidates must complete before submitting an application.
          </span>
        </li>
      </ul>

      <a onClick={() => onOpenSupportEmail()}class="cursor-pointer mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none " >
       Contact
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

{stripeOpenStarter && (
           <StarterPricingSubscriptionModal />
          )}


<Modal
              isOpen={isOpenSupportEmail}
              onClose={onCloseSupportEmail}
              size="xl"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />

                <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

<div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
  <h2 class="text-2xl font-bold md:text-2xl md:leading-tight ">Contact Us</h2>
  {/* <p class="mt-1 text-gray-600 ">Whatever your status, our offers evolve according to your needs.</p> */}
</div>




<div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:items-center">

  



<p class=" text-gray-600 ">Send an email to <span className="font-semibold text-slate-700">tyler@getfulfil.com</span> to start an enterprise plan</p>

</div>




</div>

              </ModalContent>
            </Modal>
       </>
  );
};

export default SubscriptionModal;
