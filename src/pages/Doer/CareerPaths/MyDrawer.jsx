import React from "react";
import { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { getDoc, doc, snapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const MyDrawer = ({ toggle, open, nodeId, category }) => {
  const [drawerInfo, setDrawerInfo] = useState(null);

  useEffect(() => {
    console.log("node & category", nodeId, category);

    const docRef = doc(db, "Career Paths", category);
    getDoc(docRef).then((snapshot) => {
      snapshot.data().drawers.forEach((data) => {
        if (data.id === nodeId) {
          setDrawerInfo(data);
        }
      });
    });
  }, [category]);

  const handleClose = () => {
    toggle();
  };

  return (
    <div>
      {" "}
      <Drawer onClose={() => handleClose()} isOpen={open} size={"lg"}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            {drawerInfo ? (
              <div class="">
                <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                  <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                    <div class="p-4">
                      <div class=" cursor-default">
                        <div className="flex flex-col">
                          <label
                            for="hs-pro-dactmt"
                            class="block  text-2xl font-medium text-gray-900"
                          >
                            {drawerInfo.jobTitle}
                          </label>
                          <label
                            for="hs-pro-dactmt"
                            class="block mb-4  font-medium text-gray-700"
                          >
                            Minneapolis, MN
                          </label>
                        </div>

                        <div className="w-full  mx-auto">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="flex flex-col bg-white border shadow-sm rounded-xl">
                              <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                  <p className="text-xs uppercase font-medium tracking-wide text-sky-400">
                                    Avg. Salary
                                  </p>
                                </div>

                                <div className="mt-1 flex items-center gap-x-2">
                                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                    $60,000
                                  </h3>
                                </div>
                              </div>
                            </div>

                            <div
                              className="flex flex-col cursor-pointer bg-white border shadow-sm rounded-xl"
                              onClick={() =>
                                window.open(
                                  "https://www.bls.gov/ooh/construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm"
                                )
                              }
                            >
                              <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                  <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                                    Industry growth
                                  </p>
                                </div>

                                <div className="mt-1 flex items-center gap-x-2">
                                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                    6%
                                  </h3>
                                </div>
                              </div>
                            </div>

                            <div
                              className="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
                              onClick={() =>
                                window.open(
                                  "https://www.indeed.com/jobs?q=plumber&l=Minneapolis&radius=35&vjk=ff9dc1d63ea6ffa5"
                                )
                              }
                            >
                              <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                  <p className="text-xs uppercase tracking-wide font-medium text-sky-400">
                                    Open Positions
                                  </p>
                                </div>

                                <div className="mt-1 flex items-center gap-x-2">
                                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800">
                                    50+
                                  </h3>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.25"
                                    stroke="currentColor"
                                    class="size-3 ml-1 hover:underline"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex"></div>
                      </div>

                      <div class="space-y-2 mt-6 mb-4 ">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-900 "
                        >
                          What you'll be doing
                        </label>
                        <div className="w-full prose prose-li  marker:text-black mb-4 ">
                          {drawerInfo.JobOverview}
                        </div>
                      </div>

                      <div class="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-800 "
                        >
                          Key Responsibilities
                        </label>

                        <div class="mb-4">
                          <ul className="list-disc px-3 ">
                            {drawerInfo.KeyResponsibilities?.map((x) => (
                              <li class="mt-1 text-gray-700">
                                <p className="">{x}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div class="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-800 "
                        >
                          Qualifications
                        </label>

                        <div class="mb-4">
                          <ul className="list-disc px-3 ">
                          {drawerInfo.Qualifications?.map((x) => (
                              <li class="mt-1 text-gray-700">
                                <p className="">{x}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div class="space-y-2 mt-6 mb-4">
                        <label
                          for="dactmi"
                          class="block mb-2 text-lg font-medium text-gray-800 "
                        >
                          Open Positions{" "}
                          <span
                            className="cursor-pointer hover:underline text-base text-gray-700 "
                            onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=HVAC&l=Minneapolis&from=searchOnDesktopSerp&cf-turnstile-response=0.WHO9ovb5eWqV7caFbf8UAcvFnO9ZAs50_sU8E1e39HRo7pwY5lBg-EXYJsvX3cxPe_3O0JyNx4I-zwmNrxqXuu1kZAbTGV75say_j6oAUR5d2-jVAyT-aedz7dGrj3Dr6yu-r5ha-xbMZgolvvh-DkL8WzEHM4ADBzR9q0069qK_pAyP0XXPmpVMkSS0-3wuHXjw8NM1bQ7dPovXpXkruwiwk04aD3uQ3maTXBDll9agtU220zThwhIkmAnfbNQ6TrZo1aZtrWSgs9aMceI9efvV6bym4ruOTlLcPIFc3Du0JRnELzGWto-iaSThCszZbhTEkjOlBPIZpi-Lm3KcKUwuzC8S-9bLT17z5AZLyBbfwNFSGESLiZBaCB3hX-deMKnMtDotvbclK2FM5Xbh7LebI_z_ZmNMYkMQ6Bjxzf3vdQR6EmPPE_z2T8Ma8b9MY2fuB62gUrg3hW0Rq2O5r4OvF6L82Kl_ilMk13q6398FTotwwCZnw6PIuSPNdOtFe_zvXjcT8DcI-kHtN2_y9Au142TIOYP9hrWvvo1GwxbqdKhKl8ZgHwaDejXPTjLPgC5lOdHVKLODvhaqu8_YoPPtTsxgJic7ENPw8-WSnkh44lU7I4s_XwcY5oWKzEM-CoGfqH8D3W3v-rYIuM7RB-lv8-36dopsFnx-rTI7n6Y-4oAcqFTTXEQ6I-Lm8qL9UycczSc7KTkVoSbImalR4hRjc24tuYEGWKpGA6pNCzO5l-Jd5WjTJsjeUv-DfpF6squ3tq3bBaNwQPb5qRsuUkj0NHpZG8kqF65p3Zl45vouwnC9TsdvEjLd_QXAUEmxP8v0nWDNCUoG7QQubhuDig.-PfwiIIk69nGYIdnLIBHYA.d09c29160fd89317ea68cfe4a3335b6aeeecff30ccb75ccebeaae3458972ea94&vjk=ec90ab1d9df762bf"
                              )
                            }
                          >
                            (See more)
                          </span>
                        </label>
                        <div class="mb-4">
                          <div class=" p-5 space-y-4 flex flex-col bg-white border border-gray-200 rounded-xl ">
                            <div class="flex justify-between">
                              <div class="flex flex-col justify-center items-center size-[38px] border border-gray-200 rounded-lg ">
                                <img
                                  src="/landingImages/streetplumbinglogo.jpg"
                                  alt=""
                                  class="shrink-0 size-6  "
                                  width="32"
                                  height="32"
                                />
                              </div>
                            </div>
                            <div>
                              <h3 class="font-medium text-gray-800">
                                Licenced Plumber
                              </h3>
                              <h3 class="font-medium text-gray-800">
                                Street Plumbing Inc.
                              </h3>
                              <h3 class="text-sm text-gray-500">
                                Burnsville, MN
                              </h3>

                              <p class="mt-3 text-gray-700 line-clamp-4">
                                Apply to open positions that provide on the job
                                training. Learn to install, repair, deal with
                                waste, vents, and water piping.
                              </p>
                            </div>
                            <div className="flex items-center justify-center mt-auto mb-1">
                              <button
                                type="button"
                                class="ml-1 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 "
                                onClick={() =>
                                  window.open(
                                    "https://www.streetplumbinginc.com/careers.html"
                                  )
                                }
                              >
                                Apply
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.25"
                                  stroke="currentColor"
                                  class="size-3 hover:underline"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div class="flex animate-pulse">
                  <div class="ms-4 mt-2 w-full">
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                    </ul>

                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                    </ul>
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full"></li>
                    </ul>
                    <ul class="mt-5 space-y-3">
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full "></li>
                      <li class="w-1/4 h-4 bg-gray-300 rounded-full mt-10"></li>
                      <li class="w-full h-4 bg-gray-300 rounded-full"></li>
                    </ul>
                  </div>
                </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MyDrawer;
