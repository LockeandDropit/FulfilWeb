import React, { useState, useEffect, useCallback } from "react";

import Header from "../../../components/Header.jsx";
import MapScreen from "../../MapScreen.jsx";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import Planning from "../../../images/Planning.jpg";
import LadderWomanMedium from "../../../images/LadderWomanMedium.jpg";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import { FcGoogle } from "react-icons/fc";
import LoggedOutHeader from "../../../components/Landing/LoggedOutHeader.jsx";
import { useMediaQuery } from "@chakra-ui/react";
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
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Plausible from "plausible-tracker";
import AnnualSubscriptionModal from "./components/AnnualSubscriptionModal.jsx";
import ReactPlayer from "react-player";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const DoerPayment = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);

  console.log(email, password);

  const { trackEvent } = Plausible();

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        trackEvent("Doer Register");
        navigate("/DoerAddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const handleGoogleSignUp = async () => {
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        trackEvent("Doer Register");
        console.log("result", result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log("google user", user);

        Promise.all([
          getDoc(doc(db, "users", result.user.uid)),
          getDoc(doc(db, "employers", result.user.uid)),
        ])
          .then((results) =>
            navigate(
              results[0]._document === null && results[1]._document === null
                ? "/DoerAddProfileInfo"
                : results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer
                ? "/DoerMapScreen"
                : "/NeederMapScreen"
            )
          )
          .catch();

        //check if user is already in DB
        //if so, navigate accordingly
        //if not, navigate to new profile register
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("hello", error);
      });
  };

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const validate = () => {
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
    } else {
      setValidationMessage();
      setEmail(email);
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      setPasswordValidationMessage(
        "Password Invalid. Must be at least 6 characters, have 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
    } else {
      setPasswordValidationMessage();
    }
    if (isValid && isValidPassword) {
      onSignUp();
    }
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol

  // https://regexr.com/3bfsi
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = () => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
    } else {
      setPasswordValidationMessage();
    }
  };

  const [visibleToggle, setVisibleToggle] = useState("password");

  const handlePasswordVisible = () => {
    if (visibleToggle === "password") {
      setVisibleToggle("email");
    } else if (visibleToggle === "email") {
      setVisibleToggle("password");
    }
  };

  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
    setTimeout(() => {
      setOpenModal(false);
    }, 200);
  };

  //this is here to circumnavigate the bug where if the info marker is open and the user tries to enter their email they are stopped after enetering one letter and redirected to the infomarker

  const [closeInfoWindow, setCloseInfoWindow] = useState(false);

  const handleFocus = () => {
    setCloseInfoWindow(true);
    setTimeout(() => {
      setCloseInfoWindow(false);
    }, 200);
  };

  const [hasRun, setHasRun] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  //payment stuff
  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();

  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeOpenAnnual, setStripeOpenAnnual] = useState(false);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    //do i need a callback function or can I pass something here?
    //I could try storing it in a store and pullling from there?
    // also change the dollar amount on the stripe card entering field.

    return (
      fetch(
        // "https://fulfil-api.onrender.com/create-individual-subscription-monthly",
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
                .then(() =>
                  navigate("/DoerMapView", { state: { firstVisit: true } })
                )
                .catch((error) => console.log(error));

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

  const firstVisitTest = () => {
    navigate("/DoerMapView", { state: { firstVisit: true } });
  };

  const url = "https://www.youtube.com/watch?v=E1kAt7DLyg8";

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication
  return (
    <>
      {/* <Header props={openModal}/> */}

      <LoggedOutHeader props={openModal} />

      <div className="w-full h-[calc(100vh-160px)] sm:bg-landingHeroWave bg-no-repeat bg-bottom ">
        {/* <div className="w-full h-[calc(100vh-160px)] ">
         */}
        <div class="max-w-[85rem] px-4  sm:px-6 lg:px-8  mx-auto">
          {/* <div class="mx-auto max-w-2xl mb-8 lg:mb-14 text-center sm:mt-20">
            <h2 class="text-3xl lg:text-4xl text-gray-800 font-bold ">
              Let’s see what your highest and best looks like.
            </h2>
          </div> */}

          <div class="max-w-2xl text-center mx-auto mt-20">
            <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl ">
              Let's see what you can <span class="text-sky-400">achieve.</span>
            </h1>
            <p class="mt-3 text-lg text-gray-800 ">
              Find the first steps to a fulfilling career
            </p>
          </div>
          {/* //here */}
          <div class="relative xl:w-10/12 xl:mx-auto mt-6 sm:mt-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div class="p-4 relative z-10 bg-white border rounded-xl md:p-10 ">
                  {/* <h3 class="text-xl font-bold text-gray-800 ">Monthly</h3>
                  <div class="text-sm text-gray-500 ">Take things slow.</div> */}

                  <div class="mt-5">
                    <span class="text-4xl font-bold text-gray-800 ">Free trial</span>

                    {/* <span class="ms-3 text-gray-500 ">renews at $14/month</span> */}
                  </div>
                  <div className="flex flex-col">
                  <span class=" text-gray-500 ">30 days free</span>
                  <span class=" text-gray-500 ">Renews at $14/month</span>
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
                        <span class="text-gray-800 ">
                          Easy access to job openings
                        </span>
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
                          Access to Referral Bonuses
                        </span>
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
                          Resources to find the first steps into high paying
                          Industries
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
                          Access to a career guidance tool
                        </span>
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
                          Quickly tailor your resume for each application.
                        </span>
                      </li>
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
                        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border  bg-blue-500 text-white shadow-sm  disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                      >
                        Start free trial
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div>
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
                  <div></div>

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
                        <span class="text-gray-800 ">
                          Easy access to job openings
                        </span>
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
                          Access to Referral Bonuses
                        </span>
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
                          Resources to find the first steps into high paying
                          Industries
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
                          Access to a career guidance tool
                        </span>
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
                          Quickly tailor your resume for each application.
                        </span>
                      </li>
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
              </div> */}
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

          <div class="mt-7 text-center mb-10">
            <p class="text-xs text-gray-400">Prices in USD. Taxes may apply.</p>
          </div>

          <div class="relative overflow-hidden mb-8 sm:mb-16">
            <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-2">
              {/* <div class="max-w-2xl text-center mx-auto">
              <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl ">
                Let's see what you can{" "}
                <span class="text-sky-400">achieve</span>
              </h1>
              <p class="mt-3 text-lg text-gray-800 ">
                Find the first steps to a fulfilling career
              </p>
            </div> */}

              <div class="mt-12 sm:mt-24 relative max-w-5xl mx-auto mb-8 sm:mb-14">
                <div class="w-full object-cover h-96 sm:h-[480px]  rounded-xl">
                  <ReactPlayer
                    url={url}
                    width="100%"
                    height="100%"
                    controls={true}
                  />
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

      {stripeOpenAnnual && <AnnualSubscriptionModal user={user.uid} />}
    </>
  );
};

export default DoerPayment;
