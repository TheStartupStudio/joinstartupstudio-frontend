import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {
  faGlobe,
  faFileUpload,
  faLink
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import ImageCropper from '../../ImageCropper'
import { readFile } from '../../../utils/canvasUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../../redux'
import '../../Portfolio/Experience/style.css'
import IntlMessages from '../../../utils/IntlMessages'

export const NewJournalBrandModal = (props) => {
  const defaultData = {
    type: '',
    action: '',
    narration: '',
    music: '',
    image: '',
    hasAccordion: props.hasAccordion,
    journalId: props.journalId
  }

  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const inputImage = React.useRef(null)

  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const { name, value, checked } = event.target

    setData((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }
  const imageChange = async (e) => {
    const file = e.target.files[0]
    if (e.target.files && e.target.files.length > 0) {
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 0.5) {
        return toast.error('Image size exceeds 512KB.')
      }

      var img = document.createElement('img')

      var reader = new FileReader()
      reader.onloadend = function (ended) {
        img.src = ended.target.result
        // const formData = new FormData()
        // formData.append('image', ended.target.result)
      }

      reader.readAsDataURL(e.target.files[0])
      img.onload = async function () {
        if (this.width < 140 || this.height < 140) {
          return toast.error('Minimum required format: 140x140px.')
        } else {
          const imageData = await readFile(e.target.files[0])
          dispatch(setImageCropperData(imageData))
        }
      }
      previewImage(file)
    }
  }

  // const imageChange = async (e) => {
  //   const file = e.target.files[0]
  //   if (e.target.files && e.target.files.length > 0) {
  //     const fileSize = file.size / 1024 / 1024
  //     if (fileSize > 0.5) {
  //       return toast.error('Image size exceeds 512KB.')
  //     }

  //     setData((prevValues) => ({
  //       ...prevValues,
  //       image: null
  //     }))

  //     let imageData = await readFile(file)

  //     console.log('imageData', imageData)
  //     dispatch(setImageCropperData(imageData))
  //     previewImage(file)
  //   }
  // }

  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      setSelectedImage(reader.result)
    }
  }

  const addExperience = async () => {
    setLoading(true)
    const newExperience = data
    for (var key in data) {
      if (key === 'image' || key === 'hasAccordion') continue
      if (data[key] === null || data[key] == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }
    }

    if (general.croppedImage) {
      const formData = new FormData()
      const image = general.croppedImage

      formData.append('img', image)
      await axiosInstance
        .post('/upload/img-transform', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          setLoading(false)
          newExperience.image = response.data.fileLocation
        })
        .catch((err) => {
          console.log('err', err)
          return toast.error('Image upload failed, please try again!')
        })
    }

    await axiosInstance
      .post('/LtsJournals/journal-brand', newExperience)
      .then(() => {
        setLoading(false)
        props.onShow()
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        setSelectedImage()
        setData(defaultData)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
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
          <h3 className='mt-4 mb-0 contact-bio'>ADD FULL SECTION</h3>
          <button
            type='button'
            className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setSelectedImage()
              setData(defaultData)
            }}
          />
        </Modal.Header>
        <Modal.Body className='px-4'>
          <div className='row'>
            <div className='col-12 col-lg-3 upload-container my-2'>
              {/* <div className='upload-image me-2 mb-1'> */}
              {general.imageCropperData ? (
                <div className='position-relative' style={{ height: '150px' }}>
                  <ImageCropper
                    imageUrl={general.imageCropperData}
                    setImageUrl={() => {}}
                    width={140}
                    height={140}
                  />
                </div>
              ) : (
                <>
                  <div className='upload-image me-2 mb-1'>
                    {selectedImage ? (
                      <img
                        src={data.image ? data.image : selectedImage}
                        style={{ width: '100%', height: '100%' }}
                        alt='Thumb'
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlus}
                        className='upload-image-plus'
                        style={{
                          width: '56px',
                          height: '56px',
                          color: '#BBBDBF',
                          cursor: 'pointer'
                        }}
                        onClick={() => inputImage.current.click()}
                      />
                    )}
                  </div>
                </>
              )}
              {/* </div> */}
              {/* <p>Max image width: 85px</p> */}
              <p className='mt-2'>File Types: .png or .jpg only</p>
              <p className='mb-1'>Dimensions: 150x150px</p>
              <p className='mt-2'>Size: 512KB max.</p>
              <label className='text-center py-2'>
                <input
                  type='file'
                  id='inputGroupFile'
                  name='profile_image'
                  accept='image/*'
                  className='d-none'
                  ref={inputImage}
                  onChange={(e) => imageChange(e)}
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
                name='type'
                value={data?.type}
                onChange={handleChange}
                placeholder='Type of Shot'
              />
              <input
                className='my-2'
                type='text'
                name='action'
                value={data?.action}
                onChange={handleChange}
                placeholder='Action'
              />
              <input
                className='my-2'
                type='text'
                name='narration'
                value={data?.narration}
                onChange={handleChange}
                placeholder='Narration'
              />
              <input
                className='my-2'
                type='text'
                name='music'
                value={data?.music}
                onChange={handleChange}
                placeholder='Music'
              />
            </div>
            <div className='row mx-0'>
              <div className='col-12 text-end'>
                <button
                  className='float-end edit-account mt-4'
                  disabled={loading}
                  onClick={() => addExperience()}
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
    </>
  )
}
