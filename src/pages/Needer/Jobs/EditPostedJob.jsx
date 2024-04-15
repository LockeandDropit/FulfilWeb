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
  deleteDoc
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
  Spinner,
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

const EditPostedJob = () => {
  const [isFlatRate, setIsFlatRate] = useState();
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

  const location = useLocation();

  useEffect(() => {
    if (location.state === null) {
    } else {
      setJobTitle(location.state.jobTitle);
      setJobID(location.state.jobID);
      setIsHourly(location.state.isHourly);
      console.log("location", location.state);
    }
  }, [location]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(
        db,
        "employers",
        user.uid,
        "Posted Jobs",
        location.state.jobTitle
      );

      getDoc(docRef).then((snapshot) => {
        console.log(snapshot.data());
        setJobID(snapshot.data().jobID);
        setLowerRate(snapshot.data().lowerRate);
        // setBusinessName(snapshot.data(businessName));
        setUpperRate(snapshot.data().upperRate);
        setIsHourly(snapshot.data().isHourly);
        setPayType(snapshot.data().isHourly);
        setIsFlatRate(snapshot.data().isFlatRate);
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

  const [isOneTime, setIsOneTime] = useState(null);
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

      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,

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

      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,

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

        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,

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

        isOneTime: isOneTime,
        isFlatRate: isFlatRate,
        flatRate: flatRate,
        isHourly: isHourly,

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

      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,

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

      isOneTime: isOneTime,
      isFlatRate: isFlatRate,
      flatRate: flatRate,
      isHourly: isHourly,

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

    navigate("/EditJobInfo", {
      state: {
        jobTitle: jobTitle,
        isVolunteer: isVolunteer,
        jobID: jobID,
        firstName: firstName,
      },
    });
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

  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 1500);


  const handleDelete = () => {
    deleteDoc(doc(db, "Map Jobs", jobID), {

    })
      .then(() => {
        //all good
      
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

      deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {

      })
        .then(() => {
          //all good
          alert("Success, job has been deleted")
          navigate("/NeederPostedList")
        })
        .catch((error) => {
          // no bueno
          console.log(error);
        });

        deleteDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {

        })
          .then(() => {
            //all good
            alert("Success, job has been deleted")
            navigate("/NeederPostedList")
          })
          .catch((error) => {
            // no bueno
            console.log(error);
          });
  }

  return (
    <>
      <NeederHeader />

      <Flex>
        <NeederDashboard />

        <Box
          width="67vw"
          // alignContent="center"
          // justifyContent="center"
          // display="flex"
          // alignItems="baseline"

          borderColor="#E3E3E3"
          height="auto"
          // boxShadow="md"
          rounded="lg"
          // padding="8"
          paddingLeft="8"
          paddingTop="8"
          paddingRight="8"
          marginLeft="48"
          marginRight="16"
          //   overflowY="scroll"
        >
          {isLoading ? (
            <Center marginTop="500px">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#01A2E8"
                size="lg"
              />
            </Center>
          ) : (
            <Flex direction="column">
              <Heading size="lg">Edit Posted Job</Heading>
              <FormControl isRequired>
                <FormLabel marginTop="8">
                  Job Title (can not be edited)
                </FormLabel>
                <Text>{jobTitle} </Text>
              </FormControl>
              <FormLabel marginTop="4">Location (can not be edited)</FormLabel>
              <Box width="560px">
                <Text>
                  {streetAddress}, {city}, {state}
                </Text>
              </Box>
              <FormControl>
                <FormLabel marginTop="8">
                  What category of work is this? (optional)
                </FormLabel>
                <Select
                  placeholder={jobCategory ? jobCategory : "choose a category"}
                  width="560px"
                  onChange={(e) => setJobCategory(e.target.value)}
                >
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
                  <option value="window installation">
                    Window Installation
                  </option>
                  <option value="window washing">Window Washing</option>
                  <option value="yard work">Yard Work</option>
                  <option value={false}>Clear Selection</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel marginTop="8">
                  What kind of a position is this?
                </FormLabel>
                <Select
                  placeholder={
                    jobFrequency === true ? "One Time" : "Regular Need"
                  }
                  width="560px"
                  onChange={(e) => setJobFrequency(e.target.value)}
                >
                  <option value="Regular Need">Regular Need</option>
                  <option value="One Time">One Time</option>
                </Select>
              </FormControl>

              <FormLabel marginTop="8">
                Are you offering an hourly rate or a fixed amount (ex: $50 to
                mow my lawn)
              </FormLabel>
              <Select
                placeholder={payType === true ? "Hourly" : "Fixed Amount"}
                width="560px"
                onChange={(e) => setPayType(e.target.value)}
              >
                <option value="Hourly">Hourly</option>
                <option value="Fixed">Fixed Amount</option>
              </Select>

              {payType === true ? (
                <Card>
                  <FormLabel marginTop="8" width>
                    Enter your desired pay range
                  </FormLabel>

                  <CardFooter>
                    <Heading size="sm" marginTop="10px" marginRight="4px">
                      {" "}
                      $
                    </Heading>
                    <Input
                      width="120px"
                      defaultValue={lowerRate}
                      // onChange={(e) => setLowerRate(e.target.value)
                      onChange={(e) => lowerRateValidate(e.target.value)}
                    />
                    <Heading
                      size="sm"
                      marginTop="10px"
                      marginLeft="4px"
                      marginRight="4px"
                    >
                      /hour - $
                    </Heading>
                    <Input
                      width="120px"
                      defaultValue={upperRate}
                      onChange={(e) => upperRateValidate(e.target.value)}
                    />
                    <Heading size="sm" marginTop="10px" marginLeft="2px">
                      /hour
                    </Heading>
                  </CardFooter>
                  {lowerRateValidationBegun === true ? (
                    <Text color="red">{lowerRateValidationMessage}</Text>
                  ) : null}
                  {upperRateValidationBegun === true ? (
                    <Text color="red">{upperRateValidationMessage}</Text>
                  ) : null}
                </Card>
              ) : null}

              {isFlatRate ? (
                <>
                  <FormLabel marginTop="8" width>
                    Enter your desired budget
                  </FormLabel>
                  <Flex>
                    <Heading size="sm" marginTop="8px">
                      {" "}
                      $
                    </Heading>
                    <Input
                      marginLeft="8px"
                      width="240px"
                      defaultValue={flatRate}
                      onChange={(e) => flatRateValidate(e.target.value)}
                    />
                    {flatRateValidationBegun === true ? (
                      <Text color="red">{flatRateValidationMessage}</Text>
                    ) : null}
                  </Flex>
                </>
              ) : null}

              <Flex direction="column">
                <Button
                marginTop="8"
                  colorScheme="blue"
                  width="240px"
                  onClick={() => checkLength()}
                  // onClick={() => testButtonNavigate()}
                >
                  Next{" "}
                </Button>
                <Button
                marginTop="4"
                  colorScheme="red"
                  width="240px"
                  onClick={() => handleDelete()}
                  // onClick={() => testButtonNavigate()}
                >
                  Delete{" "}
                </Button>
              </Flex>
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default EditPostedJob;
