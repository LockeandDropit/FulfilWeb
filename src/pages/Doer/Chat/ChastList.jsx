import { useEffect, useState } from "react";

import { db } from "../../../firebaseConfig";
import { useUserStore } from "./lib/userStore";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection,
} from "firebase/firestore";
import { useChatStore } from "./lib/chatStore";
import { useJobStore } from "./lib/jobsStore";

const ChastList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const { fetchJobInfo, setJobHiringState } = useJobStore();

 

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "User Messages", currentUser.uid),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "employers", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.uid]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [interviewMessageData, setInterviewMessageData] = useState(null);
  const [selectedCategoryChannelIDs, setSelectedCategoryChannelIDs] =
    useState(null);

  ///uhh

  useEffect(() => {
    if (selectedCategory === "Applied") {
      const chatIdQuery = query(
        collection(db, "users", currentUser.uid, "Applied")
      );

      onSnapshot(chatIdQuery, (snapshot) => {
        let channelIDs = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().channelID) {
            channelIDs.push(doc.data().channelID);
          }
        });

        if (!channelIDs || !channelIDs.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        } else {
          setSelectedCategoryChannelIDs(channelIDs);
        }
      });
    } else if (selectedCategory === "Jobs In Progress") {
      const chatIdQuery = query(
        collection(db, "users", currentUser.uid, "Jobs In Progress")
      );

      onSnapshot(chatIdQuery, (snapshot) => {
        let channelIDs = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().channelID) {
            channelIDs.push(doc.data().channelID);
          }
        });

        if (!channelIDs || !channelIDs.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        } else {
          setSelectedCategoryChannelIDs(channelIDs);
        }
      });
    } else if (selectedCategory === "In Review") {
      const chatIdQuery = query(
        collection(db, "users", currentUser.uid, "In Review")
      );

      onSnapshot(chatIdQuery, (snapshot) => {
        let channelIDs = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().channelID) {
            channelIDs.push(doc.data().channelID);
          }
        });

        if (!channelIDs || !channelIDs.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        } else {
          setSelectedCategoryChannelIDs(channelIDs);
        }
      });
    } else if (selectedCategory === "Requests") {
      const chatIdQuery = query(
        collection(db, "users", currentUser.uid, "Requests")
      );

      onSnapshot(chatIdQuery, (snapshot) => {
        let channelIDs = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().channelID) {
            channelIDs.push(doc.data().channelID);
          }
        });

        if (!channelIDs || !channelIDs.length) {
          //from stack overflow https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js
        } else {
          setSelectedCategoryChannelIDs(channelIDs);
        }
      });
    }
  }, [selectedCategory]);

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

          items.map(async (item) => {
            fetchedIds.push(item.chatId);
          });

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "employers", item.receiverId);
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


  console.log("herer i am!")

  const handleJobFetch = async (chat) => {
    fetchJobInfo(currentUser.uid, chat.jobID, chat.jobType, chat.jobTitle);
    console.log("Trying this", currentUser.uid, chat.jobID, chat.jobType, chat.jobTitle)
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
    <div
      className="p-5 flex flex-col overflow-y-scroll max-w-96  [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-track]:rounded-full"
    >
      <label for="hs-select-label" class="block text-sm font-medium mb-2 ">
        Filter Messages
      </label>
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        id="hs-select-label"
        class="py-3 mb-1 px-4 sm:pe-9 block sm:w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      >
        <option selected="">Filter by category</option>
        <option value="Applied">Interviewing</option>
        <option value="Jobs In Progress">In Progress</option>
        <option value="Requests">Requests</option>
        <option value="In Review">Ready to Pay</option>
      </select>

      {chats ? (
        chats.map((chat) => (
          <div
            onClick={() => handleSelect(chat)}
            class="block sm:w-full py-2 px-1 sm:p-4 group bg-gray-100 rounded-2xl hover:bg-gray-200 focus:outline-none focus:bg-gray-200 "
            key={chat.chatID}
          >
            <div class="flex gap-x-2 sm:gap-x-4">
              <img
                src={chat.user.profilePictureResponse}
                className="w-14 h-14 rounded-full object-cover"
              ></img>

              <div class="grow">
                <p class="font-semibold text-lg text-gray-800 ">
                  {chat.user.firstName}
                </p>
                <p class="font-semibold text-sm text-gray-600 ">
                  Job: {chat.jobTitle}
                </p>
                <p class="text-sm text-gray-500 dark:text-neutral-500 line-clamp-1">
                  {chat.lastMessage}
                </p>
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
  );
};

export default ChastList;
