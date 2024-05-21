import React from 'react'

const Detail = () => {
  return (
    <div className="flex flex-1">
    <div class="w-full max-h-full flex flex-col  bg-white rounded-lg pointer-events-auto  ">
    <div class="py-3 px-4 flex justify-between items-center  ">
                                <div class="w-100 max-h-full   bg-white rounded-xl  ">
                                  

                                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                    <div class="p-4 space-y-2">
                                      <div class="">
                                        <div class="py-3  flex-column  items-center  ">
                                          <label
                                            for="hs-pro-dactmt"
                                            class="block mb-2 text-xl font-medium text-gray-800 "
                                          >
                                          gdsfgsdf
                                          </label>
                                          <p> Minnesota</p>
                                        </div>

                                        <div class=" flex-row  items-center  ">
                                      
                                            <div className="flex flex-row items-center">
                                              <p>
                                               
                                                Offer: $
                                              </p>
                                            </div>
                                       
                                        </div>
                                      </div>

                                      <div class="">
                                        <label
                                          for="dactmi"
                                          class=" text-lg font-medium text-gray-800 "
                                        >
                                          Description
                                        </label>

                                        <p  class=" text-md  ">sdvsd</p>
                                      </div>

                                      {/* <div class="space-y-1 ">
                                        <label
                                          for="dactmm"
                                          class="block mb-2 mt-10 text-lg font-medium text-gray-800 "
                                        >
                                          Applicants
                                        </label>
                                        
                                      </div> */}
                                    </div>

                                    <div class="p-4 flex justify-between gap-x-2   ">
                                      <div class="w-full flex justify-end items-center gap-x-2">
                                        <button
                                          type="button"
                                    
                                          class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-white  hover:bg-gray-200 text-black text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Save Job
                                        </button>
                                        <button
                                
                                          class="py-2 px-3 inline-flex  justify-center items-center gap-x-2 text-start bg-sky-400  hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                        >
                                          Apply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
    </div>
  </div>
  )
}

export default Detail