import React, { useState, useEffect } from "react";



import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup,  sendPasswordResetEmail } from "firebase/auth";
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
import { auth } from "../../firebaseConfig";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";

import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Plausible from 'plausible-tracker'
import LoggedOutHeader from "./LoggedOutHeader.jsx";
import posthog from "posthog-js"
import { useMediaQuery } from "@chakra-ui/react";


const ResetPasswordLoggedOut = () => {
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

  const [emailSent, setEmailSent] = useState(false)


  // ty Dharmaraj https://stackoverflow.com/questions/72520786/how-to-make-a-reset-password-system-in-react-firebase
  const triggerResetEmail =  async () => {
 
      try {
      if (email) {
      await sendPasswordResetEmail(auth, email);
   setEmailSent(true)
      }
      } catch (error) {
      console.log(error.message)
      }
    
  }
 

  return (
    <>
      {/* <Header props={openModal} /> */}
      <LoggedOutHeader props={openModal} />
     


<div class="bg-white">

<div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
  <div class="sm:w-1/3 md:items-center ">
    <div class=" bg-white  mt-4 rounded-xl shadow-sm ">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h1 class="block text-4xl font-bold text-gray-800">
            Reset your password
           
          </h1>
        
       
        </div>

        <div class="mt-5">
         

          

          <form>
            <div class="grid gap-y-4">
              <div>
                <label for="email" class="block text-sm mb-2">
                  Email address
                </label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    required
                    aria-describedby="email-error"
                  />
                  {email ? (<p>{email}</p>) : (null)}
                   {emailValidationBegun === true ? (
                <p class="block text-sm mb-2 text-red-500">{validationMessage}</p>
              ) : null}
                 
                </div>
                <p
                  class="hidden text-xs text-red-600 mt-2"
                  id="email-error"
                >
                  Please include a valid email address so we can get back
                  to you
                </p>
              </div>

              
            

              {emailSent ? (
                   <div class="text-center mt-4">
                <div class=" bg-white border border-gray-200 rounded-xl shadow-lg " role="alert" tabindex="-1" aria-labelledby="hs-toast-stack-toggle-update-label">
    <div class="flex p-4">
      <div class="shrink-0">
        <svg class="shrink-0 size-4 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
        </svg>
      </div>
      <div class="ms-3">
        <p id="hs-toast-stack-toggle-update-label" class="text-md text-gray-700 ">
          Email sent successfully. Check your email for a link to reset your password
        </p>
      </div>
    </div>
  </div>
  </div>) : (<input type="button"
                    //  onClick={() => validate()}
                     value="Reset password"
                      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => triggerResetEmail()}
             >
             
                    </input>)}

              
            </div>
          </form>
        </div>
      </div>
    </div>

  
  </div>

  
 
</div>
</div>

    </>
  );
};

export default ResetPasswordLoggedOut;
