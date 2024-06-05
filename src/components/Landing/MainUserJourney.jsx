import React from 'react'

const MainUserJourney = () => {
  return (
   
    <div class="bg-sky-400 mt-20 rounded-xl">
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    
      <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
          <img class="rounded-xl" src="https://images.unsplash.com/photo-1648737963503-1a26da876aca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&h=900&q=80" alt="Image Description" />
        </div>
        <div class="mt-5 sm:mt-10 lg:mt-0">
          <div class="space-y-6 sm:space-y-8">
        
            <div class="space-y-2 md:space-y-4">
              <h2 class="font-bold text-3xl lg:text-4xl text-white">
                How easy is it?
              </h2>
              <p class="text-white font-semibold ">
                All communication and payments are handled through our platform to ensure you're getting the highest quality of service.
              </p>
            </div>
         
            <ul class="space-y-2 sm:space-y-4">
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full  text-white font-bold">
                  1.
                </span>
    
                <span class="text-sm sm:text-base text-white font">
                  <span class="font-bold">Post</span> what you need done
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full text-white font-bold">
                 2.
                </span>
    
                <span class="text-sm sm:text-base text-white">
                 Hire the <span class="font-bold">Doer</span> you want
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full text-white font-bold">
                  3.
                </span>
    
                <span class="text-sm sm:text-base text-white ">
                 Pay through Fulfil when the job is <span class="font-bold">complete!</span>
                </span>
              </li>
            </ul>
        
          </div>
        </div>
    
        {/* <div class="mt-5 sm:mt-10 lg:mt-0">
          <div class="space-y-6 sm:space-y-8">
        
            <div class="space-y-2 md:space-y-4">
              <h2 class="font-bold text-3xl lg:text-4xl text-gray-800">
                How easy is it?
              </h2>
              <p class="text-gray-500">
                All communication and payments are handled through our platform to ensure you're getting the highest quality of service.
              </p>
            </div>
         
            <ul class="space-y-2 sm:space-y-4">
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                  1.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                  <span class="font-bold">Post</span> what you need done
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                 2.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                 Hire the <span class="font-bold">contractor</span> you want
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600">
                  3.
                </span>
    
                <span class="text-sm sm:text-base text-gray-500">
                 Pay through Fulfil when the job is <span class="font-bold">complete!</span>
                </span>
              </li>
            </ul>
        
          </div>
        </div> */}
   
      </div>
      
    </div>
    </div>
  
  )
}

export default MainUserJourney