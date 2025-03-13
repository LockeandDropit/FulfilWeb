import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const UploadToBackEnd = () => {
  //call open ai, fetch data for state.

  const [returnedResponse, setReturnedResponse] = useState(
    [
      {
        "id": 1,
        "jobTitle": "Solar Panel Installer Career Overview",
        "JobOverview": "This overview provides a comprehensive introduction to the solar panel installation trade in Minnesota. It covers the progression from entry-level positions to specialized technical roles and entrepreneurial opportunities, emphasizing rigorous hands-on training, adherence to stringent safety protocols, and continuous technical education. Professionals in this field benefit from union-supported training programs and competitive wages, with a focus on sustainable energy solutions.",
        "KeyResponsibilities": [
          "Explore and evaluate various career pathways and training programs in the solar energy field.",
          "Develop a strong foundation in solar technology, electrical systems, and renewable energy principles.",
          "Gain in-depth knowledge of safety protocols, regulatory standards, and union guidelines specific to Minnesota.",
          "Engage in ongoing education through certifications, workshops, and practical on-site training.",
          "Research local industry trends, technological advancements, and wage standards in the renewable energy sector."
        ],
        "Qualifications": [
          "High school diploma or equivalent; coursework in math, physics, or technical subjects is advantageous.",
          "Basic understanding of electrical systems and mechanical principles.",
          "Strong interest in renewable energy, sustainability, and new technology.",
          "Willingness to engage in comprehensive on-the-job training, including union-sponsored programs.",
          "Good physical condition with the ability to work outdoors in varying weather conditions."
        ]
      },
      {
        "id": 2,
        "jobTitle": "Solar Panel Installer Apprentice",
        "JobOverview": "As a Solar Panel Installer Apprentice, you will start your career by acquiring essential hands-on skills under the guidance of seasoned professionals. This entry-level role emphasizes learning fundamental installation techniques, safety protocols, and the proper use and maintenance of tools in a union-supported training environment.",
        "KeyResponsibilities": [
          "Assist experienced installers with mounting solar panels, wiring systems, and configuration of components.",
          "Learn and practice proper tool usage, maintenance, and storage techniques.",
          "Follow detailed safety protocols to maintain a secure work environment at all times.",
          "Prepare and organize job sites by setting up ladders, scaffolding, and safety barriers.",
          "Document daily tasks, report challenges, and actively participate in training sessions."
        ],
        "Qualifications": [
          "High school diploma or GED; additional vocational or technical coursework is a plus.",
          "Basic electrical knowledge and mechanical aptitude with a keen interest in learning.",
          "Physically fit and capable of handling manual labor, including working at heights.",
          "Strong attention to detail and a commitment to adhering to safety protocols.",
          "Good communication skills and the ability to work effectively within a team."
        ]
      },
      {
        "id": 3,
        "jobTitle": "Junior Solar Panel Installer",
        "JobOverview": "Building on apprenticeship experience, the Junior Solar Panel Installer undertakes more independent installation tasks. This role is pivotal in executing standard residential and small-scale commercial solar projects while ensuring compliance with local codes, safety standards, and union regulations.",
        "KeyResponsibilities": [
          "Independently install solar panels on residential rooftops and small commercial properties following established guidelines.",
          "Assist in the setup, maintenance, and orderly breakdown of job sites.",
          "Conduct routine inspections, perform troubleshooting, and make minor repairs as needed.",
          "Collaborate with team members to ensure timely completion and quality of installations.",
          "Adhere to local building codes, safety standards, and union requirements throughout all projects."
        ],
        "Qualifications": [
          "Successful completion of an apprenticeship or equivalent training in solar installations.",
          "Basic understanding of electrical circuits, solar technology, and essential safety practices.",
          "Ability to interpret technical drawings, installation blueprints, and schematics.",
          "Strong work ethic, attention to detail, and commitment to high-quality workmanship.",
          "Ability to work in outdoor environments under diverse weather conditions."
        ]
      },
      {
        "id": 4,
        "jobTitle": "Certified Solar Panel Technician",
        "JobOverview": "The Certified Solar Panel Technician is a highly skilled professional with recognized certifications, capable of independently executing installations and advanced diagnostics. This role requires a deep understanding of solar system configurations, electrical troubleshooting, and adherence to strict safety and quality standards.",
        "KeyResponsibilities": [
          "Execute complete solar panel installations on various roof types, including complex configurations.",
          "Perform thorough system diagnostics, identify issues, and implement corrective measures.",
          "Ensure compliance with local, state, and federal safety regulations, including union guidelines.",
          "Maintain comprehensive documentation of installation procedures, test results, and certifications.",
          "Provide technical guidance and training support to junior installers when required."
        ],
        "Qualifications": [
          "Possession of industry certification in solar panel installation (e.g., NABCEP).",
          "1-2 years of hands-on installation experience demonstrating technical proficiency.",
          "Comprehensive knowledge of local building codes, electrical standards, and safety protocols.",
          "Strong problem-solving skills with the ability to troubleshoot complex technical issues.",
          "Excellent communication skills and a collaborative approach to team training."
        ]
      },
      {
        "id": 5,
        "jobTitle": "Residential Solar Panel Installer",
        "JobOverview": "Specializing in residential projects, the Residential Solar Panel Installer designs and installs customized solar systems for homeowners. This role focuses on providing energy-efficient solutions that meet unique residential needs while ensuring high-quality workmanship and customer satisfaction.",
        "KeyResponsibilities": [
          "Conduct detailed assessments of residential properties to determine optimal solar panel placement.",
          "Design and install custom solar systems, integrating panels, inverters, and electrical components.",
          "Perform comprehensive system inspections and routine maintenance to ensure efficiency and longevity.",
          "Advise homeowners on energy consumption, potential system upgrades, and cost-saving measures.",
          "Collaborate closely with clients to tailor installations to specific energy needs and aesthetic preferences."
        ],
        "Qualifications": [
          "Proven experience in residential solar installations with a portfolio of successful projects.",
          "Strong understanding of residential electrical systems, solar technology, and energy efficiency standards.",
          "Excellent customer service skills and the ability to communicate technical information clearly.",
          "Ability to work independently, manage project timelines, and deliver high-quality results.",
          "Familiarity with local building codes, permit processes, and safety regulations."
        ]
      },
      {
        "id": 6,
        "jobTitle": "Experienced Solar Panel Installer",
        "JobOverview": "With several years of practical experience, the Experienced Solar Panel Installer manages complex installation projects independently. This role demands advanced technical expertise, proactive problem-solving, and the leadership required to mentor junior team members within a unionized environment.",
        "KeyResponsibilities": [
          "Plan and execute complex solar panel installations, ensuring alignment with project specifications and deadlines.",
          "Diagnose and resolve intricate technical issues during installation using advanced troubleshooting techniques.",
          "Provide mentorship and on-the-job training to apprentices and junior installers.",
          "Coordinate with project managers, contractors, and other stakeholders to ensure project success.",
          "Maintain meticulous documentation of installation procedures, safety compliance, and quality control metrics."
        ],
        "Qualifications": [
          "Minimum of 3-5 years of hands-on solar panel installation experience with a proven record of success.",
          "Advanced technical knowledge of solar systems, electrical circuits, and modern installation methods.",
          "Strong leadership and project management skills with a focus on mentoring and teamwork.",
          "Ability to work independently under challenging conditions and adapt to evolving project requirements.",
          "Familiarity with union standards and a commitment to continuous professional development."
        ]
      },
      {
        "id": 7,
        "jobTitle": "Commercial Solar Panel Installer",
        "JobOverview": "The Commercial Solar Panel Installer specializes in large-scale projects for commercial and industrial facilities. This role requires meticulous planning, precise execution, and strong coordination with multiple stakeholders to meet the rigorous standards of commercial installations.",
        "KeyResponsibilities": [
          "Plan, design, and execute large-scale solar installations for commercial and industrial facilities.",
          "Coordinate with architects, engineers, and contractors to ensure installations meet commercial building requirements.",
          "Conduct thorough quality assurance inspections and enforce strict safety protocols on all projects.",
          "Manage logistics such as equipment transport, site setup, and adherence to regulatory standards.",
          "Adapt installation techniques to accommodate diverse commercial structures and energy demands."
        ],
        "Qualifications": [
          "A minimum of 3 years of specialized experience in commercial solar installations.",
          "Proficient in reading and interpreting technical blueprints, electrical schematics, and detailed installation plans.",
          "Strong organizational and project management skills with an acute attention to detail.",
          "Excellent problem-solving abilities and experience coordinating multi-stakeholder projects.",
          "In-depth understanding of commercial building codes, safety regulations, and union wage standards."
        ]
      },
      {
        "id": 8,
        "jobTitle": "Lead Solar Panel Technician",
        "JobOverview": "The Lead Solar Panel Technician holds an advanced role, overseeing complex projects and multiple installation teams. This position requires exceptional technical acumen, strategic planning, and effective communication to drive operational excellence and maintain stringent quality and safety standards.",
        "KeyResponsibilities": [
          "Supervise and coordinate multiple installation teams on high-priority projects.",
          "Implement and monitor rigorous quality control measures and safety protocols across installations.",
          "Develop and refine installation strategies to optimize efficiency and reduce project timelines.",
          "Conduct advanced diagnostics, technical audits, and performance evaluations on installed systems.",
          "Mentor both new and experienced technicians, providing guidance on complex technical issues."
        ],
        "Qualifications": [
          "Over 5 years of extensive experience in solar panel installations with proven leadership capabilities.",
          "Advanced technical certifications in solar energy systems and electrical work (e.g., NABCEP, OSHA).",
          "Demonstrated expertise in managing complex projects and coordinating cross-functional teams.",
          "Excellent strategic planning, decision-making, and communication skills.",
          "Strong commitment to quality, safety, and continuous process improvement."
        ]
      },
      {
        "id": 9,
        "jobTitle": "Senior Solar Panel Installer",
        "JobOverview": "The Senior Solar Panel Installer is a top-tier professional responsible for managing the most challenging installations. This role requires innovative thinking, high technical proficiency, and a strong ability to mentor and guide junior installers while ensuring optimal system performance and compliance with strict safety standards.",
        "KeyResponsibilities": [
          "Independently execute advanced solar panel installations using the latest industry technologies.",
          "Develop and implement innovative solutions to enhance system performance and energy efficiency.",
          "Provide technical leadership and mentorship to junior installers, fostering professional growth.",
          "Maintain detailed records of installation processes, performance data, and troubleshooting efforts.",
          "Ensure all installations adhere to the most current safety regulations, union standards, and quality benchmarks."
        ],
        "Qualifications": [
          "Over 5 years of extensive hands-on experience in solar panel installation across diverse environments.",
          "Expert-level proficiency with advanced installation techniques, system diagnostics, and optimization.",
          "Strong leadership qualities with a proven history of mentoring and guiding junior team members.",
          "Ability to work independently, manage complex projects, and integrate emerging technologies.",
          "In-depth knowledge of regulatory standards, union wage guidelines, and safety protocols in Minnesota."
        ]
      },
      {
        "id": 10,
        "jobTitle": "Solar Installation Contractor",
        "JobOverview": "The Solar Installation Contractor represents the entrepreneurial pathway within the solar installation industry. This role not only requires advanced technical expertise but also demands strong business acumen to oversee project management, financial planning, and regulatory compliance from bid to completion.",
        "KeyResponsibilities": [
          "Oversee the entire project lifecycle, including bidding, planning, scheduling, and execution.",
          "Manage installation crews, subcontractors, and vendor relationships to ensure high-quality outcomes.",
          "Handle budgeting, cost estimation, and resource allocation for multiple concurrent projects.",
          "Ensure strict compliance with regulatory, safety, and union guidelines across all projects.",
          "Cultivate and maintain strong client relationships through effective communication and reliable service delivery."
        ],
        "Qualifications": [
          "At least 7+ years of extensive experience in solar panel installations with proven project management skills.",
          "Robust understanding of construction management, financial planning, and regulatory compliance.",
          "Excellent leadership skills with experience managing large teams and complex projects.",
          "Valid contractor’s license along with relevant industry certifications and credentials.",
          "Proven ability to negotiate contracts, manage budgets, and deliver projects on time and within scope."
        ]
      },
      {
        "id": 11,
        "jobTitle": "Master Residential Installer",
        "JobOverview": "The Master Residential Installer specializes in high-end, custom residential solar projects. This role demands exceptional technical expertise, advanced design capabilities, and a deep understanding of client needs to deliver tailor-made, energy-efficient solutions that exceed expectations.",
        "KeyResponsibilities": [
          "Design, plan, and execute custom solar panel installations tailored to the unique requirements of each residential client.",
          "Conduct comprehensive assessments of residential properties to determine optimal system configurations.",
          "Implement cutting-edge installation techniques and advanced troubleshooting for complex projects.",
          "Provide detailed post-installation support, including regular maintenance and system optimization.",
          "Offer expert consultation on energy efficiency improvements, potential upgrades, and innovative solar technologies."
        ],
        "Qualifications": [
          "Over 7 years of specialized experience in high-end residential solar installations.",
          "Expert-level technical skills in solar system design, electrical engineering, and custom installations.",
          "Outstanding customer service and advisory capabilities with a proven track record of successful projects.",
          "In-depth knowledge of residential construction, local building codes, and safety regulations.",
          "Ability to innovate and adapt to emerging solar technologies and evolving industry standards."
        ]
      }
    ]
    
  );

  //return data

  //on return, upload to firebase.

  const uploadCareerPathNodes = async () => {
    await updateDoc(doc(db, "Career Paths", "solar panel installer"), {
      nodes: returnedResponse,
    });
  };

  const uploadCareerPathDrawers = async () => {
    await updateDoc(doc(db, "Career Paths", "solar panel installer"), {
      drawers: returnedResponse,
    });
  };

  const uploadCareerPathMisc = async () => {
    await updateDoc(doc(db, "Career Paths", "solar panel installer"), {
      misc: returnedResponse,
    });
  };

  //test render for Data structure

  const [resources, setResources] = useState(null);

  const testRender = async () => {
    await getDoc(doc(db, "ResourcesByState", "wyoming")).then((snapshot) => {
      setResources(snapshot.data().resources);
      console.log("resources", snapshot.data().resources);
    });
  };

  return (
    <>
      <div>UploadToBackEnd</div>

      <button
        className=" white text-black border ml-2"
        onClick={() => uploadCareerPathNodes()}
      >
        {" "}
        upload nodes{" "}
      </button>

      <button
        className=" white text-black border ml-4"
        onClick={() => uploadCareerPathDrawers()}
      >
        {" "}
        upload drawers{" "}
      </button>
      <button
        className=" white text-black border ml-4"
        onClick={() => uploadCareerPathMisc()}
      >
        {" "}
        upload misc{" "}
      </button>

      {resources?.map((resource) => (
        <p>{resource.name}</p>
      ))}
    </>
  );
};

export default UploadToBackEnd;
