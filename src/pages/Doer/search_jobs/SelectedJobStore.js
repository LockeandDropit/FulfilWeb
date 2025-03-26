import { create } from "zustand";

export const useSelectedJobStore = create((set) => ({
    selectedJob: null, 
    setSelectedJob: (selectedJob) => set({selectedJob: selectedJob})
}))