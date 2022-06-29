import { faFileUpload, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../../utils/IntlMessages'
import defaultImage from '../../../../assets/images/profile-image.png'
import { toast } from 'react-toastify'
import ImageCropper from '../../../../components/ImageCropper'
import { readFile } from '../../../../utils/canvasUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../../../redux'
import axiosInstance from '../../../../utils/AxiosInstance'

const EditImageOfVideoModal = (props) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const general = useSelector((state) => state.general)

  const imageChange = async (e) => {
    const file = e.target.files[0]
    if (e.target.files && e.target.files.length > 0) {
      // const fileSize = file.size / 1024 / 1024
      // if (fileSize > 0.5) {
      //   return toast.error('Image size exceeds 512KB.')
      // }

      props.setSelectedImage(e.target.files[0])

      let imageData = await readFile(file)
      dispatch(setImageCropperData(imageData))
      previewImage(file)
    }
  }
  const uploadImage = async () => {
    if (general.croppedImage) {
      setLoading(true)
      const formData = new FormData()
      formData.append('img', general.croppedImage)
      await axiosInstance
        .post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (response) => {
          await axiosInstance
            .put('business/update/Business', {
              id: props.id,
              videoImage: response.data.fileLocation
            })
            .then((responseData) => {
              props.onHide()
              props.updateProjectImage(response.data.fileLocation)
              setLoading(false)
            })
            .catch((err) => {
              setLoading(false)
              toast.error('Image upload failed, please try again!')
            })
        })
        .catch((err) => {
          setLoading(false)
          return toast.error('Image upload failed, please try again!')
        })
    }
  }
  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      props.setSelectedImage(reader.result)
    }
  }

  const inputImage = React.useRef(null)
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className=''
    >
      <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
        <h3 className='page-title mt-3 mt-4 mb-0 edit-modal-box-title'>
          Select image for thumbnail of video
        </h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => props.onHide()}
        />
      </Modal.Header>

      <Modal.Body className='m-4 p-0'>
        <div className='col-12 col-lg-3 upload-container my-2 mx-auto'>
          <div className='upload-image mb-1'>
            {general.imageCropperData ? (
              <div
                className='img-placeholder position-relative'
                style={{ height: '150px' }}
              >
                <ImageCropper
                  width={120}
                  height={100}
                  setImageUrl={props.setSelectedImage}
                  imageUrl={props.selectedImage}
                />
              </div>
            ) : (
              <>
                {props.selectedImage ? (
                  <img
                    src={
                      props.image_url ? props.image_url : props.selectedImage
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
          <label className='text-center w-100 py-2'>
            <input
              type='file'
              id='inputGroupFile'
              name='profile_image'
              accept='image/*'
              className='d-none'
              ref={inputImage}
              onChange={imageChange}
            />
            <div
              className='image-upload d-flex justify-content-center'
              style={{ border: '1px solid black', paddingTop: '12px' }}
            >
              <p>Choose Image</p>
              <FontAwesomeIcon
                icon={faFileUpload}
                className='edit-modal-sm ms-4'
                style={{ height: '27px', width: '20px' }}
              />
            </div>
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer className='px-4 border-0 position-relative'>
        <button
          className='float-end edit-account'
          disabled={loading}
          onClick={() => uploadImage()}
        >
          {loading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            <IntlMessages id='general.save' />
          )}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditImageOfVideoModal
