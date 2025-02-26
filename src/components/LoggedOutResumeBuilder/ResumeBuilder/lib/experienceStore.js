import { create } from "zustand";

export const useExperienceStore = create((set) => ({
  allExperiences: [],
  companyName: null,
  positionTitle: null,
  description: null,
  userBaseDescription: null,
  startDate: null,
  displayStartDate: null,
  endDate: null,
  displayEndDate: null,
  isEmployed: null,
  id: null,
  isLoading: true,

  setAllExperiences: (allExperiences) => set({ allExperiences: allExperiences }),
  setCompanyName: (companyName) => set({ companyName: companyName }),
  setPositionTitle: (positionTitle) => set({ positionTitle: positionTitle }),
  setDescription: (description) => set({ description: description }),
  setUserBaseDescription: (userBaseDescription) => set({userBaseDescription: userBaseDescription }),
  setStartDate: (startDate) => set({ startDate: startDate }),
  setDisplayStartDate: (displayStartDate) => set({ displayStartDate: displayStartDate }),
  setEndDate: (endDate) => set({ endDate: endDate }),
  setDisplayEndDate: (displayEndDate) => set({ displayEndDate: displayEndDate }),
  setIsEmployed: ( isEmployed) => set({ isEmployed:  isEmployed }),
  setId: ( id) => set({ id:  id }),
}));
