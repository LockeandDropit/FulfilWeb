// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, initializeAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//help from https://www.youtube.com/watch?v=2yNyiW_41H8&t=1s

const firebaseConfig = {
  apiKey: "AIzaSyDiKB58o0T9hq3Ii6qOp3lACZuYqTa5kEk",
  authDomain: "jobit-10e3b.firebaseapp.com",
  projectId: "jobit-10e3b",
  storageBucket: "jobit-10e3b.appspot.com",
  messagingSenderId: "432362513133",
  appId: "1:432362513133:web:306cda30898f192ed262e4",
  measurementId: "G-ZV8L01ZQQV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Must be called before getFirestore() hhelp Odbol https://github.com/googleapis/nodejs-firestore/issues/1031

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app)

//logout user

export function logout() {
  return signOut(auth);
}
