import { create } from "zustand";

export const useJobRecommendationStore = create((set) => ({
    recommendedJobs: null, 
    setRecommendedJobs: (passedJobs) => set({recommendedJobs: passedJobs})
}))