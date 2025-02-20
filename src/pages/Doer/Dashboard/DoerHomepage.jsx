import React from "react";
import { useState, useEffect } from "react";
import DoerHeader from "../components/DoerHeader";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
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

      useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get("session_id");
    
        console.log("new update outer");
    
        console.log("test");
        if (sessionId && user !== null && currentUser !== null) {
          console.log("test 2");
          if (!currentUser.isPremium) {
            console.log("new update inner");
            setHasRun(false);
            fetch(
              `https://fulfil-api.onrender.com/create-subscription-session-status?session_id=${sessionId}`
            )
              .then((res) => res.json())
              .then((data) => {
                if (data.status === "complete") {
                  console.log(data.status);
                  console.log(user.uid);
                  updateDoc(doc(db, "users", user.uid), {
                    isPremium: true,
                  }).catch((error) => console.log(error));
                  fetchUserInfo(user.uid);
    
                  // onOpen();
    
                  //set user as premium
                } else {
                  alert(
                    "There was an error processing your payment. Please try again later."
                  );
                  // addJobInfo(null)
                }
              });
          } else {
          }
        } else {
        }
      }, [user, currentUser]);


      const testIfPremium = () =>{
        console.log("test")
      }
//access zustand store. One for each portion of the returned data (jobs, edu,  recommended/preferred industry)

  return (
    <div className="w-full" onClick={() => testIfPremium()}>
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
