import React, { useState } from 'react'

import './style.css'
import '../style.css'
import '../../Spotlight/index.css'
import 'react-quill/dist/quill.snow.css'
import { useForm } from '../../../hooks/useForm'
import { useDispatch } from 'react-redux'
import { Col, Modal, Row } from 'react-bootstrap'
import { CustomDropdown, LtsButton } from '../../../ui/ContentItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFile,
  faFileUpload,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import { handleSpotlightStatus } from '../../../redux/myImmersion/actions'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import notificationTypes from '../../../utils/notificationTypes'
import notificationSocket from '../../../utils/notificationSocket'

const SpotlightModal = (props) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [submitType, setSubmitType] = useState('approved')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const initialState = {
    name: '',
    productName: '',
    productDescription: '',
    membershipType: '',
    parentGuardianApprovalForm: '',
    pitchDeck: '',
    businessPlan: '',
    termsAndConditions: false,
    applicationDate: Date.now()
  }

  const { formData } = useForm(
    initialState,
    props.spotlight,
    props.mode,
    loading
  )

  const handleDownloadAll = () => {
    const files = [
      {
        name: 'Parent-Guardian-Approval-Form.pdf',
        url: formData.parentGuardianApprovalForm
      },
      { name: 'PitchDeck.pdf', url: formData.pitchDeck },
      { name: 'BusinessPlan.pdf', url: formData.businessPlan }
    ]

    files.forEach((file) => {
      fetch(file.url)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file.name)
          document.body.appendChild(link)
          link.click()

          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(url)
        })
        .catch((err) => console.error('Error downloading file:', err))
    })
  }

  const submitHandler = async () => {
    const sanitizedFeedback = feedbackMessage
      ?.replace(/<\/?[^>]+(>|$)/g, '')
      .trim()

    if (submitType === 'rejecte' && !sanitizedFeedback) {
      setErrorMessage('Please provide feedback for the student.')
      return
    }
    const res = dispatch(
      handleSpotlightStatus(props.spotlight_id, submitType, sanitizedFeedback)
    )

    if (res) {
      if (submitType === 'approved') {
        await axiosInstance
          .post('/users/sendPitch', {
            ...formData,
            ...props.User
          })
          .then(() => {
            setLoading(false)
          })
      }

      toast.success('User solution status updated successfully!')
      props.updateUserSolutionStatus(props.id, submitType)
      props.onHide()
      const type =
        submitType === 'approved'
          ? notificationTypes.SPOTLIGHT_APPROVED.key
          : notificationTypes.SPOTLIGHT_DENIED.key

      notificationSocket?.emit('sendNotification', {
        sender: props.User,
        receivers: [{ id: props.user_id }],
        type: type,
        url: '/spotlight'
      })
    } else {
      toast.error('Failed to update user solution status.')
    }
  }

  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      size='xl'
      aria-labelledby='contained-modal-title-vcenter'
      className='spotlight-modal'
      centered
    >
      <Modal.Header>
        <Row className='align-items-center w-100 m-0 py-2'>
          <Col md='10' className='d-flex justify-content-between'>
            <Col md='9' className='d-flex align-items-center'>
              <h5 className='m-0'>SPOTLIGHT SUBMISSION</h5>
            </Col>
            <Col md='3'>
              <CustomDropdown
                title={'Submitted'}
                btnClassName={'gray-border'}
                options={[
                  {
                    name: 'Approved',
                    value: 'approved'
                  },
                  {
                    name: 'Denied',
                    value: 'rejected'
                  }
                ]}
                onClick={(option) => setSubmitType(option.value)}
              />
            </Col>
          </Col>
          <Col md='2' className='d-flex justify-content-end'>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => props.onHide()}
              style={{ fontSize: '20px' }}
              className='cursor-pointer'
            />
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className='d-flex align-items-center m-0 w-100'>
            <span className='pe-2'>Name of Student:</span>
            <span className='fw-bold'>{formData.name}</span>
          </div>
          <div className='d-flex align-items-center m-0 w-100'>
            <span className='pe-2'>Title of Product or Service:</span>
            <span className='fw-bold'>{formData.productName}</span>
          </div>
        </div>

        <Col className='my-4'>
          <p className='fw-bold mb-2'>Product or Service Description</p>
          <p className=' m-0'>{formData.productDescription}</p>
        </Col>
        <Col className='my-4'>
          <p className='fw-bold mb-2'>Type of Membership Applying For</p>
          <p className=' m-0'>{formData.membershipType}</p>
        </Col>
        <Row className='justify-content-between align-items-center w-100 m-0'>
          <Col md='9' className='my-4'>
            <p className='fw-bold mb-2'>FILES SUBMITTED</p>
            <span className='d-flex align-items-center'>
              <FontAwesomeIcon icon={faFile} className='me-2' />
              <a
                href={formData.parentGuardianApprovalForm}
                target='_blank'
                rel='noopener noreferrer'
              >
                Parent/Guardian Approval Form.pdf
              </a>
            </span>
            <span className='d-flex align-items-center'>
              <FontAwesomeIcon icon={faFile} className='me-2' />
              <a
                href={formData.pitchDeck}
                target='_blank'
                rel='noopener noreferrer'
              >
                Pitch Deck.pdf
              </a>
            </span>
            <span className='d-flex align-items-center'>
              <FontAwesomeIcon icon={faFile} className='me-2' />
              <a
                href={formData.businessPlan}
                target='_blank'
                rel='noopener noreferrer'
              >
                Business Plan.pdf
              </a>
            </span>
          </Col>
          <Col md='3' className='d-flex justify-content-end'>
            <span
              className='d-flex align-items-center cursor-pointer'
              style={{ color: '#5db1cc' }}
              onClick={handleDownloadAll}
            >
              Download All Files
              <FontAwesomeIcon icon={faFileUpload} className='ms-2' />
            </span>
          </Col>
        </Row>
        {submitType === 'rejected' && (
          <Col className='my-3'>
            <p className='fw-bold mb-2'>Feedback About Application Denial</p>
            <ReactQuill
              className={'portfolio-quill'}
              value={feedbackMessage || ''}
              onChange={(value) => setFeedbackMessage(value)}
              placeholder='Briefly describe the nature of your work experience.'
            />
            <span style={{ color: 'red' }}>{errorMessage}</span>
          </Col>
        )}

        <Row className='w-100 m-0 justify-content-end'>
          <LtsButton
            text={'CANCEL'}
            background={'transparent'}
            color={'#000'}
            border={'1px solid #ccc'}
            onClick={() => props.onHide()}
          />
          <LtsButton
            text={
              loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : submitType === 'rejected' ? (
                'SEND TO STUDENT'
              ) : (
                'SEND TO LTS'
              )
            }
            background={'#52C7DE'}
            className={'ms-2'}
            color={'#fff'}
            border={'none'}
            onClick={submitHandler}
          />
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default SpotlightModal
