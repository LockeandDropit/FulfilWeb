import React from "react";
import { useEffect, useState } from "react";
import Header from "../components/Header"
import Dashboard from "../components/Dashboard"
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useMediaQuery } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import ChatPlaceholder from "./ChatPlaceholder";
import ListPlaceholder from "./ListPlaceholder";
import ListPlaceholderMobile from "./ListPlaceholderMobile";
import ChatDashboard from "../components/ChatDashboard";
import { useJobStore } from "./lib/jobsStore";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../firebaseConfig";



const DoerChatHolder = () => {

    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId, changeChat } = useChatStore();
  
    //bring in location props from map screen here, if no null setChat in chatStore from here...
  
  
    const location = useLocation();
    const { fetchJobInfo, setJobHiringState } = useJobStore();
    const [passedChannel, setPasseChannel] = useState(null);
    const [employerData, setEmployerData] = useState(null)



  console.log("chatID from DoerChatHolder", chatId)

    useEffect(() => {
      if (location.state === null) {
        console.log("no channel passed");
        // setSelectedChannel(null);
      } else {
        console.log("passed props",location.state.data)
          if (location.state.data.channelId && location.state.data.employerID) {
            setPasseChannel(location.state.data.channelId);
            getEmployerInfo(location.state.data.employerID)
            handleJobFetch(location.state.data);
          } 
      }
    }, []);


    const handleJobFetch = async (chat) => {
      fetchJobInfo(currentUser.uid, chat.jobID, chat.jobType, chat.jobTitle);
      console.log("1", currentUser.uid, chat.jobID, chat.jobType, chat.jobTitle)
    };
  
  const getEmployerInfo = async (x) => {
    console.log("2", x)
    try {
      const docRef = doc(db, "employers", x);
      const docSnap = await getDoc(docRef);
//add code to check that jobID === JobID
      if (docSnap.exists() && docSnap.data()) {
        setEmployerData(docSnap.data())
        changeChat(location.state.data.channelId, docSnap.data())
        console.log("got it employer", docSnap.data())

      } else {
        console.log("something is wriong")
      }
    } catch (err) {
      console.log(err);
      console.log("something is wriong", err)
    }
  }
  
    useEffect(() => {
      const unSub = onAuthStateChanged(auth, (user) => {
        fetchUserInfo(user?.uid);
      });
  
      return () => {
        unSub();
      };
    }, [fetchUserInfo]);
    const [isDesktop] = useMediaQuery("(min-width: 500px)");
  
  
    console.log(currentUser);
    if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <>
    <Header />
    {isDesktop ? ( currentUser ? (
<>
<ChatDashboard />
  <ListPlaceholder />
  {chatId ? (
    <>
    <ChatPlaceholder passedChannel={passedChannel}/>
    </>
  ) : (
    <div className="flex h-screen items-center justify-center">

    {/* <div className="flex-[2_2_0%] h-full flex flex-col items-center justify-center"> */}
    <div className=" h-full flex flex-col items-center justify-center">
      <div class="ml-60 p-5 min-h-[328px] flex flex-col justify-center items-center text-center">
        <svg
          class="w-48  mb-4 "
          width="178"
          height="90"
          viewBox="0 0 178 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="27"
            y="50.5"
            width="124"
            height="39"
            rx="7.5"
            fill="currentColor"
            class="fill-white "
          />
          <rect
            x="27"
            y="50.5"
            width="124"
            height="39"
            rx="7.5"
            stroke="currentColor"
            class="stroke-gray-50 "
          />
          <rect
            x="34.5"
            y="58"
            width="24"
            height="24"
            rx="4"
            fill="currentColor"
            class="fill-gray-50 "
          />
          <rect
            x="66.5"
            y="61"
            width="60"
            height="6"
            rx="3"
            fill="currentColor"
            class="fill-gray-50 "
          />
          <rect
            x="66.5"
            y="73"
            width="77"
            height="6"
            rx="3"
            fill="currentColor"
            class="fill-gray-50 "
          />
          <rect
            x="19.5"
            y="28.5"
            width="139"
            height="39"
            rx="7.5"
            fill="currentColor"
            class="fill-white "
          />
          <rect
            x="19.5"
            y="28.5"
            width="139"
            height="39"
            rx="7.5"
            stroke="currentColor"
            class="stroke-gray-100 "
          />
          <rect
            x="27"
            y="36"
            width="24"
            height="24"
            rx="4"
            fill="currentColor"
            class="fill-gray-100 "
          />
          <rect
            x="59"
            y="39"
            width="60"
            height="6"
            rx="3"
            fill="currentColor"
            class="fill-gray-100 0"
          />
          <rect
            x="59"
            y="51"
            width="92"
            height="6"
            rx="3"
            fill="currentColor"
            class="fill-gray-100 "
          />
          <g filter="url(#filter13)">
            <rect
              x="12"
              y="6"
              width="154"
              height="40"
              rx="8"
              fill="currentColor"
              class="fill-white "
              shape-rendering="crispEdges"
            />
            <rect
              x="12.5"
              y="6.5"
              width="153"
              height="39"
              rx="7.5"
              stroke="currentColor"
              class="stroke-gray-100 "
              shape-rendering="crispEdges"
            />
            <rect
              x="20"
              y="14"
              width="24"
              height="24"
              rx="4"
              fill="currentColor"
              class="fill-gray-200  "
            />
            <rect
              x="52"
              y="17"
              width="60"
              height="6"
              rx="3"
              fill="currentColor"
              class="fill-gray-200 "
            />
            <rect
              x="52"
              y="29"
              width="106"
              height="6"
              rx="3"
              fill="currentColor"
              class="fill-gray-200 "
            />
          </g>
          <defs>
            <filter
              id="filter13"
              x="0"
              y="0"
              width="178"
              height="64"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood
                flood-opacity="0"
                result="BackgroundImageFix"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_1187_14810"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_1187_14810"
                result="shape"
              />
            </filter>
          </defs>
        </svg>

        <div class="max-w-sm mx-auto">
          <p class="mt-2 font-medium text-gray-800 ">
            No Message Selected
          </p>
          <p class="mb-5 text-sm text-gray-500 ">
            Select a message from the sidebar
          </p>
        </div>
      </div>
    </div>
    </div>
  )}
  {/* {chatId && <Detail />} */}
</>
) : null) : (


  chatId ? <ChatPlaceholder /> : <ListPlaceholderMobile />

)}


   

     
    </>
  );
};

export default DoerChatHolder