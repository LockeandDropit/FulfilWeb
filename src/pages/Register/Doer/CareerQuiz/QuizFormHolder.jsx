import React from "react";
import { useState } from "react";
import DoerHeader from "../../../Doer/components/DoerHeader";
import { useLocation } from "react-router-dom";
import CurrentIncome from "./CurrentIncome";
import GoalIncome from "./GoalIncome";
import CareerInterests from "./CareerInterests";
import OnboardingHeader from "../../../Doer/components/OnboardingHeader";
import QuizQ1 from "./QuizQ1";
import QuizQ1P2 from "./QuizQ1P2";
import QuizQ2 from "./QuizQ2";
import QuizQ3 from "./QuizQ3";
import QuizQ4 from "./QuizQ4";
import OnboardingProgressBar from "./OnboardingProgressBar";
import QuizQ5 from "./QuizQ5";
import QuizQ6 from "./QuizQ6";
import QuizQ6P2 from "./QuizQ6P2";
import LoggedOutHeader from "../../../../components/Landing/LoggedOutHeader";
import QuizHeader from "./components/QuizHeader";
import QuizIncome from "./QuizIncome";
import QuizUserLocation from "./QuizUserLocation";

const QuizFormHolder = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  const handleIncrementFormIndex = () => {
    setActiveFormIndex((activeFormIndex) => activeFormIndex + 1);
  };

  console.log("active form index", activeFormIndex);

  return (
    <div>
      <QuizHeader />
      <OnboardingProgressBar />

      {activeFormIndex === 1 ? (
        <QuizQ1 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 2 ? (
        <QuizQ1P2 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 3 ? (
        <QuizQ2 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 4 ? (
        <QuizQ3 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 5 ? (
        <QuizQ4 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 6 ? (
        <QuizQ5 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 7 ? (
        <QuizQ6 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 8 ? (
        <QuizQ6P2 handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 9 ? (
        <QuizIncome handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 10 ? (
        <QuizUserLocation handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : null}
    </div>
  );
};

export default QuizFormHolder;
