import React from "react";
import { useState, useEffect } from "react";
import DoerHeader from "../components/DoerHeader";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Greeting from "./Greeting";
import HomepageJobs from "./HomepageJobs";
import HomepageEducation from "./HomepageEducation";
import Footer from "../../../components/Footer";
import Tools from "./Tools";
import { useUserStore } from "../Chat/lib/userStore";

const DoerHomepage = () => {
  const [user, setUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const { fetchUserInfo, currentUser } = useUserStore();

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log("hello", currentUser.uid);
        fetchUserInfo(currentUser.uid);
      });
      setHasRun(true);
    } else {
    }
  }, []);

  return (
    <div className="w-full">
      {currentUser ? (
        <>
          
          <DoerHeader user={currentUser} />
          <Greeting user={currentUser}/>
          <HomepageJobs user={currentUser}/>
          <HomepageEducation user={currentUser}/>
        </>
      ) : null}
    </div>
  );
};

export default DoerHomepage;
