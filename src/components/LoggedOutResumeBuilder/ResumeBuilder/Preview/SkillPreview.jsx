import React from "react";
import Markdown from "react-markdown";
const SkillPreview = ({ allSkills }) => {
  

  return (
    <div className="my-6">
      <h2
        className="text-start text-lg font-bold mb-1"
        style={{  
          color: "black",
        }}
      >
        Skills & Certifications
      </h2>
      <hr
        style={{
          borderColor: "gray",
        }}
      />

      <div className="grid grid-cols-2 my-1">
        {allSkills?.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
         
              <p className="prose prose-li  font-inter marker:text-black">
                <ul>
                  <li className="text-sm"> {skill.skillName}</li>
                </ul>
              </p>
        
            <div className="h-2 bg-gray-200 w-[120px]">
              <div
                className="h-2"
                style={{
                  backgroundColor: "white",
                  width: skill?.rating * 20 + "%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillPreview;
