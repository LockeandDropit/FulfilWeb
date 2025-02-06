import React from "react";
import { useState, useEffect } from "react";
import DoerHeader from "../components/DoerHeader";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import Greeting from "./Greeting";
import HomepageJobs from "./HomepageJobs";
import HomepageEducation from "./HomepageEducation";
import Footer from "../../../components/Footer";
import Tools from "./Tools";
import { useUserStore } from "../Chat/lib/userStore";
import { useJobRecommendationStore } from "../lib/jobRecommendations";
import { useEduRecommendationStore } from "../lib/eduRecommendations";
import { useIndustryRecommendationStore } from "../lib/industryRecommendation";
import { usePreferredIndustryStore } from "../lib/userPreferredIndustry";

const DoerHomepage = () => {
  const [user, setUser] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const { fetchUserInfo, currentUser } = useUserStore();
  const { recommendedJobs, setRecommendedJobs } = useJobRecommendationStore();
  const { recommendedEdu, setRecommendedEdu } = useEduRecommendationStore();
  const { setRecommendedIndustry} = useIndustryRecommendationStore();
   const{ setPreferredIndustry } = usePreferredIndustryStore();

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

    useEffect(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);
  
        getDoc(docRef).then((snapshot) => {
          // console.log(snapshot.data());
          setRecommendedJobs(snapshot.data().returnedJobs);
          setRecommendedEdu(snapshot.data().returnedEducation);
          setRecommendedIndustry(snapshot.data().industryReccomendation);
          setPreferredIndustry(snapshot.data().userPreferredIndustry ? snapshot.data().userPreferredIndustry : null)
        });
      } else {
        console.log("oops!");
      }
    }, [user]);


//access zustand store. One for each portion of the returned data (jobs, edu,  recommended/preferred industry)

  return (
    <div className="w-full">
      {currentUser ? (
        <>
          
          <DoerHeader user={currentUser} />
          <Greeting user={currentUser}/>
          <HomepageJobs user={currentUser} />
          <HomepageEducation user={currentUser} />

        </>
      ) : null}
    </div>
  );
};

export default DoerHomepage;
