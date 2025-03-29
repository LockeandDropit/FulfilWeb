import { useState } from "react"
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
const SearchBar = () => {


const [keyword, setKeyword] = useState(null)


  const [jobs, setJobs] = useState([]);

  const jobsRef = query(collection(db, "scraped"), limit(10), where("job_title" , "==" , keyword || "job_title" , "==" , keyword));

  // const q = query(jobsRef, where("population", ">", 100000), orderBy("population"), limit(2));
  // const q = query(collection(db, "cities"), where("capital", "==", true));

  // const querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });

  const [lastVisible, setLastVisible] = useState(0);

  const fetchJobs = async () => {
    const querySnapshot = await getDocs(jobsRef);
    querySnapshot.forEach((doc) => {
      setJobs((prevState) => [...prevState, doc.data()]);
    });
    // Get the last visible document
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

    console.log("jobResults from search bar")
  };


  return (
    // max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8
<div className="max-w-[84rem] w-full mx-auto mt-8 py-6 flex gap-y-2 lg:gap-y-0 lg:gap-x-5 px-5  rounded-md bg-sky-100">
  <div className='w-1/3'>

    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
        <svg className="shrink-0 size-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input type="text" className="py-1.5 sm:py-3  px-3 ps-10 pe-8 block w-full bg-white  border-gray-200 xl:border-transparent rounded-lg sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none xl:" placeholder="Search by file name or keyword" />
     
    </div>
  
  </div>
  <select className="py-2 px-4  w-1/6 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
  <option selected="">Date Posted</option>
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>
<select className="py-3 px-4 pe-9 w-1/6 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
  <option selected="">Pay</option>
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>
<button onClick={() => fetchJobs()} type="button" class="ml-auto py-3 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
  Search
</button>
</div>

  )
}

export default SearchBar