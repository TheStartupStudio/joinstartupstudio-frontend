import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import './style.css'
import { Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import UploadFileInput from '../ui/UploadFileInput'
import TermsAndConditionsCheckbox from '../ui/TermsAndConditions'
import ParentGuardianButton from '../ui/ParentGuardianButton'
import SubmitButton from '../ui/SubmitButton'
import Textarea from '../ui/Textarea'
import ProfileHolder from '../ui/ProfileHolder'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const SubmitIndustryProblemModal = (props) => {
  console.log('props', props)
  const { user } = useSelector((state) => state.user.user)

  const [formData, setFormData] = useState({
    industry_problem_ID: props.problemID,
    company_ID: props.companyID,
    solutionDescription: props.solutionDescription ?? '',
    status: props.status ?? 'pending',
    parentGuardianApprovalForm: props.parentGuardianApprovalForm ?? '',
    pitchDeck: props.pitchDeck ?? '',
    pitchVideo: props.pitchVideo ?? '',
    termsAndConditions: props.termsAndConditions ?? false,
    submissionDate: props.submissionDate
      ? new Date(props.submissionDate)
      : new Date()
  })

  console.log('formData', formData)

  const handleChange = (e) => {
    const { name, checked, type } = e.target

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    }
    if (type === 'file') {
      const { files } = e.target
      setFormData({ ...formData, [name]: files[0] })
    } else {
      const { value } = e.target
      setFormData({ ...formData, [name]: value })
    }
  }

  const submitHandler = async (status) => {
    try {
      axiosInstance
        .patch(`/immersion/problems/${props.id}`, { status })
        .then((res) => {
          if (res.status === 200) {
            toast.success('User problem solution status updated successfully!')
            props.onHide()
          }
        })
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit solution')
    }
  }

  console.log('props.status === approved', props.status === 'approved')

  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="submit-industry-problem-modal"
      centered
    >
      <Modal.Body style={{ padding: '3%' }}>
        <Modal.Header>
          <Modal.Title>
            {props.mode === 'ticket' ? 'USER SOLUTION' : 'SUBMIT YOUR SOLUTION'}
          </Modal.Title>
          <span
            style={{ fontSize: '20px', fontWeight: '700' }}
            className="cursor-pointer"
            onClick={() => props.onHide()}
          >
            X
          </span>
        </Modal.Header>

        <div className="body-container">
          <Col style={{ maxHeight: '70%' }}>
            <ProfileHolder
              profileImage={
                props.mode === 'ticket'
                  ? props.User.profile_image
                  : user?.profileImage
              }
              name={props.mode === 'ticket' ? props.User.name : user?.name}
            />
            <div>
              <p className="mb-1">
                {props.ImmersionCompany?.name ?? props.currentCompanyName}{' '}
                Problem
              </p>
              <Textarea
                placeholder={'Briefly describe solution'}
                name="solutionDescription"
                value={formData.solutionDescription}
                onChange={props.mode !== 'ticket' ? handleChange : () => {}}
              />
            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-between">
            <div>
              <UploadFileInput
                filename={formData.parentGuardianApprovalForm}
                placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
                name="parentGuardianApprovalForm"
                onChange={props.mode !== 'ticket' ? handleChange : () => {}}
                mode={props.mode}
              />
              <UploadFileInput
                filename={formData.pitchDeck}
                placeholder={'Upload Pitch Deck (PDF)'}
                name="pitchDeck"
                onChange={props.mode !== 'ticket' ? handleChange : () => {}}
                mode={props.mode}
              />
              <UploadFileInput
                filename={formData.pitchVideo}
                placeholder={'Upload Pitch Video'}
                name="pitchVideo"
                onChange={handleChange}
                mode={props.mode}
              />
              <p style={{ fontSize: '11px' }}>
                You must be subscribed to the Learn to Start platform for a
                minimum of a 1 year prior applying. Applicants must be 18 years
                old or have a parent/guardian form to be considered for
                Sportlight.
              </p>
            </div>

            <TermsAndConditionsCheckbox
              text={'I agree to the Spotlight'}
              blueText={'Terms & Conditions'}
              name={'termsAndConditions'}
              onChange={props.mode !== 'ticket' ? handleChange : () => {}}
              checked={formData.termsAndConditions}
            />
          </Col>
          <Col>
            <ParentGuardianButton text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
          </Col>
          <Col className="d-flex justify-content-end">
            {props.mode === 'ticket' ? (
              <div className="d-flex">
                <SubmitButton
                  text={'DENY'}
                  disabled={props.status === 'rejected'}
                  type="button"
                  onClick={() => submitHandler('rejected')}
                  className={'deny-button'}
                />

                <SubmitButton
                  text={'APPROVE'}
                  disabled={props.status === 'approved'}
                  type="button"
                  onClick={() => submitHandler('approved')}
                  className={'approve-button'}
                />
              </div>
            ) : (
              <SubmitButton
                text={'SAVE'}
                disabled={true}
                type="button"
                className={'submit-button'}
              />
            )}
          </Col>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SubmitIndustryProblemModal
