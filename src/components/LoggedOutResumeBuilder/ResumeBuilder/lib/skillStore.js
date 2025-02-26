import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";

export const useSkillStore = create((set) => ({
  allSkills: [],
  skillName: null,
  id: null,
  isLoading: true,

  setAllSkills: (allSkills) => set({ allSkills: allSkills }),
  setSkillName: (skillName) => set({ skillName: skillName }),
  setId: (id) => set({ id: id }),


  


}));
