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
import {stateFromMarkdown} from 'draft-js-import-markdown';
import EditScreeningQuestions from "./screening_questions/EditScreeningQuestions";

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
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);
  const [shortenedSalary, setShortenedSalary] = useState(null);
  const [shortenedUpperSalary, setShortenedUpperSalary] = useState(null);
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
        setUpperRate(snapshot.data().upperRate);
        setIsHourly(snapshot.data().isHourly);
        // setPayType(snapshot.data().isHourly);
        setIsSalaried(snapshot.data().isSalaried)
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
        setApplicantDescription(snapshot.data().applicantDescription)
        if (snapshot.data().benefitsDescription) {
          setBenefitsDescription(snapshot.data().benefitsDescription)
        }
        setIsFullTimePosition(snapshot.data().isFullTimePosition)
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

  console.log("isSalaried", isSalaried)
  const [displayLowerRate, setDisplayLowerRate] = useState(null);

  const lowerRateValidate = (lowerRate) => {
    console.log("first consumed lower rate", lowerRate);
    let numberLowerRate = parseInt(lowerRate);
    setLowerRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    if (!isValid || null) {
      setLowerRateValidationMessage("Please enter valid rate");
      console.log(lowerRateValidationMessage);
    } else {
      setLowerRateValidationMessage();
      if (payType === "Salaried" || isSalaried === true) {
        console.log("salaried lower rate", lowerRate);
        if (lowerRate.length > 3) {
          let parsed = [];

          let shortened = [];

          //string splitting credit lonesomeday https://stackoverflow.com/questions/6484670/how-do-i-split-a-string-into-an-array-of-characters
          for (var i = 0; i < lowerRate.length; i++) {
            parsed.push(lowerRate.charAt(i));
            console.log("inside ", lowerRate.charAt(i));
          }
          if (parsed.length === 5) {
            shortened.push(parsed[0], parsed[1], "k");
          } else if (parsed.length === 6) {
            shortened.push(parsed[0], parsed[1], parsed[2], "k");
          }

          setLowerRate(numberLowerRate.toLocaleString());
          setShortenedSalary(shortened.join(""));
        }
      }

    }
    if (lowerRate) {
      setDisplayLowerRate(numberLowerRate.toLocaleString());
      console.log("lower rate 1", lowerRate);
    } else {
      setDisplayLowerRate(null);
      console.log("lower rate 2", lowerRate);
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


  const [displayUpperRate, setDisplayUpperRate] = useState(null);

  const upperRateValidate = (upperRate) => {
    console.log("first consumed upper rate", upperRate);
    let numberUpperRate = parseInt(upperRate);
    setUpperRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(upperRate);
    if (!isValid || null) {
      setUpperRateValidationMessage("Please enter valid rate");
      console.log(lowerRateValidationMessage);
    } else {
      setUpperRateValidationMessage();
      if (payType === "Salaried" || isSalaried === true) {
        console.log("salaried lower rate", upperRate);
        if (upperRate.length > 3) {
          let parsed = [];

          let shortened = [];

          for (var i = 0; i < upperRate.length; i++) {
            parsed.push(upperRate.charAt(i));
            console.log("inside ", upperRate.charAt(i));
          }
          if (parsed.length === 5) {
            shortened.push(parsed[0], parsed[1], "k");
          } else if (parsed.length === 6) {
            shortened.push(parsed[0], parsed[1], parsed[2], "k");
          }

          setUpperRate(numberUpperRate.toLocaleString());
          setShortenedUpperSalary(shortened.join(""));
        }
      }

    }
    if (upperRate) {
      setDisplayUpperRate(numberUpperRate.toLocaleString());
      console.log("lower rate 1", upperRate);
    } else {
      setDisplayUpperRate(null);
      console.log("lower rate 2", upperRate);
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
  const handleIsHourly = () => {
    setIsHourly(true);
    setIsSalaried(false);
    setFlatRate(0);
    console.log("hourly")
  };

  const handleIsFixed = () => {
    setIsSalaried(true);
    setIsHourly(false);
    setUpperRate(0);
    setLowerRate(0);
    console.log("salaried")
  };

  useEffect(() => {
    if (payType === "Hourly") {
      handleIsHourly();
    } else if (payType === "Salaried") {
      handleIsFixed();
    }
  }, [payType]);

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
      isFullTimePosition: isFullTimePosition,
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      isSalaried: isSalaried,
      lowerRate: lowerRate,
      category: jobCategory,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription 
      
    })
      .then(() => {
        // addDoc(dbRef, placeholderApplicant);
        // console.log("data submitted employers");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });
  };

  const addJobMap = () => {
    //submit data
    updateDoc(doc(db, "Map Jobs", jobID), {
      isFullTimePosition: isFullTimePosition,
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      isSalaried: isSalaried,
      lowerRate: lowerRate,
      category: jobCategory,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription
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
        isFullTimePosition: isFullTimePosition,
        upperRate: upperRate,
        description: description,
        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        isSalaried: isSalaried,
        lowerRate: lowerRate,
        category: jobCategory,
        applicantDescription: applicantDescription,
        benefitsDescription: benefitsDescription
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
        isFullTimePosition: isFullTimePosition,
        upperRate: upperRate,
        description: description,
        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        isSalaried: isSalaried,
        lowerRate: lowerRate,
        category: jobCategory,
        applicantDescription: applicantDescription,
        benefitsDescription: benefitsDescription
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
      isFullTimePosition: isFullTimePosition,
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      isSalaried: isSalaried,
      lowerRate: lowerRate,
      category: jobCategory,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription
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
      isFullTimePosition: isFullTimePosition,
      upperRate: upperRate,
      description: description,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      isSalaried: isSalaried,
      lowerRate: lowerRate,
      category: jobCategory,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription
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
    //https://github.com/jpuri/react-draft-wysiwyg/issues/462
    setDescription(draftToMarkdown(editorState))
  }

  const handleApplicantEditorChange = (editorState) => {
    setApplicantDescription(draftToMarkdown(editorState))
  }
  
  const handleBenefitsEditorChange = (editorState) => {
    setBenefitsDescription(draftToMarkdown(editorState))
  }
  

  const contentState = stateFromMarkdown(job.description)
  const applicantState = stateFromMarkdown(job.applicantDescription)

  const [benefitsState, setBenefitsState] = useState(null)

  useEffect(() => {
    if (job.benefitsDescription) {
      console.log("here you go ",job.benefitsDescription)
      //credit revoltaxz  https://github.com/jpuri/react-draft-wysiwyg/issues/462
      setBenefitsState(stateFromMarkdown(job.benefitsDescription))
    } 
  }, [job])



  const [editorState, setEditorState] = useState(null)
  const [applicantEditorState, setApplicantEditorState] = useState(null)
  const [benefitsEditorState, setBenefitsEditorState] = useState(null)

  //credit revoltaxz  https://github.com/jpuri/react-draft-wysiwyg/issues/462 
  useEffect(() => {
  if (contentState) {
    setEditorState(EditorState.createWithContent(contentState))
  }
}, [])

useEffect(() => {
  if (applicantState) {
    setApplicantEditorState(EditorState.createWithContent(applicantState))
  }
}, [])

useEffect(() => {
  if (benefitsState) {
    setBenefitsEditorState(EditorState.createWithContent(benefitsState))
  }
}, [benefitsState])



  const [intermediatePositionType, setIntermediatePositionType] = useState(null)

useEffect(() => {
  if (intermediatePositionType) {
    setIsFullTimePosition(JSON.parse(intermediatePositionType))
  } 
}, [intermediatePositionType])

console.log("looking at the job object", job, payType)

const [addScreeningQuestions, setAddScreeningQuestions] = useState(false)

const handleAddScreeningQuestions = () => {
  setAddScreeningQuestions(!addScreeningQuestions)
  onClose()
  
}

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

                    {job.isHourly === true && !payType  ? ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Hourly"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : payType === "Salaried" ? (<select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Salaried"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : (null)}

              
              {job.isSalaried === true && !payType  ? ( <select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Salaried"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : payType === "Hourly" ? (<select
                placeholder="Select option"
                class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                defaultValue="Hourly"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option>Select option</option>
                <option value="Hourly">Hourly</option>
                <option value="Salaried">Salaried</option>
              </select>) : (null)}
  
                   
                  </div>
  
  {job.isHourly === true && !payType ? (
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
   
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={lowerRate}
     value={displayLowerRate}
     onChange={(e) =>
      lowerRateValidate(e.target.value.replace(",", ""))
    }
   />
   <p className="mt-2 text-sm font-medium mr-1 ml-1">/hour - $</p>
   <input
     id="hs-pro-dactmt"
 
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={upperRate}
     value={displayUpperRate}
     onChange={(e) => upperRateValidate(e.target.value.replace(",", ""))}
  
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
  
  ) : payType === "Salaried" ? (<div class="space-y-2">
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
  
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
   
     value={displayLowerRate}
     onChange={(e) =>
      lowerRateValidate(e.target.value.replace(",", ""))
    }
  
   />
   <p className="mt-2 text-sm font-medium mr-1 ml-1"> yearly - $</p>
   <input
     id="hs-pro-dactmt"

     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
   
     value={displayUpperRate }
     onChange={(e) => upperRateValidate(e.target.value.replace(",", ""))}
   />
     <p className="mt-2 ml-1 text-sm font-medium">yearly</p>
     </div>
  </div>) : (null)}
  
  {job.isSalaried && !payType ? (<div class="space-y-2">
    <label
      for="hs-pro-dactmt"
      class="block mb-2 text-sm font-medium text-gray-800 "
    >
      Enter the salary range (yearly) sdfsd
    </label>
    <div className="flex">
    <p className="mt-2 mr-1 text-sm font-medium">$</p>
    <input
     id="hs-pro-dactmt"
  
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={lowerRate}
     value={displayLowerRate }
     onChange={(e) => lowerRateValidate(e.target.value.replace(",", ""))}
  
   />
   <p className="mt-2 text-sm font-medium mr-1 ml-1"> yearly - $</p>
   <input
     id="hs-pro-dactmt"
  
     class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
     defaultValue={upperRate}
     value={displayUpperRate }
     onChange={(e) => upperRateValidate(e.target.value.replace(",", ""))}
  
   />
     <p className="mt-2 ml-1 text-sm font-medium">yearly</p>
     </div>
  </div>) : payType === "Hourly" ? (   <div class="space-y-2 ">
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
                      defaultEditorState={editorState}
                      onChange={(editorState) =>
                        (handleEditorChange(editorState))                 
                      }
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
                    <RichTextEditor
                      defaultEditorState={applicantEditorState}
                      onChange={(applicantState) =>
                        (handleApplicantEditorChange(applicantState))                 
                      }
                      placeholder="ex: This is a position offered at our company in which you will be responsible for overseeing several skilled machinists."

                    />
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
                    <RichTextEditor
                      defaultEditorState={benefitsEditorState}
                      onChange={(benefitsState) =>
                        (handleBenefitsEditorChange(benefitsState))                 
                      }
                      placeholder="ex: This is a position offered at our company in which you will be responsible for overseeing several skilled machinists."
                  
                    />
  </div>
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
            
          <DrawerFooter>
                <div class="p-4 flex justify-between gap-x-2">
                  <div class="w-full flex justify-end items-center gap-x-2">
                    {job.hasScreeningQuestions ? (  <button
                      type="button"
                      class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg  align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 "
                      data-hs-overlay="#hs-pro-datm"
                      onClick={() => handleAddScreeningQuestions()}
                    >
                      Edit Screening Questions
                    </button>) : (  <button
                      type="button"
                      class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg  align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 "
                      data-hs-overlay="#hs-pro-datm"
                      // onClick={() => checkLength()}
                    >
                      Add Screening Questions
                    </button>)}
                
                    <button
                      type="button"
                      class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 "
                      data-hs-overlay="#hs-pro-datm"
                      onClick={() => checkLength()}
                    >
                      Update Post
                    </button>
                  </div>
                </div>
              </DrawerFooter>
          </DrawerContent>
      </Drawer>
        </>
        
      ) : null}
       {addScreeningQuestions === true ? (<EditScreeningQuestions props={job ? job : undefined}/>) : null}
    </>
  );
};

export default EditSelectedBusinessJob;
