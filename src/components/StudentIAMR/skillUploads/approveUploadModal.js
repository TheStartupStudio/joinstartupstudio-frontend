import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
const ApproveUploadModal = ({ upload, show, onHide, editUpload, skill }) => {
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)
    editUpload(
      { ...upload, status: 'proficient', skill },
      () => {
        setLoading(false)
        toast.success('Skill has been marked as proficient.')
        onHide()
      },
      () => setLoading(false)
    )
  }

  const hideModal = () => {
    if (loading) return
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={hideModal}
      backdrop="static"
      keyboard={false}
      className="no-border-modal confirmation-modal approve"
      centered
    >
      <Modal.Header
        className="contact-us-title my-auto p-0 mx-4"
        style={{ border: 0 }}
      >
        <button
          type="button"
          className="btn-close mt-2"
          aria-label="Close"
          onClick={hideModal}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="my-2 my-md-4 mx-2 mx-md-5">
          <h3 className="title">
            Are you sure you want to mark the skill as proficient?
          </h3>
          <div className="mt-4 text-center">
            <button disabled={loading} className="confirm-btn" onClick={submit}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                `YES`
              )}
            </button>
          </div>
          <div className="mt-2 text-center">
            <p onClick={hideModal} className="cancel">
              CANCEL
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ApproveUploadModal
