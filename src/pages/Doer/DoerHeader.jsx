import React from "react";

import fulfil180 from "../../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarBadge, AvatarGroup, Flex, Heading } from "@chakra-ui/react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { query, collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { StreamChat } from "stream-chat";


const DoerHeader = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

  //hide this 

  const chatClient = new StreamChat(process.env.REACT_APP_STREAM_CHAT_API_KEY);

  const [loggingOut, setLoggingOut] = useState(false);

  const auth = getAuth();
  const handleLogOut = async () => {
    await chatClient.disconnectUser();
    await signOut(auth)
      .then(navigate("/")) // undefined
      .catch((e) => console.log(e));
  };

  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  const [userFirstName, setUserFirstName] = useState("User");

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setUserFirstName(snapshot.data().firstName);

      });
    } else {
      console.log("oops!");
    }
  }, [user]);

    // this gets the profile picture
  // const profilePictureURL = useSelector(selectUserProfilePicture);

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      getProfilePicture();
    } else {
    }
  }, [user]);

  const getProfilePicture = async () => {
    const storage = getStorage();
    const reference = ref(storage, "users/" + user.uid + "/profilePicture.jpg");
    await getDownloadURL(reference).then((response) => {
      setProfilePicture(response);
    });
  };

  return (
    <div className="header">
      <div className="headerLogo" onClick={() => navigate(`/DoerInProgressList`)}>
        <img src={fulfil180} alt="Fulfil Logo"></img>
      </div>

   

        <Flex position="absolute" right="6">
          <Heading size="md" marginTop="12px" marginRight="12px">Hello, {userFirstName}</Heading>
        

        <Menu>
          <MenuButton>
            <Avatar bg="#01A2E8" marginRight="16px"  src={profilePicture ? profilePicture : <Avatar />}/>
          </MenuButton>
          <MenuList>
           
              <MenuItem onClick={() => navigate("/DoerAccountManager")}>My Account</MenuItem>
              <MenuItem onClick={() => navigate("/DoerPaymentHistory")}>Payment History</MenuItem>
        
           <MenuItem onClick={() => navigate("/DoerPrivacyPolicy")}>Privacy Policy</MenuItem>
           
              <MenuItem onClick={() => navigate("/DoerContactForm")}>Contact Us</MenuItem>
              <MenuItem onClick={() => handleLogOut()}>Log Out</MenuItem>
        
          </MenuList>
        </Menu>
        </Flex>
      
    </div>
  );
};

export default DoerHeader;
