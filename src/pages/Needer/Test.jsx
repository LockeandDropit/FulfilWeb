import React from 'react'

const Test = () => {
  return (
   
  
    <div class="w-1/4 max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] ">

      <div class="py-3 px-4 flex justify-between items-center border-b ">
        <h3 class="font-semibold text-gray-800">
          Create team
        </h3>
        <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none " data-hs-overlay="#hs-pro-datm">
          <span class="sr-only">Close</span>
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
  
      <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
        <div class="p-4 space-y-5">
          <div class="space-y-2">
            <label for="hs-pro-dactmt" class="block mb-2 text-sm font-medium text-gray-800 ">
              Title
            </label>

            <input id="hs-pro-dactmt" type="text" class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " placeholder="Team title" value="" />
          </div>

          <div class="space-y-2">
            <label for="dactmi" class="block mb-2 text-sm font-medium text-gray-800 ">
              Industry
            </label>

            <input id="dactmi" type="text" class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  " placeholder="Enter name" />
          </div>

          <div class="space-y-2">
            <label for="dactmd" class="block mb-2 text-sm font-medium text-gray-800 ">
              Description
            </label>

            <textarea id="dactmd" class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none " rows="3" placeholder="Tell us a little bit about team"></textarea>
          </div>

          <div class="space-y-2">
            <label for="dactmm" class="block mb-2 text-sm font-medium text-gray-800 ">
              Members
            </label>

 
            <div class="flex items-center gap-x-3">
              <input id="dactmm" type="text" class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  " placeholder="Enter name" />

              <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
                <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add
              </button>
      
          </div>

          <div class="space-y-2">
            <label class="block mb-2 text-sm font-medium text-gray-800 ">
              Suggested members
            </label>

            <div class="flex items-center space-x-2">
       
           
              
            
              <div class="hs-tooltip inline-block">
                <label for="hs-pro-dactcach4" class="relative block rounded-full cursor-pointer">
                  <img class="hs-tooltip-toggle flex-shrink-0 size-[46px] rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Image Description" />
                  <span class="block absolute -top-1 -end-1 bg-white rounded-full ">
                    <span class="relative flex flex-col justify-center items-center size-5 bg-blue-100 border-2 border-white text-blue-600 rounded-full ">
                      <input type="checkbox" id="hs-pro-dactcach4" class="absolute top-0 start-0 size-full bg-transparent border-transparent rounded-full focus:outline-none"  />
                      <svg class="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>
                    </span>
                  </span>
                </label>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg " role="tooltip">
                  Ella Lauda
                </span>
              </div>
            
              <div class="hs-tooltip inline-block">
                <label for="hs-pro-dactcach5" class="relative block rounded-full cursor-pointer">
                  <span class="hs-tooltip-toggle flex flex-shrink-0 justify-center items-center size-[46px] bg-white border border-gray-200 text-gray-700 font-medium uppercase rounded-full">O</span><span class="block absolute -top-1 -end-1 bg-white rounded-full ">
                    <span class="relative flex flex-col justify-center items-center size-5 bg-blue-100 border-2 border-white text-blue-600 rounded-full ">
                      <input type="checkbox" id="hs-pro-dactcach5" class="absolute top-0 start-0 size-full bg-transparent border-transparent rounded-full focus:outline-none" />
                      <svg class="flex-shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>
                    </span>
                  </span>
                </label>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg " role="tooltip">
                  Ols Schols
                </span>
              </div>
         
            </div>
          </div>

     
          <div class="space-y-2">
            <label class="block block mb-2 text-sm font-medium text-gray-800 ">
              Cover
            </label>
            <div class="p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl ">
              <div class="text-center">
                <svg class="w-16 text-gray-400 mx-auto " width="70" height="46" viewBox="0 0 70 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-gray-400 "/>
                  <path d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-gray-400 "/>
                  <rect x="17.0656" y="1.62305" width="35.8689" height="42.7541" rx="5" fill="currentColor" stroke="currentColor" stroke-width="2" class="fill-white stroke-gray-400 "/>
                  <path d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z" stroke="currentColor" stroke-width="2" class="stroke-gray-400 "/>
                  <circle cx="39.5902" cy="14.9672" r="4.16393" stroke="currentColor" stroke-width="2" class="stroke-gray-400 "/>
                </svg>

                <div class="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
                  <span class="pe-1 font-medium text-gray-800 ">
                    Drop your files here or
                  </span>
                  <label for="hs-pro-dactc" class="relative cursor-pointer bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ">
                    <span>browse</span>
                    <input id="hs-pro-dactc" type="file" class="sr-only" />
                  </label>
                </div>

                <p class="mt-1 text-xs text-gray-400 ">
                  CSV, XLS, DOCX
                </p>
              </div>
            </div>
          </div>
         
        </div>
      </div>
     

 
      <div class="p-4 flex justify-between gap-x-2">
        <div class="w-full flex justify-end items-center gap-x-2">
          <button type="button" class="py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 " data-hs-overlay="#hs-pro-datm">
            Cancel
          </button>

          <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 " data-hs-overlay="#hs-pro-datm">
            Create team
          </button>
        </div>
      </div>
  
    </div>
  </div>


  )
}

export default Test