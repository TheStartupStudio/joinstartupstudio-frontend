import React from 'react'
import BriefingsArchive from '../../components/Briefings'
import './style.css'


const Briefings = () => {
  return (
    <div className="container-fluid ">
    <div className="pt-4 ">
      <h2 className="fw-bold">MY NEWS BRIEFING ARCHIVE</h2>
      <p>
        Welcome to Your Dashboard
      </p>
    </div>
    <BriefingsArchive />
    </div>
  )
}

export default Briefings