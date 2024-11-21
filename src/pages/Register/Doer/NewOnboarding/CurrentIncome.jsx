import React from 'react'

const CurrentIncome = () => {
  return (
    <div className=' max-w-[85rem] w-full h-[calc(500px-20px)]  mx-auto flex flex-col  justify-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex flex-col items-center justify-center'>
        <h1 className='font-medium text-gray-800 text-2xl'>
            What's your current income?
        </h1>
        <input className="mt-6 sm:mt-8 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="This is placeholder"  />
        
        </div>
    
        <div className=''>
        <label  class="text-sm font-medium mb-2 ">How are you paid?</label>
        <select class=" mt-3 sm:mt-6 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">

  <option>Hourly</option>
  <option>Salary</option>

</select>
</div>
    </div>
  )
}

export default CurrentIncome