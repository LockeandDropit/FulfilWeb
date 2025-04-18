import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Center,
} from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../../firebaseConfig";
import { useUserStore } from "../../../../Doer/Chat/lib/userStore";
import { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import posthog from "posthog-js";

import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { FcGoogle } from "react-icons/fc";
import { useMediaQuery } from "@chakra-ui/react";
import { useQuizStore } from "../quizStore";

const QuizHeader = (props) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenWrongInfo,
    onOpen: onOpenWrongInfo,
    onClose: onCloseWrongInfo,
  } = useDisclosure();

  const [result, setResult] = useState(null);

  const {chosenCareerPath} = useQuizStore(); 

  const {
    personalValues,
    currentPay,
    payGoal,
    city,
    state,
    talents,
    workEnvironment,
    passion,
    personality,
    learningAndDevelopment,
    longTerm,
    allCareerPathOptions,
    quizCompleted,
   
  } = useQuizStore();

  console.log("chose career path",   personalValues,
    currentPay,
    payGoal,
    city,
    state,
    talents,
    workEnvironment,
    passion,
    personality,
    learningAndDevelopment,
    longTerm,
    allCareerPathOptions,
    quizCompleted,
  )

  useEffect(() => {
    if (props.props === true) {
      onOpen();
    }
  }, [props]);

  //TODO: Do i have to ipass the selected job as a prop to this component? Will it not register quickly enough for local storage?

  useEffect(() => {
    if (props.result !== null) {
      setResult(props.result);
    }
  }, [props]);

  useEffect(() => {
    console.log("props", props.result);
  }, [props]);

  const { fetchUserInfo } = useUserStore();

  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const logIn = () => {
    setIsLoading(true);
    console.log("logging in");
    const auth = getAuth();
    console.log("logging in");
    setPersistence(auth, browserLocalPersistence).then(() => {
      // New sign-in will be persisted with local persistence.
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          setIsSignedIn(true);
          // Thanks Jake :)
          Promise.all([
            getDoc(doc(db, "users", response.user.uid)),
            getDoc(doc(db, "employers", response.user.uid)),
          ])
            .then((results) =>
              navigate(
                results[0]._document !== null &&
                  results[0]._document.data.value.mapValue.fields.isEmployer
                  ? "/DoerHomepage"
                  : "/Homepage"
              )
            )
            .catch();
          setIsLoading(false);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          setPasswordValidationMessage("Oops! Wrong email or password");
          setIsLoading(false);
        });
    });
    setIsLoading(false);
    // template credit simple log in card https://chakra-templates.vercel.app/forms/authentication
  };

  const handleGoogleSignUp = async () => {
    const provider = await new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
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
                ? "/DoerHomepage"
                : "/Homepage"
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

  const [visibleToggle, setVisibleToggle] = useState("password");

  const handlePasswordVisible = () => {
    if (visibleToggle === "password") {
      setVisibleToggle("email");
    } else if (visibleToggle === "email") {
      setVisibleToggle("password");
    }
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState();

  //credit https://www.sitepoint.com/using-regular-expressions-to-check-string-length/
  //credit alex gittemeier https://stackoverflow.com/questions/17439917/regex-to-accept-alphanumeric-and-some-special-character-in-javascript
  // const passwordRegex = /^[A-Za-z0-9_@./#&+-]{6,20}$/;

  //credit Vivek S. & xanatos https://stackoverflow.com/questions/5058416/regular-expressions-how-to-accept-any-symbol
  const passwordRegex = /[^\>]*/;
  const [passwordValidationBegun, setPasswordValidationBegun] = useState(false);

  const [validationMessage, setValidationMessage] = useState();
  // credit https://github.com/chelseafarley/text-input-validation-tutorial-react-native/blob/main/App.js
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailValidationBegun, setEmailValidationBegun] = useState(false);

  const [nameValidationMessage, setNameValidationMessage] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const modalValidate = () => {
    setIsLoading(true);
    setEmailValidationBegun(true);
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setValidationMessage("Please enter a valid email");
      console.log(" email", email, isValid);
    } else {
      setValidationMessage();
      setEmail(email);

      console.log("email good");
    }
    setPasswordValidationBegun(true);
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
    } else {
      setPasswordValidationMessage();

      console.log("password good");
    }

    if (isValid && isValidPassword) {
      logIn();
    } else {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleModalClose = () => {
    onClose();
    navigate("/NeederEmailRegister");
  };

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const [returnedEducation, setReturnedEducation] = useState(null);
  const [returnedJobs, setReturnedJobs] = useState(null);

  const [jobsReady, setJobsReady] = useState(false);
  const [eduReady, setEduReady] = useState(false);

  const getEdu = async () => {
    const response = await fetch(
      // "http://localhost:8000/getEdu", {
      "https://openaiapi-c7qc.onrender.com/getEdu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: `The user's location is ${city}, ${state}. The user's current pay is ${currentPay}. The user is interested in ${chosenCareerPath[0].career_title}`,
      }),
    });
    if (!response.ok) {
      // throw new Error(`Response status: ${response.status}`);
      getEdu();
    }

    const json = await response.json();
    console.log("json resopnse w array EDU", JSON.parse(json.message.content));

    setReturnedEducation(JSON.parse(json.message.content));
    setEduReady(true);
  };

  const getjobs = async () => {
    const response = await fetch(
      // "http://localhost:8000/getJobs",
      "https://openaiapi-c7qc.onrender.com/getJobs",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `The user would like to work in ${chosenCareerPath[0].career_title} They live in ${city}, ${state}. They make ${currentPay} and would like to make ${payGoal}`,
        }),
      }
    );
    if (!response.ok) {
      // throw new Error(`Response status: ${response.status}`);
      getjobs();
    }

    const json = await response.json();
    console.log("response", JSON.parse(json.message.content));

    setReturnedJobs(JSON.parse(json.message.content));

    setJobsReady(true);
  };

  useEffect(() => {
    console.log("check", chosenCareerPath, allCareerPathOptions, quizCompleted)
    if (quizCompleted === true && chosenCareerPath ) {
      getjobs();
      getEdu();

      console.log("check if all is passed correctly", chosenCareerPath, allCareerPathOptions)
    }
  }, [ chosenCareerPath, quizCompleted]);

  const submitToDB = async (user) => {
    const payload = {
      user_id:    user.uid,
      city:       city,
      state:      state,
      first_name: firstName,
      last_name:  lastName
    };
  
    try {
      const response = await fetch('http://localhost:8000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      console.log('User added successfully');
    } catch (err) {
      console.error('Fetch failed:', err);
    }
    }
  
  

  const updateUserProfileFirestore = (user) => {
    //submit data
    setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      city: city,
      state: state,
      uid: user.uid,
      // isPremium: false,
      // isEmployer: false,
      // email: user.email,
      // streamChatID: user.uid,
      // isOnboarded: false,
      // emailVerified: false,
      // userPreferredIndustry: null,
      // resumeUploaded: false,
      // stripeOnboarded: false,
      // savedCareerInterests: [],
      // PrivacyPolicyAgree: privacyPolicy,
      // ageAgreement: ageAgreement,
      // termsOfService: termsOfService,
      // currentIncome: currentPay,
      // goalIncome: payGoal,
      // allCareerPathOptions: allCareerPathOptions,
      // chosenCareerPath: chosenCareerPath[0],
      // quizAnswers: {
      //   personalValues: personalValues,
      //   talents: talents,
      //   workEnvironment: workEnvironment,
      //   passion: passion,
      //   learningAndDevelopment: learningAndDevelopment,
      //   longTerm: longTerm,
      // },
      // returnedEducation: returnedEducation,
      // returnedJobs: returnedJobs,

      // industryReccomendation: {
      //   average_pay: chosenCareerPath[0].average_salary,
      //   outlook: chosenCareerPath[0].description,
      //   overview: chosenCareerPath[0].description,
      //   recommendation: chosenCareerPath[0].career_title,
      //   growth: chosenCareerPath[0].industry_growth,
      // },
    })
      .then(() => {
        fetchUserInfo(user.uid);
        //call api job/education fetch here
        //pass user data to SQL db
        // submitToDB(user)
        console.log("data submitted, new chat profile created");
        navigate("/DoerHomepage");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSignUp = async () => {
    console.log("hit sign up", jobsReady, eduReady);

  
      const authentication = getAuth();

      await createUserWithEmailAndPassword(authentication, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          // Send localstore info to FB backend, include firstname and last name
          console.log("hit sign up ehres tghe user obj", user);
          submitToDB(user)
          updateUserProfileFirestore(user);
        
        })
        .catch((error) => {
          alert("oops! That email is already being used.");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
  
  };

  const handleSendEmail = async () => {
    const response = await fetch(
      "https://emailapi-qi7k.onrender.com/sendDoerNotSubscribed",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
  };

  // help from Can Küçükyılmaz per https://stackoverflow.com/questions/71679442/show-hide-multiple-password-in-react-js
  const [isVisible, setIsVisible] = useState(false);

  const {
    isOpen: isOpenTOS,
    onOpen: onOpenTOS,
    onClose: onCloseTOS,
  } = useDisclosure();
  const {
    isOpen: isOpenIncomplete,
    onOpen: onOpenIncomplete,
    onClose: onCloseIncomplete,
  } = useDisclosure();

  const [agreedAll, setAgreedAll] = useState(false);
  //handle check agreements
  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [ageAgreement, setAgeAgreement] = useState(false);

  const handleAgreeAll = () => {
    setAgreedAll(!agreedAll);
    // setTaxAgreementConfirmed(true);
    setTermsOfService(!termsOfService);
    setPrivacyPolicy(!privacyPolicy);
    //this is depreciated, only kept for now so I dont need to fiddle with all that other code
    setAgeAgreement(!ageAgreement);
  };

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
    if (!firstName || !lastName) {
      setNameValidationMessage("Please enter your first and last name");
    } else {
      setNameValidationMessage();
    }
    if (isValid && isValidPassword && firstName && lastName) {
      onSignUp();
    }
  };

  //TO DO:
  // On sign up send all locally stored data to a new user profile.
  // Require first and last name in this field
  // increase width on quiz progress tracker.

  // credit Sreenath H B input instead of button for submission/log in https://stackoverflow.com/questions/23420795/why-would-a-button-click-event-cause-site-to-reload-in-a-bootstrap-form
  return (
    <>
      {isDesktop ? (
        <>
          <header class=" flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm ">
            <nav
              class="mt-6 relative max-w-[85rem] w-full bg-white  mx-2 py-3 px-4 md:flex md:items-center md:justify-between md:py-0 md:px-6 lg:px-8 xl:mx-auto "
              aria-label="Global"
            >
              <div class="flex align-center items-center justify-center ">
                {/* <!-- Logo --> */}
                <a
                  class="flex-none text-4xl font-sans font-bold text-sky-400 cursor-pointer"
                  aria-label="Brand"
                  onClick={() => navigate("/")}
                >
                  Fulfil
                </a>
              </div>
              {/* <!-- Button Group --> */}
              <div class="flex items-center align-center justify-center md:order-3 md:col-span-3 mt-4">
                <div className="md:space-x-3">
                  {/* <button
                    class="font-medium text-gray-500 hover:text-gray-400 md:py-6"
                    onClick={() => onOpen()}
                  >
                    Log In
                  </button> */}
                  {/* <button
                    class="sm:mr-2 font-medium text-gray-500 hover:text-gray-400 md:py-6"
                    onClick={() => onOpen()}
                  >
                    Sign 
                  </button> */}
                  <button
                    type="button"
                    className="py-2.5 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => onOpen()}
                  >
                    <svg
                      class="flex-shrink-0 size-4"
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Sign up
                  </button>
                </div>
              </div>

              {/* <!-- End Button Group -->

    <!-- Collapse --> */}

              {/* <div id="hs-navbar-hcail" class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6" aria-labelledby="hs-navbar-hcail-collapse">
      <div class="ml-[80px] flex flex-col gap-y-4 gap-x-0 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 text-base">
        <div>
          <a class="inline-block text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-600 mt-2 cursor-pointer" onClick={() => navigate("/About")}>About</a>
        </div>
        <div>
          <a class="inline-block text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-600 mt-2" href="#">Partners</a>
        </div>
        <div>
          <a class="inline-block text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-600 mt-2" href="#">Careers</a>
        </div>
      </div>
    </div> */}
            </nav>
          </header>
        </>
      ) : (
        <>
          <header class="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
            <nav
              class="mt-6 relative max-w-[85rem] w-full bg-white  mx-2 py-3 px-4 md:flex md:items-center md:justify-between md:py-0 md:px-6 lg:px-8 xl:mx-auto"
              aria-label="Global"
            >
              <div class="flex items-center justify-between">
                <a
                  class="flex-none text-4xl font-sans font-bold text-sky-400"
                  aria-label="Brand"
                  onClick={() => navigate("/")}
                >
                  Fulfil
                </a>
                <div class="md:hidden">
                  <button
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    // onClick={() => navigate("/OnboardingOneDoer")}
                    onClick={() => onOpen()}
                  >
                    <svg
                      class="flex-shrink-0 size-4"
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Sign up
                  </button>
                </div>
              </div>
            </nav>
          </header>
        </>
      )}

      {/* <main id="content">
        <div class="max-w-[85rem] mx-auto pt-12 pb-10 px-4 sm:px-6 lg:px-8 md:pt-24"></div>
      </main> */}

      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        size={{ base: "full", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <div class=" bg-white  mt-4 rounded-xl shadow-sm ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-3xl font-bold text-gray-800">
                  Find the right fit.
                </h1>
                <h1 class="block text-2xl font-bold text-gray-800">
                  Connect with your{" "}
                  <span className="text-sky-400 text-3xl">future.</span>
                </h1>
                <p class="mt-2 text-sm text-gray-600">
                  Already have an account?
                  <button
                    class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                    // onClick={() => handleOpenModal()}
                  >
                    Sign in here
                  </button>
                </p>
              </div>

              <div class="mt-5">
                <button
                  type="button"
                  class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => handleGoogleSignUp()}
                >
                  <svg
                    class="w-4 h-auto"
                    width="46"
                    height="47"
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                  Sign up with Google
                </button>

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
                  Or
                </div>

                <form>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="email" class="block text-sm mb-2">
                        First Name
                      </label>
                      <div class="relative">
                        <input
                          name="First Name"
                          onChange={(e) => setFirstName(e.target.value)}
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="email" class="block text-sm mb-2">
                        Last Name
                      </label>
                      <div class="relative">
                        <input
                          name="Last Name"
                          onChange={(e) => setLastName(e.target.value)}
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        />
                        {nameValidationMessage && (
                          <p class="mt-1 block text-sm mb-2 text-red-500">
                            {nameValidationMessage}
                          </p>
                        )}
                      </div>
                    </div>

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
                        {emailValidationBegun === true ? (
                          <p class="mt-1 block text-sm mb-2 text-red-500">
                            {validationMessage}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between items-center">
                        <label for="password" class="block text-sm mb-2">
                          Password
                        </label>
                        {/* <a class="text-sm text-blue-600 decoration-2 hover:underline font-medium" href="../examples/html/recover-account.html">Forgot password?</a> */}
                      </div>
                      <div class="relative">
                        <input
                          type={isVisible ? "text" : "password"}
                          id="password"
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          required
                          aria-describedby="password-error "
                        />
                        {isVisible ? (
                          <div
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute inset-y-0 end-2 flex items-center ps-4 "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5 flex-end"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>{" "}
                          </div>
                        ) : (
                          <div
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute inset-y-0 end-2 flex items-center ps-4 "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5 flex-end"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>{" "}
                          </div>
                        )}
                      </div>
                      {passwordValidationBegun === true ? (
                        <p class="mt-1 block text-sm mb-2 text-red-500">
                          {passwordValidationMessage}
                        </p>
                      ) : null}
                    </div>

                    <div className="">
                      <div className="mt-5 space-y-10">
                        <fieldset>
                          <legend className="text-lg font-semibold leading-6 text-gray-900">
                            User Agreements
                          </legend>
                          <div className="mt-6 space-y-6">
                            <div className="relative flex gap-x-3">
                              <div className="flex h-6 items-center">
                                <input
                                  id="candidates"
                                  name="candidates"
                                  onChange={(e) =>
                                    handleAgreeAll(e.target.checked)
                                  }
                                  type="checkbox"
                                  checked={agreedAll}
                                  className="cursor-pointer h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                                />
                              </div>
                              <div
                                className="text-sm leading-6"
                                onClick={(e) =>
                                  handleAgreeAll(e.target.checked)
                                }
                              >
                                <label className="font-medium text-gray-900">
                                  I have read and agree to the{" "}
                                  <span
                                    class="text-sky-400"
                                    onClick={() => onOpen()}
                                  >
                                    {" "}
                                    Privacy Policy
                                  </span>
                                  ,{" "}
                                  <span
                                    class="text-sky-400 mr-1"
                                    onClick={() => onOpenTOS()}
                                  >
                                    Terms of Service
                                  </span>
                                  and am at least 16 years old.
                                </label>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    {/* {agreedAll && jobsReady && eduReady ? ( */}
                    {agreedAll ? (
                      <input
                        type="button"
                        onClick={() => validate()}
                        // onClick={() => submitToDB()}
                        value="Sign Up"
                        className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                      ></input>
                    ) : (
                      <input
                        type="button"
                        value="Sign Up"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-200 text-white  disabled:opacity-50 disabled:pointer-events-none"
                      ></input>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuizHeader;
