import React from 'react'
import { updateSelectedBriefingStart } from '../../redux/header/Actions'
import { truncateText } from '../../utils/helpers'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const BriefingBox = ({ briefing, handleOpenBriefingModal }) => {
  const dispatch = useDispatch()
  const { id, title, date, isSelected } = briefing
  const { isSuperAdmin } = useSelector((state) => state.user.user)

  const updateSelectedBriefing = async (id) => {
    dispatch(updateSelectedBriefingStart(id))
    toast.success('Briefing is selected successfuly!')
  }

  return (
    <div className="skill-box">
      <h5>{truncateText(title, 50)}</h5>
      <hr />
      <p>
        Date: <strong>{moment(date).format('MMM. D, YYYY')}</strong>
      </p>
      <div className="skill-actions d-flex justify-content-between align-items-center">
        <p
          className="read-button"
          onClick={() => handleOpenBriefingModal(briefing)}
        >
          Read briefing...
        </p>
        {isSuperAdmin && (
          <p
            className={`text-danger cursor-pointer ${
              isSelected ? 'disabled' : ''
            }`}
            onClick={() => updateSelectedBriefing(id)}
          >
            {isSelected ? 'Selected' : 'Select'}
          </p>
        )}
      </div>
    </div>
  )
}

export default BriefingBox
