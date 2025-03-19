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
import { auth } from "../../firebaseConfig";

import { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import fulfil180 from "../../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { FcGoogle } from "react-icons/fc";
import { useMediaQuery } from "@chakra-ui/react";

const LoggedOutHeaderAbout = (props) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenWrongInfo,
    onOpen: onOpenWrongInfo,
    onClose: onCloseWrongInfo,
  } = useDisclosure();

  useEffect(() => {
    if (props.props === true) {
      onOpen();
    }
  }, [props]);

  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const test = () => {
    console.log("test");
  };

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
            //   results[0]._document === null && results[1]._document === null
            // ? console.log("new")
            // : ( results[0]._document !== null &&
            //   results[0]._document.data.value.mapValue.fields.isEmployer)
            // ? console.log("doer")
            // : console.log("needer")
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

  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyDown, true);
  // }, [])
  // const handleKeyDown = (e) => {
  // if (e.key === "Enter") {
  //   e.preventDefault();
  //   modalValidate()
  // }
  // };

  useEffect(() => {
    console.log("email", email);
  }, [email]);

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

  const dropdownButton = document.querySelector("#dropdown");
  const dropdownList = document.querySelector("#dropdown + div.hidden");

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // credit Sreenath H B input instead of button for submission/log in https://stackoverflow.com/questions/23420795/why-would-a-button-click-event-cause-site-to-reload-in-a-bootstrap-form
  return (
    <>
      {isDesktop ? (
        <>
          <header class="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm ">
            <nav
              class="mt-6 relative max-w-[85rem] w-full bg-white  mx-2 py-3 px-4 md:flex md:items-center md:justify-between md:py-0 md:px-6 lg:px-8 xl:mx-auto "
              aria-label="Global"
            >
              <div class="flex align-center items-center justify-center">
                {/* <!-- Logo --> */}
                <a
                  class="flex-none text-4xl font-sans font-bold text-sky-400 cursor-pointer"
                  aria-label="Brand"
                  onClick={() => navigate("/")}
                >
                  Fulfil
                </a>
                <div class="ml-[32px] flex flex-col align-bottom items-baseline md:flex-row  md:gap-y-0 md:gap-x-7 text-base bottom-0 mt-auto">
                  <div>
                    <a
                      class="inline-block text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-600 cursor-pointer"
                      onClick={() => navigate("/About")}
                    >
                      About
                    </a>
                  </div>
                  <div>
                    <a
                      class="inline-block text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:text-gray-600 "
                      onClick={() => navigate("/EntryResumeBuilder")}
                    >
                     Resume Builder
                    </a>
                  </div>
                  <div>
                    <a
                      class="inline-block text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:text-gray-600 "
                      onClick={() => navigate("/QuizFormHolder")}
                    >
                    Career Quiz
                    </a>
                  </div>
                </div>
                {/* <!-- End Logo --> */}
              </div>
              {/* <!-- Button Group --> */}
              <div class="flex items-center align-center justify-center md:order-3 md:col-span-3 mt-4">
                <div className="md:space-x-3 ">
                  <button
                    class="font-medium text-gray-500 hover:text-gray-400 md:py-6"
                    onClick={() => onOpen()}
                  >
                   Sign in
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => navigate("/OnboardingOneDoer")}
                    // onClick={() => navigate("/OnboardingOne")}
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
                    Log in
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
      <main id="content">
        <div class="max-w-[85rem] mx-auto pt-6 pb-5 px-4 sm:px-6 lg:px-8 md:pt-8"></div>
      </main>
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        size={{ base: "full", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <div class="mt-7 bg-white rounded-xl ">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
                <p class="mt-2 text-sm text-gray-600">
                  Your career is too important to settle
                </p>
              </div>

              <div class="mt-5">
                {/* <button
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
                  Sign in with Google
                </button> */}

                {/* <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
                  Or
                </div> */}

                <form>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="email" class="block text-sm mb-2">
                        Email address
                      </label>
                      <div class="relative">
                        <input
                          type="email"
                          label="email"
                          onChange={(e) => setEmail(e.target.value)}
                          className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          required
                          aria-describedby="email-error"
                        />
                        {emailValidationBegun === true ? (
                          <p class="block text-sm mb-2 text-red-500">
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
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                          required
                          aria-describedby="password-error"
                        />
                        {passwordValidationBegun === true ? (
                          <p class="block text-sm mb-2 text-red-500">
                            {passwordValidationMessage}
                          </p>
                        ) : null}
                      </div>
                      <p
                        class="hidden text-xs text-red-600 mt-2"
                        id="password-error"
                      >
                        8+ characters required
                      </p>
                    </div>

                    <div class="flex items-center">
                      <div class="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          class="shrink-0 mt-0.5 border-gray-200  text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div class="ms-3">
                        <label for="remember-me" class="text-sm">
                          Remember me
                        </label>
                      </div>
                    </div>

                    {isLoading ? (
                      <button className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none">
                        <div
                          class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full "
                          role="status"
                          aria-label="loading"
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </button>
                    ) : (
                      <input
                        type="button"
                        onClick={() => modalValidate()}
                        value="Sign In"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                      ></input>
                    )}

                    <p class="mt-2 text-sm text-gray-600">
                      Don't have an account yet?
                      <button
                        class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                        onClick={() => navigate("/OnboardingOneDoer")}
                      >
                        Sign up here
                      </button>
                    </p>
                    <p class="mt-2 text-sm text-gray-600">
                      Forgot your password?
                      <button
                        class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                        onClick={() => navigate("/ResetPasswordLoggedOut")}
                      >
                        Reset your password
                      </button>
                    </p>
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

export default LoggedOutHeaderAbout;
