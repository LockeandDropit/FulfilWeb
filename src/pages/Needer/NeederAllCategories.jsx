//make this another split screen

//left side is text about finding the right professional.
//followed by copy to sign up or sign in.

//right side is scrollview of featured contractors in that category.

import React, { useState, useEffect } from "react";

import NeederHeader from "./NeederHeader";

import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
  Spinner,
} from "@chakra-ui/react";
import { StreamChat } from "stream-chat";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Tag,
  TagLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import { auth, db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import NeederDashboard from "./NeederDashboard";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  query,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import star_corner from "../../images/star_corner.png";
import star_filled from "../../images/star_filled.png";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";


const NeederAllCategories = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();

  const handleNavigation = (x) => {
    navigate("/NeederSelectedCategory", { state: { category: x } });
  };

  //credit template split screen with image https://chakra-templates.vercel.app/forms/authentication

  //Card Social User PRofile Sample Template credit https://chakra-templates.vercel.app/components/cards
  return (
    <>
      <Header />

      
      
            <Dashboard />
       
          <div class="mt-20 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <h1 class="block text-xl font-bold text-gray-800 sm:text-center md:text-center sm:text-4xl lg:text-4xl lg:leading-tight">
        Looking for a <span class="text-sky-400">Pro?</span>
      </h1>
      <p class="mt-3 sm:text-center md:text-center text-lg text-gray-800">
        Browse our contractors by category and send them a message!
      </p>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/DrivewayAsphalt.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Asphalt</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Asphalt")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/CarpentryTrim.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Carpentry</h3>
            <p class="mt-3 text-gray-500">
              From simple framing to large scale industrial projects, our pros
              can get the job done.
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Carpentry")}
            >
              See Pros
            </button>
          </div>
        </div>

        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* //credit Towfiqu Barbhuiya https://unsplash.com/photos/person-in-blue-long-sleeve-shirt-sitting-beside-black-laptop-computer--9gPKrsbGmc */}
          <img src="/landingImages/Cleaning.jpg" className="rounded-t-xl" />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Cleaning</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Cleaning")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
              src="/landingImages/ConcreteAsphalt.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Concrete</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your roofing needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Concrete")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img src="/landingImages/Drywall.jpg" className="rounded-t-xl" />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Drywall</h3>
            <p class="mt-3 text-gray-500">
              Need a new driveway or looking for someone who can handle a
              commercial sized job?
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Drywall")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/electrical.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800"> Electrical Work</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your electrical needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Electrical Work")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
            src="/landingImages/GutterCleaning.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Gutter Cleaning</h3>
            <p class="mt-3 text-gray-500">
              Have your gutters cleaned by a profesisonal
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Gutter Cleaning")}
            >
              See Pros
            </button>
          </div>
        </div>

      
       
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
             src="/landingImages/Handyman.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800"> General Handyman</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your general handyman needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("General Handyman")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
                src="/landingImages/NewHVAC.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">HVAC</h3>
            <p class="mt-3 text-gray-500">
              For all of your residential and industrial needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("HVAC")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
           src="/landingImages/NewLandscaping2.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Landscaping</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for highly-rated landscapers
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Landscaping")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
          src="/landingImages/Painting.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Painting</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all your painting needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Painting")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
                src="/landingImages/Plumbing.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Plumbing</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your plumbing needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Plumbing")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
           src="/landingImages/PressureWashing.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Pressure Washing</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your pressure washing needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Pressure Washing")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
             src="/landingImages/RoofingSiding.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Roofing</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your roofing needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Roofing")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
           src="/landingImages/Shoveling.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Snow Removal</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your snow removal needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleNavigation("Snow Removal")}
            >
              See Pros
            </button>
          </div>
        </div>
        <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
          <img
          src="/landingImages/WindowInstallation.jpg"
            className="rounded-t-xl"
          />
          <div class="p-4 md:p-6">
            <h3 class="text-xl font-semibold text-gray-800">Window Installation</h3>
            <p class="mt-3 text-gray-500">
              Browse our pros for all of your window installation needs
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
            <button
              class=" text-sky-600 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() =>
                handleNavigation("Window Installation")
              }
            >
              See Pros
            </button>
          </div>
        </div>
      </div>
    </div>
         
     
    </>
  );
};

export default NeederAllCategories;
