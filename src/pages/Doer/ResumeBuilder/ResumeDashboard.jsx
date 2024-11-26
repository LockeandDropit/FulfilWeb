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
import DoerHeader from "../components/DoerHeader";

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
      id: resumeName,
    }).then(() => {
      setNewResumeName(resumeName);
      navigate("/FormHolder");
    });
  };

  useEffect(() => {
    if (currentUser) {
      getResumes();
    }
  }, [currentUser]);

  const [resumes, setResumes] = useState(null);

  const getResumes = async () => {
    const q = query(collection(db, "users", currentUser.uid, "Resumes"));

    const querySnapshot = await getDocs(q);

    let resumeHolder = [];

    console.group("firing dashboard");
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      resumeHolder.push(doc.data());
    });

    setResumes(resumeHolder);
  };

  const handleNavigateToPreviousResume = (x) => {
    setNewResumeName(x).then(() => navigate("/ResumePreview"));
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {/* <Header />
      <Dashboard /> */}

      <DoerHeader />

      <main id="content" class="pt-[59px]">
        <div class="max-w-6xl mx-auto ">
          <header className="mt-20">
            <h1 className="text-xl font-semibold">My Resumes</h1>
          </header>
          <div className=" flex flex-wrap space-x-6 cursor-pointer mt-4">
            <div
              className="p-14 py-24 border 
                items-center flex flex-col
                justify-center bg-secondary
                rounded-lg h-[280px] min-w-[200px]
                hover:scale-105 transition-all hover:shadow-md
                cursor-pointer border-dashed"
              onClick={() => onOpen()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <p className="text-base text-gray-800 mt-1">New Resume</p>
            </div>

            {/* onclick, this will open a modal that will require the user to name their resume before starting... or I could just create a uid for it...? or both Idk. */}

            {resumes?.map((resume) => (
              <div
                                  className=" my-2 p-14 py-24 border 
                  items-center flex flex-col 
                  justify-center bg-secondary
                  rounded-lg h-[280px] min-w-[200px]
                  hover:scale-105 transition-all hover:shadow-md
                  cursor-pointer border-dashed"
                onClick={() => handleNavigateToPreviousResume(resume.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>

                <p className="text-base text-gray-800 mt-1">{resume.id}</p>
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
            <p>Enter the name of your resume:</p>
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
              class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
