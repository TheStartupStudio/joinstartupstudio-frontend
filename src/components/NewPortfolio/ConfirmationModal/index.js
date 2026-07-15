// components/ConfirmationModal.js
import React from 'react'
import deleteIcon from '../../../assets/images/delete-icon.png'
import './index.css'

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
        boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '36px',
          maxWidth: '600px',
          width: '100%',
          height: '370px'
        }}
        className='confirm-modal-content'
      >
        <div>
          <div style={{ display: 'flex' }} className='title-div'>
            <div className='icon-wrapper'>
              <img
                src={deleteIcon}
                style={{ cursor: 'pointer' }}
                title={'instructor icon'}
                height={20}
                width={20}
                alt='instructor icon'
              />
            </div>
            <span className='cover-title'>{title}</span>
          </div>{' '}
          <p style={{ marginTop: '70px', textAlign: 'center' }}>{message}</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: '10px',
            marginTop: '70px'
          }}
        >
          <div
            onClick={onClose}
            style={{
              padding: '8px 16px',
              width: '220px',
              color: 'white',
              background: '#52C7D3',
              borderRadius: '10px',
              height: '50px',
              boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </div>
          <div
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '220px',
              background: 'white',
              color: '#F39',
              borderRadius: '10px',
              height: '50px',
              boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
