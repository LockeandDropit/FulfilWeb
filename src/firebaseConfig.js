// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, initializeAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//help from https://www.youtube.com/watch?v=2yNyiW_41H8&t=1s

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  // authDomain: "jobit-10e3b.firebaseapp.com",
  authDomain: "getfulfil.com",
  projectId: "jobit-10e3b",
  storageBucket: "jobit-10e3b.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Must be called before getFirestore() hhelp Odbol https://github.com/googleapis/nodejs-firestore/issues/1031

export const analytics = getAnalytics(app)

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app)

//logout user

export function logout() {
  return signOut(auth);
}
