import React, { useState } from 'react'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import image from './images/Rectangle16.png'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faLink } from '@fortawesome/free-solid-svg-icons'
import { readFile } from '../../../utils/canvasUtils'
import ImageCropper from '../../ImageCropper'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../../redux'

const EditModal = (props) => {
  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: props.submission.title,
      link: props.submission.link,
    },
  })

  const previewImage = (file) => {
    const reader = new FileReader()
    if (file) {
      reader.readAsDataURL(file)
    }

    reader.onloadend = () => {
      setImageUrl(reader.result)
    }
  }

  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageData = await readFile(file)

      dispatch(setImageCropperData(imageData))
      previewImage(e.target.files[0])
    }
  }

  const saveSubmission = async (data) => {
    setLoading(true)
    const image = general.croppedImage

    const formData = new FormData()
    formData.append('img', image)

    try {
      let imageAws = null

      if (image) {
        imageAws = await axiosInstance.post('/upload/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        dispatch(setCroppedImage(null))
        dispatch(setImageCropperData(null))
        setImageUrl('')
      }

      const params = {
        UserID: props.user.id,
        title: data.title,
        link: data.link,
        imageUrl: imageAws
          ? imageAws.data.fileLocation
          : props.submission.imageUrl,
        // imageUrl:
        //   'https://demo-startupstudio-drive.s3.amazonaws.com/users/ac651359-0ddd-4f22-b4e9-1a050f72a2a0/ec668cde419289f90a1eef8f5c1be025-1646667486483.jpg'
      }

      axiosInstance
        .patch(`/users/submissions/${props.submission.id}`, params)
        .then(() => {
          props.onSave({ ...params, id: props.submission.id })
          props.onHide()
          setLoading(false)
        })
        .catch((err) => {
          return toast.error('Error creating new submission, please try again!')
        })
    } catch (err) {
      return toast.error('Image upload failed, please try again!')
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      className="edit-modal "
    >
      <Modal.Header className="edit-modal p-0 mx-3 general-modal-header">
        <h3 className="mt-4 mb-0 edit-modal-box-title">EDIT SUBMISSION</h3>
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <form onSubmit={handleSubmit(saveSubmission)}>
        <ModalBody className={`px-md-5 mb-4 pb-0 mb-0`}>
          <div className="row">
            <div className="col-sm-12 col-md-6 order-2 order-md-1">
              <div className="submission-examples">
                <p>
                  To add a new submission, add the link to your document (PDF,
                  slide deck, etc.). Then upload a cover image that will be
                  displayed in your Portfolio. Your cover image should be 330 x
                  200 pixels. See below for two examples.
                </p>

                <div className="submission-example">
                  <h3 className="submission-example-title text-center">
                    ARTICLE EXAMPLE
                  </h3>
                  <div className="submission-example-inner">
                    <img src={image} alt="" />
                  </div>
                </div>

                <div className="submission-example">
                  <h3 className="submission-example-title text-center">
                    PITCH DECK EXAMPLE
                  </h3>
                  <div className="submission-example-inner">
                    <img src={image} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 submission-form order-1 order-md-2">
              <Form.Group className="mb-5" controlId="formBasicEmail">
                <Form.Control
                  className="input py-2 ps-4"
                  type="text"
                  placeholder="Submission Title"
                  {...register('title', {
                    required: true,
                  })}
                />
                <span className="field-error">
                  {errors.title && 'Title is required'}
                </span>

                {general.imageCropperData ? (
                  <div
                    className="mt-2 img-placeholder position-relative"
                    style={{ height: '250px' }}
                  >
                    <ImageCropper
                      width={330}
                      height={200}
                      setImageUrl={setImageUrl}
                      imageUrl={imageUrl}
                    />
                  </div>
                ) : (
                  <div className="mt-2 img-placeholder position-relative">
                    <img
                      src={
                        imageUrl !== '' ? imageUrl : props.submission.imageUrl
                      }
                      alt=""
                    />
                  </div>
                )}
                <div className="row">
                  <div className="col-12 position-relative">
                    <FontAwesomeIcon
                      icon={faLink}
                      className="linkIcons"
                      style={{
                        width: '22px',
                        height: '22px',
                        color: '#707070',
                      }}
                    />
                    <Form.Control
                      className="mt-2 input py-2 ps-4"
                      type="text"
                      placeholder="Paste Link to Your Document"
                      {...register('link', {
                        required: true,
                      })}
                    />
                  </div>
                </div>
                <span className="field-error">
                  {errors.link && 'Link is required'}
                </span>

                <label className="cover-upload-wrapper mt-2">
                  <input
                    type="file"
                    id="inputGroupFile"
                    name="file"
                    accept="image/*"
                    {...register('file', {
                      required: false,
                    })}
                    className="d-none"
                    // ref={inputImage}
                    onChange={imageChange}
                  />
                  <div className="image-upload d-flex">
                    <p className="text-start">Upload Cover Image</p>
                    <FontAwesomeIcon
                      icon={faFileUpload}
                      className="edit-modal-sm ms-4"
                      style={{ height: '27px', width: '20px' }}
                    />
                  </div>
                </label>
                <span className="field-error">
                  {errors.file && 'Image is required'}
                </span>
              </Form.Group>
            </div>
          </div>
        </ModalBody>
        <Modal.Footer className="border-0 py-0 my-0 mb-2 position-relative">
          <div className="row p-0 mb-3">
            <div className="col-md-11">
              <button
                className="float-end edit-account mt-4"
                disabled={loading}
              >
                {loading ? (
                  <IntlMessages id="general.loading" />
                ) : (
                  <IntlMessages id="general.save" />
                )}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default EditModal
