import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { useUserStore } from "./userStore";


export const useSavedJobStore = create((set) => ({
 job: null,
 isJobLoading: true,
jobHiringState: null,
  setJobHiringState: (jobState) => {
    set({jobHiringState: jobState})
  },
  fetchJobInfo: async (uid, jobID, jobType, jobTitle) => {
    // if (!uid) return set({ currentUser: null, isLoading: false });

    console.log("from saved job store", uid, jobID, jobType, jobTitle)

    if (jobType === "Interview") {
        try {
            const docRef = doc(db, "users", uid, "Applied", jobTitle );
            const docSnap = await getDoc(docRef);
      //add code to check that jobID === JobID
            if (docSnap.exists() && docSnap.data().jobID === jobID) {
              set({ job: docSnap.data(), isJobLoading: false });
              console.log("saved jobstore",docSnap.data())
            } else {
              set({job: null, isJobLoading: false });
            }
          } catch (err) {
            console.log(err);
            return set({ job: null, isJobLoading: false});
          }
    } else if (jobType === "Saved Jobs") {
        try {
            const docRef = doc(db, "users", uid, "Saved Jobs", jobID );
            const docSnap = await getDoc(docRef);
      //add code to check that jobID === JobID
            if (docSnap.exists() && docSnap.data().jobID === jobID) {
              set({ job: docSnap.data(), isJobLoading: false });
              console.log("saved jobstore",docSnap.data())
            } else {
              set({job: null, isJobLoading: false });
            }
          } catch (err) {
            console.log(err);
            return set({ job: null, isJobLoading: false});
          }
    } else {
      try {
        const docRef = doc(db, "users", uid, jobType, jobTitle );
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists() && docSnap.data().jobID === jobID) {
          set({ job: docSnap.data(), isJobLoading: false });
          console.log("jobstore",docSnap.data())
        } else {
          set({job: null, isJobLoading: false });
        }
      } catch (err) {
        console.log(err);
        return set({ job: null, isJobLoading: false});
      }
    }

   
  },
}));
