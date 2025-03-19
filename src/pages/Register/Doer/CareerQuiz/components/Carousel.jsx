import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { border } from "@chakra-ui/react";
import { useQuizStore } from "../quizStore";

const Carousel = ({ result, setHasSelected }) => {
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
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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

  const {
    setChosenCareerPath,
    setQuizCompleted
    } = useQuizStore();

  const [selected, setSelected] = useState([]);

  const checkSelectedLength = () => {
    if (selected.length > 0 || !selected) {
      setHasSelected(true);
    } else {
      setHasSelected(false);

    }
  };

  const handleSelect = (x) => {
    //if already included, remove.

    //change this to local store, can then pass it on sign up to FB more easily.

    // if (selected?.includes(x)) {
    //   setSelected(selected.filter((item) => item !== x));
    // } else {
    //   setSelected((prevState) => [...prevState, x]);

    // }
setSelected([x])
    // local storage
    console.log("selected", selected)
    setChosenCareerPath([x]);
  setQuizCompleted(true)

    checkSelectedLength();
  };

  // Expected output: true

  // i CAN STORE ALL OF THE SELECTED JOB locally, then upload them to FB on upload.

  // Send the primary one to the api and return jobs & edu.

  // save others as options, can be edited from profile?

  return (
    <Slider {...settings}>
      {result?.map((result, index) => (
        <div className="flex flex-col sm:flex-row mt-4 md:mt-6 p-1 w-5/6 h-3/4 ">
          <div
            className={`p-5 space-y-4 flex flex-col bg-white  text-center  rounded-xl hover:shadow-md cursor-pointer ${
              selected?.includes(result)
                ? "border-2 border-sky-400"
                : "border border-gray-300"
            }`}
            onClick={() => handleSelect(result)}
          >
            <div className="flex ">
              <h3 class="font-medium flex-1 text-center text-3xl text-gray-800 mb-6">
                {result.career_title}
              </h3>
              <input
                type="checkbox"
                id="hs-pro-esdo1"
                className="size-6 ml-auto bg-transparent  text-green-600 rounded-full bg-green-100 border-green-100 focus:ring-white focus:ring-offset-0 "
                checked={selected?.includes(result) ? true : false}
              />
            </div>

            <div className="w-full items-center justify-center flex flex-row space-x-2">
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Avg. salary</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                  <p class="text-2xl font-semibold text-gray-800 ">
                    {result.average_salary}
                  </p>
                </div>
              </div>
              <div class="p-2 flex flex-col border border-gray-200 rounded-xl w-full">
                <h2 class="text-sm text-gray-500 ">Industry Growth</h2>

                <div class="flex items-center justify-center gap-x-1.5">
                  <p class="text-2xl font-semibold text-gray-800 ">
                    {result.industry_growth}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row mt-4 space-x-2">
              {result.badges.map((badge) => (
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                  {badge}
                </span>
              ))}
            </div>

            <p class="mt-3 text-gray-500 sm:max-w-xl ">{result.description}</p>

            <div class="mt-5">
              <button class="w-full sm:w-1/3 py-2 px-3 md:py-2.5 md:px-4 inline-flex justify-center items-center gap-x-1.5 whitespace-nowrap text-[13px] md:text-medium font-medium rounded-lg border border-gray-200  text-sky-500 bg-white hover:text-sky-600 hover:border-gray-300 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden">
                Save
              </button>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
