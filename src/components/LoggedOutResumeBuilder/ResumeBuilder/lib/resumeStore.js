import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";

export const useResumeStore = create((set) => ({
  fullName: null,
  phoneNumber: null,
  email: null,
  about: null,
  isLoading: true,

  setFullName: (fullName) => set({ fullName: fullName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber: phoneNumber }),
  setEmail: (email) => set({ email: email }),
  setAbout: (about) => set({ about: about }),


  
}));
