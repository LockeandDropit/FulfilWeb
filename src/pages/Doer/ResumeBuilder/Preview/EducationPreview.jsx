import React from "react";

const EducationPreview = ({ resumeInfo }) => {
  console.log("resume info", resumeInfo.education);

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: "Black",
        }}
      >
        Education
      </h2>
      <hr
        style={{
          borderColor: "blue",
        }}
      />

      {resumeInfo?.education.map((education, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: "black",
            }}
          >
            {education?.institutionName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree} in {education?.major}
            <span>
              {education?.startDate} - {education?.endDate}
            </span>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default EducationPreview;