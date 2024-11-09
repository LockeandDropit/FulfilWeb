import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Dashboard from "../../components/Dashboard";
import BuildResume from "./BuildResume";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../Chat/lib/userStore";
import { useLocation } from "react-router-dom";

const FormHolder = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const [isEdit, setIsEdit] = useState(false)
  const { currentUser } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.isEdit === true) {
setActiveFormIndex(location.state.index)
setIsEdit(true)
    }
  },[])


  console.log("current user form holder", currentUser);

  const handleIncrementFormIndex = () => {
    setActiveFormIndex((activeFormIndex) => activeFormIndex + 1);
  };

  // absolutely DISGUSTING work around for not being able to access Editor state. But this is the price of a mid-range IQ.
  const resetExperienceForm = (x) => {
    console.log("x", x)
    setActiveFormIndex(0);
    setTimeout(() => {
      setActiveFormIndex(3);
    }, 400);
  };

  const resetEducationForm = () => {
    setActiveFormIndex(0);
    setTimeout(() => {
      setActiveFormIndex(2);
    }, 400);
  };

  const resetSkillsForm = () => {
    setActiveFormIndex(0);
    setTimeout(() => {
      setActiveFormIndex(4);
    }, 400);
  };

 //credit Olabisi Olaoye https://www.freecodecamp.org/news/build-a-stepper-component-in-react/ 10/24/24
  const NUMBER_OF_STEPS = 5
  const [currentStep, setCurrentStep] = React.useState(0)

  const goToNextStep = () => setCurrentStep(prev => prev === NUMBER_OF_STEPS - 1 ? prev : prev + 1)
  const goToPreviousStep = () => setCurrentStep(prev => prev <= 0 ? prev : prev - 1)

  console.log("active form index", activeFormIndex);

  return (
    <div>
      <Header />
      <Dashboard />
    

      <div className="flex justify-center w-full h-dvh">
      
      <div className="flex items-center justify-center align-center">
      
          </div>
        {activeFormIndex === 0 ? (
          <div className="flex items-center justify-center align-center">
            <div
              class="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-blue-500 rounded-full "
              role="status"
              aria-label="loading"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : activeFormIndex === 1 ? (
          <>
      
          <BuildResume handleIncrementFormIndex={handleIncrementFormIndex} isEdit={isEdit}
           />
           </>
        ) : activeFormIndex === 2 ? (
          <Education
            handleIncrementFormIndex={handleIncrementFormIndex}
            resetEducationForm={resetEducationForm}
            isEdit={isEdit}
          />
        ) : activeFormIndex === 3 ? (
          <Experience
            handleIncrementFormIndex={handleIncrementFormIndex}
            resetExperienceForm={resetExperienceForm}
            isEdit={isEdit}
          />
        ) : activeFormIndex === 4 ? <Skills
        handleIncrementFormIndex={handleIncrementFormIndex}
        resetSkillsForm={resetSkillsForm}
        isEdit={isEdit}
      /> : activeFormIndex ===
          5 ? <Navigate to={'/ResumePreview'} /> : activeFormIndex === 6 ? null : null}
      </div>
    </div>
  );
};

export default FormHolder;
