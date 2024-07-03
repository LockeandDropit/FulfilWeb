// Data source: https://open.toronto.ca/dataset/street-tree-data/
import { useSearchResults } from "../../pages/Doer/Chat/lib/searchResults"
import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  getDoc,
  collectionGroup,

  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";


let postedByBusiness = []
let postedJob = []

export type PostedJob = {
  key: string;
  name: string;
  category: string;
  position: google.maps.LatLngLiteral;
  locationLat: number;
  locationLng: number;
};

export type CategoryData = {
  key: string;
  label: string;
  count: number;
};

// for (let i = 0; i < postedJobs.length; i++) {
//   (postedJobs[i] as PostedJob).key = `tree-${i}`;
// }

/** 
 * Simulates async loading of the dataset from an external source.
 * (data is inlined for simplicity in our build process)
 */





export async function getJobsData(): Promise<PostedJob[]> {
   console.log("am i running?")
  
  const q = query(collection(db, "Map Jobs"));
  
  let results = [{}];
    let postedByBusiness = [{}];
  onSnapshot(q, (snapshot) => {
  
    snapshot.docs.forEach((doc) => {
      //review what thiss does
      if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
        //ignore this job is for Needer map screen
      } else if (doc.data().isPostedByBusiness) {
        postedByBusiness.push({ ...doc.data(), id: doc.id });
      } else {
        results.push({ ...doc.data(), id: doc.id });
        console.log("this is from results",doc.data())
      }
      
    });

 
    // setPostedJobs(results);
    // setBusinessPostedJobs(postedByBusiness);
  });
  // simulate loading the trees from an external source
  return new Promise(resolve => {
    console.log("posted", postedByBusiness)
    setTimeout(() => resolve(postedByBusiness as PostedJob[]), 1000);
  });
    
 
}



export function getCategories(trees?: PostedJob[]): CategoryData[] {
  if (!trees) return [];

  const countByCategory: {[c: string]: number} = {};
  for (const t of trees) {
    if (!countByCategory[t.category]) countByCategory[t.category] = 0;
    countByCategory[t.category]++;
  }

  return Object.entries(countByCategory).map(([key, value]) => {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      key: key,
      label,
      count: value
    };
  });
}

export default postedJob as PostedJob[];