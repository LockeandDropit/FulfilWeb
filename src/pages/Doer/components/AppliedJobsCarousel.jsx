import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const AppliedJobsCarousel = ({ slides }) => {

  console.log("slides id from applied", slides)

  

  const [jobs, setJobs] = useState([])

  useEffect(() => {
    if (slides) {
      slides.forEach(async (x) => {
        const querySnapshot = await getDocs(collection(db, "scraped"));
            querySnapshot.docs.forEach((doc) => {
              if (doc.id === x.jobID) {
              setJobs((prevState) => [...prevState, doc.data()]);
            }})
      })
    }
  }, [slides])






  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {jobs?.map((job) => (
        <div className="flex flex-col sm:flex-row  p-1 w-full auto">
          <div class=" p-5 space-y-2 flex flex-col bg-white border w-full border-gray-200 rounded-xl hover:shadow-md cursor-pointer">
            <div>
              <div className="flex justify-between">
                <h3 class="font-semibold text-lg text-gray-800 line-clamp-1">
                  {job.job_title}
                </h3>
                <div class="flex justify-between min-w-fit pl-1">
                  <div class="flex flex-col justify-center items-center  ">
                    <span class="ml-1 inline-flex items-center gap-x-1 text-sm font-medium text-green-600 rounded-full">
                      5% raise
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
              </div>

              <div className="flex space-x-1.5 mt-1 text-sm">
                {" "}
                <h3 class=" text-gray-700 ">{job.company}</h3>
                <ul className="flex flex-row gap-y-1 text-gray-600">
                  <li className="flex gap-x-1.5">
                    <div className="shrink-0 size-1 mt-2  bg-gray-600 rounded-full"></div>
                    {job.location}
                  </li>
                </ul>
              </div>

              <h3 class="text-sm text-gray-500">
                <span className="text-sm  text-gray-600">{job.pay_range}</span>{" "}
              </h3>

              <p class="my-3 text-gray-600 line-clamp-3 text-sm">{job.job_summary}</p>
            </div>

            <div className="flex mt-auto mb-1">
              <button
                type="button"
                class="w-1/4 ml-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 "
                //   onClick={() => handleOpenJob(job)}
              >
                Save
              </button> 
              <button
                type="button"
                class="ml-1 py-2 px-3 w-3/4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
                //   onClick={() => handleOpenJob(job)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default AppliedJobsCarousel;
