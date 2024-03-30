import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Heading } from "@chakra-ui/react";
import { Input, Button } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setEmail(e.target.value);
  const handlePasswordInputChange = (e) => setPassword(e.target.value);

  const isError = input === "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [isEmployer1, setIsEmployer1] = useState(null);
  const [isEmployer2, setIsEmployer2] = useState(null);

  const signInUser = () => {
    const authentication = getAuth();

    signInWithEmailAndPassword(authentication, email, password)
      .then((response) => {
        // setLoggingIn(true);

        // Signed in
        // setCurrentUser(response.user.uid)
        setIsSignedIn(true);
        const currentUser = response.user.uid;
        const docRefUsers = doc(db, "users", response.user.uid);
        const docRefEmployers = doc(db, "employers", response.user.uid);
        console.log("current user", currentUser);
        setTimeout(() => {
          getDoc(docRefUsers).then((snapshot) => {
            setIsEmployer1(snapshot.data().isEmployer);
          });
          getDoc(docRefEmployers).then((snapshot) => {
            setIsEmployer2(snapshot.data().isEmployer);
          });
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert("Username or Password incorrect. Please try again.");
      });

    // if user = employer then navigate <Employer Stack>, else navigate <Default Stack>

    // navigation.navigate("MapScreen");
  };

  // extremely dirty code
  useEffect(() => {
    if (isEmployer1 != null) {
      if (isEmployer1 && true) {
      } else {
      }
    } else {
      console.log("waiting.. put spinny symbol here");
    }
  }, [isEmployer1]);

  useEffect(() => {
    if (isEmployer2 != null) {
      if (isEmployer2 && true) {
      } else {
      }
    } else {
      console.log("waiting.. put spinny symbol here");
    }
  }, [isEmployer2]);

  const navigateToRegister = () => {
    navigate("FirstRegister");
  };

  //Muted out is jake's code.. go back and get this to work
  const logIn = () => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
   
    // New sign-in will be persisted with local persistence.
    signInWithEmailAndPassword(auth, email, password).then(
      (response) => {
        // setLoggingIn(true);

        // Signed in
        // setCurrentUser(response.user.uid)
        setIsSignedIn(true);
        const currentUser = response.user.uid;
        // const docRefUsers = doc(db, "users", response.user.uid);
        // const docRefEmployers = doc(db, "employers", response.user.uid);
        console.log("current user", currentUser);
        // Thanks Jake :)
        Promise.all([
          getDoc(doc(db, "users", response.user.uid)),
          getDoc(doc(db, "employers", response.user.uid)),
        ])
          .then((results) =>
            navigate(
              (results[0]._document !== null &&
                results[0]._document.data.value.mapValue.fields.isEmployer) 
                ? "/DoerMapScreen"
                : "/NeederMapScreen"
            )
        
          )
          .catch(console.log("issue"));
      }
    )
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  })
 

  };

  return (
    <>

      {" "}
      <Header />
      <Center color="white" marginTop="100px">
        <Card
          align="center"
          border="2px"
          borderColor="gray.400"
          borderWidth="1.5px"
          width="24%"
          height="560px"
          boxShadow="lg"
        >
          <CardHeader marginTop="60px">
            <Heading size="lg">Log In</Heading>
          </CardHeader>
          <CardBody marginTop="30px">
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
               borderColor="black"
               borderWidth=".5px"
                type="email"
                value={email}
                onChange={handleInputChange}
                width="360px"
              />
              {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginTop="8px">
              <FormLabel>Password</FormLabel>
              <Input
                type="email"
                borderColor="black"
                borderWidth=".5px"
                value={password}
                onChange={handlePasswordInputChange}
                width="360px"
              />
              {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </FormControl>
          </CardBody>
          <CardFooter flexDirection="column">
            <Button
              colorScheme="blue"
              marginBottom="24px"
              width="240px"
              onClick={() => logIn()}
              // onClick={() => navigate("/DoerHome")}
            >
              Log In
            </Button>
            <Button colorScheme="blue" marginBottom="100px" onClick={() => navigate("/NeederAccountCreation")}>
              Create An Account
            </Button>
          </CardFooter>
        </Card>
      </Center>
  
    </>
  );
};

export default Login;
