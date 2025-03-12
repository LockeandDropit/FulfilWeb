import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";


const UploadToBackEnd = () => {
  
  
  //call open ai, fetch data for state.

    const [returnedResponse, setReturnedResponse] = useState([
      {
        "id": 1,
        "name": "Start Here",
        "attributes": {
          "jobTitle": "",
          "snippet": "",
          "timeCommitment": ""
        },
        "children": [2, 10, 14]
      },
      {
        "id": 2,
        "name": "$25k-$35k",
        "attributes": {
          "jobTitle": "HVAC Apprentice",
          "bullet1": "Assist experienced technicians with installations and repairs",
          "bullet2": "Learn HVAC basics and safety protocols",
          "timeCommitment": "0-1 years"
        },
        "children": [3, 7]
      },
      {
        "id": 3,
        "name": "$35k-$50k",
        "attributes": {
          "jobTitle": "HVAC Technician",
          "bullet1": "Perform routine service, maintenance, and repairs",
          "bullet2": "Diagnose equipment issues and install components",
          "timeCommitment": "1-3 years"
        },
        "children": [4, 5]
      },
      {
        "id": 4,
        "name": "$50k-$65k",
        "attributes": {
          "jobTitle": "Senior HVAC Technician",
          "bullet1": "Lead complex repair and service calls",
          "bullet2": "Mentor junior technicians and ensure quality work",
          "timeCommitment": "3-5 years"
        },
        "children": [6]
      },
      {
        "id": 5,
        "name": "$50k-$70k",
        "attributes": {
          "jobTitle": "HVAC Specialist",
          "bullet1": "Focus on high-efficiency and advanced system technologies",
          "bullet2": "Provide expert technical advice and analysis",
          "timeCommitment": "3-5 years"
        },
        "children": []
      },
      {
        "id": 6,
        "name": "$65k-$90k",
        "attributes": {
          "jobTitle": "Master HVAC Technician",
          "bullet1": "Oversee large-scale installations and complex maintenance",
          "bullet2": "Lead technical training and mentor teams",
          "timeCommitment": "5+ years"
        },
        "children": []
      },
      {
        "id": 7,
        "name": "$40k-$55k",
        "attributes": {
          "jobTitle": "HVAC Service Coordinator",
          "bullet1": "Coordinate service schedules and client communications",
          "bullet2": "Assist in dispatch and logistics",
          "timeCommitment": "1-3 years"
        },
        "children": [8]
      },
     {
        "id": 8,
        "name": "$55k-$70k",
        "attributes": {
          "jobTitle": "HVAC Field Supervisor",
          "bullet1": "Supervise field technicians and manage on-site operations",
          "bullet2": "Ensure safety and quality standards are met",
          "timeCommitment": "3-5 years"
        },
        "children": [9]
      },
    {
        "id": 9,
        "name": "$70k-$100k",
        "attributes": {
          "jobTitle": "HVAC Operations Manager",
          "bullet1": "Oversee regional service operations and strategy",
          "bullet2": "Manage budgets, resources, and process improvements",
          "timeCommitment": "5+ years"
        },
        "children": []
      },
       {
        "id": 10,
        "name": "$30k-$45k",
        "attributes": {
          "jobTitle": "HVAC Design Apprentice",
          "bullet1": "Assist in drafting and planning HVAC system designs",
          "bullet2": "Learn CAD and basic design calculations",
          "timeCommitment": "0-1 years"
        },
        "children": [11]
      },
     {
        "id": 11,
        "name": "$45k-$65k",
        "attributes": {
          "jobTitle": "HVAC Design Engineer",
          "bullet1": "Design HVAC systems for diverse projects",
          "bullet2": "Perform load calculations and develop CAD drawings",
          "timeCommitment": "1-3 years"
        },
        "children": [12]
      },
    {
        "id": 12,
        "name": "$65k-$85k",
        "attributes": {
          "jobTitle": "Senior HVAC Design Engineer",
          "bullet1": "Lead design projects and review system designs",
          "bullet2": "Ensure compliance with codes and efficiency standards",
          "timeCommitment": "3-5 years"
        },
        "children": [13]
      },
    {
        "id": 13,
        "name": "$85k-$120k",
        "attributes": {
          "jobTitle": "Principal HVAC Engineer",
          "bullet1": "Oversee major design projects and strategic initiatives",
          "bullet2": "Innovate advanced HVAC solutions",
          "timeCommitment": "5+ years"
        },
        "children": []
      },
     {
        "id": 14,
        "name": "$28k-$40k",
        "attributes": {
          "jobTitle": "HVAC Installer Trainee",
          "bullet1": "Assist with equipment installation and setup",
          "bullet2": "Learn safety procedures and installation best practices",
          "timeCommitment": "0-1 years"
        },
        "children": [15]
      },
     {
        "id": 15,
        "name": "$40k-$55k",
        "attributes": {
          "jobTitle": "HVAC Installer",
          "bullet1": "Install HVAC systems in residential and commercial projects",
          "bullet2": "Ensure installations meet quality and safety standards",
          "timeCommitment": "1-3 years"
        },
        "children": [16]
      },
     {
        "id": 16,
        "name": "$55k-$70k",
        "attributes": {
          "jobTitle": "Senior HVAC Installer",
          "bullet1": "Lead installation teams and manage complex projects",
          "bullet2": "Oversee quality control and safety compliance",
          "timeCommitment": "3-5 years"
        },
        "children": [17]
      },
      {
        "id": 17,
        "name": "$70k-$90k",
        "attributes": {
          "jobTitle": "HVAC Installation Manager",
          "bullet1": "Manage installation operations and coordinate projects",
          "bullet2": "Oversee client relations and ensure project quality",
          "timeCommitment": "5+ years"
        },
        "children": []
      }
    
    ]);


  //return data

  //on return, upload to firebase.

    const uploadCareerPathNodes = async () => {
      await updateDoc(doc(db, "Career Paths", 'hvac'), {
        nodes: returnedResponse,
      });
    };

    const uploadCareerPathDrawers = async () => {
      await updateDoc(doc(db, "Career Paths", 'hvac'), {
        drawers: returnedResponse,
      });
    };

  //test render for Data structure  



  const [resources, setResources] = useState(null)
  
  const testRender =  async () => {
    await getDoc(doc(db, "ResourcesByState", "wyoming")).then((snapshot) => {
        setResources(snapshot.data().resources)
        console.log("resources", snapshot.data().resources)
    })
  } 

  
  
  
    return (
<>
    <div>UploadToBackEnd</div>

    <button className=" white text-black border ml-2" onClick={() => uploadCareerPathNodes()} > upload nodes </button>

    <button className=" white text-black border ml-2" onClick={() => uploadCareerPathDrawers()} > upload drawers </button>

    
    {resources?.map((resource) => (
        <p>{resource.name}</p>
    ))}
    </>
  )
}

export default UploadToBackEnd