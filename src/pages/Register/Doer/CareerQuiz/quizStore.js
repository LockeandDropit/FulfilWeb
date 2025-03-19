import { create } from "zustand";


export const useQuizStore = create((set) => ({

  currentPay: null,
  payGoal: null,
  city: null,
  state: null,
  talents: [],
  workEnvironment: null,
  passion: [],
  personalValues: [],
  personality: null,
  learningAndDevelopment: null,
  longTerm: [],
  isLoading: true,
  allCareerPathOptions: [],
  chosenCareerPath: null,
  quizCompleted: false,


  setTalents: (talents) => set({ talents: talents }),
  setWorkEnvironment: (workEnvironment) => set({ workEnvironment: workEnvironment }),
  setPassion: (passion) => set({ passion: passion }),
  setPersonalValues: (personalValues) => set({ personalValues: personalValues }),
  setLearningAndDevelopment: (learningAndDevelopment) => set({ learningAndDevelopment: learningAndDevelopment }),
  setLongTerm: (longTerm) => set({ longTerm: longTerm }),
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  setCurrentPay: (currentPay) => set({ currentPay: currentPay }),
  setPayGoal: (payGoal) => set({ payGoal: payGoal }),
  setCity: (city) => set({ city: city }),
  setState: (state) => set({ state: state }),
  setAllCareerPathOptions: ( allCareerPathOptions) => set({  allCareerPathOptions:  allCareerPathOptions }),
  setChosenCareerPath: (chosenCareerPath) => set({chosenCareerPath: chosenCareerPath }),
  setQuizCompleted: (quizCompleted) => set({ quizCompleted: quizCompleted }),
}));
