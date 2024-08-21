import React, { useState, useEffect } from "react";
import Header from "../../../Needer/Components/Header";

import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
  Select,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import ImageUploading from "react-images-uploading";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  arrayUnion
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
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
import LoggedOutHeader from "../../../../components/Landing/LoggedOutHeader";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { StreamChat } from "stream-chat";

const AddLogoAbout = () => {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [test, setTest] = useState(null);
  const [isEmployer, setIsEmployer] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [companyName, setCompanyName] = useState(null)
  const [website, setWebsite] = useState(null)
  const [bio, setBio] = useState(null)

  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        console.log("current user",currentUser);

      
      });
      setHasRun(true);
    } else {
    }
  }, []);


  const navigate = useNavigate();



  const handleSendEmail = async () => {
    const response = await fetch(
    
      "https://emailapi-qi7k.onrender.com/sendNeederWelcomeEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: user.email}),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error)
  }



  // create new Chat User


  const createChatSlotInDB = async () => {
    const userChatsRef = collection(db, "User Messages");
 await setDoc(doc(userChatsRef, user.uid), {
        chats: arrayUnion({
   
        }),
      });
  }

  //yeah baby it WORKS. The below connects the user's auth ID with the firebase user document ID.. hopefully this helps in persistant auth and redux.

  //firestore help came from https://www.youtube.com/@NetNinja

//this is to control sign in/onboarding with Google auth. When the user accesses the landing page the app.jsx checks if they have an account once theres a user. 
// If a user started onboparding (this page only) withput submitting any data they would be perpetually redirected to this page with no option to do anything else, so this useEffect automatically creates their account
  




  const updateUserProfileFirestore = () => {
    //submit data
    updateDoc(doc(db, "employers", user.uid), {
   bio: bio ? bio : null,
      profilePictureResponse: profilePicture ? profilePicture : null
    })
      
      .then(() => {
        console.log("data submitted, new chat profile created");
      })
      .catch((error) => {
        console.log(error);
      });

  // navigate("/Homepage", { state: {firstVisit: true}});
  navigate("/Homepage");
  };

  const [dateJoined, setDateJoined] = useState(null);








  //handle check agreements
  const [termsOfService, setTermsOfService] = useState(false)
  const [privacyPolicy, setPrivacyPolicy] = useState(false)
  const [ageAgreement, setAgeAgreement] = useState(false)


  useEffect(() => {
console.log(termsOfService, privacyPolicy, ageAgreement)
  }, [termsOfService, privacyPolicy, ageAgreement])

  //modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenTOS, onOpen: onOpenTOS, onClose: onCloseTOS } = useDisclosure();
  const { isOpen: isOpenIncomplete, onOpen: onOpenIncomplete, onClose: onCloseIncomplete } = useDisclosure();

  const {
    isOpen: isOpenAvatar,
    onOpen: onOpenAvatar,
    onClose: onCloseAvatar,
  } = useDisclosure();

  //alert handling

  //avatar image handling
  const [hasUploadedProfilePicture, setHasUploadedProfilePicture] =
    useState(false);
  const [images, setImages] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit

    setImages(imageList);
    setProfilePicture(imageList[0].data_url);
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
      updateDoc(doc(db, "employers", user.uid), {
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
      updateDoc(doc(db, "employers", user.uid), {
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

  return (
    <>

<LoggedOutHeader />

<Center>
   <div class="w-1/3 ">


    <form>
      <div className="">
       

        <div className=" border-gray-900/10 pb-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Company Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600"> Add a few things so applicants can know more about who you are</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
             Company Logo (optional)
            </label>
          </div>
       

          <div class="sm:col-span-9 mb-16">
        
            <div class="flex flex-wrap items-center gap-3 sm:gap-5">
              <span class="flex flex-shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 rounded-full ">
              {profilePicture ? (
                    <img
                      class="object-cover size-full rounded-full"
                      src={profilePicture}
                      alt="Image Description"
                    />
                  ) : (
                <svg class="flex-shrink-0 size-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>)}
              </span>

              <div class="grow">
                <div class="flex items-center gap-x-2">
                  <button onClick={() => onOpenAvatar()} type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500" >
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    Upload photo
                  </button>
                </div>
              </div>
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
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
               About us (optional)
              </label>
              <div className="mt-2">
                <textarea
                rows="6"
                  type="text"
                  placeholder="This information will be shown to describe your organization on all job listings you create"
                  onChange={(e) => setBio(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
           
            
      

         
         
          
          </div>
        </div>

     
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
      <input type="button"  value="Skip" onClick={() => updateUserProfileFirestore()} class="py-2 px-3 inline-flex justify-center mb-12 items-center gap-x-2 text-start text-sky-500  hover:text-sky-600 bg-white text-sm font-medium rounded-lg shadow-sm align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 " data-hs-overlay="#">
          
          </input>    
      <input type="button"  value="Continue" onClick={() => updateUserProfileFirestore()} class="py-2 px-3 inline-flex justify-center mb-12 items-center gap-x-2 text-start bg-sky-500  hover:bg-sky-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 " data-hs-overlay="#">
          
          </input>
      </div>
    </form>
    </div>

</Center>
  
   

  
    </>
  );
};

export default AddLogoAbout;
