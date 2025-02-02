import React, { useEffect, useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import './SpotlightModal.css'
import '../../../pages/StartupProfile/style/index.css'
import SpotlightSimpleModal from './SpotlightSimpleModal'
import {
  TermsAndConditionsCheckbox,
  UploadFileInput
} from '../../../pages/MyImmersion/ContentItems'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import { ParentButtonApply } from './ParentButtonApply'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubmitModal from './SpotlightSubmitModal'
import notificationSocket from '../../../utils/notificationSocket'
import { useSelector } from 'react-redux'
import notificationTypes from '../../../utils/notificationTypes'
import DeleteModal from './SpotlightDeleteModal'
import deleteIcon from '../../../assets/images/delete-icon/deleteIconSpot.png'
import { LtsButton } from '../../../ui/ContentItems'

const SpotlightApplyModal = (props) => {
  const [loading, setLoading] = useState(false)
  const loggedUser = useSelector((state) => state.user.user.user)
  const [showDeleteImmersionModal, setShowDeleteImmersionModal] =
    useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showMainPitch, setShowMainPitch] = useState(true)
  const [spotlightSimpleModal, setSpotlightSimpleModal] = useState({
    type: '',
    show: null
  })
  // eslint-disable-next-line no-unused-vars
  const [formSubmitted, setFormSubmitted] = useState(false)
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

  const closeSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = false
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }

  const {
    formData,
    handleChange,
    handleChangeFile,
    handleChangeCheckbox,
    setFormData
  } = useForm(initialState, props.isApplicationSaved ? 'edit' : 'new', loading)
  const { handleSubmit } = useValidation(formData, setFormSubmitted)

  useEffect(() => {
    const savedData = localStorage.getItem('spotlightApplicationData')
    if (savedData && props.isApplicationSaved) {
      const parsedData = JSON.parse(savedData)

      const deserializeFile = (fileData) => {
        if (fileData?.base64) {
          const byteString = atob(fileData.base64.split(',')[1])
          const mimeType = fileData.base64
            .split(',')[0]
            .split(':')[1]
            .split(';')[0]
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)

          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          return new File([ab], fileData.name, { type: mimeType })
        }

        return null
      }

      parsedData.businessPlan = deserializeFile(parsedData.businessPlan)
      parsedData.pitchDeck = deserializeFile(parsedData.pitchDeck)
      parsedData.parentGuardianApprovalForm = deserializeFile(
        parsedData.parentGuardianApprovalForm
      )

      setFormData(parsedData)
    }
  }, [setFormData, props.isApplicationSaved])

  const verify = () => {
    if (!formData.termsAndConditions) {
      setLoading(false)
      return toast.error('Please agree with term and condition.')
    } else if (
      formData.name.length === 0 ||
      formData.productName.length === 0 ||
      formData.productDescription.length === 0 ||
      formData.membershipType.length === 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    } else if (
      formData.businessPlan.length === 0 ||
      formData.pitchDeck.length === 0 ||
      formData.parentGuardianApprovalForm.length === 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    }
    submitHandler()
  }

  const submitHandler = async () => {
    handleSubmit(async () => {
      setLoading(true)
      const data = new FormData()

      if (formData.businessPlan instanceof File) {
        data.append('documents', formData.businessPlan)
      }
      if (formData.pitchDeck instanceof File) {
        data.append('documents', formData.pitchDeck)
      }
      if (formData.parentGuardianApprovalForm instanceof File) {
        data.append('documents', formData.parentGuardianApprovalForm)
      }
      try {
        const response = await axiosInstance.post('/upload/documents', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        const { fileLocations } = response.data

        const updatedData = {
          ...formData,
          businessPlan: fileLocations[0],
          pitchDeck: fileLocations[1],
          parentGuardianApprovalForm: fileLocations[2]
        }

        await axiosInstance
          .post('/immersion/spotlights', updatedData)
          .then(() => {
            notificationSocket.emit('sendNotification', {
              sender: loggedUser,
              receivers: [loggedUser.Instructor.User],
              type: notificationTypes.SPOTLIGHT.key,
              url: `/my-inbox#spotlight_applications`
            })
            toast.success('Application submitted successfully!')
            openSubmitModal()
            props.onHide()
            props.onSuccess()
            props.removeSavedApplication()
          })
          .catch((err) => {
            toast.error(
              err.response?.data?.message || 'Failed to submit spotlight data.'
            )
          })
      } catch (error) {
        toast.error('Failed to submit solution')
        setLoading(false)
      } finally {
        setLoading(false)
      }
    })
  }

  const openSubmitModal = () => {
    setShowSubmitModal(true)
    setShowMainPitch(false)
  }

  const closeSubmitModal = () => {
    setShowSubmitModal(false)
    setShowMainPitch(true)
  }

  return (
    <>
      {showDeleteImmersionModal && (
        <DeleteModal
          imgClassName='showImgIcon'
          show={showDeleteImmersionModal}
          onClose={() => setShowDeleteImmersionModal(false)}
          onDelete={props.removeSavedApplication}
          title='Delete Application'
          message='Are you sure you want to delete this application?'
          titleClassName='deleteapplspot'
        />
      )}

      {showSubmitModal && (
        <SubmitModal
          show={showSubmitModal}
          onClose={closeSubmitModal}
          title='Submit Application'
          message='Are you sure you want to submit this application?'
          onSubmit={() => {
            closeSubmitModal()
            submitHandler()
          }}
        />
      )}
      {showMainPitch && (
        <ModalWrapper
          title={props.title}
          show={props.show}
          onHide={props.onHide}
          classes={'spotlight-apply-modal'}
          size='lg'
        >
          <div className='row spot-apply-cont-row'>
            <div className='col-12 col-lg-6'>
              <input
                className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-input border'
                style={{ backgroundColor: '#fff' }}
                type='text'
                name='name'
                required
                onChange={(e) => handleChange(e)}
                placeholder={'Who is pitching?'}
                value={formData.name}
              />
              <input
                className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-input border'
                type='text'
                name='productName'
                onChange={(e) => handleChange(e)}
                required
                placeholder={'What is your product or service called?'}
                value={formData.productName}
              />
              <textarea
                className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border'
                type='text'
                onChange={(e) => handleChange(e)}
                rows={5}
                required
                name='productDescription'
                placeholder={'Briefly describe your product or service.'}
                value={formData.productDescription}
              />
              <textarea
                className='apply-button mt-0 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border'
                type='text'
                onChange={(e) => handleChange(e)}
                required
                rows={5}
                name='membershipType'
                placeholder={'What type of mentorship are you applying for?'}
                value={formData.membershipType}
              />
            </div>
            <div className='apply-inputs col-12 col-lg-6'>
              <div className='parent-form-spotlight'>
                <ParentButtonApply text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
              </div>
              <UploadFileInput
                filename={formData.parentGuardianApprovalForm?.name}
                placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
                name='parentGuardianApprovalForm'
                onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                mode={'new'}
              />

              <UploadFileInput
                filename={formData.pitchDeck?.name}
                placeholder={'Upload Pitch Deck (PDF)'}
                name='pitchDeck'
                onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                mode={'new'}
              />
              <UploadFileInput
                filename={formData.businessPlan?.name}
                placeholder={'Upload Business Plan (PDF)'}
                name='businessPlan'
                onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
                mode={'new'}
              />
              <div className='mt-2'>
                <p className='span-subscribed-to-the-Learn-to-Start'>
                  You must be subscribed to the Learn to Start platform for a
                  minimum of one (1) year prior to applying. Applicants must be
                  18 years old or have a parent/guardian form to be considered
                  for Spotlight.
                </p>
              </div>
              <TermsAndConditionsCheckbox
                className={'spot-apply-terms'}
                text={'I agree to the Spotlight'}
                blueText={'Terms & Conditions'}
                name={'termsAndConditions'}
                onChange={handleChangeCheckbox}
                checked={formData?.termsAndConditions}
                // error={errors.termsAndConditions}
                // showError={formSubmitted}
              />
            </div>
          </div>
          <div
            className='w-100 pb-2'
            style={{ marginTop: '20px', marginBottom: '-55px' }}
          >
            <div
              className={`d-flex justify-content-${
                !props.isApplicationSaved ? 'end' : 'between'
              } align-items-center flex-wrap spot-modal-end-cont`}
            >
              <p
                href='#'
                className={`${
                  !props.isApplicationSaved ? 'd-none' : ''
                } m-0 cursor-pointer d-flex align-items-center deletapplspot`}
                onClick={() => setShowDeleteImmersionModal(true)}
              >
                <img src={deleteIcon} width={23} height={24}></img>
                Delete Application
              </p>

              <div
                className='d-flex align-items-center saving-submit-row-cont'
                style={{ flexWrap: 'wrap' }}
              >
                <LtsButton
                  className={'cancel-btns py-2 savecont-apply-spot'}
                  text={'Save and Continue Later'}
                  background={'transparent'}
                  color={'#000'}
                  border={'1px solid #ccc'}
                  onClick={() => props.onSave(formData)}
                  imgClassName={'showImgIcon'}
                />

                <LtsButton
                  text={'SUBMIT APPLICATION'}
                  loading={loading}
                  background={'#52C7DE'}
                  className={'ms-2 cancel-btns py-2 submitappl-spot'}
                  color={'#fff'}
                  border={'none'}
                  onClick={() => {
                    setLoading(true)
                    verify()
                  }}
                />
              </div>
            </div>
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
      )}
    </>
  )
}

export default SpotlightApplyModal
