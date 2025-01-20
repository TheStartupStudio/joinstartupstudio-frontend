import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import './style.css'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  createIndustryProblem,
  fetchUserProblemSolution,
  handleIndustryProblemStatus
} from '../../../redux/myImmersion/actions'
import LoadingAnimation from '../../../ui/loadingAnimation'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { SubmitButton, Textarea, UploadFileInput } from '../ContentItems'
import notificationTypes from '../../../utils/notificationTypes'
import notificationSocket from '../../../utils/notificationSocket'
import mailIcon from '../../../assets/images/mail-icon.svg'
import axiosInstance from '../../../utils/AxiosInstance'

// import ParentButtonApply from '../../../components/Modals/Spotlight/ParentButtonApply.js'

const SubmitIndustryProblemModal = (props) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user)
  const { industryProblems } = useSelector((state) => state.myImmersion)

  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const loggedUser = useSelector((state) => state.user.user.user)

  const initialState = {
    immersion_id: props.immersion.problemID,
    industry_problem_ID: props.immersion.problemID,
    company_ID: props.immersion.problemID,
    company_name: props.immersion.companyName,
    solutionDescription: '',
    status: 'pending',
    // parentGuardianApprovalForm: '',
    pitchDeck: '',
    pitchVideo: '',
    termsAndConditions: true,
    submissionDate: Date.now()
  }

  const { formData, handleChange, handleChangeFile } = useForm(initialState)
  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted, [
    'termsAndConditions'
  ])

  useEffect(() => {
    if (props.mode === 'edit') {
      dispatch(
        fetchUserProblemSolution(props.user_id, props.industry_solution_id)
      )
    }
  }, [dispatch, props.user_id, props.industry_solution_id, props.mode])

  const submitHandler = (status, e) => {
    if (props.userRole === 'student') {
      e.preventDefault()
      handleSubmit(async () => {
        setLoading(true)

        const data = new FormData()
        data.append('company_name', formData.company_name)
        data.append('immersion_id', formData.immersion_id)
        data.append('industry_problem_ID', formData.industry_problem_ID)
        data.append('company_ID', formData.company_ID)
        data.append('solutionDescription', formData.solutionDescription)
        data.append('status', formData.status)
        data.append('submissionDate', formData.submissionDate)

        if (formData.pitchDeck instanceof File) {
          data.append('documents', formData.pitchDeck)
        }

        if (formData.pitchVideo instanceof File) {
          data.append('documents', formData.pitchVideo)
        }

        try {
          const response = await axiosInstance.post('/upload/documents', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

          const { fileLocations } = response.data

          const updatedData = {
            ...formData,
            pitchDeck: fileLocations[0],
            pitchVideo: fileLocations[1]
          }

          try {
            await dispatch(createIndustryProblem(updatedData))
            toast.success('Solution submitted successfully')
            props.onHide()
            if (loggedUser.Instructor) {
              notificationSocket.emit('sendNotification', {
                sender: loggedUser,
                receivers: [loggedUser.Instructor.User],
                type: notificationTypes.INDUSTRY_PROBLEM.key,
                url: `/my-inbox#industry_problem_submissions`
              })
            }
          } catch (error) {
            toast.error(error.message || 'Failed to create industry problem')
          } finally {
            setLoading(false)
          }
        } catch (error) {
          toast.error('Failed to submit solution')
          setLoading(false)
        }
      })
    } else {
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
            <img src={mailIcon} className='step1-mail-icon' alt='mail' />
          </div>
          <Modal.Header style={{ marginTop: '30px' }}>
            <div
              className='portfolio-actions'
              style={{ borderRadius: ' 0px 28px' }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  width: '65px',
                  height: '65px'
                }}
                className='action-box cursor-pointer'
                onClick={() => props.onHide()}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
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
                <div className=''>Submitted by: &nbsp; {user.name}</div>
                {/* <ProfileHolder
                  className={'no-profile'}
                  classN={'username-submit'}
                  name={props.mode === 'edit' ? props.User.name : user?.name}
                /> */}
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
                  error={errors.solutionDescription}
                  showError={formSubmitted}
                />
              </div>
            </Col>
            <Col
              style={{ marginTop: '28px' }}
              className='d-flex flex-column justify-content-between'
            >
              <div>
                <UploadFileInput
                  filename={
                    formData.pitchDeck?.name ||
                    props.user_industry_solution?.pitchDeck ||
                    ''
                  }
                  placeholder={'Upload Pitch Deck (PDF)'}
                  name='pitchDeck'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                  error={errors.pitchDeck}
                  showError={formSubmitted}
                />
                <UploadFileInput
                  filename={
                    formData.pitchVideo?.name ||
                    props.user_industry_solution?.pitchVideo ||
                    ''
                  }
                  placeholder={'Add your link to your pitch video'}
                  name='pitchVideo'
                  onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                  mode={props.mode}
                  accept='video/*' // Pass the accept attribute to restrict uploads to video files
                  error={errors.pitchVideo}
                  showError={formSubmitted}
                  video={true}
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
                      industryProblem={true}
                    />

                    <SubmitButton
                      text={'APPROVE'}
                      disabled={formData.status !== 'pending'}
                      type='button'
                      onClick={() => submitHandler('approved')}
                      className={'approve-button'}
                      industryProblem={true}
                    />
                  </div>
                ) : (
                  <SubmitButton
                    text={loading ? 'Loading...' : 'SAVE'}
                    type='button'
                    onClick={
                      props.userRole === 'student'
                        ? (e) => submitHandler('', e)
                        : () => {}
                    }
                    industryProblem={true}
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
