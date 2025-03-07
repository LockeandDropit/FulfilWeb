import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";


const UploadToBackEnd = () => {
  
  
  //call open ai, fetch data for state.

    const [returnedResponse, setReturnedResponse] = useState([
      {
        "id": 1,
        "jobTitle": "Start Here",
        "JobOverview": "An entry point to explore multiple HVAC career paths with opportunities to advance into technical, specialized, and business ownership roles.",
        "KeyResponsibilities": [
          "Assess personal interests and aptitudes in the HVAC trade.",
          "Explore various paths from hands-on technical roles to leadership and business management.",
          "Plan for progressive skill development and credential acquisition."
        ],
        "Qualifications": [
          "Open-mindedness to learning the HVAC trade.",
          "Basic aptitude in math and mechanical reasoning."
        ],
        "OpeningsOrEducation": {
          "name": "Pipefitters Local 539 HVAC/R Service Apprenticeship",
          "overview": "A five-year paid apprenticeship that combines on-the-job training with classroom learning in HVAC installation, repair, and maintenance. Covers union standards and safety protocols.",
          "city": "Minneapolis, MN",
          "state": "MN",
          "link": "https://pipefitters539.com/"
        }
      },
      {
        "id": 2,
        "jobTitle": "HVAC Apprentice",
        "JobOverview": "An entry-level position where individuals learn the fundamentals of HVAC systems, safety procedures, and installation basics while working under experienced technicians.",
        "KeyResponsibilities": [
          "Assist in installing HVAC systems and performing basic maintenance tasks.",
          "Learn safety protocols and union standards on the job.",
          "Participate in classroom and on-the-job training sessions."
        ],
        "Qualifications": [
          "High school diploma or equivalent.",
          "Basic mechanical aptitude and a strong work ethic.",
          "Valid driver’s license and willingness to work in various conditions."
        ],
        "OpeningsOrEducation": {
          "name": "Pipefitters Local 539 HVAC/R Service Apprenticeship",
          "overview": "Offers a comprehensive apprenticeship program combining practical work experience with classroom learning to develop foundational HVAC skills and industry certifications.",
          "city": "Minneapolis, MN",
          "state": "MN",
          "link": "https://pipefitters539.com/"
        }
      },
      {
        "id": 3,
        "jobTitle": "HVAC Installer",
        "JobOverview": "A skilled role focused on the installation of HVAC systems in residential and commercial buildings. The installer interprets blueprints, sets up equipment, and ensures all components meet safety and code standards.",
        "KeyResponsibilities": [
          "Install HVAC equipment including furnaces, air handlers, ductwork, and piping.",
          "Interpret technical blueprints and construction plans accurately.",
          "Perform startup tests and adjustments to ensure proper system operation."
        ],
        "Qualifications": [
          "Completion of an HVAC apprenticeship or journeyman certification.",
          "Knowledge of electrical systems, sheet metal work, and installation practices.",
          "Familiarity with building codes and union safety standards."
        ],
        "OpeningsOrEducation": {
          "name": "Residential Heating, Ventilation & Air Conditioning Diploma – Hennepin Technical College",
          "overview": "A two-semester diploma program focused on residential HVAC installation with hands-on training and certification preparation, including OSHA and EPA 608 modules.",
          "city": "Eden Prairie, MN",
          "state": "MN",
          "link": "https://hennepintech.edu/academic-programs/architecture-construction/hvac.html"
        }
      },
      {
        "id": 4,
        "jobTitle": "HVAC Service Technician",
        "JobOverview": "A field role dedicated to diagnosing, repairing, and maintaining HVAC systems across residential and commercial settings. Technicians are responsible for performing both routine maintenance and emergency repairs.",
        "KeyResponsibilities": [
          "Conduct thorough diagnostics using specialized tools such as multimeters and refrigerant gauges.",
          "Perform repairs or part replacements for components like compressors, motors, and controls.",
          "Manage routine maintenance tasks and document service calls accurately."
        ],
        "Qualifications": [
          "Journeyman-level HVAC experience with relevant technical certifications (e.g. EPA 608 Universal).",
          "Strong troubleshooting and customer service skills.",
          "Valid driver’s license and the ability to work independently."
        ],
        "OpeningsOrEducation": {
          "name": "HVAC/R Technology A.A.S. – Minneapolis Community & Technical College",
          "overview": "A two-year Associate of Applied Science degree program emphasizing comprehensive HVAC/R training with a balance of theory and hands-on experience to prepare graduates for service roles.",
          "city": "Minneapolis, MN",
          "state": "MN",
          "link": "https://minneapolis.edu/academic-programs/catalog/hvacr"
        }
      },
      {
        "id": 5,
        "jobTitle": "HVAC Foreman",
        "JobOverview": "A supervisory role responsible for overseeing HVAC installation crews on job sites. The foreman ensures quality work, adherence to safety protocols, and efficient project execution.",
        "KeyResponsibilities": [
          "Supervise and assign tasks to HVAC installers and apprentices on site.",
          "Conduct quality control inspections and ensure compliance with building codes.",
          "Coordinate with project managers and other trades to keep projects on schedule."
        ],
        "Qualifications": [
          "Several years of experience as a journeyman installer or technician.",
          "Proven leadership skills and ability to manage a team effectively.",
          "Familiarity with project management and scheduling in construction settings."
        ],
        "OpeningsOrEducation": {
          "name": "UA Foreman Certification Program",
          "overview": "A specialized training course offered by the United Association that focuses on leadership, project planning, and supervisory skills required for managing HVAC crews on large projects.",
          "city": "Minneapolis, MN",
          "state": "MN",
          "link": "https://ua.org/education-and-training/"
        }
      },
      {
        "id": 6,
        "jobTitle": "HVAC Controls Specialist",
        "JobOverview": "A technical role that focuses on installing, programming, and troubleshooting building automation systems for HVAC equipment. This specialist ensures systems operate efficiently and integrate with other building functions.",
        "KeyResponsibilities": [
          "Install and configure building automation systems and control interfaces.",
          "Calibrate sensors, program control logic, and troubleshoot integration issues.",
          "Provide training and documentation for building operators on system use."
        ],
        "Qualifications": [
          "Background in HVAC installation with additional training in low-voltage controls and automation.",
          "Familiarity with BAS platforms and networking protocols (e.g., BACnet, LonWorks).",
          "Problem-solving skills and technical proficiency in electronic systems."
        ],
        "OpeningsOrEducation": {
          "name": "Trane Building Systems and Controls Training",
          "overview": "A specialized training program hosted by Trane in White Bear Lake, MN, focusing on advanced HVAC control systems, programming, and integration with building automation systems.",
          "city": "White Bear Lake, MN",
          "state": "MN",
          "link": "https://www.trane.com/commercial/north-america/us/en/education-training/trane-university/building-systems-and-controls-training-.html"
        }
      },
      {
        "id": 7,
        "jobTitle": "Senior HVAC Technician",
        "JobOverview": "A highly experienced technician role that handles complex diagnostics and repairs. The senior technician mentors junior staff and tackles high-profile service calls, ensuring optimal system performance.",
        "KeyResponsibilities": [
          "Lead complex diagnostic procedures and implement advanced repair techniques.",
          "Mentor and train junior technicians on sophisticated troubleshooting methods.",
          "Maintain detailed service records and ensure compliance with industry standards."
        ],
        "Qualifications": [
          "10+ years of HVAC experience, ideally with master-level certification or equivalent.",
          "Expertise in both electrical and mechanical troubleshooting.",
          "Certifications such as NATE are highly desirable along with excellent leadership skills."
        ],
        "OpeningsOrEducation": {
          "name": "NATE Certification Training",
          "overview": "A certification program that validates advanced HVAC skills. Senior technicians can pursue NATE’s master-level certifications through a series of specialty exams and training modules.",
          "city": "Various testing centers in MN",
          "state": "MN",
          "link": "https://natex.org/"
        }
      },
      {
        "id": 8,
        "jobTitle": "HVAC Refrigeration Technician",
        "JobOverview": "A specialist role focusing on the installation, repair, and maintenance of commercial refrigeration systems used in supermarkets, restaurants, and industrial settings.",
        "KeyResponsibilities": [
          "Service and maintain refrigeration systems including walk-in coolers and industrial chillers.",
          "Diagnose issues specific to refrigeration components such as compressors and expansion valves.",
          "Handle refrigerant recovery, leak detection, and system retrofits with precision."
        ],
        "Qualifications": [
          "HVAC training with an emphasis on commercial refrigeration applications.",
          "EPA 608 Universal Certification, with additional ammonia or industrial refrigeration certifications a plus.",
          "Familiarity with both mechanical repair techniques and the specialized tools required for large refrigeration systems."
        ],
        "OpeningsOrEducation": {
          "name": "Advanced HVAC/R – Commercial Refrigeration Diploma",
          "overview": "A focused diploma program offered by Minnesota State Community & Technical College that prepares technicians for specialized roles in commercial and industrial refrigeration.",
          "city": "Moorhead, MN",
          "state": "MN",
          "link": "https://www.minnesota.edu/programs-and-degrees/hvac/r"
        }
      },
      {
        "id": 9,
        "jobTitle": "General Foreman",
        "JobOverview": "A high-level supervisory role responsible for overseeing multiple HVAC crews and large-scale projects. The general foreman coordinates resources, enforces quality and safety standards, and manages overall project timelines.",
        "KeyResponsibilities": [
          "Oversee multiple job sites and coordinate between different crew foremen.",
          "Develop project schedules and allocate resources efficiently across projects.",
          "Ensure quality control, safety compliance, and effective communication between all parties."
        ],
        "Qualifications": [
          "15+ years of HVAC field experience with proven leadership on large-scale projects.",
          "Strong project management skills and a deep understanding of construction operations.",
          "Excellent communication abilities and a track record of improving jobsite efficiency."
        ],
        "OpeningsOrEducation": {
          "name": "MSCA Service Managers Training Program",
          "overview": "A leadership seminar designed for high-level supervisors in the HVAC industry, focusing on multi-site coordination, advanced planning, and effective team management.",
          "city": "St. Louis, MO",
          "state": "MO",
          "link": "https://www.mcaa.org/events/calendar/msca-service-managers-training-program-spring-2025/"
        }
      },
      {
        "id": 10,
        "jobTitle": "HVAC Contractor / Business Owner",
        "JobOverview": "An entrepreneurial role where seasoned professionals transition into owning and operating an HVAC contracting business. Responsibilities extend beyond technical work to include business management, client relations, and strategic planning.",
        "KeyResponsibilities": [
          "Manage overall business operations including staffing, bidding, and financial planning.",
          "Develop marketing strategies and maintain client relationships to secure ongoing projects.",
          "Ensure compliance with licensing, bonding, and regulatory requirements while maintaining high service quality."
        ],
        "Qualifications": [
          "Extensive HVAC experience (typically 10-20 years) with deep technical and industry knowledge.",
          "Strong business acumen and experience in managing budgets, operations, and client contracts.",
          "Master-level technical credentials and proven leadership in the field are highly beneficial."
        ],
        "OpeningsOrEducation": {
          "name": "Start and Grow Your HVAC Business",
          "overview": "A comprehensive small business development course designed for HVAC professionals transitioning into business ownership. Covers business planning, marketing, finance, and regulatory compliance.",
          "city": "Minneapolis, MN",
          "state": "MN",
          "link": "https://www.tradifyhq.com/blog/how-to-start-an-hvac-business"
        }
      },
      {
        "id": 11,
        "jobTitle": "HVAC Service Manager",
        "JobOverview": "A managerial role responsible for the smooth operation of an HVAC service department. This role balances customer service with team management and operational efficiency, ensuring timely service and high customer satisfaction.",
        "KeyResponsibilities": [
          "Oversee daily dispatch, scheduling, and performance of HVAC service technicians.",
          "Handle customer escalations, manage service contracts, and optimize operational workflows.",
          "Monitor financial performance of the service department and implement process improvements."
        ],
        "Qualifications": [
          "5-10+ years of HVAC service experience combined with strong leadership and management skills.",
          "Proficiency in service management software and a solid understanding of financial metrics in field operations.",
          "Excellent interpersonal skills with a proven track record of improving customer service and departmental efficiency."
        ],
        "OpeningsOrEducation": {
          "name": "MSCA Service Managers Training Program",
          "overview": "A specialized training program for HVAC service managers that focuses on leadership, financial management, and operational efficiency within service departments.",
          "city": "St. Louis, MO",
          "state": "MO",
          "link": "https://www.mcaa.org/events/calendar/msca-service-managers-training-program-spring-2025/"
        }
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