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

const NeederMapView = () => {
    const [trees, setTrees] = useState();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDesktop] = useMediaQuery("(min-width: 500px)");
    const [user, setUser] = useState(null);
    const [hasRun, setHasRun] = useState(false);
    const [sameLocationJobs, setSameLocationJobs] = useState(false)

  
  
    const { searchResults, searchIsMobile, setSearchIsMobile } =
      useSearchResults();
  
    // const { isLoading, jobs } = useJobFetch();


  
    const { isLoading, jobs, groupedJobs} = useNeederJobFetch()
  
    useEffect(() => {

        if (isLoading) {
          console.log(isLoading);
        } else {
          setTrees(jobs);
          setSameLocationJobs(groupedJobs)
          console.log("jobs from needer map", groupedJobs)
        }
   
    }, [jobs, groupedJobs]);
  
  
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
                {filteredTrees && <ClusteredMarkers trees={filteredTrees} sameLocationJobs={sameLocationJobs} />}</Map> </Box> </APIProvider>
              ) : (<p>nah</p>) }
            
    </>
  )
}

export default NeederMapView