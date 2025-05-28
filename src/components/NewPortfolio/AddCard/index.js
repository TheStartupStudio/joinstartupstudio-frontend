import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import { Button, Modal, ModalBody } from 'reactstrap'
const AddCard = ({ children, icon, title, handleSubmit, toggle, loading }) => {
  return (
    <div style={{ display: 'block', top: '20%' }} className='modal'>
      <div className='modal-dialog'>
        <div className='modal-content'>
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
                justifyContent: 'end',
                marginTop: '15px'
              }}
              className=''
            >
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

export default AddCard
