import React from 'react'
import DoerHeader from '../components/DoerHeader'
import SearchBar from './SearchBar'
import JobCard from './JobCard'
import JobList from './JobList'
import SelectedJobFull from './SelectedJobFull'

const SearchJobs = () => {
  return (
    <div className=''>
            <DoerHeader />
            <div className=''>
            <SearchBar />
            </div>

            <div className='max-w-[85rem] w-full mx-auto flex h-screen px-4 sm:px-0 py-4'>
                <div className='w-1/3 p-2 h-screen'>
                   <JobList />
                </div>
                <div className=' w-2/3 p-2 h-screen'>
                   <SelectedJobFull />
                </div>

            </div>
        </div>
  )
}

export default SearchJobs