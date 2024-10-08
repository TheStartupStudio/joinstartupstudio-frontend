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

const BriefingBox = ({ briefing, handleOpenBriefingModal, isAdmin, user }) => {
  const dispatch = useDispatch()
  const { id, title, date, isSelected } = briefing
  const [editModal, setEditModal] = useState(false)

  const updateSelectedBriefing = async (id) => {
    dispatch(updateSelectedBriefingStart(id))
    toast.success('Briefing is selected successfuly!')
  }

  return (
    <div className='skill-box'>
      {isAdmin && (
        <div className='briefing_edit-button '>
          <FontAwesomeIcon icon={faPen} onClick={() => setEditModal(true)} />
        </div>
      )}
      <h5>{truncateText(title)}</h5>
      <hr />
      <p style={{ color: '#707070' }}>
        Date:{' '}
        <span style={{ fontWeight: '600' }}>
          {moment(date).format('MMM. D, YYYY')}
        </span>
      </p>
      <div className='skill-actions d-flex justify-content-between align-items-center'>
        <p
          className='read-button'
          onClick={() => handleOpenBriefingModal(briefing)}
        >
          Read briefing...
        </p>
        {isAdmin && (
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
          mode='edit'
          user={user}
        />
      )}
    </div>
  )
}

export default BriefingBox
