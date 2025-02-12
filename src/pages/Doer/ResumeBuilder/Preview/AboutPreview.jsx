import React from "react";

const AboutPreview = ({ resumeInfo, currentUser }) => {
  console.log("resumeInfo fromn about", resumeInfo);




  // bring in little blurb. keep it under My Resume in FB but as a floating portion.
  // also ask for phone (optional) in resume builder.


  return (
    <div className="">
      <h2
        className="font-bold text-2xl "
        style={
          {
            // color:resumeInfo?.themeColor
          } 
        }
      >
        {currentUser?.firstName} {currentUser?.lastName}
      </h2>
      {/* <h2 className="text-center text-sm font-medium">
        {resumeInfo?.jobTitle}
      </h2> */}

      <div className=" flex flex-row space-x-2">
      
      {resumeInfo?.phoneNumber && (<h2
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {resumeInfo.phoneNumber}
        </h2>)}
        
        <h2
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {currentUser?.email}

        </h2>
      </div>
      {/* <h2
        className=" font-normal text-sm"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {currentUser?.city}, {currentUser?.state}
      </h2> */}
      <div className="">

      <h2
        className=" font-normal text-sm text-gray-600"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {currentUser?.city}, {currentUser?.state}
      </h2>
      </div>

{resumeInfo?.about && (
        <div className="w-full mt-4 mb-2 text-sm text-gray-800">{resumeInfo.about}</div>
)}
  
      

    </div>
  );
};

export default AboutPreview;
