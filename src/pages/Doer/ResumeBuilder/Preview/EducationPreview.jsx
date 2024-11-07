import React from "react";

const EducationPreview = ({ resumeInfo }) => {
  console.log("resume info", resumeInfo.education);

  return (
    <div className="my-6">
      <h2
        className="text-start font-bold mb-1"
        style={{
          color: "Black",
        }}
      >
        Education
      </h2>
      <hr
        style={{
          borderColor: "black",
        }}
      />

      {resumeInfo?.education.map((education, index) => (
        <div key={index} className="my-5 mb-2">
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
            <span className="flex">
              {education?.startDate} - {education?.endDate ? (<p>{education?.endDate}</p>) : (<p className="text-gray-700 ml-1">Currently attending</p>)}
            </span>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default EducationPreview;
