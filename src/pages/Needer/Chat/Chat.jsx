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
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Text, Box, Flex, Image } from "@chakra-ui/react";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import { format } from "timeago.js";
import CreateOfferModal from "../NeederComponents/CreateOfferModal";
import { useMediaQuery } from "@chakra-ui/react";
import Detail from "./Detail";
import DoerProfileModal from "../Components/DoerProfileModal";
import { useJobStore } from "./lib/jobsStore";
import OfferPostedJobModal from "../Components/OfferPostedJobModal";

const Chat = () => {
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const { resetChat } = useChatStore();
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();
  //pulls cumulative reviews
  const [numberOfRatings, setNumberOfRatings] = useState(null);

  useEffect(() => {
    if (user != null) {
      // should this be done on log ina nd stored in redux store so it's cheaper?
      const q = query(collection(db, "users", user.uid, "Ratings"));

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

  const { job, jobHiringState } = useJobStore();

  const endRef = useRef(null);

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });

  // }, [chat]);

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
            id === currentUser.id ? true : false;
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

  const [doerModalVisbile, setDoerModalVisible] = useState(false);

  const handleDoerModalVisbile = () => {
    setDoerModalVisible(!doerModalVisbile);
  };

  console.log("what do i have?", jobHiringState);

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

            <div class="flex gap-x-2 sm:gap-x-4 ">
              <img
                onClick={() => handleDoerModalVisbile()}
                src={user.profilePictureResponse}
                className="w-16 h-16 rounded-full object-cover mt-2 cursor-pointer"
              ></img>

              <div
                class="grow cursor-default"
                onClick={() => handleDoerModalVisbile()}
              >
                <div onClick={() => handleDoerModalVisbile()}>
                  <p
                    onClick={() => handleDoerModalVisbile()}
                    class="font-semibold text-lg text-gray-800 cursor-pointer w-fit"
                  >
                    {user.firstName}
                  </p>

                  <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 cursor-pointer">
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
                  <p class="font-semibold text-sm text-gray-500  cursor-pointer w-fit">
                    Job: {chat.jobTitle}
                  </p>
                </div>
                {/* <p class="font-semibold text-sm text-gray-500  ">Job: {chat.jobTitle}</p> */}
                {isDesktop ? null : (
                  <div className="flex flex-col">
                    <button
                      className="bg-sky-400 hover:bg-sky-500 px-3 py-2 h-10  rounded-lg text-white border-none outline-none cursor-pointer"
                      onClick={() => handleModalOpen()}
                    >
                      Send an offer
                    </button>

                    <button
                      onClick={() => handleDetailsVisible()}
                      type="button"
                      class="py-3 px-4  items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
                    >
                      See Job Details
                    </button>
                  </div>
                )}
              </div>

              {isDesktop ? (
                jobHiringState.isJobOffered === true &&
                jobHiringState.isHired === false ? (
                  <div className="flex flex-col">
                    {" "}
                    <span class="inline-flex items-center gap-x-1.5 py-1.5  ml-2 px-3 r text-sm rounded-sm font-medium bg-blue-100 text-sky-500 ">
                      Offer Pending
                    </span>
                    {detailsVisible === true ? (
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
                ) : (
                  <div className="flex flex-col">
                    <button
                      className="bg-sky-400 hover:bg-sky-500 px-3 py-2 h-10  rounded-lg text-white border-none outline-none cursor-pointer"
                      onClick={() => handleModalOpen()}
                    >
                      Send an offer
                    </button>
                    {detailsVisible === true ? (
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
                <img
                  src={user.profilePictureResponse}
                  className="w-10 h-10 rounded-full object-cover"
                ></img>

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
            className="bg-sky-400 px-3 py-2 sm:w-1/6 rounded-lg text-white border-none outline-none cursor-pointer"
            onClick={handleSend}
          >
            Send
          </button>
        </div>

        {/* offer modal */}
        {/* {offerModalOpen === true ? (
        <CreateOfferModal
          props={{ applicantID: user.uid, jobID: chat.jobID, channel: chat.channelId }}
        />
      ) : null} */}
      </div>
      {detailsVisible ? <Detail /> : null}

      {doerModalVisbile ? <DoerProfileModal /> : null}

      {offerPostedJobVisible ? <OfferPostedJobModal /> : null}
    </>
  );
};

export default Chat;
