import React from 'react'

const Greeting = ({user}) => {

  console.log("greeting", user)
  return (
    <div className='w-full pb-6 md:pb-12'>

   
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 ">

  <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
    <div className='mt-6 md:mt-16  '>
      <h1 class="block text-3xl font-bold text-gray-800 sm:text-3xl lg:text-3xl lg:leading-tight ">Welcome, {user?.firstName} </h1>
      <p className=' text-gray-500 mt-3'>Snapshot:</p>
      <div className='flex flex-row'>
      <p class="mt-2 text-lg font-medium text-gray-800">Current Income:</p>
      <p class="mt-2 text-lg text-gray-800 ml-2">${user?.currentIncome}/year</p>
      </div>
      <div className='flex flex-row'>
      <p class="mt-2 text-lg font-medium text-gray-800">Location:</p>
      <p class="mt-2 text-lg text-gray-800 ml-2">{user?.city}, {user?.state}</p>
      </div>
      <div className='flex flex-row'>
      <p class="mt-2 text-lg font-medium text-gray-800">My Interests:</p>
      <p class="mt-2 text-lg text-gray-800 ml-2">{user?.userInterests}</p>
      </div>
     
     
     
      {/* <p className=' text-gray-500 mt-3'>Today's Market Summary:</p>
      <p class="mt-2 text-lg text-gray-800">The welding equipment market size is forecast to increase by USD 4.72 billion, at a CAGR of 6.1% between 2023 and 2028. The market is driven by several key trends and challenges. The emergence of advanced welding technologies, such as friction stir welding, is gaining significant traction in the automotive sector due to its ability to join base metals without the need for filler rods or heat generation. Another trend is the increasing adoption of automated welding solutions, which help improve productivity and reduce the dependence on skilled labor. However, the lack of a skilled workforce remains a significant challenge for the market. </p>
        <p className='ml-auto text-sm text-gray-500'> read more <span className="underline">here</span></p> */}
    </div>
    <div className='mt-6 md:mt-16 flex items-center justify-center'>
   
    <div className='border border-sky-100 shadow-md w-2/3 h-full rounded-lg flex flex-col items-center justify-center bg-sky-100 py-24 px-10'>
      <h4 class="text-lg sm:text-2xl font-semibold text-gray-800">My Income Goal</h4>
      <div className="flex">
      <p class="mt-2 sm:mt-3 text-5xl sm:text-6xl font-bold text-green-500">${user.goalIncome}</p>
      <p class="ml-2 mt-auto text-gray-500">a year</p>
      </div>
    </div>
    </div>

  </div>
</div>
</div>
  )
}

export default Greeting


