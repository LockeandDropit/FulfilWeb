import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import LoggedOutHeader from "../../../components/Landing/LoggedOutHeader";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image,
  Spinner,
  Progress
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ViewIcon } from "@chakra-ui/icons";

import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CheckIcon,
  CloseIcon,
  EditIcon,
} from "@chakra-ui/react";
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
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import ImageUploading from "react-images-uploading";

import { useNavigate } from "react-router-dom";

import smallStripe from "../../../images/smallStripe.png";

const StripeSetUp = () => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);

  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [user, setUser] = useState(null);

  console.log(email, password);

  //Stripe onboarding

  const [stripeIDToFireBase, setStripeIDToFireBase] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [stripeID, setStripeID] = useState(null);

  const [sessionURL, setSessionURL] = useState(null);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        // setUserEmail(currentUser.email);
        // console.log(currentUser.uid);
      });
      setHasRun(true);
      // setLoading(false);
    } else {
    }
  }, []);

  const initializeOnboarding = async () => {
    //setLoadingTrue for button once clicked to allow for redirect
    setPaymentsLoading(true);
    const response = await fetch(
      "https://fulfil-api.onrender.com/create-stripe-account-web",
      // "http://192.168.0.9:3001/test",
      // "https://fulfil-api.onrender.com/create-stripe-account",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { accountLink, error, accountID } = await response.json();

    console.log(JSON.stringify(accountLink));
    console.log("this is ID", accountID);

    // setOnboardURL(accountLink.url);
    setStripeID({ stripeID: accountID });
    setStripeIDToFireBase(accountID);

    setSessionURL(accountLink.url);

    //help from https://codefrontend.com/reactjs-redirect-to-url/#navigating-to-an-external-page-in-react
    // setTimeout(() => {
    //   // setPaymentsLoading(false);
    //   window.location.replace(accountLink.url);
    // }, 1000);

    return { accountLink, error };
  };

  useEffect(() => {
    if (sessionURL) {
      window.location.replace(sessionURL);
    }
  }, [sessionURL]);

  useEffect(() => {
    if (stripeIDToFireBase !== null && user !== null) {
      updateDoc(doc(db, "users", user.uid), {
        stripeID: stripeIDToFireBase,
      })
        .then(() => {
          //all good
          console.log("ID submitted");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    }
  }, [stripeID, user]);

  return (
    <>
          <LoggedOutHeader />

<Center>
   <div class="w-1/3 ">
<div class="my-5 flex gap-x-3 ">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-11 h-10">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>


  <div class="grow">
    <h1 class="font-semibold text-xl text-gray-800 ">
      Set Up Payments
    </h1>

    <p class="text-sm text-gray-500 ">
      We use a Third-Party Payment processor (Stripe) to facilitate all of our financial transactions. Getting set up with them only takes a few minutes. Or you can do it later from your Account Settings Tab.
    </p>
  </div>
</div>

<div class="bg-white  shadow-sm rounded-xl  ">
  <form>
    <div class="py-2 sm:py-4 px-2">
      <div class="p-4 space-y-5">
     
        {/* <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
          <div class="sm:col-span-3">
            <label class="sm:mt-2.5 inline-block text-sm text-gray-500 ">
              Avatar
            </label>
          </div>
      

          <div class="sm:col-span-9">
        
            <div class="flex flex-wrap items-center gap-3 sm:gap-5">
              <span class="flex flex-shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full ">
                <svg class="flex-shrink-0 size-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </span>

              <div class="grow">
                <div class="flex items-center gap-x-2">
                  <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500" >
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    Upload photo
                  </button>
                </div>
              </div>
            </div>
           
          </div>
       
        </div> */}
  
        
   
    
      
    

  
       
        <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
          <div class="sm:col-span-3">
            <label for="hs-pro-daufad" class="sm:mt-2.5 inline-block text-md text-gray-500 ">
              Start Onboarding
            </label>
          </div>
   

          <div class="sm:col-span-9 space-y-3">
           

            <div class="p-6 pt-0 flex justify-end gap-x-2">
      <div class="w-full flex justify-end items-center gap-x-2">
      <button type="button" class="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50" data-hs-overlay="#hs-pro-daem" onClick={() => navigate("/DoerMapScreen", {state: {firstVisit: true}})}>
            Skip
          </button>

        <input type="button"  value="Sign Up"   onClick={() => initializeOnboarding()} class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-500  hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 " data-hs-overlay="#">
          
        </input>
      </div>
    </div>

           

            
          </div>
       
        </div>
       
      </div>

    </div>
  
   
  </form>
</div>
</div>

</Center>

     
    </>
  );
};

export default StripeSetUp;
