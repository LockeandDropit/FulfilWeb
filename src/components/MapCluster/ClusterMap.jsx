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

// import './style.css';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

/**
 * The App component contains the APIProvider, Map and ControlPanel and handles
 * data-loading and filtering.
 */
const ClusterMap = ( props ) => {
  const [trees, setTrees] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // load data asynchronously
//   useEffect(() => {
//     if (props) {
//         setTrees(props.props)
//     }
   
//   }, [props]);
useEffect(() => {
    const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      let trees = []
      snapshot.docs.forEach((doc) => {
        //review what thiss does
        if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
          //ignore this job is for Needer map screen
        } else if (doc.data().isPostedByBusiness) {
          postedByBusiness.push({ ...doc.data(), key: doc.id });
        } else {
          results.push({ ...doc.data(), id: doc.id });
          console.log("this is from results",doc.data())
        }
      });

      setTrees(postedByBusiness)

    });
  }, []);

  


  // get category information for the filter-dropdown
//   const categories = useMemo(() => getCategories(trees), [trees]);
  const filteredTrees = useMemo(() => {
    if (!trees) return null;

    return trees.filter(
      t => !selectedCategory || t.category === selectedCategory
    );
  }, [trees, selectedCategory]);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultCenter={{lat: 44.96797106363888, lng: -93.26177106829272}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI>
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


