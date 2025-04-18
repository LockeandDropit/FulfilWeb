import React, { useEffect, useState } from "react";
import DoerHeader from "../components/DoerHeader";
import SearchBar from "./SearchBar";
import JobCard from "./JobCard";
import JobList from "./JobList";
import SelectedJobFull from "./SelectedJobFull";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useListJobStore } from "./ListJobStore";

const SearchJobs = () => {
  // jobs pulled in here, fed to jobList
  // how to query a limited number at a time?

  const { listJob, setListJob } = useListJobStore();

  const [jobs, setJobs] = useState([]);

  // sql fetch
  const sqlFetch = async () => {
    const url = "http://localhost:8000/initialLoad";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log("initial load", json);


      const updatedJobs = [...jobs, ...json];

// Update state in one go:
setJobs(updatedJobs);
setListJob(updatedJobs);

      //  json.forEach(function(x){
      //   setJobs((prevState) => [...prevState, x])
      // })

      // setListJob(jobs)
   
      
    } catch (error) {
      console.error(error.message);
    }
  };


  useEffect(() => {
    // fetchJobs();
    sqlFetch();
  }, []);


  return (
    <div className="">
      <DoerHeader />
      <div className="">
        <SearchBar />
      </div>

      <div className="max-w-[85rem] w-full mx-auto flex h-screen px-4 sm:px-0 py-4">
        <div className="w-1/3 p-2 h-screen">
          <JobList jobs={listJob} />
          <div className="flex w-full py-5 items-center px-2 ">
            <button
              type="button"
              class=" py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
   
            >
              Load more
            </button>
          </div>
        </div>
        <div className=" w-2/3 p-2 h-screen">
          <SelectedJobFull />
        </div>
      </div>
    </div>
  );
};

export default SearchJobs;
