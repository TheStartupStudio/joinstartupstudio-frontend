import React from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'

const RejectUploadModal = ({ upload, show, onHide, editUpload, skill }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { message: '' }
  })

  const submitTicket = async (values) => {
    await editUpload(
      { ...upload, status: 'developing', message: values.message, skill },
      () => {
        onHide()
        toast.success('Upload has been marked as developing.')
        reset({ message: '' })
      }
    )
  }

  const maxWords = (value) => {
    return value?.trim()?.split(/\s+/)?.length <= 100
  }

  const hideModal = () => {
    if (isSubmitting) return
    reset({
      message: ''
    })
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={hideModal}
      backdrop="static"
      keyboard={false}
      className="no-border-modal new-ticket-modal"
      centered
    >
      <Modal.Header className="contact-us-title my-auto mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">UPLOAD FEEDBACK</h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={hideModal}
        />
      </Modal.Header>
      <Modal.Body className="m-4 p-0">
        <form onSubmit={handleSubmit(submitTicket)}>
          <div className="contact-us">
            <h6>Please provide a feedback for the student.</h6>

            <div className="input-field mb-4">
              <Controller
                name="message"
                control={control}
                rules={{
                  required: 'Feedback is required',
                  validate: {
                    maxWords: (v) =>
                      maxWords(v) || 'Maximum number of words is 100'
                  }
                }}
                render={({ onChange, value, field }) => (
                  <textarea
                    placeholder={'Add your feedback here. (Max 100 words)'}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <span className="field-error">
                {errors.message && errors.message.message}
              </span>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING' : 'SEND'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
export default RejectUploadModal
