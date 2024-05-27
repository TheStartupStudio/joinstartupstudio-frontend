import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import './style.css'
import '../style.css'
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

const SubmitExperienceModal = (props) => {
  const { user } = useSelector((state) => state.user.user)
  console.log('props', props)

  const [formData, setFormData] = useState({
    interestDescription: props.interestDescription ?? '',
    status: props.status ?? '',
    parentGuardianApprovalForm: props.parentGuardianApprovalForm ?? '',
    portfolioAccessGranted: props.portfolioAccessGranted ?? false,
    industrySolutionAccessGranted: props.industrySolutionAccessGranted ?? false,
    termsAndConditions: props.termsAndConditions ?? false,
    applicationDate: Date.now()
  })

  const handleChange = (e) => {
    const { name, checked, type } = e.target

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      const { value } = e.target
      setFormData({ ...formData, [name]: value })
    }
  }

  const submitHandler = async (status) => {
    try {
      axiosInstance
        .patch(`/immersion/experiences/${props.id}`, { status })
        .then((res) => {
          if (res.status === 200) {
            toast.success(
              'User experience application status updated successfully!'
            )
            props.onHide()
          }
        })
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit experience status')
    }
  }

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
            {props.mode === 'ticket'
              ? 'USER EXPERIENCE'
              : 'APPLY TO IMMERSION EXPERIENCE'}
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
                placeholder={
                  'Briefly describe interest in this immersion experience'
                }
                name="interestDescription"
                value={formData.interestDescription}
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
              <div className="my-3">
                <TermsAndConditionsCheckbox
                  text={'Add access to your LTS Portfolio'}
                  blueText={''}
                  name={'portfolioAccessGranted'}
                  onChange={props.mode !== 'ticket' ? handleChange : () => {}}
                  checked={formData.portfolioAccessGranted}
                />
              </div>

              <div className="my-3">
                <TermsAndConditionsCheckbox
                  text={'Add access to your Industry Solution'}
                  blueText={''}
                  name={'industrySolutionAccessGranted'}
                  onChange={props.mode !== 'ticket' ? handleChange : () => {}}
                  checked={formData.industrySolutionAccessGranted}
                />
              </div>

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

export default SubmitExperienceModal
