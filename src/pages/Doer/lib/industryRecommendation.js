import { create } from "zustand";

export const useIndustryRecommendationStore = create((set) => ({
    recommendedIndustry: null, 
    setRecommendedIndustry: (passedIndustryRec) => set({recommendedIndustry: passedIndustryRec})
}))