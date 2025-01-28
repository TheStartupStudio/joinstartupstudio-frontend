import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './styles.css'
import { LtsButton } from '../../../ui/ContentItems'
import trashIcon from '../../../assets/images/trashIcon.svg'
import LeftArrowSaveICon from '../../../assets/images/arrowSave/ICON - Click to save@2x.png'

const DeleteModal = ({
  onClose,
  onDelete,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?'
}) => {
  const submitHandler = () => {
    onDelete()
    onClose()
  }

  return (
    <>
      <div className='modal-container-delete delete-spotlight-modal-cont'>
        <div
          className='immersion-modal-header '
          style={{ textAlign: 'left', alignItems: 'unset' }}
        >
          <div className='portfolio-actions'>
            {/* <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={onClose}
              className='action-box-delete'
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                width: '45px'
              }}
            />{' '} */}
            <img src={LeftArrowSaveICon} width={30} height={33}></img>
          </div>
          <div
            style={{
              textAlign: 'left'
            }}
          >
            <div className='trash-icon-delete'>
              <img src={trashIcon} width={16} height={18}></img>
            </div>

            <h5 style={{ marginTop: '15px' }} className='delete-modal-title'>
              {title}
            </h5>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            borderTop: '1px solid #D7D9D9',
            marginBottom: 'none'
          }}
          className='modal-body-delete body-delete-spot'
        >
          <p style={{ paddingTop: '25px' }} className='body-delete-message'>
            {message}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 'none'
          }}
        >
          <LtsButton
            className={'delete-btns pink-delete-btn'}
            text={'Yes, Delete Application'}
            background={'#EE3C96'}
            color={'#FFF'}
            border={'1px solid #ccc'}
            onClick={submitHandler}
          />
          <button
            style={{ border: 'none' }}
            className='cancel-button cancel-spot-btn'
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
