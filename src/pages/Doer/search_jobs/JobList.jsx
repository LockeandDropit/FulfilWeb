import React from 'react'
import JobCard from './JobCard'

const JobList = () => {
  return (
    <div className='h-full overflow-y-scroll scrollbar'>
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />

    </div>
  )
}

export default JobList