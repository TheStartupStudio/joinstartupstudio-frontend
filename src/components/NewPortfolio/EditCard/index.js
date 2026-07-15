import React, { useRef, useEffect } from 'react'
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
  deleteText,
  handleContinue,
  continueAdding,
  addingModal,
  modalDialogClassName
}) => {
  const modalContentRef = useRef(null)

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [continueAdding])

  const handleContinueClick = () => {
    handleContinue?.()
  }

  return (
    <div
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: 'rgba(0, 0, 0, 0.16) 1px 1px 5px 1px'
      }}
      className='modal'
    >
      <div
        style={{
          margin: '0',
          maxWidth: '1000px',
          width: '100%',
          margin: '10px',
          maxHeight: '90%',
          overflowY: 'auto', // Enables vertical scroll
          backgroundColor: 'white',
          borderRadius: '15px'
        }}
        className={`modal-dialog ${modalDialogClassName}`}
        ref={modalContentRef}
        key={title + continueAdding}
      >
        <div
          style={{
            boxShadow: 'none',
            background: 'white',
            overflowY: 'scroll'
          }}
          className='modal-content'
        >
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
                <span className='cover-title'>
                  {title.charAt(0).toUpperCase() + title.slice(1)}
                </span>
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
              className='portfolio-modal-end-btns-container'
            >
              <div>
                {onDelete && !addingModal && (
                  <div
                    style={{ display: 'flex', cursor: 'pointer' }}
                    onClick={onDelete}
                  >
                    <img width={20} height={20} src={deleteIcon} />
                    <div style={{ marginLeft: '5px' }}>Delete {deleteText}</div>
                  </div>
                )}{' '}
              </div>

              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
                className='portfolio-modal-btns-container'
              >
                <button
                  className='close-btn-portfolio  w-full-900'
                  onClick={toggle}
                >
                  CANCEL
                </button>
                {!addingModal && (
                  <button
                    className='modal-save-btn w-full-900'
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ marginLeft: '15px' }}
                  >
                    {loading ? '...' : 'SAVE'}
                  </button>
                )}

                {addingModal && (
                  <div style={{ display: 'flex', fontSize: '10px' }}>
                    <button
                      className='modal-save-btn w-full-900'
                      onClick={() => handleSubmit(false)}
                      disabled={loading}
                      style={{ marginLeft: '15px' }}
                    >
                      SAVE AND CLOSE
                    </button>

                    {addingModal && title != 'brand' && (
                      <button
                        className='modal-save-btn w-full-900'
                        onClick={handleContinueClick}
                        disabled={loading}
                        style={{ marginLeft: '15px' }}
                      >
                        SAVE AND CONTINUE
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCard
