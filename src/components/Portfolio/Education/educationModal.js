import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {
  faGlobe,
  faFileUpload,
  faLink
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import DeleteDialogModal from '../BackgroundModals/deleteDialogModal'
import DeleteConfirmedModal from '../BackgroundModals/deleteConfirmedModal'
import { formatDate } from '../../../utils/helpers'
import ImageCropper from '../../ImageCropper'
import { readFile } from '../../../utils/canvasUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData } from '../../../redux'

export const EducationModal = (props) => {
  const defaultEducationData = {
    type: 'education',
    college: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    present: false,
    description: '',
    external_links: { link: '', file: '' },
    image_url: ''
  }

  const [educationData, setEducationData] = useState(defaultEducationData)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const inputImage = React.useRef(null)
  const [showDeleteDialogModal, setShowDeleteDialogModal] = useState(false)
  const [showDeleteConfirmedModal, setShowDeleteConfirmedModal] =
    useState(false)
  const endDateRef = useRef()

  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.currentEducation.length === 0) return
    setEducationData({
      ...props.currentEducation,
      start_date: formatDate(props.currentEducation.start_date),
      end_date: formatDate(props.currentEducation.end_date)
    })
    setSelectedImage(props.currentEducation.image_url)
    setIsUpdating(true)
  }, [props.currentEducation])

  const handleChange = (event) => {
    const { name, value, checked } = event.target

    if (name === 'link' || name === 'file') {
      setEducationData((prevValues) => ({
        ...prevValues,
        external_links:
          name === 'link'
            ? { link: value, file: prevValues.external_links.file }
            : { link: prevValues.external_links.link, file: value }
      }))
    } else {
      if (name === 'present') {
        endDateRef.current.value = ''
        setEducationData((prevValues) => ({
          ...prevValues,
          end_date: null,
          present: checked
        }))
      } else {
        setEducationData((prevValues) => ({
          ...prevValues,
          [name]: value
        }))
      }
    }
  }

  const checkDate = () => {
    if (educationData['start_date'] > educationData['end_date']) {
      toast.error('End date can’t be earlier than start date')
      return false
    } else {
      return true
    }
  }

  const cleanEndDate = () => {
    setEducationData((old) => ({
      ...old,
      end_date: null
    }))
  }

  const imageChange = async (e) => {
    const file = e.target.files[0]
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 0.5) {
        return toast.error('Image size exceeds 512KB.')
      }

      setEducationData((prevValues) => ({
        ...prevValues,
        image_url: null
      }))

      let imageData = await readFile(file)
      dispatch(setImageCropperData(imageData))
      previewImage(file)
    }
  }

  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      setSelectedImage(reader.result)
    }
  }

  const addEducation = async () => {
    if (!educationData['present']) {
      if (!checkDate()) {
        setLoading(false)
        return
      }
    }
    setLoading(true)
    const newEducation = educationData
    for (var key in educationData) {
      if (
        key === 'external_links' ||
        key === 'image_url' ||
        key === 'description' ||
        (key === 'end_date' && newEducation.present) ||
        (key === 'present' && newEducation.end_date)
      )
        continue
      if (educationData[key] === null || educationData[key] == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }
    }

    if (general.croppedImage) {
      const formData = new FormData()
      formData.append('img', general.croppedImage)
      await axiosInstance
        .post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          setLoading(false)
          newEducation.image_url = response.data.fileLocation
        })
        .catch((err) => {
          return toast.error('Image upload failed, please try again!')
        })
    }

    if (!newEducation.end_date) newEducation.end_date = null

    await axiosInstance
      .post(`/userBackground`, newEducation)
      .then((res) => {
        setLoading(false)
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        props.addEducation(res.data)
        props.onHide()
        setSelectedImage()
        setEducationData(defaultEducationData)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const updateEducation = async () => {
    setLoading(true)
    const newEducation = educationData
    for (var key in defaultEducationData) {
      if (
        key === 'external_links' ||
        key === 'image_url' ||
        key === 'description' ||
        (key === 'end_date' && newEducation.present) ||
        (key === 'present' && newEducation.end_date)
      )
        continue
      if (newEducation[key] === null || newEducation[key] == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }
    }

    if (general.croppedImage) {
      const formData = new FormData()
      formData.append('img', general.croppedImage)
      await axiosInstance
        .post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          setLoading(false)
          newEducation.image_url = response.data.fileLocation
        })
        .catch((err) => {
          setLoading(false)
          return toast.error('Image upload failed, please try again!')
        })
    }

    if (!newEducation.end_date) newEducation.end_date = null

    await axiosInstance
      .put(`/userBackground/${newEducation.id}`, newEducation)
      .then((res) => {
        setLoading(false)
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        props.updateEducation(newEducation)
        props.onHide()
        setSelectedImage()
        setEducationData(defaultEducationData)
        setIsUpdating(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  const deleteBackground = async () => {
    setDeleteLoading(true)
    await axiosInstance
      .delete(`/userBackground/${educationData.id}`)
      .then((res) => {
        // toast.success(<IntlMessages id='alert.my_account.success_change' />)
        // props.updateExperience(newExperience)
        props.onHide()
        setDeleteLoading(false)
        props.deleteBackground(educationData.id)
        setShowDeleteDialogModal(false)
        setShowDeleteConfirmedModal(true)
        setSelectedImage()
        setEducationData(defaultEducationData)
        setIsUpdating(false)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
        props.onHide()
        setShowDeleteDialogModal(false)
        setShowDeleteConfirmedModal(false)
        setSelectedImage()
        setEducationData(defaultEducationData)
        setIsUpdating(false)
      })
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        className='edit-modal edit-profile-modal edit-experience-modal'
      >
        <Modal.Header className='pb-0 mx-4 general-modal-header'>
          <h3 className='mt-4 mb-0 contact-bio'>
            {!isUpdating ? 'ADD NEW EDUCATION' : 'EDIT EDUCATION'}
          </h3>
          <button
            type='button'
            className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setSelectedImage()
              setEducationData(defaultEducationData)
              setIsUpdating(false)
            }}
          />
        </Modal.Header>
        <Modal.Body className='px-4'>
          <div className='row'>
            <div className='col-12'>
              <h4>EDUCATION</h4>
            </div>
            <div className='col-12 col-lg-3 upload-container my-2'>
              <div className='upload-image me-2 mb-1'>
                {general.imageCropperData ? (
                  <div
                    className='img-placeholder position-relative'
                    style={{ height: '150px' }}
                  >
                    <ImageCropper
                      width={120}
                      height={100}
                      setImageUrl={setSelectedImage}
                      imageUrl={selectedImage}
                    />
                  </div>
                ) : (
                  <>
                    {selectedImage ? (
                      <img
                        src={
                          educationData.image_url
                            ? educationData.image_url
                            : selectedImage
                        }
                        style={{ width: '100%', height: '100%' }}
                        alt='Thumb'
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlus}
                        className=''
                        style={{
                          width: '56px',
                          height: '56px',
                          color: '#BBBDBF',
                          cursor: 'pointer'
                        }}
                        onClick={() => inputImage.current.click()}
                      />
                    )}
                  </>
                )}
              </div>
              {/* <p>Max image width: 85px</p> */}
              <p className='mt-2'>Max image size: 512KB</p>
              <p className='mb-1'>Max image width: 85px</p>
              <label className='text-center py-2'>
                <input
                  type='file'
                  id='inputGroupFile'
                  name='profile_image'
                  accept='image/*'
                  className='d-none'
                  ref={inputImage}
                  onChange={imageChange}
                />
                <div className='image-upload d-flex'>
                  <p>Choose Image</p>
                  <FontAwesomeIcon
                    icon={faFileUpload}
                    className='edit-modal-sm ms-4'
                    style={{ height: '27px', width: '20px' }}
                  />
                </div>
              </label>
            </div>
            <div className='col-lg-9 col-12'>
              <input
                className='my-2'
                type='text'
                name='college'
                value={educationData?.college}
                onChange={handleChange}
                placeholder='University or College Name'
              />
              <input
                className='my-2'
                type='text'
                name='degree'
                value={educationData?.degree}
                onChange={handleChange}
                placeholder='Degree Earned (Example: Bachelor`s)'
              />
              <input
                className='my-2'
                type='text'
                name='field'
                value={educationData?.field}
                onChange={handleChange}
                placeholder='Field of Study (Example: Marketing)'
              />
              <div className='row mt-2'>
                <div className='col-12 col-lg-4'>
                  <label htmlFor='start_date'>Start Date</label>
                  <input
                    className='my-2'
                    type='month'
                    name='start_date'
                    id='start_date'
                    max={new Date().toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: '2-digit'
                    })}
                    value={educationData?.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className='col-12 col-lg-4'>
                  <label htmlFor='end_date'>End Date</label>
                  <input
                    className='my-2'
                    type='month'
                    name='end_date'
                    max={new Date().toLocaleDateString('fr-CA', {
                      year: 'numeric',
                      month: '2-digit'
                    })}
                    value={
                      educationData?.end_date ? educationData.end_date : ''
                    }
                    ref={endDateRef}
                    id='end_date'
                    onChange={handleChange}
                    disabled={educationData?.present}
                  />
                </div>
                <div className='col-12 col-lg-4 my-auto pt-lg-4'>
                  <input
                    className='my-2 mt-lg-4'
                    type='checkbox'
                    name='present'
                    id='present'
                    value={educationData?.present}
                    checked={educationData?.present}
                    // disabled={educationData?.end_date}
                    onChange={(e) => {
                      cleanEndDate()
                      handleChange(e)
                    }}
                  />
                  <label htmlFor='present'>Current Position</label>
                </div>
              </div>
            </div>
            <div className='col-12'>
              <textarea
                className='mt-2'
                type='text'
                name='description'
                placeholder='Activities, Societies, Awards, etc.'
                value={educationData?.description}
                onChange={handleChange}
              />
            </div>
            <div className='row w-100 m-0 p-0 mt-2 attach-link'>
              <div className='col-12'>
                <h5>Upload Media</h5>
              </div>
              <div className='col-12'>
                <p>Link to photos, document, presentations, or websites.</p>
              </div>
              <div className='col-12 col-lg-6'>
                <FontAwesomeIcon
                  icon={faLink}
                  className='linkIcons'
                  style={{ width: '22px', height: '22px', color: '#707070' }}
                />
                <input
                  type='text'
                  name='file'
                  value={
                    educationData?.external_links?.file
                      ? educationData?.external_links.file
                      : ''
                  }
                  onChange={handleChange}
                  placeholder='Link to File'
                />
              </div>
              <div className='col-12 col-lg-6 my-4 my-3 my-lg-0'>
                <input
                  type='text'
                  name='link'
                  value={
                    educationData?.external_links?.link
                      ? educationData?.external_links?.link
                      : ''
                  }
                  onChange={handleChange}
                  placeholder='http://yourwebsitelink.com'
                />
                <FontAwesomeIcon
                  icon={faGlobe}
                  className='linkIcons'
                  style={{ width: '22px', height: '22px', color: '#707070' }}
                />
              </div>
            </div>
            <div className='row mx-0'>
              <div className='col-6 p-0'>
                {isUpdating && (
                  <button
                    className='float-start edit-account mt-4'
                    style={{ background: '#BBBDBF' }}
                    disabled={loading}
                    onClick={() => {
                      props.onHide()
                      setShowDeleteDialogModal(true)
                    }}
                  >
                    DELETE
                  </button>
                )}
              </div>
              <div className='col-6 p-0'>
                <button
                  className='float-end edit-account mt-4'
                  disabled={loading}
                  onClick={() =>
                    !isUpdating ? addEducation() : updateEducation()
                  }
                >
                  {loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'SAVE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <DeleteDialogModal
        show={showDeleteDialogModal}
        onHide={() => {
          setShowDeleteDialogModal(false)
        }}
        deleteBackground={() => deleteBackground()}
        type={'education'}
        deleteLoading={deleteLoading}
      />
      <DeleteConfirmedModal
        show={showDeleteConfirmedModal}
        onHide={() => {
          setShowDeleteConfirmedModal(false)
        }}
        type={'education'}
      />
    </>
  )
}
