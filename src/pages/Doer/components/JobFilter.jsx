import React from 'react'
import { useState, useEffect } from "react";
import {
    doc,
    getDoc,
    collectionGroup,
    getDocs,
    query,
    collection,
    onSnapshot,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
  } from "firebase/firestore";
  import { db } from "../../../firebaseConfig";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";

const JobFilter = () => {
    const [user, setUser] = useState(null);
    const [hasRun, setHasRun] = useState(false);
  
    useEffect(() => {
      if (hasRun === false) {
        onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        setHasRun(true);
      } else {
      }
    }, []);


    const [jobTitle, setJobTitle] = useState(null)
    const [minimumPay, setMinimumPay] = useState(null)
    const [positionType, setPositionType] = useState(null)


    const search = () => {
        const q = query(collection(db, "Map Jobs"));

    onSnapshot(q, (snapshot) => {
      let results = [];
      let postedByBusiness = [];
      snapshot.docs.forEach((doc) => {

        //if a b c we are not solving for salary right now

        if (jobTitle && !minimumPay && !positionType) {
            if (doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase())) {
                console.log("heres your match", doc.data())
                  } 
        }
        else if (jobTitle && minimumPay && !positionType) {
            console.log("job and minimum")
            if (doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase()) && doc.data().lowerRate >= minimumPay) {
                console.log("heres your match with pay", doc.data())
                  } 
        }
        else if (jobTitle && minimumPay && positionType) {
            console.log("job, minimum, type")
            if (doc.data().lowerCaseJobTitle.includes(jobTitle.toLowerCase()) && doc.data().lowerRate >= minimumPay && doc.data().isFullTimePosition === positionType) {
                console.log("heres your match with pay", doc.data())
                  } 
        }




      
       
      });




    })
}
    //map through all jobs based on valid inputs


    //Job title takes input, puts it all to lower case, checks it against all jobs lowercase title, seeing if it contains the input. does x contain y





  return (
    <div class="w-5/6 bg-white  px-4 sm:px-6 lg:px-8  mx-auto ">
    <div class="text-center mx-auto mb-4 mt-4">
     
  
      <form>
        <div class=" flex flex-col items-center gap-2 sm:flex-row sm:gap-3 mt-2">
          <div class="max-w-[560px] min-w-[480px]">
          <label for="hs-select-label" class="block text-sm font-medium ">Job Title</label>
            <input onChange={e => setJobTitle(e.target.value)} type="text" id="hero-input" name="hero-input" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="Ex: Landscaping, Hostess, Construction" />
          </div>
          <div className=" w-[560px]">
          <label for="hs-select-label" class="block text-sm font-medium  ">Pay Type</label>
<select id="hs-select-label" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
  <option selected="">Hourly</option>
  <option>Salary</option>
 
</select>
</div>
<div className=" w-[560px]">
          <label for="hs-select-label" class="block text-sm font-medium  ">Pay Range</label>
<select  onChange={(e) => setMinimumPay(e.target.value)} id="hs-select-label" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
  <option selected="10">$10/hour +</option>
  <option selected="15">$15/hour +</option>
  <option selected="20">$20/hour +</option>
  <option selected="25">$25/hour +</option>
  <option selected="30">$30/hour +</option>
  <option selected="35">$35/hour +</option>
  <option selected="40">$40/hour +</option>
</select>
</div>
<div className=" w-[560px]">
          <label for="hs-select-label" class="block text-sm font-medium  ">Position Type</label>
<select id="hs-select-label" class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ">
  <option selected="true">Full-time</option>
  <option selected="false">Part-time</option>
 
</select>
</div>

          <a class="w-full sm:w-auto whitespace-nowrap py-3 px-4 md:mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => search()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

            Search
          </a>
        </div>
 
      </form>
    </div>
  </div>
  )
}

export default JobFilter