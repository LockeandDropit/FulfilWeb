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
import { useResumeStore } from "./lib/resumeStore.js";

const ResumePreview = () => {
  const { currentUser } = useUserStore();

  console.log("current user", currentUser);

  const [resumeInfo, setResumeInfo] = useState(null);
  const {currentResumeName} = useResumeStore();

  useEffect(() => {
    if (currentUser && currentResumeName) {
      getDoc(doc(db, "users", currentUser.uid, "Resumes", currentResumeName)).then(
        (snapshot) => {
          if (!snapshot.data()) {
          } else {
            console.log("from firestore", snapshot.data());
            setResumeInfo(snapshot.data());
          }
        }
      );
    }
  }, [currentUser, currentResumeName]);

  console.log(currentResumeName)

  const handleDownload = () => {
    window.print();
  };

  const contentRef = useRef();

  // https://medium.com/@wathsaradesilva2000/create-pdfs-in-react-using-jspdf-and-html2canvas-aa59667438fc
  const handleDownloadPdf = async () => {
    const input = contentRef.current;
    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      //https://github.com/niklasvh/html2canvas/issues/3009
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      // end code attribution
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MyResume.pdf");
    });
  };
  return (
    <>
      <div id="no-print">
        <Header />
        <Dashboard />
        <div className="items-center justify-center align-center">
          <div className="w-fit flex flex-col align-center items-center justify-center my-10 mx-10 md:mx-20 lg:mx-auto mt-20">
            <h2 className="text-center text-2xl font-medium items-center justify-center">
              Your Resume is ready!{" "}
            </h2>
            <p className="text-center text-gray-400">
              Now you are ready to download your resume and you can share unique
              resume url with your friends and family{" "}
            </p>
            <div className="flex space-x-3">
            <button  class="mt-3 py-2 w-full flex px-11 text-center items-center gap-x-2 text-sm  font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none">Edit <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
</button>
            <button
              onClick={handleDownloadPdf}
               class="mt-3 py-2 w-full flex px-11 text-center items-center gap-x-2 text-sm  font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
            >
              Download
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

            </button>
            </div>
          </div>
{resumeInfo ? (<div className="mt-6 my-10 mx-10 md:mx-20 lg:mx-auto  flex items-center justify-center">
            <div ref={contentRef} className="w-[900px] h-[1250px] px-10 py-3">
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
          </div>) : (<p>Loading</p>)}
          
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
