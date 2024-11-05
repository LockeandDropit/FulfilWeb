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
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { logout, auth } from "../../firebaseConfig";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


const InternalDoerPayment = ({user}) => {
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

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setLoggingOut(true);

    await signOut(auth)
      .then(
        setTimeout(() => {
          navigate("/");
        }, 2000)
      ) // undefined
      .catch((e) => console.log(e));
  };

  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeOpenAnnual, setStripeOpenAnnual] = useState(false);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    //do i need a callback function or can I pass something here?
    //I could try storing it in a store and pullling from there?
    // also change the dollar amount on the stripe card entering field.
   

    return (
      fetch(
        "https://fulfil-api.onrender.com/create-individual-subscription-monthly",

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
    if (sessionId && user!== null) {
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
    
    size="6xl"
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div class="p-4 relative z-10 bg-white border rounded-xl md:p-10 ">
                  <h3 class="text-xl font-bold text-gray-800 ">Monthly</h3>
                  <div class="text-sm text-gray-500 ">Take things slow.</div>

                  <div class="mt-5">
                    <span class="text-6xl font-bold text-gray-800 ">$14</span>

                    <span class="ms-3 text-gray-500 ">/month</span>
                  </div>

                  <div class="mt-5 grid sm:grid-cols-2 gap-y-2 py-4 first:pt-0 last:pb-0 sm:gap-x-6 sm:gap-y-0">
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

                    <ul class="space-y-2 text-sm sm:text-base">
                      <li class="flex gap-x-3">
                        <span class="size-5 flex justify-center items-center rounded-full bg-gray-50 text-gray-500 ">
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
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </span>
                        <span class="text-gray-800 ">
                          One-on-one career coaching
                        </span>
                      </li>

                      {/* <li class="flex gap-x-3">
                  <span class="size-5 flex justify-center items-center rounded-full bg-gray-50 text-gray-500 ">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </span>
                  <span class="text-gray-800 ">
                    Product support
                  </span>
                </li>

                <li class="flex gap-x-3">
                  <span class="size-5 flex justify-center items-center rounded-full bg-gray-50 text-gray-500 ">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </span>
                  <span class="text-gray-800 ">
                    Activity reporting
                  </span>
                </li> */}
                    </ul>
                  </div>

                  <div class="mt-5 grid grid-cols-2 gap-x-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p class="text-sm text-gray-500 ">Cancel anytime.</p>
                    </div>

                    <div class="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenStripeMonthly()}
                        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="shadow-xl shadow-gray-200 p-5 relative z-10 bg-white border rounded-xl md:p-10 ">
                  <h3 class="text-xl font-bold text-gray-800 ">Annual</h3>
                  <div class="text-sm text-gray-500 ">For the best price.</div>
                  <span class="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-xs font-medium bg-gray-800 text-white py-1.5 px-3 ">
                    Most savings
                  </span>

                  <div class="mt-5">
                    <span class="text-6xl font-bold text-gray-800 ">$10</span>
                    <span class="text-lg font-bold text-gray-800 "></span>
                    <span class="ms-3 text-gray-500 ">/month*</span>
                  </div>
                  <div>
                 
                  </div>

                  <div class="mt-5 grid sm:grid-cols-2 gap-y-2 py-4 first:pt-0 last:pb-0 sm:gap-x-6 sm:gap-y-0">
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
                        <span class="text-gray-800 ">
                          One-on-one career coaching
                        </span>
                      </li>

                      {/* <li class="flex gap-x-3">
                  <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 ">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-gray-800 ">
                    Product support
                  </span>
                </li>

                <li class="flex gap-x-3">
                  <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 ">
                    <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-gray-800">
                    Activity reporting
                  </span>
                </li> */}
                    </ul>
                  </div>

                  <div class="mt-5 grid grid-cols-2 gap-x-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p class="text-sm text-gray-500 ">*Charged annually</p>
                    </div>

                    <div class="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenStripeAnnual()}
                        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hidden md:block absolute top-0 end-0 translate-y-16 translate-x-16">
              {/* <svg
                class="w-16 h-auto text-orange-500"
                width="121"
                height="135"
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  stroke-width="10"
                  stroke-linecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  stroke-width="10"
                  stroke-linecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  stroke-width="10"
                  stroke-linecap="round"
                />
              </svg> */}
            </div>

            <div class="hidden md:block absolute bottom-0 start-0 translate-y-16 -translate-x-16">
              {/* <svg
                class="w-56 h-auto text-cyan-500"
                width="347"
                height="188"
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  stroke-width="7"
                  stroke-linecap="round"
                />
              </svg> */}
            </div>
          </div>

          <div class="mt-7 text-center" >
            <p class="text-xs text-gray-400">Prices in USD. Taxes may apply.</p>
          </div>
          <div class="mt-7 text-center flex" >
            <p class="text-xs text-gray-400">Not what you're looking for? </p>
            {loggingOut ? (<div class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-red-600 rounded-full " role="status" aria-label="loading">
  <span class="sr-only">Loading...</span>
</div>) : (<button className="text-red-500 ml-1" onClick={() => handleLogOut()}>Log out</button>)}
           
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

export default InternalDoerPayment