import React, { useState } from "react";
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
    await setDoc(resumeDocRef, {}).then(() => {
      setNewResumeName(resumeName);
      navigate("/FormHolder")});
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Header />
      <Dashboard />

      <main id="content" class="lg:ps-[260px] pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <header className="mt-20">
            <h1 className="text-xl font-semibold">My Resumes</h1>
          </header>
          <div className="mt-40 flex space-x-6 cursor-pointer">
            <p onClick={() => onOpen()}>Add Resume</p>
            {/* onclick, this will open a modal that will require the user to name their resume before starting... or I could just create a uid for it...? or both Idk. */}
            <p onClick={() => navigate("/ResumePreview")}>previous resume</p>
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
