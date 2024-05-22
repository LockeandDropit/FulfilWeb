import React from "react";
import { useEffect } from "react";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";
import List from "./List";
import Chat from "./Chat";
import Detail from "./Detail";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useMediaQuery } from "@chakra-ui/react";

//95% of the chat portion of this application is due to https://github.com/safak/react-firebase-chat. He stated in his youtube video that this was free for use https://www.youtube.com/watch?v=domt_Sx-wTY&t=3034s around the 3:40 mark
const NeederChatEntry = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

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
      <Dashboard />

      <div className="flex h-screen items-center justify-center">
        <div className="w-full h-5/6 sm:w-4/5 sm:h-4/5 sm:ml-40 bg-white border rounded-md flex">


    {isDesktop ? ( currentUser ? (




<>



  <List />
  {chatId ? (
    <Chat />
  ) : (
    <div className="flex-[2_2_0%] h-full flex flex-col items-center justify-center">
      <div class="p-5 min-h-[328px] flex flex-col justify-center items-center text-center">
        <svg
          class="w-48 mx-auto mb-4"
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
  )}
  {/* {chatId && <Detail />} */}
</>
) : null) : (


  chatId ? <Chat /> : <List />

)}


         
        </div>
      </div>
    </>
  );
};

export default NeederChatEntry;
