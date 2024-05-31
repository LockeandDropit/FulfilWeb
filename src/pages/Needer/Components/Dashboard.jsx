import React from "react";
import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByPlaceId } from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const Dashboard = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

  //this is the same user, rewritten to accomidate the f(x) that grabs the users unread messages
  const [currentUser, setCurrentUser] = useState(null)


  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setCurrentUser(currentUser)
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [addJobVisible, setAddJobVisible] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setLoggingOut(true);

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

  const [showAddJobLeftNav, setShowAddJobLeftNav] = useState(false);


  const { isOpen: isOPenMobileDash, onOpen: onOpenMobileDash, onClose: onCloseMobileDash } = useDisclosure()



  //all add job logic

  const [isFlatRate, setIsFlatRate] = useState();
  const [flatRate, setFlatRate] = useState(0);
  const [isHourly, setIsHourly] = useState();
  const [lowerRate, setLowerRate] = useState(0);
  const [upperRate, setUpperRate] = useState(0);
  const [jobTitle, setJobTitle] = useState(null);

  const [employerID, setEmployerID] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [description, setDescription] = useState(null);
  const [requirements, setRequirements] = useState("");
  const [unseenMessages, setUnseenMessages] = useState(0)


       //modal control
       const { isOpen, onOpen, onClose } = useDisclosure()
       const { isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError } = useDisclosure()


  const [requirements2, setRequirements2] = useState("");
  const [requirements3, setRequirements3] = useState("");
  const [niceToHave, setNiceToHave] = useState(null);



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
    const descriptionValid = minLengthRegEx.test(description)
    const jobTitleValid = minLengthRegEx.test(jobTitle);
    const upperRateValid = numberOnlyRegexMinimumCharacterInput.test(upperRate);
    const lowerRateValid = numberOnlyRegexMinimumCharacterInput.test(lowerRate);
    const flatRateValid = numberOnlyRegexMinimumCharacterInput.test(flatRate);

    //check for null values https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript user578895

    if (!jobTitleValid || isOneTime === null ) {
      console.log("1");
      onOpenError()
      console.log("1");
    } else {
      if (isOneTime === true && isFlatRate === true && !flatRateValid || !descriptionValid) {
        onOpenError()
        console.log("2");
      } else {
        if (
          (isOneTime === true && isHourly === true && !upperRateValid || !descriptionValid) ||
          !lowerRateValid
        ) {
          console.log("3");
          onOpenError()
        } else {
          if (isOneTime === false && isFlatRate === true && !flatRateValid || !descriptionValid) {
            console.log("4");
            onOpenError()
          } else {
            if (
              (isOneTime === false && isHourly !== null && !upperRateValid) ||
              !lowerRateValid
            ) {
              console.log("5");
              onOpenError()
            } else {
            }
          }
        }
      }
    }
    checkAddress();
  };

  const checkAddress = () => {
    if (!streetAddress || !locationLat) {
      console.log(streetAddress, locationLat);
      onOpenError()
      console.log("6");
    } else {
      submitJob();
    }
  };

  const [payType, setPayType] = useState(null);

  // credit help Michael with setting state from select component https://stackoverflow.com/questions/70353397/how-to-update-the-state-if-dropdown-has-selected-value-with-hooks-and-usestate
  const handleIsHourly = () => {
    setIsHourly(true);
    setIsFlatRate(false);
    setFlatRate(0);
  };

  const handleIsFixed = () => {
    setIsFlatRate(true);
    setIsHourly(false);
    setUpperRate(0);
    setLowerRate(0);
  };

  useEffect(() => {
    if (payType === "Hourly") {
      handleIsHourly();
    } else if (payType === "Fixed") {
      handleIsFixed();
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
    let initialDate = new Date()
    var dd = String(initialDate.getDate()).padStart(2, '0');
    var mm = String(initialDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = initialDate.getFullYear();

    var today = mm + '/' + dd + '/' + yyyy;


   
   
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
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory,
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
    setDoc(doc(db, "Map Jobs", jobID), {
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      // isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory,
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
      setDoc(doc(db, "Map Jobs Volunteer", jobID), {
        employerID: employerID,
        employerEmail: user.email,
        jobTitle: jobTitle,
        jobID: jobID,
        firstName: firstName,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        // isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerCaseJobTitle: lowerCaseJobTitle,
        category: jobCategory,
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
      setDoc(doc(db, "Map Jobs Paid", jobID), {
        employerID: employerID,
        employerEmail: user.email,
        jobTitle: jobTitle,
        jobID: jobID,
        firstName: firstName,
        lowerRate: lowerRate,
        upperRate: upperRate,
        isVolunteer: isVolunteer,
        isOneTime: isOneTime,
        // isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,
        lowerCaseJobTitle: lowerCaseJobTitle,
        datePosted: datePosted,
        category: jobCategory,
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
    setDoc(doc(db, "Jobs", user.uid, "Posted Jobs", jobTitle), {
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      datePosted: datePosted,
      category: jobCategory,
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
    setDoc(doc(db, "All Jobs", jobID), {
      employerID: employerID,
      employerEmail: user.email,
      jobTitle: jobTitle,
      jobID: jobID,
      firstName: firstName,
      lowerRate: lowerRate,
      upperRate: upperRate,
      isVolunteer: isVolunteer,
      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,
      lowerCaseJobTitle: lowerCaseJobTitle,
      city: city,
      state: state,
      datePosted: datePosted,
      category: jobCategory,

      streetAddress: streetAddress,

      zipCode: zipCode,
      locationLat: locationLat,
      locationLng: locationLng,
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
    })
      .then(() => {
        //all good
        console.log("submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

      setShowAddJobLeftNav(!showAddJobLeftNav)

    onOpen()

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

  useEffect(() => {
    if (employerID !== null) {
      const docRef = doc(db, "employers", employerID);

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setCity(snapshot.data().city);
        setState(snapshot.data().state);
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

  useEffect(() => {
    setStreetAddress(streetNumber + " " + streetName);
    console.log(streetAddress);
  }, [streetName, streetName]);

  const [addressIncorrect, setAddressIncorrect] = useState(false)
  let addressIncorrectMessage = "Please enter a more specific address"

  useEffect(() => {
    if (firstAddress !== null) {
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
        setAddressIncorrect(true)
      }
      if (firstAddress[1]) {
        setStreetName(firstAddress[1].long_name);
        // console.log(firstAddress[1].long_name);
      } else {
        setAddressIncorrect(true)
      }
      if (firstAddress[2]) {
        setCity(firstAddress[2].long_name);
        // console.log(firstAddress[2].long_name);
      } else {
        setAddressIncorrect(true)
      }
      if (firstAddress[4]) {
        setState(firstAddress[4].long_name);
        // console.log(firstAddress[4].long_name);
      } else {
        setAddressIncorrect(true)
      }
      if (firstAddress[6]) {
        setZipCode(firstAddress[6].long_name);
       setAddressIncorrect(false)
      } else {
        setAddressIncorrect(true)
      }
      // });
    } else {
    }
  }, [firstAddress]);

  useEffect(() => {
    console.log("raw address", rawAddress);
    if (rawAddress) {
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

  //get number of unread messages

  useEffect(() => {
   if (currentUser) {
      let allChats = [];

      const unSub = onSnapshot(
        doc(db, "User Messages", currentUser.uid),
        async (res) => {
          let unreadMessages = 0;
    
          const items = res.data().chats;

          console.log("res data",res.data().chats)

          items.map(async (item) => {
           
            console.log("fetchedIDs", item.chatId)

            if (item.isSeen === false) {
                unreadMessages++
            }
          });


          console.log(unreadMessages)

          if (unreadMessages > 0) {
           setUnseenMessages(unreadMessages) 
          }
        }
      );

      return () => {
        unSub();
      };
   }
  }, [currentUser]);





  return (
    <div>
      <aside
        id="hs-pro-sidebar"
        class="hs-overlay [--auto-close:lg]
      hs-overlay-open:translate-x-0
      -translate-x-full transition-all duration-300 transform
      w-[260px]
      hidden
      fixed inset-y-0 start-0 z-[60]
      bg-white border-e border-gray-200
      lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
     
     "
      >
        <div class="flex flex-col h-full max-h-full py-3">
          <header class="h-[46px] px-8">
            <a
              class="flex-none text-4xl font-sans font-bold text-sky-400"
              aria-label="Brand"
              onClick={() => navigate("/Homepage")}
            >
              Fulfil
            </a>
          </header>

          <div class="h-[calc(100%-35px)] lg:h-[calc(100%-93px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <nav
              class="hs-accordion-group pb-3  w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open
            >
              <ul>
                <li class="px-5 mb-1.5">
                  <button
                    class="flex w-full gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 "
                    onClick={() => navigate("/Homepage")}
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-4"
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
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    My Jobs
                  </button>
                </li>


    {unseenMessages > 0 ? (   <button
                  type="button"
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
             onClick={() => navigate("/NeederChatEntry")}
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                  Messages
                  <span class=" ml-auto inline-flex items-center  px-2 rounded-full text-[10px] font-medium bg-red-500 text-white">{unseenMessages}</span>
                  
                </button>) : (   <button
                  type="button"
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
             onClick={() => navigate("/NeederChatEntry")}
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                  Messages
                </button>)}
             

                <button
                  type="button"
                  onClick={() => {
                    navigate("/UserProfileNeeder");
                  }}
                  class="hs-accordion-toggle  px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/NeederAccountManager")}
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
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
                  Account Settings
                </button>

                <li class="pt-5 px-8 mt-5 mb-1.5 border-t border-gray-200 first:border-transparent first:pt-0">
                  <span class="block text-xs uppercase text-gray-500">
                    Actions
                  </span>
                </li>

                <li class="px-5 mb-0.5">
                  <button
                    class="flex items-center gap-x-2 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate(`/NeederAllCategories`)}
                  >
                    <span class="flex justify-center items-center size-6 bg-sky-400 text-white rounded-md">
                      <svg
                        class="flex-shrink-0 size-3"
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
                        <rect width="18" height="7" x="3" y="3" rx="1" />
                        <rect width="9" height="7" x="3" y="14" rx="1" />
                        <rect width="5" height="7" x="16" y="14" rx="1" />
                      </svg>
                    </span>
                    Find A Pro
                  </button>
                </li>
                {/* <li class="px-8 mb-0.5 mt-10">
                  <button
                    type="button"
                    class="py-2 w-3/4 px-3 inline-flex text-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setShowAddJob(!showAddJob)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Create A Job
                  </button>
                 
                </li> */}

                
                
              
              </ul>
            </nav>
          </div>

          <footer class="lg:block absolute bottom-0 inset-x-0 border-t border-gray-200">
            <div class="hs-dropdown [--auto-close:inside] relative flex">
              <div class="p-1 border-t border-gray-200">
                {loggingOut ? (
                  <div
                    class="animate-spin ml-4 inline-block size-6 border-[3px] border-current border-t-transparent text-red-600 rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:bg-gray-100"
                    onClick={() => handleLogOut()}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </footer>
        </div>
      </aside>

      {/* {showAddJobLeftNav ? (
        <div
          class=" fixed top-12 end-0 transition-all duration-300 transform h-full max-w-lg w-full z-[80] bg-white border-s "
          tabindex="-1"
        >
          <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
            <div class="py-3 px-4 flex justify-between items-center border-b ">
              <h3 class="font-semibold text-gray-800">Create A Job</h3>
              <button
                type="button"
                class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none "
                data-hs-overlay="#hs-pro-datm"
                onClick={() => setShowAddJobLeftNav(!showAddJobLeftNav)}
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

            <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
              <div class="p-4 space-y-5">
                <div class="space-y-2">
                  <label
                    for="hs-pro-dactmt"
                    class="block mb-2 text-sm font-medium text-gray-800 "
                  >
                    Title
                  </label>

                  <input
                    id="hs-pro-dactmt"
                    type="text"
                    class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                    placeholder="Title goes here"
       
                onChange={(e) => setJobTitle(e.target.value)}
                 
                  />
                </div>

                <div class="space-y-2">
                  <label
                    for="dactmi"
                    
                    class="block mb-2 text-sm font-medium text-gray-800 "
                    placeholder="ex: I have a downed tree in my yard and would like someone to remove it."
                  >
                    Description
                  </label>

                  <div class="">
  <textarea onChange={(e) => setDescription(e.target.value)} class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"  rows="3" placeholder="ex: I have a downed tree in my yard and would like someone to remove it."></textarea>
</div>
                </div>

                <div class="space-y-2">
                  <label
                    for="dactmd"
                    class="block mb-2 text-sm font-medium text-gray-800 "
                  >
                     Where will this work be located?
                  </label>

                  <GooglePlacesAutocomplete
                apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                fetchDetails={true}
             
                autocompletionRequest={{
                  
                    types: ["address"],
                  
                }}
                selectProps={{
                  rawAddress,

                  onChange: setRawAddress,
                  placeholder: "Type address here",
                 
                }}
              />
                </div>
                <div class="space-y-2">
                  <label
                    for="dactmi"
                    onChange={(e) => setDescription(e.target.value)}
                    class="block mb-2 text-sm font-medium text-gray-800 "
                    placeholder="ex: I have a downed tree in my yard and would like someone to remove it."
                  >
                    What category of work is this? (optional)
                  </label>

                  <select
                  class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Select category"
              
                onChange={(e) => setJobCategory(e.target.value)}
              >
                <option value={false}>Select category</option>
                <option value="asphalt">Asphalt</option>
                <option value="carpentry">Carpentry</option>
                <option value="concrete">Concrete</option>
                <option value="drywall">Drywall</option>
                <option value="electrical work">Electrical Work</option>
                <option value="general handyman">General Handyman</option>
                <option value="gutter cleaning">Gutter Cleaning</option>
                <option value="hvac">HVAC</option>
                <option value="landscaping">Landscaping</option>
                <option value="painting">Painting</option>
                <option value="plumbing">Plumbing</option>
                <option value="pressure washing">Pressure Washing</option>
                <option value="roofing">Roofing</option>
                <option value="siding">Siding</option>
                <option value="snow removal">Snow Removal</option>
                <option value="window installation">Window Installation</option>
                <option value="window washing">Window Washing</option>
                <option value="yard work">Yard Work</option>
                <option value={false}>Clear Selection</option>
              </select>
                </div>
                <div class="space-y-2">
                  <label
                    for="dactmi"
                   
                    class="block mb-2 text-sm font-medium text-gray-800 "
                   
                  >
                    Are you offering an hourly rate or a fixed amount
                  </label>

                  <label  for="dactmi"
                   
                   class="block mb-2 text-sm font-medium text-gray-800 ">
                  (ex: $50 to mow
              my lawn)
                  </label>

                  <select
              placeholder="Select option"
              class="py-3 px-4 pe-9 block w-full bg-white border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
              onChange={(e) => setPayType(e.target.value)}
            >
              <option>Select option</option>
              <option value="Hourly">Hourly</option>
              <option value="Fixed">Fixed Amount</option>
            </select>
                </div>

{isHourly ? (
 <div class="space-y-2 ">
 <label
   for="hs-pro-dactmt"
   class="block mb-2 text-sm font-medium text-gray-800 "
 >
    Enter your desired pay range
 </label>

<div class="flex align-items-center">
  <p className="mt-2 mr-1 text-sm font-medium">$</p>
 <input
   id="hs-pro-dactmt"
   type="text"
   class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
   placeholder="lower rate"
 
   onChange={(e) => lowerRateValidate(e.target.value)}

 />
 <p className="mt-2 text-sm font-medium mr-1 ml-1">/hour - $</p>
 <input
   id="hs-pro-dactmt"
   type="text"
   class="py-2 px-3 block w-1/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
   placeholder="upper rate"
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

{isFlatRate ? (<div class="space-y-2">
  <label
    for="hs-pro-dactmt"
    class="block mb-2 text-sm font-medium text-gray-800 "
  >
    Enter your desired budget
  </label>
  <div className="flex">
  <p className="mt-2 mr-1 text-sm font-medium">$</p>
  <input
    id="hs-pro-dactmt"
    type="text"
    class="py-2 px-3 block w-2/3 border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
    placeholder="Enter budget here"
    onChange={(e) => flatRateValidate(e.target.value)}
 
  />
   <p className="mt-2 ml-1 text-sm font-medium">total</p>
   </div>
</div>) : (null)}
                
              </div>

              <div class="p-4 flex justify-between gap-x-2">
                <div class="w-full flex justify-end items-center gap-x-2">
                  

                  <button
                    type="button"
                    class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                    data-hs-overlay="#hs-pro-datm"
                    onClick={() => checkLength()}
                  >
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null} */}
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Your job has been posted.</p>
          </ModalBody>

          <ModalFooter>
            
          <button
                    type="button"
                    class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                    data-hs-overlay="#hs-pro-datm"
                    onClick={() => onClose()}
                  >
              Close
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
    </div>

    
  );
};

export default Dashboard;
