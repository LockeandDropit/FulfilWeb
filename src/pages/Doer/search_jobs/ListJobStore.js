import { create } from "zustand";

export const useListJobStore = create((set) => ({
    listJob: null, 
    setListJob: (listJob) => set({listJob: listJob})
}))