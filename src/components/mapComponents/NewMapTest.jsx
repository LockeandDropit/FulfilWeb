import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, MarkerClustererF, InfoBox, } from "@react-google-maps/api";
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
import { FacebookShareButton, FacebookIcon } from "react-share";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "@chakra-ui/react";


const containerStyle = {
  width: "100vw",
  height: "92vh",
};

const center = {
  lat: 44.96797106363888,
  lng: -93.26177106829272,
};

function NewMapTest(props) {
    const [isDesktop] = useMediaQuery("(min-width: 500px)");

  const { isLoaded } = useJsApiLoader({
    id: "6cc03a62d60ca935",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [urlCopied, setUrlCopied] = useState(false)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.setCenter(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [businessPostedJobs, setBusinessPostedJobs] = useState([]);

  useEffect(() => {
    if (props) {
      setBusinessPostedJobs(props.props);
    //   console.log("position", props.props.map((job) => {
    //     return(console.log(job.position))
    //       }))
    }
  }, [props]);

  const [openInfoWindowMarkerID, setOpenInfoWindowMarkerID] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure()
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare,
  } = useDisclosure();
  const {
    isOpen: isOpenEmailSignUp,
    onOpen: onOpenEmailSignUp,
    onClose: onCloseEmailSignUp,
  } = useDisclosure();
  const {
    isOpen: isOpenEmailSignUpSuccess,
    onOpen: onOpenEmailSignUpSuccess,
    onClose: onCloseEmailSignUpSuccess,
  } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const {
    isOpen: isOpenPlumber,
    onOpen: onOpenPlumber,
    onClose: onClosePlumber,
  } = useDisclosure();
  const {
    isOpen: isOpenServer,
    onOpen: onOpenServer,
    onClose: onCloseServer,
  } = useDisclosure();

  const {
    isOpen: isOpenCNC,
    onOpen: onOpenCNC,
    onClose: onCloseCNC,
  } = useDisclosure();
  const handlePostedByBusinessToggleOpen = (x) => {
    setOpenInfoWindowMarkerID(x);
    // updateJobListingViews(x);
    onOpenDrawer();
    console.log("recievingg", x)
  };

  const handleCopiedURL = (businessPostedJobs) => {
    setUrlCopied(true)
    navigator.clipboard.writeText(`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`)
  }
  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  };

  const [isReady, setIsReady] = useState(false)

  setTimeout(() => {
    setIsReady(true)
  }, 10000)

  useEffect(() => {
    if (businessPostedJobs?.length > 0) {
       console.log("they're loadedd")
    }
   }, [businessPostedJobs])


  if (!isLoaded) {
    return <div>Loading....</div>;
  }




  return isLoaded && businessPostedJobs !== null ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >

{businessPostedJobs?.length > 0 &&  (
<MarkerClustererF >
                {(clusterer) =>
                 
                  businessPostedJobs?.map((businessPostedJobs) => (
                 
                    <>
                    <MarkerF
                      key={businessPostedJobs.jobID}
                      position={{
                        lat: businessPostedJobs.locationLat
                          ? businessPostedJobs.locationLat
                          : 44.96797106363888,
                        lng: businessPostedJobs.locationLng
                          ? businessPostedJobs.locationLng
                          : -93.26177106829272,
                      }}
                      visible={false}
                    //   label={{}}
                    
                    //   options={{
                    //     icon: {
                    //       scaledSize: new window.google.maps.Size(56, 56),
                    //       url: businessPostedJobs.lowerRate,
                    //     },
                    //   }}
                      clusterer={clusterer}
                      onClick={() =>
                        handlePostedByBusinessToggleOpen(businessPostedJobs.jobID)
                      }
                    >
                        
                    </MarkerF>
                    <AdvancedMarker
                        key={businessPostedJobs.jobID}
                        position={{
                          lat: businessPostedJobs.locationLat
                            ? businessPostedJobs.locationLat
                            : 44.96797106363888,
                          lng: businessPostedJobs.locationLng
                            ? businessPostedJobs.locationLng
                            : -93.26177106829272,
                        }}
                        //  ref={(marker) => setMarkerRef(marker, businessPostedJobs.key)}
                        onClick={() =>
                          handlePostedByBusinessToggleOpen(businessPostedJobs)
                        }
                      >
                        <button
                          type="button"
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {businessPostedJobs.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : businessPostedJobs.isSalaried ? (
                            <p>
                              ${businessPostedJobs.lowerRate} yearly - ${businessPostedJobs.upperRate} yearly
                            </p>
                          ) : ( businessPostedJobs.upperRate > businessPostedJobs.lowerRate ?  (<p>
                            ${businessPostedJobs.lowerRate}/hr + 
                          </p>) : ( <p>
                              ${businessPostedJobs.lowerRate}/hr
                            </p>)
                           
                          )}
                        </button>
                        /
                      </AdvancedMarker>
                    {openInfoWindowMarkerID === businessPostedJobs.jobID ? (
                        <>
                          <Drawer
                            onClose={onCloseDrawer}
                            isOpen={isOpenDrawer}
                            size={"xl"}
                          >
                            <DrawerOverlay />
                            <DrawerContent>
                              <DrawerCloseButton />
                              <DrawerHeader>{businessPostedJobs.jobTitle}</DrawerHeader>
                              <DrawerBody>
                                <div class="">
                                  <Helmet>
                                    <meta charSet="utf-8" />
                                    <title>{businessPostedJobs.jobTitle}</title>
                                    <meta
                                      name="description"
                                      content={businessPostedJobs.description}
                                    />
                                    {/* <link rel="canonical" href=`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}` /> */}
                                  </Helmet>
                                  <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto  ">
                                    {/* <div class="py-3 px-4 flex justify-between items-center border-b ">
                                            <h3 class="font-semibold text-gray-800">Create A Job</h3>
                                        
                                          </div> */}
          
                                    <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                                      <div class="p-4 ">
                                        <div class="">
                                          <div className="flex">
                                            <label
                                              for="hs-pro-dactmt"
                                              class="block mb-2 text-lg font-medium text-gray-800"
                                            >
                                              {businessPostedJobs.jobTitle}
                                            </label>
          
                                            {/*                                        
                                                  <label onClick={() => onOpenShare()}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-1 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
          </svg>
          
                                                   
                                                  </label> */}
          
                                            {businessPostedJobs.jobTitle.includes(
                                              "Plumber"
                                            ) ? (
                                              <label onClick={() => onOpenPlumber()}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke-width="1.5"
                                                  stroke="currentColor"
                                                  class="size-4 ml-1"
                                                >
                                                  <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                  />
                                                </svg>
                                              </label>
                                            ) : null}
                                            {businessPostedJobs.jobTitle.includes(
                                              "Server" || "server"
                                            ) ? (
                                              <label onClick={() => onOpenServer()}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke-width="1.5"
                                                  stroke="currentColor"
                                                  class="size-4 ml-1"
                                                >
                                                  <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                  />
                                                </svg>
                                              </label>
                                            ) : null}
                                            {businessPostedJobs.jobTitle.includes(
                                              "Machinist" || "CNC"
                                            ) ? (
                                              <label onClick={() => onOpenCNC()}>
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke-width="1.5"
                                                  stroke="currentColor"
                                                  class="size-4 ml-1"
                                                >
                                                  <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                  />
                                                </svg>
                                              </label>
                                            ) : null}
                                          </div>
                                          {businessPostedJobs.isFullTimePosition ===
                                          true ? (
                                            <label
                                              for="hs-pro-dactmt"
                                              class="block  text-md font-medium text-gray-800"
                                            >
                                              Full-time
                                            </label>
                                          ) : (
                                            <label
                                              for="hs-pro-dactmt"
                                              class="block  text-md font-medium text-gray-800 "
                                            >
                                              Part-time
                                            </label>
                                          )}
          
                                          {businessPostedJobs.isHourly ? (
                                            <div class="space-y-1 ">
                                              <div class="flex align-items-center">
                                                <p className=" text-sm font-medium">$</p>
                                                <label
                                                  for="hs-pro-dactmt"
                                                  class="block text-sm font-medium text-gray-800 "
                                                >
                                                  {businessPostedJobs.lowerRate}
                                                </label>
                                                <p className=" text-sm font-medium">
                                                  /hour - $
                                                </p>
                                                <label
                                                  for="hs-pro-dactmt"
                                                  class="block  text-sm font-medium text-gray-800 "
                                                >
                                                  {businessPostedJobs.upperRate}
                                                </label>
                                                <p className=" text-sm font-medium">
                                                  /hour
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
          
                                          {businessPostedJobs.isSalaried ? (
                                            <div class="space-y-2 ">
                                              <div class="flex align-items-center">
                                                <p className=" text-sm font-medium">$</p>
                                                <label
                                                  for="hs-pro-dactmt"
                                                  class="block  text-sm font-medium text-gray-800 "
                                                >
                                                  {businessPostedJobs.lowerRate}
                                                </label>
                                                <p className="ml-1 text-sm font-medium ">
                                                  yearly - $
                                                </p>
                                                <label
                                                  for="hs-pro-dactmt"
                                                  class="block  text-sm font-medium text-gray-800 "
                                                >
                                                  {businessPostedJobs.upperRate}
                                                </label>
                                                <p className=" ml-1 text-sm font-medium">
                                                  yearly
                                                </p>
                                              </div>
                                            </div>
                                          ) : null}
                                          <p class="block  text-sm font-medium text-gray-800 ">
                                            {businessPostedJobs.streetAddress},{" "}
                                            {businessPostedJobs.city},{" "}
                                            {businessPostedJobs.state}
                                          </p>
                                          <p class="font-semibold text-sm text-gray-500  cursor-default">
                                            <span className="font-semibold text-sm text-slate-700">
                                              {" "}
                                              Posted:
                                            </span>{" "}
                                            {businessPostedJobs.datePosted}
                                          </p>
                                          <p class="font-semibold text-sm text-slate-700  mt-2 cursor-pointer">
                                            Employer:
                                          </p>
                                          <div className="flex">
                                            {businessPostedJobs.employerProfilePicture ? (
                                              <>
                                                <div class="flex flex-col justify-center items-center size-[56px]  ">
                                                  <img
                                                    src={
                                                      businessPostedJobs.employerProfilePicture
                                                    }
                                                    class="flex-shrink-0 size-[64px] rounded-full"
                                                  />
          
                                                  <div className="flex flex-col ml-4">
                                                    <p class="font-semibold text-sm text-gray-500  mt-2 cursor-pointer">
                                                      {businessPostedJobs.businessName}
                                                    </p>
                                                    <p class="font-semibold text-sm text-gray-500 cursor-default ">
                                                      {businessPostedJobs.city}, Minnesota
                                                    </p>
                                                  </div>
                                                </div>
                                              </>
                                            ) : null}
                                            <div className="flex flex-col">
                                              <p class="font-semibold text-sm text-gray-500  mt-1 cursor-pointer">
                                                {businessPostedJobs.companyName}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
          
                                        <div class="space-y-2 mt-10 mb-4">
                                          <label
                                            for="dactmi"
                                            class="block mb-2 text-md font-medium text-gray-800 "
                                          >
                                            What you'll be doing
                                          </label>
          
                                          <div class="mb-4">
                                            <p>{businessPostedJobs.description}</p>
                                          </div>
                                        </div>
                                        {businessPostedJobs.bio ? (
                                          <div class="space-y-2 mt-10 mb-4">
                                            <label
                                              for="dactmi"
                                              class="block mb-2 text-md font-medium text-gray-800 "
                                            >
                                              About {businessPostedJobs.companyName}
                                            </label>
          
                                            <div class="mb-4">
                                              <p>{businessPostedJobs.bio}</p>
                                            </div>
                                          </div>
                                        ) : null}
          
                                        <div class="space-y-2 mb-4 ">
                                          <label
                                            for="dactmi"
                                            class="block mb-2 text-md font-medium text-gray-800 "
                                          >
                                            Job Requirements
                                          </label>
          
                                          <div class="mb-4">
                                            <p>
                                              {businessPostedJobs.applicantDescription}
                                            </p>
                                          </div>
                                        </div>
                                        <div class="space-y-2 md:mb-4 lg:mb-4 mb-20">
                                          <label
                                            for="dactmi"
                                            class="block mb-2 text-md font-medium text-gray-800 "
                                          >
                                            Employment Benefits
                                          </label>
          
                                          <div class="mb-4">
                                            {businessPostedJobs.benefitsDescription ? (
                                              <p>
                                                {businessPostedJobs.benefitsDescription}
                                              </p>
                                            ) : (
                                              <p>Nothing listed</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
          
                                      {isDesktop ? (
                                        <div class="p-4 flex justify-between gap-x-2">
                                          <div class="w-full flex justify-end items-center gap-x-2">
                                            <button
                                              type="button"
                                              class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                              data-hs-overlay="#hs-pro-datm"
                                              onClick={() => onOpen()}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-4"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                />
                                              </svg>
                                              Save
                                            </button>
                                            <button
                                              type="button"
                                              class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                              data-hs-overlay="#hs-pro-datm"
                                              onClick={() => onOpen()}
                                            >
                                              Apply
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          id="cookies-simple-with-dismiss-button"
                                          class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-full mx-auto px-2"
                                        >
                                          <div class="p-2 bg-white border border-gray-200 rounded-sm shadow-sm ">
                                            <div class="p-2 flex justify-between gap-x-2">
                                              <div class="w-full flex justify-center items-center gap-x-2">
                                                <button
                                                  type="button"
                                                  class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                  data-hs-overlay="#hs-pro-datm"
                                                  onClick={() => onOpen()}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-4"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                    />
                                                  </svg>
                                                  Save
                                                </button>
                                                <button
                                                  type="button"
                                                  class="py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                                  data-hs-overlay="#hs-pro-datm"
                                                  onClick={() => onOpen()}
                                                >
                                                  Apply
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DrawerBody>
                            </DrawerContent>
                          </Drawer>
          
                          <Modal isOpen={isOpenShare} onClose={onCloseShare}>
                            <ModalContent>
                              <ModalCloseButton />
                              <ModalBody>
                                <div class="mt-5 bg-white rounded-xl ">
                                  <div class="p-4 sm:p-7 text-center align-center items-center justify-center">
                                    <div class="text-center align-center items-center justify-center mb-5">
                                      <h1 class="block text-2xl font-bold text-gray-800">
                                        Share to
                                      </h1>
                                    </div>
          
                                    <FacebookShareButton
                                      url={`https://getfulfil.com/DoerMapLoggedOut/?session_id=${businessPostedJobs.jobID}`}
                                    >
                                      <FacebookIcon size={32} round={true} />
                                    </FacebookShareButton>
                                    <h1 class="block text-2xl font-bold text-gray-800">
                                      Copy Link:
                                    </h1>
                                    {urlCopied ? (
                                      <span class=" h-[24px] ml-1 inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium bg-green-100 text-green-700 ">
                                        Copied!
                                      </span>
                                    ) : (
                                      <label
                                        onClick={() =>
                                          handleCopiedURL(businessPostedJobs)
                                        }
                                        className=" inline-flex items-center gap-x-1.5 py-0.5 px-3 rounded-lg text-xs font-medium mt-2 "
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-6 ml-1 items-center cursor-pointer"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                          />
                                        </svg>
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </>
                      ) : null}
                      </>
                  ))
                }
              </MarkerClustererF>
              )}
     
           
          
         
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(NewMapTest);
