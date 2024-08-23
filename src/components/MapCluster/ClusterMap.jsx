import React, { useEffect, useState, useMemo } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredTreeMarkers } from "./clustered-tree-markers";
import JobFilter from "../../pages/Doer/components/JobFilter.jsx";
import { Center, Card } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { useSearchResults } from "../../pages/Doer/Chat/lib/searchResults";
import useJobFetch from "../../hooks/useJobFetch.js";


const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

/**
 * This component contains the Map & the API provider
 */
const ClusterMap = (props) => {
  const [trees, setTrees] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDesktop] = useMediaQuery("(min-width: 500px)");
  const [sameLocationJobs, setSameLocationJobs] = useState(false)

  const { searchResults, searchIsMobile, setSearchIsMobile } =
    useSearchResults();

  const { isLoading, jobs, groupedJobs } = useJobFetch();
  useEffect(() => {
    if (isLoading ) {
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
      // setSameLocationJobs([])
    }
    }
}, [jobs, groupedJobs, searchResults]);


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


  useEffect(() => {
  document.addEventListener('keydown', handleKeyDown, true);
}, [])

const handleKeyDown = (e) => {
  console.log("hit enter")
if (e.key === "Enter") {
  e.preventDefault();
}
};



  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={"bf51a910020fa25a"}
        defaultCenter={{ lat: 44.96797106363888, lng: -93.26177106829272 }}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        {isDesktop ? (
          <Center>
            <Card
              align="center"
              mt={2}
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
        {filteredTrees && <ClusteredTreeMarkers trees={filteredTrees} sameLocationJobs={sameLocationJobs}/>}
      </Map>
    </APIProvider>
  );
};

export default ClusterMap;
