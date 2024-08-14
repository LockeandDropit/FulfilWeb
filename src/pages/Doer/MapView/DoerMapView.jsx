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

import {useUserStore} from "../Chat/lib/userStore.js"

const DoerMapView = () => {
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
          <Center>
            <Card
              align="center"
              mt={6}
              width={{ base: "full", md: "auto" }}
              ml={{ base: "0px", md: "80px" }}
            >
              <JobFilter />
            </Card>
          </Center>
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
            
                </Map> </Box> </APIProvider>
              ) : (<p>nah</p>) }
            
    </>
  )
}

export default DoerMapView