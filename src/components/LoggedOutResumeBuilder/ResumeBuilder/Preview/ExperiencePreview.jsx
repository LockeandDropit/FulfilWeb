import React from "react";
import Markdown from "react-markdown";
const ExperiencePreview = ({ resumeInfo, updatedExperience }) => {
  console.log("resume info experience", resumeInfo);

  return (
    <div className="my-6">
      <h2
        className="text-start text-lg font-bold mb-1"
        style={
          {
            // color: resumeInfo?.themeColor,
          }
        }
      >
        Professional Experience
      </h2>
      <hr
        style={
          {
            borderColor: "gray",
          }
        }
      />

      {updatedExperience ? (
        updatedExperience.map((experience, index) => (<div key={index} className="my-5">
          <h2
            className="text font-medium" 
          >
            {experience?.positionTitle}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName}
            <span>
              {experience?.displayStartDate} -{" "}
              {experience?.isCurrentlyEmployed ? "Present" : experience.displayEndDate}{" "}
            </span>
          </h2>
          {/* <p className='text-xs my-2'>
                {experience.workSummery}
            </p> */}
          <div
            className="w-full "
            // dangerouslySetInnerHTML={{ __html: experience?.description }}
          />
          <p className="w-full max-w-none  text-sm prose prose-li  font-inter marker:text-black my-2 align-center items-center">
          <Markdown>
            {experience?.description}
          </Markdown>
          </p>
        </div>))
      ) : resumeInfo?.experience.map((experience, index) => (
        <div key={index} className="my-5">
          <h2
            className="text font-medium"
            style={
              {
                // color: resumeInfo?.themeColor,
              }
            }
          >
            {experience?.positionTitle}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName}
            <span>
              {experience?.displayStartDate} -{" "}
              {experience?.isCurrentlyEmployed ? "Present" : experience.displayEndDate}{" "}
            </span>
          </h2>
          {/* <p className='text-xs my-2'>
                {experience.workSummery}
            </p> */}
          <div
            className="w-full "
            // dangerouslySetInnerHTML={{ __html: experience?.description }}
          />
          <p className="w-full max-w-none  text-sm prose prose-li  font-inter marker:text-black my-2 align-center items-center">
          <Markdown>
            {experience?.description}
          </Markdown>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
