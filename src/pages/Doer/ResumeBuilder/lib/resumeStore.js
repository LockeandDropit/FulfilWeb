import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";

export const useResumeStore = create((set) => ({
  currentResumeName: null,
  isLoading: true,

  setNewResumeName: async (resumeName) => {
    if (!resumeName) {
      return set({ currentResumeName: null });
    } else {
      return set({ currentResumeName: resumeName });
    }
  },
}));
