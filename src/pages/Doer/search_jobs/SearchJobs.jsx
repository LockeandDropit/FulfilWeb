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

const SearchJobs = () => {
  // jobs pulled in here, fed to jobList
  // how to query a limited number at a time?

  const [jobs, setJobs] = useState([]);

  const jobsRef = query(collection(db, "scraped"), limit(10));

  // const q = query(jobsRef, where("population", ">", 100000), orderBy("population"), limit(2));
  // const q = query(collection(db, "cities"), where("capital", "==", true));

  // const querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });

  const [lastVisible, setLastVisible] = useState(null);

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(jobsRef);
    querySnapshot.forEach((doc) => {
      setJobs((prevState) => [...prevState, doc.data()]);
    });
    // Get the last visible document
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  };

  const loadMoreJobs = async () => {
    console.log("last", lastVisible);

    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
      collection(db, "scraped"),
      startAfter(lastVisible),
      limit(10)
    );

    const querySnapshot = await getDocs(next);
    querySnapshot.forEach((doc) => {
      setJobs((prevState) => [...prevState, doc.data()]);
    });
    // Get the last visible document
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
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
          <div className="flex w-full py-5 items-center px-2 ">
            <button
              type="button"
              class=" py-2 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  bg-sky-400 text-white shadow-sm hover:bg-sky-500 "
              onClick={() => loadMoreJobs()}
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
