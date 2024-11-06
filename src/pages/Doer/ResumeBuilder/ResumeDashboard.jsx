import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";
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
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useUserStore } from "../Chat/lib/userStore";
import { useResumeStore } from "./lib/resumeStore";

const ResumeDashboard = () => {
  const navigate = useNavigate();

  const { currentUser } = useUserStore();
  const { setNewResumeName } = useResumeStore();

  console.log(currentUser);

  const [resumeName, setResumeName] = useState(null);

  const startNewResume = async () => {
    const resumeDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "Resumes",
      resumeName
    );
    await setDoc(resumeDocRef, {
      id: resumeName
    }).then(() => {
      setNewResumeName(resumeName);
      navigate("/FormHolder");
    });
  };

  useEffect(() => {
    if (currentUser) {
      getResumes();
    }
  }, [currentUser])

  const [resumes, setResumes] = useState(null);

  const getResumes = async () => {
    const q = query(collection(db, "users", currentUser.uid, "Resumes"));

    const querySnapshot = await getDocs(q);

    let resumeHolder = [];

    console.group("firing dashboard")
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      resumeHolder.push(doc.data());
   
    });

    setResumes(resumeHolder);
  };
 

  const handleNavigateToPreviousResume = (x) => {
    setNewResumeName(x).then(() => navigate("/ResumePreview"))
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log("resumesssss,", resumes)

  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <header className="mt-20">
            <h1 className="text-xl font-semibold">My Resumes</h1>
          </header>
          <div className=" flex space-x-6 cursor-pointer mt-4">
            <div
              className="p-14 py-24 border 
        items-center flex 
        justify-center bg-secondary
        rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed"
              onClick={() => onOpen()}
            >
              New Resume
            </div>

            {/* onclick, this will open a modal that will require the user to name their resume before starting... or I could just create a uid for it...? or both Idk. */}

{resumes?.map((resume) => (
   <div
   className="p-14 py-24 border 
items-center flex 
justify-center bg-secondary
rounded-lg h-[280px]
hover:scale-105 transition-all hover:shadow-md
cursor-pointer border-dashed"
   onClick={() => handleNavigateToPreviousResume(resume.id)}
 >
   {resume.id}
 </div>
))}


         
          </div>
        </div>
      </main>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Resume</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Enter the name of your resume</p>
            <div class=" mt-2">
              <input
                type="text"
                class="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="My Resume"
                onChange={(e) => setResumeName(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => startNewResume()}
            >
              Create
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ResumeDashboard;
