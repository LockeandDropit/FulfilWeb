// Data source: https://open.toronto.ca/dataset/street-tree-data/
import {
  doc,
  getDoc,
  collectionGroup,

  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig.js";
import { useState } from "react";




// for (let i = 0; i < trees.length; i++) {
//   (trees[i]).key = `tree-${i}`;
// }

/**
 * Simulates async loading of the dataset from an external source.
 * (data is inlined for simplicity in our build process)
 */




export async function loadTreeDataset()  {

  // simulate loading the trees from an external source
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
        trees.push({ ...doc.data(), key: doc.id });
      } else {
        results.push({ ...doc.data(), id: doc.id });
        console.log("this is from results",doc.data())
      }
    });

    // setPostedJobs(results);

    
 
    // return new Promise(resolve => {
    //   setTimeout(() => resolve(trees), 1000);
    // });

    return ( console.log("trees", trees) )

  
  });

 
}

// export function getCategories(trees?)  {
//   if (!trees) return [];

//   const countByCategory: {c} = {};
//   for (const t of trees) {
//     if (!countByCategory[t.category]) countByCategory[t.category] = 0;
//     countByCategory[t.category]++;
//   }

//   return Object.entries(countByCategory).map(([key, value]) => {
//     const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//     return {
//       key: key,
//       label,
//       count: value
//     };
//   });
// }

export default loadTreeDataset ;
