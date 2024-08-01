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
import { useUserStore } from "../pages/Needer/Chat/lib/userStore.js";

export default function useNeederJobFetch() {

  const {fetchUserInfo, currentUser} = useUserStore()

  console.log("from neederjobFetch", currentUser.uid)
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "employers", currentUser.uid, "Posted Jobs"));

      onSnapshot(q, (snapshot) => {
        let results = [];
        let postedByBusiness = [];

        snapshot.docs.forEach((doc) => {
         
            postedByBusiness.push({ ...doc.data(), id: doc.id, key: doc.id });
          
        });

        setIsLoading(false);
        let finalfiltered = [];

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
            finalfiltered.push({
              ...postedJobs,

              locationLat: lat - offset * 0.0001,
              locationLng: lng - offset * 0.0001,
            });

            console.log("second encounter hash", finalfiltered);
          } else {
            // If it hasn't been encountered before, mark it as seen in the hash table with an offset of 1
            hash[latLng] = 1;
            // Return the original location if it's the first time encountering this combination

            finalfiltered.push({ ...postedJobs });
          }
        });
        setJobs(postedByBusiness);
        return processedLocations;
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { isLoading, jobs };
}
