import React, { useState, useEffect, useCallback } from "react";
import Header from './components/Header'
import Dashboard from './components/Dashboard'
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
  import { useNavigate } from "react-router-dom";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "../../firebaseConfig";
  import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import AnnualSubscriptionModal from "../Register/Doer/components/AnnualSubscriptionModal";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


const InternalDoerPaymentFreeTrial = ({user}) => {
    const {
        isOpen: isOpen,
        onOpen: onOpen,
        onClose: onClose,
      } = useDisclosure();

      useEffect(() => {
        onOpen()
      }, [])

      const navigate = useNavigate();

  //payment stuff
  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();

  const firstVisitTest = () => {
    navigate("/DoerMapView", { state: { firstVisit: true } })
    
  }

  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeOpenAnnual, setStripeOpenAnnual] = useState(false);

  const fetchClientSecret = useCallback(() => {

   

    return (
      fetch(
        "https://fulfil-api.onrender.com/create-doer-free-trial",

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    console.log("new update outer");

    console.log("test");
    if (sessionId && user !== null) {
      console.log("test 2");
      if (!user.isPremium) {
        console.log("new update inner");
        // setHasRun(false);
        fetch(
          `https://fulfil-api.onrender.com/doer-monthly-subscription-session-status?session_id=${sessionId}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "complete") {
              console.log(data);
              console.log(user.uid);
              updateDoc(doc(db, "users", user.uid), {
                isPremium: true,
              })
              .then(() =>  navigate("/DoerMapView", { state: { firstVisit: true } })).catch((error) => console.log(error));

              //set user as premium
            } else {
              alert(
                "There was an error processing your payment. Please try again later."
              );
              // addJobInfo(null)
            }
          });
      } else {
      }
    } else {
    }
  }, [user]);

  const options = { fetchClientSecret };

  const handleOpenStripeMonthly = () => {
    onOpenStripe();
    setStripeOpen(true);
  };

  const handleOpenStripeAnnual = () => {
    onOpenStripe();
    setStripeOpenAnnual(true);
  };

  return (
    <Modal
    isOpen={isOpen}
    
    size="2xl"
  >
    <ModalOverlay />
    <ModalContent>
  

    <div className="w-full sm:h-[calc(100vh-160px)] sm:bg-landingHeroWave bg-no-repeat bg-bottom ">
        <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div class="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
            <h2 class="text-3xl lg:text-4xl text-gray-800 font-bold ">
              Let’s see what your highest and best looks like.
            </h2>
          </div>

          <div class="relative xl:w-10/12 xl:mx-auto">
            <div class="">
              <div className="">
                <div class="p-4 relative z-10 bg-white border rounded-xl md:p-10 ">
                  <h3 class="text-xl font-bold text-gray-800 ">30 days free!</h3>
                  <div class="text-sm text-gray-500 ">Take things slow.</div>

                  <div class="mt-5">
                    <span class="text-6xl font-bold text-gray-800 ">Free</span>

                    <span class="ms-3 text-gray-500 ">for the first month*</span>
                  </div>

                  <div class="mt-5 grid  gap-y-2 py-4 first:pt-0 last:pb-0 sm:gap-x-6 sm:gap-y-0">
                    <ul class="space-y-2 text-sm sm:text-base">
                      <li class="flex gap-x-3">
                        <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 ">
                          <svg
                            class="shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span class="text-gray-800 ">AI resume builder</span>
                      </li>

                      <li class="flex gap-x-3">
                        <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 ">
                          <svg
                            class="shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span class="text-gray-800 ">Career guidance tool</span>
                      </li>

                      <li class="flex gap-x-3">
                        <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 ">
                          <svg
                            class="shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span class="text-gray-800 ">
                          Easy access to job openings
                        </span>
                      </li>
                    </ul>

                 
                  </div>

                  <div class="mt-5 grid grid-cols-2 gap-x-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p class="text-sm text-gray-500 ">*Renews at $14/month.</p>
                    </div>

                    {/* <div class="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenStripeMonthly()}
                        class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border   shadow-sm  disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                      >
                        Claim free trial
                      </button>
                    </div> */}
                  </div>
                  <div class="mt-5 flex w-full items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleOpenStripeMonthly()}
                        class="w-2/3 bg-blue-500 hover:bg-blue-600 text-center items-center justify-center text-white py-3 px-4 inline-flex i gap-x-2 text-sm font-medium rounded-lg border   shadow-sm  disabled:opacity-50 disabled:pointer-events-none focus:outline-none "
                      >
                        Claim free trial!
                      </button>
                    </div>
                </div>
              </div>

          
            </div>

          </div>

       
        </div>

        {stripeOpen && (
        <Modal
          isOpen={isOpenStripe}
          onClose={() => setStripeOpen(false)}
          size="xl"
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

{stripeOpenAnnual && (
        <AnnualSubscriptionModal user={user.uid}/>
        
      )}
      </div>
    </ModalContent>
  </Modal>
  )
}

export default InternalDoerPaymentFreeTrial