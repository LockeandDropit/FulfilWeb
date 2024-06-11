import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { persist, createJSONStorage } from 'zustand/middleware'
//add this later https://docs.pmnd.rs/zustand/integrations/persisting-store-data

export const addJobStore = create(
  persist(
    (set) => ({
 jobHeld: null,

  addJobInfo: async (jobData) => {
        try {
          set({ jobHeld: jobData });
          } catch (err) {
            console.log(err);
          }
   console.log("this job is held", jobData)
  },
}),
{
  name: 'held-job', // name of the item in the storage (must be unique)
  storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
},
),
);














//hold for adding

// companyName: companyName,
// isSalaried :  isSalaried,
// applicantDescription: applicantDescription,
// benefitsDescription : benefitsDescription ? benefitsDescription : null,
// isFullTimePosition : isFullTimePosition,
// employerID: employerID,
// employerEmail: user.email,
// employerFirstName: employerFirstName,
// employerLastName: employerLastName,
// employerProfilePicture: employerProfilePicture,
// jobTitle: jobTitle,
// jobID: jobID,
// firstName: firstName,
// lowerRate: lowerRate,
// upperRate: upperRate,
// isVolunteer: isVolunteer,
// isOneTime: isOneTime,
// isSalaried: isSalaried,
// flatRate: flatRate,
// isHourly: isHourly,
// lowerCaseJobTitle: lowerCaseJobTitle,
// datePosted: datePosted,
// category: jobCategory,
// city: city,
// streetAddress: streetAddress,
// state: state,
// zipCode: zipCode,
// locationLat: locationLat,
// locationLng: locationLng,
// description: description,
// requirements: requirements,
// requirements2: requirements2,
// requirements3: requirements3,
// niceToHave: niceToHave,