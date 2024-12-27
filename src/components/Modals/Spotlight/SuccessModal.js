import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import './styles.css'

const SuccessModal = ({ onClose }) => {
  return (
    <div className='modal-container-delete'>
      <div className='immersion-modal-header'>
        <FontAwesomeIcon
          icon={faCheckCircle}
          style={{
            fontSize: '40px',
            color: '#4CAF50',
            marginBottom: '10px'
          }}
        />
        <h2 style={{ margin: '10px 0', fontWeight: 'bold' }}>Success!</h2>
      </div>
      <div className='modal-body-delete' style={{ textAlign: 'center' }}>
        <p style={{ padding: '25px 0' }}>
          Your application has been submitted!
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        <button
          className='submit-confirm-button'
          style={{
            backgroundColor: '#00C8E8', // Blue button
            color: '#fff',
            borderRadius: '25px',
            fontSize: '16px',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
