import React, {useEffect, useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import { loadTreeDataset } from './trees.jsx';
// import { loadTreeDataset, Tree, trees} from './trees';
import {ClusteredTreeMarkers} from './clustered-tree-markers';
import {
    doc,
    getDoc,
    collectionGroup,
  
    query,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { auth, db } from "../../firebaseConfig.js";
  import JobFilter from "../../pages/Doer/components/JobFilter.jsx"
  import { Center, Card } from "@chakra-ui/react";
  import { useMediaQuery } from "@chakra-ui/react";
  import { useSearchResults } from "../../pages/Doer/Chat/lib/searchResults"
// import './style.css';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

/**
 * The App component contains the APIProvider, Map and ControlPanel and handles
 * data-loading and filtering.
 */
const ClusterMap = ( props ) => {
  const [trees, setTrees] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDesktop] = useMediaQuery("(min-width: 500px)");

  // load data asynchronously
//   useEffect(() => {
//     if (props) {
//         setTrees(props.props)
//     }
   
//   }, [props]);

const { searchResults, searchIsMobile, setSearchIsMobile } = useSearchResults()

useEffect(() => {
    if (searchResults === null) {
 //normal render
renderAllJobs()
 //initial render with all f(x)
    } else if (searchResults !== null && searchResults[0].isFullTimePosition === "gigwork" ) {
        setTrees(searchResults)
        // setBusinessPostedJobs(null)

    }
    else {
     setTrees(searchResults)
    
     console.log("search results map screen",searchResults)
    }
  }, [searchResults])


  const renderAllJobs = () => {
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
          //ignore this job is for Needer map screen
        } else if (doc.data().isPostedByBusiness) {
          postedByBusiness.push({ ...doc.data(), id: doc.id, key: doc.id  });
        } else {
          results.push({ ...doc.data(), id: doc.id });
          console.log("this is from results",doc.data())
        }
      });


      setTrees(postedByBusiness);
    });
  }
// useEffect(() => {
//     const q = query(collection(db, "Map Jobs"));

//     onSnapshot(q, (snapshot) => {
//       let results = [];
//       let postedByBusiness = [];
//       let trees = []
//       snapshot.docs.forEach((doc) => {
     
//         if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
        
//         } else if (doc.data().isPostedByBusiness) {
//           postedByBusiness.push({ ...doc.data(), key: doc.id });
//         } else {
//           results.push({ ...doc.data(), id: doc.id });
//           console.log("this is from results",doc.data())
//         }
//       });

//       setTrees(postedByBusiness)

//     });
//   }, []);

  


  // get category information for the filter-dropdown
//   const categories = useMemo(() => getCategories(trees), [trees]);
  const filteredTrees = useMemo(() => {
    if (!trees) return null;

    return trees.filter(
      t => !selectedCategory || t.category === selectedCategory
    );
  }, [trees, selectedCategory]);


  //almost all code regarding implementing clustering in this library is from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultCenter={{lat: 44.96797106363888, lng: -93.26177106829272}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI>
               {isDesktop ? (  <Center >
                  
                  <Card
                    align="center"
                    mt={2}
                    width={{ base: "full", md: "auto" }}
                    
                 
                 
                    ml={{ base: "0px", md: "80px" }}
                  >
                      <JobFilter />
                    
                  </Card>
                </Center>) : (<Center>
                  
                  <Card
                    align="center"
                
                 
                    
                 width={{base: "100vw"}}
                 
                  >
                    <div className="w-3/4 mt-4 mb-2">
               
          {/* <Menu closeOnSelect={true}>
  <MenuButton width={{base: "100%"}}>
  <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

            Search
          </a>

  </MenuButton>
  <MenuList  width={{base: "100vw"}}>
<JobFilter />
  </MenuList>
</Menu> */}
<JobFilter /> 
          </div>
                  </Card>
                </Center>)}
        {filteredTrees && <ClusteredTreeMarkers trees={filteredTrees} />}
      </Map>

      {/* <ControlPanel
        categories={categories}
        onCategoryChange={setSelectedCategory}
      /> */}
    </APIProvider>
  );
};

export default ClusterMap;


