import React, { useState } from 'react'

import './style.css'
import '../style.css'
import '../../Spotlight/index.css'
import { toast } from 'react-toastify'

import { useForm } from '../../../hooks/useForm'
import { SubmitButton, UploadFileInput } from '../ContentItems'
import ModalWrapper from '../../../components/Modals/Spotlight/ModalWrapper'
import { ParentButtonApply } from '../../../components/Modals/Spotlight/ParentButtonApply'
import SpotlightSimpleModal from '../../../components/Modals/Spotlight/SpotlightSimpleModal'
import IntlMessages from '../../../utils/IntlMessages'
import { useDispatch } from 'react-redux'
import { handleSpotlightStatus } from '../../../redux/myImmersion/actions'
import notificationTypes from '../../../utils/notificationTypes'
import notificationSocket from '../../../utils/notificationSocket'
import DenySpotlightModal from './DenySpotlightModal'

const SpotlightModal = (props) => {
  console.log('props', props)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showDenyUploadModal, setShowDenyUploadModal] = useState(false)

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

  const [spotlightSimpleModal, setSpotlightSimpleModal] = useState({
    type: '',
    show: null
  })

  const closeSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = false
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }

  const { formData, handleChange, handleChangeFile } = useForm(
    initialState,
    props.spotlight,
    props.mode,
    loading
  )

  const submitHandler = (status, feedbackMessage) => {
    const res = dispatch(
      handleSpotlightStatus(props.spotlight_id, status, feedbackMessage)
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
        sender: props.User,
        receivers: [{ id: props.user_id }],
        type: type,
        url: '/my-immersion/step-2'
      })
    } else {
      toast.error('Failed to update user solution status.')
    }
  }

  return (
    <>
      <ModalWrapper
        title={props.title}
        show={props.show}
        onHide={props.onHide}
        classes={'spotlight-apply-modal'}
      >
        <div className='row'>
          <div className='col-12 col-lg-6'>
            <input
              className='apply-button mt-2 mb-2 w-100 ps-2 py-2 pitch-input border'
              style={{ backgroundColor: '#fff' }}
              type='text'
              name='name'
              value={formData.name}
              required
              onChange={
                props.mode !== 'edit' ? (e) => handleChange(e) : () => {}
              }
              placeholder={'Who is pitching?'}
            />
            <input
              className='apply-button mt-2 mb-2 w-100 ps-2 py-2 pitch-input border'
              type='text'
              name='productName'
              onChange={
                props.mode !== 'edit' ? (e) => handleChange(e) : () => {}
              }
              value={formData.productName}
              required
              placeholder={'What is your product or service called?'}
            />
            <textarea
              className='apply-button mt-2 mb-2 w-100 ps-2 py-2 pitch-inputtextarea border'
              type='text'
              onChange={
                props.mode !== 'edit' ? (e) => handleChange(e) : () => {}
              }
              value={formData.productDescription}
              rows={5}
              required
              name='productDescription'
              placeholder={'Briefly describe your product or service.'}
            />
            <textarea
              className='apply-button mt-0 mb-2 w-100 ps-2 py-2 pitch-inputtextarea border'
              type='text'
              onChange={
                props.mode !== 'edit' ? (e) => handleChange(e) : () => {}
              }
              value={formData.membershipType}
              required
              rows={5}
              name='membershipType'
              placeholder={'What type of membership are you applying for?'}
            />
          </div>
          <div className='apply-inputs col-12 col-lg-6'>
            <UploadFileInput
              filename={formData.parentGuardianApprovalForm}
              placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
              name='parentGuardianApprovalForm'
              onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
              mode={props.mode}
            />

            <UploadFileInput
              filename={formData.pitchDeck}
              placeholder={'Upload Pitch Deck (PDF)'}
              name='pitchDeck'
              onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
              mode={props.mode}
            />
            <UploadFileInput
              filename={formData.businessPlan}
              placeholder={'Upload Business Plan (PDF)'}
              name='businessPlan'
              onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
              mode={props.mode}
            />
            <div className='mt-2'>
              <p style={{ fontSize: '14px' }}>
                You must be subscribed to the Learn to Start platform for a
                minimum of one (1) year prior to applying. Applicants must be 18
                years old or have a parent/guardian form to be considered for
                Spotlight.
              </p>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-between w-100'>
          <div className='parent-form-spotlight'>
            <ParentButtonApply text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
          </div>
          {props.mode === 'edit' ? (
            <div className='d-flex justify-content-end'>
              <SubmitButton
                text={'DENY'}
                disabled={formData.status !== 'pending'}
                type='button'
                onClick={() => {
                  setShowDenyUploadModal(true)
                  props.onHide()
                }}
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
            <div className='row float-end'>
              <button
                className='apply-save-button edit-account me-5'
                disabled={true}
                onClick={() => {
                  setLoading(true)
                }}
              >
                {loading ? (
                  <span
                    className='spinner-border spinner-border-sm'
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  />
                ) : (
                  <IntlMessages id='general.save' />
                )}
              </button>
            </div>
          )}
        </div>
        {spotlightSimpleModal.type === 'termsAndConditions' && (
          <SpotlightSimpleModal
            boxShadow={true}
            show={
              spotlightSimpleModal.type === 'termsAndConditions' &&
              spotlightSimpleModal.show
            }
            onHide={() => closeSimpleSpotlightModal('termsAndConditions')}
            content={`<ul style=' display: flex;
                                flex-direction: column;
                                gap: 10px;'>
                       <li>To pitch in a Spotlight event, you must be at least 16 years old and a registered user inside of the Learn to Start platform with at least one year of experience on the platform.</li>
  <li>Participants will have 12 minutes to present their pitch deck, with additional minutes allocated to Q&A from the expert panel.</li>
  <li>Ventures submitted for Spotlight are not kept confidential, so teams should not include detailed descriptions of intellectual property in their submission. Participants retain ownership over their ventures, concepts, and work.</li>
  <li>All participants are expected to compete with integrity and shall not knowingly deceive panels or members of the advisory committee. All presented materials shall be offered as an accurate representation of knowledge and expectations and shall not contain false or misleading statements. Participants who violate this expectation of integrity are subject to disqualification and revocation of their Learn to Start platform membership.</li>
  <li>Spotlight participants authorize Learn to Start and its affiliates to use a summary of the content of their submission and any video and image submissions for publicity purposes related to Spotlight.</li>
  <li>The organizers of Spotlight reserve the right to disqualify any entry that, in their judgment, violates the spirit of the event guidelines.</li>
                    </ul>
                  `}
            title={'What is spotlight'}
          />
        )}{' '}
      </ModalWrapper>
      {showDenyUploadModal && (
        <DenySpotlightModal
          show={showDenyUploadModal}
          spotlight={props.spotlight}
          onHide={() => setShowDenyUploadModal(false)}
          submit={(feedbackMessage) => {
            submitHandler('rejected', feedbackMessage)
            setShowDenyUploadModal(false)
          }}
        />
      )}
    </>
  )
}

export default SpotlightModal
