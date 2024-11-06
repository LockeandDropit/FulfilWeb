import React, { useEffect, useState, useRef } from "react";
import AboutPreview from "./Preview/AboutPreview";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useUserStore } from "../Chat/lib/userStore.js";
import { getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import EducationPreview from "./Preview/EducationPreview.jsx";
import ExperiencePreview from "./Preview/ExperiencePreview.jsx";
import SkillPreview from "./Preview/SkillPreview.jsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

  const handleDownload = () => {
    window.print();
  };


  const contentRef = useRef();
  const generatePdf = () => {
    const input = contentRef.current;
    html2canvas(input, { scale: 1 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('download.pdf');
      });
  };
  return (
    <>
      <div id="no-print">
        <Header />
        <Dashboard />

        <div className="my-10 mx-10 md:mx-20 lg:mx-80 mt-20 lg:ml-26">
          <h2 className="text-center text-2xl font-medium">
            Your Resume is ready!{" "}
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and you can share unique
            resume url with your friends and family{" "}
          </p>
          <div className="flex justify-between px-44 my-10">
            <button onClick={generatePdf}>Download</button>
          </div>
        </div>
      </div>
      <div ref={contentRef} className="my-10 mx-10 md:mx-20 lg:mx-80">
        <div id="print-area">
          <AboutPreview resumeInfo={resumeInfo} />
          {resumeInfo?.education?.length > 0 && (
            <EducationPreview resumeInfo={resumeInfo} />
          )}
          {resumeInfo?.experience?.length > 0 && (
            <ExperiencePreview resumeInfo={resumeInfo} />
          )}
          {resumeInfo?.skills?.length > 0 && (
            <SkillPreview resumeInfo={resumeInfo} />
          )}
        </div>
      </div>
      {/* <div className="no-print">
        <Header />
        <Dashboard />
      </div>
      <div className="justify-center align-center">
        {resumeInfo ? (
          <div className=" border h-dvh  justify-center items-center align-center">
            <div
              className="flex items-center mt-10 justify-center align-center "
              id="print-area"
            >
              <div
                className="shadow-lg h-full p-14 border-t-[20px] w-1/2 "
                style={{
                  borderColor: "blue",
                }}
              >
                <AboutPreview resumeInfo={resumeInfo} />
                {resumeInfo?.education?.length > 0 && (
                  <EducationPreview resumeInfo={resumeInfo} />
                )}
                {resumeInfo?.experience?.length > 0 && (
                  <ExperiencePreview resumeInfo={resumeInfo} />
                )}
                {resumeInfo?.skills?.length > 0 && (
                  <SkillPreview resumeInfo={resumeInfo} />
                )}
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={handleDownload}
          className="bg-black flex items-center align-center justify-center"
        >
          download
        </button>
      </div> */}
    </>
  );
};

export default ResumePreview;
