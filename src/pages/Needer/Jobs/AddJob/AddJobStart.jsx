import React, { useState, useEffect } from "react";
import NeederHeader from "../../NeederHeader";
import NeederDashboard from "../../NeederDashboard";
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

const AddJobStart = () => {
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
      console.log("1")
      alert("Please fill out all fields");
      console.log("1")
    } else {
      if (isOneTime === true && isFlatRate === true && !flatRateValid) {
        alert("Please fill out all fields");
        console.log("2")
      } else {
        if (
          (isOneTime === true && isHourly === true && !upperRateValid) ||
          !lowerRateValid
        ) {
          console.log("3")
          alert("Please fill out all fields");
        } else {
          if (isOneTime === false && isFlatRate === true && !flatRateValid) {
            console.log("4")
            alert("Please fill out all fields");
          } else {
            if (
              (isOneTime === false && isHourly !== null && !upperRateValid) ||
              !lowerRateValid
            ) {
              console.log("5")
              alert("Please fill out all fields");
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
      console.log(streetAddress, locationLat)
      alert("Please fill out all fields");
      console.log("6")
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
    setDoc(doc(db, "employers", user.uid, "Posted Jobs", jobTitle), {
      employerID: employerID,
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
    })
      .then(() => {
        //all good
        console.log("submitted");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    navigate("/AddJobInfo", {
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

  useEffect(() => {
    if (firstAddress !== null) {
      let results = [];
      // run through ewach object in array (if else)
      //evaluate if type == street address, city, state, etc
      // if true, push to corresponding state
      // firstAddress.forEach((firstAddress) => {
      if (firstAddress) {
        console.log(firstAddress);
        setStreetNumber(firstAddress[0].long_name);
        // setStreetNumber(firstAddress[0].long_name);
        // console.log("first one", firstAddress[0].long_name);
      } else {
        console.log("nooooooo");
      }
      if (firstAddress) {
        setStreetName(firstAddress[1].long_name);
        // console.log(firstAddress[1].long_name);
      } else {
        console.log("nooooooo");
      }
      if (firstAddress) {
        setCity(firstAddress[2].long_name);
        // console.log(firstAddress[2].long_name);
      } else {
        console.log("nooooooo");
      }
      if (firstAddress) {
        setState(firstAddress[4].long_name);
        // console.log(firstAddress[4].long_name);
      } else {
        console.log("nooooooo");
      }
      if (firstAddress) {
        setZipCode(firstAddress[6].long_name);
        // console.log(firstAddress[6].long_name);
      } else {
        console.log("nooooooo");
      }
      // });
    } else {
    }
  }, [firstAddress]);

  useEffect(() => {
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
          <Flex direction="column">
            <Heading size="lg">Add A New Job</Heading>
            <FormControl isRequired>
              <FormLabel marginTop="8">Job Title</FormLabel>
              <Input
                placeholder="Title goes here"
                width="560px"
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </FormControl>
            <FormLabel marginTop="4">
              Where will this work be located?
            </FormLabel>
            <Box width="560px">
              <GooglePlacesAutocomplete
                apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                fetchDetails={true}
                selectProps={
                  ({ rawAddress, onChange: setRawAddress })
                 
                }
                onLoadFailed={(error) =>
                  alert("There was an error, please try again later.", error)
                }
              />
            </Box>
            <FormControl>
              <FormLabel marginTop="8">
                What category of work is this? (optional)
              </FormLabel>
              <Select
                placeholder="Select category"
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
                <option value="window installation">Window Installation</option>
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
                placeholder="Select option"
                width="560px"
                onChange={(e) => setJobFrequency(e.target.value)}
              >
                <option value="Regular Need">Regular Need</option>
                <option value="One Time">One Time</option>
              </Select>
            </FormControl>

            <FormLabel marginTop="8">
              Are you offering an hourly rate or a fixed amount (ex: $50 to mow
              my lawn)
            </FormLabel>
            <Select
              placeholder="Select option"
              width="560px"
              onChange={(e) => setPayType(e.target.value)}
            >
              <option value="Hourly">Hourly</option>
              <option value="Fixed">Fixed Amount</option>
            </Select>

            {isHourly ? (
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
                    placeholder="lower rate"
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
                    placeholder="upper rate"
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
                    placeholder="Enter budget here"
                    onChange={(e) => flatRateValidate(e.target.value)}
                  />
                  {flatRateValidationBegun === true ? (
                    <Text color="red">{flatRateValidationMessage}</Text>
                  ) : null}
                </Flex>
              </>
            ) : null}

            <Button
              colorScheme="blue"
              width="240px"
              position="absolute"
              bottom="2"
              right="500"
              onClick={() => checkLength()}
              // onClick={() => testButtonNavigate()}
            >
              Next{" "}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default AddJobStart;
