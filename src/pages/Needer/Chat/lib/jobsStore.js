import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { persist, createJSONStorage } from "zustand/middleware";
import { useUserStore } from "./userStore";

export const useJobStore = create(
  (set) => ({
  job: null,
  isJobLoading: true,
  jobHiringState: null,
  setJobHiringState: (jobState) => {
    set({ jobHiringState: jobState });
  },
  fetchJobInfo: async (uid, jobID, jobType, jobTitle) => {
    // if (!uid) return set({ currentUser: null, isLoading: false });
    try {
      const docRef = doc(db, "employers", uid, "Posted Jobs", jobTitle);
      const docSnap = await getDoc(docRef);
      //add code to check that jobID === JobID
      if (docSnap.exists() && docSnap.data().jobID === jobID) {
        set({ job: docSnap.data(), isJobLoading: false });
        console.log("got it interview", docSnap.data());
      } else {
        set({ job: null, isJobLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ job: null });
    }
    console.log("hiiting", uid, jobID, jobType, jobTitle);
    if (jobType === "Interview") {
      try {
        const docRef = doc(db, "employers", uid, "Posted Jobs", jobTitle);
        const docSnap = await getDoc(docRef);
        //add code to check that jobID === JobID
        if (docSnap.exists() && docSnap.data().jobID === jobID) {
          set({ job: docSnap.data(), isJobLoading: false });
          console.log("got it interview", docSnap.data());
        } else {
          set({ job: null, isJobLoading: false });
        }
      } catch (err) {
        console.log(err);
        return set({ job: null });
      }
    } else {
    }
  },
}));
