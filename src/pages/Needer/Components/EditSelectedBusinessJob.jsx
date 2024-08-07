import React, { useState, useEffect } from "react";
import NeederHeader from "../NeederHeader";
import NeederDashboard from "../NeederDashboard";
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
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { EditorState, convertToRaw, convertFromRaw, onEditorStateChange } from "draft-js";
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
  Spinner,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { useLocation } from "react-router-dom";
import {useJobStore} from "../HomePage/lib/jobsStoreDashboard"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from 'markdown-draft-js';
import RichTextEditor from "./RichTextEditor";
import htmlToDraft from 'html-to-draftjs';
import { ContentState } from "react-draft-wysiwyg";



const EditSelectedBusinessJob = (props) => {
  console.log("edit selected job", props);

  const { job } = useJobStore()


  const [isSalaried, setIsSalaried] = useState(null);
  const [applicantDescription, setApplicantDescription] = useState(null)
  const [benefitsDescription, setBenefitsDescription] = useState(null)
  const [isFullTimePosition, setIsFullTimePosition] = useState(null)
  const [isFlatRate, setIsFlatRate] = useState(false);
  const [flatRate, setFlatRate] = useState(0);
  const [isHourly, setIsHourly] = useState();
  const [lowerRate, setLowerRate] = useState(0);
  const [upperRate, setUpperRate] = useState(0);
  const [jobTitle, setJobTitle] = useState(null);
  const [user, setUser] = useState();
  const [employerID, setEmployerID] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [description, setDescription] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);

  const navigate = useNavigate();
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const {isOpen : isOpen, onOpen: onOpen, onClose: onClose} = useDisclosure()

  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setEmployerID(currentUser.uid);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, [hasRun]);


  useEffect(() => {
onOpen()
  }, [props])

  const location = useLocation();

  useEffect(() => {
    if (props === null) {
    } else {
      setJobTitle(props.props.jobTitle);
      setJobID(props.props.jobID);
      setIsHourly(props.props.isHourly);
    }
  }, [props]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        props.props.jobTitle
      );

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setJobID(snapshot.data().jobID);
        setLowerRate(snapshot.data().lowerRate);
        // setBusinessName(snapshot.data(businessName));
        setUpperRate(snapshot.data().upperRate);
        setIsHourly(snapshot.data().isHourly);
        setPayType(snapshot.data().isHourly);

        setIsOneTime(snapshot.data().isOneTime);
        setFlatRate(snapshot.data().flatRate);
        setBusinessName(snapshot.data().businessName);
        setDescription(snapshot.data().description);
        setRequirements(snapshot.data().requirements);
        setJobCategory(snapshot.data().category);
        setJobID(snapshot.data().jobID);
        setNiceToHave(snapshot.data().niceToHave);
        setRequirements2(snapshot.data().requirements2);
        setRequirements3(snapshot.data().requirements3);
        setJobFrequency(snapshot.data().isOneTime);
        setStreetAddress(snapshot.data().streetAddress);
        setCity(snapshot.data().city);
        setState(snapshot.data().state);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //credit https://www.code-sample.com/2019/12/react-allow-only-numbers-in-textbox.html
  const numberOnlyRegexMinimumCharacterInput = /^[0-9\b]{1,7}$/;

  const [flatRateValidationMessage, setFlatRateValidationMessage] = useState();

  const [flatRateValidationBegun, setFlatRateValidationBegun] = useState(false);

  //this little diddy is from MissCoding via Youtube

  const handleFlatRateChange = (flatRate) => {
    setFlatRate(flatRate);

    if (flatRateValidationMessage) {
      flatRateValidate(flatRate);
    }
  };

  const flatRateValidate = (flatRate) => {
    setFlatRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);
    if (!isValid) {
      setFlatRateValidationMessage("Please enter valid rate");
      console.log(flatRateValidationMessage);
    } else {
      setFlatRateValidationMessage();
      setFlatRate(flatRate);
    }
  };

  const [lowerRateValidationMessage, setLowerRateValidationMessage] =
    useState();

  const [lowerRateValidationBegun, setLowerRateValidationBegun] =
    useState(false);

  const handleLowerRateChange = (lowerRate) => {
    setLowerRate(lowerRate);

    if (lowerRateValidationMessage) {
      lowerRateValidate(lowerRate);
    }
  };

  const lowerRateValidate = (lowerRate) => {
    setLowerRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    if (!isValid) {
      setLowerRateValidationMessage("Please enter valid rate");
      console.log(lowerRateValidationMessage);
    } else {
      setLowerRateValidationMessage();
      setLowerRate(lowerRate);
    }
  };

  const [upperRateValidationMessage, setUpperRateValidationMessage] =
    useState();

  const [upperRateValidationBegun, setUpperRateValidationBegun] =
    useState(false);

  const handleUpperRateChange = (upperRate) => {
    setUpperRate(upperRate);

    if (upperRateValidationMessage) {
      upperRateValidate(upperRate);
    }
  };

  const upperRateValidate = (upperRate) => {
    setUpperRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(upperRate);
    if (!isValid) {
      setUpperRateValidationMessage("Please enter valid rate");
      console.log(upperRateValidationMessage);
    } else {
      setUpperRateValidationMessage();
      setUpperRate(upperRate);
    }
  };

  //credit https://stackoverflow.com/questions/11511154/regex-for-maximum-length-in-javascript
  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    //check to see if everything is entered

    const jobTitleValid = minLengthRegEx.test(jobTitle);
    const upperRateValid = numberOnlyRegexMinimumCharacterInput.test(upperRate);
    const lowerRateValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    const flatRateValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);

    //check for null values https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript user578895

    if (!jobTitleValid || isOneTime === null) {
      console.log("1");
      alert("Please fill out all fields");
      console.log("1");
    } else {
      if (isOneTime === true && isFlatRate === true && !flatRateValid) {
        alert("Please fill out all fields");
        console.log("2");
      } else {
        if (
          (isOneTime === true && isHourly === true && !upperRateValid) ||
          !lowerRateValid
        ) {
          console.log("3");
          alert("Please fill out all fields");
        } else {
          if (isOneTime === false && isFlatRate === true && !flatRateValid) {
            console.log("4");
            alert("Please fill out all fields");
          } else {
            if (
              (isOneTime === false && isHourly !== null && !upperRateValid) ||
              !lowerRateValid
            ) {
              console.log("5");
              alert("Please fill out all fields");
            } else {
            }
          }
        }
      }
    }
    submitJob();
  };

  const [payType, setPayType] = useState(null);

  // credit help Michael with setting state from select component https://stackoverflow.com/questions/70353397/how-to-update-the-state-if-dropdown-has-selected-value-with-hooks-and-usestate
  // const handleIsHourly = () => {
  //   setIsHourly(true);
  //   setIsFlatRate(false);
  //   setFlatRate(0);
  // };

  // const handleIsFixed = () => {
  //   setIsFlatRate(true);
  //   setIsHourly(false);
  //   setUpperRate(0);
  //   setLowerRate(0);
  // };

  // useEffect(() => {
  //   if (payType === "Hourly") {
  //     handleIsHourly();
  //   } else if (payType === "Fixed") {
  //     handleIsFixed();
  //   } else {
  //   }
  // }, [payType]);

  const [jobFrequency, setJobFrequency] = useState(null);

  const [isOneTime, setIsOneTime] = useState(null);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);

  // useEffect(() => {
  //   if (jobFrequency === "One Time") {
  //     setIsOneTime(true);
  //   } else if (jobFrequency === "Regular Need") {
  //     setIsOneTime(false);
  //   } else {
  //   }
  // }, [jobFrequency]);

  console.log(
    "Info",
    jobTitle,
    isOneTime,
    isHourly,
    upperRate,
    lowerRate,
    flatRate
  );

  const [datePosted, setDatePosted] = useState(null);

  useEffect(() => {
    //credit https://stackoverflow.com/questions/37271356/how-to-get-the-current-date-in-reactnative Irfan wani
    setDatePosted(new Date().toLocaleString());
  }, []);

  const addNewJob = () => {
    const dbRef = collection(
      db,
      "employers",
      user.uid,
      "Posted Jobs",
      jobTitle,
      "Applicants"
    );
    const placeholderApplicant = { placeholder: "applicant" };

    //submit data
    updateDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerRate: lowerRate,
      category: jobCategory,
    })
      .then(() => {
        addDoc(dbRef, placeholderApplicant);
        console.log("data submitted employers");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  const addJobMap = () => {
    //submit data
    updateDoc(doc(db, "Map Jobs", jobID), {
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerRate: lowerRate,
      category: jobCategory,
    })
      .then(() => {
        //all good
        console.log("data submitted for Maps");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    if (isVolunteer == true) {
      //adds to volunteer only db for map
      updateDoc(doc(db, "Map Jobs Volunteer", jobID), {
        upperRate: upperRate,
        description: description,
        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerRate: lowerRate,
        category: jobCategory,
      })
        .then(() => {
          //all good
          console.log("data submitted for Maps");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
    } else {
      updateDoc(doc(db, "Map Jobs Paid", jobID), {
        upperRate: upperRate,
        description: description,
        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerRate: lowerRate,
        category: jobCategory,
      })
        .then(() => {
          //all good
          console.log("data submitted for Maps");
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });
      //adds to paid only db for map
    }
  };

  const addJobGlobal = () => {
    //submit data
    updateDoc(doc(db, "Jobs", user.uid, "Posted Jobs", jobTitle), {
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerRate: lowerRate,
      category: jobCategory,
    })
      .then(() => {
        //all good
        console.log("data submitted global");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    //submit data
    updateDoc(doc(db, "All Jobs", jobID), {
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerRate: lowerRate,
      category: jobCategory,
    })
      .then(() => {
        //all good
        console.log("submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    onOpenSuccess();
   
  };

  const handleCloseSuccessModal = () => {
    onCloseSuccess()
 navigate("/JobDetails", { state: { editReset: true } });
    setIsVisible(false);
  }

  const testButtonNavigate = () => {
    navigate("/AddJobInfo", {
      state: {
        jobTitle: jobTitle,
        isVolunteer: isVolunteer,
        jobID: jobID,
        firstName: firstName,
      },
    });
  };

  const [lowerCaseJobTitle, setLowerCaseJobTitle] = useState(null);

  // useEffect(() => {
  //   if (jobTitle !== null) {
  //     setLowerCaseJobTitle(jobTitle.toLowerCase());
  //   } else {
  //   }
  // }, [jobTitle]);

  useEffect(() => {
    if (employerID !== null) {
      const docRef = doc(db, "employers", employerID);

      getDoc(docRef).then((snapshot) => {
        console.log("EDIT POIST CONSOLE", snapshot.data());
        //   setCity(snapshot.data().city);
        //   setState(snapshot.data().state);
        setFirstName(snapshot.data().firstName);
      });
    } else {
    }
  }, [employerID]);

  const submitJob = () => {
    // createJobID();
    addNewJob();
    addJobMap();
    addJobGlobal();
  };

  const [jobCategory, setJobCategory] = useState(false);

  const [rawAddress, setRawAddress] = useState(null);
  const [firstAddress, setFirstAddress] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [streetNumber, setStreetNumber] = useState(null);
  const [streetName, setStreetName] = useState(null);
  const [zipCode, setZipCode] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  console.log("is hourly", props.props.isHourly);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);

  const handleDelete = () => {
    deleteDoc(doc(db, "Map Jobs", jobID), {})
      .then(() => {
        //all good
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {})
      .then(() => {
        //all good
        alert("Success, job has been deleted");
        navigate("/NeederPostedList");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {})
      .then(() => {
        //all good
        alert("Success, job has been deleted");
        navigate("/NeederPostedList");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  const [isVisible, setIsVisible] = useState(true);

  const handleCloseButton = () => {
    setIsVisible(false);
    navigate("/JobDetails", { state: { editReset: true } });
  };

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState))
  }


  const [contentBlocks, setContentBlocks] = useState(null)
  const [contentState, setContentState] = useState(null)
  const [rawHtml, setRawHtml] = useState(null)

  useEffect(() => {
    if (job) {
      setContentBlocks(htmlToDraft(job.description))
      // setContentState(ContentState.createFromBlockArray(contentBlocks))
      // setRawHtml(convertToRaw(contentState))
      // console.log("oh boy", rawHtml)
    }
  }, [job, contentBlocks ,contentState, rawHtml])

  useEffect(() => {
    if (contentBlocks) {
      setContentState(ContentState.createFromBlockArray(contentBlocks))
    }
  }, [contentBlocks])

  useEffect(() => {
    if (rawHtml) {
      setRawHtml(convertToRaw(contentState))
    }
  }, [rawHtml])
 
  // const contentBlocks = htmlToDraft(job.description)
  // const contentState = ContentState.createFromBlockArray(contentBlocks)
  // const rawHtml = convertToRaw(contentState)


  const [intermediatePositionType, setIntermediatePositionType] = useState(null)

useEffect(() => {
  if (intermediatePositionType) {
    setIsFullTimePosition(JSON.parse(intermediatePositionType))
  }
}, [intermediatePositionType])

  return (
    <>
      {isVisible ? (
        <>
          <Drawer
          size={'xl'}
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      
      >
        <DrawerOverlay />
        <DrawerContent>
        <DrawerCloseButton />
          <DrawerHeader>Edit Post</DrawerHeader>
          <DrawerBody>
         
            <div class="bg-blend-overlay w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
              
              {isLoading ? (
                <div class="flex animate-pulse">
                  <div class="ms-4 mt-2 w-full">
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                    </ul>

                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                    </ul>
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full"></li>
                    </ul>
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full"></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                <div class="p-4 space-y-5">
                  <div class="space-y-2">
                    <label
                      for="hs-pro-dactmt"
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                      Post Title (can not be edited)
                    </label>
  
                    <p>{props.props.jobTitle}</p>
                  </div>
                  <div class="space-y-2">
                    <label
                      for="dactmd"
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                       Location (can not be edited)
                    </label>
  
                    <p>
                {" "}
                {streetAddress}, {city}, {state}
              </p>
                   
                  </div>
                  <div class="space-y-2">
                    <label
                      for="dactmi"                 
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                      Is this a full-time or part-time position?
                    </label>
  
                    <label  for="dactmi"                   
                     class="block mb-2 text-sm font-medium text-gray-800 ">
                    </label>
  {job.isFullTimePosition ? ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="true"
                
                onChange={(e) => setIntermediatePositionType(e.target.value)}
              >
                <option>Select option</option>
                <option value={true}>Full-time</option>
                <option value={false}>Part-time</option>
              </select>) : ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="false"
                
                onChange={(e) => setIntermediatePositionType(e.target.value)}
              >
                <option>Select option</option>
                <option value={true}>Full-time</option>
                <option value={false}>Part-time</option>
              </select>)}
                   
                  </div>
                  <div class="space-y-2">
                    <label
                      for="dactmi"
                     
                      class="block mb-2 text-sm font-medium text-gray-800 "
                     
                    >
                      Is this an hourly or salaried position?
                    </label>
  
                    <label  for="dactmi"
                     
                     class="block mb-2 text-sm font-medium text-gray-800 ">
                    
                    </label>

                    {job.isHourly ? ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Hourly"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : (null)}

              
              {job.isSalaried ? ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Salaried"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : (null)}
  
                   
                  </div>
  
  {isHourly ? (
   <div class="space-y-2 ">
   <label
     for="hs-pro-dactmt"
     class="block mb-2 text-sm font-medium text-gray-800">
      Enter the hourly pay range
   </label>
  
  <div class="flex align-items-center">
    <p className="mt-2 mr-1 text-sm font-medium">$</p>
   <input
     id="hs-pro-dactmt"
     type="text"
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={lowerRate}
   
     onChange={(e) => lowerRateValidate(e.target.value)}
  
   />
   <p className="mt-2 text-sm font-medium mr-1 ml-1">/hour - $</p>
   <input
     id="hs-pro-dactmt"
     type="text"
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={upperRate}
                      onChange={(e) => upperRateValidate(e.target.value)}
  
   />
   <p className="mt-2 text-sm font-medium">/hour</p>
     {lowerRateValidationBegun === true ? (
      <p color="red">{lowerRateValidationMessage}</p>
    ) : null}
    {upperRateValidationBegun === true ? (
      <p color="red">{upperRateValidationMessage}</p>
    ) : null}
    </div>
  </div>
  
  ) : (
    null
  )}
  
  {isSalaried ? (<div class="space-y-2">
    <label
      for="hs-pro-dactmt"
      class="block mb-2 text-sm font-medium text-gray-800 "
    >
      Enter the salary range (yearly)
    </label>
    <div className="flex">
    <p className="mt-2 mr-1 text-sm font-medium">$</p>
    <input
     id="hs-pro-dactmt"
     type="text"
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={lowerRate}
   
     onChange={(e) => lowerRateValidate(e.target.value)}
  
   />
   <p className="mt-2 text-sm font-medium mr-1 ml-1"> yearly - $</p>
   <input
     id="hs-pro-dactmt"
     type="text"
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={upperRate}
     onChange={(e) => upperRateValidate(e.target.value)}
  
   />
     <p className="mt-2 ml-1 text-sm font-medium">yearly</p>
     </div>
  </div>) : (null)}
  

                  <div class="space-y-2">
                    <label
                      for="dactmi"
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                     Job Description 
                    </label>
  
                    <div>
                    <RichTextEditor
                      // editorState={editorState}
                      // onChange={(description) =>
                      //   (handleEditorChange(description))                 
                      // }
                      // defaultEditorState="Hello"
                      // onEditorStateChange={this.onEditorStateChange}
                      // ref={field.ref}
                      placeholder="ex: This is a position offered at our company in which you will be responsible for overseeing several skilled machinists."
                  
                    />
         
          
                        </div>
                  </div>
  
                  <div class="space-y-2">
                    <label
                      for="dactmi"
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                    Tell applicants what you're looking for
                    </label>
  
                    <div class="">
    <textarea onChange={(e) => setApplicantDescription(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  rows="6" defaultValue={job.applicantDescription}></textarea>
  </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      for="dactmi"
                      class="block mb-2 text-sm font-medium text-gray-800 "
                    >
                    List employment benefits here (optional)
                    </label>
  
                    <div class="">
    <textarea onChange={(e) => setBenefitsDescription(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  rows="6" defaultValue={job.benefitsDescription ? job.benefitsDescription : null}></textarea>
  </div>
                  </div>
               
              
                
                  
                </div>
  
                <div class="p-4 flex justify-between gap-x-2">
                  <div class="w-full flex justify-end items-center gap-x-2">
                    
  
                    <button
                      type="button"
                      class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                      data-hs-overlay="#hs-pro-datm"
                      onClick={() => checkLength()}
                    >
                      Update Post
                    </button>
                  </div>
                </div>
              </div>
            
              )}
            </div>
       

          <Modal isOpen={isOpenSuccess} onClose={() => handleCloseSuccessModal()}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Success!</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>This post has been updated.</Text>
                <Text>The changes may take a few minutes to update.</Text>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => handleCloseSuccessModal()}>
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </DrawerBody>
          </DrawerContent>
      </Drawer>
        </>
        
      ) : null}
    </>
  );
};

export default EditSelectedBusinessJob;
