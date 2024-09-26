import React from 'react'

const LocallyFocused = () => {
  return (
   
    <div class="bg-sky-100 sm:mt-20 rounded-md">
 
    <div class="max-w-[85rem] px-4 pt-10 sm:pt-14 sm:px-6 lg:px-8  mx-auto">
    
      <div class="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
       
        <div class="mt-5 sm:mt-10 lg:mt-0 mb-12 sm:mb-0 ">
          <div class="space-y-6 sm:space-y-6">
        
            <div class="">
              <h2 class="font-bold text-3xl lg:text-4xl text-gray-800">
                Land a great job without
              </h2>
              <h2 class="font-bold text-4xl lg:text-5xl text-gray-800">
                breaking the bank.
              </h2>
              <p class="text-gray-800 text-lg font-semibold mt-5 mb-4">
              The median cost of a technical college is $9,000, while a 4-year traditional college costs roughly $40,000 total.
              </p>
              <ul class="space-y-2 sm:space-y-4 ">
              <li class="flex space-x-3">
                <span class=" size-7 flex justify-center items-center rounded-full  text-gray-800">
                  1.
                </span>
    
                <span class="text-sm sm:text-lg text-gray-800">
                  {/* <span class="font-bold">Post</span> what you need done */}
                  The average trade school costs 75% less than a 4 year college.
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="size-7 flex justify-center items-center rounded-full  text-gray-800">
                 2.
                </span>
    
                <span class="text-sm sm:text-lg text-gray-800">
                The average college newgrad makes only $55,000/year.
                </span>
              </li>
    
              <li class="flex space-x-3">
                <span class="size-7 flex justify-center items-center rounded-full  text-gray-800">
                  3.
                </span>
    
                <span class="text-sm sm:text-lg text-gray-800">
                Some trades pay more than $100,000 a year.
                </span>
              </li>
            </ul>
            </div>
         
       
        
          </div>
        </div>
        <div className=''>
          {/* <img class="rounded-xl max-h-[560px] md:ml-20 " src="https://images.unsplash.com/photo-1664574654529-b60630f33fdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" alt="Image Description" /> */}
          {/* <img class="rounded-md max-h-[640px] md:ml-20 " src="https://images.pexels.com/photos/4855334/pexels-photo-4855334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image Description" /> */}
          <img class="rounded-md  " src="./landingImages/unrecognizable-male-welder-work.jpg" />
        </div>
    
   
      </div>
      
    </div>
    

    </div>

  
  )
}

export default LocallyFocused