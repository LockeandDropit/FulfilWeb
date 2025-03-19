import React, { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { useQuizStore } from "./quizStore";
import OnboardingHeader from "../../../Doer/components/OnboardingHeader";
import QuizResultJobs from "./components/QuizResultJobs";
import LoggedOutHeader from "../../../../components/Landing/LoggedOutHeader";
import QuizHeader from "./components/QuizHeader";
import GoalIncome from "./GoalIncome";

const QuizResults = ({ handleIncrementFormIndex }) => {
  const {
    personalValues,
    currentPay,
    payGoal,
    city, 
    state,
    talents,
    workEnvironment,
    passion,
    learningAndDevelopment,
    longTerm,
  } = useQuizStore();

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null)  
    const [returnedEducation, setReturnedEducation] = useState(null);

  const [answersComplete, setAnswersComplete] = useState(null);

  const [d, setD] = useState(null);
  const [e, setE] = useState(null);
  const [f, setF] = useState(null);
  const [g, setG] = useState(null);

  useEffect(() => {
    if (d && e && f && g) {
      setAnswersComplete(true);
    } else {
      setAnswersComplete(false);
    }
  }, [d, e, f, g]);


  const [personalValuesString, setPersonalValuesString] = useState(null)

  const getEdu = async () => {


    const response = await fetch(
      // "http://localhost:8000/getEdu", {
      "https://openaiapi-c7qc.onrender.com/getEdu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: `The user's location is ${city}, ${state}. The user's current pay is ${currentPay}. The user is interested in ${result.career_title}`,
      }),
    });
    if (!response.ok) {
      // throw new Error(`Response status: ${response.status}`);
      getEdu()
    }

    const json = await response.json();
    console.log("json resopnse w array EDU", JSON.parse(json.message.content));

    setReturnedEducation(JSON.parse(json.message.content));
    setIsLoading(false);
  };


  
  const getRecommendation = async () => {
    const response = await fetch(
      "https://openaiapi-c7qc.onrender.com/careerQuizResponse",
      // "http://localhost:8000/careerQuizResponse",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: `Here are the user's personal values ranked from 1-5: ${JSON.stringify(personalValues)}. Here are the user's abilities ranked from 1-5: ${JSON.stringify(talents)}. They prefer the following work environment(s): ${JSON.stringify(workEnvironment)}. The following are things they are passionate about: ${JSON.stringify(passion)}. They learn and develop best in the following ways: ${JSON.stringify(learningAndDevelopment)}. They want to see the following in their long term career outlook: ${JSON.stringify(longTerm)}. They live in ${city}, ${state}. They make ${currentPay} and would like to make ${payGoal}`,
        }),
      }
    );
    if (!response.ok) {
      // throw new Error(`Response status: ${response.status}`);
      getRecommendation()
    }

    const json = await response.json();
    console.log("response", JSON.parse(json.message.content));

    setResult(JSON.parse(json.message.content))

    // setIndustryRecommendation(JSON.parse(json.message.content));
    // setLoading(false);
  };

  console.log(
    personalValues,
    currentPay,
    payGoal,
    city,
    state,
    payGoal,
    talents,
    workEnvironment,
    passion,
    learningAndDevelopment,
    longTerm
  );

  

  useEffect(() => {
setTimeout(() => {
// getRecommendation()
}, 2000)
  },[])

  useEffect(() => {
if (result) {
  getEdu()
  // setIsLoading(false);
}
  },[result])


  const [openSignUp, setOpenSignUp] = useState(false)

  const handleOpenSignUp = () => {
    setOpenSignUp(!openSignUp)
  }

  //add current pay, pay ggoal, user location (city/state), blue collar or non blue collar option?

  return (
    <div className="w-full ">
<QuizHeader result={result} returnedEducation={returnedEducation} props={openSignUp}/>
    {isLoading ? ( <div className="mx-auto w-full  flex flex-col items-center justify-center mt-16">
          <span className="inline-flex items-center gap-x-1.5  px-3 rounded-full font-medium  text-slate-700 underline">
            Note: Loading your results could take up to 1 minute...
          </span>

          <div class="sm:min-w-96 p-8 bg-white flex flex-col text-center items-center rounded-xl  ">
          <ul class="w-3/4 h-8 bg-gray-300 rounded-full animate-pulse"></ul>

            <div className="w-full items-center justify-center flex flex-row space-x-2 mt-4">
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Avg. salary</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                <ul class="w-3/4 h-4 bg-gray-300 rounded-full animate-pulse"></ul>
                </div>
              </div>
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Industry Growth</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                <ul class="w-3/4 h-4 bg-gray-300 rounded-full animate-pulse"></ul>
                </div>
              </div>
            </div>

            <div className="flex flex-row mt-4 space-x-2 w-full mb-4">
              <span className="w-full h-6 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-800 animate-pulse">

              </span>
              <span className="w-full h-6 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-800">
           
              </span>
              <span className="w-full h-6 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-800">
            
              </span>
            </div>

          
            <ul class="w-full mb-2 h-4 bg-gray-300 rounded-full animate-pulse"></ul>
            <ul class="w-full  mb-2 h-4 bg-gray-300 rounded-full animate-pulse"></ul>
            <ul class="w-2/3 h-4 bg-gray-300 rounded-full animate-pulse"></ul>

            <div class="mt-5">
              <a
                class="group py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg border border-transparent text-white bg-sky-500 hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden"
                onClick={() => handleOpenSignUp()} 
              >
                See Full Career Path
                <svg
                  class="shrink-0 size-3.5"
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
                  <path
                    class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                    d="M5 12h14"
                  />
                  <path
                    class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                    d="m12 5 7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>) : ( <div className="mx-auto flex flex-col items-center justify-center mt-16">
          {/* <span className="inline-flex items-center gap-x-1.5  px-3 rounded-full font-medium  text-sky-500 underline">
            Results
          </span> */}

          <div class="p-8 bg-white flex flex-col text-center rounded-xl ">
            <h3 class="font-medium text-3xl text-gray-800 mb-6">{result.career_title}</h3>

            <div className="w-full items-center justify-center flex flex-row space-x-2">
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Avg. salary</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                  <p class="text-2xl font-semibold text-gray-800 ">{result.average_salary}</p>
                </div>
              </div>
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Industry Growth</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                  <p class="text-2xl font-semibold text-gray-800 ">{result.industry_growth}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-row mt-4 space-x-2">
              {result.badges.map(badge => <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-800">
               {badge}
              </span>)}
            
            </div>

            <p class="mt-3 text-gray-500 sm:max-w-xl ">
             {result.description}
            </p>

            <div class="mt-5">
              <a
                class="group py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-sm rounded-lg border border-transparent text-white bg-sky-500 hover:bg-sky-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden"
               onClick={() => handleOpenSignUp()}
              >
                See Full Career Path
                <svg
                  class="shrink-0 size-3.5"
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
                  <path
                    class="lg:opacity-0 lg:-translate-x-1 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-focus:opacity-100 lg:group-focus:translate-x-0 lg:transition"
                    d="M5 12h14"
                  />
                  <path
                    class="lg:-translate-x-1.5 lg:group-hover:translate-x-0 lg:group-focus:translate-x-0 lg:transition"
                    d="m12 5 7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>)}
   
      <QuizResultJobs result={result} handleOpenSignUp={handleOpenSignUp} />
    </div>
  );
};

export default QuizResults;
