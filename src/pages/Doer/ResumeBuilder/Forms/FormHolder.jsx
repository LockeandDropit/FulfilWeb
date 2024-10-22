import React, { useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import BuildResume from "./BuildResume";
import Experience from "./Experience";

const FormHolder = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);

  const handleIncrementFormIndex = () => {
    setActiveFormIndex((activeFormIndex) => activeFormIndex + 1)
  }

  console.log("active form index", activeFormIndex)

  return (
    <div>
      <Header />
      <Dashboard />
      <div className="flex justify-center items-center align-center ">
        {activeFormIndex === 1 ? (
          <BuildResume handleIncrementFormIndex={handleIncrementFormIndex} />
        ) : activeFormIndex === 2 ? (
          <Experience handleIncrementFormIndex={handleIncrementFormIndex}  />
        ) : activeFormIndex === 3 ? null : activeFormIndex ===
          4 ? null : activeFormIndex === 5 ? null : activeFormIndex ===
          6 ? null : null}
         
      </div>
    </div>
  );
};

export default FormHolder;
