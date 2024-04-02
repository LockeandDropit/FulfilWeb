import React from "react";
import DoerHeader from "../DoerHeader";
import DoerDashboard from "../DoerDashboard";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Text, Box, Container } from "@chakra-ui/react";
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
import { ChannelFilters, ChannelOptions, ChannelSort, User } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  SearchBar,
  Thread,
  Window,
  useChatContext,
  InfiniteScroll,
  useChannelStateContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import { useLocation } from "react-router-dom";



const ChannelHireHeader = ( ) => {

  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setUserID(currentUser.uid);
        // console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const { channel, watchers } = useChannelStateContext();

  // console.log("here is the channel",channel)

    const navigate = useNavigate();
    const location = useLocation();
const [isHired, setIsHired] = useState();

const [jobID, setJobID] = useState();
const [jobTitle, setJobTitle] = useState(null);
const [employerFirstName, setEmployerFirstName] = useState();
const [jobOffered, setJobOffered] = useState(null);
const [confirmedRate, setConfirmedRate] = useState();
const [isHourly, setIsHourly] = useState(null);
const [isVolunteer, setIsVolunteer] = useState(null);


const [intermediateIDs, setIntermediateIDs] = useState(null);
const [bothIDs, setBothIDs] = useState([]);

const [finalBlock, setFinalBlock] = useState([]);


useEffect(() => {
  getChannels();
}, [channel]);
const [middleMembers, setMiddleMembers] = useState(null);

const getChannels = async () => {
  const channels = await channel.queryMembers({});

  setMiddleMembers(channels.members);
};

useEffect(() => {
  let ids = [];

  if (middleMembers !== null) {
    middleMembers.map((middleMembers) => {
      ids.push(middleMembers.user.id);
    });
  } else {
  }

  setBothIDs(ids);
}, [middleMembers]);


const [channelID, setChannelID] = useState(null)

useEffect(() => {
  if (channel !== null) {
    // console.log("early collection", selectedChannel._client.state.users )
    setIntermediateIDs(channel._client.state.users);
    // console.log("intermittent", selectedChannel)
    setJobTitle(channel.data.name)
    setChannelID(channel.cid)
  } else {
    console.log("no bueno");
  }
}, [channel, intermediateIDs]);

const [employerID, setEmployerID] = useState(null);


useEffect(() => {
  if (bothIDs !== null) {
    bothIDs.map((x) => {
      if (x !== userID) {
        // console.log("employerID", x);
        setEmployerID(x);
      } else {
       
      }
    });
  } else {
  
  }
}, [bothIDs]);



useEffect(() => {
  const collectionRef = collection(db, "Messages");
  const q = query(collectionRef);


  let finalBlock = [];

  onSnapshot(q, (snapshot) => {
   
    snapshot.docs.map((doc) => {
   

      if (
        doc._document.data.value.mapValue.fields.applicantID.stringValue ===
          userID &&
        doc._document.data.value.mapValue.fields.employerID.stringValue ===
          employerID &&
        doc._document.data.value.mapValue.fields.jobTitle.stringValue ===
          channel.data.name
      ) {
      
        console.log("checking 2 ", doc._document.data.value.mapValue.fields);
        setFinalBlock([
          ...finalBlock,
          doc._document.data.value.mapValue.fields,
        ]);
        setJobTitle(doc._document.data.value.mapValue.fields.jobTitle.stringValue);
        setJobOffered(doc._document.data.value.mapValue.fields.jobOffered.booleanValue)
        setConfirmedRate(doc._document.data.value.mapValue.fields.confirmedRate.integerValue)
        setIsHourly(doc._document.data.value.mapValue.fields.isHourly.booleanValue);
        setIsHired(doc._document.data.value.mapValue.fields.isHired.booleanValue);
        setJobID(doc._document.data.value.mapValue.fields.jobID.stringValue);
        setEmployerFirstName(doc._document.data.value.mapValue.fields.employerFirstName.stringValue);
      } else {
        console.log("either or");
      }
    });
  });

}, [channel, userID, employerID]);


console.log("is hired", isHired)

useEffect(() => {
  if (userID != null && isHired === false && employerID != null && jobTitle !== null || undefined) {
    console.log("here?")
    const docRef = doc(db, "employers", employerID, "Posted Jobs", jobTitle);

    getDoc(docRef).then((snapshot) => {
      console.log("current job", snapshot.data());
      setNiceToHave(snapshot.data().niceToHave);
      setDescription(snapshot.data().description);
      // setBusinessName(snapshot.data().businessName);
      setCategory(snapshot.data().category)
      setCity(snapshot.data().city);
      setLocationLat(snapshot.data().locationLat);
      setLocationLng(snapshot.data().locationLng);
      setLowerRate(snapshot.data().lowerRate);
      setUpperRate(snapshot.data().upperRate);
      setRequirements(snapshot.data().requirements);
      setRequirements2(snapshot.data().requirements2);
      setRequirements3(snapshot.data().requirements3);
      setIsVolunteer(snapshot.data().isVolunteer);
      setIsOneTime(snapshot.data().isOneTime);
      setStreetAddress(snapshot.data().streetAddress);
      setState(snapshot.data().state);
      setZipCode(snapshot.data().zipCode);
   
      setEmployerFirstName(snapshot.data().firstName)
    });
  } else {
    console.log("oops!a");
  }
 
}, [userID, employerID, jobTitle]);

const [category, setCategory] = useState(null)
const [businessName, setBusinessName] = useState(null);
const [description, setDescription] = useState(null);
const [city, setCity] = useState(null);
const [locationLat, setLocationLat] = useState(null);
const [locationLng, setLocationLng] = useState(null);
const [lowerRate, setLowerRate] = useState(null);
const [upperRate, setUpperRate] = useState(null);
const [requirements, setRequirements] = useState(null);
const [requirements2, setRequirements2] = useState(null);
const [requirements3, setRequirements3] = useState(null);
// const [isVolunteer, setIsVolunteer] = useState(null);
const [isOneTime, setIsOneTime] = useState(null);
const [streetAddress, setStreetAddress] = useState(null);
const [state, setState] = useState(null);
const [zipCode, setZipCode] = useState(null);
const [niceToHave, setNiceToHave] = useState(null);



const postInProgress = () => {
  // employer

  //convert to int
  const confirmedRateInt = parseInt(confirmedRate, 10);

  setDoc(doc(db, "employers", employerID, "Jobs In Progress", jobTitle), {
    employerID: employerID,
    jobTitle: jobTitle,
    jobID: jobID,
    isHourly: isHourly,
    channelID: channelID,
    category: category,
    // businessName: businessName,
    description: description,
    confirmedRate: confirmedRateInt,
    city: city,
    lowerRate: lowerRate,
    upperRate: upperRate,
    isVolunteer: isVolunteer,
    isOneTime: isOneTime,
    streetAddress: streetAddress,
    state: state,
    zipCode: zipCode,
    requirements: requirements,
    requirements2: requirements2,
    requirements3: requirements3,
    niceToHave: niceToHave,
    locationLat: locationLat,
    locationLng: locationLng,
    hiredApplicant: userID,
    jobCompleteApplicant: false,
    jobCompleteEmployer: false,
    employerFirstName: employerFirstName
    
  })
    .then(() => {
      //all good
      console.log("data submitted employer");
    })
    .catch((error) => {
      // no bueno
      console.log(error, "post in progress");
    });

  // applicant

  setDoc(doc(db, "users", userID, "Jobs In Progress", jobTitle), {
    employerID: employerID,
    jobTitle: jobTitle,
    jobID: jobID,
    isHourly: isHourly,
    category: category,
    // businessName: businessName,
    channelID: channelID,
    description: description,
    city: city,
    confirmedRate: confirmedRateInt,
    lowerRate: lowerRate,
    upperRate: upperRate,
    isVolunteer: isVolunteer,
    isOneTime: isOneTime,
    streetAddress: streetAddress,
    state: state,
    zipCode: zipCode,
    requirements: requirements,
    requirements2: requirements2,
    requirements3: requirements3,
    niceToHave: niceToHave,
    locationLat: locationLat,
    locationLng: locationLng,
    hiredApplicant: userID,
    jobCompleteApplicant: false,
    jobCompleteEmployer: false,
    employerFirstName: employerFirstName
  })
    .then(() => {
      //all good
      console.log("data submitted applicant");
    })
    .catch((error) => {
      // no bueno
      console.log(error, "post in progress");
    });
};

const deletePostedEmployer = () => {
  deleteDoc(doc(db, "employers", employerID, "Posted Jobs", jobTitle))
    .then(() => {
      //all good
      console.log("removed from employers Posted Jobs");
    })
    .catch((error) => {
      // no bueno
      console.log(error, "from delete posted employer");
    });

  // delete from user saved (if saved)
  deleteDoc(doc(db, "users", userID, "Saved Jobs", jobID))
    .then(() => {
      //all good
      console.log("removed from employers Posted Jobs");
    })
    .catch((error) => {
      // no bueno
      console.log(error, "from delete posted employer");
    });
};


const chatNotifications = () => {
  //// uhh this code will remove the "do you want to hire this person" card in Messages

 

  updateDoc(doc(db, "Messages", jobID), {
   isHired: true,
   
  })
    .then(() => {
      console.log("all good");
    })
    .catch((error) => {
      console.log(error);
    });

};

const deleteFromMaps = () => {
  //needs to also delete from paid v Volunteer DB subsets.

  deleteDoc(doc(db, "Map Jobs", jobID))
    .then(() => {
      //all good
      console.log("removed from employers Posted Jobs");
      alert("You're hired! Continue chatting as needed.");
    })
    .catch((error) => {
      // no bueno
      console.log(error, "error from delete from Maps");
    });
};

const deleteFromJobs = () => {
  if (isVolunteer === true) {
    deleteDoc(doc(db, "Map Jobs Volunteer", jobID))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs Paid");
      })
      .catch((error) => {
        // no bueno
        console.log(error, "error from delete from Maps");
      });
  } else {
    deleteDoc(doc(db, "Map Jobs Paid", jobID))
      .then(() => {
        //all good
        console.log("removed from employers Posted Jobs Paid");
      
      })
      .catch((error) => {
        // no bueno
        console.log(error, "error from delete from Maps");
      });
  }
};


const confirmJobAccept = () => {
    // hire code here.
    // post under in progress for employer and applicant



    postInProgress();

    //delete from Posted under employer

    deletePostedEmployer();

    //make notification in chat for both

    chatNotifications();

    //delete from global jobs/maps

    deleteFromMaps();

    //delete from paid v volunteer db

    deleteFromJobs();

  };

  return (
    <>
    {isHired ? (
        <Card boxShadow="sm"
        rounded="md"
        borderColor="#e4e4e4"
        borderWidth="1px"
        marginLeft="4px"
        marginRight="4px">
          <Box  >
            <Center>
            <Flex direction="column">
              <Flex direction="row">
                <Box textAlign="center" marginTop="16px">
            <Text>
              Congratulations! You've been hired for
            </Text>
            <Button
             variant="ghost"
            >
              <Text >{jobTitle}</Text>
            
              
              </Button>
              </Box>
              </Flex>
              <Center>
                <Text marginBottom="16px">Continue chatting here as needed</Text>
                </Center>
              </Flex>
          
            </Center>
          </Box>
        </Card>
      ) : !jobOffered ? (
        <Card  boxShadow="sm"
        rounded="md"
        borderColor="#e4e4e4"
        borderWidth="1px"
        marginLeft="4px"
        marginRight="4px">
          <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px">
                <Text>You're interviewing for</Text>
                <Button variant="ghost">
                  <Text>{jobTitle}</Text>
                </Button>
              </Box>
            </Flex>
          </Center>
        </Card>
      ) : (
        <Box>
          <Card boxShadow="sm"
        rounded="md"
        borderColor="#e4e4e4"
        borderWidth="1px"
        marginLeft="4px"
        marginRight="4px" >
            <Box >
            <Center>
            <Flex direction="column">
              <Box textAlign="center" marginTop="16px">
              <Text >
                Congratulations! You've been offered this position.
                Would you like to accept for
              </Text>
                <Button variant="ghost">
                  <Text>{jobTitle}</Text>
                </Button>
                <Text >Pay Rate:</Text>
              {isHourly ? (
                <Text >
                  ${confirmedRate}/hr
                </Text>
              ) : isVolunteer ? (
                <Text >
                  {" "}
                 No Charge
                </Text>
              ): (
                <Text >
                {" "}
                ${confirmedRate} total{" "}
              </Text>
              )}
              </Box>
              <Center>
              <Box  flexDirection="row" marginTop="16px">
             
         <Button
          variant="ghost"
          width="240px"
         >
           <Text>Decline</Text>
         </Button>
         <Button
              width="240px"
           colorScheme="blue"
           onClick={() => confirmJobAccept()}
         >
           <Text>Yes!</Text>
         </Button>
         </Box>
         </Center>
            </Flex>
          </Center>
            
            </Box>
            
            <Box >
              <Box>
               
              
              </Box>
            </Box>
          </Card>
        </Box>
      )}
  </>
  )
  
}

export default ChannelHireHeader