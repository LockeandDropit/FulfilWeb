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

const PlumberApprenticeDrawer = ({toggle, open}) => {


  const handleClose = () => {
    toggle();
  }
    



  return (
    <div>
      {" "}
      <Drawer onClose={() => handleClose()} isOpen={open} size={"lg"}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <div class="">
              <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                  <div class="p-4">
                    <div class=" cursor-default">
                      <div className="flex">
                        <label
                          for="hs-pro-dactmt"
                          class="block mb-2 text-2xl font-medium text-gray-900"
                        >
                       Plumber Apprentice
                        </label>
                      </div>

                      <div class="space-y-2 ">
                        <div class="flex align-items-center">
                          <p className="text-md font-medium ">
                            Average Salary:
                          </p>
                          <p className="ml-1 text-md font-medium ">
                          $30,000 - $40,000
                          </p>
                       
                        </div>
                      </div>
                      <div class="space-y-2 ">
                        <div class="flex align-center items-center hover:underline cursor-pointer" onClick={() => window.open("https://www.bls.gov/ooh/construction-and-extraction/plumbers-pipefitters-and-steamfitters.htm")}>
                          <p className="text-md font-medium ">
                            Industry Growth:
                          </p>
                          <p className="ml-1 text-md font-medium text-green-600">
                            6%
                          </p>
                          <svg
                            class="shrink-0 size-5 ml-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#48bb78"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                          </svg>
                        </div>
                      </div>
                      <div class="space-y-2 ">
                        <div class="flex align-center items-center cursor-pointer hover:underline"  onClick={() =>
                              window.open(
                                "https://www.indeed.com/jobs?q=HVAC&l=Minneapolis&from=searchOnDesktopSerp&cf-turnstile-response=0.WHO9ovb5eWqV7caFbf8UAcvFnO9ZAs50_sU8E1e39HRo7pwY5lBg-EXYJsvX3cxPe_3O0JyNx4I-zwmNrxqXuu1kZAbTGV75say_j6oAUR5d2-jVAyT-aedz7dGrj3Dr6yu-r5ha-xbMZgolvvh-DkL8WzEHM4ADBzR9q0069qK_pAyP0XXPmpVMkSS0-3wuHXjw8NM1bQ7dPovXpXkruwiwk04aD3uQ3maTXBDll9agtU220zThwhIkmAnfbNQ6TrZo1aZtrWSgs9aMceI9efvV6bym4ruOTlLcPIFc3Du0JRnELzGWto-iaSThCszZbhTEkjOlBPIZpi-Lm3KcKUwuzC8S-9bLT17z5AZLyBbfwNFSGESLiZBaCB3hX-deMKnMtDotvbclK2FM5Xbh7LebI_z_ZmNMYkMQ6Bjxzf3vdQR6EmPPE_z2T8Ma8b9MY2fuB62gUrg3hW0Rq2O5r4OvF6L82Kl_ilMk13q6398FTotwwCZnw6PIuSPNdOtFe_zvXjcT8DcI-kHtN2_y9Au142TIOYP9hrWvvo1GwxbqdKhKl8ZgHwaDejXPTjLPgC5lOdHVKLODvhaqu8_YoPPtTsxgJic7ENPw8-WSnkh44lU7I4s_XwcY5oWKzEM-CoGfqH8D3W3v-rYIuM7RB-lv8-36dopsFnx-rTI7n6Y-4oAcqFTTXEQ6I-Lm8qL9UycczSc7KTkVoSbImalR4hRjc24tuYEGWKpGA6pNCzO5l-Jd5WjTJsjeUv-DfpF6squ3tq3bBaNwQPb5qRsuUkj0NHpZG8kqF65p3Zl45vouwnC9TsdvEjLd_QXAUEmxP8v0nWDNCUoG7QQubhuDig.-PfwiIIk69nGYIdnLIBHYA.d09c29160fd89317ea68cfe4a3335b6aeeecff30ccb75ccebeaae3458972ea94&vjk=ec90ab1d9df762bf"
                              )
                            }>
                          <p className="text-md font-medium ">
                            Openings Near You:
                          </p>
                          <p
                            className="ml-1 text-md text-gray-800 hover:text-gray-900 font-medium cursor-pointer hover:underline"
                           
                          >
                            300+
                          </p>
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
                      Learn the trade under the supervision of licensed plumbers. Gain hands-on experience with basic plumbing tasks and safety practices.
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
                          <li class="mt-1 text-gray-700">
                            <p className="">
                             
                            Assist with pipe installation, repairs, and maintenance.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                           
                            Learn to read blueprints and understand plumbing systems.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Handle simple tasks such as unclogging drains and replacing fixtures.
                            </p>
                          </li>
                         
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
                          <li class="mt-1 text-gray-700">
                            <p className="">
                            High school diploma or GED.
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Enrollment in an apprenticeship program (typically 4-5 years).
                            </p>
                          </li>
                          <li class=" text-gray-700">
                            <p className="">
                            Basic mechanical aptitude and problem-solving skills.
                            </p>
                          </li>
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
                              "https://www.indeed.com/jobs?q=plumbing+apprentice&l=Minneapolis&from=searchOnDesktopSerp%2Cwhatautocomplete&cf-turnstile-response=0.OHdoO8CxM-l0xV3ZfMK20ccqd7KmnXZlZ9Uo-s1Ls6ripNTpzBEExiqW6sdN5u6aLzRMnYiRKnZ_jqFegyL_LRiAPhS6x1QQjthZP8ofqipLwiEeZWq-O3jZKo-xv8swRiB1FsK7HtVd01Ahe0x-nJVzBy4RzupeDiiC2Olqr4lxup-Fyz2gH8ZsAh1gsmciQu2YEYa3VUhVlctLI4_Xiye9U-bHkeSnl1DAgC119GgqeOM6i2G2lCe7uLSH1I1R7-1lG5tFJ8Z0lDNpH_7oBgcwngGa59HWG-mHlEsFLjamOKzMK7CYS0hl-wNoEjNWJg_t-t4AmMANIjk3GLt0NoKyW9Nxh9doyAslGnzewNIHXhkxMcrvhgIDBNunLvpZuQMUghWq9hdBcWHvYxCJfo3JwmDJYRYG_WC2tdX8xA-IZeR6XEG35Jq94RfbNLxWhws4g-av5FhUq6bIW88s7jh0TUrKhUWkjny2OQylZWGnWYi388VsbWqVAP6bF_0wtjsh3uphnxrvnr73i-uhtdFzj8JAZ-1gnkTgwQ9ne3xaCvsixBLQu8KZv8-cPVn2EjrxaKgv-TJ3HQEQ_skbPSbC1ynKTaTa8ErY_uFUEpUoJRoCZdMJbToj4sE2I_p1MbzKhYOXuz00JQICwVaaPExx9r1DWdVKi6jcrBQ9I1nTKWZNoNppO3ac3iwYyzL8-A4xP4vf1g56D8Rv9Dro1znTuGOgRGghCGIfOvYCAwxhjlfOfkxtDv3xpnN8QSVXU_qM4R3ORVPMFOgYSIsVV8-RTCEf7iRUTeEvzmhhmNTVodIHmm9-KU5hxiIKpVmORVXBMG1tnE_MFVTsDGlDlw.E1E0sBlVaJ1F8UCXzumtag.dc89caeabbac1274618a27261524a9b61e371187649bae178ec96f20891466b3&vjk=ec90ab1d9df762bf"
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
                              Plumbing Apprentice
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
          </DrawerBody>
  
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PlumberApprenticeDrawer;
