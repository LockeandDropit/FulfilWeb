import React from "react";

const AboutPreview = ({ resumeInfo }) => {
  console.log("resume info", resumeInfo);

  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={
          {
            // color:resumeInfo?.themeColor
          }
        }
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
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
        {resumeInfo?.city}, {resumeInfo?.state}
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
          {resumeInfo?.phoneNumber}
        </h2>
        <h2
          className="font-normal text-sm"
          style={
            {
              // color:resumeInfo?.themeColor
            }
          }
        >
          {resumeInfo?.email}
        </h2>
      </div>

      

      {resumeInfo?.aboutDescription && (
        <>
          <hr
            className="border-[1.5px] my-2"
            style={
              {
                // borderColor:resumeInfo?.themeColor
              }
            }
          />
          <div className="flex flex-col justify-start mt-2 mb-1">
            {/* <h2 className="text-base font-bold text-black">About</h2> */}
            <h2 className="font-normal text-sm">
              {resumeInfo?.aboutDescription}
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutPreview;
