import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";


const UploadToBackEnd = () => {
  
  
  //call open ai, fetch data for state.

    const [returnedResponse, setReturnedResponse] = useState(
     [  {
      "id": 1,
      "jobTitle": "Warehouse Operations Entry Overview",
      "JobOverview": "The warehouse operations field is a dynamic and integral component of the supply chain, providing a foundation for diverse career paths. This entry overview introduces newcomers to the core functions of warehousing—including material handling, inventory control, safety compliance, and equipment operation—while outlining the fundamental skills and training necessary to progress in the trade.",
      "KeyResponsibilities": [
        "Gain a comprehensive understanding of warehouse functions including order processing, inventory storage, and distribution.",
        "Learn and apply basic inventory management techniques such as stock rotation, cycle counts, and data entry using warehouse management systems.",
        "Operate essential warehouse equipment under close supervision, ensuring adherence to established safety protocols.",
        "Develop a basic understanding of workplace safety standards and emergency procedures."
      ],
      "Qualifications": [
        "High school diploma or equivalent with an emphasis on math and communication skills.",
        "Basic understanding of physical work environments and willingness to learn through on-the-job training.",
        "Commitment to following safety guidelines and protocols.",
        "Ability to work in a physically demanding environment and adapt to new operational processes."
      ]
    },
    {
      "id": 2,
      "jobTitle": "Warehouse Associate",
      "JobOverview": "Warehouse Associates are the backbone of daily warehouse operations. They manage the intake and organization of shipments, ensure that products are correctly stocked, and assist with order fulfillment. Their role is critical to maintaining the flow of inventory and ensuring that safety and quality standards are consistently met.",
      "KeyResponsibilities": [
        "Efficiently receive, inspect, and document incoming shipments while verifying quality and accuracy.",
        "Stock shelves and systematically organize inventory to facilitate efficient retrieval.",
        "Assist with order picking, packing, and shipping processes using handheld scanners and warehouse management systems.",
        "Maintain a clean, organized work area by adhering to safety and operational standards."
      ],
      "Qualifications": [
        "High school diploma or equivalent; previous warehouse or manual labor experience is beneficial.",
        "Basic understanding of warehouse processes and inventory management systems.",
        "Good communication skills and strong attention to detail.",
        "Physical stamina and ability to operate basic warehouse equipment safely."
      ]
    },
    {
      "id": 3,
      "jobTitle": "Forklift Operator",
      "JobOverview": "Forklift Operators are responsible for the safe and efficient movement of heavy materials throughout the warehouse. Their expertise in operating forklifts ensures that materials are transported and stored properly, reducing the risk of damage and injury while maintaining operational flow.",
      "KeyResponsibilities": [
        "Safely operate forklifts to move heavy loads across designated areas within the warehouse.",
        "Conduct routine safety and maintenance checks on equipment to ensure optimal performance.",
        "Coordinate with team members to plan the best routes for moving materials.",
        "Document and report any equipment issues or safety hazards immediately."
      ],
      "Qualifications": [
        "Valid forklift certification along with a high school diploma or equivalent.",
        "Prior experience with heavy machinery is preferred, though training may be provided.",
        "Strong adherence to safety procedures and protocols.",
        "Excellent spatial awareness and coordination skills."
      ]
    },
    {
      "id": 4,
      "jobTitle": "Senior Warehouse Associate",
      "JobOverview": "Senior Warehouse Associates take on advanced operational responsibilities within the warehouse. They lead day-to-day activities, mentor new staff, and ensure that inventory management and order fulfillment processes are executed with high accuracy and efficiency.",
      "KeyResponsibilities": [
        "Supervise daily warehouse activities to ensure timely and accurate processing of orders.",
        "Train and mentor new associates on best practices in inventory handling and safety protocols.",
        "Oversee and perform periodic inventory audits and reconcile discrepancies.",
        "Implement process improvements to optimize workflow and maintain high safety standards."
      ],
      "Qualifications": [
        "2-4 years of hands-on warehouse experience with proven leadership and mentoring skills.",
        "Familiarity with inventory management systems and standard operating procedures.",
        "Strong organizational skills and the ability to handle multiple tasks simultaneously.",
        "Ability to maintain high accuracy in a fast-paced work environment."
      ]
    },
    {
      "id": 5,
      "jobTitle": "Inventory Control Specialist",
      "JobOverview": "Inventory Control Specialists ensure the accuracy and integrity of inventory records by conducting systematic audits and reconciling discrepancies. Their analytical approach and proficiency with warehouse management systems support efficient procurement and distribution processes.",
      "KeyResponsibilities": [
        "Perform regular inventory audits and reconcile stock levels using advanced management systems.",
        "Maintain detailed and accurate records to support operational efficiency.",
        "Collaborate with purchasing and sales teams to forecast inventory needs.",
        "Develop strategies to reduce shrinkage and improve overall inventory accuracy."
      ],
      "Qualifications": [
        "2-4 years of experience in warehouse or inventory management roles.",
        "Proficiency in using inventory management software and data analysis tools.",
        "Strong analytical skills and attention to detail.",
        "Ability to communicate effectively with cross-functional teams."
      ]
    },
    {
      "id": 6,
      "jobTitle": "Forklift Supervisor",
      "JobOverview": "Forklift Supervisors manage teams of forklift operators to ensure that material handling tasks are executed safely and efficiently. They are responsible for scheduling, conducting training sessions, and enforcing maintenance and safety protocols across the team.",
      "KeyResponsibilities": [
        "Oversee and schedule forklift operators to optimize material handling operations.",
        "Conduct regular training sessions and performance evaluations focused on safety and operational efficiency.",
        "Coordinate maintenance schedules and ensure timely repairs for all forklift equipment.",
        "Monitor daily operations and enforce adherence to all safety guidelines and protocols."
      ],
      "Qualifications": [
        "3-5 years of forklift operation experience with demonstrated leadership abilities.",
        "Current forklift certification and comprehensive knowledge of safety regulations.",
        "Strong communication skills and the ability to manage a team effectively.",
        "Experience with scheduling, training, and equipment maintenance coordination."
      ]
    },
    {
      "id": 7,
      "jobTitle": "Lead Forklift Operator",
      "JobOverview": "Lead Forklift Operators combine expert equipment handling with team leadership. They ensure that daily forklift operations run smoothly by coordinating activities, monitoring equipment performance, and serving as a critical link between frontline operators and management.",
      "KeyResponsibilities": [
        "Direct the daily operations of forklift teams to ensure efficient material movement.",
        "Closely monitor equipment performance and oversee routine safety inspections.",
        "Collaborate with management to identify and implement process improvements.",
        "Maintain detailed logs and records of operational activities, supporting training initiatives."
      ],
      "Qualifications": [
        "3-5 years of hands-on forklift operation experience with proven leadership skills.",
        "Strong understanding of warehouse logistics and safety procedures.",
        "Excellent problem-solving abilities and the capability to work under pressure.",
        "Effective communication skills and a proactive approach to team management."
      ]
    },
    {
      "id": 8,
      "jobTitle": "Warehouse Manager",
      "JobOverview": "Warehouse Managers oversee the comprehensive operations of a warehouse facility, managing logistics, inventory control, staffing, and safety compliance. They develop strategic initiatives to improve efficiency, reduce costs, and ensure that operations meet both regulatory and company standards.",
      "KeyResponsibilities": [
        "Supervise all aspects of daily warehouse operations, including order fulfillment and logistics coordination.",
        "Develop and implement strategic initiatives to optimize operational efficiency and reduce costs.",
        "Manage staffing, including recruitment, scheduling, and performance evaluations.",
        "Ensure strict adherence to safety regulations and implement proactive risk management measures."
      ],
      "Qualifications": [
        "5-7 years of experience in warehouse management or related operational roles.",
        "Strong leadership skills and a track record of effective team management.",
        "Experience with inventory, logistics software, and budget management.",
        "Excellent organizational and strategic planning abilities with a focus on continuous improvement."
      ]
    },
    {
      "id": 9,
      "jobTitle": "Logistics Coordinator",
      "JobOverview": "Logistics Coordinators are key to ensuring the smooth distribution of goods both within and outside the warehouse. They plan and coordinate shipments, work closely with transportation providers, and analyze data to optimize logistics and supply chain efficiency.",
      "KeyResponsibilities": [
        "Plan and schedule shipments to guarantee timely delivery and efficient resource allocation.",
        "Coordinate with transportation providers and internal departments to optimize routing and distribution.",
        "Monitor and manage inventory distribution to ensure alignment with order fulfillment standards.",
        "Analyze logistics data to identify inefficiencies and propose actionable improvements."
      ],
      "Qualifications": [
        "4-6 years of experience in logistics or warehouse operations with a focus on coordination.",
        "Proficiency in logistics software and data analysis tools.",
        "Strong analytical skills and the ability to develop actionable insights from operational data.",
        "Excellent communication and collaboration skills to work with multiple stakeholders."
      ]
    },
    {
      "id": 10,
      "jobTitle": "Operations Manager",
      "JobOverview": "Operations Managers are responsible for the overall performance of warehouse operations, including strategic planning, team management, and budget oversight. They drive continuous improvement initiatives and ensure that the facility operates at peak efficiency while meeting all quality and safety standards.",
      "KeyResponsibilities": [
        "Develop and implement comprehensive strategic plans to drive operational efficiency.",
        "Oversee multiple teams and coordinate cross-departmental activities within the warehouse.",
        "Monitor key performance indicators (KPIs) and implement continuous improvement processes.",
        "Manage budgets, vendor relationships, and resource allocation to ensure cost-effective operations."
      ],
      "Qualifications": [
        "6-8 years of experience in warehouse and logistics operations with proven leadership skills.",
        "Strong analytical and problem-solving skills with a focus on strategic planning.",
        "Experience in budget management, process optimization, and cross-functional team leadership.",
        "Excellent communication skills and the ability to manage complex operational challenges."
      ]
    },
    {
      "id": 11,
      "jobTitle": "Warehouse Operations Entrepreneur",
      "JobOverview": "Warehouse Operations Entrepreneurs leverage extensive industry expertise to launch and grow their own warehouse businesses. They are responsible for business planning, operational oversight, and implementing innovative strategies that drive efficiency, profitability, and market expansion.",
      "KeyResponsibilities": [
        "Develop comprehensive business plans, secure financing, and establish operational frameworks for new ventures.",
        "Oversee all aspects of warehouse operations including procurement, logistics, staffing, and customer service.",
        "Implement innovative technologies and strategies to improve efficiency and reduce operational costs.",
        "Cultivate strong client relationships and identify new market opportunities to drive business growth."
      ],
      "Qualifications": [
        "8+ years of industry experience with a deep understanding of warehouse operations and market dynamics.",
        "Strong entrepreneurial mindset coupled with advanced skills in business management and strategic planning.",
        "Demonstrated ability to manage risk, innovate, and drive continuous improvement in operations.",
        "Excellent leadership, communication, and financial management skills."
      ]
    }]
);


  //return data

  //on return, upload to firebase.

    const uploadCareerPathNodes = async () => {
      await updateDoc(doc(db, "Career Paths", 'warehouse operations'), {
        nodes: returnedResponse,
      });
    };

    const uploadCareerPathDrawers = async () => {
      await updateDoc(doc(db, "Career Paths", 'warehouse operations'), {
        drawers: returnedResponse,
      });
    };

    const uploadCareerPathMisc = async () => {
      await updateDoc(doc(db, "Career Paths", 'warehouse operations'), {
        misc: returnedResponse,
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

    <button className=" white text-black border ml-4" onClick={() => uploadCareerPathDrawers()} > upload drawers </button>
    <button className=" white text-black border ml-4" onClick={() => uploadCareerPathMisc()} > upload misc </button>

    
    {resources?.map((resource) => (
        <p>{resource.name}</p>
    ))}
    </>
  )
}

export default UploadToBackEnd