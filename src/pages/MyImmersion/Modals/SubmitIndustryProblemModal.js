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

const SubmitIndustryProblemModal = (props) => {
  console.log(props, 'SubmitIndustryProblemModal')
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

  console.log(props, 'propsSubmitIndustryProblemModal')
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
          style={{ padding: '3%', display: 'flex', flexDirection: 'column' }}
        >
          <Modal.Header style={{ flexDirection: 'row' }}>
            <Modal.Title>
              {props.mode === 'edit' ? 'USER SOLUTION' : 'SUBMIT YOUR SOLUTION'}
            </Modal.Title>
            <span
              style={{ fontSize: '20px', fontWeight: '700' }}
              className='cursor-pointer'
              onClick={() => props.onHide()}
            >
              X
            </span>
          </Modal.Header>

          <div className='body-container'>
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
                {console.log(props, 'propssubmit')}

                <p className='mb-1'>
                  {props.immersion?.companyName
                    ? props.immersion.companyName
                    : props.user_industry_solution?.company_name
                    ? props.user_industry_solution?.company_name
                    : ''}{' '}
                </p>
                <Textarea
                  placeholder={'Briefly describe solution'}
                  name='solutionDescription'
                  value={formData.solutionDescription}
                  onChange={props.mode !== 'edit' ? handleChange : () => {}}
                />
              </div>
            </Col>
            <Col className='d-flex flex-column justify-content-between'>
              <div>
                <UploadFileInput
                  filename={formData.pitchDeck?.name || ''}
                  placeholder={'Upload Pitch Deck (PDF)'}
                  name='pitchDeck'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                />
                <UploadFileInput
                  filename={formData.pitchVideo?.name || ''}
                  placeholder={'Upload Pitch Video'}
                  name='pitchVideo'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                  accept='video/*' // Pass the accept attribute to restrict uploads to video files
                />

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
                  text={'SAVE'}
                  disabled={true}
                  type='button'
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

export default SubmitIndustryProblemModal
