import React, { useEffect, useRef, useState } from "react";

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useChatStore } from "./lib/chatStore";
import { useUserStore } from "./lib/userStore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Text, Box, Flex, Image } from "@chakra-ui/react";
import star_corner from "../../../images/star_corner.png";
import star_filled from "../../../images/star_filled.png";
import { format } from "timeago.js";
import CreateOfferModal from "../NeederComponents/CreateOfferModal";
import { useMediaQuery } from "@chakra-ui/react";
import Detail from "./Detail";
import DoerProfileModal from "../Components/DoerProfileModal";
import { useJobStore } from "./lib/jobsStore";
import OfferPostedJobModal from "../Components/OfferPostedJobModal";
import EmbeddedPaymentsMessaging from "../Components/EmbeddedPaymentsMessaging";
import Header from "../Components/Header";
import Dashboard from "../Components/Dashboard";

const ChatPlaceholder = () => {
  return (
    <>
    <Header />
    <Dashboard />
    <body class="hs-overlay-body-open bg-gray-100">
  
    <aside class="relative">
      <div id="hs-pro-sidebar" class="hs-overlay [--auto-close:xl]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        sm:w-72 size-full
        hidden
        fixed inset-y-0 start-0 xl:start-64 z-[60]
        bg-gray-100
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0]xl:block xl:translate-x-0 xl:end-auto xl:bottom-0
       ">
        <div class="h-full flex">
    
        
          <div class="sm:w-72 size-full truncate bg-white border-x border-gray-200">
            <div class="h-full flex flex-col">
            
              <div class="ps-4 pe-3 py-2 flex justify-between items-center gap-x-2 border-b border-gray-200">
                <h1 class="truncate font-semibold text-gray-800">
                  Inbox
                </h1>
    
                <div class="flex items-center">
             
                  <div class="relative inline-block">
                    <select id="hs-pro-select-revenue" data-hs-select='{
                        "placeholder": "Select option...",
                        "toggleTag": "<button type=\"button\"></button>",
                        "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-2 ps-2.5 pe-6 inline-flex flex-shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 before:absolute before:inset-0 before:z-[1]",
                        "dropdownClasses": "mt-2 z-50 w-32 p-1 space-y-0.5 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)]",
                        "optionClasses": "hs-selected:bg-gray-100 py-1.5 px-2 w-full text-[13px] text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                        "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                      }' class="hidden">
                      <option value="">Choose</option>
                      <option selected>Newest</option>
                      <option>Oldest</option>
                    </select>
    
                    <div class="absolute top-1/2 end-2 -translate-y-1/2">
                      <svg class="flex-shrink-0 size-3.5 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
           
    
                  <div class="relative flex items-center gap-x-1 ps-2 ms-2 before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
        
                    <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhcp">
                      <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                      <span class="sr-only">Compose</span>
                    </button>
                  
                  </div>
                </div>
              </div>
        
              <div class="border-b border-gray-200">
             
                <div class="relative" data-hs-combo-box='{
                    "groupingType": "default",
                    "preventSelection": true,
                    "isOpenOnFocus": true,
                    "outputEmptyTemplate": "<div class=\"p-5 h-[calc(100dvh-85px)] flex flex-col justify-center items-center text-center\"><svg class=\"w-48 mx-auto mb-4\" width=\"178\" height=\"90\" viewBox=\"0 0 178 90\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"27\" y=\"50.5\" width=\"124\" height=\"39\" rx=\"7.5\" fill=\"white\"/><rect x=\"27\" y=\"50.5\" width=\"124\" height=\"39\" rx=\"7.5\" stroke=\"#F9FAFB\"/><rect x=\"34.5\" y=\"58\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F9FAFB\"/><rect x=\"66.5\" y=\"61\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#F9FAFB\"/><rect x=\"66.5\" y=\"73\" width=\"77\" height=\"6\" rx=\"3\" fill=\"#F9FAFB\"/><rect x=\"19.5\" y=\"28.5\" width=\"139\" height=\"39\" rx=\"7.5\" fill=\"white\"/><rect x=\"19.5\" y=\"28.5\" width=\"139\" height=\"39\" rx=\"7.5\" stroke=\"#F3F4F6\"/><rect x=\"27\" y=\"36\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F3F4F6\"/><rect x=\"59\" y=\"39\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#F3F4F6\"/><rect x=\"59\" y=\"51\" width=\"92\" height=\"6\" rx=\"3\" fill=\"#F3F4F6\"/><g filter=\"url(#@@id)\"><rect x=\"12\" y=\"6\" width=\"154\" height=\"40\" rx=\"8\" fill=\"white\" shape-rendering=\"crispEdges\"/><rect x=\"12.5\" y=\"6.5\" width=\"153\" height=\"39\" rx=\"7.5\" stroke=\"#F3F4F6\" shape-rendering=\"crispEdges\"/><rect x=\"20\" y=\"14\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#E5E7EB\"/><rect x=\"52\" y=\"17\" width=\"60\" height=\"6\" rx=\"3\" fill=\"#E5E7EB\"/><rect x=\"52\" y=\"29\" width=\"106\" height=\"6\" rx=\"3\" fill=\"#E5E7EB\"/></g><defs><filter id=\"@@id\" x=\"0\" y=\"0\" width=\"178\" height=\"64\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\" result=\"hardAlpha\"/><feOffset dy=\"6\"/><feGaussianBlur stdDeviation=\"6\"/><feComposite in2=\"hardAlpha\" operator=\"out\"/><feColorMatrix type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0\"/><feBlend mode=\"normal\" in2=\"BackgroundImageFix\" result=\"effect1_dropShadow_1187_14810\"/><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"effect1_dropShadow_1187_14810\" result=\"shape\"/></filter></defs></svg><div class=\"max-w-sm mx-auto\"><p class=\"mt-2 text-sm text-gray-600">No search results</p></div></div>",
                    "preventAutoPosition": true,
                    "groupingTitleTemplate": "<div class=\"block text-xs text-gray-500 m-3 mb-1"></div>"
                  }'>
                  <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <svg class="flex-shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <input type="text" class="py-1.5 pe-12 ps-10 block w-full bg-white border-0 rounded-0 md:text-[13px] placeholder:text-gray-500 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:pointer-events-none" placeholder="Search" data-hs-combo-box-input />
                    <div class="hidden hs-combo-box-active:flex absolute inset-y-0 end-0 items-center z-20 pe-4" data-hs-combo-box-input>
                      <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600" data-hs-combo-box-close>
                        <span class="sr-only">Close</span>
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                      </button>
                    </div>
                  </div>
    
                 
                  <div class="absolute top-full z-50 w-full bg-white border-t border-gray-200 hidden" data-hs-combo-box-output>
                    <div class="h-[calc(100dvh-85px)] overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                  
                      <div data-hs-combo-box-output-items-wrapper>
                        <div class="pt-1.5 pb-4">
                          <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="0">
                          
                            <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                              <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                              <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Photos" data-hs-combo-box-value>
                                Photos
                              </span>
                              <div class="ms-auto">
                                <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </div>
                            </a>
                            
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="1">
                       
                            <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                              <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                              <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Links" data-hs-combo-box-value>
                                Links
                              </span>
                              <div class="ms-auto">
                                <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </div>
                            </a>
                        
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "quick-action", "title": "Quick Action"}}' tabindex="2">
                       
                            <a class="py-2 px-4 group flex items-center gap-x-2 focus:outline-none" href="#">
                              <svg class="flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                              <span class="font-medium text-[13px] text-gray-800 group-hover:text-blue-600" data-hs-combo-box-search-text="Documents" data-hs-combo-box-value>
                                Documents
                              </span>
                              <div class="ms-auto">
                                <svg class="flex-shrink-0 size-3.5 text-gray-500 group-hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </div>
                            </a>
                          
                          </div>
    
                          <div class="-mt-px py-1 px-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs text-gray-500">Recent</h4>
                          </div>
    
                          <div class="py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">A</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="8">
                          
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Amanda Harvey" data-hs-combo-box-value>
                                  Amanda Harvey
                                </p>
                              </div>
                            </a>
                           
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="9">
                         
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Anna Richard" data-hs-combo-box-value>
                                  Anna Richard
                                </p>
                              </div>
                            </a>
                            
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="10">
                            
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                  A
                                </span>
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Alex Brown" data-hs-combo-box-value>
                                  Alex Brown
                                </p>
                              </div>
                            </a>
                            
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">B</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="11">
                     
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                  B
                                </span>
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Bob Dean" data-hs-combo-box-value>
                                  Bob Dean
                                </p>
                              </div>
                            </a>
                            
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">C</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="12">
                            
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Chun Wa" data-hs-combo-box-value>
                                  Chun Wa
                                </p>
                              </div>
                            </a>
                      
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="13">
                           
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Costa Quinn" data-hs-combo-box-value>
                                  Costa Quinn
                                </p>
                              </div>
                            </a>
                           
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">D</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="14">
                          
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="David Harrison" data-hs-combo-box-value>
                                  David Harrison
                                </p>
                              </div>
                            </a>
                        
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">E</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="15">
                            
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Ella Lauda" data-hs-combo-box-value>
                                  Ella Lauda
                                </p>
                              </div>
                            </a>
                          
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="16">
                         
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1568048689711-5e0325cea8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Elizabeth Cru" data-hs-combo-box-value>
                                  Elizabeth Cru
                                </p>
                              </div>
                            </a>
                           
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">L</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="17">
                           
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Lewis Clarke" data-hs-combo-box-value>
                                  Lewis Clarke
                                </p>
                              </div>
                            </a>
                            
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">M</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="18">
                          
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                  M
                                </span>
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Mark Colbert" data-hs-combo-box-value>
                                  Mark Colbert
                                </p>
                              </div>
                            </a>
                          
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">O</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="19">
                          
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                  O
                                </span>
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Ols Schols" data-hs-combo-box-value>
                                  Ols Schols
                                </p>
                              </div>
                            </a>
                       
                          </div>
    
                          <div class="-mt-px py-1 ps-6 pe-4 flex justify-between items-center gap-x-2 bg-gray-100">
                            <h4 class="text-xs uppercase text-gray-500">R</h4>
                          </div>
    
                          <div data-hs-combo-box-output-item='{"group": {"name": "contacts", "title": "Contacts"}}' tabindex="20">
                          
                            <a class="group py-2 px-3 flex items-center gap-x-2 focus:outline-none" href="#">
                              <div class="flex-shrink-0">
                                <span class="flex flex-shrink-0 justify-center items-center size-8 bg-white border border-gray-200 text-gray-700 text-xs font-medium uppercase rounded-full">
                                  R
                                </span>
                              </div>
                              <div class="grow truncate">
                                <p class="font-medium text-sm leading-4 text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600" data-hs-combo-box-search-text="Rachel Doe" data-hs-combo-box-value>
                                  Rachel Doe
                                </p>
                              </div>
                            </a>
                     
                          </div>
                        </div>
                      </div>
                    </div>
             
                  </div>
               
                </div>
        
              </div>
         
    
          
              <div class="py-1.5 border-b border-gray-200">
                <div class="-mb-2.5 px-1.5 overflow-x-auto">
                  <div class="overflow-x-auto [&::-webkit-scrollbar]:h-0">
                    
                    <nav class="flex gap-x-1" aria-label="Tabs" role="tablist">
                      <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 font-medium text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none active " id="hs-pro-tabs-chsn-item-all" data-hs-tab="#hs-pro-tabs-chsn-all" aria-controls="hs-pro-tabs-chsn-all" role="tab" >
                        All
                      </button>
                      <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-mentions" data-hs-tab="#hs-pro-tabs-chsn-mentions" aria-controls="hs-pro-tabs-chsn-mentions" role="tab" >
                        Mentions
                      </button>
                      <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-spammed" data-hs-tab="#hs-pro-tabs-chsn-spammed" aria-controls="hs-pro-tabs-chsn-spammed" role="tab" >
                        Spammed
                      </button>
                      <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2.5 py-2 mb-3 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xs rounded-md disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2.5 after:z-10 after:h-0.5 after:pointer-events-none  " id="hs-pro-tabs-chsn-item-blocked" data-hs-tab="#hs-pro-tabs-chsn-blocked" aria-controls="hs-pro-tabs-chsn-blocked" role="tab" >
                        Blocked
                      </button>
                    </nav>
                 
                  </div>
                </div>
              </div>
            
    
              <div class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            
                <div id="hs-pro-tabs-chsn-all" class="h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-all">
                  <div aria-label="Tabs" role="tablist">
                    <div class="hs-tab-active:bg-gray-200 relative cursor-pointer bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100 active " id="hs-pro-tabs-chct-item-1" data-hs-tab="#hs-pro-tabs-chct-1" aria-controls="hs-pro-tabs-chct-1" role="tab" >
                      <div class="py-4 px-3 flex items-center gap-x-3 border-b border-b-gray-100">
                        <div class="flex-shrink-0">
                          <div class="relative size-8">
                            <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                            <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-green-500"></span>
                          </div>
                        </div>
                        <div class="grow truncate">
                          <div class="flex justify-between items-center gap-x-1">
                            <p class="truncate font-semibold text-[13px] text-gray-800">Costa Quinn</p>
                            <div>
                              <svg class="inline-block flex-shrink-0 size-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              <span class="text-[10px] text-gray-400 uppercase">1m</span>
                            </div>
                          </div>
                          <div class="truncate me-5">
                                <p class="truncate text-gray-500 text-xs">Yes, you can!</p>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    <div class="hs-tab-active:bg-gray-200 relative cursor-pointer bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100  " id="hs-pro-tabs-chct-item-2" data-hs-tab="#hs-pro-tabs-chct-2" aria-controls="hs-pro-tabs-chct-2" role="tab" >
                      <div class="py-4 px-3 flex items-center gap-x-3 border-b border-b-gray-100">
                        <div class="flex-shrink-0">
                          <div class="relative size-8">
                            <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-indigo-500 text-white rounded-full">
                              R
                            </span>
                          </div>
                        </div>
                        <div class="grow truncate">
                          <div class="flex justify-between items-center gap-x-1">
                            <p class="truncate font-semibold text-[13px] text-gray-800">Rachel Doe</p>
                            <div>
                              <span class="text-[10px] text-gray-400 uppercase">14m</span>
                            </div>
                          </div>
                          <div class="truncate me-5">
                            <div class="flex items-center gap-x-1.5">
                              <img class="flex-shrink-0 size-5 rounded object-cover" src="../../assets/img/mockups/img10.jpg" alt="Image Description" />
                              <div class="grow truncate">
                                <p class="truncate font-medium text-gray-800 text-xs">When using open method, const select = new HSSelect(document.querySelector('#select'));</p>
                              </div>
                            </div>
                          </div>
                          <div class="hs-tab-active:hidden absolute bottom-3.5 end-2.5">
                            <span class="relative min-w-[18px] min-h-[18px] inline-flex justify-center items-center text-[10px] bg-blue-500 text-white rounded-full px-1">
                              3
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    <div class="hs-tab-active:bg-gray-200 relative cursor-pointer bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100  " id="hs-pro-tabs-chct-item-3" data-hs-tab="#hs-pro-tabs-chct-3" aria-controls="hs-pro-tabs-chct-3" role="tab" >
                      <div class="py-4 px-3 flex items-center gap-x-3 border-b border-b-gray-100">
                        <div class="flex-shrink-0">
                          <div class="relative size-8">
                            <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                          </div>
                        </div>
                        <div class="grow truncate">
                          <div class="flex justify-between items-center gap-x-1">
                            <p class="truncate font-semibold text-[13px] text-gray-800">Lewis Clarke</p>
                            <div>
                              <span class="text-[10px] text-gray-400 uppercase">15m</span>
                            </div>
                          </div>
                          <div class="truncate me-5">
                                <p class="truncate text-gray-500 text-xs">How's these all free? 🤯</p>
                          </div>
                        </div>
                      </div>
                    </div>
    
                  <div class="hs-tab-active:bg-gray-200 relative cursor-pointer bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100  " id="hs-pro-tabs-chct-item-4" data-hs-tab="#hs-pro-tabs-chct-4" aria-controls="hs-pro-tabs-chct-4" role="tab" >
                      <div class="py-4 px-3 flex items-center gap-x-3 border-b border-b-gray-100">
                        <div class="flex-shrink-0">
                          <div class="relative size-8">
                            <span class="flex flex-shrink-0 justify-center items-center size-6 text-white text-xs font-medium uppercase bg-orange-500 rounded-full">
                              T
                            </span><img class="absolute top-3 start-3 flex-shrink-0 size-5 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
                          </div>
                        </div>
                        <div class="grow truncate">
                          <div class="flex justify-between items-center gap-x-1">
                            <p class="truncate font-semibold text-[13px] text-gray-800">Technical issues</p>
                            <div>
                              <svg class="inline-block flex-shrink-0 size-3.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              <span class="text-[10px] text-gray-400 uppercase">55m</span>
                            </div>
                          </div>
                          <div class="truncate me-5">
                                <p class="truncate text-gray-500 text-xs">Great! 👍️</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
    
          
                <div id="hs-pro-tabs-chsn-mentions" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-mentions">
                  
                  <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                    <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                      <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                      <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <g filter="url(#filter2)">
                      <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                      <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                      <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      </g>
                      <defs>
                      <filter id="filter2" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="6"/>
                      <feGaussianBlur stdDeviation="6"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1187_14810"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1187_14810" result="shape"/>
                      </filter>
                      </defs>
                    </svg>
    
                    <div class="max-w-sm mx-auto">
                      <p class="mt-2 font-medium text-gray-800">
                        No mentions message
                      </p>
                      <p class="mb-5 text-sm text-gray-500">
                        Only mentions messages appear here
                      </p>
                    </div>
                  </div>
               
                </div>
            
    
              
                <div id="hs-pro-tabs-chsn-spammed" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-spammed">
                 
                  <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                    <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                      <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                      <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <g filter="url(#filter3)">
                      <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                      <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                      <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      </g>
                      <defs>
                      <filter id="filter3" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="6"/>
                      <feGaussianBlur stdDeviation="6"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1187_14810"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1187_14810" result="shape"/>
                      </filter>
                      </defs>
                    </svg>
    
                    <div class="max-w-sm mx-auto">
                      <p class="mt-2 font-medium text-gray-800">
                        No spammed message
                      </p>
                      <p class="mb-5 text-sm text-gray-500">
                        Only spammed messages appear here
                      </p>
                    </div>
                  </div>
                 
                </div>
     
    
               
                <div id="hs-pro-tabs-chsn-blocked" class="hidden h-full" role="tabpanel" aria-labelledby="hs-pro-tabs-chsn-item-blocked">
                
                  <div class="p-5 h-full flex flex-col justify-center items-center text-center">
                    <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50"/>
                      <rect x="34.5" y="58" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white"/>
                      <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100"/>
                      <rect x="27" y="36" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100"/>
                      <g filter="url(#filter4)">
                      <rect x="12" y="6" width="154" height="40" rx="8" class="fill-white" shape-rendering="crispEdges"/>
                      <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100" shape-rendering="crispEdges"/>
                      <rect x="20" y="14" width="24" height="24" rx="12" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200"/>
                      </g>
                      <defs>
                      <filter id="filter4" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="6"/>
                      <feGaussianBlur stdDeviation="6"/>
                      <feComposite in2="hardAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1187_14810"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1187_14810" result="shape"/>
                      </filter>
                      </defs>
                    </svg>
    
                    <div class="max-w-sm mx-auto">
                      <p class="mt-2 font-medium text-gray-800">
                        No mentioned message
                      </p>
                      <p class="mb-5 text-sm text-gray-500">
                        Only mentioned messages appear here
                      </p>
                    </div>
                  </div>
           
                </div>
                
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </aside>
   
    
    
    <main id="content" class="2xl:hs-overlay-layout-open:pe-96 lg:ps-72 transition-all duration-300">

      <div id="hs-pro-tabs-chct-1" role="tabpanel" aria-labelledby="hs-pro-tabs-chct-item-1">
        <div class="relative h-dvh flex flex-col justify-end">
 
          <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
            <div class="lg:hidden w-20 sm:w-auto flex items-center">
     
              <div class="-ms-3">
                <button type="button" class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
                  <svg class="flex-shrink-0 size-4 -ms-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Chat
                </button>
              </div>
      
            </div>
    
    
            <div>
              <button type="button" class="truncate flex items-center gap-x-3.5 focus:outline-none" data-hs-overlay="#hs-pro-chhds1" aria-controls="hs-pro-chhds1" aria-label="Toggle navigation">
                <span class="lg:block hidden relative flex-shrink-0">
                  <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-green-500"></span>
                </span>
                <span class="grow text-center lg:text-start truncate">
                  <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                    Costa Quinn
                  </span>
                  <span class="truncate block text-xs text-blue-600 leading-4">
                    Online
                  </span>
                </span>
              </button>
            </div>
        
    
            <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
           
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                  <span class="sr-only">Snooze</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Snooze
                </span>
              </div>
            
    
          
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  <span class="sr-only">Tags</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Tags
                </span>
              </div>
       
              <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                <button id="hs-pro-cht1hmd" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
    
            
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg" aria-labelledby="hs-pro-cht1hmd">
                  <div class="p-1 space-y-1">
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Mark as unread
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                      Mark as read
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                      Snooze
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                      Tags
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsh">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                      Share
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsp">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      Spam
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhbu">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      Block user
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhdl">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
             
              </div>
            
    
              <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
            
                <button type="button" class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds1" aria-controls="hs-pro-chhds1" aria-label="Toggle navigation">
                  <svg class="xl:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
                  <svg class="hidden xl:block flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
                </button>
    
                <button type="button" class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds1" aria-controls="hs-pro-chhds1" aria-label="Toggle navigation">
                  <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-green-500"></span>
                </button>
              
              </div>
            </div>
          </header>
     
          <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div class="p-4 space-y-5">
    
              <div class="relative">
               
                <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                  <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">Today</span>
                </div>
            
    
           
                <div class="w-full space-y-5">
                 
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                    </div>
    
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Costa</p>
    
                      <div class="space-y-1">
                   
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hi, I'd like to ask some questions. Can I use Preline UI on a client project?
                              <a class="group block mt-3 mb-1 focus:outline-none" href="https://preline.co/" target="_blank">
                                <span class="text-blue-600 underline">
                                  https://preline.co/
                                </span>
    
                                <div class="p-2 ps-2.5 mt-2 relative cursor-default bg-blue-50 rounded-lg overflow-hidden group-focus:scale-[.98] transition before:absolute before:inset-y-0 before:start-0 before:w-[3px] before:h-full before:bg-blue-600">
                                  <p class="font-medium text-xs text-blue-600">Preline</p>
                                  <p class="font-semibold text-xs text-gray-800">Preline UI, crafted with Tailwind CSS</p>
                                  <p class="text-xs text-gray-800">Preline UI is an open-source set of prebuilt UI components based on the utility-first Tailwind CSS framework.</p>
                                  <img class="mt-1 rounded-md" src="https://preline.co/hero-image-2.jpg" alt="Website Preview Image" />
                                </div>
                              </a>
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">11:27</span>
                              </span>
                            </div>
                          </div>
    
                        
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht1cmd_1" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht1cmd_1">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                   
                            </div>
                          </div>
                      
                        </div>
                      </div>
                    </div>
                
                  </div>
               
    
                
                  <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                 
                    <div>
                      <p class="mb-1.5 pe-2.5 text-xs text-gray-400">James</p>
    
                      <div class="space-y-1">
                   
                        <div class="group flex justify-end gap-x-2 word-break: break-word" >
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hi Costa,
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">12:44</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                          
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht1cmd_2" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                            
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht1cmd_2">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            
                            </div>
                          </div>
                       
                        </div>
    
               
                        <div class="group flex justify-end gap-x-2 word-break: break-word" >
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
    
                              <div class="mb-2 py-1 ps-2.5 pe-1.5 relative cursor-default bg-blue-50 before:bg-blue-600 rounded-lg overflow-hidden group-focus:scale-[.98] transition before:absolute before:inset-y-0 before:start-0 before:w-[3px] before:h-full">
                                <blockquote>
                                  <p class="font-medium text-[13px] text-blue-600">Costa Quinn</p>
                                  <p class="text-[13px] text-gray-800">Hi, I'd like to ask some questions. Can I use Preline UI on a client project?</p>
                                </blockquote>
                              </div>
                              Yes, you can!
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">12:44</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                          
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht1cmd_3" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                           
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht1cmd_3">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  
    
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
                    </div>
                  </div>
               
                </div>
            
              </div>
            </div>
          </div>
     
     
          <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
            <label for="hs-chat-autoheight-textarea-1" class="sr-only">Message</label>
    
            <div class="pb-2 ps-2">
              <textarea id="hs-chat-autoheight-textarea-1" class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300" placeholder="Message Costa" ></textarea>
    
              <div class="pe-4 flex justify-between items-center gap-x-1">
             
                <div class="flex items-center gap-x-1">
                 
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span class="sr-only">Attach file</span>
                  </button>
               
    
               
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                    <span class="sr-only">Add emoji</span>
                  </button>
              
                </div>
             
    
          
                <div class="flex items-center gap-x-1">
               
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    <span class="sr-only">Send voice message</span>
                  </button>
             
    
                  <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="sr-only">Send</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </button>
               
                </div>
              
              </div>
            </div>
          </footer>
      
        </div>
    
      
        <aside id="hs-pro-chhds1" class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         ">
          <div class="h-full flex flex-col">
     
            <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
              <h3 class="font-semibold text-gray-800">
                Details
              </h3>
    
         
              <div class="absolute top-2 end-4 z-10">
                <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-pro-chhds1">
                  <span class="sr-only">Close</span>
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
         
            </div>
       
    
         
            <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
              <img class="flex-shrink-0 size-16 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
              <div class="mt-2 w-full">
                <h2 class="text-lg font-semibold text-gray-800">
                  Costa Quinn
                </h2>
                <p class="mb-2 text-[13px] text-gray-500">
                  Online
                </p>
    
                
                <div class="mt-4 flex justify-center items-center gap-x-3">
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                    View profile
                  </button>
    
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Send email
                  </button>
                </div>
              
              </div>
            </div>
       
            <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div class="hs-accordion-group" data-hs-accordion-always-open>
    
              
                <div class="hs-accordion border-b border-gray-100 active" id="hs-pro-chdsudc1">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdsudc1-collapse">
                    <span class="text-sm font-medium">User details</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdsudc1-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdsudc1">
                    <div class="px-5 pb-5">
           
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                            Company:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            Fortex
                          </p>
                        </dd>
                      </dl>
                   
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            Country:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            United States
                          </p>
                        </dd>
                      </dl>
                     
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            costa.notion@gmail.com
                          </p>
                        </dd>
                      </dl>
                  
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            Phone:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            +1 000-00-00
                          </p>
                        </dd>
                      </dl>
                    
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            Site:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <a class="align-top text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-none focus:underline" href="#">
                            fortex.com
                          </a>
                        </dd>
                      </dl>
                 
                    </div>
                  </div>
                </div>
              
                <div class="hs-accordion active" id="hs-pro-chdssmc1">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdssmc1-collapse">
                    <span class="text-sm font-medium">Shared media</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdssmc1-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdssmc1">
                    <div class="pb-5 px-5">
                      <p class="text-sm text-gray-500">
                        Only shared images appear here
                      </p>
                    </div>
                  </div>
                </div>
             
              </div>
            </div>
     
          </div>
        </aside>
        
      </div>
    
      <div id="hs-pro-tabs-chct-2" class="hidden" role="tabpanel" aria-labelledby="hs-pro-tabs-chct-item-2">
        <div class="relative h-dvh flex flex-col justify-end">
          
          <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
            <div class="lg:hidden w-20 sm:w-auto flex items-center">
           
              <div class="-ms-3">
                <button type="button" class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
                  <svg class="flex-shrink-0 size-4 -ms-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Chat
                </button>
              </div>
         
            </div>
    
          
            <div>
              <button type="button" class="truncate flex items-center gap-x-3.5 focus:outline-none" data-hs-overlay="#hs-pro-chhds2" aria-controls="hs-pro-chhds2" aria-label="Toggle navigation">
                <span class="lg:block hidden relative flex-shrink-0"><span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-indigo-500 text-white rounded-full">
                    R
                  </span>
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                </span>
                <span class="grow text-center lg:text-start truncate">
                  <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                    Rachel Doe
                  </span>
                  <span class="truncate block text-xs text-gray-500 leading-4">
                    Last seen 5 mins ago
                  </span>
                </span>
              </button>
            </div>
       
    
            <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
          
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                  <span class="sr-only">Snooze</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Snooze
                </span>
              </div>
            
            
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  <span class="sr-only">Tags</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Tags
                </span>
              </div>
            
              <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                <button id="hs-pro-cht2hmd" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
    
              
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg" aria-labelledby="hs-pro-cht2hmd">
                  <div class="p-1 space-y-1">
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Mark as unread
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                      Mark as read
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                      Snooze
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                      Tags
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsh">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                      Share
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsp">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      Spam
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhbu">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      Block user
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhdl">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
               
              </div>
            
    
              <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
              
                <button type="button" class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds2" aria-controls="hs-pro-chhds2" aria-label="Toggle navigation">
                  <svg class="xl:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
                  <svg class="hidden xl:block flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
                </button>
    
                <button type="button" class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds2" aria-controls="hs-pro-chhds2" aria-label="Toggle navigation"><span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-indigo-500 text-white rounded-full">
                    R
                  </span>
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                </button>
               
              </div>
            </div>
          </header>
         
          <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div class="p-4 space-y-5">
    
    
              
                <div class="w-full space-y-5">
              
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-indigo-500 text-white">
                        R
                      </span>
                    </div>
    
                  
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Rachel</p>
    
                      <div class="space-y-1">
                      
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hello
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">11:10</span>
                              </span>
                            </div>
                          </div>
    
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht2cmd_1" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                            
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht2cmd_1">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                         
                            </div>
                          </div>
                    
                        </div>
    
                     
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              {/* <img class="mb-2 rounded-lg" src="../../assets/img/mockups/img12.jpg" alt="Image Description" >
                              When using open method,<br><code>const select = new</code><br>it creates another instance of the select.
                  </img> */}
                              <span>
                                <span class="text-[11px] text-gray-400 italic">11:10</span>
                              </span>
                            </div>
                          </div>
    
                    
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht2cmd_2" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht2cmd_2">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            
                            </div>
                          </div>
                          
                        </div>
    
                     
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              <img class="mb-2 rounded-lg" src="../../assets/img/mockups/img10.jpg" alt="Image Description" />
                              2. Using the static method causes an error in the console.
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">11:12</span>
                              </span>
                            </div>
                          </div>
    
                       
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht2cmd_3" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                          
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht2cmd_3">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                          
                            </div>
                          </div>
                  
                        </div>
                      </div>
                    </div>
                 
                  </div>
                
                </div>
              
            </div>
          </div>
         
    
        
          <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
            <label for="hs-chat-autoheight-textarea-2" class="sr-only">Message</label>
    
            <div class="pb-2 ps-2">
              <textarea id="hs-chat-autoheight-textarea-2" class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300" placeholder="Message Rachel" ></textarea>
    
              <div class="pe-4 flex justify-between items-center gap-x-1">
            
                <div class="flex items-center gap-x-1">
              
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span class="sr-only">Attach file</span>
                  </button>
              
    
             
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                    <span class="sr-only">Add emoji</span>
                  </button>
               
                </div>
              
                <div class="flex items-center gap-x-1">
                
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    <span class="sr-only">Send voice message</span>
                  </button>
             
    
                
                  <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="sr-only">Send</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </button>
               
                </div>
                
              </div>
            </div>
          </footer>
        
        </div>
    
        
        <aside id="hs-pro-chhds2" class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         ">
          <div class="h-full flex flex-col">
        
            <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
              <h3 class="font-semibold text-gray-800">
                Details
              </h3>
    
         
              <div class="absolute top-2 end-4 z-10">
                <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-pro-chhds2">
                  <span class="sr-only">Close</span>
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
     
            </div>
   
            <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100"><span class="flex flex-shrink-0 justify-center items-center size-16 text-2xl font-medium uppercase bg-indigo-500 text-white rounded-full">
                  R
                </span>
              <div class="mt-2 w-full">
                <h2 class="text-lg font-semibold text-gray-800">
                  Rachel Doe
                </h2>
                <p class="mb-2 text-[13px] text-gray-500">
                  Last seen 5 mins ago
                </p>
    
              
                <div class="mt-4 flex justify-center items-center gap-x-3">
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                    View profile
                  </button>
    
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Send email
                  </button>
                </div>
          
              </div>
            </div>
      
    
      
            <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div class="hs-accordion-group" data-hs-accordion-always-open>
    
                
                <div class="hs-accordion border-b border-gray-100 active" id="hs-pro-chdsudc2">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdsudc2-collapse">
                    <span class="text-sm font-medium">User details</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdsudc2-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdsudc2">
                    <div class="px-5 pb-5">
    
                   
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            Country:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            Netherlands
                          </p>
                        </dd>
                      </dl>
                   
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            rachel@gmail.com
                          </p>
                        </dd>
                      </dl>
                      
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            Phone:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            +297 000-00-00
                          </p>
                        </dd>
                      </dl>
                   
                    </div>
                  </div>
                </div>
        
                <div class="hs-accordion active" id="hs-pro-chdssmc2">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdssmc2-collapse">
                    <span class="text-sm font-medium">Shared media</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdssmc2-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdssmc2">
                    <div class="pb-5 px-5">
                      <div class="grid grid-cols-3 gap-px">
                        <img class="flex-shrink-0 size-[110px] rounded-lg object-cover" src="../../assets/img/mockups/img10.jpg" alt="Image Description" />
                        <img class="flex-shrink-0 size-[110px] rounded-lg object-cover" src="../../assets/img/mockups/img12.jpg" alt="Image Description" />
                      </div>
                    </div>
                  </div>
                </div>
           
              </div>
            </div>
          
          </div>
        </aside>
      
      </div>
  
      <div id="hs-pro-tabs-chct-3" class="hidden" role="tabpanel" aria-labelledby="hs-pro-tabs-chct-item-3">
        <div class="relative h-dvh flex flex-col justify-end">
        
          <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
            <div class="lg:hidden w-20 sm:w-auto flex items-center">
           
              <div class="-ms-3">
                <button type="button" class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
                  <svg class="flex-shrink-0 size-4 -ms-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Chat
                </button>
              </div>
      
            </div>
    
          
            <div>
              <button type="button" class="truncate flex items-center gap-x-3.5 focus:outline-none" data-hs-overlay="#hs-pro-chhds3" aria-controls="hs-pro-chhds3" aria-label="Toggle navigation">
                <span class="lg:block hidden relative flex-shrink-0">
                  <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                </span>
                <span class="grow text-center lg:text-start truncate">
                  <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                    Lewis Clarke
                  </span>
                  <span class="truncate block text-xs text-gray-500 leading-4">
                    Last seen 12 mins ago
                  </span>
                </span>
              </button>
            </div>
        
    
            <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
           
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                  <span class="sr-only">Snooze</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Snooze
                </span>
              </div>
            
    
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  <span class="sr-only">Tags</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Tags
                </span>
              </div>
            
              <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                <button id="hs-pro-cht3hmd" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
    
             
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg" aria-labelledby="hs-pro-cht3hmd">
                  <div class="p-1 space-y-1">
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Mark as unread
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                      Mark as read
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                      Snooze
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                      Tags
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsh">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                      Share
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsp">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      Spam
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhbu">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      Block user
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhdl">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              
              </div>
      
    
              <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
     
                <button type="button" class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds3" aria-controls="hs-pro-chhds3" aria-label="Toggle navigation">
                  <svg class="xl:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
                  <svg class="hidden xl:block flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
                </button>
    
                <button type="button" class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds3" aria-controls="hs-pro-chhds3" aria-label="Toggle navigation">
                  <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                  <span class="absolute -bottom-0 -end-0 block size-2 rounded-full ring-2 ring-white bg-orange-500"></span>
                </button>
            
              </div>
            </div>
          </header>
       
    
      
          <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div class="p-4 space-y-5">
    
    
              
                <div class="w-full space-y-4">
                 
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
                    </div>
    
                    
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Lewis</p>
    
                      <div class="space-y-1">
                   
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              <div class="mb-1 grid grid-cols-2 gap-x-1">
                                <img class="flex-shrink-0 size-[10.25rem] rounded-s-md object-cover" src="../../assets/img/900x556/img6.jpg" alt="Image Description" />
                                <div class="space-y-1">
                                  <img class="flex-shrink-0 h-20 rounded-tr-md object-cover" src="../../assets/img/900x556/img6.jpg" alt="Image Description" />
                                  <img class="flex-shrink-0 h-20 rounded-br-md object-cover" src="../../assets/img/900x556/img1.jpg" alt="Image Description" />
                                </div>
                              </div>
                              How's these all free? 🤯
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">07:02</span>
                              </span>
                            </div>
                          </div>
    
                        
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht3cmd_1" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                         
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht3cmd_1">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                          
                            </div>
                          </div>
                       
                        </div>
                      </div>
                    </div>
            
                  </div>
               
                </div>
                
            </div>
          </div>
      
    
         
          <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
            <label for="hs-chat-autoheight-textarea-3" class="sr-only">Message</label>
    
            <div id="hs-ch1trc" class="hs-removing:opacity-0 transition duration-100 py-2.5 px-[26px] border-b border-gray-100">
              <div class="flex justify-between items-center gap-x-3 border-s-2 border-blue-600 ps-2">
                <div class="w-full">
                  <p class="font-medium text-xs text-blue-600">Reply to Lewis</p>
                  <p class="text-xs text-gray-800">How's these all free? 🤯</p>
                </div>
                <div class="grow">
                  <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600" data-hs-remove-element="#hs-ch1trc">
                    <span class="sr-only">Close</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          
    
            <div class="pb-2 ps-2">
              <textarea id="hs-chat-autoheight-textarea-3" class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300" placeholder="Message Lewis" >This is little appreciation to community! 🤭</textarea>
    
              <div class="pe-4 flex justify-between items-center gap-x-1">
          
                <div class="flex items-center gap-x-1">
                
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span class="sr-only">Attach file</span>
                  </button>
                
    
             
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                    <span class="sr-only">Add emoji</span>
                  </button>
                  
                </div>
               
    
               
                <div class="flex items-center gap-x-1">
                
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    <span class="sr-only">Send voice message</span>
                  </button>
                
    
                
                  <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="sr-only">Send</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </button>
               
                </div>
           
              </div>
            </div>
          </footer>
        
        </div>
    
       
        <aside id="hs-pro-chhds3" class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         ">
          <div class="h-full flex flex-col">
           
            <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
              <h3 class="font-semibold text-gray-800">
                Details
              </h3>
    
             
              <div class="absolute top-2 end-4 z-10">
                <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-pro-chhds3">
                  <span class="sr-only">Close</span>
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
            
            </div>
      
    
        
            <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100">
              <img class="flex-shrink-0 size-16 rounded-full" src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80" alt="Avatar" />
              <div class="mt-2 w-full">
                <h2 class="text-lg font-semibold text-gray-800">
                  Lewis Clarke
                </h2>
                <p class="mb-2 text-[13px] text-gray-500">
                  Last seen 12 mins ago
                </p>
    
          
                <div class="mt-4 flex justify-center items-center gap-x-3">
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                    View profile
                  </button>
    
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Send email
                  </button>
                </div>
             
              </div>
            </div>
          
    
     
            <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div class="hs-accordion-group" data-hs-accordion-always-open>
    
               
                <div class="hs-accordion border-b border-gray-100 active" id="hs-pro-chdsudc3">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdsudc3-collapse">
                    <span class="text-sm font-medium">User details</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdsudc3-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdsudc3">
                    <div class="px-5 pb-5">
                   
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                            Company:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            Acroma
                          </p>
                        </dd>
                      </dl>
                    
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            Country:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            United States
                          </p>
                        </dd>
                      </dl>
                      
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            lewis@acroma.com
                          </p>
                        </dd>
                      </dl>
                     
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            Site:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <a class="align-top text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-none focus:underline" href="#">
                            acroma.com
                          </a>
                        </dd>
                      </dl>
                      
                    </div>
                  </div>
                </div>
                
                <div class="hs-accordion active" id="hs-pro-chdssmc3">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdssmc3-collapse">
                    <span class="text-sm font-medium">Shared media</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdssmc3-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdssmc3">
                    <div class="pb-5 px-5">
                      <p class="text-sm text-gray-500">
                        Only shared images appear here
                      </p>
                    </div>
                  </div>
                </div>
            
              </div>
            </div>
        
          </div>
        </aside>
       
      </div>
      
    
      <div id="hs-pro-tabs-chct-4" class="hidden" role="tabpanel" aria-labelledby="hs-pro-tabs-chct-item-4">
        <div class="relative h-dvh flex flex-col justify-end">
      
          <header class="sticky top-0 inset-x-0 z-50 py-2 px-4 flex justify-between gap-x-2 xl:grid xl:grid-cols-2 bg-white border-b border-gray-200">
            <div class="lg:hidden w-20 sm:w-auto flex items-center">
            
              <div class="-ms-3">
                <button type="button" class="flex justify-center items-center gap-x-1 py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-sidebar" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation">
                  <svg class="flex-shrink-0 size-4 -ms-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Chat
                </button>
              </div>
             
            </div>
    
            
            <div>
              <button type="button" class="truncate flex items-center gap-x-3.5 focus:outline-none" data-hs-overlay="#hs-pro-chhds4" aria-controls="hs-pro-chhds4" aria-label="Toggle navigation">
                <span class="lg:block hidden relative flex-shrink-0"><span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-orange-500 text-white rounded-full">
                    T
                  </span>
                </span>
                <span class="grow text-center lg:text-start truncate">
                  <span class="truncate block font-semibold text-sm leading-4 text-gray-800">
                    Technical issues
                  </span>
                  <span class="truncate block text-xs text-gray-500 leading-4">
                    4 members
                  </span>
                </span>
              </button>
            </div>
          
    
            <div class="w-20 sm:w-auto flex justify-end items-center gap-x-0.5">
           
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                  <span class="sr-only">Snooze</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Snooze
                </span>
              </div>
             
              <div class="hs-tooltip hidden sm:inline-block">
                <button type="button" class="hs-tooltip-toggle flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  <span class="sr-only">Tags</span>
                </button>
                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
                  Tags
                </span>
              </div>
            
              <div class="hs-dropdown [--strategy:absolute] [--placement:top-right] relative inline-flex">
                <button id="hs-pro-cht4hmd" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
    
               
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-40 transition-[opacity,margin] duration opacity-0 hidden z-[11] bg-white rounded-xl shadow-lg" aria-labelledby="hs-pro-cht4hmd">
                  <div class="p-1 space-y-1">
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      Mark as unread
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                      Mark as read
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsn">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
                      Snooze
                    </button>
                    <button type="button" class="sm:hidden w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhtgm">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                      Tags
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsh">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                      Share
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhsp">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      Spam
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhbu">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      Block user
                    </button>
                    <button type="button" class="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhdl">
                      <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
                
              </div>
             
    
              <div class="relative md:ps-2 ms-1 before:hidden md:before:block before:absolute before:top-1/2 before:start-0 before:w-px before:h-4 before:bg-gray-200 before:-translate-y-1/2">
              
                <button type="button" class="hidden lg:flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds4" aria-controls="hs-pro-chhds4" aria-label="Toggle navigation">
                  <svg class="xl:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
                  <svg class="hidden xl:block flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
                </button>
    
                <button type="button" class="lg:hidden relative flex-shrink-0 flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" data-hs-overlay="#hs-pro-chhds4" aria-controls="hs-pro-chhds4" aria-label="Toggle navigation"><span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-orange-500 text-white rounded-full">
                    T
                  </span>
                </button>
             
              </div>
            </div>
          </header>
         
          <div class="h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div class="p-4 space-y-5">
    
              <div class="relative space-y-5">
            
                <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                  <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">01 May</span>
                </div>
            
                <div class="w-full space-y-4">
                  
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                    </div>
    
                   
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Lousie</p>
    
                      <div class="space-y-1">
                       
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hello everyone
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:49</span>
                              </span>
                            </div>
                          </div>
    
                         
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_1" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                           
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_1">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                      
                        </div>
                      </div>
                    </div>
                  
                  </div>
                 
    
                 
                  <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                  
                    <div>
                      <p class="mb-1.5 pe-2.5 text-xs text-gray-400">James</p>
    
                      <div class="space-y-1">
                     
                        <div class="group flex justify-end gap-x-2 word-break: break-word" >
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hi Lousie
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">18:39</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                         
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht4cmd_2" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                             
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_2">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                           
                            </div>
                          </div>
                       
                        </div>
    
                      
                        <div class="group flex justify-end gap-x-2 word-break: break-word">
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              How are you?
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">18:40</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                      
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht4cmd_3" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_3">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                   
    
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
                    </div>
                  </div>
                  
                </div>
              
              </div>
    
              <div class="relative space-y-5">
               
                <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                  <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">02 May</span>
                </div>
             
    
               
                <div class="w-full space-y-4">
                 
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                    </div>
    
            
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Anna</p>
    
                      <div class="space-y-1">
                       
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              you guys I need your help
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:00</span>
                              </span>
                            </div>
                          </div>
    
                          
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_4" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                          
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_4">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            
                            </div>
                          </div>
                         
                        </div>
    
                    
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              <div class="flex items-center gap-x-2">
                                <button type="button" class="flex justify-center items-center size-9 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 text-white rounded-full">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                                </button>
                                <div class="grow">
                                  <svg class="text-blue-600" width="77" height="19" viewBox="0 0 77 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="3" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="6" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="9" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="12" y="4" width="2" height="15" fill="currentColor"/>
                                    <rect x="15" y="6" width="2" height="13" fill="currentColor"/>
                                    <rect x="18" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="21" y="15" width="2" height="4" fill="currentColor"/>
                                    <rect x="24" y="12" width="2" height="7" fill="currentColor"/>
                                    <rect x="27" width="2" height="19" fill="currentColor"/>
                                    <rect x="30" y="7" width="2" height="12" fill="currentColor"/>
                                    <rect x="33" y="3" width="2" height="16" fill="currentColor"/>
                                    <rect x="36" y="9" width="2" height="10" fill="currentColor"/>
                                    <rect x="39" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="42" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="45" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="48" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="51" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="54" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="57" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="60" width="2" height="19" fill="currentColor"/>
                                    <rect x="63" y="7" width="2" height="12" fill="currentColor"/>
                                    <rect x="66" width="2" height="19" fill="currentColor"/>
                                    <rect x="69" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="72" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="75" y="18" width="2" height="1" fill="currentColor"/>
                                  </svg>
                                  <div class="inline-flex items-center gap-x-1">
                                    <p class="text-xs text-gray-500">
                                      00:08
                                    </p>
                                  </div>
                                </div>
                              </div>
    
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:51</span>
                              </span>
                            </div>
                          </div>
    
                       
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_5" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                          
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_5">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                       
                        </div>
                      </div>
                    </div>
                   
                  </div>
               
    
                  
                  <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                   
                    <div>
                      <p class="mb-1.5 pe-2.5 text-xs text-gray-400">Christina</p>
    
                      <div class="space-y-1">
                       
                        <div class="group flex justify-end gap-x-2 word-break: break-word">
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              <div class="flex items-center gap-x-2">
                                <button type="button" class="flex justify-center items-center size-9 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 text-white rounded-full">
                                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                                </button>
                                <div class="grow">
                                  <svg class="text-blue-600" width="77" height="19" viewBox="0 0 77 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="3" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="6" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="9" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="12" y="4" width="2" height="15" fill="currentColor"/>
                                    <rect x="15" y="6" width="2" height="13" fill="currentColor"/>
                                    <rect x="18" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="21" y="15" width="2" height="4" fill="currentColor"/>
                                    <rect x="24" y="12" width="2" height="7" fill="currentColor"/>
                                    <rect x="27" width="2" height="19" fill="currentColor"/>
                                    <rect x="30" y="7" width="2" height="12" fill="currentColor"/>
                                    <rect x="33" y="3" width="2" height="16" fill="currentColor"/>
                                    <rect x="36" y="9" width="2" height="10" fill="currentColor"/>
                                    <rect x="39" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="42" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="45" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="48" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="51" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="54" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="57" y="14" width="2" height="5" fill="currentColor"/>
                                    <rect x="60" width="2" height="19" fill="currentColor"/>
                                    <rect x="63" y="7" width="2" height="12" fill="currentColor"/>
                                    <rect x="66" width="2" height="19" fill="currentColor"/>
                                    <rect x="69" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="72" y="18" width="2" height="1" fill="currentColor"/>
                                    <rect x="75" y="18" width="2" height="1" fill="currentColor"/>
                                  </svg>
                                  <div class="inline-flex items-center gap-x-1">
                                    <p class="text-xs text-gray-500">
                                      00:08
                                    </p>
                                    <span class="inline-block size-1.5 rounded-full bg-blue-600"></span>
                                  </div>
                                </div>
                              </div>
    
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">09:52</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                         
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht4cmd_6" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                             
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_6">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                       
                        </div>
                      </div>
                    </div>
                   
    
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                    </div>
                  </div>
                
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-sky-500 text-white">
                        S
                      </span>
                    </div>
    
                  
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Sun</p>
    
                      <div class="space-y-1">
                     
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Hi
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:14</span>
                              </span>
                            </div>
                          </div>
    
                     
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_7" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                           
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_7">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                        
                        </div>
    
                      
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                         <p>idk what was here</p>
                          </div>
    
                         
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_8" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_8">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                         
                        </div>
    
                     
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Looks like user entered the wrong email <a class="break-all text-blue-600 underline" href="#">annarichard@gmail.cm</a> (typo at <a class="break-all text-blue-600 underline" href="#">gmail.cm</a>) - we will send a new email to <a class="break-all text-blue-600 underline" href="#">annarichard@gmail.com</a> with a link to create an account in a moment.
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:27</span>
                              </span>
                            </div>
                          </div>
    
                        
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_9" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                            
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_9">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            
                            </div>
                          </div>
                        
                        </div>
                      </div>
                    </div>
             
                  </div>
               
                </div>
              
              </div>
    
              <div class="relative space-y-5">
             
                <div class="sticky top-0 inset-x-0 z-10 max-w-lg mx-auto text-center">
                  <span class="py-0.5 px-1.5 bg-gray-100 text-xs text-gray-500 rounded-full">Today</span>
                </div>
                
    
                
                <div class="w-full space-y-4">
              
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                    </div>
    
                  
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Anna</p>
    
                      <div class="space-y-1">
                      
                        <div class="group flex justify-start gap-x-2 word-break: break-word">
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              ohh I didn't notice that typo 🙃
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">09:30</span>
                              </span>
                            </div>
                          </div>
    
                       
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_10" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                           
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_10">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                           
                            </div>
                          </div>
                          
                        </div>
    
                        
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              big thanks 😊
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">09:31</span>
                              </span>
                            </div>
                          </div>
    
                         
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_11" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_11">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                             
                            </div>
                          </div>
                        
                        </div>
                      </div>
                    </div>
                   
                  </div>
              
    
                
                  <div class="max-w-md flex gap-x-2">
                    <div class="flex-shrink-0 mt-auto">
                      <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase rounded-full bg-sky-500 text-white">
                        S
                      </span>
                    </div>
    
                    
                    <div>
                      <p class="mb-1.5 ps-2.5 text-xs text-gray-400">Sun</p>
    
                      <div class="space-y-1">
                       
                        <div class="group flex justify-start gap-x-2 word-break: break-word" >
                          <div class="order-1 bg-white shadow-sm inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              You're welcome
    
                              <span>
                                <span class="text-[11px] text-gray-400 italic">10:14</span>
                              </span>
                            </div>
                          </div>
    
                
                          <div class="order-2 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside]  relative inline-flex">
                              <button id="hs-pro-cht4cmd_12" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                        
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_12">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                           
                            </div>
                          </div>
                      
                        </div>
                      </div>
                    </div>
                    
                  </div>
                
    
                
                  <div class="max-w-md ms-auto text-end flex justify-end gap-x-2">
                   
                    <div>
                      <p class="mb-1.5 pe-2.5 text-xs text-gray-400">James</p>
    
                      <div class="space-y-1">
                      
                        <div class="group flex justify-end gap-x-2 word-break: break-word">
                          <div class="order-2 text-start bg-blue-100 inline-block rounded-xl pt-2 pb-1.5 px-2.5">
                            <div class="text-sm text-gray-800">
                              Great! 👍️
    
                              <span>
                                <span class="text-[11px] text-end text-blue-600 italic">18:39</span>
                                <svg class="inline-block flex-shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </span>
                            </div>
                          </div>
    
                          
                          <div class="order-1 lg:opacity-0 lg:group-hover:opacity-100">
                            <div class="hs-dropdown [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
                              <button id="hs-pro-cht4cmd_13" type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-200">
                                <svg class="flex-shrink-0 size-4 rounded-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                              </button>
    
                              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-32 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-lg before:h-4 before:absolute before:-top-4 before:start-0 before:w-full after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full" aria-labelledby="hs-pro-cht4cmd_13">
                                <div class="p-1">
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    Edit
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="m10 7-3 3 3 3"/><path d="M17 13v-1a2 2 0 0 0-2-2H7"/></svg>
                                    Reply
                                  </a>
                                  <a class="flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100" href="#">
                                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    Delete
                                  </a>
                                </div>
                              </div>
                            
                            </div>
                          </div>
                       
                        </div>
                      </div>
                    </div>
                  
    
                    <div class="flex-shrink-0 mt-auto">
                      <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar" />
                    </div>
                  </div>
              
                </div>
               
              </div>
            </div>
          </div>
        
    
          <footer class="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200">
            <label for="hs-chat-autoheight-textarea-4" class="sr-only">Message</label>
    
            <div class="pb-2 ps-2">
              <textarea id="hs-chat-autoheight-textarea-4" class="max-h-36 pt-4 pb-2 ps-2 pe-4 block w-full border-transparent rounded-0 md:text-sm leading-4 resize-none focus:outline-none focus:border-transparent focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300" placeholder="Message Group" ></textarea>
    
              <div class="pe-4 flex justify-between items-center gap-x-1">
               
                <div class="flex items-center gap-x-1">
                 
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span class="sr-only">Attach file</span>
                  </button>
                  
    
                
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                    <span class="sr-only">Add emoji</span>
                  </button>
            
                </div>
              
             
                <div class="flex items-center gap-x-1">
                  
                  <button type="button" class="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100">
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    <span class="sr-only">Send voice message</span>
                  </button>
               
                
                  <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-8 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span class="sr-only">Send</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </button>
                 
                </div>
              
              </div>
            </div>
          </footer>
         
        </div>
    
       
        <aside id="hs-pro-chhds4" class="hs-overlay [--body-scroll:true] 2xl:[--overlay-backdrop:false] [--is-layout-affect:true] [--opened:2xl] [--auto-close:2xl]
          hs-overlay-open:translate-x-0 2xl:hs-overlay-layout-open:translate-x-0
          translate-x-full transition-all duration-300 transform
          sm:w-96 size-full
          hidden
          fixed inset-y-0 end-0 z-[60]
          bg-white border-s border-gray-200
          2xl:block 2xl:translate-x-full 2xl:bottom-0
         
         ">
          <div class="h-full flex flex-col">
   
            <div class="py-3 px-4 flex justify-between items-center border-b border-gray-200">
              <h3 class="font-semibold text-gray-800">
                Details
              </h3>
    
              
              <div class="absolute top-2 end-4 z-10">
                <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-white text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#hs-pro-chhds4">
                  <span class="sr-only">Close</span>
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
              </div>
         
            </div>
        
    
     
            <div class="p-5 flex flex-col justify-center items-center text-center border-b border-gray-100"><span class="flex flex-shrink-0 justify-center items-center size-16 text-2xl font-medium uppercase bg-orange-500 text-white rounded-full">
                  B
                </span>
              <div class="mt-2 w-full">
                <h2 class="text-lg font-semibold text-gray-800">
                  Technical issues
                </h2>
                <p class="mb-2 text-[13px] text-gray-500">
                  4 members
                </p>
    
               
                <div class="mt-4 flex justify-center items-center gap-x-3">
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                    View profile
                  </button>
    
                  <button type="button" class="py-2 px-2.5 min-w-32 inline-flex justify-center items-center gap-x-1.5 font-medium text-xs rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                    <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Send email
                  </button>
                </div>
               
              </div>
            </div>
        
    
          
            <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div class="hs-accordion-group" data-hs-accordion-always-open>
            
                <div class="hs-accordion border-b border-gray-100 active" id="hs-pro-chdsm1">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdsm1-collapse">
                    <span class="text-sm font-medium">Members</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdsm1-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdsm1">
                    <div class="px-2 pb-5 space-y-1">
                      <a class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                        <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                        <div class="grow">
                          <p class="font-semibold text-[13px] text-gray-800">Christina Christy</p>
                          <p class="text-xs text-gray-500">Online</p>
                        </div>
                      </a>
    
                      <a class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                        <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                        <div class="grow">
                          <p class="font-semibold text-[13px] text-gray-800">Louise Donadieu</p>
                          <p class="text-xs text-gray-500">Last seen 5 mins ago</p>
                        </div>
                      </a>
    
                      <a class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                        <span class="flex flex-shrink-0 justify-center items-center size-8 text-xs font-medium uppercase bg-pink-500 text-white rounded-full">
                          S
                        </span>
                        <div class="grow">
                          <p class="font-semibold text-[13px] text-gray-800">Sun Chai</p>
                          <p class="text-xs text-gray-500">Last seen 3 hours ago</p>
                        </div>
                      </a>
    
                      <a class="block py-2 px-3 w-full flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100" href="#">
                        <img class="flex-shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=900&h=900&q=80" alt="Avatar" />
                        <div class="grow">
                          <p class="font-semibold text-[13px] text-gray-800">Tom Lowry</p>
                          <p class="text-xs text-gray-500">Last seen 1 day ago</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              
                <div class="hs-accordion border-b border-gray-100 active" id="hs-pro-chdsudc4">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdsudc4-collapse">
                    <span class="text-sm font-medium">User details</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdsudc4-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdsudc4">
                    <div class="px-5 pb-5">
    
                   
                      <dl class="py-1 grid grid-cols-3 gap-x-4">
                        <dt class="col-span-1">
                          <p class="inline-flex items-center gap-x-2 text-[13px] text-gray-500">
                            <svg class="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email:
                          </p>
                        </dt>
                        <dd class="col-span-2">
                          <p class="font-medium text-[13px] text-gray-800">
                            technical-issue@preline.com
                          </p>
                        </dd>
                      </dl>
                    
                    </div>
                  </div>
                </div>
             
                <div class="hs-accordion active" id="hs-pro-chdssmc4">
                  <button type="button" class="hs-accordion-toggle p-5 w-full flex justify-between items-center gap-x-3 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-pro-chdssmc4-collapse">
                    <span class="text-sm font-medium">Shared media</span>
                    <svg class="hs-accordion-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <svg class="hs-accordion-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                  </button>
    
                  <div id="hs-pro-chdssmc4-collapse" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-pro-chdssmc4">
                    <div class="pb-5 px-5">
                      <p class="text-sm text-gray-500">
                        Only shared images appear here
                      </p>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
           
          </div>
        </aside>
      
      </div>
  
    </main>
 
    
    </body>
    </>
  )
}

export default ChatPlaceholder