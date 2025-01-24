import React from "react";
import { useNavigate } from "react-router-dom";

const Greeting = ({ user }) => {
  const navigate = useNavigate();

  console.log("greeting", user);
  return (
    <div className="w-full pb-6 md:pb-20 pt-10">
      <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-16 ">
        <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
          <div className="w-full mx-auto ">
            <div className="flex flex-col">
              <label
                for="hs-pro-dactmt"
                class=" text-3xl font-medium text-gray-900"
              >
                Welcome {user?.firstName}
              </label>
           
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl">
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase font-medium tracking-wide text-sky-400">
                      Recommended Industry
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl sm:text-xl font-medium text-gray-800">
                      {user?.industryReccomendation?.recommendation}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl">
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                      Average Pay
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2">
                    <h3 className="text-xl font-medium text-gray-800">
                      ${user?.industryReccomendation?.average_pay}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div>
        <h3 class="text-lg font-semibold text-gray-800 mt-4 ">
          Why the {user?.industryReccomendation?.recommendation}?
        </h3>
        <p class="mt-2 text-gray-600 ">
        {user?.industryReccomendation?.overview}
        </p>
      </div>
          </div>

          {/* <div className='mt-6 md:mt-16  '>
        <h1 class="block text-3xl font-bold text-gray-800 sm:text-3xl lg:text-3xl lg:leading-tight ">Welcome, {user?.firstName} </h1>
    
      <div className='flex flex-row'>
      <p class="mt-2 text-lg font-medium text-gray-800">Current Income:</p>
      <p class="mt-2 text-lg text-gray-800 ml-2">${user?.currentIncome}/year</p>
      </div>
      <div className='flex flex-row'>
      <p class="mt-2 text-lg font-medium text-gray-800">Location:</p>
      <p class="mt-2 text-lg text-gray-800 ml-2">{user?.city}, {user?.state}</p>
      </div>
      <div className='flex flex-row '>
     
      <p class="mt-2 text-lg text-gray-800 "><span class="text-lg font-medium text-gray-800 mr-2">My interests:</span>{user?.userInterests}</p>
      </div>
     
     
     
        <p className='ml-auto text-sm text-gray-500'> read more <span className="underline">here</span></p> 
    </div> */}

          <div className="p-2 ">
            <div className="p-2 bg-white">
              <nav
                className="relative flex gap-x-1 after:absolute after:bottom-0 after:inset-x-0 after:border-b after:border-stone-200"
                aria-label="Tabs"
                role="tablist"
                aria-orientation="horizontal"
              >
                <h2
                  className="cursor-default hs-tab-active:after:bg-stone-800 hs-tab-active:text-stone-800 px-2.5 py-1.5 mb-2 relative inline-flex items-center gap-x-2  text-stone-500  text-base rounded-lg disabled:opacity-50  font-medium focus:outline-none focus:bg-stone-100 after:absolute after:-bottom-2 after:inset-x-0 after:z-10 after:h-0.5 active"
                  id="hs-pro-tabs-dtsch-item-revenue"
                  aria-selected="true"
                  data-hs-tab="#hs-pro-tabs-dtsch-revenue"
                  aria-controls="hs-pro-tabs-dtsch-revenue"
                  role="tab"
                >
                  Progress Tracker
                </h2>
              </nav>

              <div>
                <div
                  id="hs-pro-tabs-dtsch-revenue"
                  role="tabpanel"
                  aria-labelledby="hs-pro-tabs-dtsch-item-revenue"
                >
                  <div className="py-4">
                    <h4 className="font-semibold text-xl md:text-2xl text-stone-800 cursor-default">
                      ${user?.currentIncome}
                    </h4>

                    <div className="relative mt-3">
                      <div
                        className="flex w-full h-2 bg-stone-200 rounded-sm overflow-hidden"
                        role="progressbar"
                        aria-valuenow="72"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="flex flex-col justify-center rounded-sm overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                      <div className="absolute top-1/2 start-[71%] w-2 h-5 bg-green-600 border-2 border-white rounded-sm transform -translate-y-1/2"></div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-stone-800">0</span>
                      <span className="text-sm text-stone-800">
                        ${user?.goalIncome}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-stone-600">
                      Next steps to further your career:
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <a
                className="p-2 flex items-center gap-x-2 text-sm font-medium text-stone-800 rounded-lg hover:bg-stone-100 focus:outline-none focus:bg-stone-100 cursor-pointer"
                onClick={() => navigate("/MyProfile")}
              >
                <span className="flex shrink-0 justify-center items-center size-7 bg-white border border-stone-200 rounded-lg">
                  <svg
                    className="shrink-0 size-3.5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                  </svg>
                </span>
                <div className="grow">
                  <p>Set up my profile</p>
                </div>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </a>

              <a
                className="p-2 flex items-center gap-x-2 text-sm font-medium text-stone-800 rounded-lg hover:bg-stone-100 focus:outline-none focus:bg-stone-100 cursor-pointer"
                onClick={() => navigate("/Resources")}
              >
                <span className="flex shrink-0 justify-center items-center size-7 bg-white border border-stone-200 rounded-lg">
                  <svg
                    className="shrink-0 size-3.5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
                  </svg>
                </span>
                <div className="grow">
                  <p>Show resources near me</p>
                </div>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </a>
            </div>
          </div>
          {/* <div className='mt-6 md:mt-16 flex items-center justify-center'>
   
    <div className='border border-sky-100 shadow-md w-2/3 h-full rounded-lg flex flex-col items-center justify-center bg-sky-100 py-24 px-10'>
      <h4 class="text-lg sm:text-2xl font-semibold text-gray-800">My Income Goal</h4>
      <div className="flex">
      <p class="mt-2 sm:mt-3 text-5xl sm:text-6xl font-bold text-green-500">${user.goalIncome}</p>
      <p class="ml-2 mt-auto text-gray-500">a year</p>
      </div>
    </div>
    </div> */}
        </div>
      </div>
    </div>
  );
};

export default Greeting;
