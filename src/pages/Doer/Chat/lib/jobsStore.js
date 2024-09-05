import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { useUserStore } from "./userStore";


export const useJobStore = create((set) => ({
 job: null,
 isJobLoading: true,
jobHiringState: null,
  setJobHiringState: (jobState) => {
    set({jobHiringState: jobState})
  },
  fetchJobInfo: async (uid, jobID, jobType, jobTitle) => {
    // if (!uid) return set({ currentUser: null, isLoading: false });


    //what I should do is map over the collection of Applied, extract the jobID from each, then match those with the MapJobs and pull the data from there.

    let jobIds = []

      const docRef = doc(db, "users", uid, "Applied", jobTitle );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().jobID === jobID) {
        jobIds.push(docSnap.data().jobID)
      } else {
      }

      //now grab from Map Jobs

      const docRefGolbal = doc(db, "Map Jobs", jobID );
      const docSnap2 = await getDoc(docRefGolbal);

      if (docSnap2.exists() && docSnap2.data().jobID === jobID) {
        set({ job: docSnap2.data(), isJobLoading: false });
        console.log("jobstore beep beep", docSnap2.data())
      } else {
      }

    if (jobType === "Interview") {
      //   try {
      //       const docRef = doc(db, "users", uid, "Applied", jobTitle );
      //       const docSnap = await getDoc(docRef);
      // //add code to check that jobID === JobID
      //       if (docSnap.exists() && docSnap.data().jobID === jobID) {
      //         set({ job: docSnap.data(), isJobLoading: false });
      //         console.log("jobstore",docSnap.data())
      //       } else {
      //         set({job: null, isJobLoading: false });
      //       }
      //     } catch (err) {
      //       console.log(err);
      //       return set({ job: null, isJobLoading: false});
      //     }
    } else {
      // try {
      //   const docRef = doc(db, "users", uid, jobType, jobTitle );
      //   const docSnap = await getDoc(docRef);
  
      //   if (docSnap.exists() && docSnap.data().jobID === jobID) {
      //     set({ job: docSnap.data(), isJobLoading: false });
      //     console.log("jobstore",docSnap.data())
      //   } else {
      //     set({job: null, isJobLoading: false });
      //   }
      // } catch (err) {
      //   console.log(err);
      //   // return set({ job: null, isJobLoading: false});
      // }
    }

   
  },
}));




/// ensure the data you just collected is good, console.log it o check then put it in it's respective areas.