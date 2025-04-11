import { useEffect, useState } from "react";
import { useSelectedJobStore } from "./SelectedJobStore";
import Markdown from "react-markdown";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { db } from "../../../firebaseConfig";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import { useUserStore } from "../Chat/lib/userStore";

const SelectedJobFull = () => {
  const { selectedJob } = useSelectedJobStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useUserStore();
  const navigate = useNavigate();

  const [drawerInfo, setDrawerInfo] = useState("");

  const [sortedQualifications, setSortedQualifications] = useState(null);
  const [sortedBenefits, setSortedBenefits] = useState(null);
  const [sortedResponsibilities, setSortedResponsibilities] = useState(null);

  function formatBulletList(selectedJob) {
    // Check if the string starts with a bullet
    console.log("sele", selectedJob);
    let splitHolder = [];

    if (selectedJob.qualifications.startsWith("- ")) {
      splitHolder.push(selectedJob.qualifications.split(/-/g));

      console.log("splitholder", splitHolder[0]);
      setSortedQualifications(splitHolder[0]);
    }
  }

  function formatBenefitsBulletList(selectedJob) {
    let splitHolder = [];

    if (
      selectedJob.benefits.startsWith("- ") ||
      selectedJob.benefits.startsWith("• ")
    ) {
      splitHolder.push(selectedJob.benefits.split(/•/g));
      setSortedBenefits(splitHolder[0]);
    }
  }

  function formatResponsibilitiesBulletList(selectedJob) {
    let splitHolder = [];

    if (
      selectedJob.responsibilities.startsWith("- ") ||
      selectedJob.responsibilities.startsWith("• ")
    ) {
      splitHolder.push(selectedJob.responsibilities.split(/-/g));
      setSortedResponsibilities(splitHolder[0]);
    }
  }

  // useEffect(() => {
  //   if (selectedJob !== null) {
  //     formatBulletList(selectedJob);
  //     formatBenefitsBulletList(selectedJob);
  //     formatResponsibilitiesBulletList(selectedJob);
  //     setSaved(false)
  //     setHasApplied(false)
  //   }
  // }, [selectedJob]);

  const [resumeIsComplete, setResumeIsComplete] = useState(false);
  const [resume, setResume] = useState(null);


  useEffect(() => {
    if (currentUser) {
      getDoc(doc(db, "users", currentUser.uid)).then((snapshot) => {
        if (!snapshot.data().resume) {
          //open modaloption to create resume
        } else {
          console.log("from firestore", snapshot.data().resume);
          setResume(snapshot.data().resume);
          setResumeIsComplete(true);
        }
      });
    }
  }, [currentUser]);

  


  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(false);

  const checkIfResumeIsComplete = async () => {
    setLoading(true);
    console.log("resume is complete", resumeIsComplete);

    if (resumeIsComplete) {
      // hit the nodemailer api, passing the jobs recruiter email

      const response = await fetch(
        "http://localhost:8000/sendUserResume",
        // "https://openaiapi-c7qc.onrender.com/getResumeHelp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_link: resume,
            recruiter_email: "johncolormm@gmail.com",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (
        json.message_sent.rejected.length === 0 ||
        !json.message_sent.rejected.length
      ) {
        // indicate this job has been applied to on this screen, and also create job id in Applied collection in FB
        setHasApplied(true);
        setLoading(false);
        await setDoc(
          doc(db, "users", currentUser.uid, "Applied Jobs", selectedJob.id),
          {
            jobID: selectedJob.id,
            isExpired: false,
          }
        );
      } else {
        //error
      }
    } else {
      //modal to upload resume or navigate to resume builder
      onOpen();
    }
  };

  const handleSave = async () => {
    //do I pass/save the whole job or just the ID?

    console.log("selected job", selectedJob.id);

    await setDoc(
      doc(db, "users", currentUser.uid, "Saved Jobs", selectedJob.id),
      {
        jobID: selectedJob.id,
        isExpired: false,
      }
    );
    setSaved(true);
  };

  // TODO TODAY 3/26:

  // integrate search. 
  
  //Need to migrate db to mySQL

  // scrape a few more job boards (see chat gpt deep research), make sure you're getting an email as well

  // put nodemailer api on server

 

  // get side scrolling on white careousels to show arrows (half done...)

  // filter originally showed jobs by user's category of interest(s)

  // make sure google ads is running

  return selectedJob ? (
    <>
      <div class="pl-10 h-full overflow-y-scroll scrollbar">
        <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
          <div class="">
            <div class="p-4">
              <div class=" cursor-default">
                <div className="flex w-full">
                  <div className="ml-auto flex space-x-3">
                    {" "}
                    {hasApplied ? (
                      <button
                        type="button"
                        class="py-2 px-5 w-3/4 inline-flex justify-center items-center gap-x-2 font-medium rounded-lg border border-transparent bg-white text-teal-500  focus:outline-none  disabled:opacity-50 disabled:pointer-events-none"
                        // onClick={() => reactToPrintFn()}
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
                        Applied
                      </button>
                    ) : loading ? (
                      <button
                        type="button"
                        class="py-2 px-5 w-full  justify-center items-center gap-x-2  font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                        disabled
                      >
                        <svg
                          class="animate-spin  h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </button>
                    ) : (
                      <div className=" flex space-x-3">
                        {saved ? (
                          <button class=" py-2 px-3 inline-flex justify-center items-center gap-x-2 border border-gray-200  font-medium rounded-lg  bg-white text-red-400  hover:shadow-sm ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#F87171"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className=" ml-auto cursor-pointer size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSave()}
                            class=" py-2 px-3 inline-flex justify-center items-center gap-x-2 border border-gray-200  font-medium rounded-lg  bg-white  hover:shadow-sm "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className=" ml-auto cursor-pointer size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                              />
                            </svg>
                          </button>
                        )}

                        <button
                          type="button"
                          class="py-2 px-5 w-3/4 inline-flex justify-center items-center gap-x-2  font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                          onClick={() => checkIfResumeIsComplete()}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Story Content */}
              <div className="mx-auto">
                {/* Grid */}
                <div className="flex flex-col lg:flex-row lg:justify-between gap-y-5 gap-x-10">
                  {/* Center Content */}
                  <div className="lg:max-w-xl w-full">
                    {/* Heading */}
                    <div className="pb-2 mb-6 lg:pb-2 lg:mb-3 lg:last:pb-0 last:mb-0 lg:last:border-b-0 border-b border-gray-200">
                      <h1 className="font-semibold text-2xl lg:text-3xl text-gray-800">
                        {selectedJob.job_title}
                      </h1>
                      <h1 className="font-medium text-lg  text-gray-700">
                        {selectedJob.location}
                      </h1>
                      <h1 className="font-medium text-lg  text-gray-700">
                        {selectedJob.company}
                      </h1>

                      <div className="flex mt-4 mb-4 w-3/4 justify-between">
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                          {selectedJob.pay_range}
                        </span>
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                          Full-Time
                        </span>
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1 text-base font-medium bg-teal-100 text-teal-800 rounded-md ">
                          {selectedJob.date_posted}
                        </span>
                      </div>
                    </div>
                    {/* End Heading */}

                    <div className="space-y-7 pb-6 mb-6 lg:pb-10 lg:mb-10 lg:last:pb-0 last:mb-0 lg:last:border-b-0 border-b border-gray-200">
                      <h4 className="font-medium text-lg text-gray-800">
                        About The Job
                      </h4>

                      <p className="text-gray-600">{selectedJob?.job_summary}</p>

                      <h4 className="font-medium text-lg text-gray-800">
                        Qualifications
                      </h4>

                      <ol className="flex flex-col gap-y-1 text-gray-600 list-disc markdown pl-5">
                        {selectedJob?.requirements?.map((x) => (
                          <li className="flex gap-x-3">
                            <div>{x}</div>
                          </li>
                        ))}
                      </ol>

                      <h4 className="font-medium text-lg text-gray-800">
                        Responsibilities
                      </h4>

                      <ol className="flex flex-col gap-y-1 text-gray-600 list-disc markdown pl-5">
                        {selectedJob?.responsibilities?.map((x) => (
                          <li className="flex gap-x-3">
                            <div>{x}</div>
                          </li>
                        ))}
                      </ol>

                      <h4 className="font-medium text-lg text-gray-800">
                        Benefits
                      </h4>

                      <ul className=" flex flex-col gap-y-1 text-gray-600 list-disc markdown pl-5">
                        {selectedJob.benefits?.map((x) => (
                          <li className="flex gap-x-3">
                            <div>{x}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* End Center Content */}
                </div>
                {/* End Grid */}
              </div>
              {/* End Customer Story Content */}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {/* Card */}
            <div className="py-10 px-5 relative overflow-hidden text-center ">
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  So close!
                </h3>
                <p className="mt-1 text-gray-500">
                  Finish your resume before you apply.
                </p>
                <div className="mt-3 sm:mt-5">
                  <button
                    onClick={() => navigate("/ResumeBuilder")}
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-sky-400 text-white shadow-2xs hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                    data-hs-overlay="#hs-pro-dshm"
                  >
                    Finish resume
                    <svg
                      class="shrink-0 size-4 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* End Card */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ) : (
    <div class="flex animate-pulse">
      <div class="ms-4 mt-2 w-full">
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
        </ul>

        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
        </ul>
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full"></li>
        </ul>
        <ul class="mt-5 space-y-3">
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-full h-4 bg-gray-300 rounded-full "></li>
          <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
          <li class="w-full h-4 bg-gray-300 rounded-full"></li>
        </ul>
      </div>
    </div>
  );
};

export default SelectedJobFull;
