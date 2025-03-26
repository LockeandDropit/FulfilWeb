import React, { useEffect, useState } from "react";
import DoerHeader from "../components/DoerHeader";
import SearchBar from "./SearchBar";
import JobCard from "./JobCard";
import JobList from "./JobList";
import SelectedJobFull from "./SelectedJobFull";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const SearchJobs = () => {
  // jobs pulled in here, fed to jobList
  // how to query a limited number at a time?

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "scraped"));
    querySnapshot.docs.forEach((doc) => {
      setJobs((prevState) => [...prevState, doc.data()]);
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // local store for the selected job to be passed to the SelectedJob component

  // then add search functionallity

  return (
    <div className="">
      <DoerHeader />
      <div className="">
        <SearchBar />
      </div>

      <div className="max-w-[85rem] w-full mx-auto flex h-screen px-4 sm:px-0 py-4">
        <div className="w-1/3 p-2 h-screen">
          <JobList jobs={jobs} />
        </div>
        <div className=" w-2/3 p-2 h-screen">
          <SelectedJobFull />
        </div>
      </div>
    </div>
  );
};

export default SearchJobs;
