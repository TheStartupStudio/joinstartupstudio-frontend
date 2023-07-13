import React, { useState } from 'react'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, ModalBody, Form, ToastHeader } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import defaultImage from '../../../assets/images/profile-image.png'
import './index.css'
import axiosInstance from '../../../utils/AxiosInstance'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import { readFile } from '../../../utils/canvasUtils'
import ImageCropper from '../../ImageCropper'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../../redux'

const AddCertification = (props) => {
  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputName, setName] = useState('')
  const [issuing_authority, setIssuing_authority] = useState('')
  const [date_issued, setDate_issued] = useState('')
  const [credential_id, setCredential_id] = useState('')
  const [credential_url, setCredential_url] = useState('')
  const inputImage = React.useRef()
  const [isType, setIsType] = useState()

  const handleChange = (event) => {
    const { name, value } = event.target
    props.setCertifieData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = e.target.files[0].size / 1024 / 1024
      if (fileSize > 0.5) {
        return toast.error('Image size exceeds 512KB.')
      } else {
        // var img = document.createElement('img')

        var reader = new FileReader()
        reader.onloadend = function (ended) {
          // img.src = ended.target.result
          // const formData = new FormData()
          // formData.append('imazhi', ended.target.result)
          dispatch(setImageCropperData(ended.target.result))
          setImageUrl(ended.target.result)
        }
        reader.readAsDataURL(e.target.files[0])
        // img.onload = function () {
        //   if ((this.width > 150) | (this.height > 150)) {
        //     return toast.error('Dimensions: 150 x 150px')
        //   } else {
        //   props.setCertificateImage(e.target.files[0])
        //   }
        // }
      }
    }

    // }
    // }
    // }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      dialogClassName="my-modal"
      className="edit_modal mt-md-5"
    >
      <Modal.Header className="edit-modal p-0 mx-4 general-modal-header">
        <h3 className="mt-4 mb-0 edit-modal-box-title">
          <IntlMessages id="portfolio.EDIT_LICENSES_CERTIFICATIONS" />
        </h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={() => {
            setIsType(false)
            props.onHide()
          }}
        />
      </Modal.Header>
      <ModalBody className="px-4 pb-0 ">
        <div className="row">
          <h4 className="mx-sm-auto">
            <IntlMessages id="portfolio.Add_Licenses_or_Certifications" />
          </h4>
          <div className="col-12 col-sm-4 col-lg-4 col-xxl-3 text-start text-md-center pe-sm-2">
            <div>
              {loading ? (
                <div className="image-box my-auto mx-auto border">
                  <span className="loading-image loading-image-sm mt-auto" />
                </div>
              ) : (
                <>
                  {imageUrl !== '' ? (
                    <div
                      className="img-placeholder position-relative"
                      style={{ height: '200px', width: '182px' }}
                    >
                      <ImageCropper
                        width={150}
                        height={150}
                        setImageUrl={setImageUrl}
                        imageUrl={imageUrl}
                      />
                    </div>
                  ) : (
                    <img
                      id="img"
                      src={defaultImage}
                      className="mt-2 image-box border"
                    />
                  )}
                </>
              )}
              <div className="input-group mt-3 mx-auto text-center">
                <div className="profile-image text-center mx-auto">
                  <label
                    className="edit-label text-center mx-md-auto"
                    style={{ width: '182px' }}
                  >
                    <input
                      type="file"
                      id="inputGroupFile"
                      name="profile_image"
                      accept="image/jpg, image/jpeg, image/png"
                      ref={inputImage}
                      className="d-none"
                      style={{ width: '182px' }}
                      onChange={(e) => {
                        imageChange(e)
                      }}
                    />

                    <div
                      className="mt-md-1 d-flex justify-content-center"
                      style={{ alignItems: 'center' }}
                    >
                      <IntlMessages id="portfolio.upload_new_license_image" />
                      <FontAwesomeIcon
                        icon={faFileUpload}
                        className="edit-modal-sm ml-2"
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-start justify-content-md-center">
                <p
                  className=" image-text-file mt-3 px-1 text-start"
                  style={{ width: '171px' }}
                >
                  <IntlMessages id="portfolio.file_type" />
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-8 add-modal mt-md-0 col-lg-8 col-xxl-9 px-lg-5">
            <FormattedMessage id="portfolio.add_new_Certified">
              {(placeholder) => (
                <input
                  className="my-2 w-100 py-3  ps-2"
                  type="text"
                  name="name"
                  placeholder={placeholder}
                  onChange={(data) => {
                    setName(data.target.value)
                    handleChange(data)
                  }}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="portfolio.add_new_Certified_Issuing_Authority">
              {(placeholder) => (
                <input
                  className="my-2 w-100 py-3  ps-2"
                  type="text"
                  name="issuing_authority"
                  placeholder={placeholder}
                  onChange={(data) => {
                    setIssuing_authority(data.target.value)
                    handleChange(data)
                  }}
                />
              )}
            </FormattedMessage>
            <div className="d-flex flex-grow-1">
              <div className="d-flex w-100 date_issued_div">
                <FormattedMessage id="portfolio.add_new_Certified_Date_Issued">
                  {(placeholder) => (
                    <input
                      className="my-2 py-3 col-12 col-md-11 ps-2 pe-2 data"
                      type={isType ? 'date' : 'text'}
                      name="date_issued"
                      placeholder={placeholder}
                      min="2000-03"
                      max={new Date().toLocaleDateString('fr-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                      onfocus={() => setIsType(true)}
                      onFocus={() => setIsType(true)}
                      onChange={(data) => {
                        setDate_issued(data.target.value)
                        handleChange(data)
                      }}
                    />
                  )}
                </FormattedMessage>
              </div>
              <div className="d-flex w-100">
                <FormattedMessage id="portfolio.add_new_Certified_Credential_ID">
                  {(placeholder) => (
                    <input
                      className="my-2 py-3 w-100 float-end ps-2"
                      type="text"
                      name="credential_id"
                      placeholder={placeholder}
                      onChange={(data) => {
                        setCredential_id(data.target.value)
                        handleChange(data)
                      }}
                    />
                  )}
                </FormattedMessage>
              </div>
            </div>
            <FormattedMessage id="portfolio.add_new_Certified_Credential URL">
              {(placeholder) => (
                <input
                  className="my-2 w-100 py-3  ps-2"
                  type="text"
                  required
                  name="credential_url"
                  placeholder={placeholder}
                  onChange={(data) => {
                    setCredential_url(data.target.value)
                    handleChange(data)
                  }}
                />
              )}
            </FormattedMessage>
          </div>
        </div>
      </ModalBody>
      <Modal.Footer className="border-0 py-0 my-0 mb-2 position-relative">
        <div className="row p-0 mb-3">
          <div className="col-md-11">
            <button
              className={`float-end edit-account ${
                props.loading && 'disabled '
              }`}
              onClick={() => {
                if (
                  inputName.length == 0 ||
                  issuing_authority.length == 0 ||
                  date_issued.length == 0 ||
                  credential_url.length == 0
                ) {
                  return toast.error(
                    <IntlMessages id="portfolio.all_field_needet" />
                  )
                } else {
                  !props.loading && props.onSave()
                }
              }}
            >
              {props.loading ? (
                <IntlMessages id="general.loading" />
              ) : (
                <IntlMessages id="general.save" />
              )}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default AddCertification
