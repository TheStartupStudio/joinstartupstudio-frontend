import React from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { getIconComponent } from '../../../utils/helpers'

const OccupationBox = ({ iconIdentifier, name, color, id }) => {
  const navigate = useHistory()
  const navigateHandler = () => {
    navigate.push(`/pathways/${id}`)
  }

  return (
    <div
      className="occupation-box p-4 cursor-pointer"
      onClick={navigateHandler}
    >
      <div className="occupation-box_header d-flex align-items-center justify-content-between h-50">
        <p>{name}</p>
        <span>{getIconComponent(iconIdentifier, color)}</span>
      </div>

      <div className="occupation-box_footer d-flex align-items-end justify-content-between h-50 ">
        <p className="w-50 m-0">VIEW</p>
        <FontAwesomeIcon icon={faMountain} style={{ color: color }} />
      </div>
    </div>
  )
}

export default OccupationBox
