// SkeletonLoader.js
import React from 'react'
import './SkeletonLoader.css'
import SkeletonTableLoader from './SkeletonTableLoader'

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-header">
        <div className="skeleton-title-block"></div>
        <div className="skeleton-subtitle-block"></div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-dropdown"></div>

        <SkeletonTableLoader />
        <div className="skeleton-pagination">
          <div className="links"></div>
          <div className="links"></div>
          <div className="links"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoader
