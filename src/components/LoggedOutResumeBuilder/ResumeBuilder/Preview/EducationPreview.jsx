import React from "react";

const EducationPreview = ({ allEducation }) => {
  console.log("resume info", allEducation);

  return (
    <div className="my-6">
      <h2
        className="text-start text-lg font-bold mb-1"
        style={{
          color: "Black",
        }}
      >
        Education
      </h2>
      <hr
        style={{
          borderColor: "gray",
        }}
      />

      {allEducation.map((education, index) => (
        <div key={index} className="my-5 mb-2">
          <h2
            className="text font-medium"
        
          >
            {education?.institutionName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree} 
            <span className="flex">
              {education?.displayStartDate} - {education?.isEnrolled === true ? (<p className="text-gray-700 ml-1">Currently attending</p>) : (<p>{education?.displayEndDate}</p>) }
            </span>
          </h2>
        </div>
      ))}
    </div>
  );
};

export default EducationPreview;
