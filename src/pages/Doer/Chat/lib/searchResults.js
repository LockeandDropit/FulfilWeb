import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../../../../firebaseConfig";
import { useUserStore } from "./userStore";


export const useSearchResults = create((set) => ({
 searchResults: null,
 searchIsMobile: false,
 isSearchLoading: true,
 setSearchIsMobile: () => {set({searchIsMobile: false})},
  setSearchResults: (results) => {
    set({searchResults: results, isSearchLoading: false, searchIsMobile: true})
    
    console.log("results from store", results)
  },

}));




/// ensure the data you just collected is good, console.log it o check then put it in it's respective areas.