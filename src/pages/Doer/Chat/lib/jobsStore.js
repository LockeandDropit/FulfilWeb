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

    if (jobType === "Interview") {
        try {
            const docRef = doc(db, "users", uid, "Applied", jobTitle );
            const docSnap = await getDoc(docRef);
      //add code to check that jobID === JobID
            if (docSnap.exists() && docSnap.data().jobID === jobID) {
              set({ job: docSnap.data() });
              console.log("jobstore",docSnap.data())
            } else {
              set({job: null });
            }
          } catch (err) {
            console.log(err);
            return set({ job: null});
          }
    } else {
      try {
        const docRef = doc(db, "users", uid, jobType, jobTitle );
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists() && docSnap.data().jobID === jobID) {
          set({ job: docSnap.data() });
          console.log("jobstore",docSnap.data())
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




/// ensure the data you just collected is good, console.log it o check then put it in it's respective areas.