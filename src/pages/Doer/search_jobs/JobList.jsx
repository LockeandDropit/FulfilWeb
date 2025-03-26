import React from 'react'
import JobCard from './JobCard'

const JobList = ({jobs}) => {

  
  console.log("job list", jobs)
  return (
    <div className='h-full overflow-y-scroll scrollbar'>
        <JobCard jobs={jobs}/>
      

    </div>
  )
}

export default JobList