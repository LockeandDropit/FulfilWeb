import React from 'react'

const CustomPromotedListCards = () => {

    //https://www.uber.com/us/en/drive/?uclick_id=f18ce71f-dfd4-4cb3-a582-669bdd253e79


const navigateToUber = () => {
    window.open("https://www.uber.com/us/en/drive/?uclick_id=f18ce71f-dfd4-4cb3-a582-669bdd253e79", "_blank");
}
const handleNavigateToSource = () => {
    window.open("https://minnesotareformer.com/2024/03/08/what-does-the-average-uber-and-lyft-driver-make-state-report-has-an-answer/", "_blank");
}

    return (
    <>
    <div class=" mt-3 mb-2 p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
    <div class="flex justify-between">
    <div class="flex flex-col justify-center">
      <h3 class="font-medium text-gray-800 text-xl ">
        Driver
      </h3>
      <div className="flex">
       
          <>
            <div class="flex flex-col justify-center items-center size-[56px]  ">
              {/* <img
                src={businessPostedJobs.employerProfilePicture}
                class="flex-shrink-0 size-[64px] rounded-full"
              /> */}

              <div className="flex flex-col ml-4">
                <p class="font-semibold text-base text-black-700  mt-2 cursor-default">
                  Uber
                </p>
                <p class="font-semibold  text-gray-500 cursor-default ">
                  Minnesota
                </p>
              </div>
            </div>
          </>
       
       
      </div>

    
        <label
          for="hs-pro-dactmt"
          class="block   font-medium text-gray-800"
        >
          Full-time or Part-time
        </label>
      
    
        <div class="space-y-1 ">
          <div class="flex align-items-center">
            <p className="  font-medium">$</p>
            <label
              for="hs-pro-dactmt"
              class="block font-medium text-gray-800 "
            >
              21
            </label>
            <p className="font-medium">/hour - $</p>
            <label
              for="hs-pro-dactmt"
              class="block  font-medium text-gray-800 "
            >
              52
            </label>
            <p className=" font-medium">/hour*</p>
          </div>
        </div>
    </div>

    <div>
      <label
        for="hs-pro-daicn1"
        class="relative py-2 px-2.5 w-full sm:w-auto block text-center sm:text-start rounded-lg cursor-pointer text-xs font-medium focus:outline-none"
      >
        <button
          onClick={navigateToUber}
          type="button"
          class="py-2 px-4 w-full inline-flex justify-center items-center gap-x-2 text-base  rounded-lg border  bg-sky-400 text-white hover:bg-sky-500  "
        >
          Apply
        </button>
      </label>
    </div>
  </div>

  <div>
                    <h3 class="font-medium text-gray-800 ">Description</h3>

                    <p class="mt-1 text-base text-gray-500 line-clamp-3">
                     Are you looking for a full-time reliable job or a flexible part-time hustle to earn some cash? Driving with Uber can be rewarding and flexible.
                    </p>
                    <p class="mt-1 text-xs text-gray-500 line-clamp-3">
                     *Hourly rates do not include expenses. (source: <span className='underline cursor-pointer' onClick={handleNavigateToSource}>here</span>)
                    </p>
                  </div>
  </div>
  </>
  )
}

export default CustomPromotedListCards