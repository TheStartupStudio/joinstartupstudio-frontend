import React from 'react'
import { beautifulDateFormat } from '../../../utils/helpers'
import imgTest from '../../../assets/images/performance.png'
import parse from 'html-react-parser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const InstructorNoteItem = ({
  subject,
  createdAt,
  noteText,
  onEdit,
  onDelete
}) => {
  return (
    <div className={`chat-message w-100 pb-2 mt-2`}>
      <div className="row profile__date">
        <div className="chat-user col-7 col-lg-4">
          <img src={imgTest} alt="profile" className="rounded-circle" />
          <div className="d-flex flex-column mx-2">
            <p>{subject}</p>
          </div>
        </div>
        <div className="status col-5 col-lg-8 d-flex">
          <p className="chat-date m-0">
            {beautifulDateFormat(createdAt, {
              format: 'EEEE',
              type: 'day'
            })}
          </p>

          <div
            style={{ display: 'flex', gap: 4, fontSize: '13px' }}
            className="ms-2"
          >
            <div
              className="edit-notification notification-button"
              onClick={(e) => {
                e.preventDefault()
                onEdit()
              }}
              style={{ cursor: 'pointer', color: '#707070' }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </div>
            <div
              className="delete-notification notification-button"
              onClick={(e) => {
                e.preventDefault()
                onDelete()
              }}
              style={{ cursor: 'pointer', color: '#ff3399' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
          </div>
        </div>
      </div>
      <div className="message-text mt-1 mt-lg-2">
        <p>{parse(noteText)}</p>
        <p>
          {beautifulDateFormat(createdAt, {
            format: 'hh:mm a',
            type: 'hours'
          })}
        </p>
      </div>
    </div>
  )
}

export default InstructorNoteItem
