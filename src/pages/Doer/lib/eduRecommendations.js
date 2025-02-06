import { create } from "zustand";

export const useEduRecommendationStore = create((set) => ({
    recommendedEdu: null, 
    setRecommendedEdu: (passedEdu) => set({recommendedEdu: passedEdu})
}))