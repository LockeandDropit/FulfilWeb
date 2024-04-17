import Landing from "./Landing";
import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
  StreamChat,
  useChatContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { Spinner, Center } from "@chakra-ui/react";

function App() {
  //idk if this auth check is actually doing anything. can delete it right now and have no issues with any other part of the app.
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        // setUserID(currentUser.uid);
        // console.log(currentUser.uid);
      });

      setHasRun(true);
    } else {
    }
  }, []);



  useEffect(() => {
    if (user) {
      Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDoc(doc(db, "employers", user.uid)),
      ])
        .then((results) =>
          navigate(
            results[0]._document !== null &&
              results[0]._document.data.value.mapValue.fields.isEmployer
              ? "/DoerMapScreen"
              : "/NeederMapScreen"
          )
        )
        .catch(console.log("issue"));
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Center marginTop="500px">
           <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="#01A2E8"
                      size="lg"
                    
                    />
        </Center>
      ) : user ? null : (
        <Landing />
      )}
    </>
  );
}

export default App;
