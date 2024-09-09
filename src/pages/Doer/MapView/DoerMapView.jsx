import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header.jsx";
import Dashboard from "../components/Dashboard.jsx";
import { Box } from "@chakra-ui/react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { ClusteredMarkers } from "./ClusteredMarkers.jsx";
import { ClusteredTreeMarkers } from "../../../components/MapCluster/clustered-tree-markers.jsx"
import JobFilter from "../components/JobFilter.jsx";
import { Center, Card } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { useSearchResults } from "../Chat/lib/searchResults.js";
import useJobFetch from "../../../hooks/useJobFetch.js";
import useDoerJobFetch from "../../../hooks/useDoerJobFetch copy.js";
import { auth } from "../../../firebaseConfig.js";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {useUserStore} from "../Chat/lib/userStore.js"

const DoerMapView = () => {
    const [trees, setTrees] = useState();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDesktop] = useMediaQuery("(min-width: 500px)");


    const navigate = useNavigate();

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
  
    const { isLoading, jobs, groupedJobs} = useDoerJobFetch()
  
    useEffect(() => {
        if (isLoading && !currentUser) {
          console.log(isLoading);
        } else {
          if (searchResults === null) {
          setTrees(jobs);
          if (!groupedJobs || groupedJobs.length === 0) {
            setSameLocationJobs(null)
          } else {
            setSameLocationJobs(groupedJobs)
          }
          console.log("jobs from needer map", groupedJobs)
        } else {
          setTrees(searchResults);
        }
        }
    }, [jobs, groupedJobs, currentUser, searchResults]);
  
  
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
                    {isDesktop ? (
          // <Center>
          //   <Card
          //     align="center"
          //     mt={6}
          //     width={{ base: "full", md: "auto" }}
          //     ml={{ xl: "160px" }}

          //   >
          //     <JobFilter />
          //   </Card>
          // </Center>
          <Card
                      align={"left"}
          mt={4}
          width={{ base: "full", md: "full" }}
          ml={{ lg: "240px" }}

        >
          <JobFilter />
        </Card>
        ) : (
          <Center>
            <Card align="center" width={{ base: "100vw" }}>
              <div className="w-3/4 mt-4 mb-2">
                <JobFilter />
              </div>
            </Card>
          </Center>
        )}
                <div className="ml -auto h-96 w-52 bg-white z-50">
               
              </div>
                {filteredTrees && <ClusteredMarkers user={user} trees={filteredTrees} sameLocationJobs={sameLocationJobs} />}
            
                </Map> </Box> 
                <div id="cookies-simple-with-dismiss-button" class="fixed bottom-0 start-1/2 transform -translate-x-1/2 z-[60] sm:max-w-4xl w-auto mx-auto px-2">
                                         <div class="p-2 bg-transparent rounded-sm shadow-sm ">
                                        <div class="p-2 flex justify-between gap-x-2">
                                      <div class="w-full flex justify-center items-center gap-x-2">
                                        <button
                                          type="button"
                                          class="border shadow-sm border-slate-800 py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800 text-sm font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                                          data-hs-overlay="#hs-pro-datm"
                                          onClick={() => navigate("/DoerListView")}
                                        >
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>


                                         List View
                                        </button>
                                      
                                      </div>
                                    </div>
                                    </div>
                                    </div></APIProvider>
              ) : (<p>nah</p>) }
            
    </>
  )
}

export default DoerMapView