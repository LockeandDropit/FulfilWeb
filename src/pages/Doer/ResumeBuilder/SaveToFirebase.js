import { useUserStore } from "../Chat/lib/userStore";
import { db } from "../../../firebaseConfig";
import { doc, collection, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import EducationPreview from "./Preview/EducationPreview";
import ExperiencePreview from "./Preview/ExperiencePreview";
import SkillPreview from "./Preview/SkillPreview";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AboutPreview from "./Preview/AboutPreview";

export default async function SaveToFirebase() {

  const { currentUser } = useUserStore();

        // This whole thing is essentially GPT code.
    
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
            })
            .catch((error) => {
              // no bueno
            });
        });
     

      const contentRef = useRef(null);
    //   const reactToPrintFn = useReactToPrint({ contentRef });
    
      function ResumePrintComponent({ resumeInfo, currentUser }) {
        return (
          <div id="section-to-print" className="w-full px-2" ref={contentRef}>
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

      
}