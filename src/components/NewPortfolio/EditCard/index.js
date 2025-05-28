import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import { Button, Modal, ModalBody } from 'reactstrap'
import deleteIcon from '../../../assets/images/delete-icon.png'
const EditCard = ({
  children,
  icon,
  title,
  handleSubmit,
  toggle,
  loading,
  onDelete,
  deleteText
}) => {
  return (
    <div style={{ display: 'block' }} className='modal'>
      <div className='modal-dialog'>
        <div style={{ background: 'white' }} className='modal-content'>
          <div className='modal-body'>
            <div>
              <div style={{ display: 'flex' }} className='title-div'>
                <div className='icon-wrapper'>
                  <img
                    src={icon}
                    style={{ cursor: 'pointer' }}
                    title={'instructor icon'}
                    height={20}
                    width={20}
                    alt='instructor icon'
                  />
                </div>
                <span className='cover-title'>{title}</span>
              </div>{' '}
            </div>
            <div>{children}</div>
            <div
              style={{
                display: 'flex',
                justifyContent: onDelete ? 'space-between' : 'end',
                marginTop: '15px',
                alignItems: 'center'
              }}
              className=''
            >
              <div>
                {onDelete && (
                  <div style={{ display: 'flex' }} onClick={onDelete}>
                    <img width={20} height={20} src={deleteIcon} />
                    <div>Delete {deleteText}</div>
                  </div>
                )}{' '}
              </div>

              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
                className=''
              >
                <button className='close-btn w-full-900' onClick={toggle}>
                  CANCEL
                </button>
                <button
                  className='modal-save-btn w-full-900'
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ marginLeft: '15px' }}
                >
                  {loading ? '...' : 'SAVE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCard
