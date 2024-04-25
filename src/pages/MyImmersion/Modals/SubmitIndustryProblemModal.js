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
  const { user } = useSelector((state) => state.user.user)

  const [formData, setFormData] = useState({
    industry_problem_ID: props.companyID,
    company_ID: props.companyID,
    solutionDescription: '',
    status: 'pending',
    parentGuardianApprovalForm: '',
    pitchDeck: '',
    pitchVideo: '',
    termsAndConditions: false,
    submissionDate: Date.now()
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

  const submitHandler = async (e) => {
    e.preventDefault()

    await axiosInstance.post('/immersion/problems', formData).then((res) => {
      if (res.status === 200) {
        toast.success('Solution submitted successfuly')
        props.onHide()
      }
    })
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
          <Modal.Title>SUBMIT YOUR SOLUTION</Modal.Title>
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
              profileImage={user?.profileImage}
              name={user?.name}
            />
            <div>
              <p className="mb-1">{props.currentCompanyName} Problem</p>
              <Textarea
                placeholder={'Briefly describe solution'}
                name="solutionDescription"
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-between">
            <div>
              <UploadFileInput
                placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
                name="parentGuardianApprovalForm"
                onChange={handleChange}
              />
              <UploadFileInput
                placeholder={'Upload Pitch Desk (PDF)'}
                name="pitchDeck"
                onChange={handleChange}
              />
              <UploadFileInput
                placeholder={'Upload Pitch Video'}
                name="pitchVideo"
                onChange={handleChange}
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
              onChange={handleChange}
              checked={formData.termsAndConditions}
            />
          </Col>
          <Col>
            <ParentGuardianButton text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
          </Col>
          <Col className="d-flex justify-content-end">
            <SubmitButton
              text={'SAVE'}
              disabled={props.problemIsSubmitted}
              type="button"
              onClick={submitHandler}
            />
          </Col>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SubmitIndustryProblemModal
