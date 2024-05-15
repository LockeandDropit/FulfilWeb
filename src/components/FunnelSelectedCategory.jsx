import React, { useState, useEffect } from "react";

import Header from "./Header.jsx";

import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
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
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation } from "react-router-dom";
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
} from "firebase/firestore";
import star_corner from "../images/star_corner.png";
import star_filled from "../images/star_filled.png";
import { useMediaQuery } from "@chakra-ui/react";
import LoggedOutHeader from "./Landing/LoggedOutHeader.jsx";

const FunnelSelectedCategory = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();

  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Blue Bird https://www.pexels.com/photo/man-standing-beside-woman-on-a-stepladder-painting-the-wall-7217988/

  const [input, setInput] = useState("");
  const location = useLocation();

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

  const onSignUp = async () => {
    const authentication = getAuth();

    await createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
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
      setPasswordValidationMessage("Passwords must be 6 characters or longer");
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
  const passwordRegex = /[^\>]*/;
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

  //handle selected category

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [premiumUsersIds, setPremiumUsersIds] = useState(null);
  const [premiumUsers, setPremiumUsers] = useState(null);
  const [rating, setRating] = useState(null);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (location.state === null) {
    } else {
      console.log("is this the bug?", location.state.category);
      setSelectedCategory(location.state.category);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCategory) {
      const q = query(collection(db, "categories", selectedCategory, "Tier 1"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        let finalResults = [];
        snapshot.docs.forEach((doc) => {
          console.log(doc.id);
          results.push(doc.id);
        });

        results.forEach((results) => {
          const ref = doc(db, "users", results);

          getDoc(ref).then((snapshot) => {
            if (!snapshot.data()) {
              console.log("nothing");
              // console.log(snapshot.data())
            } else {
              console.log(
                "premium doer in this category info",
                snapshot.data()
              );

              finalResults.push({
                ...snapshot.data(),
              });
            }
          });
        });

        setTimeout(() => {
          if (!finalResults || !finalResults.length) {
            setPremiumUsers(null);
          } else {
            setPremiumUsers(finalResults);
          }
        }, 200);

        // if (!results || !results.length) {
        //     setPremiumUsersIds(null)
        // } else {
        //     setPremiumUsersIds(results)
        // }
      });
    }
  }, [selectedCategory]);

  const [isDesktop] = useMediaQuery("(min-width: 500px)");
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
                ? "/AddProfileInfo"
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

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  //Card Social User PRofile Sample Template credit https://chakra-templates.vercel.app/components/cards
  return (
    <>
      {/* <Header props={openModal} /> */}
      <LoggedOutHeader props={openModal} />

      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
          <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">
                  Choose from top contractors who specialize in{" "}
                  {selectedCategory}
                </h1>
                <p class="mt-2 text-sm text-gray-600">
                  Don't have an account yet?
                  <button
                    class="text-sky-400 decoration-2 hover:underline ml-1 font-medium"
                    onClick={() => navigate("/NeederEmailRegister")}
                  >
                    Sign up here
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
                  Sign in with Google
                </button>

                <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
                  Or
                </div>

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
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          required
                          aria-describedby="email-error"
                        />
                        <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            class="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p
                        class="hidden text-xs text-red-600 mt-2"
                        id="email-error"
                      >
                        Please include a valid email address so we can get back
                        to you
                      </p>
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
                          id="password"
                          name="password"
                          class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                          required
                          aria-describedby="password-error"
                        />
                        <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            class="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
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
                          class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div class="ms-3">
                        <label for="remember-me" class="text-sm">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="w-full">
            
            {premiumUsers ? (
              premiumUsers.map((premiumUser) => (
                <li className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    {premiumUser.profilePictureResponse ? (
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={premiumUser.profilePictureResponse}
                      />
                    ) : (null)}

                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {premiumUser.firstName}
                      </p>

                      <p className="mt-1 truncate text-xs leading-5 text-gray-500"></p>
                      {premiumUser.numberOfRatings ? (
                        <Flex>
                          {maxRating.map((item, key) => {
                            return (
                              <Box
                                activeopacity={0.7}
                                key={item}
                                marginTop="5px"
                              >
                                <Image
                                  boxSize="16px"
                                  src={
                                    item <= premiumUser.rating
                                      ? star_filled
                                      : star_corner
                                  }
                                ></Image>
                              </Box>
                            );
                          })}
                          <Text marginLeft="4px">
                            ({premiumUser.numberOfRatings} reviews)
                          </Text>
                        </Flex>
                      ) : (
                        <p marginTop="2px">No reviews yet!</p>
                      )}
                      {premiumUser.premiumCategoryOne ? (
                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-blue-100 text-blue-700 ">
                          {premiumUser.premiumCategoryOne}
                        </span>
                      ) : null}

                      {premiumUser.premiumCategoryTwo ? (
                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-blue-100 text-blue-700 m-1">
                          {premiumUser.premiumCategoryTwo}
                        </span>
                      ) : null}
                      {premiumUser.premiumCategoryThree ? (
                        <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-blue-100 text-blue-700 m-1">
                          {premiumUser.premiumCategoryThree}
                        </span>
                      ) : null}

                      <div className="mt-2">
                        <p>{premiumUser.bio}</p>
                      </div>

                      {/* <div className="sm:items-end bottom-0 right-0 mt-4">
                        <button class="w-auto py-2 px-4 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none ">
                          contact
                        </button>
                      </div> */}
                    </div>
                  </div>

                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    

                    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 r text-xs font-medium bg-green-100 text-green-500 ">
                      Premium Contractor
                    </span>
                    <button class="w-auto py-2 px-10 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none bottom-36 absolute"  onClick={() => handleOpenModal()}>
                          contact
                        </button>
                  </div>
                </li>
              ))
            ) : isDesktop ? (
              <p className="ml-40">Sorry! No {selectedCategory} pros in your area.</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default FunnelSelectedCategory;
