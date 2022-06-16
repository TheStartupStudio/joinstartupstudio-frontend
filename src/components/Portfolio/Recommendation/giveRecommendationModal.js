import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BlockedUserModal from '../../Modals/Connections/blockedUserModal'

export const GiveRecommendationModal = (props) => {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContactForm = (event) => {
    const { name, value } = event.target
    if (name === 'description') {
      setDescription(value)
    }
  }

  const closeModal = () => {
    props.onHide()
    setDescription('')
    setLoading(false)
  }

  const submit = async () => {
    if (isNaN(props.requestId)) {
      closeModal()
      return toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    }

    if (!description) return toast.error('Please add a description!')

    setLoading(true)

    const submitDescription = '"' + description + '"'

    await axiosInstance
      .put(`/recommendations/${props.requestId}`, {
        description: submitDescription
      })
      .then((res) => {
        props.updateRecommendation(res.data)
        closeModal()
        setLoading(false)
        toast.success('Recommendation request sent successfully!')
      })
      .catch((err) => {
        closeModal()
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => closeModal()}
        backdrop='static'
        keyboard={false}
        style={{ marginTop: '3rem' }}
      >
        <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
          <h3 className='mb-0 pt-4 mt-2 '>GIVE RECOMMENDATION</h3>
          <button
            type='button'
            className='btn-close me-1'
            aria-label='Close'
            onClick={() => closeModal()}
          />
        </Modal.Header>
        <Modal.Body className='misconduct-modal mx-4 px-0 pb-4'>
          <h3 className='m-0'>Give a Recommendation or Endorsement</h3>
          <div className='contact-us p-0'>
            <textarea
              className='mb-3'
              style={{
                borderRadius: '0px',
                border: '1px solid #BBBDBF',
                height: '300px'
              }}
              name='description'
              placeholder={'Write your recommendation or endorsement here.'}
              value={description}
              onChange={handleContactForm}
            />

            <button
              disabled={loading}
              onClick={() => {
                submit()
              }}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'SEND'
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
