import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { StreamChat } from "stream-chat";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../../firebaseConfig";
import AddJob from "./AddJob";
import { v4 as uuidv4 } from "uuid";
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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
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
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { addJobStore } from "../HomePage/lib/addJobStore";
import JobDescriptionInput from "./Editors/JobDescriptionInput";
import Quill from "quill";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { draftToMarkdown } from "markdown-draft-js";
import RichTextEditor from "./RichTextEditor";
import ScreeningQuestions from "./screening_questions/ScreeningQuestions";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Delta = Quill.import("delta");

const AddJobBusiness = ({ heldSelected, toggle, modalOpen}) => {
  useEffect(() => {
    if (heldSelected) {
      console.log("getting passed", heldSelected);
      setStreetAddress(heldSelected.streetAddress);
      setCity(heldSelected.city);
      setState(heldSelected.state);
      setZipCode(heldSelected.zipCode);
      setLocationLat(heldSelected.locationLat);
      setLocationLng(heldSelected.locationLng);
    } else {
      console.log("nothing passed");
    }
  }, []);

  

  const quillRef = useRef();
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const [hasRun, setHasRun] = useState(false);

  const { addJobInfo } = addJobStore();

  useEffect(() => {
    onOpenModal();
  }, []);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log("EMAIL", currentUser.email);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [addJobVisible, setAddJobVisible] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setLoggingOut(true);
    await chatClient.disconnectUser();
    await signOut(auth)
      .then(
        setTimeout(() => {
          navigate("/");
        }, 2000)
      ) // undefined
      .catch((e) => console.log(e));
  };

  const handleAddNewJob = () => {
    setAddJobVisible(true);
  };

  const [showAddJob, setShowAddJob] = useState(false);

  const {
    isOpen: isOPenMobileDash,
    onOpen: onOpenMobileDash,
    onClose: onCloseMobileDash,
  } = useDisclosure();

  //all add job logic

  const [isEstimatedAddress, setIsEstimatedAddress] = useState(false);
  const [isEstimatedPay, setIsEstimatedPay] = useState(false);

  const [isSalaried, setIsSalaried] = useState(null);
  const [applicantDescription, setApplicantDescription] = useState(null);
  const [benefitsDescription, setBenefitsDescription] = useState(null);
  const [isFullTimePosition, setIsFullTimePosition] = useState(null);
  const [flatRate, setFlatRate] = useState(0);
  const [isHourly, setIsHourly] = useState(null);
  const [lowerRate, setLowerRate] = useState(null);
  const [upperRate, setUpperRate] = useState(null);

  const [jobTitle, setJobTitle] = useState(null);
  const [shortenedSalary, setShortenedSalary] = useState(null);
  const [shortenedUpperSalary, setShortenedUpperSalary] = useState(null);
  const [employerID, setEmployerID] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [description, setDescription] = useState(null);
  const [requirements, setRequirements] = useState("");
  const [isFelonEligible, setIsFelonEligible] = useState(false)
  const [isNonEnglishEligible, setIsNonEnglishEligible] = useState(false)


  // isFelonEligible
  // isNonEnglishEligible

  //modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenError,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();

  const [requirements2, setRequirements2] = useState("");
  const [requirements3, setRequirements3] = useState("");
  const [niceToHave, setNiceToHave] = useState(null);
  const [employerProfilePicture, setEmployerProfilePicture] = useState(null);
  const [employerFirstName, setEmployerFirstName] = useState(null);
  const [employerLastName, setEmployerLastName] = useState(null);
  const [companyName, setCompanyName] = useState(null);

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
    if (user != null) {
      const docRef = doc(db, "employers", user.uid);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setCompanyName(snapshot.data().companyName);
        setEmployerFirstName(snapshot.data().firstName);
        setEmployerLastName(snapshot.data().lastName);
        setEmployerProfilePicture(snapshot.data().profilePictureResponse);

        //get profile picture here as well?
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  //credit https://www.code-sample.com/2019/12/react-allow-only-numbers-in-textbox.html
  const numberOnlyRegexMinimumCharacterInput = /^[0-9.,\b]{1,8}$/;

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

  const [finalShortened, setFinalShortened] = useState(null);

  const [displayLowerRate, setDisplayLowerRate] = useState(null);

  const lowerRateHourlyValidate = (lowerRate) => {
    setLowerRateValidationBegun(true);
    const isValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    if (!isValid) {
      setLowerRateValidationMessage("Please enter valid rate");
      console.log(lowerRateValidationMessage);
    } else {
      setLowerRateValidationMessage();
      setLowerRate(lowerRate);
    }
  }

  const upperRateHourlyValidate = (upperRate) => {
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
      if (payType === "Salaried") {
        console.log("salaried lower rate", lowerRate);
        if (lowerRate.length > 3) {
          let parsed = [];

          let shortened = [];

          //string splitting credit lonesomeday https://stackoverflow.com/questions/6484670/how-do-i-split-a-string-into-an-array-of-characters
          // https:// maybe from here too starball & somethinghere stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
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

  /// NEXT: push shortened salary, add it to editing as well. Make it visible on all Maps.

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
      if (payType === "Salaried") {
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
  
    } else {
      setDisplayUpperRate(null);

    }
  };


  //credit https://stackoverflow.com/questions/11511154/regex-for-maximum-length-in-javascript
  const minLengthRegEx = /^.{1,}$/;

  const isThisValid = () => {
    console.log("what now", applicantDescription);
  };

  const [jobTitleMessage, setJobTitleMessage] = useState();
  const [fullTimePositionMessage, setFullTimePositionMessage] = useState();
  const [addressErrorMessage, setAddressErrorMessage] = useState();
  const [isSalariedErrorMessage, setIsSalariedErrorMessage] = useState();
  const [applicantDescriptionMessage, setApplicantDescriptionMessage] = useState();
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState();

  const checkLength = () => {
    //setloading spinner
    
    setPendingSuccess(true);
    setJobTitleMessage();
    setFullTimePositionMessage();
    setAddressErrorMessage();
    setIsSalariedErrorMessage();
    setApplicantDescriptionMessage();
    setDescriptionErrorMessage();


    //check to see if everything is entered
    const descriptionValid = minLengthRegEx.test(description);
    const applicantDescriptionValid = minLengthRegEx.test(applicantDescription);
    
    const upperRateValid = numberOnlyRegexMinimumCharacterInput.test(upperRate);
    const lowerRateValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    const flatRateValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);

    //check for null values https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript user578895



    

    
    if (!jobTitle || jobTitle.length < 1 || jobTitle === "undefined") {
      onOpenError();
      setPendingSuccess(false);
      setJobTitleMessage("Please add a title to the post.")
    } 
    if (isFullTimePosition === null) {
      onOpenError();
      setPendingSuccess(false);
      setFullTimePositionMessage("Please indicate if this position is full-time or part-time.")
    }

    if (applicantDescription === null || applicantDescription.length === 0) {
      onOpenError();
      setPendingSuccess(false);
      setApplicantDescriptionMessage("Please fill out the qualifications needed for this position.")
    }

    if (description === null || description.length === 0) {
      onOpenError();
      setPendingSuccess(false);
      setDescriptionErrorMessage("Please fill out the description for this position.")
    }

    if (isSalaried === null) {
      onOpenError();
      setPendingSuccess(false);
      setIsSalariedErrorMessage("Please indicate if this is a salaried or an hourly position.")
    }


    if (
      //seperate this into their own checks.
      // Ideally this check would be abstracted into it's own Hook... but why start writing legible code now?
      // !jobTitleValid ||
      isOneTime === null ||
      // isFullTimePosition === null ||
      // applicantDescription === null ||
      isSalaried === null
    ) {
      console.log(
        "error here",
        // jobTitleValid,
        jobTitle
        // isOneTime,
        // isFullTimePosition,
        // applicantDescription,
        // isSalaried
      );

      // onOpenError();
      setPendingSuccess(false);
      console.log("1");
    } else {
      // if (isOneTime === true && isSalaried === true && !flatRateValid || !descriptionValid this was throwing invalid idk why but hopefully fixed) {
      if (isOneTime === true && isSalaried === true && !flatRateValid) {
        onOpenError();
        setPendingSuccess(false);
        console.log(
          "2",
          isOneTime,
          isSalaried,
          flatRateValid,
          minLengthRegEx.test(description)
        );
      } else {
        if (
          (isOneTime === true && isHourly === true && !upperRateValid) ||
          !lowerRateValid
        ) {
          console.log("3");
          onOpenError();
          setPendingSuccess(false);
        } else {
          if (isOneTime === false && isSalaried === true && !flatRateValid) {
            console.log("4");
            onOpenError();
            setPendingSuccess(false);
          } else {
            if (
              (isOneTime === false && isHourly !== null && !upperRateValid) ||
              !lowerRateValid
            ) {
              console.log("5");
              onOpenError();
              setPendingSuccess(false);
            } else {
              checkAddress();
            }
          }
        }
      }
    }
    // checkAddress();
  };


// if (!streetAddress) {

// if (heldaddress) {
//   submit()
// }

//error

// } else {
//   submit()
// }

  const checkAddress = () => {
    if (!streetAddress || !locationLat ) {
      if (heldSelected) {
        submitJob();
      } else {
        console.log(streetAddress, locationLat);
        setAddressErrorMessage("Please add an address for this position.")
        onOpenError();
        setPendingSuccess(false);
        console.log("6");
      }
    } else {
      // testJobStore()
      submitJob();
      // onOpenStripe();
      // setStripeOpen(true);
      // console.log("setting stripe open")
    }
  };

  const [payType, setPayType] = useState(null);

  // credit help Michael with setting state from select component https://stackoverflow.com/questions/70353397/how-to-update-the-state-if-dropdown-has-selected-value-with-hooks-and-usestate
  const handleIsHourly = () => {
    setIsHourly(true);
    setIsSalaried(false);
    setFlatRate(0);
  };

  const handleIsFixed = () => {
    setIsSalaried(true);
    setIsHourly(false);
    // setUpperRate(0);
    // setLowerRate(0);
  };

  useEffect(() => {
    if (payType === "Hourly") {
      console.log("hourly");
      handleIsHourly();
    } else if (payType === "Salaried") {
      handleIsFixed();
      console.log("salaried");
    } else {
    }
  }, [payType]);

  const [jobFrequency, setJobFrequency] = useState(null);

  const [isOneTime, setIsOneTime] = useState(true);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLng, setLocationLng] = useState(null);

  useEffect(() => {
    if (jobFrequency === "One Time") {
      setIsOneTime(true);
    } else if (jobFrequency === "Regular Need") {
      setIsOneTime(false);
    } else {
    }
  }, [jobFrequency]);

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
    //credit https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=3 mohshbool & Samuel Meddows
    let initialDate = new Date();
    var dd = String(initialDate.getDate()).padStart(2, "0");
    var mm = String(initialDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + "/" + dd + "/" + yyyy;

    setDatePosted(today);
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
    setDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {
      companyName: companyName,
      isSalaried: isSalaried,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription ? benefitsDescription : null,
      isFullTimePosition: isFullTimePosition,
      employerID: employerID,
      employerEmail: user.email,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerProfilePicture: employerProfilePicture,
      jobTitle: jobTitle,
      jobID: jobID,
      isActive: true,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      shortenedSalary: shortenedSalary,
      shortenedUpperSalary: shortenedUpperSalary,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory ? jobCategory : false,
      city: city,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      isEstimatedPay: isEstimatedPay,
      isEstimatedAddress: isEstimatedAddress,
      isFelonEligible: isFelonEligible,
      isNonEnglishEligible: isNonEnglishEligible,
    })
      .then(() => {
        addDoc(dbRef, placeholderApplicant);
        console.log("data submitted employers");
      })
      .catch((error) => {
        // no bueno
        onOpenError();
        console.log(error);
      });
  };

  const addJobMap = () => {
    //submit data
    setDoc(doc(db, "Map Jobs", jobID), {
      companyName: companyName,
      isPostedByBusiness: true,
      isSalaried: isSalaried,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription ? benefitsDescription : null,
      isFullTimePosition: isFullTimePosition,
      employerID: employerID,
      employerEmail: user.email,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerProfilePicture: employerProfilePicture,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      shortenedSalary: shortenedSalary,
      shortenedUpperSalary: shortenedUpperSalary,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isActive: true,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory ? jobCategory : false,
      city: city,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      isEstimatedPay: isEstimatedPay,
      isEstimatedAddress: isEstimatedAddress,
      isFelonEligible: isFelonEligible,
      isNonEnglishEligible: isNonEnglishEligible,
    })
      .then(() => {
        //all good
        setPendingSuccess(false);
        console.log("data submitted for Maps");
      })
      .catch((error) => {
        // no bueno
        onOpenError();
        console.log(error);
      });

    if (isVolunteer == true) {
      //adds to volunteer only db for map
      setDoc(doc(db, "Map Jobs Volunteer", jobID), {
        companyName: companyName,
        isPostedByBusiness: true,
        employerID: employerID,
        employerEmail: user.email,
        jobTitle: jobTitle,
        jobID: jobID,
        firstName: firstName,
        lowerRate: lowerRate,
        upperRate: upperRate,
        shortenedSalary: shortenedSalary,
        shortenedUpperSalary: shortenedUpperSalary,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        isActive: true,
        // isOneTime: isOneTime,
        isSalaried: isSalaried,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerCaseJobTitle: lowerCaseJobTitle,
        category: jobCategory ? jobCategory : false,
        city: city,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        locationLat: locationLat,
        locationLng: locationLng,
        description: description,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        isEstimatedPay: isEstimatedPay,
        isEstimatedAddress: isEstimatedAddress,
        isFelonEligible: isFelonEligible,
        isNonEnglishEligible: isNonEnglishEligible,
      })
        .then(() => {
          //all good
          setPendingSuccess(false);
          console.log("data submitted for Maps");
        })
        .catch((error) => {
          // no bueno
          onOpenError();
          console.log(error);
        });
    } else {
      setDoc(doc(db, "Map Jobs Paid", jobID), {
        companyName: companyName,
        isPostedByBusiness: true,
        isSalaried: isSalaried,
        applicantDescription: applicantDescription,
        benefitsDescription: benefitsDescription ? benefitsDescription : null,
        isFullTimePosition: isFullTimePosition,
        employerID: employerID,
        employerEmail: user.email,
        jobTitle: jobTitle,
        jobID: jobID,
        firstName: firstName,
        lowerRate: lowerRate,
        upperRate: upperRate,
        shortenedSalary: shortenedSalary,
        shortenedUpperSalary: shortenedUpperSalary,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        isActive: true,
        // isOneTime: isOneTime,
        isSalaried: isSalaried,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerCaseJobTitle: lowerCaseJobTitle,
        datePosted: datePosted,
        category: jobCategory ? jobCategory : false,
        city: city,
        streetAddress: streetAddress,
        state: state,
        zipCode: zipCode,
        locationLat: locationLat,
        locationLng: locationLng,
        description: description,
        requirements: requirements,
        requirements2: requirements2,
        requirements3: requirements3,
        niceToHave: niceToHave,
        isEstimatedPay: isEstimatedPay,
        isEstimatedAddress: isEstimatedAddress,
        isFelonEligible: isFelonEligible,
        isNonEnglishEligible: isNonEnglishEligible,
      })
        .then(() => {
          //all good
          setPendingSuccess(false);
          console.log("data submitted for Maps");
        })
        .catch((error) => {
          // no bueno
          onOpenError();
          console.log(error);
        });
      //adds to paid only db for map
    }
  };

  const addJobGlobal = () => {
    //submit data
    setDoc(doc(db, "Jobs", user.uid, "Posted Jobs", jobTitle), {
      companyName: companyName,
      isPostedByBusiness: true,
      isSalaried: isSalaried,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription ? benefitsDescription : null,
      isFullTimePosition: isFullTimePosition,
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerProfilePicture: employerProfilePicture,
      upperRate: upperRate,
      shortenedSalary: shortenedSalary,
      shortenedUpperSalary: shortenedUpperSalary,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isSalaried: isSalaried,
      isActive: true,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory ? jobCategory : false,
      city: city,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      isEstimatedPay: isEstimatedPay,
      isEstimatedAddress: isEstimatedAddress,
      isFelonEligible: isFelonEligible,
      isNonEnglishEligible: isNonEnglishEligible,
    })
      .then(() => {
        //all good
        console.log("data submitted global");
      })
      .catch((error) => {
        // no bueno
        onOpenError();
        console.log(error);
      });

    //submit data
    setDoc(doc(db, "All Jobs", jobID), {
      companyName: companyName,
      isPostedByBusiness: true,
      isSalaried: isSalaried,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription ? benefitsDescription : null,
      isFullTimePosition: isFullTimePosition,
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      shortenedSalary: shortenedSalary,
      shortenedUpperSalary: shortenedUpperSalary,
      upperRate: upperRate,
      isActive: true,
      isVolunteer: isVolunteer,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerProfilePicture: employerProfilePicture,
      isOneTime: isOneTime,
      isSalaried: isSalaried,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      city: city,
      state: state,
      datePosted: datePosted,
      category: jobCategory ? jobCategory : false,
      streetAddress: streetAddress,
      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
      isEstimatedPay: isEstimatedPay,
      isEstimatedAddress: isEstimatedAddress,
      isFelonEligible: isFelonEligible,
      isNonEnglishEligible: isNonEnglishEligible,
    })
      .then(() => {
        //all good
        console.log("submitted");
      })
      .catch((error) => {
        // no bueno
        onOpenError();
        console.log(error);
      });

    setShowAddJob(!showAddJob);

    onOpen();

    // navigate("/AddJobInfo", {
    //   state: {
    //     jobTitle: jobTitle,
    //     isVolunteer: isVolunteer,
    //     jobID: jobID,
    //     firstName: firstName,
    //   },
    // });
  };

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

  useEffect(() => {
    if (jobTitle !== null) {
      setLowerCaseJobTitle(jobTitle.toLowerCase());
    } else {
    }
  }, [jobTitle]);

  useEffect(() => {
    setJobID(uuidv4());
  }, [user]);

  // useEffect(() => {
  //   if (employerID !== null) {
  //     const docRef = doc(db, "employers", employerID);

  //     getDoc(docRef).then((snapshot) => {
  //       console.log(snapshot.data());
  //       setCity(snapshot.data().city);
  //       setState(snapshot.data().state);
  //       setFirstName(snapshot.data().firstName);
  //     });
  //   } else {
  //   }
  // }, [employerID]);

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

  useEffect(() => {
    if (!heldSelected) {
      setStreetAddress(streetNumber + " " + streetName);
      console.log(streetAddress);
    }
  }, [streetName, streetName]);

  const [addressIncorrect, setAddressIncorrect] = useState(false);
  let addressIncorrectMessage = "Please enter a more specific address";

  useEffect(() => {
    if (firstAddress !== null && !heldSelected) {
      let results = [];
      // run through ewach object in array (if else)
      //evaluate if type == street address, city, state, etc
      // if true, push to corresponding state
      // firstAddress.forEach((firstAddress) => {
      if (firstAddress[0]) {
        console.log(firstAddress);
        setStreetNumber(firstAddress[0].long_name);
        // setStreetNumber(firstAddress[0].long_name);
        // console.log("first one", firstAddress[0].long_name);
      } else {
        setAddressIncorrect(true);
      }
      if (firstAddress[1]) {
        setStreetName(firstAddress[1].long_name);
        // console.log(firstAddress[1].long_name);
      } else {
        setAddressIncorrect(true);
      }
      
      if (firstAddress[2]) {
        setCity(firstAddress[2].long_name);
        // console.log(firstAddress[2].long_name);
      } else {
        setAddressIncorrect(true);
      }
      if (firstAddress[4]) {
        setState(firstAddress[4].long_name);
        // console.log(firstAddress[4].long_name);
      } else {
        setAddressIncorrect(true);
      }
      if (firstAddress[6]) {
        setZipCode(firstAddress[6].long_name);
        setAddressIncorrect(false);
      } else {
        setAddressIncorrect(true);
      }
      // });
    } else {
    
    }
  }, [firstAddress]);

  useEffect(() => {
    console.log("raw address", rawAddress);
    if (rawAddress && !heldSelected) {
      geocodeByAddress(rawAddress.value.description)
        .then((results) => getLatLng(results[0]))
        .then(({ lat }) => setLocationLat(lat));
      // .then(({ lng }) => setLocationLng(lng));
      geocodeByAddress(rawAddress.value.description)
        .then((results) => getLatLng(results[0]))
        .then(({ lng }) => setLocationLng(lng));
      geocodeByPlaceId(rawAddress.value.place_id)
        .then((results) => setFirstAddress(results[0].address_components))
        .catch((error) => console.error(error));
    } else {
    }
  }, [rawAddress]);

  //laoding control

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const handleCloseBothAndOpenQuestions = () => {
    toggle();
    onClose();

    // onCloseModal();
    
  };

  const handleCloseBoth = () => {
    toggle();
    onClose();
    // onCloseModal();
    
    onOpenSuccess();
  };

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const handleCloseSuccess = () => {
  onCloseSuccess();  
  // toggle();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [stripeOpen, setStripeOpen] = useState(false);

  const {
    isOpen: isOpenStripe,
    onOpen: onOpenStripe,
    onClose: onCloseStripe,
  } = useDisclosure();

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session

    return (
      fetch(
        "https://fulfil-api.onrender.com/create-checkout-single-post",

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        //   .then((data) => console.log(data))
        .then((data) => data.clientSecret)
    );

    //pass data or data.clientSecret?
    // const { client_secret } = await response.json()
    // setClientSecret(data.clientSecret)
    // console.log("session", client_secret);
    // onOpenStripe()
  }, []);

  const options = { fetchClientSecret };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    if (sessionId) {
      setHasRun(false);
      fetch(
        `https://fulfil-api.onrender.com/single-post-session-status?session_id=${sessionId}`
        // `https://localhost:80/single-post-session-status?session_id=${sessionId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "complete") {
            // setIsLoading(true);
            // getJobDataAgain(data);
            // submitJob() goes here
            setTimeout(() => {
              console.log("we got your payment", companyName, lowerRate);
              // submitJob()
              setLoading(false);
            }, 2000);
          } else {
            alert(
              "There was an error processing your payment. Please try again later."
            );
          }
        });
    } else {
    }
  }, []);

  const testJobStore = () => {
    addJobInfo({
      companyName: companyName,
      isSalaried: isSalaried,
      applicantDescription: applicantDescription,
      benefitsDescription: benefitsDescription ? benefitsDescription : null,
      isFullTimePosition: isFullTimePosition,
      employerID: employerID,
      employerEmail: user.email,
      employerFirstName: employerFirstName,
      employerLastName: employerLastName,
      employerProfilePicture: employerProfilePicture,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isSalaried: isSalaried,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory ? jobCategory : false,
      city: city,
      streetAddress: streetAddress,
      state: state,
      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
    });
  };

  // const [editorState, setEditorState] = useState(null)

  const [pendingSuccess, setPendingSuccess] = useState(false);

  const handleEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setDescription(draftToMarkdown(editorState));
  };

  const handleApplicantEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setApplicantDescription(draftToMarkdown(editorState));
  };

  const handleBenefitsEditorChange = (editorState) => {
    // (console.log("here it is", draftToMarkdown(editorState)))
    setBenefitsDescription(draftToMarkdown(editorState));
  };

  const handleClosePostJob = () => {
    addJobInfo(heldSelected);
    onCloseModal();

    //add code to trigger reopen of modal/drawer
  };

  const [intermediatePositionType, setIntermediatePositionType] =
    useState(null);

  useEffect(() => {
    if (intermediatePositionType) {
      setIsFullTimePosition(JSON.parse(intermediatePositionType));
    }
  }, [intermediatePositionType]);



  const [addScreeningQuestions, setAddScreeningQuestions] = useState(false)

  const handleAddScreeningQuestions = () => {
    handleCloseBothAndOpenQuestions();
    setAddScreeningQuestions(!addScreeningQuestions)
 
  }

  // const handleClosePostTest = () => {
  //   toggle();
  // }
 

  // if (isLoading === true) {
  //   return (
  //     <>
  //       <Center>
  //         <Spinner
  //           thickness="4px"
  //           speed="0.65s"
  //           emptyColor="gray.200"
  //           color="blue.500"
  //           size="xl"
  //         />
  //       </Center>
  //     </>
  //   );
  // }

  return (
    <div>
      {/* <Drawer
        onClose={() => handleClosePostJob()}
        isOpen={isOpenModal}
        size={"xl"}
      > */}
      <Drawer
      //this was removed because it was saying it was not defined... This component is no longer in use.
        // onClose={handleClosePostTest}
        isOpen={modalOpen}
        size={"xl"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader w={"50%"}>Create Position</DrawerHeader>
          <DrawerBody>
            <div class=" ">
              <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                {/* <div class="py-3 px-4 flex justify-between items-center border-b ">
              <h3 class="font-semibold text-gray-800">Create A Job</h3>
          
            </div> */}

                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                  <div class="p-4 space-y-5">
                    <div class="space-y-2">
                      <label
                        for="hs-pro-dactmt"
                        class="block mb-2 font-medium text-gray-800 "
                      >
                        Position Title
                      </label>

                      <input
                        id="hs-pro-dactmt"
                        type="text"
                        class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        placeholder="Ex: Assembler, Hostess, Welder"
                        // width="560px"
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                      {jobTitleMessage ? (<p className="text-red-500 ">{jobTitleMessage}</p>) : null}
                    </div>
                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2  font-medium text-gray-800 "
                      >
                        Is this a full-time or part-time position?
                      </label>

                     

                      <select
                        // help from https://groups.google.com/g/knockoutjs/c/_-NzcCQreQ8?pli=1
                        data-bind="booleanValue: state"
                        placeholder="Select option"
                        class="py-3 px-4 pe-9 block w-full bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        onChange={(e) =>
                          setIntermediatePositionType(e.target.value)
                        }
                      >
                        <option>Select option</option>
                        <option value={true}>Full-time</option>
                        <option value={false}>Part-time</option>
                      </select>
                      {fullTimePositionMessage ? (<p className="text-red-500 ">{fullTimePositionMessage}</p>) : null}
                    </div>
                    <div class="space-y-2">
                      <label
                        for="dactmd"
                        class="block mb-2  font-medium text-gray-800 "
                      >
                        Where is this position located?
                      </label>
                      {heldSelected ? (
                        <p>
                          {heldSelected.streetAddress}, {heldSelected.city},{" "}
                          {heldSelected.state}, {heldSelected.zipCode}
                        </p>
                      ) : (
                        <GooglePlacesAutocomplete
                          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                          fetchDetails={true}
                          // minLengthAutocomplete={3}
                          autocompletionRequest={{
                            types: ["address"],
                          }}
                          selectProps={{
                            rawAddress,
                            styles: {
                              zIndex: 9999,
                              option: (provided) => ({
                                ...provided,

                                zIndex: 9999,
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                            },
                            onChange: setRawAddress,
                            placeholder: "Type address here",
                          }}
                        />
                      )}
  
                      {addressErrorMessage ? (<p className="text-red-500" >{addressErrorMessage}</p>) : null}



                      {user && user.email === "themasterbusiness@gmail.com" ? (
                        <>
                          <p>estimated address ? </p>{" "}
                          <select
                            placeholder="Estimated address?"
                            class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            onChange={(e) =>
                              setIsEstimatedAddress(e.target.value)
                            }
                          >
                            <option>Select option</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </>
                      ) : null}

                      {/* <label
                    for="dactmi"
                    class="block mb-2 text-sm font-medium text-gray-800 "
                  >
                   Text editor test
                  </label>
                  <JobDescriptionInput 
                   ref={quillRef}
                  
                   defaultValue={new Delta()
                    }
                 
              
                   /> */}
                    </div>
                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2  font-medium text-gray-800 "
                      >
                        Is this an hourly or salaried position?
                      </label>

                      <label
                        for="dactmi"
                        class="block mb-2 text-sm font-medium text-gray-800 "
                      ></label>

                      <select
                        placeholder="Select option"
                        class="py-3 px-4 pe-9 block w-full bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        onChange={(e) => setPayType(e.target.value)}
                      >
                        <option>Select option</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Salaried">Salaried</option>
                      </select>
                      {isSalariedErrorMessage ? (<p className="text-red-500">{isSalariedErrorMessage}</p>) : null}
                    </div>
                    

                    {user && user.email === "themasterbusiness@gmail.com" ? (
                      <>
                        <p>estimated pay ? </p>{" "}
                        <select
                          placeholder="Estimated address?"
                          class="py-3 px-4 pe-9 block w-full bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                          onChange={(e) => setIsEstimatedPay(e.target.value)}
                        >
                          <option>Select option</option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </select>
                      </>
                    ) : null}

                    {isHourly ? (
                      <div class="space-y-2 ">
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-2  font-medium text-gray-800 "
                        >
                          Enter the hourly pay range
                        </label>

                        <div class="flex align-items-center">
                          <p className="mt-2 mr-1 font-medium">$</p>
                          <input
                            id="hs-pro-dactmt"
                          
                            // value={lowerRate}
                            class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg  placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            placeholder="lower rate"
                            onChange={(e) => lowerRateHourlyValidate(e.target.value)}
                          />
                          <p className="mt-2  font-medium mr-1 ml-1">
                            /hour - $
                          </p>
                          <input
                            id="hs-pro-dactmt"
                          
                            class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg  placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            placeholder="upper rate"
                            onChange={(e) => upperRateHourlyValidate(e.target.value)}
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
                    ) : null}

                    {isSalaried ? (
                      <div class="space-y-2">
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-2  font-medium text-gray-800 "
                        >
                          Enter the salary range (annual pay)
                        </label>
                        <div className="flex">
                          <p className="mt-2 mr-1 font-medium">$</p>
                          <input
                            id="hs-pro-dactmt"
                            value={displayLowerRate}
                            class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg  placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            placeholder="lower rate"
                            onChange={(e) =>
                              lowerRateValidate(e.target.value.replace(",", ""))
                            }
                          />
                          <p className="mt-2 font-medium mr-1 ml-1">
                            {" "}
                            yearly - $
                          </p>
                          <input
                            id="hs-pro-dactmt"
        
                            value={displayUpperRate}
                            class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg  placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                            placeholder="upper rate"
                            // I dont think I have to cite this but https://stackoverflow.com/questions/10398931/how-to-remove-text-from-a-string
                            onChange={(e) => upperRateValidate(e.target.value.replace(",", ""))}
                          />
                          <p className="mt-2 ml-1 font-medium">
                            yearly
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2  font-medium text-gray-800 "
                      >
                        Choose a category for this position (optional)
                      </label>

                      <select
                        placeholder="Select option"
                        class="py-3 px-4 pe-9 block w-full bg-white border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                        onChange={(e) => setJobCategory(e.target.value)}
                      >
                        <option>Select option</option>
                        <option value="Healthcare & Ambulatory Health Care">Healthcare & Ambulatory Health Care</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Construction">Construction</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Warehousing">Warehousing</option>
                        <option value="Accommodation & Food Services">Accommodation & Food Services</option>
                        <option value="Arts, Entertainment, and Recreation">Arts, Entertainment, and Recreation</option>
                        <option value="Agriculture, Forestry">Agriculture, Forestry</option>
                        <option value="Utilities">Utilities</option>
                        <option value="General Physical Labor">General Physical Labor</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2  font-medium text-gray-800 "
                      >
                        This position is open to those who are(optional):
                      </label>

                      <div class="flex">
                      <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      onChange={(e) => setIsFelonEligible(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                  </div>
                  <div className=" leading-6">
                    <label  className=" text-gray-900" >
                  Convicted felons
                    </label>
                   
                  </div>
                </div>
</div>

<div class="flex">
<div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      onChange={(e) => setIsNonEnglishEligible(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                  </div>
                  <div className=" leading-6">
                    <label  className=" text-gray-900" >
                 Non-english speakers
                    </label>
                   
                  </div>
                </div>
</div>

                     
                    </div>

                    <div class="space-y-2 z-0">
                      <label
                        for="dactmi"
                        class="block mb-2 font-medium text-gray-800 "
                      >
                        Job Description
                      </label>

                      <div>
                        <RichTextEditor
                          onChange={(description) =>
                            handleEditorChange(description)
                          }
                          // ref={field.ref}
                          placeholder="ex: This is a position offered at our company in which you will be responsible for overseeing several skilled machinists."
                        />
                      </div>
                     {descriptionErrorMessage ? (<p className="text-red-500">{descriptionErrorMessage}</p>) : null}
                    </div>

                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2 font-medium text-gray-800 "
                      >
                        Job Qualifications
                      </label>
                      <RichTextEditor
                        onChange={(description) =>
                          handleApplicantEditorChange(description)
                        }
                        // ref={field.ref}
                        placeholder="ex: 3+ years of management expereince in either a construction or construction adjacent industry. You should be able to prioritize tasks well and in accordance with our overall business goals. "
                      />
                       {applicantDescriptionMessage ? (<p className="text-red-500">{applicantDescriptionMessage}</p>) : null}
                      {/* <div class="">
  <textarea onChange={(e) => setApplicantDescription(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  rows="6" placeholder="ex: 3+ years of management expereince in either a construction or construction adjacent industry. You should be able to prioritize tasks well and in accordance with our overall business goals. "></textarea>
</div> */}
                    </div>
                    <div class="space-y-2">
                      <label
                        for="dactmi"
                        class="block mb-2 font-medium text-gray-800 "
                      >
                        List employment benefits here (optional)
                      </label>
                      <RichTextEditor
                        onChange={(description) =>
                          handleBenefitsEditorChange(description)
                        }
                        // ref={field.ref}
                        placeholder="ex: 3+ years of management expereince in either a construction or construction adjacent industry. You should be able to prioritize tasks well and in accordance with our overall business goals. "
                      />
                      {/* <div class="">
  <textarea onChange={(e) => setBenefitsDescription(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  rows="6" placeholder="ex: Company-covered health insurance, PTO, 4% 401k match"></textarea>
</div> */}
                    </div>
                  </div>

                  <div class="p-4 flex justify-between gap-x-2">
                    <div class="w-full flex justify-end items-center gap-x-2">
                      {pendingSuccess ? (
                        <button
                          type="button"
                          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                          data-hs-overlay="#hs-pro-datm"

                          // onClick={() => testJobStore()}
                        >
                          <div
                            class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full "
                            role="status"
                            aria-label="loading"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </button>
                      ) : (
                        <div>
                         

                          <button
                            type="button"
                            class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                            data-hs-overlay="#hs-pro-datm"
                            onClick={() => checkLength()}
                            // onClick={() => testJobStore()}
                          >
                            Post Job
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {addScreeningQuestions === true ? (<ScreeningQuestions props={jobTitle ? jobTitle : undefined} jobID={jobID ? jobID : null} toggle={toggle}/>) : null}
     

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Screening Questions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">Would you like to add screening questions to this job post?</p>

          </ModalBody>

          <ModalFooter>
          <button
              type="button"
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 mr-1 text-start bg-white hover:bg-gray-100 text-sky-400  font-medium rounded-lg  align-middle focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => handleCloseBoth()}
            >
              No thanks
            </button>

            <button
              type="button"
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => handleAddScreeningQuestions()}
            >
              Add screening questions
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      
      <Modal isOpen={isOpenSuccess} onClose={onCloseSuccess}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-800 text-base">Your position has been posted.</p>

          </ModalBody>

          <ModalFooter>
        

            <button
              type="button"
              class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => handleCloseSuccess()}
            >
              Continue
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenError} onClose={onCloseError}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Oops!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Please fill out all required fields.</p>

            <p className="mt-2">
              If this problem persists, please contact us at tyler@getfulfil.com
            </p>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
              data-hs-overlay="#hs-pro-datm"
              onClick={() => onCloseError()}
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {stripeOpen && (
        <Modal
          isOpen={isOpenStripe}
          onClose={() => setStripeOpen(false)}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />

            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AddJobBusiness;
