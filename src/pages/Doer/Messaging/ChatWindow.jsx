import React, { useState, useEffect, useCallback } from "react";
import Header from '../components/Header'
import Dashboard from '../components/Dashboard'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig"
import {
    doc,
    getDoc,
    query,
    collection,
    onSnapshot,
    updateDoc,
    addDoc,
    deleteDoc,
    setDoc,
    col,
  } from "firebase/firestore";

  import { useMediaQuery } from "@chakra-ui/react";

const ChatWindow = () => {
  const [user, setUser] = useState();
  const [hasRun, setHasRun] = useState(false);
  const [isDesktop] = useMediaQuery("(min-width: 500px)");


  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      setHasRun(true);
    } else {
    }
  }, []);

    // import user
    //get all of user mesasges
    //list those items on left hand side in column, filterable by type of job via drop down select
    // on click render that message to the main screen
    //



    //credit https://github.com/safak/react-firebase-chat/blob/completed/src/components/chat/Chat.jsx
  return (
<>
    <Header />
    <Dashboard />

   
    {/* <!-- Content --> */}
<div class="h-full w-full">
  <div class="max-w-4xl h-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto overflow-y-scroll">
    {/* <!-- Title --> */}
    <div class="text-center">
      

      <h1 class="text-3xl font-bold text-gray-800 sm:text-4xl">
        Welcome to Preline AI
      </h1>
      <p class="mt-3 text-gray-600">
        Your AI-powered copilot for the web
      </p>
    </div>
    {/* <!-- End Title --> */}

    <ul class="mt-16 space-y-5">
      {/* <!-- Chat Bubble --> */}

      <li class="max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
        <svg class="flex-shrink-0 w-[2.375rem] h-[2.375rem] rounded-full" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" rx="6" fill="#2563EB"/>
          <path d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25" stroke="white" stroke-width="1.5"/>
          <path d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25" stroke="white" stroke-width="1.5"/>
          <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"/>
        </svg>

        <div class="space-y-1 inline-block bg-blue-100 rounded-lg p-4 shadow-sm">
        
       
            <p class=" text-sm text-gray-800">
              You can ask questions like:
            </p>
        
          
        </div>
      </li>

      <li class="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
        <div class="grow text-end space-y-3">
          {/* <!-- Card --> */}
          <div class="inline-block bg-blue-600 rounded-lg p-4 shadow-sm">
            <p class="text-sm text-white">
              what's preline ui?
            </p>
          </div>
          {/* <!-- End Card --> */}
        </div>

        <span class="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
          <span class="text-sm font-medium text-white leading-none">AZ</span>
        </span>
      </li>
      </ul>
      {/* <!-- End Chat Bubble -->

   
  {/* <!-- Search --> */}
 
  {/* <!-- End Search --> */}
</div>
<footer class="max-w-4xl mx-auto sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-4 sm:pt-4 sm:pb-6 px-4 sm:px-6 lg:px-0">
    <div class="flex justify-between items-center mb-3">
      <button type="button" class="inline-flex justify-center items-center gap-x-2 rounded-lg font-medium text-gray-800 hover:text-blue-600 text-xs sm:text-sm">
        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        New chat
      </button>

      <button type="button" class="py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 text-xs">
        <svg class="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
        </svg>
        Stop generating
      </button>
    </div>

    {/* <!-- Input --> */}
    <div class="relative">
      <textarea class="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Ask me anything..."></textarea>

      {/* <!-- Toolbar --> */}
      <div class="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white">
        <div class="flex justify-between items-center">
          {/* <!-- Button Group --> */}
          <div class="flex items-center">
            {/* <!-- Mic Button --> */}
            <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="9" x2="15" y1="15" y2="9"/></svg>
            </button>
            {/* <!-- End Mic Button -->

            <!-- Attach Button --> */}
            <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            {/* <!-- End Attach Button --> */}
          </div>
          {/* <!-- End Button Group -->

          <!-- Button Group --> */}
          <div class="flex items-center gap-x-1">
            {/* <!-- Mic Button --> */}
            <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
            {/* <!-- End Mic Button --> */}

            {/* <!-- Send Button --> */}
            <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
              </svg>
            </button>
            {/* <!-- End Send Button --> */}
          </div>
          {/* <!-- End Button Group --> */}
        </div>
      </div>
      {/* <!-- End Toolbar --> */}
    </div>
    {/* <!-- End Input --> */}
  </footer>
</div>
{/* <!-- End Content --> */}
    </>
  )
}

export default ChatWindow