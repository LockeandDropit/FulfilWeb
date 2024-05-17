import React, { useState, useEffect, useCallback } from "react";


import useEmblaCarousel from 'embla-carousel-react'
import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Image,
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
  Select,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
  col,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import ImageUploading from "react-images-uploading";

import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";

import { useChatContext } from "stream-chat-react";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard"
const UserProfileNeeder = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    "https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true";
  const starImgCorner =
    "https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true";

  const [user, setUser] = useState();

  const [emblaRef, emblaApi] = useEmblaCarousel()

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
  // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] =
    useState(false);

  const { client } = useChatContext();

  useEffect(() => {
    if (client) {
    } else {
    }
  }, [client]);

  // const getProfilePicture = async () => {
  //   const storage = getStorage();
  //   const reference = ref(storage, "users/" + user.uid + "/profilePicture.jpg");

  // };

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
  const [isPremium, setIsPremium] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [email, setEmail] = useState(null);
  const [projectPictureOne, setProjectPictureOne] = useState(null);
  const [projectPictureTwo, setProjectPictureTwo] = useState(null);
  const [projectPictureThree, setProjectPictureThree] = useState(null);
  const [projectPictureFour, setProjectPictureFour] = useState(null);
  const [projectPictureFive, setProjectPictureFive] = useState(null);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserInfo(snapshot.data());
        setEmail(snapshot.data().email);
        // setIsPremium(snapshot.data().isPremium);
        setProfilePicture(snapshot.data().profilePictureResponse);
        setUserFirstName(snapshot.data().firstName);
        setUserLastName(snapshot.data().lastName);
        // setUserBio(snapshot.data().bio);

        setUserState(snapshot.data().state);

        setUserCity(snapshot.data().city);
        if (snapshot.data().projectPictureOne) {
          setProjectPictureOne(snapshot.data().projectPictureOne);
        }
        if (snapshot.data().projectPictureTwo) {
          setProjectPictureTwo(snapshot.data().projectPictureTwo);
        }
        if (snapshot.data().projectPictureThree) {
          setProjectPictureThree(snapshot.data().projectPictureThree);
        }
        if (snapshot.data().projectPictureFour) {
          setProjectPictureFour(snapshot.data().projectPictureFour);
        }
        if (snapshot.data().projectPictureFive) {
          setProjectPictureFive(snapshot.data().projectPictureFive);
        }

        if (snapshot.data().businessName) {
          setBusinessName(snapshot.data().businessName);
        }

 
      });
    } else {
    }
  }, [user]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        setUserBio(snapshot.data().bio);
        if (snapshot.data().businessName) {
          setBusinessName(snapshot.data().businessName);
        }
      });
    } else {
    }
  }, [user]);


  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          if (isNaN(doc.data().rating)) {
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
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
    }
  }, [user]);

  // The following proivides the editable UI

  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button
          backgroundColor="#01A2E8"
          textColor="white"
          width="320px"
          marginTop="8px"
          {...getSubmitButtonProps()}
        >
          {" "}
          Finish Editing
        </Button>

        <IconButton
          icon={<Button>Cancel</Button>}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={
            <Button
              backgroundColor="white"
              textColor="#01A2E8"
              width="120px"
              marginTop="8px"
            >
              Edit
            </Button>
          }
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }

  // modal stuff

  //varying modal control credit Prem G and Alireza Khanamani https://stackoverflow.com/questions/65988633/chakra-ui-using-multiple-models-in-a-single-component
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenProject,
    onOpen: onOpenProject,
    onClose: onCloseProject,
  } = useDisclosure();
  const {
    isOpen: isOpenAvatar,
    onOpen: onOpenAvatar,
    onClose: onCloseAvatar,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpenBio,
    onOpen: onOpenBio,
    onClose: onCloseBio,
  } = useDisclosure();
  const {
    isOpen: isOpenCategories,
    onOpen: onOpenCategories,
    onClose: onCloseCategories,
  } = useDisclosure();
  const {
    isOpen: isOpenAddExperience,
    onOpen: onOpenAddExperience,
    onClose: onCloseAddExperience,
  } = useDisclosure();
  const {
    isOpen: isOpenAddQualification,
    onOpen: onOpenAddQualification,
    onClose: onCloseAddQualification,
  } = useDisclosure();
  //firebase submission after edit

  // const handleAddQualificationOpen = () => {
  //   if (userExperienceLength > 2) {
  //     alert(
  //       "Can't have more than 3 listed experiences. Either edit or delete a prior listed experience."
  //     );
  //   } else {
  //     onOpenAddExperience();
  //   }
  // };



  const updateUserProfileFirestore = () => {
    //check if null

    //submit data
    updateDoc(doc(db, "employers", user.uid), {
      bio: updatedBio,
    })
      .then(() => {
        //all good

        setUserBio(updatedBio);
      })
      .catch((error) => {
        // no bueno
      });

    onCloseBio();
  };





  //alert handling

  //avatar image handling

  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit

    setImages(imageList);
    setProfilePicture(imageList[0].data_url);
  };


  //project image handling

  const [projectImages, setProjectImages] = React.useState(null);
  const [newProjectImage, setNewProjectImage] = React.useState(null);
  const maxProjectNumber = 5;
  const onChangeProject = (imageList, addUpdateIndex) => {
    // data for submit

    setProjectImages(imageList);
    setNewProjectImage(imageList[0].data_url);
  };



  const uploadToFirebase = async () => {
    const storage = getStorage();
    const pictureRef = ref(
      storage,
      "employers/" + user.uid + "/profilePicture.jpg"
    );

    // setImage(result.assets[0].uri);
    // dispatch(selectUserProfilePicture(result.assets[0].uri))

    const img = await fetch(images[0].data_url);
    const bytes = await img.blob();

    await uploadBytes(pictureRef, bytes).then((snapshot) => {});

    await getDownloadURL(pictureRef).then((response) => {
      updateDoc(doc(db, "users", user.uid), {
        profilePictureResponse: response,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    });

    setTimeout(() => {
      updateDoc(doc(db, "users", user.uid), {
        hasUploadedProfilePicture: hasUploadedProfilePicture,
      })
        .then(() => {
          setHasUploadedProfilePicture(hasUploadedProfilePicture);
        })
        .catch((error) => {
          // no bueno
        });
    });

    onCloseAvatar();
  };

  const [subscriptionID, setSubscriptionID] = useState(null);

  const initializeSubscription = () => {
    //credit and help from https://github.com/pagecow/stripe-subscribe-payments
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ session }) => {
        setSubscriptionID(session.id);
        window.open(session.url, "_blank");
      })
      // .then(({ url }) => {
      //   // window.location = url
      //   window.open(url, "_blank")
      // })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "users", user.uid), {
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <Header />

      <Box position="absolute" left="0">
        <Dashboard />
      </Box>
      <main id="content" class="lg:ps-[260px] pt-[59px]">
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
                    <rect x="1" width="1112" height="348" fill="#D9DEEA"></rect>
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
                  {profilePicture ? (
                    <img
                      class="object-cover size-full rounded-full"
                      src={profilePicture}
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

                  <div class="absolute bottom-0 -end-2">
                    <button
                      type="button"
                      onClick={() => onOpenAvatar()}
                      class="group p-2 max-w-[125px] inline-flex justify-center items-center gap-x-1.5 text-start bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-full whitespace-nowrap shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:bg-gray-100 "
                      data-hs-overlay="#hs-pro-dsm"
                    >
                      <svg
                        class="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-400"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" x2="9.01" y1="9" y2="9" />
                        <line x1="15" x2="15.01" y1="9" y2="9" />
                      </svg>
                      <span class="group-hover:block hidden">
                        Change Picture
                      </span>
                    </button>
                  </div>
                </div>

                <Modal
                  isOpen={isOpenAvatar}
                  onClose={onCloseAvatar}
                  size="xl"
                  height="420px"
                >
                  <ModalOverlay />
                  <ModalContent>
                    <div
                      id="hs-pro-dasadpm"
                      class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                    >
                      <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                        <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                          <div class="py-3 px-4 flex justify-between items-center border-b ">
                            <h3 class="font-semibold text-gray-800 ">
                              Profile Picture
                            </h3>
                            <button
                              type="button"
                              onClick={() => onCloseAvatar()}
                              class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                              data-hs-overlay="#hs-pro-dasadpm"
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

                          <form>
                            <div class="p-4 space-y-5">
                              <div>
                                <div class="flex flex-wrap items-center gap-3 sm:gap-5">
                                  <img
                                    src={
                                      profilePicture ? (
                                        profilePicture
                                      ) : images ? (
                                        images
                                      ) : (
                                        <span class="flex flex-shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full dark:border-neutral-700 dark:text-neutral-600">
                                          <svg
                                            class="flex-shrink-0 size-7"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          >
                                            <rect
                                              width="18"
                                              height="18"
                                              x="3"
                                              y="3"
                                              rx="2"
                                              ry="2"
                                            />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                          </svg>
                                        </span>
                                      )
                                    }
                                  ></img>

                                  <div class="grow">
                                    <div class="flex items-center gap-x-2">
                                      <ImageUploading
                                        multiple
                                        value={images}
                                        onChange={onChange}
                                        maxNumber={maxNumber}
                                        dataURLKey="data_url"
                                      >
                                        {({
                                          imageList,
                                          onImageUpload,
                                          onImageRemoveAll,
                                          onImageUpdate,
                                          onImageRemove,
                                          isDragging,
                                          dragProps,
                                        }) => (
                                          // write your building UI
                                          <div className="upload__image-wrapper">
                                            <button
                                              type="button"
                                              onClick={() => onImageUpdate()}
                                              {...dragProps}
                                              class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line
                                                  x1="12"
                                                  x2="12"
                                                  y1="3"
                                                  y2="15"
                                                />
                                              </svg>
                                              Upload photo
                                            </button>
                                            &nbsp;
                                          </div>
                                        )}
                                      </ImageUploading>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="p-4 flex justify-end gap-x-2">
                              <div class="w-full flex justify-end items-center gap-x-2">
                                <button
                                  type="button"
                                  onClick={() => onCloseAvatar()}
                                  class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                  data-hs-overlay="#hs-pro-dasadpm"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() => uploadToFirebase()}
                                  class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                  data-hs-overlay="#hs-pro-dasadpm"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>

                <div class="mt-3 text-center">
                  <h1 class="text-xl font-semibold text-gray-800 ">
                    {userFirstName} {userLastName}
                  </h1>
                  {/* <p class="text-gray-500 ">
                          iam_amanda
                        </p> */}
                </div>
              </div>

              <div class="mt-7 py-0.5 flex flex-row justify-between items-center gap-x-2 whitespace-nowrap overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                {/* <nav class="flex space-x-1">
                  <a
                    class="px-2.5 py-1.5 relative inline-flex items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm whitespace-nowrap rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-[11px] after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  active"
                    href="../../pro/dashboard/user-profile-my-profile.html"
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
                      <circle cx="18" cy="15" r="3" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                      <path d="m21.7 16.4-.9-.3" />
                      <path d="m15.2 13.9-.9-.3" />
                      <path d="m16.6 18.7.3-.9" />
                      <path d="m19.1 12.2.3-.9" />
                      <path d="m19.6 18.7-.4-1" />
                      <path d="m16.8 12.3-.4-1" />
                      <path d="m14.3 16.6 1-.4" />
                      <path d="m20.7 13.8 1-.4" />
                    </svg>
                    My Profile
                  </a>
                  <a
                    class="px-2.5 py-1.5 relative inline-flex items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm whitespace-nowrap rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-[11px] after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none "
                    href="../../pro/dashboard/user-profile-teams.html"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Teams
                  </a>
                  <a
                    class="px-2.5 py-1.5 relative inline-flex items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm whitespace-nowrap rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-[11px] after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  "
                    href="../../pro/dashboard/user-profile-files.html"
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
                      <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                      <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                      <path d="M15 2v5h5" />
                    </svg>
                    Files
                  </a>
                  <a
                    class="px-2.5 py-1.5 relative inline-flex items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm whitespace-nowrap rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-[11px] after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  "
                    href="../../pro/dashboard/user-profile-connections.html"
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
                      <path d="M8 3 4 7l4 4" />
                      <path d="M4 7h16" />
                      <path d="m16 21 4-4-4-4" />
                      <path d="M20 17H4" />
                    </svg>
                    Connections
                  </a>
                </nav> */}

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

            <div class="xl:hidden flex justify-end">
              <button
                type="button"
                class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                data-hs-overlay="#hs-pro-dupsd"
                aria-controls="hs-pro-dupsd"
                aria-label="Sidebar Toggle"
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
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="15" x2="15" y1="3" y2="21" />
                  <path d="m8 9 3 3-3 3" />
                </svg>
                Open Sidebar
              </button>
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
                        About
                      </h2>

                      <ul class="mt-3 space-y-2">
                        {businessName ? (
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
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {userCity}, {userState}
                          </div>
                        </li>
                        <li>
                          <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            {numberOfRatings ? (
                              <Flex>
                                {maxRating.map((item, key) => {
                                  return (
                                    <Box
                                      activeopacity={0.7}
                                      key={item}
                                      marginTop="4px"
                                    >
                                      <Image
                                        boxSize="16px"
                                        src={
                                          item <= rating
                                            ? star_filled
                                            : star_corner
                                        }
                                      ></Image>
                                    </Box>
                                  );
                                })}

                                <Text marginTop="4px" marginLeft="4px">
                                  ({numberOfRatings} reviews)
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
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            {email}
                          </div>
                        </li>
                      </ul>
                    </div>
                  
                  </div>
                </div>

                {/* start specialty modal */}

     

                {/* end specialty modal */}

                <div class="xl:ps-5 grow space-y-5">
                  <div class="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm xl:shadow-none ">
                    {/* Start about */}
                    <div class="p-5 pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
                      <h2 class="inline-block font-semibold text-gray-800 ">
                        About
                      </h2>

                      {userBio ? (
                        <div class="flex sm:justify-end items-center gap-x-2">
                          <button type="button" onClick={() => onOpenBio()}>
                            <svg
                              type="button"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#5D5D5D"
                              class="w-4 h-4 ml-2 mb-2 hover:text-gray-700"
                            >
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <Modal isOpen={isOpenBio} onClose={onCloseBio} size="xl">
                      <ModalOverlay />
                      <ModalContent>
                        <div
                          id="hs-pro-dasadpm"
                          class=" size-full fixed top-0 start-0 z-[80]  overflow-y-auto pointer-events-none [--close-when-click-inside:true] "
                        >
                          <div class="mt-7 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
                            <div class="w-full max-h-full flex flex-col bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">
                              <div class="py-3 px-4 flex justify-between items-center border-b ">
                                <h3 class="font-semibold text-gray-800 ">
                                  Add your bio
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => onCloseBio()}
                                  class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                                  data-hs-overlay="#hs-pro-dasadpm"
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

                              <form>
                                <div class="p-4 space-y-5">
                                  <div>
                                    <label
                                      for="hs-pro-dalpn"
                                      class="block mb-2 text-sm font-medium text-gray-800 "
                                    >
                                      About Me
                                    </label>

                                    <textarea
                                      type="text"
                                      defaultValue={userBio}
                                      onChange={(e) =>
                                        setUpdatedBio(e.target.value)
                                      }
                                      id="hs-pro-dalpn"
                                      rows="5"
                                      class="  sm:p-5 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                                      placeholder="ex: I am a dedicated landscaper with over 10 years of experience in the field."
                                    />
                                  </div>
                                </div>

                                <div class="p-4 flex justify-end gap-x-2">
                                  <div class="w-full flex justify-end items-center gap-x-2">
                                    <button
                                      type="button"
                                      onClick={() => onCloseBio()}
                                      class="py-2 px-3  inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 "
                                      data-hs-overlay="#hs-pro-dasadpm"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateUserProfileFirestore()
                                      }
                                      class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                      data-hs-overlay="#hs-pro-dasadpm"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </ModalContent>
                    </Modal>

                    {userBio ? (
                      <div class=" text-left flex justify-start w-full  bg-white  rounded-xl ">
                        <div class="h-full p-6">
                          <p class=" text-md  text-black ">{userBio}</p>
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
                        <button
                          type="button"
                          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          data-hs-overlay="#hs-pro-dasadpm"
                          onClick={() => onOpenBio()}
                        >
                          <svg
                            class="hidden sm:block flex-shrink-0 size-4"
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
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Add Bio
                        </button>
                      </div>
                    )}
                    {/* end about */}
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
                  
      </main>
    </>
  );
};

export default UserProfileNeeder;
