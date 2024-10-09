import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import './style.css'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchUserProblemSolution,
  handleIndustryProblemStatus
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
import { FaEye, FaX } from 'react-icons/fa6'
import mailIcon from '../../../assets/images/mail-icon.svg'

// import ParentButtonApply from '../../../components/Modals/Spotlight/ParentButtonApply.js'

const SubmitIndustryProblemModal = (props) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
  const { loading, industryProblems } = useSelector(
    (state) => state.myImmersion
  )
  const initialState = {
    solutionDescription: '',
    status: '',
    parentGuardianApprovalForm: '',
    pitchDeck: '',
    pitchVideo: '',
    termsAndConditions: false,
    submissionDate: new Date()
  }

  useEffect(() => {
    if (props.mode === 'edit') {
      dispatch(
        fetchUserProblemSolution(props.user_id, props.industry_solution_id)
      )
    }
  }, [dispatch, props.user_id, props.industry_solution_id, props.mode])

  const { formData, handleChange, handleChangeFile, handleChangeCheckbox } =
    useForm(initialState, industryProblems.userSolution, props.mode, loading)

  const submitHandler = (status) => {
    const res = dispatch(
      handleIndustryProblemStatus(industryProblems.userSolution?.id, status)
    )

    if (res) {
      toast.success('User solution status updated successfully!')
      props.updateUserSolutionStatus(props.id, status)
      props.onHide()
      const type =
        status === 'approved'
          ? notificationTypes.INDUSTRY_PROBLEM_APPROVED.key
          : notificationTypes.INDUSTRY_PROBLEM_DENIED.key

      notificationSocket?.emit('sendNotification', {
        sender: user,
        receivers: [{ id: props.user_id }],
        type: type,
        url: '/my-immersion/step-1'
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
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      className='submit-industry-problem-modal'
      centered
    >
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <Modal.Body
          style={{
            padding: '3%'
            //  height: '500px'
          }}
          className='immersion-step1-modal-body'
        >
          {' '}
          <div className='mail-icon-cont'>
            <img src={mailIcon} className='step1-mail-icon'></img>
          </div>
          <Modal.Header style={{ marginTop: '30px' }}>
            <div className='portfolio-actions'>
              <span
                style={{ fontSize: '20px', fontWeight: '700' }}
                className='action-box cursor-pointer'
                onClick={() => props.onHide()}
              >
                X
              </span>
            </div>
            <Modal.Title
              style={{
                color: '#231f20',
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '5px'
              }}
              className='immrs-solution-title-modal'
            >
              <div>
                {props.mode === 'edit'
                  ? 'USER SOLUTION'
                  : 'SUBMIT YOUR SOLUTION'}
              </div>
              <div
                style={{
                  marginLeft: '260px ',
                  display: 'flex',
                  alignContent: 'center',
                  color: '#231f20'
                }}
                className='left-title-immrs'
              >
                Submitted by:
                <ProfileHolder
                  className={'no-profile'}
                  classN={'username-submit'}
                  name={props.mode === 'edit' ? props.User.name : user?.name}
                />
              </div>
            </Modal.Title>
            {/* <span
              style={{ fontSize: '20px', fontWeight: '700' }}
              className='cursor-pointer'
              onClick={() => props.onHide()}
            >
              X
            </span> */}
          </Modal.Header>
          <div className='immersion-body-container body-container'>
            <Col style={{ maxHeight: '70%' }}>
              {/* <ProfileHolder
                profileImage={
                  props.mode === 'edit'
                    ? props.User.profile_image
                    : user?.profileImage
                }
                name={props.mode === 'edit' ? props.User.name : user?.name}
              /> */}
              <div className='step1-submit-modal-textarea'>
                <p className='mb-1'>
                  {props.ImmersionCompany?.name ?? props.currentCompanyName}{' '}
                  Problem
                </p>
                <Textarea
                  placeholder={'Briefly describe solution'}
                  name='solutionDescription'
                  value={formData.solutionDescription}
                  onChange={props.mode !== 'edit' ? handleChange : () => {}}
                />
              </div>
            </Col>
            <Col
              style={{ marginTop: '28px' }}
              className='d-flex flex-column justify-content-between'
            >
              <div>
                {/* <UploadFileInput
                  filename={formData.parentGuardianApprovalForm}
                  placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
                  name='parentGuardianApprovalForm'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                /> */}
                <UploadFileInput
                  filename={formData.pitchDeck}
                  placeholder={'Upload Pitch Deck (PDF)'}
                  name='pitchDeck'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                />
                <UploadFileInput
                  filename={formData.pitchVideo}
                  placeholder={'Add link to your pitch video'}
                  name='pitchVideo'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                />
                <p style={{ fontSize: '11px' }}>
                  You are submitting your solution to your LTS Instructor. If
                  your instructor approves your solution, you can submit your
                  solution for Step 2 Spotlight. If your instructor denies your
                  solution, they will offer you feedback so you can improve your
                  solution to resubmit for Step 1
                </p>
              </div>
              {/* 
              <TermsAndConditionsCheckbox
                text={'I agree to the Spotlight'}
                blueText={'Terms & Conditions'}
                name={'termsAndConditions'}
                onChange={
                  props.mode !== 'edit' ? handleChangeCheckbox : () => {}
                }
                checked={formData.termsAndConditions}
              /> */}

              <Col className='d-flex justify-content-end'>
                {props.mode === 'edit' ? (
                  <div className='d-flex'>
                    <SubmitButton
                      text={'DENY'}
                      disabled={formData.status !== 'pending'}
                      type='button'
                      onClick={() => submitHandler('rejected')}
                      className={'deny-button'}
                    />

                    <SubmitButton
                      text={'APPROVE'}
                      disabled={formData.status !== 'pending'}
                      type='button'
                      onClick={() => submitHandler('approved')}
                      className={'approve-button'}
                    />
                  </div>
                ) : (
                  <SubmitButton
                    text={'SUBMIT'}
                    disabled={props.problemIsSubmitted}
                    type='button'
                    className={'submit-button'}
                  />
                )}
              </Col>
            </Col>
            {/* <Col>
              <ParentGuardianButton
                style={{ display: 'flex', justifyContent: 'center' }}
                className='immrs-parent-form'
                text={'DOWNLOAD PARENT/GUARDIAN FORM'}
              />
            </Col> */}

            {/* <Col className='d-flex justify-content-end'>
              {props.mode === 'edit' ? (
                <div className='d-flex'>
                  <SubmitButton
                    text={'DENY'}
                    disabled={formData.status !== 'pending'}
                    type='button'
                    onClick={() => submitHandler('rejected')}
                    className={'deny-button'}
                  />

                  <SubmitButton
                    text={'APPROVE'}
                    disabled={formData.status !== 'pending'}
                    type='button'
                    onClick={() => submitHandler('approved')}
                    className={'approve-button'}
                  />
                </div>
              ) : (
                <SubmitButton
                  text={'SUBMIT'}
                  disabled={true}
                  type='button'
                  className={'submit-button'}
                />
              )}
            </Col> */}
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

export default SubmitIndustryProblemModal
