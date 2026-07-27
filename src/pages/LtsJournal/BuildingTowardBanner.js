import React from 'react'

function BuildingTowardBanner({ taskTitle }) {
  if (!taskTitle) return null

  return (
    <div className='lts-building-toward'>
      <span className='lts-building-toward-arrow'>↳</span>
      Building toward: {taskTitle}
    </div>
  )
}

export default BuildingTowardBanner
