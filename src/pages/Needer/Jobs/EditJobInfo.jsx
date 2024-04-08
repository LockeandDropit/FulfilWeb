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
import { useLocation } from "react-router-dom";


const EditJobInfo = () => {

  const [user, setUser] = useState();
  const [employerID, setEmployerID] = useState(null);

  const location = useLocation();

  const [jobTitle, setJobTitle] = useState(null)
  const [isVolunteer, setIsVolunteer] = useState(false)
  const [jobID, setJobID] = useState(null)
  const [firstName, setFirstName] = useState(null)

  useEffect(() => {
    if (location.state === null) {
      
    } else {
 
        console.log("waiting on chatClient");

        console.log("channel passed", location.state);
       setJobTitle(location.state.jobTitle);
       setJobID(location.state.jobID);
       setFirstName(location.state.firstName);
      
    }
  }, [location]);

  //bring in from props
  // const jobTitle = "title"
  // const isVolunteer = false
  // const jobID = 123456
  // const firstName = "John"


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

  const [description, setDescription] = useState(null);
  const [requirements, setRequirements] = useState(null);



  const [requirements2, setRequirements2] = useState(null);
  const [requirements3, setRequirements3] = useState(null);
  const [niceToHave, setNiceToHave] = useState(null);

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
     
        setDescription(snapshot.data().description);
        setRequirements(snapshot.data().requirements);
        setNiceToHave(snapshot.data().niceToHave);
        setRequirements2(snapshot.data().requirements2);
        setRequirements3(snapshot.data().requirements3);

      });
    } else {
      console.log("oops!");
    }
  }, [user]);

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
      description: description,
      firstName: firstName,
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

  const addJobGlobal = () => {
    //submit data
    updateDoc(doc(db, "Jobs", user.uid, "Posted Jobs", jobTitle), {
      description: description,
      requirements: requirements,
      requirements2: requirements2,
      requirements3: requirements3,
      niceToHave: niceToHave,
    })
      .then(() => {
        //all good
        console.log("data submitted global");
        alert("Success! New Job Posted!");
      })
      .catch((error) => {
        // no bueno
        console.log(error);
      });

    //Cant get PostedJobs to not have modal pop up immediately??  
    // navigation.navigate("PostedJobs", {props: modalVisible});

    navigate("/NeederMapScreen")
  };

  const addJobMap = () => {
    //submit data
    updateDoc(doc(db, "Map Jobs", jobID), {
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
      updateDoc(doc(db, "Map Jobs Volunteer", jobID), {
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
      updateDoc(doc(db, "Map Jobs Paid", jobID), {
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
    }
  };

  const updateAllJobs = () => {
    updateDoc(doc(db, "All Jobs", jobID), {
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
  }

  
  const addDescription = () => {
    addNewJob();
    addJobMap();
    updateAllJobs()
    addJobGlobal();
  };

  //cited elsewhere
  const minLengthRegEx = /^.{1,}$/;

  const checkLength = () => {
    console.log(description)

    const descriptionValid = minLengthRegEx.test(description)
 
 
    if (!descriptionValid ) {
     alert("Please fill out job description")
    } else {
      addDescription()
    }
   };

   


  return (
    <>
      <NeederHeader />

      <Flex>
        <NeederDashboard />

        <Box
          width="50vw"
          // alignContent="center"
          // justifyContent="center"
          // display="flex"
          // alignItems="baseline"

          borderColor="#E3E3E3"
          height="80vh"
          // boxShadow="md"
          rounded="lg"
          // padding="8"
          paddingLeft="8"
          paddingTop="8"
          paddingRight="8"
          marginLeft="48"
          marginRight="16"
            // overflowY="scroll"
        >
          <Flex direction="column">
            <Heading size="lg">Add Information</Heading>
            <FormControl isRequired>
              <FormLabel marginTop="8">Job Description</FormLabel>
              <Textarea
           borderColor="black"
              borderWidth=".5px"
                placeholder="Title goes here"
                defaultValue={description}
                width="740px"
                height="240px"
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
           
            <FormControl>
             
              <FormLabel  marginTop="8">
               Requirement 1 (optional)
              </FormLabel>
              <Textarea
           borderColor="black"
              borderWidth=".5px"
              defaultValue={requirements}
              width="740px"
                height="80px"

                onChange={(e) => setRequirements(e.target.value)}
              />
              <FormLabel  marginTop="8">
               Requirement 2 (optional)
              </FormLabel>
              <Textarea
           borderColor="black"
              borderWidth=".5px"
              defaultValue={requirements2}
              width="740px"
                height="80px"
                onChange={(e) => setRequirements2(e.target.value)}
              />
              <FormLabel  marginTop="8">
               Requirement 3 (optional)
              </FormLabel>
              <Textarea
           borderColor="black"
              borderWidth=".5px"
              defaultValue={requirements3}
                width="740px"
                height="80px"
                onChange={(e) => setRequirements3(e.target.value)}
              />
            </FormControl>
            <FormControl>
            <FormLabel  marginTop="8">
               Nice to have (optional)
              </FormLabel>
              <Textarea
           borderColor="black"
              borderWidth=".5px"
              defaultValue={niceToHave}
                width="740px"
                height="80px"
                onChange={(e) => setNiceToHave(e.target.value)}
              />
            </FormControl>

        
           

           

            <Button
              colorScheme="blue"
              width="240px"
              marginTop="60px"
              // position="absolute"
              bottom="2"
              // right="500"
              left="500"
              onClick={() => checkLength()}
            >
              Post Job{" "}
            </Button>
          </Flex>
          
        </Box>
        
      </Flex>
      
    </>
  );
};

export default EditJobInfo;
