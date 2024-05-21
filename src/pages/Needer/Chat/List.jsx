import React from 'react'
import UserInfo from './UserInfo'
import ChastList from './ChastList'
import AddUser from "./AddUser";
const List = () => {
  return (
    <div className='flex-1 flex flex-col bg-white'>
  
        <UserInfo />
        {/* <AddUser /> */}
        <ChastList />
    </div>
  )
}

export default List