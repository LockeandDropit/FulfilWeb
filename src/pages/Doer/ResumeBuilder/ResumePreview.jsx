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
import DoerHeader from "../components/DoerHeader.jsx";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

const ResumePreview = ({setModalClosed}) => {

  const { currentUser } = useUserStore();



  const navigate = useNavigate();

  const [resumeInfo, setResumeInfo] = useState(null);
  const { currentResumeName } = useResumeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCloseModal = () => {
    onClose();
    setModalClosed();
  }

  useEffect(() => {
    console.log("modal")
  }, [])

  useEffect(() => {
    if (currentUser ) {
      onOpen();
      getDoc(
        doc(db, "users", currentUser.uid, "Resumes", "My Resume")
      ).then((snapshot) => {
        if (!snapshot.data()) {
        } else {
          console.log("from firestore", snapshot.data());
          setResumeInfo(snapshot.data());
        }
      });
    }
  }, [currentUser, currentResumeName]);

  console.log(currentResumeName);

  const handleDownload = () => {
    var prtContent = document.getElementById("print");
    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
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



  //lets turn this into a modal for now.
  // see how that goes for v1

  const MyDocument = () => (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
  );

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300); // Delay allows layout to settle
  };


  return (
    
     <Modal isOpen={isOpen} onClose={() => handleCloseModal()} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
       
          <ModalCloseButton />
          <ModalBody>
        
          {resumeInfo ? (
           
              <div id="section-to-print" className="w-full  px-2 py-3">
                <AboutPreview resumeInfo={resumeInfo} currentUser={currentUser}/>
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
         
          ) : (
            <p>Loading</p>
          )}
             </ModalBody>
          <ModalFooter>
            <button
              type="button"
              class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              onClick={onClose}
            >
              Nevermind
            </button>
            <button
              type="button"
              class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-100 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handlePrint()}
            >
              Print
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
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});