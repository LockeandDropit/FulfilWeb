import React from "react";
import Markdown from "react-markdown";
const ExperiencePreview = ({ resumeInfo }) => {
  console.log("resume info experience", resumeInfo);

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
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
            // borderColor: resumeInfo?.themeColor,
          }
        }
      />

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
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
              {experience?.startDate} -{" "}
              {experience?.currentlyWorking ? "Present" : experience.endDate}{" "}
            </span>
          </h2>
          {/* <p className='text-xs my-2'>
                {experience.workSummery}
            </p> */}
          <div
            className="w-full prose prose-li  font-inter marker:text-black mb-4  my-2"
            // dangerouslySetInnerHTML={{ __html: experience?.description }}
          />
          <Markdown>
            {experience?.description}
          </Markdown>
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
