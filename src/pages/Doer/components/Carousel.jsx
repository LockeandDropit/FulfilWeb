import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({slides}) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
   
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };
 
      
  return (
    <Slider {...settings}>
 {slides?.map((job) => (
              
          
              <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-5/6  ">
                <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                  <div class="flex justify-between">
                    <div class="flex flex-col justify-center items-center  ">
                      <span class="ml-1 inline-flex items-center gap-x-1 text-base font-medium text-green-600 rounded-full">
                        {job.percent_increase}% pay increase
                        <svg
                          class="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                          <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-800">
                      {job.job_title}
                    </h3>
                    <h3 class="font-medium text-gray-800">{job.company}</h3>
                    <h3 class="text-sm text-gray-500">{job.location}</h3>
                    <h3 class="text-sm text-gray-500 mt-2">
                      <span className="text-sm font-medium text-gray-800">
                        Salary:
                      </span>{" "}
                      ${job.pay_rate}
                    </h3>

                    <p class="mt-3 text-gray-700 line-clamp-4">
                      {job.job_description}
                    </p>
                  </div>

                  <div className="flex mt-auto mb-1">
               
                    <button
                      type="button"
                      class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                    //   onClick={() => handleOpenJob(job)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
   
          
        ))}


        </Slider>
  )
}

export default Carousel