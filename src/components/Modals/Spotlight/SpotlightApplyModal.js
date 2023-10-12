import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../../utils/IntlMessages'
import './SpotlightModal.css'
import '../../../pages/StartupProfile/style/index.css'

const SpotlightApplyModal = (props) => {
  const [fileName, setfileName] = useState()
  const [file, setfile] = useState()
  const [fileName1, setfileName1] = useState()
  const [file1, setfile1] = useState()
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [data, setData] = useState({
    who_is_pitching: '',
    product: '',
    describe: '',
    outcome: '',
    product_or_service: '',
    Business_Plan: '',
    Pitch_Deck: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((old) => ({
      ...old,
      [name]: value
    }))
  }

  const verify = () => {
    if (!agreed) {
      setLoading(false)
      return toast.error('Please agree with term and condition.')
    } else if (
      data.who_is_pitching.length == 0 ||
      data.product.length == 0 ||
      data.describe.length == 0 ||
      data.outcome.length == 0
      // ||
      // data.product_or_service == 0
    ) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    } else if (file.length == 0 || file1.length == 0) {
      setLoading(false)
      return toast.error('Please fill in all the fields.')
    }
    handleSubmit()
  }
  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('document', file)
    await axiosInstance
      .post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(async (firstResponse) => {
        const formData1 = new FormData()
        formData1.append('document', file1)
        await axiosInstance
          .post('/upload/document', formData1, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(async (response) => {
            await axiosInstance
              .post('/users/sendPitch', {
                ...data,
                Business_Plan: firstResponse.data.fileLocation,
                Pitch_Deck: response.data.fileLocation
              })
              .then((response) => {
                setLoading(false)
              })
          })
      })
      .catch((err) => err)
  }
  return (
    <ModalWrapper
      title={props.title}
      show={props.show}
      onHide={props.onHide}
      class={'spotlight-apply-modal'}
    >
      <div className="row">
        <div className="col-12 col-lg-6">
          <input
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-input"
            style={{ backgroundColor: '#fff' }}
            type="text"
            name="who_is_pitching"
            required
            onChange={(e) => handleChange(e)}
            placeholder={'Who is pitching?'}
          />
          <input
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-input"
            type="text"
            name="product"
            onChange={(e) => handleChange(e)}
            required
            placeholder={'What is your product or service called?'}
          />
          <textarea
            className="mt-2 mb-2 w-100 ps-2 py-3 pitch-inputtextarea"
            type="text"
            onChange={(e) => handleChange(e)}
            rows={5}
            required
            name="describe"
            placeholder={'Briefly describe your product or service.'}
          />
          <textarea
            className="mt-0 mb-2 w-100 ps-2 py-3 pitch-inputtextarea"
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
          {/*<input*/}
          {/*  className="mt-2 mb-2 w-100 ps-2 py-3 pitch-input"*/}
          {/*  type="text"*/}
          {/*  onChange={(e) => handleChange(e)}*/}
          {/*  name="product_or_service"*/}
          {/*  placeholder={'What is your product or service called?'}*/}
          {/*/>*/}
          <div className="">
            <label className="edit-label text-center mt-2 pitch-input">
              <input
                type="file"
                onChange={(e) => {
                  setfileName(e.target.files[0].name)
                  setfile(e.target.files[0])
                }}
                id="inputGroupFile"
                name="profile_image"
                accept="application/pdf"
                className="d-none "
              />
              <div className="mt-md-1 d-flex justify-content-center edit-bio-upload-image pb-5">
                <span className="ps-2 my-auto">
                  {fileName ? fileName : 'Upload Pitch Deck (PDF)'}
                </span>
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className="edit-modal-sm ms-auto float-end my-auto "
                />
              </div>
            </label>
          </div>
          <div className="mt-3">
            <label className="edit-label text-center pitch-input">
              <input
                type="file"
                id="inputGroupFile"
                name="Business_Plan"
                accept="application/pdf"
                className="d-none"
                onChange={(e) => {
                  setfileName1(e.target.files[0].name)
                  setfile1(e.target.files[0])
                }}
              />
              <div className="mt-md-1 d-flex justify-content-center edit-bio-upload-image">
                <span className="ps-2 my-auto">
                  {fileName1 ? fileName1 : 'Upload Business Plan (PDF)'}
                </span>
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className="edit-modal-sm ms-auto float-end"
                />
              </div>
            </label>
          </div>
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
              <span className="text-blue blue-text font-bold">
                Terms & Conditions
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-100 pb-5">
        {/*<div className="row float-start">*/}
        {/*  <button*/}
        {/*    className="download-parent-guardian-form ms-2 px-5"*/}
        {/*    disabled={loading}*/}
        {/*    onClick={() => {*/}
        {/*      setLoading(true)*/}
        {/*      verify()*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {loading ? (*/}
        {/*      <span className="spinner-border spinner-border-sm" />*/}
        {/*    ) : (*/}
        {/*      <>{'Download Parent/Guardian Form'}</>*/}
        {/*    )}*/}
        {/*  </button>*/}
        {/*</div>*/}
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
              <IntlMessages id="general.save" />
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default SpotlightApplyModal
