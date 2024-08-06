import React, { useEffect, useState, useMemo } from "react";
import Header from '../Components/Header'
import Dashboard from '../Components/Dashboard'
import { Box } from "@chakra-ui/react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { ClusteredMarkers } from "./ClusteredMarkers.jsx";
import { ClusteredTreeMarkers } from "../../../components/MapCluster/clustered-tree-markers.jsx"
import JobFilter from "../../../pages/Doer/components/JobFilter.jsx";
import { Center, Card } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { useSearchResults } from "../../../pages/Doer/Chat/lib/searchResults";
import useJobFetch from "../../../hooks/useJobFetch.js";
import useNeederJobFetch from "../../../hooks/useNeederJobFetch.js";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import AddJobBusiness from "../Components/AddJobBusiness.jsx";
import {useUserStore} from "../Chat/lib/userStore"

const NeederMapView = () => {
    const [trees, setTrees] = useState();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDesktop] = useMediaQuery("(min-width: 500px)");

    const [sameLocationJobs, setSameLocationJobs] = useState(false)

const [user, setUser] = useState(null);
const [hasRun, setHasRun] = useState(false);

 const {fetchUserInfo, currentUser} = useUserStore()

  useEffect(() => {
    if (hasRun === false) {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        console.log(currentUser.uid);
        fetchUserInfo(currentUser.uid)
      });
      setHasRun(true);
    } else {
    }
  }, []);
  
    const { searchResults, searchIsMobile, setSearchIsMobile } =
      useSearchResults();
  
    // const { isLoading, jobs } = useJobFetch();

  const [showAddJobBusiness, setShowAddJobBusiness] = useState(false)
  
    const { isLoading, jobs, groupedJobs} = useNeederJobFetch()
  
    useEffect(() => {

        if (isLoading && !currentUser) {
          console.log(isLoading);
        } else {
          setTrees(jobs);
          setSameLocationJobs(groupedJobs)
          console.log("jobs from needer map", groupedJobs)
        }
   
    }, [jobs, groupedJobs, currentUser]);
  
  
    //Christian, this is the function that returns data from the API you built. 
    //Not currently called anywhere
    async function getDataFromPythonAPI() {
      const url = "http://localhost:8080/http://localhost:8000/api/jobs/";
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
      } catch (error) {
        console.error(error.message);
      }
    }
  
  
  //source: see below citation
    const filteredTrees = useMemo(() => {
      if (!trees) return null;
  
      return trees.filter(
        (t) => !selectedCategory || t.category === selectedCategory
      );
    }, [trees, selectedCategory]);



    const defaultLat = 44.96797106363888;
    const defaultLong = -93.26177106829272;
  return (
    <>
        <Header />
        <Dashboard />
        {process.env.REACT_APP_GOOGLE_API_KEY ? (
          <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <Box
              h={{ base: "100vh", lg: "96vh" }}
              w={{ base: "100vw", lg: "100vw" }}
              mt={10}
            >
            <Map
                // center={{ lat: selectedLat ? selectedLat : defaultLat, lng: selectedLng ? selectedLng : defaultLong }}
                defaultCenter={{
                  lat:  defaultLat,
                  lng: defaultLong,
                }}
                defaultZoom={12}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                //move to env
                mapId="6cc03a62d60ca935"
                // onClick={() => setOpenInfoWindowMarkerID(null)}
              >
                 {/* <Center>
            <Card
              align="center"
              mt={8}
              mr={2}
              width={{ base: "full", md: "auto" }}
              ml={{ base: "0px", md: "80px", lg: "auto"}}
            >
       <a
                class="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowAddJobBusiness(!showAddJobBusiness)}
              >
                <svg
                  class="hidden sm:block flex-shrink-0 size-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 1C8.55228 1 9 1.44772 9 2V7L14 7C14.5523 7 15 7.44771 15 8C15 8.55228 14.5523 9 14 9L9 9V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V9.00001L2 9.00001C1.44772 9.00001 1 8.5523 1 8.00001C0.999999 7.44773 1.44771 7.00001 2 7.00001L7 7.00001V2C7 1.44772 7.44772 1 8 1Z"
                  />
                </svg>
                Create Job Listing
              </a>
            </Card>
          </Center> */}
                <div className="ml -auto h-96 w-52 bg-white z-50">
               
              </div>
                {filteredTrees && <ClusteredMarkers trees={filteredTrees} sameLocationJobs={sameLocationJobs} />}
                {showAddJobBusiness ? <AddJobBusiness /> : null}
                </Map> </Box> </APIProvider>
              ) : (<p>nah</p>) }
            
    </>
  )
}

export default NeederMapView