import React, { useEffect, useState } from "react";
import AboutPreview from "./Preview/AboutPreview";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useUserStore } from "../Chat/lib/userStore.js";
import { getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import EducationPreview from "./Preview/EducationPreview.jsx";
import ExperiencePreview from "./Preview/ExperiencePreview.jsx";
const ResumePreview = () => {
  const { currentUser } = useUserStore();

  console.log("current user", currentUser);

  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid, "Resumes", "Resume1")).then(
        (snapshot) => {
          if (!snapshot.data()) {
          } else {
            console.log("from firestore", snapshot.data());
            setResumeInfo(snapshot.data());
          }
        }
      );
    }
  }, [currentUser]);

  return (
    <div>
      <Header />
      <Dashboard />

      {resumeInfo ? (
        <div className="flex items-center justify-center align-center">
          <div
            className="shadow-lg h-full p-14 border-t-[20px] w-1/2 "
            style={{
              borderColor: "blue",
            }}
          >
            <AboutPreview resumeInfo={resumeInfo} />
            {resumeInfo?.education?.length>0&&   <EducationPreview resumeInfo={resumeInfo} />}
            {resumeInfo?.experience?.length>0&& <ExperiencePreview resumeInfo={resumeInfo} />}
            
            
            {/* <SummeryPreview resumeInfo={resumeInfo} />
    
           {resumeInfo?.Experience?.length>0&& <ExperiencePreview resumeInfo={resumeInfo} />}
    
        {resumeInfo?.education?.length>0&&   <EducationalPreview resumeInfo={resumeInfo} />}
 
        {resumeInfo?.skills?.length>0&&    <SkillsPreview resumeInfo={resumeInfo}/>} */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResumePreview;
