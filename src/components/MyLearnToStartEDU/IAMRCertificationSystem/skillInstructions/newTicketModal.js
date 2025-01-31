import React from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../../../utils/AxiosInstance'
import { Controller, useForm } from 'react-hook-form'
import { showErrors } from '../../../../utils/helpers'
import { useSelector } from 'react-redux'
import notificationSocket from '../../../../utils/notificationSocket'
import notificationTypes from '../../../../utils/notificationTypes'

const NewTicketModal = ({ show, onHide, skillId, addNewTicket }) => {
  const loggedUser = useSelector((state) => state.user.user.user)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      subject: '',
      message: ''
    }
  })

  const submitTicket = async (values) => {
    await axiosInstance
      .post(`iamr/tickets/instruction/${skillId}`, values)
      .then(({ data }) => {
        toast.success('Your question has been submitted.')
        addNewTicket(data)
        onHide()
        if (loggedUser && loggedUser.Instructor) {
          notificationSocket?.emit('sendNotification', {
            sender: loggedUser,
            receivers: [loggedUser.Instructor.User],
            type: notificationTypes.IAMR_STUDENT_QUESTION.key,
            url: '/my-inbox#student_questions'
          })
        }
      })
      .catch((e) => showErrors(e))
    reset({
      subject: '',
      message: ''
    })
  }

  const maxWords = (value) => {
    return value?.trim()?.split(/\s+/)?.length <= 100
  }

  const hideModal = () => {
    if (isSubmitting) return
    reset({
      subject: '',
      message: ''
    })
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={hideModal}
      backdrop='static'
      keyboard={false}
      className='no-border-modal new-ticket-modal'
      centered
    >
      <Modal.Header className='contact-us-title my-auto mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>ASK QUESTION</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={hideModal}
        />
      </Modal.Header>
      <Modal.Body className='m-4 p-0'>
        <form onSubmit={handleSubmit(submitTicket)}>
          <div className='contact-us'>
            <div className='input-field mb-2'>
              <input
                type='text'
                name='subject'
                placeholder={'Add subject'}
                {...register('subject', {
                  required: 'Subject is required'
                })}
              />
              <span className='field-error'>
                {errors.subject && errors.subject.message}
              </span>
            </div>

            <div className='input-field mb-4'>
              <Controller
                name='message'
                control={control}
                rules={{
                  required: 'Message is required',
                  validate: {
                    maxWords: (v) =>
                      maxWords(v) || 'Maximum number of words is 100'
                  }
                }}
                render={({ onChange, value, field }) => (
                  <textarea
                    placeholder={'Add your text here. (Max 100 words)'}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <span className='field-error'>
                {errors.message && errors.message.message}
              </span>
            </div>

            <button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'SENDING' : 'SEND'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
export default NewTicketModal
