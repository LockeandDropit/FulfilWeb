
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
    const [isLoading, setIsLoading] = useState(true)
    const [ jobs, setJobs] = useState(null)

    useEffect(() => {
        try {
            const q = query(collection(db, "Map Jobs"));

            onSnapshot(q, (snapshot) => {
              let results = [];
              let postedByBusiness = [];

              snapshot.docs.forEach((doc) => {
                if (doc.id === "0a9fb80c-8dc5-4ec0-9316-7335f7fc0058") {
                  //ignore this job is for Needer map screen
                } else if (doc.data().isPostedByBusiness) {
                  postedByBusiness.push({ ...doc.data(), id: doc.id, key: doc.id  });
                } 
              });
        
            setIsLoading(false)
            setJobs(postedByBusiness)     
        })  
        } catch (error) {
            console.log(error)
        }
    }, [])

    return {  isLoading ,jobs }

}