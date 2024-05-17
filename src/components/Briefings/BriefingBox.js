import React, { useState } from 'react'
import { updateSelectedBriefingStart } from '../../redux/header/Actions'
import { truncateText } from '../../utils/helpers'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import './style.css'
import BriefingEditor from './BriefingEditor'

const BriefingBox = ({
  briefing,
  handleOpenBriefingModal,
  isSuperAdmin,
  user
}) => {
  const dispatch = useDispatch()
  const { id, title, date, isSelected } = briefing
  const [editModal, setEditModal] = useState(false)

  const updateSelectedBriefing = async (id) => {
    dispatch(updateSelectedBriefingStart(id))
    toast.success('Briefing is selected successfuly!')
  }

  return (
    <div className="skill-box">
      <div className="briefing_edit-button ">
        <FontAwesomeIcon icon={faPen} onClick={() => setEditModal(true)} />
      </div>
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
      {editModal && (
        <BriefingEditor
          show={editModal}
          onHide={() => setEditModal(false)}
          briefing={briefing}
          mode="edit"
          user={user}
        />
      )}
    </div>
  )
}

export default BriefingBox
