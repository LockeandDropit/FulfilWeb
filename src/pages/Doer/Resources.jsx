import React from "react";

import DoerHeader from "./components/DoerHeader";


const Resources = () => {
  return (
    <div className="w-full">
      <DoerHeader />

      {/* <div class="sm:hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div class="max-w-[85rem] min-h-[35vh] md:min-h-[75vh] bg-[url('https://images.unsplash.com/photo-1665686374006-b8f04cf62d57?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1020&q=80')] bg-center bg-cover bg-no-repeat relative rounded-xl">
          <div class="absolute bottom-0 start-0 end-0 max-w-xs text-center mx-auto p-6 md:start-auto md:text-start md:mx-0">
            <div class="px-5 py-4 inline-block bg-white rounded-lg md:p-7 dark:bg-neutral-800">
              
            </div>
          </div>
        </div>
        <div>
          <h3 class="mt-4 text-3xl font-bold text-gray-800 sm:text-2xl ">About us</h3>
          <p className="mt-4 text-lg text-black">
            At Fulfil, we believe everyone deserves the opportunity to build a
            rewarding career, regardless of their educational background. We're
            here to guide you on your journey to professional success.
          </p>
          <p className="mt-6 text-lg text-black">
            Fulfil's mission is to help everyone achieve their highest potential
            by providing access to abundant opportunities and the tools to
            pursue them. Whether you're just starting out or seeking a new
            direction, Fulfil offers a clear path to gainful employment for
            those considering careers that do not require four-year degrees.
          </p>
        </div>
      </div> */}
      {/* <div class="max-sm:hidden max-sm:px-4 py-10 lg:py-14 mx-auto flex items-center align-center justify-center">
        <div className={"flex max-w-[85rem] min-h-[35vh] md:min-h-[75vh] bg-aboutHero bg-center bg-cover bg-no-repeat  rounded-lg"}>
     
          <div class=" flex align-center items-center justify-center w-1/2  text-center p-6   mx-auto mt-auto opacity-95">
            <div class="px-5 py-4  bg-white rounded-lg md:p-7 ">
              <h3 class="text-xl font-bold text-gray-800 sm:text-3xl ">
                Resources
              </h3>
              <p className="mt-4 text-lg text-black">
                At Fulfil, we believe everyone deserves the opportunity to build
                a rewarding career, regardless of their educational background.
                We're here to guide you on your journey to professional success.
              </p>
              <p className="mt-2 text-lg text-black">
                Fulfil's mission is to help everyone achieve their highest
                potential by providing access to abundant opportunities and the
                tools to pursue them. Whether you're just starting out or
                seeking a new direction, Fulfil offers a clear path to gainful
                employment for those considering careers that do not require
                four-year degrees.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full bg-sky-400 py-6 py-12 mt-16">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 ">
          <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
            <div className="">
              <h1 class="block text-3xl font-semibold text-white sm:text-2xl lg:text-3xl lg:leading-tight ">
                Resources
              </h1>
              <p class="mt-2 text text-white">
                Browse free resources that will help you find and prepare for a great career!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/threepersonmeeting.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Goodwill-Easter Seals Minnesota
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Workshops, career counseling, resume writing, mock
                      interviews, and connections to supportive services.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() =>
                        window.open("https://www.goodwilleasterseals.org")
                      }
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/mediumWarehouse.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Project for Pride in Living (PPL)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Job-skills training, credentialing programs (e.g.,
                      healthcare, IT), career coaching, and support services
                      (housing, financial literacy).
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.ppl-inc.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/apronsmeeting.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      EMERGE Community Development
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Job readiness, job search assistance, resume building,
                      community-based job fairs, and career pathways for youth
                      and adults.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://emerge-mn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/womansmiling.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Avivo
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Vocational training in healthcare, IT, manufacturing, and
                      customer service, as well as career education, job
                      placement, and long-term retention support.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://avivomn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/people-working-as-team-company.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Twin Cities R!SE
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Job and soft-skills training, coaching, and work
                      experience programs in partnership with employers.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://twincitiesrise.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/1.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      HIRED
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Career assessment, job search assistance, short-term
                      training certificates, and partnerships with employers in
                      high-growth industries.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.hired.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/2.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      CLUES (Comunidades Latinas Unidas En Servicio)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Bilingual job training, employment placement, financial
                      education, and English-language classes.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://clues.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/3.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      International Institute of Minnesota
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      English language classes, healthcare career pathways
                      (nursing assistant, etc.), citizenship classes, and career
                      counseling.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://iimn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/4.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Lutheran Social Service of Minnesota (LSS)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Financial counseling, placement support, youth employment
                      programs, and assistance for New Americans.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.lssmn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>








                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/5.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    Summit Academy OIC
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    No-cost, 20-week training programs for in-demand fields (electrician, carpentry, healthcare). Also offers personal and professional development courses.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://saoic.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/6.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    WomenVenture
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Business training, financial education, and coaching to help women launch and grow small businesses. Also offers career transition guidance and workshops.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.womenventure.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/6.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    Minneapolis Urban League
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Job and career counseling, skills training, resume review, career fairs, and programs designed to address disparities impacting the African American community.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://ultcmn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/7.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    YWCA Minneapolis & YWCA St. Paul
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Job readiness programs, youth employment and leadership development, financial literacy workshops, and career placement assistance.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.ywcampls.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  
                 <img src="/landingImages/8.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    Neighborhood Development Center (NDC)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Entrepreneurship training, business lending, technical assistance, and support in opening and sustaining neighborhood-based businesses—often a path to job creation and workforce growth.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.ndc-mn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/9.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    Better Futures Minnesota
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Job skills development (especially in construction and property maintenance), coaching, housing, and behavioral health services for men who have been incarcerated, homeless, or face significant barriers to employment.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://betterfuturesminnesota.com/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/10.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Lutheran Social Service of Minnesota (LSS)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                      Financial counseling, placement support, youth employment
                      programs, and assistance for New Americans.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.lssmn.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/forklift.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    African Development Center (ADC)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Micro-lending, small business development coaching, and financial workshops. While it’s focused on entrepreneurship, ADC also provides workforce development-related guidance through its network.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.adcminnesota.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/warehouse2.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    YWCA Cass Clay (Fargo-Moorhead Area)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Job skills programs, transitional housing, and other supportive services for women and families experiencing homelessness or poverty, with a focus on moving toward long-term employment.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.ywcacassclay.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>


                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/elderlyman.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    Building Strong Communities (Union-led initiative)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Free multi-week training program that exposes participants to various union trades (electrical, carpentry, cement, etc.), offering a potential path to apprenticeship.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://buildingstrong.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>

                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                  <img src="/landingImages/warehouseresource.jpg" className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                      Resource
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                    YWCA Cass Clay (Fargo-Moorhead Area)
                    </h3>
                    <p className="mt-3 text-gray-700 font-medium">
                      What they offer
                    </p>
                    <p className=" text-gray-500">
                    Job skills programs, transitional housing, and other supportive services for women and families experiencing homelessness or poverty, with a focus on moving toward long-term employment.
                    </p>
                  </div>
                  <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => window.open("https://www.ywcacassclay.org/")}
                    >
                      Visit Site
                    </a>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
