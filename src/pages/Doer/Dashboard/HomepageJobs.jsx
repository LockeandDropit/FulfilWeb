import React, { useEffect } from "react";
import { useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useJobRecommendationStore } from "../lib/jobRecommendations";

const HomepageJobs = ({ user }) => {
  //fetch info from chatGPT
  const [userResumeInformation, setUserResumeInformation] = useState(null);

  const [returnedJobs, setReturnedJobs] = useState(null);
  const [newReturnedJobs, setNewReturnedJobs] = useState(null);
  const [loading, setLoading] = useState(true);

   const { recommendedJobs, setRecommendedJobs } = useJobRecommendationStore();


  console.log("recommended jobs", recommendedJobs)

  const getJobs = async () => {
    setLoading(true);

    const response = await fetch(
      "https://openaiapi-c7qc.onrender.com/getJobs",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `The user's location is ${user.city}, ${user.state}. The user's current pay is ${user.currentIncome} a year. The user is interested in ${user.userInterests}`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse w array", JSON.parse(json.message.content));

    setReturnedJobs(JSON.parse(json.message.content));
    setNewReturnedJobs(JSON.parse(json.message.content));
  };

  console.log(typeof returnedJobs);

  useEffect(() => {
    // getJobs();
  }, []);

  useEffect(() => {
    if (returnedJobs) {
      setLoading(false);
    }
  }, [returnedJobs]);

  const handleOpenJob = (x) => {
    window.open(x.link);
  };

  const uploadJobs = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      returnedJobs: newReturnedJobs
    });
  };

  useEffect(() => {
    if (newReturnedJobs) {
      uploadJobs();
    }
  }, [newReturnedJobs]);

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setReturnedJobs(snapshot.data().returnedJobs);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  return (
    <div className="w-full bg-sky-400 6 py-12">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="flex flex-row w-full">
          <div>
            <h1 class="block text-3xl font-semibold text-white sm:text-2xl lg:text-3xl lg:leading-tight ">
              Open Positions
            </h1>
            <p class="mt-2 text text-white">
              Browse open positions that fit your skill set.
            </p>
          </div>
          {loading ? (
            <button className=" px-4 py-1 h-2/3 ml-auto bg-white hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm">
              <div
                className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-gray-700 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </button>
          ) : (
            <button
              className=" px-5 py-1 h-2/3 ml-auto bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-md shadow-sm"
              onClick={() => getJobs()}
            >
              Refresh
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
          {!loading && recommendedJobs?.map((job) => (
            <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
              <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                <div class="flex justify-between">
                  <div class="flex flex-col justify-center items-center  ">
                    <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                      {job.percent_increase}% pay increase
                      <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="font-medium text-gray-800">{job.job_title}</h3>
                  <h3 class="font-medium text-gray-800">{job.company}</h3>
                  <h3 class="text-sm text-gray-500">{job.location}</h3>
                  <h3 class="text-sm text-gray-500 mt-2">
                    <span className="text-sm font-medium text-gray-800">
                      Salary:
                    </span>{" "}
                    ${job.pay_rate}
                  </h3>

                  <p class="mt-3 text-gray-700 line-clamp-4">
                    {job.job_description}
                  </p>
                </div>

                <div className="flex mt-auto mb-1">
                  <button
                    type="button"
                    class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 "
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                    onClick={() => handleOpenJob(job)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col sm:flex-row sm:w-full">
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                      <svg
                        class="shrink-0 size-5 text-gray-500"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z"
                          fill="#36C5F0"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z"
                          fill="#2EB67D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z"
                          fill="#ECB22E"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z"
                          fill="#E01E5A"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col animate-pulse">
                    <ul class="w-1/3 h-4 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>
                    <ul class="w-1/4 h-4 mt-1 bg-gray-400 rounded-full "></ul>

                    <p class="mt-3 ">
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                      <ul class="w-full mt-1 h-4 bg-gray-400 rounded-full "></ul>
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomepageJobs;
