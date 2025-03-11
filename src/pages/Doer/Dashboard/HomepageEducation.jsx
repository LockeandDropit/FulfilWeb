import React, { useEffect } from "react";
import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useEduRecommendationStore } from "../lib/eduRecommendations";
import EduCarousel from "../components/EduCarousel";
const HomepageEducation = ({ user }) => {
  const [userResumeInformation, setUserResumeInformation] = useState(null);

  const [returnedJobs, setReturnedJobs] = useState(null);
  const [newReturnedEdu, setNewReturnedEdu] = useState(null);
  const [loading, setLoading] = useState(true);

  const { recommendedEdu, setRecommendedEdu } = useEduRecommendationStore();

  const getEdu = async () => {
    setLoading(true);

    const response = await fetch("https://openaiapi-c7qc.onrender.com/getEdu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: `The user's location is ${user.city}, ${user.state}. The user's current pay is ${user.currentIncome}. The user is interested in ${user.userInterests}`,
      }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log("json resopnse w array EDU", JSON.parse(json.message.content));

    setReturnedJobs(JSON.parse(json.message.content));
    setNewReturnedEdu(JSON.parse(json.message.content));
    setRecommendedEdu(JSON.parse(json.message.content));
    
    // setLoading(false);
  };

  useEffect(() => {
    if (user != null) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setReturnedJobs(snapshot.data().returnedEducation);
      });
    } else {
      console.log("oops!");
    }
  }, [user]);

  const uploadEdu = async () => {
    await updateDoc(doc(db, "users", user.uid), {
      returnedEducation: newReturnedEdu,
    });
  };

  useEffect(() => {
    if (newReturnedEdu) {
      //upload to firebase
      uploadEdu();
    }
  }, [newReturnedEdu]);

  useEffect(() => {
    if (returnedJobs) {
      setTimeout(() => {
        setLoading(false);
        console.log("returnedEdu", returnedJobs);
      }, 2000);
    }
  }, [returnedJobs]);

  const handleOpenJob = (x) => {
    window.open(x.link);
  };

  console.log("recommendedEdu", recommendedEdu);

  return (
    <div className="w-full  py-6 py-12 mb-16">
      <div class="max-w-[85rem] mx-auto mt-6  px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-row w-full">
          <div>
            <h1 class="block text-3xl font-semibold text-gray-800 sm:text-2xl lg:text-3xl lg:leading-tight ">
              Education & Training
            </h1>
            <p class="mt-2 text text-gray-800">
              Opportunities in your field to grow your skill set and earning
              potential.
            </p>
          </div>
          {loading ? (
            <button className="border border-gray-300 px-4 py-1 h-2/3 ml-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm">
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
              className="border border-gray-300 px-5 py-1 h-2/3 ml-auto bg-white hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-md shadow-sm"
              onClick={() => getEdu()}
            >
              Refresh
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
          <div className="w-full h-[400px]">
            {!loading && recommendedEdu ? (
              <EduCarousel slides={recommendedEdu} />
            ) : null}
          </div>
          </div>

        <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
          {/* {!loading &&
            recommendedEdu?.map((edu) => (
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center rounded-lg ">
                      <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                        {edu.percent_increase}% pay increase
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
                    <h3 class="font-medium text-gray-800">
                      {edu.program_name}
                    </h3>
                    <h3 class="font-medium text-gray-800">{edu.institution}</h3>
                    <h3 class="text-sm text-gray-500">{edu.location}</h3>
                    <div className="mt-1 flex ">
                      <h3 class="text-sm text-gray-500">
                        <p className="mr-1 font-medium text-sm text-gray-800">
                          Avg. Salary:
                        </p>{" "}
                        ${edu.salary_after_completion}
                      </h3>
                    </div>
                    <p class="mt-3 text-gray-700 line-clamp-4 ">
                      {edu.description}
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
                    <button
                      type="button"
                      class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50  "
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                      onClick={() => handleOpenJob(edu)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))} */}

          {loading && (
            <div className="flex flex-col sm:flex-row sm:w-full">
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-full sm:w-1/3">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl w-full ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
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
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
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
                    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg "></div>
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

export default HomepageEducation;
