import React from 'react'
import { useNavigate } from "react-router-dom";
import BarChartComponent from './BarChartComponent';
const CostWithChart = () => {
  const navigate = useNavigate();
  return (
   

    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto sm:mt-20 min-h-[500px] ">
      <div class="grid md:grid-cols-2 gap-12  min-h-[500px] ">
       {/* //chart here */}

      <div className='flex '>
      <BarChartComponent />
      </div>
       
 
    
        <div class="flex align-text items-center justify-center space-y-6 lg:space-y-10 ">
        
        <div class="lg:w-3/4">
          <h2 class="text-3xl text-gray-800 font-bold lg:text-4xl ">
            Get more out of your time and money.
          </h2>
          <p class="mt-5 text-gray-800 text-lg ">
            The average total cost of a technical school in Minnesota is $9000 while the average cost of a traditional 4-year college is $40,000 <span className='text-xs position-top'>(1), (4)</span>
          </p>
          <p class="mt-3 text-gray-800 text-lg">
            The median pay of someone in the trades is graduate can expect to earn roughly $53,000 a year <span className='text-xs position-top'>(3)</span>. 
          </p>
          <p class="mt-3 text-gray-800 text-lg"> A graduate from a 4 year college will start at $55,000, only $2,000 more<span className='text-xs position-top'>(2)</span>.</p>
         
          <p class="mt-5">
            {/* <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="#">
              Contact sales to learn more
              <svg class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </a> */}
          </p>

          <p className='mt-12 text-xs text-gray-800' >Sources:</p>
            <p className=' mt-2 text-xs text-gray-800'>1. https://www.niche.com/colleges/riverland-community-college/</p>
            <p className=' text-xs text-gray-800'>2. https://www.zippia.com/advice/average-starting-salary-out-of-college-statistics/</p>
            <p className=' text-xs text-gray-800'>3. https://www.sofi.com/learn/content/average-salary-for-trade-jobs/</p>
            <p className=' text-xs text-gray-800'>4. https://educationdata.org/average-cost-of-college</p>
           
        </div>
        </div>
     
      </div>
    
    </div>

  
  )
}

export default CostWithChart;