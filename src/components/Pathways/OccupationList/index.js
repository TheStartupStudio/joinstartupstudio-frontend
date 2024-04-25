import React from 'react'
import OccupationBox from './OccupationBox'

const OccupationList = ({ pathways }) => {
  return (
    <div className="occupation-list">
      {pathways.occupationGroups.map((occupation) => (
        <OccupationBox
          key={occupation.id}
          iconIdentifier={occupation.icon}
          color={occupation.color}
          name={occupation.name}
          id={occupation.id}
        />
      ))}
    </div>
  )
}

export default OccupationList
