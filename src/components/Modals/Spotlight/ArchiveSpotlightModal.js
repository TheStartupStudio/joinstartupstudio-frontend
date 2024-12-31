import { faFile, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useForm } from '../../../hooks/useForm'

const ArchiveSpotlightModal = (props) => {
  const [loading, setLoading] = useState(false)
  const initialState = {
    name: '',
    productName: '',
    productDescription: '',
    membershipType: '',
    parentGuardianApprovalForm: '',
    pitchDeck: '',
    businessPlan: '',
    termsAndConditions: false,
    status: '',
    applicationDate: Date.now()
  }

  const { formData } = useForm(
    initialState,
    props.spotlight,
    props.mode,
    loading
  )

  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      className='spotlight-modal'
      centered
    >
      <Modal.Header>
        <Row className='align-items-center w-100 m-0 p-3'>
          <Col md='10' className='d-flex justify-content-between'>
            <Col md='9' className='d-flex align-items-center'>
              <h5 className='m-0'>SPOTLIGHT SUBMISSION</h5>
            </Col>
            <Col md='2' className='p-0'>
              <p
                className={`m-0 p-2 border text-center status__${formData.status} fw-bold `}
                style={{ borderRadius: '12px', textTransform: 'capitalize' }}
              >
                {formData.status}
              </p>
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
          <p className='fw-bold mb-2'>Type of Mentorship Applying For</p>
          <p className=' m-0'>{formData.membershipType}</p>
        </Col>
        <Row className='justify-content-between align-items-center w-100 m-0'>
          <Col md='9' className='my-4'>
            <p className='fw-normal mb-2'>FILES SUBMITTED</p>
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
        </Row>
        {formData.status === 'rejected' && (
          <div>
            <p className='fw-normal mb-2'>INSTRUCTOR FEEDBACK</p>
            <p className='m-0'>{formData.feedbackMessage}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ArchiveSpotlightModal
