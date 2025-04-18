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
import Dropdown from "./components/Dropdown";
import { useListJobStore } from "./ListJobStore";
import { useUserStore } from "../Chat/lib/userStore";

const SearchBar = () => {

const { setListJob } = useListJobStore();

const { currentUser } = useUserStore();
const [keyword, setKeyword] = useState(null)
const [radius, setRadius] = useState(null)
const [minimumPay, setMinimumPay] = useState(null)



  const [jobs, setJobs] = useState([]);

  // sql fetch
  const sqlFetch = async () => {
    
    
    const url = `http://localhost:8000/search?job_category=${encodeURIComponent(keyword)}&minSalary=${encodeURIComponent(minimumPay)}&userId=${encodeURIComponent(currentUser.uid)}&radius=${encodeURIComponent(radius)}`;
    setListJob([])
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log("search", json)
      // json.forEach(x => setJobs((prevState) => [...prevState, x]))
      // const updatedJobs = [...jobs];

      //the spread operator is for loading (adding) more

      // Update state in one go:
      // setJobs(updatedJobs);
      setListJob([...json]);
   
    } catch (error) {
      console.error(error.message);
    }
  }

const loadMore = () => {

}



  return (
    // max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 pt-4 pb-2 px-4 sm:px-6 lg:px-8
<div className="max-w-[84rem] w-full mx-auto mt-8 py-6 flex gap-y-2 lg:gap-y-0 lg:gap-x-5 px-5  rounded-md shadow-sm bg-sky-100">
  <div className='w-1/3'>

    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
        <svg className="shrink-0 size-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input onChange={(e) => setKeyword(e.target.value)} type="text" className="py-1.5 sm:py-3  rounded-xl px-3 ps-10 pe-8 block w-full bg-white  border-gray-200 xl:border-transparent sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none xl:" placeholder="Search by file name or keyword" />
     
    </div>
  
  </div>
  {/* <Dropdown /> */}

<select onChange={(e) => setMinimumPay(e.target.value)} value={minimumPay} className="py-3 px-4 pe-9 w-1/6 border-none rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
  <option selected="">Salary</option>
  <option value={10000}>$10,000</option>
  <option value={20000}>$20,000</option>
  <option value={30000}>$30,000</option>
  <option value={40000}>$40,000</option>
  <option value={50000}>$50,000</option>
  <option value={60000}>$60,000</option>
  <option value={70000}>$70,000</option>
  <option value={80000}>$80,000</option>
  <option value={90000}>$90,000</option>
</select>
<select onChange={(e) => setRadius(e.target.value)} value={radius} className="py-3 px-4 pe-9 w-1/6 border-none rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
  <option selected="">Distance</option>
  <option value={10}>10 miles</option>
  <option value={25}>25 miles</option>
  <option value={50}>50 miles</option>
  <option value={100}>100 miles</option>

</select>
<button onClick={() => sqlFetch()} type="button" class="ml-auto py-3 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-400 text-white hover:bg-sky-500 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
  Search
</button>
</div>

  )
}

export default SearchBar