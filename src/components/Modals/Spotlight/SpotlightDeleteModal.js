import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

import './styles.css'

const DeleteModal = ({
    onClose,
    onSubmit,
    title = 'Delete Item',
    message = 'Are you sure you want to delete this item?'
}) => {


    return (
        <>
            <div className='modal-container-delete'>
                <div className='immersion-modal-header'>
                    <div className='portfolio-actions'>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            onClick={onClose}
                            className='action-box-delete'
                            style={{
                                cursor: 'pointer',
                                fontSize: '20px',
                                width: '45px'
                            }}
                        />
                    </div>

                    <h5 style={{ marginTop: '10px' }}>{title}</h5>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        borderTop: '1px solid black'
                    }}
                    className='modal-body-delete'
                >
                    <p style={{ paddingTop: '25px' }}>{message}</p>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: 'none'
                    }}
                >
                    <button style={{ backgroundColor: '#e91e63' }} className='submit-confirm-button' onClick={onClose} >
                        Yes, Delete Application
                    </button>
                    <button
                        style={{ border: 'none' }}
                        className='cancel-button'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>

        </>
    )
}

export default DeleteModal
