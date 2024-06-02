import { useEffect, useState } from "react";

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

const ListPlaceholder = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
    const [allChats, setAllChats] = useState(null)
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
    const { fetchJobInfo, setJobHiringState } = useJobStore();
    
  
    useEffect(() => {
      const unSub = onSnapshot(
        doc(db, "User Messages", currentUser.uid),
        async (res) => {
          const items = res.data().chats;
  
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
  
            const user = userDocSnap.data();
  
            return { ...item, user };
          });
  
          const chatData = await Promise.all(promises);
  
          setAllChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
  
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      );
  
      return () => {
        unSub();
      };
    }, [currentUser.uid]);
  
    //Check channel Id's from "Category" and run them against "User MEssages" (? The one with user ID), then set those to chat
  
    // [] channelID's from SelectedCategory
  
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [interviewMessageData, setInterviewMessageData] = useState(null);
    const [selectedCategoryChannelIDs, setSelectedCategoryChannelIDs] =
      useState(null);
  
    ///uhh
  
  
  
  
    useEffect(() => {
      if (selectedCategory === "Posted Jobs") {
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
      } else if (selectedCategory === "Jobs In Progress") {
        const chatIdQuery = query(
          collection(db, "employers", currentUser.uid, "Jobs In Progress")
        );
  
        onSnapshot(chatIdQuery, (snapshot) => {
          let channelIDs = [];
          snapshot.docs.forEach((doc) => {
            if (doc.data().channelId) {
              channelIDs.push(doc.data().channelId);
            }
          });
  
          if (!channelIDs || !channelIDs.length) {
            setChats(null)
            setSelectedCategoryChannelIDs(null)
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          } else {
            setSelectedCategoryChannelIDs(channelIDs);
          }
        });
      } else if (selectedCategory === "In Review") {
        const chatIdQuery = query(
          collection(db, "employers", currentUser.uid, "In Review")
        );
  
        onSnapshot(chatIdQuery, (snapshot) => {
          let channelIds = [];
          snapshot.docs.forEach((doc) => {
            if (doc.data().channelId) {
              channelIds.push(doc.data().channelId);
            }
          });
  
          if (!channelIds || !channelIds.length) {
            setChats(null)
            setSelectedCategoryChannelIDs(null)
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          } else {
            setSelectedCategoryChannelIDs(channelIds);
          }
        });
      } else if (selectedCategory === "Requests") {
        const chatIdQuery = query(
          collection(db, "employers", currentUser.uid, "Requests")
        );
  
        onSnapshot(chatIdQuery, (snapshot) => {
          let channelIds = [];
          snapshot.docs.forEach((doc) => {
            if (doc.data().channelId) {
              channelIds.push(doc.data().channelId);
            }
          });
  
          if (!channelIds || !channelIds.length) {
            setChats(null)
            setSelectedCategoryChannelIDs(null)
            //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          } else {
            setSelectedCategoryChannelIDs(channelIds);
          }
        });
      } else if (selectedCategory === "All") {
        setChats(allChats)
      }
    }, [selectedCategory]);
  
    useEffect(() => {
      if (interviewMessageData) {
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
          onSnapshot(applicantQuery, (snapshot) => {
            let channelIds = [];
            snapshot.docs.forEach((doc) => {
              if (doc.data().channelId) {
                channelIds.push(doc.data().channelId);
                console.log("3")
              }
            });
  
            if (!channelIds || !channelIds.length) {
              setChats(null)
              //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
              // setInterviewNewMessageLength(null);
            } else {
              console.log("4")
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
            const items = res.data().chats;
  
            console.log("res data",res.data().chats)
  
            items.map(async (item) => {
              fetchedIds.push(item.chatId);
              console.log("fetchedIDs", item.chatId)
            });
  
  
            
              const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
    
                const user = userDocSnap.data();
    
                return { ...item, user };
              });
    
              const chatData = await Promise.all(promises);
    
              //credit https://stackoverflow.com/questions/12433604/how-can-i-find-matching-values-in-two-arrays
              let filteredChats = fetchedIds.filter((id) =>
                selectedCategoryChannelIDs.includes(id)
              );
              console.log("filtered chats", filteredChats);
    
              filteredChats.forEach((filteredChat) => {
                chatData.forEach((chatData) => {
                  if (filteredChat === chatData.chatId) {
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
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
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
    <aside class="relative">
    <div id="hs-pro-sidebar" class="hs-overlay [--auto-close:xl]
      hs-overlay-open:translate-x-0
      -translate-x-full transition-all duration-300 transform
      sm:w-72 size-full
      hidden
      fixed inset-y-0 start-0 xl:start-64 z-[60]
      bg-gray-100
      lg:block lg:translate-x-0 lg:end-auto lg:bottom-0]xl:block xl:translate-x-0 xl:end-auto xl:bottom-0
     ">
      <div class="h-full flex">
  
      
        <div class="sm:w-72 size-full truncate bg-white border-x border-gray-200">
          <div class="h-full flex flex-col">
          
            <div class="ps-4 pe-3 py-2 flex justify-between items-center gap-x-2 border-b border-gray-200">
              <h1 class="truncate font-semibold text-gray-800">
                Inbox
              </h1>
  
              <div class="flex items-center">
           
                <div class="relative inline-block">
                  <select id="hs-pro-select-revenue" data-hs-select='{
                      "placeholder": "Select option...",
                      "toggleTag": "<button type=\"button\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-2 ps-2.5 pe-6 inline-flex flex-shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 before:absolute before:inset-0 before:z-[1]",
                      "dropdownClasses": "mt-2 z-50 w-32 p-1 space-y-0.5 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)]",
                      "optionClasses": "hs-selected:bg-gray-100 py-1.5 px-2 w-full text-[13px] text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                    }' class="hidden">
                    <option value="">Choose</option>
                    <option selected>Newest</option>
                    <option>Oldest</option>
                  </select>
  
                  <div class="absolute top-1/2 end-2 -translate-y-1/2">
                    <svg class="flex-shrink-0 size-3.5 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
         
  
                <div class="relative flex items-center gap-x-1 ps-2 ms-2 before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
      
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhcp">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                    <span class="sr-only">Compose</span>
                  </button>
                
                </div>
              </div>
            </div>
      
            <div class="border-b border-gray-200">
           
              <div class="relative" data-hs-combo-box='{
                  "groupingType": "default",
                  "preventSelection": true,
                  "isOpenOnFocus": true,
                  "outputEmptyTemplate": "<div class=\"p-5 h-[calc(100dvh-85px)] flex flex-col justify-center items-center text-center\"><svg class=\"w-48 mx-auto mb-4\" width=\"178\" height=\"90\" viewBox=\"0 0 178 90\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"27\" y=\"50.5\" width=\"124\" height=\"39\" rx=\"7.5\" fill=\"white\"/><rect x=\"27\" y=\"50.5\" width=\"124\" height=\"39\" rx=\"7.5\" stroke=\"#F9FAFB\"/><rect x=\"34.5\" y=\"58\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F9FAFB\"/><rect x=\"66.5\" y=\"61\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#F9FAFB\"/><rect x=\"66.5\" y=\"73\" width=\"77\" height=\"6\" rx=\"3\" fill=\"#F9FAFB\"/><rect x=\"19.5\" y=\"28.5\" width=\"139\" height=\"39\" rx=\"7.5\" fill=\"white\"/><rect x=\"19.5\" y=\"28.5\" width=\"139\" height=\"39\" rx=\"7.5\" stroke=\"#F3F4F6\"/><rect x=\"27\" y=\"36\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F3F4F6\"/><rect x=\"59\" y=\"39\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#F3F4F6\"/><rect x=\"59\" y=\"51\" width=\"92\" height=\"6\" rx=\"3\" fill=\"#F3F4F6\"/><g filter=\"url(#@@id)\"><rect x=\"12\" y=\"6\" width=\"154\" height=\"40\" rx=\"8\" fill=\"white\" shape-rendering=\"crispEdges\"/><rect x=\"12.5\" y=\"6.5\" width=\"153\" height=\"39\" rx=\"7.5\" stroke=\"#F3F4F6\" shape-rendering=\"crispEdges\"/><rect x=\"20\" y=\"14\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#E5E7EB\"/><rect x=\"52\" y=\"17\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#E5E7EB\"/><rect x=\"52\" y=\"29\" width=\"106\" height=\"6\" rx=\"3\" fill=\"#E5E7EB\"/></g><defs><filter id=\"@@id\" x=\"0\" y=\"0\" width=\"178\" height=\"64\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\" result=\"hardAlpha\"/><feOffset dy=\"6\"/><feGaussianBlur stdDeviation=\"6\"/><feComposite in2=\"hardAlpha\" operator=\"out\"/><feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0\"/><feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_1187_14810\"/><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_1187_14810\" result=\"shape\"/></filter></defs></svg><div class=\"max-w-sm mx-auto\"><p class=\"mt-2 text-sm text-gray-600">No search results</p></div></div>",
                  "preventAutoPosition": true,
                  "groupingTitleTemplate": "<div class=\"block text-xs text-gray-500 m-3 mb-1"></div>"
                }'>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <svg class="flex-shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <input type="text" class="py-1.5 pe-12 ps-10 block w-full bg-white border-0 rounded-0 md:text-[13px] placeholder:text-gray-500 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search" data-hs-combo-box-input />
                  <div class="hidden hs-combo-box-active:flex absolute inset-y-0 end-0 items-center z-20 pe-4" data-hs-combo-box-input>
                    <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600" data-hs-combo-box-close>
                      <span class="sr-only">Close</span>
                      <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    </button>
                  </div>
                </div>
  
               
                <div class="absolute top-full z-50 w-full bg-white border-t border-gray-200 hidden" data-hs-combo-box-output>
                  <div class="h-[calc(100dvh-85px)] overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                
                    <div data-hs-combo-box-output-items-wrapper>
                      <div class="pt-1.5 pb-4">
                        <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="0">
                        
                          <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                            <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Photos" data-hs-combo-box-value>
                              Photos
                            </span>
                            <div class="ms-auto">
                              <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </div>
                          </a>
                          
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="1">
                     
                          <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                            <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Links" data-hs-combo-box-value>
                              Links
                            </span>
                            <div class="ms-auto">
                              <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </div>
                          </a>
                      
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="2">
                     
                          <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                            <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                            <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Documents" data-hs-combo-box-value>
                              Documents
                            </span>
                            <div class="ms-auto">
                              <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </div>
                          </a>
                        
                        </div>
  
                        <div class="-mt-px py-1 px-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs text-gray-500">Recent</h4>
                        </div>
  
                        <div class="py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">A</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="8">
                        
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Amanda Harvey" data-hs-combo-box-value>
                                Amanda Harvey
                              </p>
                            </div>
                          </a>
                         
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="9">
                       
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Anna Richard" data-hs-combo-box-value>
                                Anna Richard
                              </p>
                            </div>
                          </a>
                          
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="10">
                          
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                A
                              </span>
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Alex Brown" data-hs-combo-box-value>
                                Alex Brown
                              </p>
                            </div>
                          </a>
                          
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">B</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="11">
                   
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                B
                              </span>
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Bob Dean" data-hs-combo-box-value>
                                Bob Dean
                              </p>
                            </div>
                          </a>
                          
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">C</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="12">
                          
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Chun Wa" data-hs-combo-box-value>
                                Chun Wa
                              </p>
                            </div>
                          </a>
                    
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="13">
                         
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Costa Quinn" data-hs-combo-box-value>
                                Costa Quinn
                              </p>
                            </div>
                          </a>
                         
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">D</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="14">
                        
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="David Harrison" data-hs-combo-box-value>
                                David Harrison
                              </p>
                            </div>
                          </a>
                      
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">E</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="15">
                          
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Ella Lauda" data-hs-combo-box-value>
                                Ella Lauda
                              </p>
                            </div>
                          </a>
                        
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="16">
                       
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1568048689711-5e0325cea8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Elizabeth Cru" data-hs-combo-box-value>
                                Elizabeth Cru
                              </p>
                            </div>
                          </a>
                         
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">L</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="17">
                         
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Lewis Clarke" data-hs-combo-box-value>
                                Lewis Clarke
                              </p>
                            </div>
                          </a>
                          
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">M</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="18">
                        
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                M
                              </span>
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Mark Colbert" data-hs-combo-box-value>
                                Mark Colbert
                              </p>
                            </div>
                          </a>
                        
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">O</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="19">
                        
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                O
                              </span>
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Ols Schols" data-hs-combo-box-value>
                                Ols Schols
                              </p>
                            </div>
                          </a>
                     
                        </div>
  
                        <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                          <h4 class="text-xs uppercase text-gray-500">R</h4>
                        </div>
  
                        <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="20">
                        
                          <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                            <div class="flex-shrink-0">
                              <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                R
                              </span>
                            </div>
                            <div class="grow truncate">
                              <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Rachel Doe" data-hs-combo-box-value>
                                Rachel Doe
                              </p>
                            </div>
                          </a>
                   
                        </div>
                      </div>
                    </div>
                  </div>
           
                </div>
             
              </div>
      
            </div>
       
  
        
            <div class="py-1.5 border-b border-gray-200">
              <div class="-mb-2.5 px-1.5 overflow-x-auto">
                <div class="overflow-x-auto [&::-webkit-scrollbar]:h-0">
                  
                  <nav class="flex gap-x-1" aria-label="Tabs" role="tablist">
                    <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 font-medium text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none active " id="hs-pro-tabs-chsn-item-all" data-hs-tab="#hs-pro-tabs-chsn-all" aria-controls="hs-pro-tabs-chsn-all" role="tab" >
                      All
                    </button>
                    <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-mentions" data-hs-tab="#hs-pro-tabs-chsn-mentions" aria-controls="hs-pro-tabs-chsn-mentions" role="tab" >
                      Mentions
                    </button>
                    <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-spammed" data-hs-tab="#hs-pro-tabs-chsn-spammed" aria-controls="hs-pro-tabs-chsn-spammed" role="tab" >
                      Spammed
                    </button>
                    <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-blocked" data-hs-tab="#hs-pro-tabs-chsn-blocked" aria-controls="hs-pro-tabs-chsn-blocked" role="tab" >
                      Blocked
                    </button>
                  </nav>
               
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
                  <img
                src={chat.user.profilePictureResponse}
                className="w-8 h-8 mt-2.5 rounded-full object-cover"
                 />
                  </span>
                </div>
              </div>
              <div class="grow truncate">
                <div class="flex justify-between items-center gap-x-1">
                  <p class="truncate font-semibold text-[13px] text-gray-800">{chat.user.firstName}</p>
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