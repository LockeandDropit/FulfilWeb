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
import DoerHeader from "../components/DoerHeader.jsx";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ResumePreview = ({ setModalClosed }) => {
  const { currentUser } = useUserStore();

  const navigate = useNavigate();

  const [resumeInfo, setResumeInfo] = useState(null);
  const { currentResumeName } = useResumeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCloseModal = () => {
    onClose();
    setModalClosed();
  };

  useEffect(() => {
    console.log("modal");
  }, []);

  useEffect(() => {
    if (currentUser) {
      onOpen();
      getDoc(doc(db, "users", currentUser.uid, "Resumes", "My Resume")).then(
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

  ////// Testing diff libraries/////////// ############

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const testpdf = async () => {
    // This whole thing is essentially GPT code.

    setLoading(true);

    // Capture the content using html2canvas
    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create a new PDF and add the captured image
    const pdf = new jsPDF("portrait", "in", "letter");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Get canvas dimensions in pixels
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate the scaling ratio to fit the canvas width to the PDF width
    const ratio = pdfWidth / canvasWidth;
    let imgWidth = pdfWidth;
    let imgHeight = canvasHeight * ratio;

    // If the scaled image height is too tall, recalculate based on the PDF height
    if (imgHeight > pdfHeight) {
      const newRatio = pdfHeight / canvasHeight;
      imgWidth = canvasWidth * newRatio;
      imgHeight = pdfHeight;
    }

    // Optionally, center the image vertically/horizontally if it's smaller than the page
    const marginX = (pdfWidth - imgWidth) / 2;
    const marginY = 0.5; // Fixed margin at the top (0.5 inches)

    // Add the image to the PDF at the computed position and size
    pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);

    // Instead of saving locally, get a Blob of the PDF
    const pdfBlob = pdf.output("blob");

    console.log("blolb", pdfBlob);

    const storage = getStorage();
    const resumeRef = ref(storage, "users/" + currentUser.uid + "/resume.jpg");

    await uploadBytes(resumeRef, pdfBlob).then((snapshot) => {});

    await getDownloadURL(resumeRef).then((response) => {
      updateDoc(doc(db, "users", currentUser.uid), {
        resume: response,
      })
        .then(() => {
          //all good
          setLoading(false);
          setUploadSuccess(true);
          setTimeout(() => {
            handleCloseModal();
          }, 400);
        })
        .catch((error) => {
          // no bueno
        });
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  function ResumePrintComponent({ resumeInfo, currentUser }) {
    return (
      <div id="section-to-print" className="w-full px-4" ref={contentRef}>
        <AboutPreview resumeInfo={resumeInfo} currentUser={currentUser} />
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
    );
  }

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
            {resumeInfo ? (
              <ResumePrintComponent
                resumeInfo={resumeInfo}
                currentUser={currentUser}
              />
            ) : (
              // <div id="section-to-print" className="w-full   px-2 ">
              //   <AboutPreview
              //     resumeInfo={resumeInfo}
              //     currentUser={currentUser}
              //   />
              //   {resumeInfo?.education?.length > 0 && (
              //     <EducationPreview resumeInfo={resumeInfo} />
              //   )}
              //   {resumeInfo?.experience?.length > 0 && (
              //     <ExperiencePreview resumeInfo={resumeInfo} />
              //   )}
              //   {resumeInfo?.skills?.length > 0 && (
              //     <SkillPreview resumeInfo={resumeInfo} />
              //   )}
              // </div>
              <p>Loading</p>
            )}
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

          {uploadSuccess ? (
            <button
              type="button"
              class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-white text-teal-500  focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              // onClick={() => reactToPrintFn()}
              onClick={() => testpdf()}
            >
              <svg
                class="shrink-0 size-4 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
              </svg>{" "}
              Success
            </button>
          ) : loading ? (
            <button
            type="button"
            class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 "
            // onClick={() => reactToPrintFn()}
            onClick={() => testpdf()}
          >
          Loading...
          </button>
          ) : (
            <button
              type="button"
              class="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
              // onClick={() => reactToPrintFn()}
              onClick={() => testpdf()}
            >
              Confirm
            </button>
          )}
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
