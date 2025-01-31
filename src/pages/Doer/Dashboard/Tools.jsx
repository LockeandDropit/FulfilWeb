import React from 'react'

const Tools = () => {
  return (
    <div className='w-full  py-6 py-12'>

{/* feature tabs */}

<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div class="relative p-6 md:p-16">
 
    <div class="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
      <div class="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
        <h2 class="text-2xl text-gray-800 font-bold sm:text-3xl ">
          Fully customizable rules to match your unique needs
        </h2>

  
        <nav class="grid gap-4 mt-5 md:mt-10" aria-label="Tabs" role="tablist" aria-orientation="vertical">
          <button type="button" class="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-none focus:bg-gray-200 p-4 md:p-5 rounded-xl " id="tabs-with-card-item-1" aria-selected="true" data-hs-tab="#tabs-with-card-1" aria-controls="tabs-with-card-1" role="tab">
            <span class="flex gap-x-6">
              <svg class="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>
              <span class="grow">
                <span class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 ">Advanced tools</span>
                <span class="block mt-1 text-gray-800 ">Use Preline thoroughly thought and automated libraries to manage your businesses.</span>
              </span>
            </span>
          </button>

          <button type="button" class="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-none focus:bg-gray-200 p-4 md:p-5 rounded-xl" id="tabs-with-card-item-2" aria-selected="false" data-hs-tab="#tabs-with-card-2" aria-controls="tabs-with-card-2" role="tab">
            <span class="flex gap-x-6">
              <svg class="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
              <span class="grow">
                <span class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 ">Smart dashboards</span>
                <span class="block mt-1 text-gray-800 dark:hs-tab-active:text-gray-200 dark:text-neutral-200">Quickly Preline sample components, copy-paste codes, and start right off.</span>
              </span>
            </span>
          </button>

          <button type="button" class="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:bg-gray-200 focus:outline-none focus:bg-gray-200 p-4 md:p-5 rounded-xl " id="tabs-with-card-item-3" aria-selected="false" data-hs-tab="#tabs-with-card-3" aria-controls="tabs-with-card-3" role="tab">
            <span class="flex gap-x-6">
              <svg class="shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-gray-800 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <span class="grow">
                <span class="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800 ">Powerful features</span>
                <span class="block mt-1 text-gray-800 ">Reduce time and effort on building modern look design with Preline only.</span>
              </span>
            </span>
          </button>
        </nav>
 
      </div>
   

      <div class="lg:col-span-6">
        <div class="relative">
       
          <div>
            <div id="tabs-with-card-1" role="tabpanel" aria-labelledby="tabs-with-card-item-1">
              <img class="shadow-xl shadow-gray-200 rounded-xl dark:shadow-gray-900/20" src="https://images.unsplash.com/photo-1605629921711-2f6b00c6bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&h=720&q=80" alt="Features Image" />
            </div>

           
          </div>
       
          <div class="hidden absolute top-0 end-0 translate-x-20 md:block lg:translate-x-20">
            <svg class="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
              <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
              <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
            </svg>
          </div>
      
        </div>
      </div>
  
    </div>


    <div class="absolute inset-0 grid grid-cols-12 size-full">
      <div class="col-span-full lg:col-span-7 lg:col-start-6 bg-gray-100 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full "></div>
    </div>
  
  </div>
</div>



{/* cards */}
   
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 ">

  <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
    <div className=''>
      <h1 class="block text-3xl font-semibold text-gray-800 sm:text-2xl lg:text-3xl lg:leading-tight ">My Tools</h1>
      <p class="mt-2 text text-gray-800">Everything you need to get ahead in your career.</p>
    </div>
  </div>



<div className='flex flex-row mt-4 md:mt-6'>

<div className='flex flex-row mt-4 md:mt-6 p-1'>

<div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">

  <div class="flex justify-between">
    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
      <svg class="shrink-0 size-5 text-gray-500" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z" fill="#36C5F0"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z" fill="#2EB67D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z" fill="#ECB22E"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z" fill="#E01E5A"/></svg>
    </div>

    <div>
     
      <label for="hs-pro-daicn1" class="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-none">
        <input type="checkbox" id="hs-pro-daicn1" class="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 text-transparent rounded-lg cursor-pointer focus:ring-white after:block after:size-full after:rounded-md checked:after:bg-gray-200 checked:text-transparent checked:border-gray-200 checked:hover:border-gray-200 checked:focus:border-gray-200 checked:bg-none focus:bg-gray-100 checked:focus:after:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" checked />
        <span class="relative z-10 peer-checked:hidden text-gray-800 ">
          Connect
        </span>
        <span class="relative z-10 justify-center items-center gap-x-1.5 hidden peer-checked:flex peer-checked:text-gray-800 text-gray-200 ">
          <svg class="shrink-0 size-3.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Available
        </span>
      </label>
 
    </div>
  </div>
  


  <div>
  <h3 class="font-medium text-gray-800">
      Build My resume
    </h3>
    <h3 class="text-sm text-gray-500">
      Generate a new resume for each position you apply to with the click of a button.
    </h3>
   

    <p class="mt-1 text-sm text-gray-500">
    Connect a slack workspace in order to setup automated notifications. sdfjknsdfjklsfksjd dkjfhsdkjf sdfkj jsdfklsjdfh
      sdfsjkdfhslkj
      sdfhslkjdfhskdjfhaslkfjsh sdjkfhsk 
      fjslkdfhsdh sdasd
       sdfhsdkfjalsfhsdkf
    </p>
  </div>

<div className=' flex mt-3 '>

<button type="button" class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
   Save
  </button>
  <button type="button" class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
    Apply
  </button>
</div>


</div>

  </div>
  <div className='flex flex-row mt-4 md:mt-6  p-1'>

<div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">

  <div class="flex justify-between">
    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
      <svg class="shrink-0 size-5 text-gray-500" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z" fill="#36C5F0"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z" fill="#2EB67D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z" fill="#ECB22E"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z" fill="#E01E5A"/></svg>
    </div>

    <div>
     
      <label for="hs-pro-daicn1" class="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-none">
        <input type="checkbox" id="hs-pro-daicn1" class="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 text-transparent rounded-lg cursor-pointer focus:ring-white after:block after:size-full after:rounded-md checked:after:bg-gray-200 checked:text-transparent checked:border-gray-200 checked:hover:border-gray-200 checked:focus:border-gray-200 checked:bg-none focus:bg-gray-100 checked:focus:after:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" checked />
        <span class="relative z-10 peer-checked:hidden text-gray-800 ">
          Connect
        </span>
        <span class="relative z-10 justify-center items-center gap-x-1.5 hidden peer-checked:flex peer-checked:text-gray-800 text-gray-200 ">
          <svg class="shrink-0 size-3.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Connected
        </span>
      </label>
 
    </div>
  </div>
  


  <div>
  <h3 class="font-medium text-gray-800">
      Company
    </h3>
    <h3 class="text-sm text-gray-500">
      Location
    </h3>
    <h3 class="text-sm text-gray-500">
      Pay
    </h3>

    <p class="mt-1 text-sm text-gray-500 ">
      Connect a slack workspace in order to setup automated notifications. sdfjknsdfjklsfksjd dkjfhsdkjf sdfkj jsdfklsjdfh
      sdfsjkdfhslkj
      sdfhslkjdfhskdjfhaslkfjsh sdjkfhsk 
      fjslkdfhsdh sdasd
       sdfhsdkfjalsfhsdkf
    </p>
  </div>

<div className=' flex mt-3 '>

<button type="button" class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
   Save
  </button>
  <button type="button" class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
    Apply
  </button>
</div>


</div>

  </div>
  <div className='flex flex-row mt-4 md:mt-6  p-1'>

<div class="p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">

  <div class="flex justify-between">
    <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
      <svg class="shrink-0 size-5 text-gray-500" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7326 0C9.96372 0.00130479 8.53211 1.43397 8.53342 3.19935C8.53211 4.96473 9.96503 6.39739 11.7339 6.39869H14.9345V3.20065C14.9358 1.43527 13.5029 0.00260958 11.7326 0C11.7339 0 11.7339 0 11.7326 0M11.7326 8.53333H3.20053C1.43161 8.53464 -0.00130383 9.9673 3.57297e-06 11.7327C-0.00261123 13.4981 1.4303 14.9307 3.19922 14.9333H11.7326C13.5016 14.932 14.9345 13.4994 14.9332 11.734C14.9345 9.9673 13.5016 8.53464 11.7326 8.53333V8.53333Z" fill="#36C5F0"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32 11.7327C32.0013 9.9673 30.5684 8.53464 28.7995 8.53333C27.0306 8.53464 25.5976 9.9673 25.5989 11.7327V14.9333H28.7995C30.5684 14.932 32.0013 13.4994 32 11.7327ZM23.4666 11.7327V3.19935C23.4679 1.43527 22.0363 0.00260958 20.2674 0C18.4984 0.00130479 17.0655 1.43397 17.0668 3.19935V11.7327C17.0642 13.4981 18.4971 14.9307 20.2661 14.9333C22.035 14.932 23.4679 13.4994 23.4666 11.7327Z" fill="#2EB67D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.2661 32C22.035 31.9987 23.4679 30.566 23.4666 28.8007C23.4679 27.0353 22.035 25.6026 20.2661 25.6013H17.0656V28.8007C17.0642 30.5647 18.4972 31.9974 20.2661 32ZM20.2661 23.4654H28.7995C30.5684 23.4641 32.0013 22.0314 32 20.266C32.0026 18.5006 30.5697 17.068 28.8008 17.0654H20.2674C18.4985 17.0667 17.0656 18.4993 17.0669 20.2647C17.0656 22.0314 18.4972 23.4641 20.2661 23.4654V23.4654Z" fill="#ECB22E"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.93953e-07 20.266C-0.00130651 22.0314 1.43161 23.4641 3.20052 23.4654C4.96944 23.4641 6.40235 22.0314 6.40105 20.266V17.0667H3.20052C1.43161 17.068 -0.00130651 18.5006 8.93953e-07 20.266ZM8.53342 20.266V28.7993C8.53081 30.5647 9.96372 31.9974 11.7326 32C13.5016 31.9987 14.9345 30.566 14.9332 28.8007V20.2686C14.9358 18.5032 13.5029 17.0706 11.7339 17.068C9.96372 17.068 8.53211 18.5006 8.53342 20.266C8.53342 20.2673 8.53342 20.266 8.53342 20.266Z" fill="#E01E5A"/></svg>
    </div>

    <div>
     
      <label for="hs-pro-daicn1" class="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-none">
        <input type="checkbox" id="hs-pro-daicn1" class="peer absolute top-0 start-0 size-full bg-transparent border border-gray-200 text-transparent rounded-lg cursor-pointer focus:ring-white after:block after:size-full after:rounded-md checked:after:bg-gray-200 checked:text-transparent checked:border-gray-200 checked:hover:border-gray-200 checked:focus:border-gray-200 checked:bg-none focus:bg-gray-100 checked:focus:after:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" checked />
        <span class="relative z-10 peer-checked:hidden text-gray-800 ">
          Connect
        </span>
        <span class="relative z-10 justify-center items-center gap-x-1.5 hidden peer-checked:flex peer-checked:text-gray-800 text-gray-200 ">
          <svg class="shrink-0 size-3.5 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Connected
        </span>
      </label>
 
    </div>
  </div>
  


  <div>
    <h3 class="font-medium text-gray-800">
      Company
    </h3>
    <h3 class="text-sm text-gray-500">
      Location
    </h3>
    <h3 class="text-sm text-gray-500">
      Pay
    </h3>

    <p class="mt-1 text-sm text-gray-500">
    Connect a slack workspace in order to setup automated notifications. sdfjknsdfjklsfksjd dkjfhsdkjf sdfkj jsdfklsjdfh
      sdfsjkdfhslkj
      sdfhslkjdfhskdjfhaslkfjsh sdjkfhsk 
      fjslkdfhsdh sdasd
       sdfhsdkfjalsfhsdkf
    </p>
  </div>

<div className=' flex mt-3 '>

<button type="button" class="mr-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
   Save
  </button>
  <button type="button" class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 ">
    Apply
  </button>
</div>


</div>

  </div>
</div>


  

</div>
</div>
  )
}

export default Tools