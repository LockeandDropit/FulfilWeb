import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const PaymentModal = ( {handleCloseOfferOpenPayment, handleCloseOffer} ) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen()
  }, [])



  return (
    <Modal isOpen={isOpen} onClose={() => handleCloseOffer()} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div class="bg-white ">
            <div class="container px-6 py-8 mx-auto">
              <div class="xl:items-center xl:-mx-8 xl:flex">
               

                <div class="flex-1 xl:mx-8">
                  <div class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                    <div class="max-w-sm mx-auto border rounded-lg md:mx-4 ">
                      <div class="p-6">
                        <h1 class="text-xl font-medium text-gray-600 capitalize lg:text-2xl ">
                          The other guys
                        </h1>

                        <p class="mt-4 text-gray-500 ">
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Nostrum quam voluptatibus
                        </p>

                        <h2 class="mt-4 text-xl font-medium text-gray-600 sm:text-xl ">
                          $20.00{" "}
                          <span class="text-lg font-medium">/Month</span>
                        </h2>

                       

                        {/* <button class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                          Start Now
                        </button> */}
                      </div>

                      <hr class="border-gray-200 " />

                      <div class="p-6">
                        <h1 class="text-lg font-medium text-gray-700 capitalize lg:text-xl ">
                          What’s included:
                        </h1>

                        <div class="mt-8 space-y-4">
                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              AI Resume Builder
                            </span>
                          </div>

                          <div class="flex items-center">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              Personalized Career Coach
                            </span>
                          </div>

                          <div class="flex items-center">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              Career Path Support
                            </span>
                          </div>

                          <div class="flex items-center">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              Tailored Job Search Support
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              Access to local resources
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                              Training/Educational Opportunity Search
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="max-w-sm mx-auto border rounded-lg md:mx-4 ">
                      <div class="p-6">
                        <h1 class="text-xl font-semibold text-sky-500 capitalize lg:text-3xl ">
                          Fulfil
                        </h1>

                        <p class="mt-4 text-gray-500">
                          Lorem ipsum dolor sit amet consectetur, adipisicing
                          elit. Nostrum quam voluptatibus
                        </p>

                        <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl ">
                          $14.00{" "}
                          <span class="text-base font-medium">/Month</span>
                        </h2>

                       

                        {/* <button class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                          Start Now
                        </button> */}
                      </div>

                      <hr class="border-gray-200 " />

                      <div class="p-6">
                        <h1 class="text-lg font-medium text-gray-700 capitalize lg:text-xl ">
                          What’s included:
                        </h1>

                        <div class="mt-8 space-y-4">
                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            AI Resume Builder
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            Personalized Career Coach
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            Career Path Support
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            Tailored Job Search Support
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            Access to local resources
                            </span>
                          </div>

                          <div class="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-5 h-5 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span class="mx-4 text-gray-700 ">
                            Training/Educational Opportunity Search
                            </span>
                          </div>
                          <button class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80" onClick={() => handleCloseOfferOpenPayment()}>
                          14-Day Free Trial   
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
