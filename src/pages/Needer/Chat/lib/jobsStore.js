import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { useUserStore } from "./userStore";


export const useJobStore = create((set) => ({
 job: null,
jobHiringState: null,
  setJobHiringState: (jobState) => {
    set({jobHiringState: jobState})
  },
  fetchJobInfo: async (uid, jobID, jobType, jobTitle) => {
    // if (!uid) return set({ currentUser: null, isLoading: false });

    console.log("hiiting",uid, jobID, jobType, jobTitle )
    if (jobType === "Interview") {
        try {
            const docRef = doc(db, "employers", uid, "Posted Jobs", jobTitle );
            const docSnap = await getDoc(docRef);
      //add code to check that jobID === JobID
            if (docSnap.exists() && docSnap.data().jobID === jobID) {
              set({ job: docSnap.data() });
              console.log("got it interview")
      
            } else {
              set({job: null });
            }
          } catch (err) {
            console.log(err);
            return set({ job: null});
          }
    } else {
      try {
        const docRef = doc(db, "employers", uid, jobType, jobTitle );
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists() && docSnap.data().jobID === jobID) {
          set({ job: docSnap.data() });
          console.log("got it all others")
        } else {
          set({job: null });
        }
      } catch (err) {
        console.log(err);
        return set({ job: null});
      }
    }

   
  },
}));
