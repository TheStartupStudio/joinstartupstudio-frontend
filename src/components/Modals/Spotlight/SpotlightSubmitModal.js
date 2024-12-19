import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SuccessModal from './SuccessModal';
import {
    faArrowLeft,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

import './styles.css'

const SubmitModal = ({
    onClose,
    onSubmit,
    title = 'Delete Item',
    message = 'Are you sure you want to delete this item?'
}) => {

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = () => {
        setShowSuccessModal(true);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false); // Close the success modal
        onClose(); // Close the current modal
    };
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
                    <button style={{ backgroundColor:  '#00bcd4' }} className='submit-confirm-button' onClick={handleSubmit}>
                        Yes, Submit Application
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


            {showSuccessModal && (
                <SuccessModal
                    show={handleSubmit}
                    onClose={handleSuccessClose}
                    title='Submit Application'
                    message='Are you sure you want to submit this application?'
                    onSubmit={() => {
                        handleSuccessClose();
                        handleSubmit();
                    }}
                />
            )}
        </>
    )
}

export default SubmitModal
