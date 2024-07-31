import React, { useState, useEffect } from "react";

import Header from "../../../components/Header.jsx";

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
import { FcGoogle } from "react-icons/fc";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { auth } from "../../../firebaseConfig";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
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
import NeederRegisterMapScreen from "../../../components/NeederRegisterMapScreen.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Plausible from 'plausible-tracker'
import LoggedOutHeader from "../../../components/Landing/LoggedOutHeader.jsx";
import posthog from "posthog-js"
import { useMediaQuery } from "@chakra-ui/react";
import LoggedOutHeaderNoGap from "../../../components/Landing/LoggedOutHeaderNoGap.jsx";

const OnboardingOne = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
 
  
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



  const { trackEvent } = Plausible()

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        trackEvent('Needer Register')
        navigate("/AddProfileInfo");
      })
      .catch((error) => {
        alert("oops! That email is already being used.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
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
      // setPassword(password);
      console.log("password valid");
    }

    if (isValid && isValidPassword) {
      onSignUp();
    }
  };



  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  //credit alex gittemeier https://stackoverflow.com/questions/17439917/regex-to-accept-alphanumeric-and-some-special-character-in-javascript
  // const passwordRegex = /^[A-Za-z0-9_@./#&+-]{6,20}$/;

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  
  
  //credit https://regexr.com/3bfsi
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const validatePassword = () => {
    setPasswordValidationBegun(true);
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setPasswordValidationMessage(
        "Password Invalid. Must be 6 characters or longer"
      );
    } else {
      setPasswordValidationMessage();
      // setPassword(password);
      console.log("password valid");
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
  // help from https://www.dhiwise.com/post/how-to-use-the-onfocus-event-in-react-for-enhanced-user-interactions
  const [closeInfoWindow, setCloseInfoWindow] = useState(false);

  const handleFocus = () => {
    setCloseInfoWindow(true);
    setTimeout(() => {
      setCloseInfoWindow(false);
    }, 200);
  };


  //credit https://www.youtube.com/watch?v=-YA5kORugeI
  const handleGoogleSignUp = async () => {
    
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        trackEvent('Needer Register')
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
                ? "/AddProfileInfo"
                : ( results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer)
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
  const [isDesktop] = useMediaQuery("(min-width: 500px)");


  const [isIndividual, setIsIndividual] = useState(false)
  const [isBusiness, setIsBusiness] = useState(false)
  const [errorTextVisible, setErrorTextVisible] = useState(false)


  useEffect(() => {
    if (isBusiness === true) {
      posthog.capture('user_clicked_isBusiness')
      setIsIndividual(false) 
    } 
  }, [isBusiness])

  useEffect(() => {
    if (isIndividual === true) {
      posthog.capture('user_clicked_isIndividual')
      setIsBusiness(false)
    }
  }, [isIndividual])

  //credit google sign up button https://chakra-templates.vercel.app/components/social-media-buttons
  //credit google sign in https://www.youtube.com/watch?v=-YA5kORugeI
  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  console.log(isBusiness, isIndividual)

  const handleNextStep = () => {
    if (isBusiness === true) {
      navigate("/BusinessEmailRegister")
    } else if (isIndividual === true) {
      navigate("/NeederEmailRegister")
    } else {
     setErrorTextVisible(true)
    }
  }


  return (
    <>
      {/* <Header props={openModal} /> */}
      <LoggedOutHeader props={openModal} />
     


<div class="bg-white">

  <div class="max-w-5xl px-4 xl:px-0   lg:pb-20 mx-auto">
 
    <div class="max-w-3xl mb-10 lg:mb-14">
      <h2 class=" font-semibold text-2xl md:text-4xl md:leading-tight">Hiring made simple.</h2>
      <p class="mt-1 text-neutral-400 text-sm md:text-lg">Hiring shouldn't be difficult when there are so many people looking for work. And it shouldn't cost six figures to hire an agency to do it. That's where Fulfil shines; we make hiring job seekers in the trades and blue collar industries easy and managable, without breaking the bank.</p>
    </div>


    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
      <div class="aspect-w-16 aspect-h-9 lg:aspect-none">
        <img class="w-full object-cover rounded-xl" src="https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=480&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Features Image" />
      </div>

      <div>

        <div class="mb-4">
          <h3 class="text-sky-400 md:text-lg font-semibold ">
            Features
          </h3>
        </div>
 
        <div class="flex gap-x-5 ms-1">
   
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-sky-400 text-small font-bold uppercase rounded-full">
                1
              </span>
            </div>
          </div>
     
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm md:text-lg text-neutral-400">
              <span class="text-sky-400 mr-1 font-semibold">List multiple open positions:</span>
              all for one flat monthly rate.
            </p>
          </div>
       
        </div>
   
        <div class="flex gap-x-5 ms-1">
       
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-sky-400 text-small font-bold uppercase rounded-full">
                2
              </span>
            </div>
          </div>
  
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm md:text-lg text-neutral-400">
              <span class="text-sky-400 mr-1 font-semibold">Reach a primed pool of applicants:</span>
              We cater specifically to the trades and blue collar work, so you know your positions are being viewed by your intended audience
            </p>
          </div>
   
        </div>

        <div class="flex gap-x-5 ms-1">
    
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-neutral-800">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-neutral-800 text-sky-400  text-small font-bold uppercase rounded-full">
                3
              </span>
            </div>
          </div>
       
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm md:text-lg text-neutral-400">
              <span class="text-sky-400 mr-1 font-semibold">Post open positions at multiple locations:</span>
               Our enterprise plan allows you to post multiple open positions at various locations.
            </p>
          </div>
        
        </div>
   
      
   

        <button onClick={() =>  navigate("/BusinessEmailRegister")} className="mt-4 py-2 px-4 inline-flex items-center gap-x-2 text-lg font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none">
          Let's start hiring
          <svg
                class="flex-shrink-0 size-5 mt-0.5"
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
        </button>
      </div>
  
    </div>

  </div>
</div>

    </>
  );
};

export default OnboardingOne;
