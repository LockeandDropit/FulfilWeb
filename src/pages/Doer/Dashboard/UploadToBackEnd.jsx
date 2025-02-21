import { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";


const UploadToBackEnd = () => {
  
  
  //call open ai, fetch data for state.

    const [returnedResponse, setReturnedResponse] = useState(
      [
        {
          "name": "Climb Wyoming",
          "focus": "Job training and career placement for single mothers",
          "services": [
            "Free job training programs",
            "Career placement assistance",
            "Life skills development",
            "Support services for single mothers"
          ],
          "website": "https://climbwyoming.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Climb Wyoming offers free job training and career placement services to single mothers, focusing on life skills development and providing support to help them achieve economic independence."
        },
        {
          "name": "Wyoming 211",
          "focus": "Connecting individuals to health and human services",
          "services": [
            "Resource referrals",
            "Information on health and human services",
            "Assistance with accessing community resources"
          ],
          "website": "https://wyoming211.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming 211 connects individuals to health and human services, offering resource referrals and assistance with accessing community resources to support various needs."
        },
        {
          "name": "Wyoming Nonprofit Network",
          "focus": "Supporting and strengthening Wyoming's nonprofit sector",
          "services": [
            "Training and events",
            "Resources for nonprofits",
            "Networking opportunities",
            "Advocacy for nonprofit organizations"
          ],
          "website": "https://www.wynonprofit.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming Nonprofit Network supports and strengthens Wyoming's nonprofit sector by providing training, resources, networking opportunities, and advocacy for nonprofit organizations."
        },
        {
          "name": "Western Wyoming Community College - Green River",
          "focus": "Nonprofit management education",
          "services": [
            "Online nonprofit management courses",
            "Financial assistance for students",
            "Career development resources"
          ],
          "website": "https://careertraining.westernwyoming.edu/training-programs/nonprofit-manager/",
          "state": "Wyoming",
          "city": "Green River",
          "description": "Western Wyoming Community College offers online nonprofit management courses, financial assistance for students, and career development resources to prepare individuals for leadership roles in the nonprofit sector."
        },
        {
          "name": "Wyoming Small Business Development Center Network",
          "focus": "Assisting small businesses with growth and development",
          "services": [
            "Business consulting",
            "Training programs",
            "Financial planning assistance",
            "Market research"
          ],
          "website": "https://www.wyomingsbdc.org/",
          "state": "Wyoming",
          "city": "Laramie",
          "description": "The Wyoming Small Business Development Center Network assists small businesses with growth and development by providing business consulting, training programs, financial planning assistance, and market research."
        },
        {
          "name": "Wyoming Protection & Advocacy System, Inc.",
          "focus": "Protecting the rights of individuals with disabilities",
          "services": [
            "Legal representation",
            "Advocacy services",
            "Information and referral services"
          ],
          "website": "https://www.wyomingdisability.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming Protection & Advocacy System, Inc. protects the rights of individuals with disabilities by offering legal representation, advocacy services, and information and referral services."
        },
        {
          "name": "Wyoming Department of Family Services",
          "focus": "Providing assistance to families in need",
          "services": [
            "Financial assistance programs",
            "Child care assistance",
            "Employment and training services"
          ],
          "website": "https://dfs.wyo.gov/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Department of Family Services provides assistance to families in need through financial assistance programs, child care assistance, and employment and training services."
        },
        {
          "name": "Wyoming Food Bank of the Rockies",
          "focus": "Alleviating hunger in Wyoming",
          "services": [
            "Food distribution",
            "Nutrition education",
            "Community partnerships"
          ],
          "website": "https://www.wyomingfoodbank.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Food Bank of the Rockies alleviates hunger by distributing food, providing nutrition education, and fostering community partnerships to support those in need."
        },
        {
          "name": "Wyoming Aging and Disability Resource Center (ADRC)",
          "focus": "Providing information and assistance to older adults and individuals with disabilities",
          "services": [
            "Information and referral services",
            "Assistance with accessing benefits",
            "Caregiver support"
          ],
          "website": "https://www.wyomingadrc.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Aging and Disability Resource Center provides information and assistance to older adults and individuals with disabilities, including referral services, help with accessing benefits, and caregiver support."
        },
        {
          "name": "Wyoming Department of Workforce Services",
          "focus": "Assisting individuals with employment and training",
          "services": [
            "Job search assistance",
            "Training programs",
            "Unemployment benefits"
          ],
          "website": "https://www.wyomingworkforce.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Department of Workforce Services assists individuals with employment and training by offering job search assistance, training programs, and unemployment benefits."
        },

        {
          "name": "Wyoming Food Bank of the Rockies",
          "focus": "Alleviating hunger and promoting nutrition",
          "services": [
            "Food distribution programs",
            "Nutrition education",
            "Community partnerships"
          ],
          "website": "https://www.wyomingfoodbank.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Food Bank of the Rockies works to alleviate hunger by distributing food, providing nutrition education, and fostering community partnerships to support those in need."
        },
        {
          "name": "Wyoming Aging and Disability Resource Center (ADRC)",
          "focus": "Providing information and assistance to older adults and individuals with disabilities",
          "services": [
            "Information and referral services",
            "Assistance with accessing benefits",
            "Caregiver support"
          ],
          "website": "https://www.wyomingadrc.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Aging and Disability Resource Center offers information and assistance to older adults and individuals with disabilities, including referral services, help with accessing benefits, and caregiver support."
        },
        {
          "name": "Wyoming Department of Workforce Services",
          "focus": "Assisting individuals with employment and training",
          "services": [
            "Job search assistance",
            "Training programs",
            "Unemployment benefits"
          ],
          "website": "https://www.wyomingworkforce.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Department of Workforce Services assists individuals with employment and training by offering job search assistance, training programs, and unemployment benefits."
        },
        {
          "name": "Wyoming 211",
          "focus": "Connecting individuals to health and human services",
          "services": [
            "Resource referrals",
            "Information on health and human services",
            "Assistance with accessing community resources"
          ],
          "website": "https://wyoming211.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming 211 connects individuals to health and human services, offering resource referrals and assistance with accessing community resources to support various needs."
        },
        {
          "name": "Wyoming Nonprofit Network",
          "focus": "Supporting and strengthening Wyoming's nonprofit sector",
          "services": [
            "Training and events",
            "Resources for nonprofits",
            "Networking opportunities",
            "Advocacy for nonprofit organizations"
          ],
          "website": "https://www.wynonprofit.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming Nonprofit Network supports and strengthens Wyoming's nonprofit sector by providing training, resources, networking opportunities, and advocacy for nonprofit organizations."
        },
        {
          "name": "Western Wyoming Community College - Green River",
          "focus": "Nonprofit management education",
          "services": [
            "Online nonprofit management courses",
            "Financial assistance for students",
            "Career development resources"
          ],
          "website": "https://careertraining.westernwyoming.edu/training-programs/nonprofit-manager/",
          "state": "Wyoming",
          "city": "Green River",
          "description": "Western Wyoming Community College offers online nonprofit management courses, financial assistance for students, and career development resources to prepare individuals for leadership roles in the nonprofit sector."
        },
        {
          "name": "Wyoming Protection & Advocacy System, Inc.",
          "focus": "Protecting the rights of individuals with disabilities",
          "services": [
            "Legal representation",
            "Advocacy services",
            "Information and referral services"
          ],
          "website": "https://www.wyomingdisability.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "Wyoming Protection & Advocacy System, Inc. protects the rights of individuals with disabilities by offering legal representation, advocacy services, and information and referral services."
        },
        {
          "name": "Wyoming Department of Family Services",
          "focus": "Providing assistance to families in need",
          "services": [
            "Financial assistance programs",
            "Child care assistance",
            "Employment and training services"
          ],
          "website": "https://dfs.wyo.gov/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Department of Family Services provides assistance to families in need through financial assistance programs, child care assistance, and employment and training services."
        },
        {
          "name": "Wyoming Aging and Disability Resource Center (ADRC)",
          "focus": "Providing information and assistance to older adults and individuals with disabilities",
          "services": [
            "Information and referral services",
            "Assistance with accessing benefits",
            "Caregiver support"
          ],
          "website": "https://www.wyomingadrc.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Aging and Disability Resource Center offers information and assistance to older adults and individuals with disabilities, including referral services, help with accessing benefits, and caregiver support."
        },
        {
          "name": "Wyoming Department of Workforce Services",
          "focus": "Assisting individuals with employment and training",
          "services": [
            "Job search assistance",
            "Training programs",
            "Unemployment benefits"
          ],
          "website": "https://www.wyomingworkforce.org/",
          "state": "Wyoming",
          "city": "Cheyenne",
          "description": "The Wyoming Department of Workforce Services assists individuals with employment and training by offering job search assistance, training programs, and unemployment benefits."
        }

      ]
      
  
      );


  //return data

  //on return, upload to firebase.

    const uploadJobs = async () => {
      await updateDoc(doc(db, "ResourcesByState", 'wyoming'), {
        resources: returnedResponse,
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
    <button onClick={() => uploadJobs()} > upload </button>
    <button onClick={() => testRender()} > render </button>
    
    {resources?.map((resource) => (
        <p>{resource.name}</p>
    ))}
    </>
  )
}

export default UploadToBackEnd