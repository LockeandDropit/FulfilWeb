import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

import { SingleMarker } from "./SingleMarker.jsx";
import { auth, db } from "../../../firebaseConfig.js";

import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  collection,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";

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
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Modal,
  Menu,
  MenuButton,
  MenuList,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useUserStore } from "../Chat/lib/userStore.js";
import { useSearchResults } from "../../../pages/Doer/Chat/lib/searchResults";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { ViewIcon } from "@chakra-ui/icons";
import {
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Markdown from "react-markdown";
import { FcGoogle } from "react-icons/fc";
// import LoggedOutHeader from "./Landing/LoggedOutHeader.jsx";
import { useMediaQuery } from "@chakra-ui/react";
import Plausible from "plausible-tracker";




const SingleMarkerApplied = ({props}) => {

    const selectedJobFromGroup = props

    const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState({
        lat: 1,
        lng: 1,
      });

      console.log("singlemarkerapplied is being rendered")
      const {
        isOpen: isOpenDrawerSingle,
        onOpen: onOpenDrawerSingle,
        onClose: onCloseDrawerSingle,
      } = useDisclosure();

      const handlePostedByBusinessToggleOpen = (x) => {
        setOpenInfoWindowMarkerID({ lat: x.locationLat, lng: x.locationLng });
        // updateJobListingViews(x);
    
        // onCloseDrawer();
        onOpenDrawerSingle();
    
        console.log("from on click", x);
      };

      const [markers, setMarkers] = useState({});

      const setMarkerRef = useCallback((marker, key) => {
        setMarkers((markers) => {
          if ((marker && markers[key]) || (!marker && !markers[key]))
            return markers;
    
          if (marker) {
            return { ...markers, [key]: marker };
          } else {
            const { [key]: _, ...newMarkers } = markers;
    
            return newMarkers;
          }
        });
      }, []);

  return (
    <>
     <AdvancedMarker
      position={{
        lat: selectedJobFromGroup.locationLat ? selectedJobFromGroup.locationLat : 44.96797106363888,
        lng: selectedJobFromGroup.locationLng ? selectedJobFromGroup.locationLng : -93.26177106829272,
      }}
      onClick={() => handlePostedByBusinessToggleOpen(selectedJobFromGroup)}
      setMarkerRef={setMarkerRef}
    >
      <button
        type="button"
        class=" -z-30 py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-600-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        {selectedJobFromGroup.isVolunteer ? (
          <p>Volunteer!</p>
        ) : selectedJobFromGroup.isSalaried ? (
          <p>
            ${selectedJobFromGroup.shortenedSalary} - ${selectedJobFromGroup.shortenedUpperSalary}/year
          </p>
        ) : selectedJobFromGroup.upperRate > selectedJobFromGroup.lowerRate ? (
          <p>${selectedJobFromGroup.lowerRate}/hr +</p>
        ) : (
          <p>${selectedJobFromGroup.lowerRate}/hr</p>
        )}
      </button>
    </AdvancedMarker>
    {openInfoWindowMarkerID.lat ===  selectedJobFromGroup.locationLat ? (
    <Drawer
      onClose={onCloseDrawerSingle}
      isOpen={isOpenDrawerSingle}
      size={"xl"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{selectedJobFromGroup.jobTitle}</DrawerHeader>
        <DrawerBody>
          <div class="">
            <Helmet>
              <meta charSet="utf-8" />
              <title>{selectedJobFromGroup.jobTitle}</title>
              <meta
                name="description"
                content={selectedJobFromGroup.description}
              />
              {/* <link rel="canonical" href=`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}` /> */}
            </Helmet>
            <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
              <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                <div class="p-4">
                  <div class=" ">
                    <div className="flex">
                      <label
                        for="hs-pro-dactmt"
                        class="block mb-2 text-xl font-medium text-gray-900"
                      >
                        {selectedJobFromGroup.jobTitle}
                      </label>
{/* 
                      <label onClick={() => onOpenShare()}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 ml-1 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                          />
                        </svg>
                      </label> */}
                    </div>
                    {selectedJobFromGroup.isFullTimePosition === true ? (
                      <label
                        for="hs-pro-dactmt"
                        class="block  text-lg font-medium text-gray-800"
                      >
                        Full-time
                      </label>
                    ) : (
                      <label
                        for="hs-pro-dactmt"
                        class="block  text-lg font-medium text-gray-800 "
                      >
                        Part-time
                      </label>
                    )}

                    {selectedJobFromGroup.isHourly ? (
                      <div class="space-y-1 ">
                        <div class="flex align-items-center">
                          <p className=" text-md font-medium">$</p>
                          <label
                            for="hs-pro-dactmt"
                            class="block text-md font-medium text-gray-800 "
                          >
                            {selectedJobFromGroup.lowerRate}
                          </label>
                          <p className=" text-md font-medium">
                            /hour - $
                          </p>
                          <label
                            for="hs-pro-dactmt"
                            class="block  text-md font-medium text-gray-800 "
                          >
                            {selectedJobFromGroup.upperRate}
                          </label>
                          <p className=" text-md font-medium">/hour</p>
                        </div>
                      </div>
                    ) : null}

                    {selectedJobFromGroup.isSalaried ? (
                      <div class="space-y-2 ">
                        <div class="flex align-items-center">
                          <p className=" text-md font-medium">$</p>
                          <label
                            for="hs-pro-dactmt"
                            class="block  text-md font-medium text-gray-800 "
                          >
                            {selectedJobFromGroup.lowerRate}
                          </label>
                          <p className="ml-1 text-md font-medium ">
                            yearly - $
                          </p>
                          <label
                            for="hs-pro-dactmt"
                            class="block  text-md font-medium text-gray-800 "
                          >
                            {selectedJobFromGroup.upperRate}
                          </label>
                          <p className=" ml-1 c font-medium">yearly</p>
                          {selectedJobFromGroup.isEstimatedPay ? (
                            <p>*</p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    {selectedJobFromGroup.isEstimatedPay ? (
                      <div className="mb-2 flex flex-col w-full text-sm ">
                        <a href="https://www.glassdoor.com/index.htm">
                          *Estimate. Powered by{" "}
                          <img
                            src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png"
                            title="Job Search"
                          />
                        </a>
                      </div>
                    ) : null}
                    <p class="block  text-md font-medium text-gray-800 ">
                      {selectedJobFromGroup.streetAddress},{" "}
                      {selectedJobFromGroup.city},{" "}
                      {selectedJobFromGroup.state}
                    </p>
                    {selectedJobFromGroup.isEstimatedAddress ? (
                      <p class="block italic text-sm  text-gray-800 ">
                        Address may not be exact
                      </p>
                    ) : null}
                    <p class="font-semibold text-md text-gray-500  cursor-default">
                      <span className="font-semibold text-md text-slate-700">
                        {" "}
                        Posted:
                      </span>{" "}
                      {selectedJobFromGroup.datePosted}
                    </p>
                    <p class="font-semibold text-md text-slate-700 cursor-pointer">
                      Employer:
                    </p>
                    <div className="flex">
                      {selectedJobFromGroup.employerProfilePicture ? (
                        <>
                          <div class="flex flex-col justify-center items-center size-[56px]  ">
                            <img
                              src={
                                selectedJobFromGroup.employerProfilePicture
                              }
                              class="flex-shrink-0 size-[64px] rounded-full"
                            />

                            <div className="flex flex-col ml-4">
                              <p class="font-semibold text-md text-gray-500  mt-2 cursor-pointer">
                                {selectedJobFromGroup.businessName}
                              </p>
                              <p class="font-semibold text-md text-gray-500 cursor-default ">
                                {selectedJobFromGroup.city}, Minnesota
                              </p>
                            </div>
                          </div>
                        </>
                      ) : null}
                      <div className="flex flex-col">
                        <p class="font-semibold text-md text-gray-500  mt-1 cursor-pointer">
                          {selectedJobFromGroup.companyName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2 mt-10 mb-4 ">
                    <label
                      for="dactmi"
                      class="block mb-2 text-lg font-medium text-gray-900 "
                    >
                      What you'll be doing
                    </label>
                    <div className="w-full prose prose-li  font-inter marker:text-black mb-4 ">
                      <Markdown>
                        {selectedJobFromGroup.description}
                      </Markdown>
                    </div>
                  </div>
                  {selectedJobFromGroup.bio ? (
                    <div class="space-y-2 mt-10 mb-4">
                      <label
                        for="dactmi"
                        class="block mb-2 text-md font-medium text-gray-800 "
                      >
                        About {selectedJobFromGroup.companyName}
                      </label>

                      <div class="mb-4">
                        <p>{selectedJobFromGroup.bio}</p>
                      </div>
                    </div>
                  ) : null}

                  <div class="space-y-2 mb-4 ">
                    <label
                      for="dactmi"
                      class="block mb-2 text-lg font-medium text-gray-900 "
                    >
                      Job Requirements
                    </label>

                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                      <Markdown>
                        {selectedJobFromGroup.applicantDescription}
                      </Markdown>
                    </div>
                  </div>
                  <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                    <label
                      for="dactmi"
                      class="block mb-2 text-lg font-medium text-gray-900 "
                    >
                      Employment Benefits
                    </label>

                    <div className="prose prose-li  font-inter marker:text-black mb-4">
                      {selectedJobFromGroup.benefitsDescription ? (
                        <Markdown>
                          {selectedJobFromGroup.benefitsDescription}
                        </Markdown>
                      ) : (
                        <p>Nothing listed</p>
                      )}
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
            <div className="flex align-center justify-center">
            <p>{'\u2728'}You've already applied for this position!{'\u2728'}</p>
            </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

) : null}
  </>
  )
}

export default SingleMarkerApplied