import React from 'react'
import { useEffect } from 'react'
import Header from '../Components/Header'
import Dashboard from '../Components/Dashboard'
import List from './List'
import Chat from './Chat'
import Detail from './Detail'
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { auth } from '../../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

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


    console.log(currentUser)

    
  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
    <Header />
    <Dashboard />

    <div className='flex h-screen items-center justify-center'>
        <div className='w-4/5 h-4/5 ml-40 bg-white border rounded-md flex'>
            {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {/* {chatId && <Detail />} */}
        </>
      ) : (
       null
      )}
             </div>
             
        
    </div>
    
    </>
  )
}

export default NeederChatEntry