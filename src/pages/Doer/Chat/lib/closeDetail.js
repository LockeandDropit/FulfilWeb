import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";

export const useCloseDetail = create((set) => ({
  closeDetail: null,

  setDetailClose: () => {
   set({closeDetail: false})
  },
  setDetailOpen: () => {
    set({closeDetail: true})
   },
}));
