import React from "react";
import { useState } from "react";
import DoerHeader from "../../../Doer/components/DoerHeader";
import { useLocation } from "react-router-dom";
import CurrentIncome from "./CurrentIncome";
import GoalIncome from "./GoalIncome";
import CareerInterests from "./CareerInterests";

const OnboardingFormHolder = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  const handleIncrementFormIndex = () => {
    setActiveFormIndex((activeFormIndex) => activeFormIndex + 1);
  };

  console.log("active form index", activeFormIndex);

  return (
    <div>
      <DoerHeader />
      {activeFormIndex === 1 ? (
        <CurrentIncome handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 2 ? (
        <GoalIncome handleIncrementFormIndex={handleIncrementFormIndex} />
      ) : activeFormIndex === 3 ? (
        <CareerInterests />
      ) : null}
    </div>
  );
};

export default OnboardingFormHolder;
