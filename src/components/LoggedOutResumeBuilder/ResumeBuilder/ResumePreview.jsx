import React, { useEffect, useState, useRef } from "react";
import AboutPreview from "./Preview/AboutPreview";


import { useUserStore } from "../../../pages/Doer/Chat/lib/userStore.js";
import { getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import EducationPreview from "./Preview/EducationPreview.jsx";
import ExperiencePreview from "./Preview/ExperiencePreview.jsx";
import SkillPreview from "./Preview/SkillPreview.jsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useReactToPrint } from "react-to-print";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { useEducationStore } from "./lib/educationStore.js";
import { useExperienceStore } from "./lib/experienceStore.js";
import { useResumeStore } from "./lib/resumeStore.js";
import { useSkillStore } from "./lib/skillStore.js";

const ResumePreview = ({ setModalClosed }) => {
  const { currentUser } = useUserStore();

  const {allEducation} = useEducationStore();
  const {allExperiences} = useExperienceStore();
  const {allSkills} = useSkillStore()
  const {fullName, email, phoneNumber, about} = useResumeStore()

  const navigate = useNavigate();

  const [resumeInfo, setResumeInfo] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCloseModal = () => {
    onClose();
    setModalClosed();
  };

  useEffect(() => {
    console.log("modal");
    onOpen()
  }, []);





  const handleDownload = () => {
    var prtContent = document.getElementById("print");
    var WinPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };



  // https://medium.com/@wathsaradesilva2000/create-pdfs-in-react-using-jspdf-and-html2canvas-aa59667438fc
  // const handleDownloadPdf = async () => {
  //   const input = contentRef.current;
  //   html2canvas(input, { scale: 1 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     //https://github.com/niklasvh/html2canvas/issues/3009
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     // end code attribution
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("MyResume.pdf");
  //   });
  // };

  //lets turn this into a modal for now.
  // see how that goes for v1


  const aboutInfo = {
    fullName: fullName,
    phoneNumber: phoneNumber,
    email: email,
    about: about
  }


  const contentRef = useRef(null);
const reactToPrintFn = useReactToPrint({ contentRef });

console.log("all exp", allExperiences)

  function ResumePrintComponent({ resumeInfo, currentUser }) {
    return (
      <div id="section-to-print" className="w-full px-2" ref={contentRef}>
        <AboutPreview aboutInfo={aboutInfo}/>
        {allEducation?.length > 0 && (
          <EducationPreview allEducation={allEducation} />
        )}
        {allExperiences?.length > 0 && (
          <ExperiencePreview allExperiences={allExperiences} />
        )}
        {allSkills?.length > 0 && (
          <SkillPreview allSkills={allSkills} />
        )}
      </div>
    );
  }

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300); // Delay allows layout to settle
  };

  const componentRef = useRef();

  return (
    <Modal isOpen={isOpen} onClose={() => handleCloseModal()} size={"4xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {/* <button
            type="button"
            class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => reactToPrintFn()}
          >
            Print
          </button> */}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="">
            
               <ResumePrintComponent
               resumeInfo={resumeInfo}
               currentUser={currentUser}
             />
           
          
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handleCloseModal()}
          >
            Nevermind
          </button>
          <button
            type="button"
            class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => reactToPrintFn()}
          >
            Save
          </button>
      
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResumePreview;

const styles = StyleSheet.create({
  page: {
    width: 100,
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
