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

const SpotlightApplyModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const initialState = {
    who_is_pitching: '',
    product: '',
    describe: '',
    outcome: '',
    // product_or_service: '',
    Business_Plan: '',
    Pitch_Deck: ''
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
      formData.Pitch_Deck.length == 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    }
    submitHandler()
  }

  const submitHandler = async () => {
    // e.preventDefault()
    handleSubmit(async () => {
      setLoading(true)
      const data = new FormData()

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
          Pitch_Deck: fileLocations[1]
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

  return (
    <ModalWrapper
      title={props.title}
      show={props.show}
      onHide={props.onHide}
      classes={'spotlight-apply-modal'}
    >
      <div className="row">
        <h1>baba</h1>
        <div className="col-12 col-lg-6">
          <input
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-input border"
            style={{ backgroundColor: '#fff' }}
            type="text"
            name="who_is_pitching"
            required
            onChange={(e) => handleChange(e)}
            placeholder={'Who is pitching?'}
          />
          <input
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-input border"
            type="text"
            name="product"
            onChange={(e) => handleChange(e)}
            required
            placeholder={'What is your product or service called?'}
          />
          <textarea
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border"
            type="text"
            onChange={(e) => handleChange(e)}
            rows={5}
            required
            name="describe"
            placeholder={'Briefly describe your product or service.'}
          />
          <textarea
            className="mt-0 mb-2 w-100 ps-2 py-3 pitch-inputtextarea border"
            type="text"
            onChange={(e) => handleChange(e)}
            required
            rows={5}
            name="outcome"
            placeholder={
              'What is the outcome that you are hoping for, once you’ve finished your pitch?'
            }
          />
        </div>
        <div className="col-12 col-lg-6">
          <UploadFileInput
            filename={formData.Pitch_Deck.name}
            placeholder={'Upload Pitch Deck (PDF)'}
            name="Pitch_Deck"
            onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
            mode={'new'}
          />
          <UploadFileInput
            filename={formData.Business_Plan.name}
            placeholder={'Upload Business Plan (PDF)'}
            name="Business_Plan"
            onChange={props.mode !== 'edit' ? handleChangeFile : () => {}}
            mode={'new'}
          />
          <div className="mt-2">
            <p className="span-subscribed-to-the-Learn-to-Start">
              You must be subscribed to the Learn to Start platform for a
              minimum of 1 year prior to applying. Applicants must be 18 years
              old or have a parent/guardian form to be considered for Spotlight.
            </p>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              name="agree"
              className="form-check-input spotlight-checkbox"
              onChange={(e) => {
                setAgreed(e.target.value)
              }}
            />
            <span className="term ps-3">
              I agree to the Spotlight{' '}
              <span
                className="text-blue blue-text font-bold"
                style={{ cursor: 'pointer' }}
                onClick={() => openSimpleSpotlightModal('termsAndConditions')}
              >
                Terms & Conditions
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-100 pb-5">
        <div className="row float-end">
          <button
            className="edit-account me-5"
            disabled={loading}
            onClick={() => {
              setLoading(true)
              verify()
            }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              // <IntlMessages id="general.save" />
              <>Submit</>
            )}
          </button>
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
  )
}

export default SpotlightApplyModal
