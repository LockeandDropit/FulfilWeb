import React, { useEffect, useRef, useState } from "react";

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";
import Detail from "./Detail";
import { Text, Box, Flex, Image } from "@chakra-ui/react";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import { format } from "timeago.js";
import { useMediaQuery } from "@chakra-ui/react";
import { useJobStore } from "./lib/jobsStore";
import OfferModal from "../components/OfferModal";
import { useCloseDetail } from "./lib/closeDetail";
import MarkCompleteModal from "../Messaging/MarkCompleteModal";


const Chat = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const { resetChat } = useChatStore();
  const { job, jobHiringState } = useJobStore();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const { closeDetail } = useCloseDetail()

  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "employers", user.uid, "Ratings"));

      onSnapshot(q, (snapshot) => {
        let ratingResults = [];
        snapshot.docs.forEach((doc) => {
          if (isNaN(doc.data().rating)) {
          } else {
            ratingResults.push(doc.data().rating);
          }
        });
        //cited elsewhere
        if (!ratingResults || !ratingResults.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
          setRating(0);
        } else {
          setRating(
            ratingResults.reduce((a, b) => a + b) / ratingResults.length
          );
          setNumberOfRatings(ratingResults.length);
        }
      });
    } else {
    }
  }, []);

  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });

  // }, [chat.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
      console.log("whats going on", res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  
  //this sends an email to the receiving use notifying them of their new message
  const handleSendEmail = async () => {
    const response = await fetch(
    
      "https://emailapi-qi7k.onrender.com/sendNewMessageEmail",

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: user.email}),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error)
  }



  //listener credit https://www.youtube.com/watch?v=D5SdvGMTEaU

  // useEffect(() => {
  //     document.addEventListener("keydown", handleKeyDown, true)
  // }, [])

  // const handleKeyDown = (e) => {

  //     console.log(e.key)
  //     if (e.key === "Enter") {
  //        handleSend()
  //        console.log("why not?")
  //     }
  // }

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      // if (img.file) {
      //   imgUrl = await upload(img.file);
      // }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.uid,
          text,
          createdAt: new Date(),
          // ...(imgUrl && { img: imgUrl }),
        }),
      });

      handleSendEmail()
      
      const userIDs = [currentUser.uid, user.uid];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "User Messages", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.uid ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  //this is for mobile so you can navigate from selected chat back to the list.
  const handleClearChat = () => {
    resetChat();
  };

  useEffect(() => {
    if (closeDetail === false) {
      setDetailsVisible(false)
    }
  }, [closeDetail])

  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleDetailsVisible = () => {
    setDetailsVisible(!detailsVisible);
  };

  const [offerVisible, setOfferVisible] = useState(false);

  const handleOfferVisible = () => {
    setOfferVisible(!offerVisible);
  };

  const [markCompleteVisible, setMarkCompleteVisible] = useState(false)

  const handleMarkCompleteVisible = () => {
    setMarkCompleteVisible(!markCompleteVisible)  
  }

  return (
    <>
      <div className="flex-[2_2_0%] h-full flex flex-col">
        {chat ? (
          <div class="block w-full py-2 px-1 sm:p-4 group bg-white  border-b border-gray-300 ">
            {isDesktop ? null : (
              <button
                onClick={() => handleClearChat()}
                className="mb-2 font-semibold text-sm text-gray-500 flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mt-.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                Back
              </button>
            )}

            <div class="flex gap-x-2 sm:gap-x-4">
            {user.profilePictureResponse ? (<img
               onClick={() => handleDetailsVisible()}
                src={user.profilePictureResponse}
                className="w-16 h-16 rounded-full object-cover mt-2 cursor-pointer"
              ></img>) : (
                <svg
                class="w-16 h-16  rounded-full object-cover text-gray-500"
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

              <div class="grow" onClick={() => handleDetailsVisible()}>
                <p class="font-semibold text-lg text-gray-800 cursor-pointer" onClick={() => handleDetailsVisible()}>
                  {user.firstName}
                </p>
                <p class="font-semibold text-sm text-gray-500  cursor-pointer" onClick={() => handleDetailsVisible()}>
                  Job: {chat.jobTitle}
                </p>

                <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 cursor-pointer" onClick={() => handleDetailsVisible()}>
                  {numberOfRatings ? (
                    <Flex>
                      {maxRating.map((item, key) => {
                        return (
                          <Box activeopacity={0.7} key={item} marginTop="2px">
                            <Image
                              boxSize="16px"
                              src={item <= rating ? star_filled : star_corner}
                            ></Image>
                          </Box>
                        );
                      })}
                      <p class="font-semibold text-sm text-gray-400  ml-2">
                        ({numberOfRatings} reviews)
                      </p>
                    </Flex>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="flex-shrink-0 size-4 text-gray-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>
                      <Text>No reviews yet</Text>
                    </>
                  )}
                </div>
              </div>
              {isDesktop ? null : (
                <div className="flex flex-col">
                  <button
                    onClick={() => handleDetailsVisible()}
                    type="button"
                    class="py-3 px-4  items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    See Job Details
                  </button>
                </div>
              )}
              {isDesktop ? (
                jobHiringState.isJobOffered === true &&
                jobHiringState.isHired === false ? (
                  <div className="flex flex-col">
                    {" "}
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => handleOfferVisible()}
                        class="relative inline-flex justify-center items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-md rounded-sm font-medium bg-green-100 text-green-600"
                      >
                        <button class="cursor-pointer inline-flex items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-md rounded-sm font-medium bg-green-100 text-green-600 ">
                          {user.firstName} sent you an offer!
                        </button>
                        <span class="absolute top-0 end-0 inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                          !
                        </span>
                      </button>

                      {/* <button className="inline-flex justify-end font-semibold rounded-lg border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none">see offer</button> */}
                    </div>
                    {detailsVisible === true ? (
                      <button
                        type="button"
                        onClick={() => handleDetailsVisible()}
                        class="py-3  inline-flex justify-end gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500  disabled:opacity-50 disabled:pointer-events-none "
                      >
                        See less
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 mt-0.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDetailsVisible()}
                        class="py-3  inline-flex justify-end gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 mt-0.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                          />
                        </svg>
                        Job Details
                      </button>
                    )}
                  </div>
                ) : jobHiringState.isHired === true && jobHiringState.isMarkedCompleteDoer === false ? ( <div className="flex flex-col">
                <span class="inline-flex items-center justify-center gap-x-1.5 py-1.5  ml-2 px-3 r text-sm rounded-sm font-medium bg-sky-100 text-sky-500 ">
                  In Progress
                </span>
                <button
                  type="button"
                  onClick={() => handleMarkCompleteVisible()}
                  class="py-3 px-3 mt-2 inline-flex justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white bg-sky-400 hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none "
                >
                  Mark Complete
                
                </button>
               
              </div>) : jobHiringState.isMarkedCompleteDoer === true ? (<span class="inline-flex items-center justify-center max-h-10 gap-x-1.5 py-1.5  ml-2 px-3 r text-sm rounded-sm font-medium bg-green-100 text-green-600 ">
                  Awaiting payment
                </span>) : (
                  <div className="flex flex-col">
                    {detailsVisible === true ? (
                      <div className="flex flex-col">
                        <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-sm rounded-sm font-medium bg-sky-100 text-sky-500 ">
                          Interviewing
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDetailsVisible()}
                          class="py-3  inline-flex justify-end gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        >
                          See less
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 mt-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-sm rounded-sm font-medium bg-sky-100 text-sky-500 ">
                          Interviewing
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDetailsVisible()}
                          class="py-3  inline-flex justify-end gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 mt-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                          </svg>
                          Job Details
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          className="p-5 flex-1 overflow-y-auto flex flex-col g-5 [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-track]:rounded-full"
        >
          {chat?.messages?.map((message) =>
            message.senderId === currentUser?.uid ? (
              <li class="max-w-2xl ms-auto flex justify-end mb-2   ">
                <div class="grow text-end space-y-3">
                  <div class="inline-block bg-blue-600 rounded-lg p-3 shadow-sm">
                    <p class="text-sm text-white">{message.text}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-400 leading-none">
                    {format(message.createdAt.toDate())}
                  </p>
                </div>
              </li>
            ) : (
              <li class="flex max-w-2xl gap-x-2 sm:gap-x-4 mb-4 ">
                 {user.profilePictureResponse ? (<img
             
                src={user.profilePictureResponse}
                className="w-10 h-10 rounded-full object-cover mt-2 cursor-pointer"
              ></img>) : (
                <svg
                class="w-16 h-16  rounded-full object-cover text-gray-500"
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

                <div class=" ">
                  <div class="space-y-1.5 bg-white  rounded-lg p-2  ">
                    <p class="mb-1.5 text-sm text-gray-800 ">{message.text}</p>
                  </div>
                  <p class="text-sm font-sm text-gray-400 leading-none">
                    {format(message.createdAt.toDate())}
                  </p>
                </div>
              </li>
            )
          )}
        </div>
        <div className="flex items-center justify-between p-5 gap-5 border-t border-gray-300 mt-auto">
          <input
            type="text"
            placeholder="Type your mesage here"
            className="flex w-full bg-none border-non outline-none p-3 rounded-md text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="bg-sky-400 px-3 py-2 w-1/6 rounded-lg text-white border-none outline-none cursor-pointer"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
      {detailsVisible ? <Detail /> : null}

      {offerVisible ? <OfferModal /> : null}

      {markCompleteVisible ? <MarkCompleteModal /> : null}


    </>
  );
};

export default Chat;
