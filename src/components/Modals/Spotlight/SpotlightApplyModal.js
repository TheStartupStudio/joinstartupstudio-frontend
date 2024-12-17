import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import './SpotlightModal.css'
import '../../../pages/StartupProfile/style/index.css'
import SpotlightSimpleModal from './SpotlightSimpleModal'
import { UploadFileInput } from '../../../pages/MyImmersion/ContentItems'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import { ParentButtonApply } from './ParentButtonApply'
import { faFileUpload, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeleteImmersionModal from '../../admin/MyImmersion/DeleteImmersionModal'
import SubmitModal from './SpotlightSubmitModal'

const SpotlightApplyModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showDeleteImmersionModal, setShowDeleteImmersionModal] = useState(false);
  const[showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMainPitch, setShowMainPitch] = useState(true);
  const initialState = {
    who_is_pitching: '',
    product: '',
    describe: '',
    outcome: '',
    // product_or_service: '',
    Business_Plan: '',
    Pitch_Deck: '',
    parentGuardianApprovalForm: ''
  }
  const [spotlightSimpleModal, setSpotlightSimpleModal] = useState({
    type: '',
    show: null
  })

  const openSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = true
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }
  const closeSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = false
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }

  const { formData, handleChange, handleChangeFile } = useForm(
    initialState,
    'new',
    loading
  )
  const { handleSubmit } = useValidation(formData, setFormSubmitted)

  const verify = () => {
    if (!agreed) {
      setLoading(false)
      return toast.error('Please agree with term and condition.')
    } else if (
      formData.who_is_pitching.length == 0 ||
      formData.product.length == 0 ||
      formData.describe.length == 0 ||
      formData.outcome.length == 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    } else if (
      formData.Business_Plan.length == 0 ||
      formData.Pitch_Deck.length == 0 ||
      formData.parentGuardianApprovalForm.length == 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    }
    submitHandler()
    openSubmitModal();
  }

  const submitHandler = async () => {
    // e.preventDefault()
    handleSubmit(async () => {
      setLoading(true)
      const data = new FormData()
      if (formData.parentGuardianApprovalForm instanceof File) {
        data.append('documents', formData.parentGuardianApprovalForm)
      }
      if (formData.Business_Plan instanceof File) {
        data.append('documents', formData.Business_Plan)
      }
      if (formData.Pitch_Deck instanceof File) {
        data.append('documents', formData.Pitch_Deck)
      }

      try {
        const response = await axiosInstance.post('/upload/documents', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        const { fileLocations } = response.data

        const updatedData = {
          ...formData,
          Business_Plan: fileLocations[0],
          Pitch_Deck: fileLocations[1],
          parentGuardianApprovalForm: fileLocations[2]
        }

        await axiosInstance
          .post('/users/sendPitch', {
            updatedData
          })
          .then((response) => {
            toast.success(response.data.message)
            props.onHide()
            setLoading(false)
          })
      } catch (error) {
        console.error(error)
        toast.error('Failed to submit solution')
        setLoading(false)
      }
    })
  }
  const handleDeleteUser = () => {
    setShowDeleteImmersionModal(true); 
    setShowMainPitch(false);
    
  };

  const closeDeleteUserModal = () => {
    setShowDeleteImmersionModal(false); 
    setShowMainPitch(true);
  };

  const openSubmitModal = () => {
    setShowSubmitModal(true);
    setShowMainPitch(false);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setShowMainPitch(true);
  };

  return (
    <>
      {showDeleteImmersionModal && (
        <DeleteImmersionModal
          show={showDeleteImmersionModal}
          onClose={() => setShowDeleteImmersionModal(false)}
          onDelete={() => {
            closeDeleteUserModal()
          }}
          title='Delete Application'
          message='Are you sure you want to delete this application?'
        />
      )}


      { showSubmitModal && (
        <SubmitModal
          show={showSubmitModal}
          onClose={closeSubmitModal}
          title='Submit Application'
          message='Are you sure you want to submit this application?'
          onSubmit={() => {
            closeSubmitModal();
            submitHandler();
          }}
        />
      )
}
{
  showMainPitch && (
    
    <ModalWrapper
      title={props.title}
      show={props.show}
      onHide={props.onHide}
      classes={'spotlight-apply-modal'}
    >
      <div className='row'>
        <div className='col-12 col-lg-6'>
          <input
            className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-input border'
            style={{ backgroundColor: '#fff' }}
            type='text'
            name='who_is_pitching'
            required
            onChange={(e) => handleChange(e)}
            placeholder={'Who is pitching?'}
          />
          <input
            className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-input border'
            type='text'
            name='product'
            onChange={(e) => handleChange(e)}
            required
            placeholder={'What is your product or service called?'}
          />
          <textarea
            className='apply-button mt-2 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border'
            type='text'
            onChange={(e) => handleChange(e)}
            rows={5}
            required
            name='describe'
            placeholder={'Briefly describe your product or service.'}
          />
          <textarea
            className='apply-button mt-0 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border'
            type='text'
            onChange={(e) => handleChange(e)}
            required
            rows={5}
            name='outcome'
            placeholder={'What type of mentorship are you applying for?'}
          />
        </div>
        <div className='apply-inputs col-12 col-lg-6'>
          <div className='parent-form-spotlight'>
            <ParentButtonApply text={'DOWNLOAD PARENT/GUARDIAN FORM'} />
          </div>
          <UploadFileInput
            filename={formData.parentGuardianApprovalForm.name}
            placeholder={'Upload Parent/Guardian Approval Form(PDF)'}
            name='parentGuardianApprovalForm'
            onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
            mode={'new'}
          />

          <UploadFileInput
            filename={formData.Pitch_Deck.name}
            placeholder={'Upload Pitch Deck (PDF)'}
            name='Pitch_Deck'
            onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
            mode={'new'}
          />
          <UploadFileInput
            filename={formData.Business_Plan.name}
            placeholder={'Upload Business Plan (PDF)'}
            name='Business_Plan'
            onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
            mode={'new'}
          />
          <div className='mt-2'>
            <p className='span-subscribed-to-the-Learn-to-Start'>
              You must be subscribed to the Learn to Start platform for a
              minimum of one (1) year prior to applying. Applicants must be 18
              years old or have a parent/guardian form to be considered for
              Spotlight.
            </p>
          </div>
          <div className='d-flex align-items-center'>
            <input
              type='checkbox'
              name='agree'
              className='form-check-input spotlight-checkbox'
              onChange={(e) => {
                setAgreed(e.target.value)
              }}
            />
            <span className='term ps-3'>
              I agree to the Spotlight{' '}
              <span
                className='text-blue blue-text font-bold'
                style={{ cursor: 'pointer' }}
                onClick={() => openSimpleSpotlightModal('termsAndConditions')}
              >
                Terms & Conditions
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className='w-100 pb-5' style={{ marginTop: '15px', marginBottom: '-55px' }}>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          <p
            href='#'
            className='m-0 cursor-pointer d-flex align-items-center'
            onClick={handleDeleteUser}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className='me-2' />
            Delete Application
          </p>

          <div className='d-flex align-items-center'>
            <button onClick={props.onSave} className='save-and-continue-text me-3 d-flex align-items-center'>
              <i className='bi bi-bookmark me-1'></i> Save and Continue Later
            </button>
            <button
              className='apply-save-button edit-account '
              disabled={loading}
              onClick={() => {
                
                setLoading(true);
                verify();
                
              }}
            >
              {loading ? (
                <span
                  className='spinner-border spinner-border-sm'
                  style={{ fontSize: '13px', fontWeight: 600 }}
                />
              ) : (
                <>SUBMIT Application</>
              )}
            </button>
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
)}

export default SpotlightApplyModal
