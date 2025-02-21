import React from "react";
import { useState, useEffect, useCallback } from "react";
import DoerHeader from "../components/DoerHeader";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Greeting from "./Greeting";
import HomepageJobs from "./HomepageJobs";
import HomepageEducation from "./HomepageEducation";
import Footer from "../../../components/Footer";
import Tools from "./Tools";
import { useUserStore } from "../Chat/lib/userStore";
import { useJobRecommendationStore } from "../lib/jobRecommendations";
import { useEduRecommendationStore } from "../lib/eduRecommendations";
import { useIndustryRecommendationStore } from "../lib/industryRecommendation";
import { usePreferredIndustryStore } from "../lib/userPreferredIndustry";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import PaymentModal from "./PaymentModal/PaymentModal";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


const DoerHomepage = () => {
  const [user, setUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const { fetchUserInfo, currentUser } = useUserStore();
  const { recommendedJobs, setRecommendedJobs } = useJobRecommendationStore();
  const { recommendedEdu, setRecommendedEdu } = useEduRecommendationStore();
  const { setRecommendedIndustry} = useIndustryRecommendationStore();
   const{ setPreferredIndustry } = usePreferredIndustryStore();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log("hello", currentUser.uid);
        fetchUserInfo(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

    useEffect(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);
  
        getDoc(docRef).then((snapshot) => {
          // console.log(snapshot.data());
          setRecommendedJobs(snapshot.data().returnedJobs);
          setRecommendedEdu(snapshot.data().returnedEducation);
          setRecommendedIndustry(snapshot.data().industryReccomendation);
          setPreferredIndustry(snapshot.data().userPreferredIndustry ? snapshot.data().userPreferredIndustry : null)
        });
      } else {
        console.log("oops!");
      }
    }, [user]);

      useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get("session_id");
    
        console.log("new update outer");
    
        console.log("test");
        if (sessionId && user !== null && currentUser !== null) {
          console.log("test 2");
          if (!currentUser.isPremium) {
            console.log("new update inner");
            setHasRun(false);
            fetch(
              `https://fulfil-api.onrender.com/create-subscription-session-status?session_id=${sessionId}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.status === "complete") {
                  console.log(data.status);
                  console.log(user.uid);
                  updateDoc(doc(db, "users", user.uid), {
                    isPremium: true,
                  }).catch((error) => console.log(error));
                  fetchUserInfo(user.uid);
    
                  // onOpen();
    
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
      }, [user, currentUser]);


      const testIfPremium = () =>{
        if (currentUser.isPremium === true) {
          
        } else {
          setPaymentModalOpen(true)
        }
      }

      
  //PAYMENT HANDLERS

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const handleOpenPaymentModal = () => {
    setPaymentModalOpen(true)
  }

    const [stripeOpen, setStripeOpen] = useState(false);

     const {
        isOpen: isOpenStripe,
        onOpen: onOpenStripe,
        onClose: onCloseStripe,
      } = useDisclosure();


      const handleOpenPayment = () => {
        setStripeOpen(true)
        onOpenStripe()
      }

       const fetchClientSecret = useCallback(() => {
          // Create a Checkout Session
      
          //do i need a callback function or can I pass something here?
          //I could try storing it in a store and pullling from there?
          // also change the dollar amount on the stripe card entering field.
       console.log("fetch client secret called $29")
      
      
        return (
           
          fetch("https://fulfil-api.onrender.com/create-subscription",
        
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

        const handleCloseOfferOpenPayment = () => {
          //close Modal
          setPaymentModalOpen(false)
          //open stripe
          handleOpenPayment()
        }

        const handleCloseOffer = () => {
          setPaymentModalOpen(false)
        }
//access zustand store. One for each portion of the returned data (jobs, edu,  recommended/preferred industry)

  return (
    <div className="w-full" onClick={() => testIfPremium()}>
      {currentUser ? (
        <>
          
          <DoerHeader user={currentUser} />
          <Greeting user={currentUser}/>
          <HomepageJobs user={currentUser} />
          <HomepageEducation user={currentUser} />
  {paymentModalOpen && (<PaymentModal handleCloseOffer={() => handleCloseOffer()} handleCloseOfferOpenPayment={() => handleCloseOfferOpenPayment()} />)}
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
      ) : null}
    </div>
  );
};

export default DoerHomepage;
