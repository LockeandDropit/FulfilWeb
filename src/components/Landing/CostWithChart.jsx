import React from 'react'
import { useNavigate } from "react-router-dom";
import BarChartComponent from './BarChartComponent';
const CostWithChart = () => {
  const navigate = useNavigate();
  return (
   
    <div className='w-full bg-sky-100 mt-10 py-10'>



    <div class="max-w-[85rem] mx-auto bg-sky-100 flex align-center items-center justify-center  ">


    {/* <img src="/landingImages/CanvaGraph3.png" alt="" className="mt-20" /> */}
      
      <div class="grid md:grid-cols-2 gap-12   ">
      

 
       
 
    
        <div class="flex  space-y-6 lg:space-y-10 mt-10">
        
        <div class="lg:w-3/4">
          <h2 class="text-3xl text-gray-800 font-bold lg:text-4xl ">
           What's the cost?
          </h2>
          <p class="mt-5 text-gray-800 text-lg ">
            The average total cost of a technical school in Minnesota is $9000 while the average cost of a traditional 4-year college is $40,000 <span className='text-xs position-top'>(1), (4)</span>
          </p>
          <p class="mt-3 text-gray-800 text-lg">
            The median pay of someone in the trades is graduate can expect to earn roughly $53,000 a year <span className='text-xs position-top'>(3)</span>. 
          </p>
          <p class="mt-3 text-gray-800 text-lg"> A graduate from a 4 year college will start at $55,000, only $2,000 more<span className='text-xs position-top'>(2)</span>.</p>
         
          <p class="mt-5">
          
          </p>

          <p className='mt-12 text-xs text-gray-800' >Sources:</p>
            <p className=' mt-2 text-xs text-gray-800'>1. https://www.niche.com/colleges/riverland-community-college/</p>
            <p className=' text-xs text-gray-800'>2. https://www.zippia.com/advice/average-starting-salary-out-of-college-statistics/</p>
            <p className=' text-xs text-gray-800'>3. https://www.sofi.com/learn/content/average-salary-for-trade-jobs/</p>
            <p className=' text-xs text-gray-800'>4. https://educationdata.org/average-cost-of-college</p>
           
        </div>
        </div>

        <div className='flex '>
      <img src="/landingImages/CanvaGraph3.png" />
      </div>
     
      </div>
    
    </div>

    </div>
  )
}

export default CostWithChart;