import React from "react";

const AboutPreview = ({ aboutInfo }) => {
  console.log("resumeInfo fromn about", aboutInfo);




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
        {aboutInfo?.fullName}
      </h2>
      {/* <h2 className="text-center text-sm font-medium">
        {resumeInfo?.jobTitle}
      </h2> */}

<h2
        className=" font-normal text-sm"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {aboutInfo?.city}, {aboutInfo?.state}
      </h2>
      
      <ul className=" flex flex-row space-x-7 list-disc">
      
      <p
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {aboutInfo?.email}

        </p>

      {aboutInfo?.phoneNumber && (<li
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {aboutInfo.phoneNumber}
        </li>)}
        
        
        {/* <li
        className=" font-normal text-sm text-gray-600"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {currentUser?.city}, {currentUser?.state}
      </li> */}
      </ul>
      
      <div className="">

      {/* <h2
        className=" font-normal text-sm text-gray-600"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {currentUser?.city}, {currentUser?.state}
      </h2> */}
      </div>

{aboutInfo?.about && (
        <div className="w-full mt-4 mb-2 text-sm text-gray-800">{aboutInfo.about}</div>
)}
  
      

    </div>
  );
};

export default AboutPreview;
