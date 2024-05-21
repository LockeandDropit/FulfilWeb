import React, { useEffect, useRef, useState } from "react";

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";

import { Text, Box, Flex, Image } from "@chakra-ui/react";
import star_corner from "../../../images/star_corner.png"
import star_filled from "../../../images/star_filled.png"
import { format } from "timeago.js";

const Chat = () => {

    
  const [rating, setRating] = useState(null); //make dynamic, pull from Backend
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);



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
        console.log(res.data())
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
      } finally{
      setImg({
        file: null,
        url: "",
      });
  
      setText("");
      }
    };
  return (
    <div className='flex-[2_2_0%] h-full flex flex-col'>

<div  class="block w-full py-2 px-1 sm:p-4 group bg-white  border-b border-gray-300 " >
  <div class="flex gap-x-2 sm:gap-x-4">

    <img src={user.profilePictureResponse} className="w-10 h-10 rounded-full object-cover"></img>

    <div class="grow">
      <p class="font-semibold text-lg text-gray-800 ">
      {user.firstName}
      </p>
     

      <div class="inline-flex items-center gap-x-3 text-sm text-gray-800 ">
                            {numberOfRatings ? (
                              <Flex>
                                {maxRating.map((item, key) => {
                                  return (
                                    <Box
                                      activeopacity={0.7}
                                      key={item}
                                      marginTop="2px"
                                    >
                                      <Image
                                        boxSize="16px"
                                        src={
                                          item <= rating
                                            ? star_filled
                                            : star_corner
                                        }
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
                                  class="flex-shrink-0 size-4 text-gray-600 "
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

  </div>
</div>
    



    <div className='p-5 flex-1 overflow-y-auto flex flex-col g-5 [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-track]:rounded-full'>

    {/* {chat?.messages?.map((message) => (
        message.senderId === currentUser?.uid ? ( <div className='max-w-full flex flex-row-reverse gap-5'>
           
        <div className='bg-sky-500 text-white rounded-md p-4 gap-1'>
                <p className='font-sm'> {message.text}</p>
                <span>{format(message.createdAt.toDate())}</span>
        </div>
    </div>) : (<div className='max-w-[30rem] flex gap-5 rounded-md bg-gray-700 text-white p-4'>
            <img className=' rounded-full w-8 h-8 object-cover '></img>
            <div className='flex flex-1 flex-col gap-1'>
            <p className='font-sm'> {message.text}</p>
                <span>{format(message.createdAt.toDate())}</span>
            </div>
        </div>)
    ))} */}

{chat?.messages?.map((message) => (
        message.senderId === currentUser?.uid ? (   <li class="max-w-2xl ms-auto flex justify-end mb-2   ">
        <div class="grow text-end space-y-3">
       
          <div class="inline-block bg-blue-600 rounded-lg p-3 shadow-sm">
            <p class="text-sm text-white">
            {message.text}
            </p>
          </div>
          <p class="text-sm font-medium text-gray-400 leading-none">{format(message.createdAt.toDate())}</p>
        </div>

        
          
        
      </li>
      
      
    ) : (
    
    
    
    // <div className='max-w-[30rem] flex gap-5 rounded-md bg-gray-700 text-white p-4'>
    //         <img className=' rounded-full w-8 h-8 object-cover '></img>
    //         <div className='flex flex-1 flex-col gap-1'>
    //         <p className='font-sm'> {message.text}</p>
    //             <span>{format(message.createdAt.toDate())}</span>
    //         </div>
    //     </div>
        
        <li class="flex gap-x-2 sm:gap-x-4">
        <svg class="flex-shrink-0 w-[2.375rem] h-[2.375rem] rounded-full" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" rx="6" fill="#2563EB"/>
          <path d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25" stroke="white" stroke-width="1.5"/>
          <path d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25" stroke="white" stroke-width="1.5"/>
          <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"/>
        </svg>


        <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
          <h2 class="font-medium text-gray-800 dark:text-white">
            How can we help?
          </h2>
          <div class="space-y-1.5">
            <p class="mb-1.5 text-sm text-gray-800 dark:text-white">
              You can ask questions like:
            </p>
            <ul class="list-disc list-outside space-y-1.5 ps-3.5">
              <li class="text-sm text-gray-800 dark:text-white">
                What's Preline UI?
              </li>

              <li class="text-sm text-gray-800 dark:text-white">
                How many Starter Pages & Examples are there?
              </li>

              <li class="text-sm text-gray-800 dark:text-white">
                Is there a PRO version?
              </li>
            </ul>
          </div>
        </div>
    
      </li>
)
    ))}


        
    </div>
    <div className='flex items-center justify-between p-5 gap-5 border-t border-gray-300 mt-auto'>
        <input type='text' placeholder='Type your mesage here' className='flex w-full bg-none border-non outline-none p-3 rounded-md text-sm'   value={text}
          onChange={(e) => setText(e.target.value)} />
        <button className='bg-sky-400 px-3 py-2 w-1/6 rounded-lg text-white border-none outline-none cursor-pointer'  onClick={handleSend} >Send</button>
    </div>
    
    
    </div>
  )
}

export default Chat