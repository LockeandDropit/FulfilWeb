import React, { useState, useEffect, useCallback } from "react";
import NeederDashboard from "../../NeederDashboard";
import NeederHeader from "../../NeederHeader";
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
  Spinner,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import {
  arrayUnion,
  serverTimestamp,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StreamChat } from "stream-chat";
import { useChatContext } from "stream-chat-react";
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
  Image,
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
import Header from "../../Components/Header";
import Dashboard from "../../Components/Dashboard";
import { useMediaQuery } from "@chakra-ui/react";
import ImageUploading from "react-images-uploading";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import star_corner from "../../../../images/star_corner.png";
import star_filled from "../../../../images/star_filled.png";
import useEmblaCarousel from "embla-carousel-react";

const ApplicantProfile = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  //grabs client using streamChat api

  const starImgFilled = `url(${star_filled})`;
  const starImgCorner = `url(${star_corner})`;

  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const [user, setUser] = useState(null);
  //New code
  const location = useLocation();


  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [applicant, setApplicant] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [employerLastName, setEmployerLastName] = useState(null);
  const [isHourly, setIsHourly] = useState(null);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    if (location.state === null) {
    } else {
      console.log("is this the bug?", location.state);
      setApplicant(location.state.applicant);
      setJobTitle(location.state.jobTitle);
      setJobID(location.state.jobID);
      setIsHourly(location.state.isHourly);
    }
  }, [location]);




  console.log("This is applicant", applicant)
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  useEffect(() => {
    //get rid of useEffect that calls this data from FB. Check if is hourly, then set isFlat rate based off of that. This will negate that weird crash???

    if (isHourly === true) {
    } else {
      setIsFlatRate(true);
    }
  }, [isHourly]);

  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "users", applicant.streamChatID, "Ratings")
      );

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          ratingResults.push(doc.data().rating);
        });

        if (!ratingResults || !ratingResults.length) {
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  //gets employer info to place in db (messages) for applicant use
  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setEmployerFirstName(snapshot.data().firstName);
        setEmployerLastName(snapshot.data().lastName);
        //get profile picture here as well?
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture)

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (applicant) {
      getProfilePicture();
    } else {
    }
  }, [applicant]);

  const getProfilePicture = async () => {
    const storage = getStorage();
    const reference = ref(
      storage,
      "users/" + applicant.streamChatID + "/profilePicture.jpg"
    );
    await getDownloadURL(reference).then((response) => {
      setProfilePicture(response);
    });
  };

  //redux store
  // const firstName = useSelector(selectUserFirstName);
  // const lastName = useSelector(selectUserLastName);
  // const bio = useSelector(selectUserBio);
  // const state = useSelector(selectUserState);
  // const experience = useSelector(selectUserExperience);
  // const skills = useSelector(selectUserSkills);

  //for test only

  //firestore

  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userBio, setUserBio] = useState(null);
  const [userState, setUserState] = useState();
  const [userExperience, setUserExperience] = useState(null);
  const [userSkills, setUserSkills] = useState(null);
  const [userCity, setUserCity] = useState();
  const [individualReviews, setIndividualReviews] = useState(null);
  const [] = useState();
  const [hasRun, setHasRun] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [profilePictureResponse, setProfilePictureResponse] = useState(null)
  const [email, setEmail] = useState(null)

  useEffect(() => {
    if (applicant != null) {
      const docRef = doc(db, "users", applicant.streamChatID);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
     setProfilePictureResponse(snapshot.data().profilePictureResponse)
        setUserState(snapshot.data().state);
        setEmail(snapshot.data().email)
        setUserCity(snapshot.data().city);
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  useEffect(() => {
    if (applicant != null) {
      const docRef = doc(db, "users", applicant.streamChatID);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  const [userExperienceLength, setUserExperienceLength] = useState(0);
  const [userSkillsLength, setUserSkillsLength] = useState(0);

  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const skillsQuery = query(
        collection(db, "users", applicant.streamChatID, "User Profile Skills")
      );
      const experienceQuery = query(
        collection(
          db,
          "users",
          applicant.streamChatID,
          "User Profile Experience"
        )
      );

      onSnapshot(skillsQuery, (snapshot) => {
        let skills = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          skills.push({ ...doc.data(), id: doc.id });
        });
        console.log(skills);
        setUserSkills(skills);

        if (!skills || !skills.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserSkills(null);
          setUserSkillsLength(0);
        } else {
          setUserSkills(skills);
          setUserSkillsLength(skills.length);
        }
      });

      onSnapshot(experienceQuery, (snapshot) => {
        let experience = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          experience.push({ ...doc.data(), id: doc.id });
        });
        console.log(experience);
        // setUserExperience(experience);
        if (!experience || !experience.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setUserExperience(null);
          setUserExperienceLength(0);
        } else {
          setUserExperience(experience);
          setUserExperienceLength(experience.length);
        }
      });
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  //pulls cumulative reviews
  useEffect(() => {
    if (applicant != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(
        collection(db, "users", applicant.streamChatID, "Ratings")
      );

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          if (isNaN(doc.data().rating)) {
            console.log("not a number");
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
        }
      });
      // console.log(rating);
    } else {
      console.log("oops!");
    }
  }, [applicant]);

  //help from https://www.youtube.com/watch?v=276IyIIdJnA fro star stuff.

  const navigate = useNavigate();

  const [isVolunteer, setIsVolunteer] = useState(null);

  //gets whether or not job is volunteer
  // useEffect(() => {
  //   if (jobID != null) {
  //     const docRef = doc(db, "All Jobs", jobID);

  //     getDoc(docRef).then((snapshot) => {
  //       if (snapshot.data()) {

  //       }
  //       setIsVolunteer(snapshot.data().isVolunteer);
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [jobID]);

  //deletes applicant
  const deleteApplicant = () => {
    deleteDoc(
      doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        jobTitle,
        "Applicants",
        applicant.streamChatID
      )
    )
      .then(() => {
        //user info submitted to Job applicant file
        console.log("Applicant Deleted");

        navigate(-1);
      })
      .catch((error) => {
        //uh oh
        console.log(error);
      });
  };

  const createInterviewChat = () => {
    setDoc(doc(db, "Messages", "intermediate", jobID, "Info"), {
      jobTitle: jobTitle,
      applicantFirstName: userFirstName,
      applicantLastName: userLastName,
      applicantID: applicant.streamChatID,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerID: user.uid,
      isHired: false,
      isHourly: isHourly,
      isFlatRate: isFlatRate,
      isVolunteer: false,
      needsDeposit: false,
      // applicantAvatar: profilePictureURL,
      // employerAvatar: employerProfilePictureURL
    })
      .then(() => {
        console.log("new chat created global");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "Messages", jobID), {
      jobTitle: jobTitle,
      jobID: jobID,
      applicantFirstName: userFirstName,
      applicantLastName: userLastName,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      applicantID: applicant.streamChatID,
      employerID: user.uid,
      isHired: false,
      isHourly: isHourly,
      isFlatRate: isFlatRate,
      confirmedRate: 0,
      jobOffered: false,
      applicationSent: false,
      isVolunteer: false,
      // applicantAvatar: profilePictureURL,
      // employerAvatar: employerProfilePictureURL,
      // applicantInitials: here,
      // employerInitials: here
    })
      .then(() => {
        console.log("new chat created global");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "employers", user.uid, "User Messages", jobID), {
      placeholder: null,
    })
      .then(() => {
        console.log("new chat created employer");
      })
      .catch((error) => {
        console.log(error);
      });

    setDoc(doc(db, "users", applicant.streamChatID, "User Messages", jobID), {
      placeholder: null,
    })
      .then(() => {
        console.log("new chat created applicant");
        // navigation.navigate("MessagesFinal", { props: jobID, firstInterview: true, applicantFirstName: userFirstName });
      })
      .catch((error) => {
        console.log(error);
      });

    //add JobID to active chat list for both applicant and employer

    testNewChannel();
  };

  //modal control

  const [isFlatRate, setIsFlatRate] = useState(null);
  const [applicantFirstName, setApplicantFirstName] = useState(null);

  // useEffect(() => {
  //   if (user !== null) {
  //     const docRef = doc(db, "employers", user.uid, "Posted Jobs", jobTitle);

  //     getDoc(docRef).then((snapshot) => {
  //       if (snapshot.data()) {
  //         console.log("hellp", snapshot.data())
  //         setIsFlatRate(snapshot.data().isFlatRate);
  //         setIsHourly(snapshot.data().isHourly);
  //         // setApplicantFirstName(snapshot.data().applicantFirstName)
  //       } else {
  //       }
  //     });
  //   } else {
  //     console.log("oops!");
  //   }
  // }, [user]);

  const handleModalOpen = () => {
    if (isHourly === true) {
      onOpen();
    } else {
    }
    if (isFlatRate === true) {
      onOpenFlatRate();
    } else {
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFlatRate,
    onOpen: onOpenFlatRate,
    onClose: onCloseFlatRate,
  } = useDisclosure();

  console.log(isHourly);

  console.log("isFlat rate?", isFlatRate);

  const [jobOffered, setJobOffered] = useState(null);
  const [confirmedRate, setConfirmedRate] = useState(null);

  const [isHired, setIsHired] = useState(null);

  //credit https://www.code-sample.com/2019/12/react-allow-only-numbers-in-textbox.html
  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,7}$/;

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);

  const flatRateValidate = (flatRate) => {
    setFlatRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);
    if (!isValid) {
      setFlatRateValidationMessage("Please enter valid rate");
      console.log(flatRateValidationMessage);
    } else {
      setFlatRateValidationMessage();
      setConfirmedRate(flatRate);
    }
  };

  //credit typeof help https://flaviocopes.com/how-to-check-undefined-property-javascript/

  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    const rateValid = minLengthRegEx.test(confirmedRate);

    if (!rateValid || typeof confirmedRate === "undefined") {
      alert("Please enter valid rate");
      setFlatRateValidationMessage("Please enter valid rate");
    } else {
      // sendOffer();
    }
  };

  //initiate interview channel logic

  const client = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);
  const userInfo = {
    id: userID,
    // name: userName,
    // image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };



// new way to initiate messages



const handleAdd = async () => {
  const chatRef = collection(db, "chats");
  const userChatsRef = collection(db, "User Messages");

  try {
    const newChatRef = doc(chatRef);

    await setDoc(newChatRef, {
      createdAt: serverTimestamp(),
      messages: [],
      id: newChatRef.id,
      jobID: jobID
    });

    await updateDoc(doc(userChatsRef, applicant.uid), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.uid,
        updatedAt: Date.now(),
      }),
    });

    await updateDoc(doc(userChatsRef, user.uid), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: applicant.uid,
        updatedAt: Date.now(),
      }),
    });
  } catch (err) {
    console.log(err);
  }
};



  const testNewChannel = async () => {
    setIsLoading(true);
    // client.connectUser(userInfo, client.devToken(userID));

    // const channel = client.channel("messaging", jobID, {
    //   members: [applicant.streamChatID, user.uid],
    //   name: jobTitle,
    // });

    // await channel.create();
    // // setNewChannel(newChannel);

    // // trying to see if this will return access to "unread" message count
    // const startWatching = channel.watch();
    // console.log(startWatching);


    const chatRef = collection(db, "chats");
  const userChatsRef = collection(db, "User Messages");

  try {
    const newChatRef = doc(chatRef);

    await setDoc(newChatRef, {
      createdAt: serverTimestamp(),
      messages: [],
      id: newChatRef.id,
      jobID: jobID,
      jobTitle: jobTitle,
      
    });

    await updateDoc(doc(userChatsRef, applicant.uid), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.uid,
        updatedAt: Date.now(),
        jobID: jobID,
        jobTitle: jobTitle,
        jobType: "Interview",
      isRequest: false,
      jobOfferd: false,
      isHired: false
      }),
    });

    await updateDoc(doc(userChatsRef, user.uid), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: applicant.uid,
        updatedAt: Date.now(),
        jobID: jobID,
        jobTitle: jobTitle,
        jobType: "Interview",
        isRequest: false,
        jobOfferd: false,
        isHired: false
      }),
    });

    await updateDoc(doc(db, "users", applicant.streamChatID, "Applied", jobTitle), {
      hasUnreadMessage: true,
      interviewStarted: true,
      channelID: newChatRef.id,
    })

    await updateDoc(
      doc(
        db,
        "employers",
        userID,
        "Posted Jobs",
        jobTitle,
        "Applicants",
        applicant.streamChatID
      ),
      {
        channelID: newChatRef.id,
      }
    )
    .then(() => {
      setTimeout(() => {
        navigate("/NeederChatEntry", {
          state: {
            selectedChannel: newChatRef.id,
          },
        });
      }, 500)
    })
  } catch (err) {
    console.log(err);
  }

    setTimeout(() => {
      // updateDoc(doc(db, "users", applicant.streamChatID, "Applied", jobTitle), {
      //   hasUnreadMessage: true,
      //   interviewStarted: true,
      
      // })
      //   .then(() => {
      //     console.log("new message updated in Applied");
      //   })
      //   .catch((error) => {
      //     // no bueno
      //     console.log(error);
      //   });

      // updateDoc(
      //   doc(
      //     db,
      //     "employers",
      //     userID,
      //     "Posted Jobs",
      //     jobTitle,
      //     "Applicants",
      //     applicant.streamChatID
      //   ),
      //   {
      //     channelID: channel.cid,
      //   }
      // )
      //   .then(() => {
      //     console.log("new message updated in Applied");
      //   })
      //   .catch((error) => {
      //     // no bueno
      //     console.log(error);
      //   });

     

      setIsLoading(false);
    }, 1000);
  };

  const [isLoading, setIsLoading] = useState(false);


 

  return (
    <>
    <Header />
    <Dashboard />
{applicant ? (
    <main id="content" class=" pt-[24px]">
                          <div class="max-w-6xl mx-auto">
                            <ol class="md:hidden py-3 px-2 sm:px-5 flex items-center whitespace-nowrap">
                              <li class="flex items-center text-sm ">
                                User Profile
                                <svg
                                  class="flex-shrink-0 mx-1 overflow-visible size-4 text-gray-400 "
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
                              </li>

                              <li
                                class="text-sm font-semibold text-gray-800 truncate "
                                aria-current="page"
                              >
                                Profile
                              </li>
                            </ol>

                            <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
                              <div class="p-5 pb-0 bg-white border border-gray-200 shadow-sm rounded-xl ">
                                <figure>
                                  <svg
                                    class="w-full"
                                    preserveAspectRatio="none"
                                    width="1113"
                                    height="161"
                                    viewBox="0 0 1113 161"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_666_220723)">
                                      <rect
                                        x="0.5"
                                        width="1112"
                                        height="161"
                                        rx="12"
                                        fill="white"
                                      ></rect>
                                      <rect
                                        x="1"
                                        width="1112"
                                        height="348"
                                        fill="#D9DEEA"
                                      ></rect>
                                      <path
                                        d="M512.694 359.31C547.444 172.086 469.835 34.2204 426.688 -11.3096H1144.27V359.31H512.694Z"
                                        fill="#C0CBDD"
                                      ></path>
                                      <path
                                        d="M818.885 185.745C703.515 143.985 709.036 24.7949 726.218 -29.5801H1118.31V331.905C1024.49 260.565 963.098 237.945 818.885 185.745Z"
                                        fill="#8192B0"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_666_220723">
                                        <rect
                                          x="0.5"
                                          width="1112"
                                          height="161"
                                          rx="12"
                                          fill="white"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </figure>

                                {/* {profilePicture ? (<img
                    class="object-cover size-full rounded-full"
                    src={profilePicture}
                    
                    alt="Image Description"
                  />) :  ( <svg class="size-full text-gray-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.62854" y="0.359985" width="15" height="15" rx="7.5" fill="white"></rect>
                  <path d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z" fill="currentColor"></path>
                  <path d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z" fill="currentColor"></path>
                </svg>) } */}

                                <div class="-mt-24">
                                  <div class="relative flex w-[120px] h-[120px] mx-auto border-4 border-white rounded-full ">
                                    {profilePictureResponse ? (
                                      <img
                                        class="object-cover size-full rounded-full"
                                        src={profilePictureResponse}
                                        alt="Image Description"
                                      />
                                    ) : (
                                      <svg
                                        class="size-full text-gray-500"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0.62854"
                                          y="0.359985"
                                          width="15"
                                          height="15"
                                          rx="7.5"
                                          fill="white"
                                        ></rect>
                                        <path
                                          d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                                          fill="currentColor"
                                        ></path>
                                        <path
                                          d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                                          fill="currentColor"
                                        ></path>
                                      </svg>
                                    )}
                                  </div>

                                  <div class="mt-3 text-center">
                                    <h1 class="text-xl font-semibold text-gray-800 ">
                                      {userFirstName}{" "}
                                      {userLastName}
                                    </h1>
                                  </div>
                                </div>

                                <div class="mt-7 py-0.5 flex flex-row justify-between items-center gap-x-2 whitespace-nowrap overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                  <div class="pb-3">
                                    {/* <a
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    href="../../pro/dashboard/account-profile.html"
                  >
                    Edit
                  </a> */}
                                  </div>
                                </div>
                              </div>

                              <div class="xl:p-5 flex flex-col xl:bg-white xl:border xl:border-gray-200 xl:shadow-sm xl:rounded-xl ">
                                <div class="xl:flex">
                                  <div
                                    id="hs-pro-dupsd"
                                    class="hs-overlay [--auto-close:xl] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-[320px] bg-white p-5 overflow-y-auto xl:relative xl:z-0 xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 xl:p-0 border-e border-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 "
                                  >
                                    <div class="xl:hidden">
                                      <div class="absolute top-2 end-4 z-10">
                                        <button
                                          type="button"
                                          class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                          data-hs-overlay="#hs-pro-dupsd"
                                        >
                                          <span class="sr-only">Close</span>
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
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                            

                                  
                                    <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                                      <div class="pt-4 first:pt-0">
                                        <h2 class="text-sm font-semibold text-gray-800 ">
                                          Details
                                        </h2>

                                        <ul class="mt-3 space-y-2">
                                          {/* {premiumUser.businessName ? (
                                            <li>
                                              <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                                <svg
                                                  class="flex-shrink-0 size-4 text-gray-600 "
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
                                                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                                  <path d="M10 6h4" />
                                                  <path d="M10 10h4" />
                                                  <path d="M10 14h4" />
                                                  <path d="M10 18h4" />
                                                </svg>
                                              </div>
                                            </li>
                                          ) : null} */}

                                          <li>
                                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                              <svg
                                                class="flex-shrink-0 size-4 text-gray-600 "
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
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                              </svg>
                                              {userCity},{" "}
                                              {userState}
                                            </div>
                                          </li>
                                          <li>
                                            <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                              {numberOfRatings ? (
                                                <Flex>
                                                  {maxRating.map(
                                                    (item, key) => {
                                                      return (
                                                        <Box
                                                          activeopacity={0.7}
                                                          key={item}
                                                          marginTop="4px"
                                                        >
                                                          <Image
                                                            boxSize="16px"
                                                            src={
                                                              item <=
                                                              rating
                                                                ? star_filled
                                                                : star_corner
                                                            }
                                                          ></Image>
                                                        </Box>
                                                      );
                                                    }
                                                  )}

                                                  <Text
                                                    marginTop="4px"
                                                    marginLeft="4px"
                                                  >
                                                    (
                                                    {
                                                      numberOfRatings
                                                    }{" "}
                                                    reviews)
                                                  </Text>
                                                </Flex>
                                              ) : (
                                                <>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="flex-shrink-0 size-4 text-gray-600 "
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                    />
                                                  </svg>
                                                  <Text>No reviews yet</Text>
                                                </>
                                              )}
                                            </div>
                                          </li>
                                          <li>
                                            {/* <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                              <svg
                                                class="flex-shrink-0 size-4 text-gray-600 "
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
                                                <rect
                                                  width="20"
                                                  height="16"
                                                  x="2"
                                                  y="4"
                                                  rx="2"
                                                />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                              </svg>
                                              {email}
                                            </div> */}
                                          </li>
                                        </ul>
                                        <div className="mt-2">
                                          <button
                                            onClick={() =>
                                            createInterviewChat()
                                            }
                                            class="w-full py-2 px-4 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none "
                                          >
                                            Message
                                          </button>
                                        </div>
                                      </div>
                                      <div class="w-full">
                                        <div class="pt-4 first:pt-0 flex flex-row ">
                                          <h2 class="mb-2  mt-2 text-sm font-semibold text-gray-800 ">
                                            Specialties
                                          </h2>
                                        </div>
                                        <div>
                                          {applicant.isPremium ? (
                                            <ul class="space-y-2 items-center">
                                              {!applicant.premiumCategoryOne &&
                                              !applicant.premiumCategoryTwo &&
                                              !applicant.premiumCategoryThree ? (
                                                <button
                                                  type="button"
                                                  class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                                  data-hs-overlay="#hs-pro-dasadpm"
                                                >
                                                  More
                                                </button>
                                              ) : (
                                                <>
                                                  {applicant.premiumCategoryOne ? (
                                                    <>
                                                      <li>
                                                        <a
                                                          class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                          href="#"
                                                        >
                                                          <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              fill="#38bdf8"
                                                              className="w-6 h-6"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </span>
                                                          <div class="grow">
                                                            <p>
                                                              {
                                                                applicant.premiumCategoryOne
                                                              }
                                                            </p>
                                                          </div>
                                                        </a>
                                                      </li>

                                                      {applicant.premiumCategoryTwo
                                                        ? null
                                                        : null}
                                                    </>
                                                  ) : null}

                                                  {applicant.premiumCategoryTwo ? (
                                                    <>
                                                      <li>
                                                        <a
                                                          class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                          href="#"
                                                        >
                                                          <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              fill="#38bdf8"
                                                              className="w-6 h-6"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </span>
                                                          <div class="grow">
                                                            <p>
                                                              {
                                                                applicant.premiumCategoryTwo
                                                              }
                                                            </p>
                                                          </div>
                                                        </a>
                                                      </li>
                                                      {applicant.premiumCategoryThree
                                                        ? null
                                                        : null}
                                                    </>
                                                  ) : null}
                                                  {applicant.premiumCategoryThree ? (
                                                    <>
                                                      <li>
                                                        <a
                                                          class="p-2.5 flex items-center gap-x-3 bg-white text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                          href="#"
                                                        >
                                                          <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              fill="#38bdf8"
                                                              className="w-6 h-6"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </span>
                                                          <div class="grow">
                                                            <p>
                                                              {
                                                                applicant.premiumCategoryThree
                                                              }
                                                            </p>
                                                          </div>
                                                        </a>
                                                      </li>
                                                      {applicant.premiumCategoryFour
                                                        ? null
                                                        : null}
                                                    </>
                                                  ) : null}
                                                  {applicant.premiumCategoryFour ? (
                                                    <>
                                                      <li>
                                                        <a
                                                          class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                          href="#"
                                                        >
                                                          <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              fill="#38bdf8"
                                                              className="w-6 h-6"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </span>
                                                          <div class="grow">
                                                            <p>
                                                              {
                                                                applicant.premiumCategoryFour
                                                              }
                                                            </p>
                                                          </div>
                                                        </a>
                                                      </li>
                                                      {applicant.premiumCategoryFive
                                                        ? null
                                                        : null}
                                                    </>
                                                  ) : null}
                                                  {applicant.premiumCategoryFive ? (
                                                    <>
                                                      <li>
                                                        <a
                                                          class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                          href="#"
                                                        >
                                                          <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              fill="#38bdf8"
                                                              className="w-6 h-6"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </svg>
                                                          </span>
                                                          <div class="grow">
                                                            <p>
                                                              {
                                                                applicant.premiumCategoryFive
                                                              }
                                                            </p>
                                                          </div>
                                                        </a>
                                                      </li>
                                                    </>
                                                  ) : null}
                                                </>
                                              )}
                                            </ul>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* start specialty modal */}

                                  {/* end specialty modal */}
                                  {isDesktop ? null : (
                                      <div class="xl:ps-5 grow space-y-5">
                                        <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                                          {/* Start about */}
                                          <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                            <div class="xl:pe-4 mt-3 space-y-5 divide-y divide-gray-200 ">
                                              <div class="pt-4 first:pt-0">
                                                <h2 class="text-sm font-semibold text-gray-800 ">
                                                  Details
                                                </h2>

                                                <ul class="mt-3 space-y-2">
                                                  {applicant.businessName ? (
                                                    <li>
                                                      <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                                        <svg
                                                          class="flex-shrink-0 size-4 text-gray-600 "
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
                                                          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                                          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                                          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                                          <path d="M10 6h4" />
                                                          <path d="M10 10h4" />
                                                          <path d="M10 14h4" />
                                                          <path d="M10 18h4" />
                                                        </svg>
                                                      </div>
                                                    </li>
                                                  ) : null}

                                                  <li>
                                                    <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                                      <svg
                                                        class="flex-shrink-0 size-4 text-gray-600 "
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
                                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                        <circle
                                                          cx="12"
                                                          cy="10"
                                                          r="3"
                                                        />
                                                      </svg>
                                                      {applicant.city},{" "}
                                                      {applicant.state}
                                                    </div>
                                                  </li>
                                                  <li>
                                                    <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                                      {applicant.numberOfRatings ? (
                                                        <Flex>
                                                          {maxRating.map(
                                                            (item, key) => {
                                                              return (
                                                                <Box
                                                                  activeopacity={
                                                                    0.7
                                                                  }
                                                                  key={item}
                                                                  marginTop="4px"
                                                                >
                                                                  <Image
                                                                    boxSize="16px"
                                                                    src={
                                                                      item <=
                                                                      applicant.rating
                                                                        ? star_filled
                                                                        : star_corner
                                                                    }
                                                                  ></Image>
                                                                </Box>
                                                              );
                                                            }
                                                          )}

                                                          <Text
                                                            marginTop="4px"
                                                            marginLeft="4px"
                                                          >
                                                            (
                                                            {
                                                              applicant.numberOfRatings
                                                            }{" "}
                                                            reviews)
                                                          </Text>
                                                        </Flex>
                                                      ) : (
                                                        <>
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="flex-shrink-0 size-4 text-gray-600 "
                                                          >
                                                            <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                            />
                                                          </svg>
                                                          <Text>
                                                            No reviews yet
                                                          </Text>
                                                        </>
                                                      )}
                                                    </div>
                                                  </li>
                                                  <li>
                                                    <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                                                      <svg
                                                        class="flex-shrink-0 size-4 text-gray-600 "
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
                                                        <rect
                                                          width="20"
                                                          height="16"
                                                          x="2"
                                                          y="4"
                                                          rx="2"
                                                        />
                                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                      </svg>
                                                      {applicant.email}
                                                    </div>
                                                  </li>
                                                </ul>
                                                <div className="mt-2">
                                                  {/* <button
                                                    onClick={() =>
                                                      initiateRequest(
                                                        applicant
                                                      )
                                                    }
                                                    class="w-full py-2 px-4 inline-flex justify-center items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none "
                                                  >
                                                    Message
                                                  </button> */}
                                                </div>
                                              </div>
                                              <div class="w-full">
                                                <div class="pt-4 first:pt-0 flex flex-row ">
                                                  <h2 class="mb-2  mt-2 text-sm font-semibold text-gray-800 ">
                                                    Specialties
                                                  </h2>
                                                </div>
                                                <div>
                                                  {applicant.isPremium ? (
                                                    <ul class="space-y-2 items-center">
                                                      {!applicant.premiumCategoryOne &&
                                                      !applicant.premiumCategoryTwo &&
                                                      !applicant.premiumCategoryThree ? (
                                                        <button
                                                          type="button"
                                                          class="p-2 w-1/2  text-center items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                                          data-hs-overlay="#hs-pro-dasadpm"
                                                        >
                                                          More
                                                        </button>
                                                      ) : (
                                                        <>
                                                          {applicant.premiumCategoryOne ? (
                                                            <>
                                                              <li>
                                                                <a
                                                                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                                  href="#"
                                                                >
                                                                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                                                    <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      viewBox="0 0 24 24"
                                                                      fill="#38bdf8"
                                                                      className="w-6 h-6"
                                                                    >
                                                                      <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                  <div class="grow">
                                                                    <p>
                                                                      {
                                                                        applicant.premiumCategoryOne
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </li>

                                                              {applicant.premiumCategoryTwo
                                                                ? null
                                                                : null}
                                                            </>
                                                          ) : null}

                                                          {applicant.premiumCategoryTwo ? (
                                                            <>
                                                              <li>
                                                                <a
                                                                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                                  href="#"
                                                                >
                                                                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white rounded-lg ">
                                                                    <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      viewBox="0 0 24 24"
                                                                      fill="#38bdf8"
                                                                      className="w-6 h-6"
                                                                    >
                                                                      <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                  <div class="grow">
                                                                    <p>
                                                                      {
                                                                        applicant.premiumCategoryTwo
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </li>
                                                              {applicant.premiumCategoryThree
                                                                ? null
                                                                : null}
                                                            </>
                                                          ) : null}
                                                          {applicant.premiumCategoryThree ? (
                                                            <>
                                                              <li>
                                                                <a
                                                                  class="p-2.5 flex items-center gap-x-3 bg-white text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                                  href="#"
                                                                >
                                                                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                                    <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      viewBox="0 0 24 24"
                                                                      fill="#38bdf8"
                                                                      className="w-6 h-6"
                                                                    >
                                                                      <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                  <div class="grow">
                                                                    <p>
                                                                      {
                                                                       applicant.premiumCategoryThree
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </li>
                                                              {applicant.premiumCategoryFour
                                                                ? null
                                                                : null}
                                                            </>
                                                          ) : null}
                                                          {applicant.premiumCategoryFour ? (
                                                            <>
                                                              <li>
                                                                <a
                                                                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                                  href="#"
                                                                >
                                                                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                                    <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      viewBox="0 0 24 24"
                                                                      fill="#38bdf8"
                                                                      className="w-6 h-6"
                                                                    >
                                                                      <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                  <div class="grow">
                                                                    <p>
                                                                      {
                                                                        applicant.premiumCategoryFour
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </li>
                                                              {applicant.premiumCategoryFive
                                                                ? null
                                                                : null}
                                                            </>
                                                          ) : null}
                                                          {applicant.premiumCategoryFive ? (
                                                            <>
                                                              <li>
                                                                <a
                                                                  class="p-2.5 flex items-center gap-x-3 bg-white  text-sm font-medium text-gray-800  rounded-xl hover:text-blue-600 focus:outline-none focus:bg-gray-100 "
                                                                  href="#"
                                                                >
                                                                  <span class="flex flex-shrink-0 justify-center items-center size-7 bg-white  rounded-lg ">
                                                                    <svg
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                      viewBox="0 0 24 24"
                                                                      fill="#38bdf8"
                                                                      className="w-6 h-6"
                                                                    >
                                                                      <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                      />
                                                                    </svg>
                                                                  </span>
                                                                  <div class="grow">
                                                                    <p>
                                                                      {
                                                                        applicant.premiumCategoryFive
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </li>
                                                            </>
                                                          ) : null}
                                                        </>
                                                      )}
                                                    </ul>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  <div class="xl:ps-5 grow space-y-5">
                                    <div class="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none ">
                                      {/* Start about */}
                                      <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                        <h2 class="inline-block font-semibold text-gray-800 ">
                                          About
                                        </h2>
                                      </div>

                                      {applicant.bio ? (
                                        <div class=" text-left flex justify-start w-full  bg-white  rounded-xl ">
                                          <div class="h-full p-6">
                                            <p class=" text-md  text-black ">
                                              {applicant.bio}
                                            </p>
                                          </div>
                                          {/* <!-- End Body --> */}
                                        </div>
                                      ) : (
                                        <div class="p-5 min-h-[160px] flex flex-col justify-center items-center text-center">
                                          {" "}
                                          <div class="max-w-sm mx-auto">
                                            <p class="mt-2 font-medium text-gray-800 ">
                                              Nothing here
                                            </p>
                                            <p class="mb-5 text-sm text-gray-500 "></p>
                                          </div>
                                        </div>
                                      )}
                                      {/* end about */}
                                      <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                        <h2 class="inline-block font-semibold text-gray-800 ">
                                          Experience
                                        </h2>

                                        <div class="flex sm:justify-end items-center gap-x-2"></div>
                                      </div>

                                      {userExperience ? (
                                        userExperience.map((userExperience) => (
                                          <>
                                            <div class="p-3">
                                              <div class=" text-left flex justify-start w-full  bg-white border   border-gray-200 rounded-xl ">
                                                <div
                                                  class="h-full p-6 "
                                                  key={userExperience.id}
                                                >
                                                  <h2 class="text-xl font-semibold text-gray-800 0">
                                                    {userExperience.Title}
                                                  </h2>

                                                  {/* <p class=" text-md  text-gray-500 ">Business</p> */}
                                                  <p class=" text-sm  text-gray-500 ">
                                                    {userExperience.Years}
                                                  </p>

                                                  <p class=" text-md  text-black ">
                                                    {userExperience.Description}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            {userExperienceLength < 3 ? (
                                              <div class="p-5 min-h-[80px] flex flex-col justify-end items-end text-center"></div>
                                            ) : null}
                                          </>
                                        ))
                                      ) : (
                                        <div class="p-5 min-h-[328px] flex flex-col justify-center items-center text-center">
                                          <svg
                                            class="w-48 mx-auto mb-4"
                                            width="178"
                                            height="90"
                                            viewBox="0 0 178 90"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <rect
                                              x="27"
                                              y="50.5"
                                              width="124"
                                              height="39"
                                              rx="7.5"
                                              fill="currentColor"
                                              class="fill-white "
                                            />
                                            <rect
                                              x="27"
                                              y="50.5"
                                              width="124"
                                              height="39"
                                              rx="7.5"
                                              stroke="currentColor"
                                              class="stroke-gray-50 "
                                            />
                                            <rect
                                              x="34.5"
                                              y="58"
                                              width="24"
                                              height="24"
                                              rx="4"
                                              fill="currentColor"
                                              class="fill-gray-50 "
                                            />
                                            <rect
                                              x="66.5"
                                              y="61"
                                              width="60"
                                              height="6"
                                              rx="3"
                                              fill="currentColor"
                                              class="fill-gray-50 "
                                            />
                                            <rect
                                              x="66.5"
                                              y="73"
                                              width="77"
                                              height="6"
                                              rx="3"
                                              fill="currentColor"
                                              class="fill-gray-50 "
                                            />
                                            <rect
                                              x="19.5"
                                              y="28.5"
                                              width="139"
                                              height="39"
                                              rx="7.5"
                                              fill="currentColor"
                                              class="fill-white "
                                            />
                                            <rect
                                              x="19.5"
                                              y="28.5"
                                              width="139"
                                              height="39"
                                              rx="7.5"
                                              stroke="currentColor"
                                              class="stroke-gray-100 "
                                            />
                                            <rect
                                              x="27"
                                              y="36"
                                              width="24"
                                              height="24"
                                              rx="4"
                                              fill="currentColor"
                                              class="fill-gray-100 "
                                            />
                                            <rect
                                              x="59"
                                              y="39"
                                              width="60"
                                              height="6"
                                              rx="3"
                                              fill="currentColor"
                                              class="fill-gray-100 "
                                            />
                                            <rect
                                              x="59"
                                              y="51"
                                              width="92"
                                              height="6"
                                              rx="3"
                                              fill="currentColor"
                                              class="fill-gray-100 "
                                            />
                                            <g filter="url(#filter13)">
                                              <rect
                                                x="12"
                                                y="6"
                                                width="154"
                                                height="40"
                                                rx="8"
                                                fill="currentColor"
                                                class="fill-white "
                                                shape-rendering="crispEdges"
                                              />
                                              <rect
                                                x="12.5"
                                                y="6.5"
                                                width="153"
                                                height="39"
                                                rx="7.5"
                                                stroke="currentColor"
                                                class="stroke-gray-100 "
                                                shape-rendering="crispEdges"
                                              />
                                              <rect
                                                x="20"
                                                y="14"
                                                width="24"
                                                height="24"
                                                rx="4"
                                                fill="currentColor"
                                                class="fill-gray-200  "
                                              />
                                              <rect
                                                x="52"
                                                y="17"
                                                width="60"
                                                height="6"
                                                rx="3"
                                                fill="currentColor"
                                                class="fill-gray-200 "
                                              />
                                              <rect
                                                x="52"
                                                y="29"
                                                width="106"
                                                height="6"
                                                rx="3"
                                                fill="currentColor"
                                                class="fill-gray-200 "
                                              />
                                            </g>
                                            <defs>
                                              <filter
                                                id="filter13"
                                                x="0"
                                                y="0"
                                                width="178"
                                                height="64"
                                                filterUnits="userSpaceOnUse"
                                                color-interpolation-filters="sRGB"
                                              >
                                                <feFlood
                                                  flood-opacity="0"
                                                  result="BackgroundImageFix"
                                                />
                                                <feColorMatrix
                                                  in="SourceAlpha"
                                                  type="matrix"
                                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                                  result="hardAlpha"
                                                />
                                                <feOffset dy="6" />
                                                <feGaussianBlur stdDeviation="6" />
                                                <feComposite
                                                  in2="hardAlpha"
                                                  operator="out"
                                                />
                                                <feColorMatrix
                                                  type="matrix"
                                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
                                                />
                                                <feBlend
                                                  mode="normal"
                                                  in2="BackgroundImageFix"
                                                  result="effect1_dropShadow_1187_14810"
                                                />
                                                <feBlend
                                                  mode="normal"
                                                  in="SourceGraphic"
                                                  in2="effect1_dropShadow_1187_14810"
                                                  result="shape"
                                                />
                                              </filter>
                                            </defs>
                                          </svg>

                                          <div class="max-w-sm mx-auto">
                                            <p class="mt-2 font-medium text-gray-800 ">
                                              Nothing here
                                            </p>
                                            <p class="mb-5 text-sm text-gray-500 "></p>
                                          </div>
                                        </div>
                                      )}

                                      <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                                        <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                          <h2 class="inline-block font-semibold text-gray-800 ">
                                            Projects
                                          </h2>
                                        </div>

                                        <div class="space-y-2">
                                          <label class="block block mb-2 ml-5 text-sm font-medium text-gray-600 ">
                                            Look through a few of {userFirstName}'s projects!
                                          </label>

                                          {applicant.projectPictureOne ? (
                                            <>
                                              <div class="p-12 mx-5 mb-5 flex justify-center bg-white border border border-gray-300 rounded-xl ">
                                                <button
                                                  className="embla__prev"
                                                  onClick={scrollPrev}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6 mr-2"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="M15.75 19.5 8.25 12l7.5-7.5"
                                                    />
                                                  </svg>
                                                </button>
                                                <div className="overflow-hidden">
                                                  <div
                                                    className="w-full max-w-96 "
                                                    ref={emblaRef}
                                                  >
                                                    <div className="flex">
                                                      <div className="grow-0 shrink-0  w-full h-full">
                                                        <img
                                                          className="w-full h-full"
                                                          src={
                                                            applicant.projectPictureOne
                                                          }
                                                        ></img>
                                                      </div>
                                                      {applicant.projectPictureTwo ? (
                                                        <div className="grow-0 shrink-0 w-full h-full">
                                                          <img
                                                            className="w-full"
                                                            src={
                                                              applicant.projectPictureTwo
                                                            }
                                                          ></img>
                                                        </div>
                                                      ) : null}
                                                      {applicant.projectPictureThree ? (
                                                        <div className="grow-0 shrink-0 w-full h-full">
                                                          <img
                                                            className="w-full "
                                                            src={
                                                              applicant.projectPictureThree
                                                            }
                                                          ></img>
                                                        </div>
                                                      ) : null}
                                                      {applicant.projectPictureFour ? (
                                                        <div className="grow-0 shrink-0 w-full h-full">
                                                          <img
                                                            className="w-full "
                                                            src={
                                                              applicant.projectPictureFour
                                                            }
                                                          ></img>
                                                        </div>
                                                      ) : null}
                                                      {applicant.projectPictureFive ? (
                                                        <div className="grow-0 shrink-0 w-full h-full">
                                                          <img
                                                            className="w-full "
                                                            src={
                                                              applicant.projectPictureFive
                                                            }
                                                          ></img>
                                                        </div>
                                                      ) : null}
                                                    </div>
                                                  </div>
                                                </div>

                                                <button
                                                  className="embla__next"
                                                  onClick={scrollNext}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="w-6 h-6 ml-2"
                                                  >
                                                    <path
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                              <div class="flex flex-col bg-white  rounded-xl shadow-sm xl:shadow-none ">
                                                <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                                                  <h2 class="inline-block  "></h2>

                                                  <div class="flex sm:justify-end items-center gap-x-2"></div>
                                                </div>
                                              </div>
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </main>
                        ) : (null)}

      
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offer Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <FormLabel marginTop="8" width>
                Enter your offer
              </FormLabel>
              <Flex>
                <Heading size="sm" marginTop="8px">
                  {" "}
                  $
                </Heading>
                <Input
                  marginLeft="8px"
                  width="240px"
                  placeholder="Enter budget here"
                  onChange={(e) => flatRateValidate(e.target.value)}
                />
              </Flex>
              {flatRateValidationBegun === true ? (
                <Text color="red" marginLeft="32px">
                  {flatRateValidationMessage}
                </Text>
              ) : null}
            </>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseFlatRate}>
              Close
            </Button>
            <Button colorScheme="blue">Send Offer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenFlatRate} onClose={onCloseFlatRate} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offer Position</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <FormLabel marginTop="8" width>
                Enter your offer
              </FormLabel>
              <Flex>
                <Heading size="sm" marginTop="8px">
                  {" "}
                  $
                </Heading>
                <Input
                  marginLeft="8px"
                  width="240px"
                  placeholder="Enter budget here"
                  onChange={(e) => flatRateValidate(e.target.value)}
                />
              </Flex>
              {flatRateValidationBegun === true ? (
                <Text color="red" marginLeft="32px">
                  {flatRateValidationMessage}
                </Text>
              ) : null}
            </>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseFlatRate}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => checkLength()}>
              Send Offer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApplicantProfile;
