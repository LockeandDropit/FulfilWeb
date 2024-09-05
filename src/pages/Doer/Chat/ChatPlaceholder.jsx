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
import Markdown from "react-markdown";
import { db } from "../../../firebaseConfig";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";
import { useLocation } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { Text, Box, Flex, Image } from "@chakra-ui/react";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import { format } from "timeago.js";
import OfferModal from "../components/OfferModal";
import { useMediaQuery } from "@chakra-ui/react";
import Detail from "./Detail";
import NeederProfileModal from "../components/NeederProfileModal";
import MarkCompleteModal from "../Messaging/MarkCompleteModal";
import { useJobStore } from "./lib/jobsStore";

import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import ListPlaceholder from "./ListPlaceholder";

const ChatPlaceholder = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const { resetChat } = useChatStore();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
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

  const location = useLocation();

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

  const { job, jobHiringState, isJobLoading, fetchJobInfo } = useJobStore();

  console.log("job from Doer ChjatPlaceholder", job);

  const endRef = useRef(null);

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });

  // }, [chat]);

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
        body: JSON.stringify({ email: user.email }),
      }
    );

    const { data, error } = await response.json();
    console.log("Any issues?", error);
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
      console.log(res.data());
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

      handleSendEmail();

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

  //offer handling

  //this one is for requests
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const handleOfferOpen = () => {
    setOfferModalOpen(true);
    console.log("hitting");
  };

  //this one is for already created job posts

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenFlatRate,
    onOpen: onOpenFlatRate,
    onClose: onCloseFlatRate,
  } = useDisclosure();

  const [hourlyModalVisible, setHourlyModalVisible] = useState(false);
  const [flatRateModalVisible, setFlatRateModalVisible] = useState(false);
  const [offerPostedJobVisible, setOfferPostedJobVisible] = useState(false);

  const handleModalOpen = () => {
    setOfferPostedJobVisible(!offerPostedJobVisible);
  };

  //this is for mobile so you can navigate from selected chat back to the list.
  const handleClearChat = () => {
    resetChat();
  };

  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleDetailsVisible = () => {
    setDetailsVisible(!detailsVisible);
  };

  const [paymentVisible, setPaymentVisible] = useState(false);

  const handlePaymentVisible = () => {
    setPaymentVisible(!paymentVisible);
  };

  const [doerModalVisbile, setDoerModalVisible] = useState(false);

  const handleDoerModalVisbile = () => {
    setDoerModalVisible(!doerModalVisbile);
  };

  console.log("what do i have?", job);

  //height calc help credit Ryu-The-Sick https://www.reddit.com/r/tailwindcss/comments/v7jarp/how_do_i_make_the_height_of_a_div_the_height_of/

  const [neederProfileVisible, setNeederProfileVisible] = useState(false);

  const handleNeederProfileVisible = () => {
    setNeederProfileVisible(!neederProfileVisible);
  };

  const [offerVisible, setOfferVisible] = useState(false);

  const handleOfferVisible = () => {
    setOfferVisible(!offerVisible);
  };

  useEffect(() => {
    console.log("location", location.state);
    if (location.state === null) {
    } else {
      if (location.state.profileModalReset) {
        setNeederProfileVisible(false);
      } else if (location.state.offerReset) {
        setOfferVisible(false);
      }
    }
  }, [location]);

  const [markCompleteVisible, setMarkCompleteVisible] = useState(false);

  const handleMarkCompleteVisible = () => {
    setMarkCompleteVisible(!markCompleteVisible);
  };

  if (isJobLoading) return <div className="loading">Loading...</div>;
  return (
    <>
      <body class="hs-overlay-body-open lg:ml-[296px] lg:w-[calc(100vw-316px)] sm:h-[calc(100vh-100px)] mt-16 bg-gray-100">
        <main
          id="content"
          class="2xl:hs-overlay-layout-open:pe-96 xl:ps-72 transition-all duration-300 "
        >
          <div
            id="hs-pro-tabs-chct-1"
            role="tabpanel"
            aria-labelledby="hs-pro-tabs-chct-item-1"
          >
            <div class="relative h-dvh flex flex-col justify-end">
              <header class="sticky h-24 top-12 inset-x-0 z-20 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
                <div class="lg:hidden w-20 sm:w-auto flex items-center">
                  <div class="-ms-3">
                    <button
                      onClick={() => resetChat()}
                      type="button"
                      class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-sidebar"
                      aria-controls="hs-pro-sidebar"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="flex-shrink-0 size-4 -ms-1"
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
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => onOpenDetails()}
                    class="truncate flex items-center gap-x-3.5 focus:outline-none cursor-default"
                    data-hs-overlay="#hs-pro-chhds1"
                    aria-controls="hs-pro-chhds1"
                    aria-label="Toggle navigation"
                  >
                    <span class="lg:block  relative flex-shrink-0">
                      {user.profilePictureResponse ? (
                        <img
                          class="flex-shrink-0 size-12 rounded-full"
                          src={user.profilePictureResponse}
                        />
                      ) : (
                        <svg
                          class="w-12 h-12  rounded-full object-cover text-gray-500"
                          width="12"
                          height="12"
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
                    </span>
                    <span class="grow text-center justify-center align-center items-center lg:text-start truncate">
                      <span class="truncate block font-semibold text-lg leading-4 text-gray-800 ">
                        {user.firstName} {user.lastName}
                      </span>
                      {isDesktop ? null : (
                        <span class="truncate block text-xs text-blue-600 leading-4">
                          See details
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {isDesktop ? (
                  <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
                    {/* add here if you want anything in the end of the internal header */}

                    {/* {jobHiringState.isJobOffered === true &&
                      jobHiringState.isHired === false ? (
                        <span    onClick={() => handleOfferVisible()} class=" cursor-pointer py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                
                {user.firstName} sent you an offer!
                <span class="absolute top-5 end-5 inline-flex items-center py-1 px-1 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
                          
                        </span>
                      </span>
                      ) : jobHiringState.isHired === true &&
                        jobHiringState.isMarkedCompleteDoer === false ? (
                          <span class="py-1.5 ps-1.5  px-1 inline-flex items-center  text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Job Accepted!
                        </span>
                      ) : jobHiringState.isMarkedCompleteDoer === true ? (
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                 <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                       Awaiting confirmation
                      </span>
                      ) : (
                        <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                
                        Interviewing
                      </span>
                      )}
                  
              */}
                  </div>
                ) : null}
              </header>

              <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div class="p-4 space-y-5">
                  <div class="relative">
                    <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                      <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">
                        {/* {chat?.messages ? <p>Today</p> : null} */}
                      </span>
                    </div>

                    <div class="w-full space-y-5 ">
                      {/* NEW CHAT */}

                      {chat?.messages?.map((message) =>
                        message.senderId === currentUser?.uid ? (
                          <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                            <div>
                              <p class="mb-1.5 pe-2.5 text-xs text-gray-400">
                                {currentUser.firstName}
                              </p>

                              <div class="space-y-1">
                                <div class="group flex justify-end gap-x-2 word-break: break-word">
                                  <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                    <div class="text-sm text-gray-800">
                                      {message.text}
                                    </div>
                                    <span class="text-[11px] text-end text-blue-600 italic">
                                      {" "}
                                      {format(message.createdAt.toDate())}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="flex-shrink-0 mt-auto">
                              {currentUser.profilePictureResponse ? (
                                <img
                                  class="flex-shrink-0 size-8 rounded-full"
                                  src={currentUser.profilePictureResponse}
                                />
                              ) : (
                                <svg
                                  class="w-12 h-12  rounded-full object-cover text-gray-500"
                                  width="12"
                                  height="12"
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
                            </div>
                          </div>
                        ) : (
                          <div class="max-w-md flex gap-x-2 ">
                            <div class="flex-shrink-0 mt-auto">
                              {user.profilePictureResponse ? (
                                <img
                                  class="flex-shrink-0 size-8 rounded-full"
                                  src={user.profilePictureResponse}
                                />
                              ) : (
                                <svg
                                  class="w-12 h-12  rounded-full object-cover text-gray-500"
                                  width="12"
                                  height="12"
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
                            </div>

                            <div>
                              <p class="mb-1.5 ps-2.5 text-xs text-gray-400">
                                {user.firstName}
                              </p>

                              <div class="space-y-1">
                                <div class="group flex justify-start gap-x-2 word-break: break-word">
                                  <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                    <div class="text-sm text-gray-800">
                                      {message.text}
                                    </div>
                                    <span>
                                      <span class="text-[11px] text-gray-400 italic">
                                        {" "}
                                        {format(message.createdAt.toDate())}
                                      </span>
                                    </span>
                                  </div>

                                  <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
                <label for="hs-chat-autoheight-textarea-1" class="sr-only">
                  Message
                </label>

                <div class="pb-2 ps-2">
                  <textarea
                    id="hs-chat-autoheight-textarea-1"
                    class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    placeholder="Type your message here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>

                  <div class="pe-4 flex justify-between items-center gap-x-1">
                    <div class="flex items-center gap-x-1"></div>

                    <div class="flex items-center gap-x-1">
                      <button
                        onClick={handleSend}
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span class="sr-only">Send</span>
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <aside
              id="hs-pro-chhds1"
              class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[0]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         "
            >
              <div class="h-full flex flex-col">
                <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
                  <h3 class="font-semibold text-gray-800">Details</h3>

                  <div class="absolute top-2 end-4 z-10">
                    <button
                      type="button"
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-overlay="#hs-pro-chhds1"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
                  {user.profilePictureResponse ? (
                    <img
                      class="flex-shrink-0 size-16 rounded-full"
                      src={user.profilePictureResponse}
                    />
                  ) : (
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
                  <div class="mt-2 w-full">
                    <h2 class="text-lg font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h2>

                    <div class="mt-4 flex justify-center items-center gap-x-3">
                      <button
                        onClick={() => handleNeederProfileVisible()}
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        View profile
                      </button>
                    </div>
                  </div>
                </div>

                <div class="w-full">
                  <div class="hs-accordion-group" data-hs-accordion-always-open>
                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsudc1"
                    >
                   

                      <div
                        id="hs-pro-chdsudc1-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsudc1"
                      >
                        <div class="px-5 mb-2">
                          <dl class="">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-xl text-gray-500">
                                <p class="font-medium text-lg text-gray-800 mt-2">
                                  {job.jobTitle}
                                </p>
                              </p>
                            </dt>
                          </dl>

                          
                              <p class="inline-flex items-center gap-x-2 text-lg text-gray-500">
                                {job.isVolunteer ? (
                                  <p>Volunteer!</p>
                                ) : job.isSalaried ? (
                                  <p class="font-medium text-base text-gray-800">
                                    ${job.shortenedSalary} - $
                                    {job.shortenedUpperSalary} year
                                  </p>
                                ) : job.upperRate > job.lowerRate ? (
                                  <p class="font-medium text-base text-gray-800">
                                    ${job.lowerRate}/hr - ${job.upperRate}/hr
                                  </p>
                                ) : (
                                  <p class="font-medium text-base text-gray-800">
                                    ${job.lowerRate}/hr
                                  </p>
                                )}
                              </p>
                          
                          <div className="flex flex-col">
                          {job.isFullTime ? (
                            <p class="inline-flex items-center gap-x-2 text-base text-gray-500">
                              Full-time
                            </p>
                          ) : (
                            <p class="inline-flex items-center gap-x-2 text-base text-gray-500">
                              Part-time
                            </p>
                          )}

                          <p class="inline-flex items-center gap-x-2 text-base text-gray-500">
                            {job.streetAddress}, {job.city}, MN
                          </p>

                         
                          <div className="mt-6 w-full prose prose-li font-inter marker:text-black  line-clamp-6 ">
                            <Markdown>
                              {job.description}
                            </Markdown>
                          </div>
                          <div className="flex justify-center mt-4">
                          <button
                                       onClick={() => onOpenDrawer()}
                                            className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                          >
                                            See More
                                          </button>
                          </div>
                          </div>
                          {/* <div className="flex justify-center mt-4">
                          <button
                                       
                                            className="py-2 px-3 w-full  text-sm font-semibold rounded-md border border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 "
                                          >
                                            See More
                                          </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <Drawer
            onClose={onCloseDrawer}
            isOpen={isOpenDrawer}
            size={"xl"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{job.jobTitle}</DrawerHeader>
              <DrawerBody>
                <div class="">
                
                  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                      <div class="p-4">
                        <div class=" ">
                          <div className="flex">
                            <label
                              for="hs-pro-dactmt"
                              class="block mb-2 text-xl font-medium text-gray-900"
                            >
                              {job.jobTitle}
                            </label>

                           
                          </div>
                          {job.isFullTimePosition === true ? (
                            <label
                              for="hs-pro-dactmt"
                              class="block  text-lg font-medium text-gray-800"
                            >
                              Full-time
                            </label>
                          ) : (
                            <label
                              for="hs-pro-dactmt"
                              class="block  text-lg font-medium text-gray-800 "
                            >
                              Part-time
                            </label>
                          )}

                          {job.isHourly ? (
                            <div class="space-y-1 ">
                              <div class="flex align-items-center">
                                <p className=" text-md font-medium">$</p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block text-md font-medium text-gray-800 "
                                >
                                  {job.lowerRate}
                                </label>
                                <p className=" text-md font-medium">
                                  /hour - $
                                </p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {job.upperRate}
                                </label>
                                <p className=" text-md font-medium">/hour</p>
                              </div>
                            </div>
                          ) : null}

                          {job.isSalaried ? (
                            <div class="space-y-2 ">
                              <div class="flex align-items-center">
                                <p className=" text-md font-medium">$</p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {job.lowerRate}
                                </label>
                                <p className="ml-1 text-md font-medium ">
                                  yearly - $
                                </p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  {job.upperRate}
                                </label>
                                <p className=" ml-1 c font-medium">yearly</p>
                                {job.isEstimatedPay ? (
                                  <p>*</p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          {job.isEstimatedPay ? (
                            <div className="mb-2 flex flex-col w-full text-sm ">
                              <a href="https://www.glassdoor.com/index.htm">
                                *Estimate. Powered by{" "}
                                <img
                                  src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png"
                                  title="Job Search"
                                />
                              </a>
                            </div>
                          ) : null}
                          <p class="block  text-md font-medium text-gray-800 ">
                            {job.streetAddress},{" "}
                            {job.city},{" "}
                            {job.state}
                          </p>
                          {job.isEstimatedAddress ? (
                            <p class="block italic text-sm  text-gray-800 ">
                              Address may not be exact
                            </p>
                          ) : null}
                          <p class="font-semibold text-md text-gray-500  cursor-default">
                            <span className="font-semibold text-md text-slate-700">
                              {" "}
                              Posted:
                            </span>{" "}
                            {job.datePosted}
                          </p>
                          <p class="font-semibold text-md text-slate-700 cursor-pointer">
                            Employer:
                          </p>
                          <div className="flex">
                            {job.employerProfilePicture ? (
                              <>
                                <div class="flex flex-col justify-center items-center size-[56px]  ">
                                  <img
                                    src={
                                      job.employerProfilePicture
                                    }
                                    class="flex-shrink-0 size-[64px] rounded-full"
                                  />

                                  <div className="flex flex-col ml-4">
                                    <p class="font-semibold text-md text-gray-500  mt-2 cursor-pointer">
                                      {job.businessName}
                                    </p>
                                    <p class="font-semibold text-md text-gray-500 cursor-default ">
                                      {job.city}, Minnesota
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            <div className="flex flex-col">
                              <p class="font-semibold text-md text-gray-500  mt-1 cursor-pointer">
                                {job.companyName}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="space-y-2 mt-10 mb-4 ">
                          <label
                            for="dactmi"
                            class="block mb-2 text-lg font-medium text-gray-900 "
                          >
                            What you'll be doing
                          </label>
                          <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                            <Markdown>
                              {job.description}
                            </Markdown>
                          </div>
                        </div>
                        {job.bio ? (
                          <div class="space-y-2 mt-10 mb-4">
                            <label
                              for="dactmi"
                              class="block mb-2 text-md font-medium text-gray-800 "
                            >
                              About {job.companyName}
                            </label>

                            <div class="mb-4">
                              <p>{job.bio}</p>
                            </div>
                          </div>
                        ) : null}

                        <div class="space-y-2 mb-4 ">
                          <label
                            for="dactmi"
                            class="block mb-2 text-lg font-medium text-gray-900 "
                          >
                            Job Requirements
                          </label>

                          <div className="prose prose-li  font-inter marker:text-black mb-4">
                            <Markdown>
                              {job.applicantDescription}
                            </Markdown>
                          </div>
                        </div>
                        <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                          <label
                            for="dactmi"
                            class="block mb-2 text-lg font-medium text-gray-900 "
                          >
                            Employment Benefits
                          </label>

                          <div className="prose prose-li  font-inter marker:text-black mb-4">
                            {job.benefitsDescription ? (
                              <Markdown>
                                {job.benefitsDescription}
                              </Markdown>
                            ) : (
                              <p>Nothing listed</p>
                            )}
                          </div>
                        </div>
                      </div>

                     
                               
                        
                 
                    </div>
                  </div>
                </div>
              </DrawerBody>
              
            </DrawerContent>
          </Drawer>

          <div
            id="hs-pro-tabs-chct-2"
            class="hidden"
            role="tabpanel"
            aria-labelledby="hs-pro-tabs-chct-item-2"
          >
            <div class="relative h-dvh flex flex-col justify-end">
              <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
                <div class="lg:hidden w-20 sm:w-auto flex items-center">
                  <div class="-ms-3">
                    <button
                      type="button"
                      class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-sidebar"
                      aria-controls="hs-pro-sidebar"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="flex-shrink-0 size-4 -ms-1"
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
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    class="truncate flex items-center gap-x-3.5 focus:outline-none"
                    data-hs-overlay="#hs-pro-chhds2"
                    aria-controls="hs-pro-chhds2"
                    aria-label="Toggle navigation"
                  >
                    <span class="lg:block hidden relative flex-shrink-0">
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-indigo-500 text-white rounded-full">
                        R
                      </span>
                      <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                    </span>
                    <span class="grow text-center lg:text-start truncate">
                      <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                        Rachel Doe
                      </span>
                      <span class="truncate block text-xs text-gray-500 leading-4">
                        Last seen 5 mins ago
                      </span>
                    </span>
                  </button>
                </div>

                <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhsn"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                        <path d="M22 8c0-2.3-.8-4.3-2-6" />
                      </svg>
                      <span class="sr-only">Snooze</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Snooze
                    </span>
                  </div>

                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhtgm"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      <span class="sr-only">Tags</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Tags
                    </span>
                  </div>

                  <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                    <button
                      id="hs-pro-cht2hmd"
                      type="button"
                      class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>

                    <div
                      class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg"
                      aria-labelledby="hs-pro-cht2hmd"
                    >
                      <div class="p-1 space-y-1">
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          Mark as unread
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                            <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                          </svg>
                          Mark as read
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsn"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                            <path d="M22 8c0-2.3-.8-4.3-2-6" />
                          </svg>
                          Snooze
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhtgm"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                            <circle
                              cx="7.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          Tags
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsh"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                          Share
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsp"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          Spam
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhbu"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                          Block user
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhdl"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
                    <button
                      type="button"
                      class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds2"
                      aria-controls="hs-pro-chhds2"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="xl:hidden flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m10 15-3-3 3-3" />
                      </svg>
                      <svg
                        class="hidden xl:block flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m8 9 3 3-3 3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds2"
                      aria-controls="hs-pro-chhds2"
                      aria-label="Toggle navigation"
                    >
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-indigo-500 text-white rounded-full">
                        R
                      </span>
                      <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                    </button>
                  </div>
                </div>
              </header>

              <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div class="p-4 space-y-5">
                  <div class="w-full space-y-5">
                    <div class="max-w-md flex gap-x-2">
                      <div class="flex-shrink-0 mt-auto">
                        <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-indigo-500 text-white">
                          R
                        </span>
                      </div>

                      <div>
                        <p class="mb-1.5 ps-2.5 text-xs text-gray-400">
                          Rachel
                        </p>

                        <div class="space-y-1">
                          <div class="group flex justify-start gap-x-2 word-break: break-word">
                            <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                              <div class="text-sm text-gray-800">
                                Hello
                                <span>
                                  <span class="text-[11px] text-gray-400 italic">
                                    11:10
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                              <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                <button
                                  id="hs-pro-cht2cmd_1"
                                  type="button"
                                  class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                >
                                  <svg
                                    class="flex-shrink-0 size-4 rounded-full"
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
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>

                                <div
                                  class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                  aria-labelledby="hs-pro-cht2cmd_1"
                                >
                                  <div class="p-1">
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                      Edit
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="m10 7-3 3 3 3" />
                                        <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                      </svg>
                                      Reply
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                      </svg>
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="group flex justify-start gap-x-2 word-break: break-word">
                            <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                              <div class="text-sm text-gray-800">
                                {/* <img class="mb-2 rounded-lg" src="../../assets/img/mockups/img12.jpg" alt="Image Description" >
                              When using open method,<br><code>const select = new</code><br>it creates another instance of the select.
                  </img> */}
                                <span>
                                  <span class="text-[11px] text-gray-400 italic">
                                    11:10
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                              <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                <button
                                  id="hs-pro-cht2cmd_2"
                                  type="button"
                                  class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                >
                                  <svg
                                    class="flex-shrink-0 size-4 rounded-full"
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
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>

                                <div
                                  class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                  aria-labelledby="hs-pro-cht2cmd_2"
                                >
                                  <div class="p-1">
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                      Edit
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="m10 7-3 3 3 3" />
                                        <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                      </svg>
                                      Reply
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                      </svg>
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="group flex justify-start gap-x-2 word-break: break-word">
                            <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                              <div class="text-sm text-gray-800">
                                <img
                                  class="mb-2 rounded-lg"
                                  src="../../assets/img/mockups/img10.jpg"
                                  alt="Image Description"
                                />
                                2. Using the static method causes an error in
                                the console.
                                <span>
                                  <span class="text-[11px] text-gray-400 italic">
                                    11:12
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                              <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                <button
                                  id="hs-pro-cht2cmd_3"
                                  type="button"
                                  class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                >
                                  <svg
                                    class="flex-shrink-0 size-4 rounded-full"
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
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>

                                <div
                                  class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                  aria-labelledby="hs-pro-cht2cmd_3"
                                >
                                  <div class="p-1">
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                      Edit
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="m10 7-3 3 3 3" />
                                        <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                      </svg>
                                      Reply
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                      </svg>
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
                <label for="hs-chat-autoheight-textarea-2" class="sr-only">
                  Message
                </label>

                <div class="pb-2 ps-2">
                  <textarea
                    id="hs-chat-autoheight-textarea-2"
                    class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    placeholder="Message Rachel"
                  ></textarea>

                  <div class="pe-4 flex justify-between items-center gap-x-1">
                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span class="sr-only">Attach file</span>
                      </button>

                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M22 11v1a10 10 0 1 1-9-10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" x2="9.01" y1="9" y2="9" />
                          <line x1="15" x2="15.01" y1="9" y2="9" />
                          <path d="M16 5h6" />
                          <path d="M19 2v6" />
                        </svg>
                        <span class="sr-only">Add emoji</span>
                      </button>
                    </div>

                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                        <span class="sr-only">Send voice message</span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span class="sr-only">Send</span>
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <aside
              id="hs-pro-chhds2"
              class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         "
            >
              <div class="h-full flex flex-col">
                <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
                  {/* <h3 class="font-semibold text-gray-800 cursor-default">Details</h3> */}

                  <div class="absolute top-2 end-4 z-10">
                    <button
                      type="button"
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-overlay="#hs-pro-chhds2"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
                  <span class="flex flex-shrink-0 justify-center items-center size-16 text-2xl font-medium uppercase bg-indigo-500 text-white rounded-full">
                    R
                  </span>
                  <div class="mt-2 w-full">
                    <h2 class="text-lg font-semibold text-gray-800">
                      Rachel Doe
                    </h2>
                    <p class="mb-2 text-[13px] text-gray-500">
                      Last seen 5 mins ago
                    </p>

                    <div class="mt-4 flex justify-center items-center gap-x-3">
                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        View profile
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Send email
                      </button>
                    </div>
                  </div>
                </div>

                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div class="hs-accordion-group" data-hs-accordion-always-open>
                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsudc2"
                    >
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdsudc2-collapse"
                      >
                        <span class="text-sm font-medium">User details</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdsudc2-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsudc2"
                      >
                        <div class="px-5 pb-5">
                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                Country:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                Netherlands
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Email:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                rachel@gmail.com
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Phone:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                +297 000-00-00
                              </p>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div class="hs-accordion active" id="hs-pro-chdssmc2">
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdssmc2-collapse"
                      >
                        <span class="text-sm font-medium">Shared media</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdssmc2-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdssmc2"
                      >
                        <div class="pb-5 px-5">
                          <div class="grid grid-cols-3 gap-px">
                            <img
                              class="flex-shrink-0 size-[110px] rounded-lg object-cover"
                              src="../../assets/img/mockups/img10.jpg"
                              alt="Image Description"
                            />
                            <img
                              class="flex-shrink-0 size-[110px] rounded-lg object-cover"
                              src="../../assets/img/mockups/img12.jpg"
                              alt="Image Description"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div
            id="hs-pro-tabs-chct-3"
            class="hidden"
            role="tabpanel"
            aria-labelledby="hs-pro-tabs-chct-item-3"
          >
            <div class="relative h-dvh flex flex-col justify-end">
              <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
                <div class="lg:hidden w-20 sm:w-auto flex items-center">
                  <div class="-ms-3">
                    <button
                      type="button"
                      class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-sidebar"
                      aria-controls="hs-pro-sidebar"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="flex-shrink-0 size-4 -ms-1"
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
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    class="truncate flex items-center gap-x-3.5 focus:outline-none"
                    data-hs-overlay="#hs-pro-chhds3"
                    aria-controls="hs-pro-chhds3"
                    aria-label="Toggle navigation"
                  >
                    <span class="lg:block hidden relative flex-shrink-0">
                      <img
                        class="flex-shrink-0 size-8 rounded-full"
                        src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                        alt="Avatar"
                      />
                      <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                    </span>
                    <span class="grow text-center lg:text-start truncate">
                      <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                        Lewis Clarke
                      </span>
                      <span class="truncate block text-xs text-gray-500 leading-4">
                        Last seen 12 mins ago
                      </span>
                    </span>
                  </button>
                </div>

                <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhsn"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                        <path d="M22 8c0-2.3-.8-4.3-2-6" />
                      </svg>
                      <span class="sr-only">Snooze</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Snooze
                    </span>
                  </div>

                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhtgm"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      <span class="sr-only">Tags</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Tags
                    </span>
                  </div>

                  <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                    <button
                      id="hs-pro-cht3hmd"
                      type="button"
                      class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>

                    <div
                      class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg"
                      aria-labelledby="hs-pro-cht3hmd"
                    >
                      <div class="p-1 space-y-1">
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          Mark as unread
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                            <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                          </svg>
                          Mark as read
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsn"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                            <path d="M22 8c0-2.3-.8-4.3-2-6" />
                          </svg>
                          Snooze
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhtgm"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                            <circle
                              cx="7.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          Tags
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsh"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                          Share
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsp"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          Spam
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhbu"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                          Block user
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhdl"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
                    <button
                      type="button"
                      class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds3"
                      aria-controls="hs-pro-chhds3"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="xl:hidden flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m10 15-3-3 3-3" />
                      </svg>
                      <svg
                        class="hidden xl:block flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m8 9 3 3-3 3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds3"
                      aria-controls="hs-pro-chhds3"
                      aria-label="Toggle navigation"
                    >
                      <img
                        class="flex-shrink-0 size-8 rounded-full"
                        src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                        alt="Avatar"
                      />
                      <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                    </button>
                  </div>
                </div>
              </header>

              <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div class="p-4 space-y-5">
                  <div class="w-full space-y-4">
                    <div class="max-w-md flex gap-x-2">
                      <div class="flex-shrink-0 mt-auto">
                        <img
                          class="flex-shrink-0 size-8 rounded-full"
                          src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                          alt="Avatar"
                        />
                      </div>

                      <div>
                        <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Lewis</p>

                        <div class="space-y-1">
                          <div class="group flex justify-start gap-x-2 word-break: break-word">
                            <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                              <div class="text-sm text-gray-800">
                                <div class="mb-1 grid grid-cols-2 gap-x-1">
                                  <img
                                    class="flex-shrink-0 size-[10.25rem] rounded-s-md object-cover"
                                    src="../../assets/img/900x556/img6.jpg"
                                    alt="Image Description"
                                  />
                                  <div class="space-y-1">
                                    <img
                                      class="flex-shrink-0 h-20 rounded-tr-md object-cover"
                                      src="../../assets/img/900x556/img6.jpg"
                                      alt="Image Description"
                                    />
                                    <img
                                      class="flex-shrink-0 h-20 rounded-br-md object-cover"
                                      src="../../assets/img/900x556/img1.jpg"
                                      alt="Image Description"
                                    />
                                  </div>
                                </div>
                                How's these all free? 🤯
                                <span>
                                  <span class="text-[11px] text-gray-400 italic">
                                    07:02
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                              <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                <button
                                  id="hs-pro-cht3cmd_1"
                                  type="button"
                                  class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                >
                                  <svg
                                    class="flex-shrink-0 size-4 rounded-full"
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
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>

                                <div
                                  class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                  aria-labelledby="hs-pro-cht3cmd_1"
                                >
                                  <div class="p-1">
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                      Edit
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <path d="m10 7-3 3 3 3" />
                                        <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                      </svg>
                                      Reply
                                    </a>
                                    <a
                                      class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                      href="#"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-3.5"
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
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                      </svg>
                                      Delete
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
                <label for="hs-chat-autoheight-textarea-3" class="sr-only">
                  Message
                </label>

                <div
                  id="hs-ch1trc"
                  class="hs-removing:opacity-0 transition duration-100 py-2.5 px-[26px] border-b border-gray-100"
                >
                  <div class="flex justify-between items-center gap-x-3 border-s-2 border-blue-600 ps-2">
                    <div class="w-full">
                      <p class="font-medium text-xs text-blue-600">
                        Reply to Lewis
                      </p>
                      <p class="text-xs text-gray-800">
                        How's these all free? 🤯
                      </p>
                    </div>
                    <div class="grow">
                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                        data-hs-remove-element="#hs-ch1trc"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="pb-2 ps-2">
                  <textarea
                    id="hs-chat-autoheight-textarea-3"
                    class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    placeholder="Message Lewis"
                  >
                    This is little appreciation to community! 🤭
                  </textarea>

                  <div class="pe-4 flex justify-between items-center gap-x-1">
                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span class="sr-only">Attach file</span>
                      </button>

                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M22 11v1a10 10 0 1 1-9-10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" x2="9.01" y1="9" y2="9" />
                          <line x1="15" x2="15.01" y1="9" y2="9" />
                          <path d="M16 5h6" />
                          <path d="M19 2v6" />
                        </svg>
                        <span class="sr-only">Add emoji</span>
                      </button>
                    </div>

                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                        <span class="sr-only">Send voice message</span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span class="sr-only">Send</span>
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <aside
              id="hs-pro-chhds3"
              class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         "
            >
              <div class="h-full flex flex-col">
                <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
                  {/* <h3 class="font-semibold text-gray-800">Details</h3> */}

                  <div class="absolute top-2 end-4 z-10">
                    <button
                      type="button"
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-overlay="#hs-pro-chhds3"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
                  <img
                    class="flex-shrink-0 size-16 rounded-full"
                    src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                    alt="Avatar"
                  />
                  <div class="mt-2 w-full">
                    <h2 class="text-lg font-semibold text-gray-800">
                      Lewis Clarke
                    </h2>
                    <p class="mb-2 text-[13px] text-gray-500">
                      Last seen 12 mins ago
                    </p>

                    <div class="mt-4 flex justify-center items-center gap-x-3">
                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        View profile
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Send email
                      </button>
                    </div>
                  </div>
                </div>

                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div class="hs-accordion-group" data-hs-accordion-always-open>
                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsudc3"
                    >
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdsudc3-collapse"
                      >
                        <span class="text-sm font-medium">User details</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdsudc3-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsudc3"
                      >
                        <div class="px-5 pb-5">
                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M12 12h.01" />
                                  <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                  <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                  <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="6"
                                    rx="2"
                                  />
                                </svg>
                                Company:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                Acroma
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                Country:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                United States
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Email:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                lewis@acroma.com
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                  <path d="M2 12h20" />
                                </svg>
                                Site:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <a
                                class="align-top text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-none focus:underline"
                                href="#"
                              >
                                acroma.com
                              </a>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div class="hs-accordion active" id="hs-pro-chdssmc3">
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdssmc3-collapse"
                      >
                        <span class="text-sm font-medium">Shared media</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdssmc3-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdssmc3"
                      >
                        <div class="pb-5 px-5">
                          <p class="text-sm text-gray-500">
                            Only shared images appear here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div
            id="hs-pro-tabs-chct-4"
            class="hidden"
            role="tabpanel"
            aria-labelledby="hs-pro-tabs-chct-item-4"
          >
            <div class="relative h-dvh flex flex-col justify-end">
              <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
                <div class="lg:hidden w-20 sm:w-auto flex items-center">
                  <div class="-ms-3">
                    <button
                      type="button"
                      class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-sidebar"
                      aria-controls="hs-pro-sidebar"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="flex-shrink-0 size-4 -ms-1"
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
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    class="truncate flex items-center gap-x-3.5 focus:outline-none"
                    data-hs-overlay="#hs-pro-chhds4"
                    aria-controls="hs-pro-chhds4"
                    aria-label="Toggle navigation"
                  >
                    <span class="lg:block hidden relative flex-shrink-0">
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-orange-500 text-white rounded-full">
                        T
                      </span>
                    </span>
                    <span class="grow text-center lg:text-start truncate">
                      <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                        Technical issues
                      </span>
                      <span class="truncate block text-xs text-gray-500 leading-4">
                        4 members
                      </span>
                    </span>
                  </button>
                </div>

                <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhsn"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                        <path d="M22 8c0-2.3-.8-4.3-2-6" />
                      </svg>
                      <span class="sr-only">Snooze</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Snooze
                    </span>
                  </div>

                  <div class="hs-tooltip hidden sm:inline-block">
                    <button
                      type="button"
                      class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhtgm"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      <span class="sr-only">Tags</span>
                    </button>
                    <span
                      class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap"
                      role="tooltip"
                    >
                      Tags
                    </span>
                  </div>

                  <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                    <button
                      id="hs-pro-cht4hmd"
                      type="button"
                      class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                    >
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>

                    <div
                      class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg"
                      aria-labelledby="hs-pro-cht4hmd"
                    >
                      <div class="p-1 space-y-1">
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          Mark as unread
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                            <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                          </svg>
                          Mark as read
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsn"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
                            <path d="M22 8c0-2.3-.8-4.3-2-6" />
                          </svg>
                          Snooze
                        </button>
                        <button
                          type="button"
                          class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhtgm"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                            <circle
                              cx="7.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            />
                          </svg>
                          Tags
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsh"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                          Share
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhsp"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          Spam
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhbu"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                          Block user
                        </button>
                        <button
                          type="button"
                          class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          data-hs-overlay="#hs-pro-chhdl"
                        >
                          <svg
                            class="flex-shrink-0 size-3.5"
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
                    <button
                      type="button"
                      class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds4"
                      aria-controls="hs-pro-chhds4"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        class="xl:hidden flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m10 15-3-3 3-3" />
                      </svg>
                      <svg
                        class="hidden xl:block flex-shrink-0 size-4"
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
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M15 3v18" />
                        <path d="m8 9 3 3-3 3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      data-hs-overlay="#hs-pro-chhds4"
                      aria-controls="hs-pro-chhds4"
                      aria-label="Toggle navigation"
                    >
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-orange-500 text-white rounded-full">
                        T
                      </span>
                    </button>
                  </div>
                </div>
              </header>

              <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                <div class="p-4 space-y-5">
                  <div class="relative space-y-5">
                    <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                      <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">
                        01 May
                      </span>
                    </div>

                    <div class="w-full space-y-4">
                      <div class="max-w-md flex gap-x-2">
                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                            alt="Avatar"
                          />
                        </div>

                        <div>
                          <p class="mb-1.5 ps-2.5 text-xs text-gray-400">
                            Lousie
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  Hello everyone
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:49
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_1"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_1"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                        <div>
                          <p class="mb-1.5 pe-2.5 text-xs text-gray-400">
                            James
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-end gap-x-2 word-break: break-word">
                              <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  Hi Lousie
                                  <span>
                                    <span class="text-[11px] text-end text-blue-600 italic">
                                      18:39
                                    </span>
                                    <svg
                                      class="inline-block flex-shrink-0 size-4 text-blue-600"
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
                                      <path d="M18 6 7 17l-5-5" />
                                      <path d="m22 10-7.5 7.5L13 16" />
                                    </svg>
                                  </span>
                                </div>
                              </div>

                              <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_2"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_2"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="group flex justify-end gap-x-2 word-break: break-word">
                              <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  How are you?
                                  <span>
                                    <span class="text-[11px] text-end text-blue-600 italic">
                                      18:40
                                    </span>
                                    <svg
                                      class="inline-block flex-shrink-0 size-4 text-blue-600"
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
                                      <path d="M18 6 7 17l-5-5" />
                                      <path d="m22 10-7.5 7.5L13 16" />
                                    </svg>
                                  </span>
                                </div>
                              </div>

                              <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_3"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_3"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                            alt="Avatar"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="relative space-y-5">
                    <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                      <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">
                        02 May
                      </span>
                    </div>

                    <div class="w-full space-y-4">
                      <div class="max-w-md flex gap-x-2">
                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                            alt="Avatar"
                          />
                        </div>

                        <div>
                          <p class="mb-1.5 ps-2.5 text-xs text-gray-400">
                            Anna
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  you guys I need your help
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:00
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_4"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_4"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  <div class="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      class="flex justify-center items-center size-9 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 text-white rounded-full"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-4"
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
                                        <polygon points="6 3 20 12 6 21 6 3" />
                                      </svg>
                                    </button>
                                    <div class="grow">
                                      <svg
                                        class="text-blue-600"
                                        width="77"
                                        height="19"
                                        viewBox="0 0 77 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="3"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="6"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="9"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="12"
                                          y="4"
                                          width="2"
                                          height="15"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="15"
                                          y="6"
                                          width="2"
                                          height="13"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="18"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="21"
                                          y="15"
                                          width="2"
                                          height="4"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="24"
                                          y="12"
                                          width="2"
                                          height="7"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="27"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="30"
                                          y="7"
                                          width="2"
                                          height="12"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="33"
                                          y="3"
                                          width="2"
                                          height="16"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="36"
                                          y="9"
                                          width="2"
                                          height="10"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="39"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="42"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="45"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="48"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="51"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="54"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="57"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="60"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="63"
                                          y="7"
                                          width="2"
                                          height="12"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="66"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="69"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="72"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="75"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      <div class="inline-flex items-center gap-x-1">
                                        <p class="text-xs text-gray-500">
                                          00:08
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:51
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_5"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_5"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                        <div>
                          <p class="mb-1.5 pe-2.5 text-xs text-gray-400">
                            Christina
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-end gap-x-2 word-break: break-word">
                              <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  <div class="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      class="flex justify-center items-center size-9 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 text-white rounded-full"
                                    >
                                      <svg
                                        class="flex-shrink-0 size-4"
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
                                        <polygon points="6 3 20 12 6 21 6 3" />
                                      </svg>
                                    </button>
                                    <div class="grow">
                                      <svg
                                        class="text-blue-600"
                                        width="77"
                                        height="19"
                                        viewBox="0 0 77 19"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="3"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="6"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="9"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="12"
                                          y="4"
                                          width="2"
                                          height="15"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="15"
                                          y="6"
                                          width="2"
                                          height="13"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="18"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="21"
                                          y="15"
                                          width="2"
                                          height="4"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="24"
                                          y="12"
                                          width="2"
                                          height="7"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="27"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="30"
                                          y="7"
                                          width="2"
                                          height="12"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="33"
                                          y="3"
                                          width="2"
                                          height="16"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="36"
                                          y="9"
                                          width="2"
                                          height="10"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="39"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="42"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="45"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="48"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="51"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="54"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="57"
                                          y="14"
                                          width="2"
                                          height="5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="60"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="63"
                                          y="7"
                                          width="2"
                                          height="12"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="66"
                                          width="2"
                                          height="19"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="69"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="72"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="75"
                                          y="18"
                                          width="2"
                                          height="1"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      <div class="inline-flex items-center gap-x-1">
                                        <p class="text-xs text-gray-500">
                                          00:08
                                        </p>
                                        <span class="inline-block size-1.5 rounded-full bg-blue-600"></span>
                                      </div>
                                    </div>
                                  </div>

                                  <span>
                                    <span class="text-[11px] text-end text-blue-600 italic">
                                      09:52
                                    </span>
                                    <svg
                                      class="inline-block flex-shrink-0 size-4 text-blue-600"
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
                                      <path d="M18 6 7 17l-5-5" />
                                      <path d="m22 10-7.5 7.5L13 16" />
                                    </svg>
                                  </span>
                                </div>
                              </div>

                              <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_6"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_6"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                            alt="Avatar"
                          />
                        </div>
                      </div>

                      <div class="max-w-md flex gap-x-2">
                        <div class="flex-shrink-0 mt-auto">
                          <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-sky-500 text-white">
                            S
                          </span>
                        </div>

                        <div>
                          <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Sun</p>

                          <div class="space-y-1">
                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  Hi
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:14
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_7"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_7"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <p>idk what was here</p>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_8"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_8"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  Looks like user entered the wrong email{" "}
                                  <a
                                    class="break-all text-blue-600 underline"
                                    href="#"
                                  >
                                    annarichard@gmail.cm
                                  </a>{" "}
                                  (typo at{" "}
                                  <a
                                    class="break-all text-blue-600 underline"
                                    href="#"
                                  >
                                    gmail.cm
                                  </a>
                                  ) - we will send a new email to{" "}
                                  <a
                                    class="break-all text-blue-600 underline"
                                    href="#"
                                  >
                                    annarichard@gmail.com
                                  </a>{" "}
                                  with a link to create an account in a moment.
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:27
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_9"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_9"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="relative space-y-5">
                    <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                      <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">
                        Today
                      </span>
                    </div>

                    <div class="w-full space-y-4">
                      <div class="max-w-md flex gap-x-2">
                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                            alt="Avatar"
                          />
                        </div>

                        <div>
                          <p class="mb-1.5 ps-2.5 text-xs text-gray-400">
                            Anna
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  ohh I didn't notice that typo 🙃
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      09:30
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_10"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_10"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  big thanks 😊
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      09:31
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_11"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_11"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="max-w-md flex gap-x-2">
                        <div class="flex-shrink-0 mt-auto">
                          <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-sky-500 text-white">
                            S
                          </span>
                        </div>

                        <div>
                          <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Sun</p>

                          <div class="space-y-1">
                            <div class="group flex justify-start gap-x-2 word-break: break-word">
                              <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  You're welcome
                                  <span>
                                    <span class="text-[11px] text-gray-400 italic">
                                      10:14
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_12"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_12"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                        <div>
                          <p class="mb-1.5 pe-2.5 text-xs text-gray-400">
                            James
                          </p>

                          <div class="space-y-1">
                            <div class="group flex justify-end gap-x-2 word-break: break-word">
                              <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                                <div class="text-sm text-gray-800">
                                  Great! 👍️
                                  <span>
                                    <span class="text-[11px] text-end text-blue-600 italic">
                                      18:39
                                    </span>
                                    <svg
                                      class="inline-block flex-shrink-0 size-4 text-blue-600"
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
                                      <path d="M18 6 7 17l-5-5" />
                                      <path d="m22 10-7.5 7.5L13 16" />
                                    </svg>
                                  </span>
                                </div>
                              </div>

                              <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                                <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                                  <button
                                    id="hs-pro-cht4cmd_13"
                                    type="button"
                                    class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200"
                                  >
                                    <svg
                                      class="flex-shrink-0 size-4 rounded-full"
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </button>

                                  <div
                                    class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full"
                                    aria-labelledby="hs-pro-cht4cmd_13"
                                  >
                                    <div class="p-1">
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                          <path d="m15 5 4 4" />
                                        </svg>
                                        Edit
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                          <path d="m10 7-3 3 3 3" />
                                          <path d="M17 13v-1a2 2 0 0 0-2-2H7" />
                                        </svg>
                                        Reply
                                      </a>
                                      <a
                                        class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                                        href="#"
                                      >
                                        <svg
                                          class="flex-shrink-0 size-3.5"
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
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex-shrink-0 mt-auto">
                          <img
                            class="flex-shrink-0 size-8 rounded-full"
                            src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                            alt="Avatar"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
                <label for="hs-chat-autoheight-textarea-4" class="sr-only">
                  Message
                </label>

                <div class="pb-2 ps-2">
                  <textarea
                    id="hs-chat-autoheight-textarea-4"
                    class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                    placeholder="Message Group"
                  ></textarea>

                  <div class="pe-4 flex justify-between items-center gap-x-1">
                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span class="sr-only">Attach file</span>
                      </button>

                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M22 11v1a10 10 0 1 1-9-10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" x2="9.01" y1="9" y2="9" />
                          <line x1="15" x2="15.01" y1="9" y2="9" />
                          <path d="M16 5h6" />
                          <path d="M19 2v6" />
                        </svg>
                        <span class="sr-only">Add emoji</span>
                      </button>
                    </div>

                    <div class="flex items-center gap-x-1">
                      <button
                        type="button"
                        class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                      >
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" x2="12" y1="19" y2="22" />
                        </svg>
                        <span class="sr-only">Send voice message</span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span class="sr-only">Send</span>
                        <svg
                          class="flex-shrink-0 size-4"
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
                          <path d="m5 12 7-7 7 7" />
                          <path d="M12 19V5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <aside
              id="hs-pro-chhds4"
              class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         "
            >
              <div class="h-full flex flex-col">
                <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
                  <h3 class="font-semibold text-gray-800">Details</h3>

                  <div class="absolute top-2 end-4 z-10">
                    <button
                      type="button"
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-overlay="#hs-pro-chhds4"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
                  <span class="flex flex-shrink-0 justify-center items-center size-16 text-2xl font-medium uppercase bg-orange-500 text-white rounded-full">
                    B
                  </span>
                  <div class="mt-2 w-full">
                    <h2 class="text-lg font-semibold text-gray-800">
                      Technical issues
                    </h2>
                    <p class="mb-2 text-[13px] text-gray-500">4 members</p>

                    <div class="mt-4 flex justify-center items-center gap-x-3">
                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        View profile
                      </button>

                      <button
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Send email
                      </button>
                    </div>
                  </div>
                </div>

                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div class="hs-accordion-group" data-hs-accordion-always-open>
                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsm1"
                    >
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdsm1-collapse"
                      >
                        <span class="text-sm font-medium">Members</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdsm1-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsm1"
                      >
                        <div class="px-2 pb-5 space-y-1">
                          <a
                            class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            href="#"
                          >
                            <img
                              class="flex-shrink-0 size-8 rounded-full"
                              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                              alt="Avatar"
                            />
                            <div class="grow">
                              <p class="font-semibold text-[13px] text-gray-800">
                                Christina Christy
                              </p>
                              <p class="text-xs text-gray-500">Online</p>
                            </div>
                          </a>

                          <a
                            class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            href="#"
                          >
                            <img
                              class="flex-shrink-0 size-8 rounded-full"
                              src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                              alt="Avatar"
                            />
                            <div class="grow">
                              <p class="font-semibold text-[13px] text-gray-800">
                                Louise Donadieu
                              </p>
                              <p class="text-xs text-gray-500">
                                Last seen 5 mins ago
                              </p>
                            </div>
                          </a>

                          <a
                            class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            href="#"
                          >
                            <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-pink-500 text-white rounded-full">
                              S
                            </span>
                            <div class="grow">
                              <p class="font-semibold text-[13px] text-gray-800">
                                Sun Chai
                              </p>
                              <p class="text-xs text-gray-500">
                                Last seen 3 hours ago
                              </p>
                            </div>
                          </a>

                          <a
                            class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            href="#"
                          >
                            <img
                              class="flex-shrink-0 size-8 rounded-full"
                              src="https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80"
                              alt="Avatar"
                            />
                            <div class="grow">
                              <p class="font-semibold text-[13px] text-gray-800">
                                Tom Lowry
                              </p>
                              <p class="text-xs text-gray-500">
                                Last seen 1 day ago
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsudc4"
                    >
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdsudc4-collapse"
                      >
                        <span class="text-sm font-medium">User details</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdsudc4-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsudc4"
                      >
                        <div class="px-5 pb-5">
                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Email:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                technical-issue@preline.com
                              </p>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div class="hs-accordion active" id="hs-pro-chdssmc4">
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdssmc4-collapse"
                      >
                        <span class="text-sm font-medium">Shared media</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdssmc4-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdssmc4"
                      >
                        <div class="pb-5 px-5">
                          <p class="text-sm text-gray-500">
                            Only shared images appear here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </body>

      {/* Modals live here */}
      {offerVisible ? <OfferModal /> : null}
      {neederProfileVisible ? <NeederProfileModal /> : null}

      {markCompleteVisible ? <MarkCompleteModal /> : null}

      <Drawer isOpen={isOpenDetails} placement="right" onClose={onCloseDetails}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <aside
              id="hs-pro-chhds1"
              class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
         
          fixed inset-y-0 end-0 z-[0]
          bg-white 
         
         "
            >
              <div class="h-full flex flex-col">
                <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
                  <h3 class="font-semibold text-gray-800">Details</h3>

                  <div class="absolute top-2 end-4 z-10">
                    <button
                      type="button"
                      onClick={() => onCloseDetails()}
                      class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-overlay="#hs-pro-chhds1"
                    >
                      <span class="sr-only">Close</span>
                      <svg
                        class="flex-shrink-0 size-4"
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
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
                  {user.profilePictureResponse ? (
                    <img
                      class="flex-shrink-0 size-16 rounded-full"
                      src={user.profilePictureResponse}
                    />
                  ) : (
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
                  <div class="mt-2 w-full">
                    <h2 class="text-lg font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h2>
                    {numberOfRatings ? (
                      <div className="flex justify-center items-center text-center">
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
                      </div>
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

                    <div class="mt-4 flex justify-center items-center gap-x-3">
                      <button
                        onClick={() => handleNeederProfileVisible()}
                        type="button"
                        class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                      >
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <circle cx="12" cy="10" r="2" />
                          <line x1="8" x2="8" y1="2" y2="4" />
                          <line x1="16" x2="16" y1="2" y2="4" />
                        </svg>
                        View profile
                      </button>
                    </div>
                  </div>
                </div>

                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  <div class="hs-accordion-group" data-hs-accordion-always-open>
                    <div
                      class="hs-accordion border-b border-gray-100 active"
                      id="hs-pro-chdsudc1"
                    >
                      <button
                        type="button"
                        class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        aria-controls="hs-pro-chdsudc1-collapse"
                      >
                        <span class="text-sm font-medium">Job details</span>
                        <svg
                          class="hs-accordion-active:hidden block size-4"
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
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        <svg
                          class="hs-accordion-active:block hidden size-4"
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
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>

                      <div
                        id="hs-pro-chdsudc1-collapse"
                        class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-pro-chdsudc1"
                      >
                        <div class="px-5 pb-5">
                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M12 12h.01" />
                                  <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                  <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                  <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="6"
                                    rx="2"
                                  />
                                </svg>
                                Job Title:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                {job.jobTitle}
                              </p>
                            </dd>
                          </dl>
                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M12 12h.01" />
                                  <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                  <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                                  <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="6"
                                    rx="2"
                                  />
                                </svg>
                                Status:
                              </p>
                            </dt>

                            {/* {jobHiringState.isJobOffered === true &&
                      jobHiringState.isHired === false ? (
                        <span class="py-1.5 ps-1.5 w-[160px] px-1 inline-flex items-center  text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <svg
                          class="flex-shrink-0 size-3.5 mr-2"
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
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        You received an offer!
                      </span>
                      ) : jobHiringState.isHired === true &&
                        jobHiringState.isMarkedCompleteDoer === false ? (
                          <span class="py-1.5 ps-1.5  px-1 inline-flex items-center  text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          <svg
                            class="flex-shrink-0 size-3.5 mr-2"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Job Accepted!
                        </span>
                      ) : jobHiringState.isMarkedCompleteDoer === true ? (
                        <span class="py-1.5 ps-1.5 w-[160px] inline-flex items-center  text-xs font-medium bg-blue-600 text-white rounded-full">
                        <svg
                          class="flex-shrink-0 size-3.5 mr-2"
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
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Awaiting confirmation
                      </span>
                      ) : (
                    
                          <dd>
                     
                      <span class="py-1.5 ps-1.5 pe-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                        <svg
                          class="flex-shrink-0 size-3.5"
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
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Interviewing
                      </span>
                    </dd>
              
                      )} */}
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                location:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                {job.streetAddress}, {job.city}, MN
                              </p>
                            </dd>
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <rect
                                    width="20"
                                    height="16"
                                    x="2"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Pay:
                              </p>
                            </dt>
                            {job.isVolunteer ? (
                              <p>Volunteer!</p>
                            ) : job.isSalaried ? (
                              <p class="font-medium text-[13px] text-gray-800">
                                ${job.shortenedSalary} yearly - $
                                {job.shortenedUpperSalary} yearly
                              </p>
                            ) : job.upperRate > job.lowerRate ? (
                              <p class="font-medium text-[13px] text-gray-800">
                                ${job.lowerRate}/hr - ${job.upperRate}/hr
                              </p>
                            ) : (
                              <p class="font-medium text-[13px] text-gray-800">
                                ${job.lowerRate}/hr
                              </p>
                            )}
                          </dl>

                          <dl class="py-1 grid grid-cols-3 gap-x-4">
                            <dt class="col-span-1">
                              <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                                <svg
                                  class="flex-shrink-0 size-3.5"
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
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Posted:
                              </p>
                            </dt>
                            <dd class="col-span-2">
                              <p class="font-medium text-[13px] text-gray-800">
                                {job.datePosted}
                              </p>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatPlaceholder;
