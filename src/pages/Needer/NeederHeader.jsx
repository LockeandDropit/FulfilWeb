import React from "react";

import fulfil180 from "../../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Flex,
  Heading,
} from "@chakra-ui/react";
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

const NeederHeader = () => {
  const navigate = useNavigate();
  //validate & set current user
  const [user, setUser] = useState();

  //hide this
  const apiKey = "gheexx2834gr";
  const chatClient = new StreamChat(apiKey);

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
      const docRef = doc(db, "employers", user.uid);

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
    const reference = ref(
      storage,
      "employers/" + user.uid + "/profilePicture.jpg"
    );

    // console.log(reference.service)
    if (!reference.service) {
    } else {
      await getDownloadURL(reference).then((response) => {
        setProfilePicture(response);
      });
    }
  };

  return (
    <div className="header">
      <div
        className="headerLogo"
        onClick={() => navigate(`/NeederInProgressList`)}
      >
        <img src={fulfil180} alt="Fulfil Logo"></img>
      </div>

      <Flex position="absolute" right="6">
        <Button
          backgroundColor="#01A2E8"
          color="white"
          _hover={{ bg: "#018ecb", textColor: "white" }}
          marginTop="16px"
          marginRight="24px"
          height="36px"
          onClick={() => navigate("/AddJobStart")}
        >
          Post A Job
        </Button>
        <Heading size="md" marginTop="20px" marginRight="12px">
          Hello, {userFirstName}
        </Heading>

        <Menu>
          <MenuButton>
            <Avatar
              bg="#01A2E8"
              marginRight="16px"
              marginTop="8px"
              src={profilePicture ? profilePicture : <Avatar />}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate("/NeederAccountManager")}>
              My Account
            </MenuItem>
            <MenuItem onClick={() => navigate("/NeederPaymentHistory")}>
              Payment History
            </MenuItem>

            <MenuItem onClick={() => navigate("/NeederPrivacyPolicy")}>
              Privacy Policy
            </MenuItem>

            <MenuItem onClick={() => navigate("/NeederContactForm")}>
              Contact Us
            </MenuItem>
            <MenuItem onClick={() => handleLogOut()}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </div>
  );
};

export default NeederHeader;
