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
          const userDocRef = doc(db, "users", item.receiverId);
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
        class="py-3 mb-1 sm:px-4 sm:pe-9 block sm:w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      >
        <option selected="">Filter by category</option>
        <option value="Posted Jobs">Interviewing</option>
        <option value="Jobs In Progress">In Progress</option>
        <option value="Requests">Requests</option>
        <option value="In Review">Ready to Pay</option>
      </select>
      {chats ? (
        chats.map((chat) => (
          <div
            onClick={() => handleSelect(chat)}
            class="block cursor-pointer sm:w-full py-2 px-2  group  rounded-2xl mb-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 "
            key={chat.chatID}
          >
            <div class="flex gap-x-2 sm:gap-x-4">
              {chat.user.profilePictureResponse ? ( <img
                src={chat.user.profilePictureResponse}
                className="w-14 h-14 mt-2.5 rounded-full object-cover"
              ></img>) : ( <svg
                class="w-14 h-14 rounded-full object-cover text-gray-500"
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
              </svg>)}
             

              <div class="grow">
                <div className="flex w-full ">
            
              
                <p class="font-semibold text-lg text-gray-800 ">
                  {chat.user.firstName}
                </p>
                {chat.isSeen ? (null) :(  <div className="w-full flex  h-1/2 mt-1">
                <span class="ml-auto justify-end inline-flex items-center  px-1.5 rounded-full text-[10px] font-medium bg-red-500 text-white">1</span>
                </div>)}
              
                </div>
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
