import React from "react";

const AboutPreview = ({ resumeInfo, currentUser }) => {
  console.log("currentUser", currentUser);

  return (
    <div className="">
      <h2
        className="font-bold text-xl text-center"
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
      <h2
        className="text-center font-normal text-sm"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {currentUser?.city}, {currentUser?.state}
      </h2>
      <div className="text-center">

        <h2
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {currentUser?.phoneNumber}
        </h2>
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

      

    </div>
  );
};

export default AboutPreview;
