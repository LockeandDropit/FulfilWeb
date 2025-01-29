import React from 'react'

const SubHeroCopy = () => {
  return (
    <div className="bg-white bg-gradient-to-t ">
        
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8  pt-24 pb-24 mx-auto">
            {/* <div className="max-w-3xl mb-10 lg:mb-14">
              <h2 className="text-black font-semibold text-2xl md:text-4xl md:leading-tight">
                About the Industry
              </h2>
              <p className="mt-1 text-neutral-600">
                The Bussing industry salraies have gone up more than 50% in the last several years, far outpacing average wage growth. Many employers offer benefits like health, vision, and dental insurance.
              
              </p>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 items-center border border-blue-400 divide-y lg:divide-y-0 lg:divide-x divide-blue-700 rounded-xl">
              <a
                className="group relative z-10 p-4 md:p-6 h-full flex flex-col bg-blue-200 bg-opacity-40 first:rounded-t-xl last:rounded-b-xl lg:first:rounded-l-xl lg:first:rounded-tr-none lg:last:rounded-r-xl lg:last:rounded-bl-none before:absolute before:inset-0 before:bg-gradient-to-b before:hover:from-transparent before:hover:via-transparent before:hover:to-[#ff0]/10 before:via-80% before:-z-[1] before:last:rounded-b-xl lg:before:first:rounded-s-xl lg:before:last:rounded-e-xl lg:before:last:rounded-bl-none before:opacity-0 before:hover:opacity-100"
                href="#"
              >
                <div className="mb-5">
                  <div className="mt-5">
                    <p className="font-semibold text-5xl text-gray-900">
                     33%
                    </p>
                    <h3 className="mt-5 font-semibold text-lg text-black">
                      College Dropout rate
                    </h3>
                    <p className="mt-1 text-gray-900">
                     Roughly a third of all students who attend a 4 year college end up dropping out before graduating.
                    </p>
                  </div>
                </div>
                {/* <p className="mt-auto">
                  <span
                    onClick={() =>
                      window.open(
                        "https://www.salary.com/research/salary/listing/cdl-driver-class-b-salary/minneapolis-mn"
                      )
                    }
                    className="font-medium text-sm text-gray-900 pb-1 border-b-2 border-neutral-700 group-hover:border-blue-700 transition focus:outline-none group-focus:border-blue-700"
                  >
                    Source
                  </span>
                </p> */}
              </a>

              <a
                className="group relative z-10 p-4 md:p-6 h-full flex flex-col bg-blue-200 bg-opacity-40 first:rounded-t-xl last:rounded-b-xl lg:first:rounded-l-xl lg:first:rounded-tr-none lg:last:rounded-r-xl lg:last:rounded-bl-none before:absolute before:inset-0 before:bg-gradient-to-b before:hover:from-transparent before:hover:via-transparent before:hover:to-[#ff0]/10 before:via-80% before:-z-[1] before:last:rounded-b-xl lg:before:first:rounded-s-xl lg:before:last:rounded-e-xl lg:before:last:rounded-bl-none before:opacity-0 before:hover:opacity-100"
                href="#"
              >
                <div className="mb-5">
                  <div className="mt-5">
                    <p className="font-semibold text-5xl text-gray-900">$30,872</p>
                    <h3 className="mt-5 font-semibold text-lg text-black">
                      Average Student Debt
                    </h3>
                    <p className="mt-1 text-gray-900">
                     That's a lot.
                    </p>
                  </div>
                </div>
                {/* <p className="mt-auto">
                  <span
                    onClick={() =>
                      window.open(
                        "https://www.reddit.com/r/Truckers/comments/1dgw51p/what_trucking_companies_have_good_benefits/"
                      )
                    }
                    className="font-medium text-sm text-gray-900 pb-1 border-b-2 border-neutral-700 group-hover:border-blue-700 transition focus:outline-none group-focus:border-blue-700"
                  >
                    Source
                  </span>
                </p> */}
              </a>

              <a
                className="group relative z-10 p-4 md:p-6 h-full flex flex-col bg-blue-200 bg-opacity-40 first:rounded-t-xl last:rounded-b-xl lg:first:rounded-l-xl lg:first:rounded-tr-none lg:last:rounded-r-xl lg:last:rounded-bl-none before:absolute before:inset-0 before:bg-gradient-to-b before:hover:from-transparent before:hover:via-transparent before:hover:to-[#ff0]/10 before:via-80% before:-z-[1] before:last:rounded-b-xl lg:before:first:rounded-s-xl lg:before:last:rounded-e-xl lg:before:last:rounded-bl-none before:opacity-0 before:hover:opacity-100"
                href="#"
              >
                <div className="mb-5">
                  <div className="mt-5">
                    <p className="font-semibold text-5xl text-gray-900">
                    {'>'}50%
                    </p>
                    <h3 className="mt-5 font-semibold text-lg text-black">
                      of college grads don't find a job in their field.
                    </h3>
                    <p className="mt-1 text-gray-900">
                     Many traditional degrees don't fit well into the modern economy, and as a result many graduates are forced to look elsewhere.
                    </p>
                  </div>
                </div>
                {/* <p className="mt-auto">
                  <span
                    onClick={() =>
                      window.open(
                        "https://www.glassdoor.com/Salaries/new-york-city-ny-class-b-cdl-truck-driver-salary-SRCH_IL.0,16_IM615_KO17,41.htm"
                      )
                    }
                    className="font-medium text-sm text-gray-900 pb-1 border-b-2 border-neutral-700 group-hover:border-blue-700 transition focus:outline-none group-focus:border-blue-700"
                  >
                    Source
                  </span>
                
                </p> */}
              </a>
            </div>
          </div>
        </div>
  )
}

export default SubHeroCopy