import React from 'react'

const OnboardingProgressBar = () => {
  return (
    <div className="mt-10 max-w-[85rem] w-full  mx-auto flex flex-col  justify-center items-center md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        {/* Order Status */}
<div className="md:hidden mb-2">
  <h5 className="mb-2 font-medium text-gray-800">
    Order status
  </h5>

  <div className="flex flex-wrap justify-between items-center gap-2">
    <p className="text-[13px] flex items-center gap-x-1.5">
      <span className="relative flex">
        <span className="animate-ping absolute inline-flex size-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full size-2 bg-sky-500"></span>
        <span className="sr-only">Current</span>
      </span>
      <span className="font-medium text-sky-500">Preparing order</span>
    </p>

    <p className="text-[13px] flex items-center gap-x-1.5">
      <span className="font-medium text-gray-800">Shipped</span>
      <span>
        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg>
        <span className="sr-only">Next</span>
      </span>
    </p>
  </div>
</div>
{/* End Order Status */}

{/* Grid */}
<div className="grid grid-cols-4 gap-x-1 sm:gap-x-3">
  <div>
    <p className="hidden md:flex items-center gap-x-1.5 mb-2 text-sm text-gray-800">
      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      Order placed
    </p>

    {/* Progress */}
    <div className="flex w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
      <div className="flex flex-col justify-center rounded-sm overflow-hidden bg-gray-800 text-xs text-white text-center whitespace-nowrap transition duration-500 w-full" ></div>
    </div>
    {/* End Progress */}
  </div>
  {/* End Col */}

  <div>
    <p className="hidden md:flex items-center gap-x-1.5 mb-2 text-sm text-sky-500">
      <span className="relative flex">
        <span className="animate-ping absolute inline-flex size-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full size-2 bg-sky-500"></span>
        <span className="sr-only">Current</span>
      </span>
      Preparing order
    </p>

    {/* Progress */}
    <div className="flex w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden" role="progressbar" aria-valuenow="0" aria-valuemin="100" aria-valuemax="100">
      <div className="flex flex-col justify-center rounded-sm overflow-hidden bg-sky-500 text-xs text-white text-center whitespace-nowrap transition duration-500 w-full"></div>
    </div>
    {/* End Progress */}
  </div>
  {/* End Col */}

  <div>
    <p className="hidden md:block opacity-50 mb-2 text-sm text-gray-800">
      Shipped
    </p>

    {/* Progress */}
    <div className="flex w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <div className="flex flex-col justify-center rounded-sm overflow-hidden bg-gray-800 text-xs text-white text-center whitespace-nowrap transition duration-500 w-0" ></div>
    </div>
    {/* End Progress */}
  </div>
  {/* End Col */}

  <div>
    <p className="hidden md:block opacity-50 mb-2 text-sm text-gray-800">
      Delivered
    </p>

    {/* Progress */}
    <div className="flex w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <div className="flex flex-col justify-center rounded-sm overflow-hidden bg-gray-800 text-xs text-white text-center whitespace-nowrap transition duration-500 w-0" ></div>
    </div>
    {/* End Progress */}
  </div>
  {/* End Col */}
</div>
{/* End Grid */}
    </div>
  )
}

export default OnboardingProgressBar