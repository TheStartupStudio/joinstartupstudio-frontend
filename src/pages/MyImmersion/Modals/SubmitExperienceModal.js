import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import './style.css'
import '../style.css'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchUserExperienceApplication,
  handleExperienceStatus
} from '../../../redux/myImmersion/actions'
import LoadingAnimation from '../../../ui/loadingAnimation'
import { useForm } from '../../../hooks/useForm'
import {
  ParentGuardianButton,
  ProfileHolder,
  SubmitButton,
  TermsAndConditionsCheckbox,
  Textarea,
  UploadFileInput
} from '../ContentItems'
import notificationTypes from '../../../utils/notificationTypes'
import notificationSocket from '../../../utils/notificationSocket'

const SubmitExperienceModal = (props) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
  const { loading, experiences } = useSelector((state) => state.myImmersion)

  const initialState = {
    interestDescription: '',
    status: '',
    parentGuardianApprovalForm: '',
    portfolioAccessGranted: false,
    industrySolutionAccessGranted: false,
    termsAndConditions: false,
    applicationDate: Date.now()
  }

  useEffect(() => {
    if (props.mode === 'edit') {
      dispatch(
        fetchUserExperienceApplication(
          props.user_id,
          props.immersion_experience_id
        )
      )
    }
  }, [dispatch, props.user_id, props.immersion_experience_id, props.mode])

  const { formData, handleChange, handleChangeFile, handleChangeCheckbox } =
    useForm(initialState, experiences.userExperience, props.mode, loading)

  const submitHandler = (status) => {
    const res = dispatch(
      handleExperienceStatus(experiences.userExperience?.id, status)
    )

    if (res) {
      toast.success('User experience application status updated successfully!')
      props.onHide()
      const type =
        status === 'approved'
          ? notificationTypes.IMMERSION_EXPERIENCE_APPROVED.key
          : notificationTypes.IMMERSION_EXPERIENCE_DENIED.key

      notificationSocket?.emit('sendNotification', {
        sender: user,
        receivers: [{ id: props.user_id }],
        type: type,
        url: '/my-immersion/step-2'
      })
    } else {
      toast.error('Failed to update user experience application status.')
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
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <Modal.Body style={{ padding: '3%' }}>
          <Modal.Header>
            <Modal.Title>
              {props.mode === 'edit'
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
                  props.mode === 'edit'
                    ? props.User.profile_image
                    : user?.profileImage
                }
                name={props.mode === 'edit' ? props.User.name : user?.name}
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
                  onChange={props.mode !== 'edit' ? handleChange : () => {}}
                />
              </div>
            </Col>
            <Col className="d-flex flex-column justify-content-between">
              <div>
                <UploadFileInput
                  filename={formData.parentGuardianApprovalForm}
                  placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
                  name="parentGuardianApprovalForm"
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                />
                <div className="my-3">
                  <TermsAndConditionsCheckbox
                    text={'Add access to your LTS Portfolio'}
                    blueText={''}
                    name={'portfolioAccessGranted'}
                    onChange={
                      props.mode !== 'edit' ? handleChangeCheckbox : () => {}
                    }
                    checked={formData.portfolioAccessGranted}
                  />
                </div>

                <div className="my-3">
                  <TermsAndConditionsCheckbox
                    text={'Add access to your Industry Solution'}
                    blueText={''}
                    name={'industrySolutionAccessGranted'}
                    onChange={
                      props.mode !== 'edit' ? handleChangeCheckbox : () => {}
                    }
                    checked={formData.industrySolutionAccessGranted}
                  />
                </div>

                <p style={{ fontSize: '11px' }}>
                  You must be subscribed to the Learn to Start platform for a
                  minimum of a 1 year prior applying. Applicants must be 18
                  years old or have a parent/guardian form to be considered for
                  Sportlight.
                </p>
              </div>

              <TermsAndConditionsCheckbox
                text={'I agree to the Spotlight'}
                blueText={'Terms & Conditions'}
                name={'termsAndConditions'}
                onChange={
                  props.mode !== 'edit' ? handleChangeCheckbox : () => {}
                }
                checked={formData.termsAndConditions}
              />
            </Col>
            <Col>
              <ParentGuardianButton text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
            </Col>
            <Col className="d-flex justify-content-end">
              {props.mode === 'edit' ? (
                <div className="d-flex">
                  <SubmitButton
                    text={'DENY'}
                    disabled={formData.status !== 'pending'}
                    type="button"
                    onClick={() => submitHandler('rejected')}
                    className={'deny-button'}
                  />

                  <SubmitButton
                    text={'APPROVE'}
                    disabled={formData.status !== 'pending'}
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
      )}
    </Modal>
  )
}

export default SubmitExperienceModal
