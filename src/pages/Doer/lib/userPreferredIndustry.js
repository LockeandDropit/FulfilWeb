import { create } from "zustand";

export const usePreferredIndustryStore = create((set) => ({
    preferredIndustry: null, 
    setPreferredIndustry: (passedPreferredIndustry) => set({preferredIndustry: passedPreferredIndustry})
})) 