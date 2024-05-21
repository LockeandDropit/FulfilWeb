import { useEffect, useState } from "react";

import { db } from "../../../firebaseConfig";
import { useUserStore } from "./lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "./lib/chatStore";



const ChastList = () => {

    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
  
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();

    console.log(currentUser)
  
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

    
    console.log(chats)
  
    const handleSelect = async (chat) => {
      const userChats = chats.map((item) => {
        const { user, ...rest } = item;

        console.log("tyhis it?", item)
        console.log("or this", chat)
        
        return rest;
      });
  
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
      } catch (err) {
        console.log(err);
      }
    };
  
    // const filteredChats = chats.filter((c) =>
    //   c.user.username.toLowerCase().includes(input.toLowerCase())
    // );


  return (
    <div className='p-5 flex overflow-y-scroll  [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-track]:rounded-full'>
      

{chats.map((chat) => (


<div onClick={() => handleSelect(chat)} class="block w-full py-2 px-1 sm:p-4 group bg-gray-100 rounded-2xl hover:bg-gray-200 focus:outline-none focus:bg-gray-200 " key={chat.chatID}>
  <div class="flex gap-x-2 sm:gap-x-4">

    <img src={chat.user.profilePictureResponse} className="w-10 h-10 rounded-full object-cover"></img>

    <div class="grow">
      <p class="font-semibold text-lg text-gray-800 ">
      {chat.user.firstName}
      </p>
      <p class="text-sm text-gray-500 dark:text-neutral-500 line-clamp-1" >
      {chat.lastMessage} 
      </p> 
    </div>

  </div>
</div>
))}
   




        </div>
  )
}

export default ChastList