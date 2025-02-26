import { create } from "zustand";

export const useEducationStore = create((set) => ({
  allEducation: [],
  degree: null,
  institutionName: null,
  startDate: null,
  displayStartDate: null,
  endDate: null,
  displayEndDate: null,
  isEnrolled: null,
  id: null,
  isLoading: true,

  setAllEducation: (allEducation) => set({ allEducation: allEducation }),
  setInstitutionName: (institutionName) => set({ institutionName: institutionName }),
  setDegree: (degree) => set({ degree: degree }),
  setStartDate: (startDate) => set({ startDate: startDate }),
  setDisplayStartDate: (displayStartDate) => set({ displayStartDate: displayStartDate }),
  setEndDate: (endDate) => set({ endDate: endDate }),
  setDisplayEndDate: (displayEndDate) => set({ displayEndDate: displayEndDate }),
  setIsEnrolled: ( isEnrolled) => set({ isEnrolled:  isEnrolled }),
  setId: ( id) => set({ id:  id }),
}));
