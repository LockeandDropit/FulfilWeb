import React from 'react'
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth, logout, db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";
import { query, collection, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Spinner,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Skeleton,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  VStack,
  Text,
  Box,
  Heading
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";


const Header = () => {
    const [user, setUser] = useState(null);

    const [hasRun, setHasRun] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (hasRun === false) {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          console.log(currentUser.uid);
        });
        setHasRun(true);
      } else {
      }
    }, []);

    const [loggingOut, setLoggingOut] = useState(false); 
    const handleLogOut = async () => {
      setLoggingOut(true);

      await signOut(auth)
        .then(
          setTimeout(() => {
            navigate("/");
          }, 2000)
        ) // undefined
        .catch((e) => console.log(e));
    };

    const [userFirstName, setUserFirstName] = useState("User");
    const [userLastName, setUserLastName] = useState(null)
    const [email, setEmail] = useState(null)

    useEffect(() => {
      if (user != null) {
        const docRef = doc(db, "users", user.uid);
  
        getDoc(docRef).then((snapshot) => {
          // console.log(snapshot.data());
          setUserFirstName(snapshot.data().firstName)
          setUserLastName(snapshot.data().lastName)
          setEmail(snapshot.data().email)
        });
      } else {
        console.log("oops!");
      }
    }, [user]);

    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
      if (user) {
        getProfilePicture();
      } else {
      }
    }, [user]);
  
    const getProfilePicture = async () => {
      getDoc(doc(db, "users", user.uid)).then((snapshot) => {
        if (!snapshot.data().profilePictureResponse) {
        } else {
          setProfilePicture(snapshot.data().profilePictureResponse)
          console.log("profile picture", snapshot.data().profilePictureResponse)
        }
      });
    };

    console.log(profilePicture)

    

  //laoding control

  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const [isLoading, setIsLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(null)

  const [test, setTest] = useState("test")

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((snapshot) => {
     console.log(snapshot.data())
        setIsPremium(snapshot.data().isPremium)
      })
        .then(() => {
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        
        })
        .catch((error) => {
          // no buen
          console.log(error)
        });
    }
  }, [user]);


  useEffect(() => {
    console.log(isLoading, isPremium)
  }, [isLoading, isPremium])



  const [subscriptionID, setSubscriptionID] = useState(null);

  const initializeSubscription = () => {
    //credit and help from https://github.com/pagecow/stripe-subscribe-payments
    fetch("https://fulfil-api.onrender.com/create-subscription-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then(({ session }) => {
        setSubscriptionID(session.id);
        window.open(session.url, "_blank");
      })
      // .then(({ url }) => {
      //   // window.location = url
      //   window.open(url, "_blank")
      // })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (subscriptionID) {
      updateDoc(doc(db, "users", user.uid), {
        subscriptionID: subscriptionID,
      })
        .then(() => {
          //all good
        })
        .catch((error) => {
          // no bueno
        });
    }
  }, [subscriptionID]);



    const { isOpen, onOpen, onClose } = useDisclosure()
 
 const [showDropdown, setShowDropdown] = useState(false)
 
 const { isOpen: isOPenMobileDash, onOpen: onOpenMobileDash, onClose: onCloseMobileDash } = useDisclosure()
        

  return (
    <>
    <header class="lg:ms-[260px] fixed top-0 inset-x-0  flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white">
    <div class="flex justify-between xl:grid xl:grid-cols-3 basis-full items-center w-full py-2.5 px-2 sm:px-5" aria-label="Global">
      <div class="xl:col-span-1 flex items-center md:gap-x-3">
        <div class="lg:hidden">
        
          <button type="button" onClick={() => onOpenMobileDash()}class="w-7 h-[38px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
         
        </div>
  
        <div class="hidden lg:block min-w-80 xl:w-full">
        
          {/* <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg class="flex-shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input type="text" class="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-200 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search Preline" data-hs-overlay="#hs-pro-dnsm" />
            <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
              <svg class="flex-shrink-0 size-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
              <span class="mx-1">
                <svg class="flex-shrink-0 size-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </span>
              <span class="text-xs">/</span>
            </div>
          </div> */}
     
        </div>
      </div>
  
      <div class="xl:col-span-2 flex justify-end items-center gap-x-2">
        <div class="flex items-center">
          {/* <div class="lg:hidden">
         
            <button type="button" class="inline-flex flex-shrink-0 justify-center items-center gap-x-2 size-[38px] rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-dnsm">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
         
          </div> */}
  
    
          
      
  
          <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
            <div class="hs-tooltip [--placement:bottom] inline-block">
              <button id="hs-pro-dnnd" type="button" class="hs-tooltip-toggle relative size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                {/* <span class="flex absolute top-0 end-0 z-10 -mt-1.5 -me-1.5">
                  <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative min-w-[18px] min-h-[18px] inline-flex justify-center items-center text-[10px] bg-red-500 text-white rounded-full px-1">
                    2
                  </span>
                </span> */}
              </button>
              <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                Notifications
              </span>
            </div>
     
  
        
            <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full sm:w-96 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white border-t border-gray-200 sm:border-t-0 sm:rounded-lg shadow-md sm:shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)]" aria-labelledby="hs-pro-dnnd">
          
              <div class="px-5 pt-3 flex justify-between items-center border-b border-gray-200">
            
                <nav class="flex space-x-1 " aria-label="Tabs" role="tablist">
                  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none active" id="hs-pro-tabs-dnn-item-all" data-hs-tab="#hs-pro-tabs-dnn-all" aria-controls="hs-pro-tabs-dnn-all" role="tab" >
                    All
                  </button>
                  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2  hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none " id="hs-pro-tabs-dnn-item-archived" data-hs-tab="#hs-pro-tabs-dnn-archived" aria-controls="hs-pro-tabs-dnn-archived" role="tab" >
                    Archived
                  </button>
                </nav>
               
  
              
                <div class="hs-tooltip relative inline-block mb-3">
                  <a class="hs-tooltip-toggle size-7 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="../../pro/dashboard/account-profile.html">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  </a>
                  <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                    Preferences
                  </span>
                </div>
              
              </div>
          
              <div id="hs-pro-tabs-dnn-all" role="tabpanel" aria-labelledby="hs-pro-tabs-dnn-item-all">
                <div class="h-[480px] overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <ul class="divide-y divide-gray-200">
          
                    <li class="relative group w-full flex gap-x-5 text-start p-5 bg-gray-100">
                      <div class="relative flex-shrink-0">
                        <img class="flex-shrink-0 size-[38px] rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Image Description" />
                        <span class="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full"></span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500">
                          2 hours ago
                        </p>
  
                        <span class="block text-sm font-medium text-gray-800">
                          Eilis Warner
                        </span>
                        <p class="text-sm text-gray-500">
                          changed an issue from 'in Progress' to 'Review'
                        </p>
                      </div>
  
                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                  <svg class="flex-shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="4" rx="2"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                    
                        </div>
                      </div>
                    </li>
                 
  
                  
                    <li class="relative group w-full flex gap-x-5 text-start p-5 ">
                      <div class="relative flex-shrink-0">
                        <span class="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm">
                          C
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500">
                          3 days ago
                        </p>
  
                        <span class="block text-sm font-medium text-gray-800">
                          Clara Becker
                        </span>
                        <p class="text-sm text-gray-500">
                          mentioned you in a comment
                        </p>
                        <div class="mt-2">
                          <blockquote class="ps-3 border-s-4 border-gray-200 text-sm text-gray-500">
                            Nice work, love! You really nailed it. Keep it up!
                          </blockquote>
                        </div>
                      </div>
  
                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                    
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                  <svg class="flex-shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="4" rx="2"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
             
                        </div>
                      </div>
                    </li>
           
  
              
                    <li class="relative group w-full flex gap-x-5 text-start p-5 ">
                      <div class="relative flex-shrink-0">
                        <span class="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm">
                          P
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500">
                          5 Jan 2023
                        </p>
  
                        <span class="block text-sm font-medium text-gray-800">
                          New Update on Preline
                        </span>
                        <p class="text-sm text-gray-500">
                          Add yourself to our new “Hire Page”. Let visitors know you’re open to freelance or full-time work.
                        </p>
                        <a class="mt-2 p-1.5 inline-flex items-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:bg-gray-100" href="#">
                          <img class="w-[70px] h-[62px] object-cover rounded-lg" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Image Description" />
                          <div class="grow py-2.5 px-4">
                            <p class="text-sm font-medium text-gray-800">
                              Get hired!
                            </p>
                            <p class="inline-flex items-center gap-x-1 text-sm text-gray-500">
                              Get started
                              <svg class="flex-shrink-0 size-4 transition ease-in-out group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </p>
                          </div>
                        </a>
                      </div>
  
                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                   
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                  <svg class="flex-shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="4" rx="2"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
      
                        </div>
                      </div>
                    </li>
            
  
               
                    <li class="relative group w-full flex gap-x-5 text-start p-5 ">
                      <div class="relative flex-shrink-0">
                        <span class="flex flex-shrink-0 justify-center items-center size-[38px] bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-sm">
                          P
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500">
                          5 Jan 2023
                        </p>
  
                        <span class="block text-sm font-medium text-gray-800">
                          We’re updating our Privacy Policy as of 10th January 2023.content
                        </span>
                        <p>
                          <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-none focus:underline" href="#">
                            Learn more
                            <svg class="flex-shrink-0 size-4 transition ease-in-out group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                          </a>
                        </p>
                      </div>
  
                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                   
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                  <svg class="flex-shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="4" rx="2"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                     
                        </div>
                      </div>
                    </li>
              
  
               
                    <li class="relative group w-full flex gap-x-5 text-start p-5 bg-gray-100">
                      <div class="relative flex-shrink-0">
                        <img class="flex-shrink-0 size-[38px] rounded-full" src="https://images.unsplash.com/photo-1614880353165-e56fac2ea9a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Image Description" />
                        <span class="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full"></span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500">
                          31 Dec 2022
                        </p>
  
                        <span class="block text-sm font-medium text-gray-800">
                          Rubia Walter
                        </span>
                        <p class="text-sm text-gray-500">
                          Joined the Slack group HS Team
                        </p>
                      </div>
  
                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
          
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-sm transition ease-out">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                  <svg class="flex-shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex flex-shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="4" rx="2"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                     
                        </div>
                      </div>
                    </li>
              
                  </ul>
               
                </div>
  
              
                <div class="text-center border-t border-gray-200">
                  <a class="p-4 flex justify-center items-center gap-x-2 text-sm text-gray-500 font-medium sm:rounded-b-lg hover:text-blue-600 focus:outline-none focus:text-blue-600" href="../../docs/index.html">
                    Mark all as read
                  </a>
                </div>
              
              </div>
            
  
    
              <div id="hs-pro-tabs-dnn-archived" class="hidden" role="tabpanel" aria-labelledby="hs-pro-tabs-dnn-item-archived">
        
                <div class="p-5 min-h-[533px]  flex flex-col justify-center items-center text-center">
                  <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                    <rect x="34.5" y="58" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                    <rect x="27" y="36" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <g filter="url(#filter15)">
                    <rect x="12" y="6" width="154" height="40" rx="8" fill="currentColor" class="fill-white" shape-rendering="crispEdges"/>
                    <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                    <rect x="20" y="14" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-200 "/>
                    <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    </g>
                    <defs>
                    <filter id="filter15" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="6"/>
                    <feGaussianBlur stdDeviation="6"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1187_14810"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1187_14810" result="shape"/>
                    </filter>
                    </defs>
                  </svg>
  
                  <div class="max-w-sm mx-auto">
                    <p class="mt-2 font-medium text-gray-800">
                      No archived notifications
                    </p>
                    <p class="mb-5 text-sm text-gray-500">
                      We'll notify you about important updates and any time you're mentioned on Preline.
                    </p>
                  </div>
  
                  <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50" href="#">
                    Notifications settings
                  </a>
                </div>
                
              </div>
          
            </div>
          </div>
     
  
       
       
        
        </div>
  
 

     
  
        <div class="border-e border-gray-200 w-px h-6 mx-1.5"></div>
  
        <div class="h-[38px] ">
      
          <div class="hs-dropdown relative inline-flex   [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right]">
          
          <Menu>
          <MenuButton>
          <button id="@@id" type="button" class="inline-flex flex-shrink-0 items-center gap-x-3 text-start rounded-full focus:outline-none focus:bg-gray-100 dark:focus:bg-neutral-700">
          {profilePicture ? (
                    <img
                      class="flex-shrink-0 size-[38px] rounded-full"
                      src={profilePicture}
                      alt="Image Description"
                    />
                  ) : (
                    <svg
                    class="w-12 h-12 rounded-full object-cover text-gray-500"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.62854"
                        y="0.359985"
                        width="15"
                        height="15"
                        rx="7.5"
                        fill="white"
                      ></rect>
                      <path
                        d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  )}
            </button>
          </MenuButton>
          <MenuList>
          
       

            <MenuItem onClick={() => navigate("/DoerAccountManager")}>
              <p  class="hs-accordion-toggle px-4 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex    text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"> Account Settings</p>
            
            </MenuItem>
            <MenuItem onClick={() => navigate("/UserProfile")}>
            <p  class="hs-accordion-toggle px-4 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex   text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"> My Profile</p>
            </MenuItem>
            {/* <MenuItem onClick={() => navigate("/DoerPaymentHistory")}>Payment History</MenuItem> */}

           
            {loggingOut ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Center>
                <Button
                  width="160px"
                  colorScheme="red"
                  height="32px"
                  marginTop="8px"
                  onClick={() => handleLogOut()}
                >
                  Log Out
                </Button>
              </Center>
            )}
          </MenuList>
        </Menu>
             

            
        <Drawer
        isOpen={isOPenMobileDash}
        placement='left'
        onClose={onCloseMobileDash}
        
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
          <div class="flex flex-col h-full max-h-full py-3">
          <header class="h-[46px] px-8">
            <a
              class="flex-none text-4xl font-sans font-bold text-sky-400"
              aria-label="Brand"
              onClick={() => navigate("/DoerMapView")}
            >
              Fulfil
            </a>
          </header>

          <div class="h-[calc(100%-35px)] lg:h-[calc(100%-93px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <nav
              class="hs-accordion-group pb-3  w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open
            >
              <ul>
                <li class="px-5 mb-1.5">
                  <button
                    class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 "
                    onClick={() => navigate("/DoerMapView")}
                  >
                    <svg
                      class="flex-shrink-0 mt-0.5 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    My Jobs
                  </button>
                </li>
                <li class="px-5 mb-1.5">
                  <button
                    class="hs-accordion-toggle mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    onClick={() => navigate("/DoerSavedJobs")}
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"  class="flex-shrink-0 mt-0.5 size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>

                    Saved Jobs
                  </button>
                </li>

                <button
                  type="button"
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                  onClick={() => navigate("/DoerChatHolder")}
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Messages
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/UserProfile");
                  }}
                  class="hs-accordion-toggle  px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/DoerAccountManager")}
                  class="hs-accordion-toggle px-8 mb-1.5 hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                >
                  <svg
                    class="flex-shrink-0 mt-0.5 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="18" cy="15" r="3" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                    <path d="m21.7 16.4-.9-.3" />
                    <path d="m15.2 13.9-.9-.3" />
                    <path d="m16.6 18.7.3-.9" />
                    <path d="m19.1 12.2.3-.9" />
                    <path d="m19.6 18.7-.4-1" />
                    <path d="m16.8 12.3-.4-1" />
                    <path d="m14.3 16.6 1-.4" />
                    <path d="m20.7 13.8 1-.4" />
                  </svg>
                  Account Settings
                </button>

                {/* <li class="pt-5 px-8 mt-5 mb-1.5 border-t border-gray-200 first:border-transparent first:pt-0">
                  <span class="block text-xs uppercase text-gray-500">
                    Actions
                  </span>
                </li> */}

              
                <li class="px-8 mb-0.5 mt-10">
                  {/* <button
                    type="button"
                    class="py-2  px-3 inline-flex text-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none"
                   onClick={() => onOpen()}
                  >
                    
                    Upgrade To Pro
                  </button> */}
                 
                </li>

                
              
              </ul>
            </nav>
          </div>
          </div>
      
          </DrawerBody>
        </DrawerContent>
      </Drawer>
          
         
       
          </div>
       
        </div>
      </div>
    </div>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Center py={6}>
            <Box
              maxW={"330px"}
              w={"full"}
              bg={useColorModeValue("white", "gray.800")}
              rounded={"md"}
              overflow={"hidden"}
            >
              <VStack spacing={1} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                  Upgrade to premium
                </Heading>
                <Text fontSize="lg" color={"gray.500"}>
                  Get the frist 2 months for $1/month. Then continue at
                  $29/month.
                </Text>

                <Text fontSize="md" color={"gray.500"}>
                  Cancel at anytime.
                </Text>
              </VStack>
              <Stack
                textAlign={"center"}
                p={5}
                color={useColorModeValue("gray.800", "white")}
                align={"center"}
              >
                <Text
                  fontSize={"md"}
                  fontWeight={500}
                  textColor="#01A2E8"
                  p={2}
                  px={3}
                  rounded={"full"}
                >
                  Premium Subscription
                </Text>
                <Stack direction={"row"} align={"center"} justify={"center"}>
                  <Text fontSize={"3xl"}>$</Text>
                  <Text fontSize={"6xl"} fontWeight={800}>
                    1
                  </Text>
                  <Text color={"gray.500"}>/month</Text>
                </Stack>
              </Stack>

              <Box px={1} py={6}>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Save 50% on all transaction fees
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Get noticed by customers as a Premium Contractor
                  </ListItem>

                  <ListItem>
                    <ListIcon as={CheckIcon} color="#01A2E8" />
                    Be seen by customers who are looking for contractors in your
                    category
                  </ListItem>
                </List>

                <Button
                  mt={10}
                  w={"full"}
                  bg="#01A2E8"
                  color={"white"}
                  rounded={"xl"}
                  boxShadow={"0 5px 20px 0px rgb(72 187 120 / 43%)"}
                  _hover={{ bg: "#018ecb", textColor: "white" }}
                  onClick={() => initializeSubscription()}
                >
                  Start your trial
                </Button>
              </Box>
            </Box>
          </Center>
        </ModalContent>
      </Modal>
  </header>
  </>
  )
}

export default Header