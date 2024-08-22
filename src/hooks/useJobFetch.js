import {
  doc,
  getDoc,
  collectionGroup,
  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";
import { useState, useEffect } from "react";

export default function useJobFetch() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState(null);
  const [groupedJobs, setGroupedJobs] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "Map Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        let postedByBusiness = [];

        snapshot.docs.forEach((doc) => {
          if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
            //ignore this job is for Needer map screen
          } else if (doc.data().isPostedByBusiness && doc.data().isActive === true) {
            postedByBusiness.push({ ...doc.data(), id: doc.id, key: doc.id });
          }
        });

        setIsLoading(false);
        let groupFiltered = [];
        let individualFiltered = []

        //huge shout out to junaid7898 https://github.com/react-native-maps/react-native-maps/issues/350
        const hash = Object.create(null);
        const processedLocations = postedByBusiness.map((postedJobs) => {
          const { locationLat: lat, locationLng: lng } = postedJobs;
          // console.log(lat, lng)
          const latLng = `${lat}_${lng}`;
          // Check if this combination of latitude and longitude has been encountered before
          if (hash[latLng]) {
            // If it has, increment the offset based on the number of occurrences
            const offset = hash[latLng];
            hash[latLng] += 1;
            groupFiltered.push({
              ...postedJobs,

             
            });


          } else {
            // If it hasn't been encountered before, mark it as seen in the hash table with an offset of 1
            hash[latLng] = 1;
            // // Return the original location if it's the first time encountering this combination

            individualFiltered.push({ ...postedJobs });
          }
        });

     
    
        setJobs(postedByBusiness);
        setGroupedJobs(groupFiltered)

        //if individual filtered matched latlng of any grouped filter, remove from individual and add to grouped.
        return processedLocations;
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { isLoading, jobs, groupedJobs };
}
