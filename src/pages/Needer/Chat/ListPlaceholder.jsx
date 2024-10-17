import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { db } from "../../../firebaseConfig";
import { useUserStore } from "./lib/userStore";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
} from "firebase/firestore";
import { useChatStore } from "./lib/chatStore";
import { filter } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useJobStore } from "./lib/jobsStore";
import Header from "../Components/Header";

const ListPlaceholder = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
    const [allChats, setAllChats] = useState(null)
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
    const { fetchJobInfo, setJobHiringState } = useJobStore();
    
  
    useEffect(() => {
      const jobQuery = query(
        collection(db, "employers", currentUser.uid, "Posted Jobs")
      );

      onSnapshot(jobQuery, (snapshot) => {
        let jobData = [];
        snapshot.docs.forEach((doc) => {
          //review what this does
          // console.log("test",doc.data())
          jobData.push({ jobTitle: doc.data().jobTitle, id: doc.data().jobID });
        });

        if (!jobData || !jobData.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          // setInterviewNewMessageLength(null);
          setSelectedCategoryChannelIDs(null)
        } else {
          setInterviewMessageData(jobData);
          console.log("1")
        }
      });
    }, [currentUser.uid]);




    const [postedUnread, setPostedUnread] = useState(false)
    const [jobsInProgressUnread, setJobsInProgressUnread] = useState(false)
    const [inReviewUnread, setInReviewUnread] = useState(false)
    const [requestsUnread, setRequestsUnread] = useState(false)



    useEffect(() => {
      if (currentUser) {
         let allChats = [];
   
         const unSub = onSnapshot(
           doc(db, "User Messages", currentUser.uid),
           async (res) => {
             let postedJobsUnread = 0;
             let progressUnread = 0;
             let reviewUnread = 0;
             let requestUnread = 0;
       
             const items = res.data().chats;
   
             console.log("res data",res.data().chats)
   
             items.map(async (item) => {
              
               console.log("fetchedIDs", item);
   
               if (item.isSeen === false && item.jobType === "Interview") {
                  postedJobsUnread++;
                  console.log("got one");
               }
               if (item.isSeen === false && item.jobType === "Jobs In Progress") {
                progressUnread++;
               }
               if (item.isSeen === false && item.jobType === "In Review") {
                reviewUnread++;
              }
               if (item.isSeen === false && item.jobType === "Requests") {
                 requestUnread++;
               }
             });
        
   
             if (postedJobsUnread > 0) {
              setPostedUnread(true) 
             }
             if (progressUnread > 0) {
              setJobsInProgressUnread(true) 
             }
             if (reviewUnread > 0) {
              setInReviewUnread(true) 
             }
             if (requestUnread > 0) {
              setRequestsUnread(true) 
             }
           }
         );
   
         return () => {
           unSub();
         };
      }
     }, [currentUser]);
   
  
    //Check channel Id's from "Category" and run them against "User MEssages" (? The one with user ID), then set those to chat
  
    // [] channelID's from SelectedCategory
  
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [interviewMessageData, setInterviewMessageData] = useState(null);
    const [selectedCategoryChannelIDs, setSelectedCategoryChannelIDs] =
      useState(null);
  
    ///uhh
  
  
  
  
    // useEffect(() => {
    //   if (selectedCategory === "Posted Jobs") {
    //     const jobQuery = query(
    //       collection(db, "employers", currentUser.uid, "Posted Jobs")
    //     );
  
    //     onSnapshot(jobQuery, (snapshot) => {
    //       let jobData = [];
    //       snapshot.docs.forEach((doc) => {
    //         //review what this does
    //         // console.log("test",doc.data())
    //         jobData.push({ jobTitle: doc.data().jobTitle, id: doc.data().jobID });
    //       });
  
    //       if (!jobData || !jobData.length) {
    //         //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
    //         // setInterviewNewMessageLength(null);
    //         setSelectedCategoryChannelIDs(null)
    //       } else {
    //         setInterviewMessageData(jobData);
    //         console.log("1")
    //       }
    //     });
    //   } else if (selectedCategory === "Jobs In Progress") {
    //     const chatIdQuery = query(
    //       collection(db, "employers", currentUser.uid, "Jobs In Progress")
    //     );
  
    //     onSnapshot(chatIdQuery, (snapshot) => {
    //       let channelIDs = [];
    //       snapshot.docs.forEach((doc) => {
    //         if (doc.data().channelId) {
    //           channelIDs.push(doc.data().channelId);
    //         }
    //       });
  
    //       if (!channelIDs || !channelIDs.length) {
    //         setChats(null)
    //         setSelectedCategoryChannelIDs(null)
    //         //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
    //       } else {
    //         setSelectedCategoryChannelIDs(channelIDs);
    //       }
    //     });
    //   } else if (selectedCategory === "In Review") {
    //     const chatIdQuery = query(
    //       collection(db, "employers", currentUser.uid, "In Review")
    //     );
  
    //     onSnapshot(chatIdQuery, (snapshot) => {
    //       let channelIds = [];
    //       snapshot.docs.forEach((doc) => {
    //         if (doc.data().channelId) {
    //           channelIds.push(doc.data().channelId);
    //         }
    //       });
  
    //       if (!channelIds || !channelIds.length) {
    //         setChats(null)
    //         setSelectedCategoryChannelIDs(null)
    //         //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
    //       } else {
    //         setSelectedCategoryChannelIDs(channelIds);
    //       }
    //     });
    //   } else if (selectedCategory === "Requests") {
    //     const chatIdQuery = query(
    //       collection(db, "employers", currentUser.uid, "Requests")
    //     );
  
    //     onSnapshot(chatIdQuery, (snapshot) => {
    //       let channelIds = [];
    //       snapshot.docs.forEach((doc) => {
    //         if (doc.data().channelId) {
    //           channelIds.push(doc.data().channelId);
    //         }
    //       });
  
    //       if (!channelIds || !channelIds.length) {
    //         setChats(null)
    //         setSelectedCategoryChannelIDs(null)
    //         //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
    //       } else {
    //         setSelectedCategoryChannelIDs(channelIds);
    //       }
    //     });
    //   } else if (selectedCategory === "All") {
    //     setChats(allChats)
    //   }
    // }, [selectedCategory]);
  
    useEffect(() => {
      if (interviewMessageData) {
        let channelIds = [];
        interviewMessageData.forEach((job) => {
          const applicantQuery = query(
            collection(
              db,
              "employers",
              currentUser.uid,
              "Posted Jobs",
              job.jobTitle,
              "Applicants"
            )
          );
  
  
          console.log("2")
          // let channelIds = [];
          onSnapshot(applicantQuery, (snapshot) => {
            // let channelIds = [];
            snapshot.docs.forEach((doc) => {
              if (doc.data().channelId) {
                channelIds.push(doc.data().channelId);
                console.log("3", doc.data().channelId)
              }
            });
  
            if (!channelIds || !channelIds.length) {
              setChats(null)
              //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
              // setInterviewNewMessageLength(null);
            } else {
              console.log("4", channelIds)
              
              setSelectedCategoryChannelIDs(channelIds);
            }
          });
        });
      }
    }, [interviewMessageData]);
  
    console.log(selectedCategoryChannelIDs);
  
    // now we compare those IDs to the Ids in our user cmessages db and set matches to chat
  
    useEffect(() => {
      if (selectedCategoryChannelIDs) {
        let allChats = [];
  
        const unSub = onSnapshot(
          doc(db, "User Messages", currentUser.uid),
          async (res) => {
            let fetchedIds = [];
            let selectedChats = [];
            let items = res.data().chats

          
  
            console.log("usser listPlaceholder",currentUser.uid)
            console.log("res data",res.data().chats)
  
            items.map(async (item) => {
              fetchedIds.push(item.chatId);
              // console.log("fetchedIDs", item.chatId)
            });

            console.log("fetchedIds array", fetchedIds)
  
  
            
              const promises = items.map(async (item) => {
                if (item.chatId !== "placeholder") {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
    
                const user = userDocSnap.data();
    
                return { ...item, user };
                } 
              });
    
              const chatData = await Promise.all(promises);
    
              //credit https://stackoverflow.com/questions/12433604/how-can-i-find-matching-values-in-two-arrays
              let filteredChats = fetchedIds.filter((id) =>
                selectedCategoryChannelIDs.includes(id)

              );
              console.log("filtered chats", filteredChats);
    
              filteredChats.forEach((filteredChat) => {
                chatData.forEach((chatData) => {
                  if (chatData && filteredChat === chatData.chatId) {
                      selectedChats.push(chatData);
                      console.log("chat data", chatData);
                   }
            
                });
              });
    
              if (!selectedChats || !selectedChats.length) {
                setChats(null);
              } else {
                setChats(selectedChats.sort((a, b) => b.updatedAt - a.updatedAt));
              }
        
  
          
          }
        );
  
        return () => {
          unSub();
        };
      }
    }, [selectedCategoryChannelIDs]);
  
    // if Posted job --> applicant ---> channelID , check against USER MESSAGES
  
    console.log(chats);
  
    //handle job fetching here
  
    const handleJobFetch = async (chat) => {
      fetchJobInfo(currentUser.uid, chat.jobID, chat.jobType, chat.jobTitle);
    };
  
    const handleSelect = async (chat) => {
      const userChats = chats.map((item) => {
        const { user, ...rest } = item;
  
        return rest;
      });
  
      setJobHiringState(chat);
      const chatIndex = userChats.findIndex(
        (item) => item.chatId === chat.chatId
      );
  
      userChats[chatIndex].isSeen = true;
  
      const userChatsRef = doc(db, "User Messages", currentUser.uid);
  
      //add field that keeps track of type of chat: Accepted, Request, Interviewing, Completed
      //originally show all.
      // filter between each via drop down? or toggle. idk
      // mvp tho? add jobTitle to job title
      //so on create add JobID and Job Title (and title: request if Needer contacting Doer)to User Messages sub-collection
  
      try {
        //is this what's erasing the fb db?
        // await updateDoc(userChatsRef, {
        //   chats: userChats,
        // });
        changeChat(chat.chatId, chat.user);
        handleJobFetch(chat);
      } catch (err) {
        console.log(err);
      }
    };
  
    // const filteredChats = chats.filter((c) =>
    //   c.user.username.toLowerCase().includes(input.toLowerCase())
    // );
  
  return (
  
    <aside class="relative ">
       
       <div id="hs-pro-sidebar" class="


hs-overlay [--auto-close:lg]
    hs-overlay-open:translate-x-0
    -translate-x-full transition-all duration-300 transform

    xl:w-[328px]
    
    md:w-[300px]
sm:w-[286px]
   h-[calc(100vh-70px)] mt-14
   
      z-50
      fixed inset-y-0 start-0 xl:start-64 
      bg-white
      lg:block lg:translate-x-0 lg:end-auto lg:bottom-0]xl:block xl:translate-x-0 xl:end-auto xl:bottom-0
     ">  
      <div class="h-full flex ">
      <div class="sm:w-[286px] md:w-[300px] lg:w-full truncate bg-white lg:border-x border-gray-200">
          <div class="h-full flex flex-col">
            <div class="ps-4 pe-3 py-2 flex justify-between items-center gap-x-2 border-b border-gray-200">
              <h1 class="truncate font-semibold text-gray-800">
                Inbox
              </h1>
  
              <div class="flex items-center">
           
               
         
  
                <div class="relative flex items-center gap-x-1 ps-2 ms-2 before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
      
                  {/* <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhcp">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                    <span class="sr-only">Compose</span>
                  </button> */}
                
                </div>
              </div>
            </div>
      
      
       
  
        
         
          
  
            <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          
              <div id="hs-pro-tabs-chsn-all" class="h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-all">
                <div aria-label="Tabs" role="tablist">



                {chats ? (
        chats.map((chat) => (

            <div class="hs-tab-active:bg-gray-200 relative cursor-pointer bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100  " id="hs-pro-tabs-chct-item-2" data-hs-tab="#hs-pro-tabs-chct-2" aria-controls="hs-pro-tabs-chct-2" role="tab"  onClick={() => handleSelect(chat)}>
            <div class="py-4 px-3 flex items-center gap-x-3 border-b border-b-gray-100">
              <div class="flex-shrink-0">
                <div class="relative size-8">
                  <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase  text-white rounded-full">
                  {chat.user.profilePictureResponse ? (<img
                src={chat.user.profilePictureResponse}
                className="w-8 h-8 mt-2.5 rounded-full object-cover"
                 />) : (<svg
                          class="w-14 h-14  rounded-full object-cover text-gray-500"
                          width="14"
                          height="14"
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
                        </svg>)} 
                  </span>
                </div>
              </div>
              <div class="grow truncate">
                <div class="flex justify-between items-center gap-x-1">
                  <p class="truncate font-semibold text-[13px] text-gray-800">{chat.user.firstName}   </p>
                  <div>
                  {chat.isSeen ? (null) :( <span class="relative min-w-[18px] min-h-[18px] inline-flex justify-center items-center text-[10px] bg-blue-500 text-white rounded-full px-1">
                    1
                  </span>
                  )}
                  </div>
                </div>
                <div class="truncate me-5">
                  <div class="flex items-center gap-x-1.5">
                  
                    <div class="grow truncate">
                      <p class="truncate font-medium text-gray-800 text-xs">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
                <div class="hs-tab-active:hidden absolute bottom-3.5 end-2.5">
              
                </div>
              </div>
            </div>
          </div>
                   ))
                ) : (
                  <div class="block w-full py-2 px-1 sm:p-4 group bg-white rounded-2xl mb-2  focus:outline-none focus:bg-gray-200 ">
                    <div class="flex gap-x-2 sm:gap-x-4">
                      <div class="grow">
                        <p class="font-semibold text-lg text-gray-800 ">
                          No Messages here
                        </p>
          
                        <p class="font-semibold text-sm text-gray-600 "></p>
          
                        <p class="text-sm text-gray-500 dark:text-neutral-500 line-clamp-1"></p>
                      </div>
                    </div>
                  </div>
                )}
  
                
                
  
              
                </div>
              </div>
            
  
        
              <div id="hs-pro-tabs-chsn-mentions" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-mentions">
                
                <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                  <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                    <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                    <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <g filter="url(#filter2)">
                    <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                    <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                    <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    </g>
                    <defs>
                    <filter id="filter2" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
                      No mentions message
                    </p>
                    <p class="mb-5 text-sm text-gray-500">
                      Only mentions messages appear here
                    </p>
                  </div>
                </div>
             
              </div>
          
  
            
              <div id="hs-pro-tabs-chsn-spammed" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-spammed">
               
                <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                  <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                    <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                    <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <g filter="url(#filter3)">
                    <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                    <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                    <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    </g>
                    <defs>
                    <filter id="filter3" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
                      No spammed message
                    </p>
                    <p class="mb-5 text-sm text-gray-500">
                      Only spammed messages appear here
                    </p>
                  </div>
                </div>
               
              </div>
   
  
             
              <div id="hs-pro-tabs-chsn-blocked" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-blocked">
              
                <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                  <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                    <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                    <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                    <g filter="url(#filter4)">
                    <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                    <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                    <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                    </g>
                    <defs>
                    <filter id="filter4" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
                      No mentioned message
                    </p>
                    <p class="mb-5 text-sm text-gray-500">
                      Only mentioned messages appear here
                    </p>
                  </div>
                </div>
         
              </div>
              
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </aside>
  )
}

export default ListPlaceholder