import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import {
  faGlobe,
  faFileUpload,
  faEnvelope,
  faMobileAlt
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import defaultImage from '../../../assets/images/profile-image.png'
import { IsUserLevelAuthorized } from '../../../utils/helpers'
import { readFile } from '../../../utils/canvasUtils'
import ImageCropper from '../../ImageCropper'
import { useDispatch, useSelector } from 'react-redux'
import {
  setImageCropperData,
  setCroppedImage,
  userUpdateProfileImage
} from '../../../redux'
import { getImageDataURL, readImageFile } from '../../../utils/helpers'
import { userEdit } from '../../../redux/user/Actions'

const EditProfileModal = (props) => {
  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  const [userData, setUserData] = useState({})
  const [userMedia, setUserMedia] = useState({})
  const [loading, setLoading] = useState(false)
  const isAllowedLevel = IsUserLevelAuthorized()

  useEffect(() => {
    setUserData(props.userData)
    setUserMedia(props.userData.social_links)
  }, [props.userData, props.show])

  const changeProfilePicture = async (event) => {
    // setLoading(true)
    const imageData = await readFile(event.target.files[0])
    dispatch(setImageCropperData(imageData))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (!isAllowedLevel && name === 'name') return
    if (
      name === 'linkedIn' ||
      name === 'twitter' ||
      name === 'instagram' ||
      name === 'facebook' ||
      name === 'website'
    ) {
      setUserMedia((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    } else {
      setUserData((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    }
  }

  const saveData = async () => {
    props.setLoading(true)

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
          setUserData((prevValues) => ({
            ...prevValues,
            ['profile_image']: response.data.fileLocation
          }))
          dispatch(userUpdateProfileImage(response.data.fileLocation))
          localStorage.setItem('profileImage', response.data.fileLocation)
          props.editUser(
            { ...userData, profile_image: response.data.fileLocation },
            userMedia
          )
        })
        .catch((err) => err)
    } else {
      props.editUser({ ...userData }, userMedia)
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal general-modal-header edit-profile-modal'
    >
      <Modal.Header className='pb-0 general-modal-header mx-4'>
        {props.page == 'profile' ? (
          <h3 className='mt-4 mb-0 contact-bio'>
            <IntlMessages id='my_account.edit_my_bio' />
          </h3>
        ) : (
          <h3 className='mt-4 mb-0 contact-bio'>
            <IntlMessages id='my_account.edit_contact_information' />
          </h3>
        )}
        <button
          type='button'
          className='btn-close me-1 pt-3 mt-0 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
          aria-label='Close'
          onClick={() => {
            props.onHide()
          }}
        />
      </Modal.Header>
      <Modal.Body
        className={`${
          props.page == 'profile'
            ? 'pe-4 pe-md-0 me-md-5 me-0 pe-md-auto px-4'
            : ''
        } `}
      >
        {props.page == 'profile' ? (
          <div>
            <div className='row mt-2'>
              <div className=' col-lg-4 col-md-12 text-center'>
                {loading ? (
                  <span className='loading-image loading-image-sm' />
                ) : (
                  <div>
                    {general.imageCropperData ? (
                      <div
                        className='position-relative'
                        style={{ height: '200px' }}
                      >
                        <ImageCropper
                          imageUrl={general.imageCropperData}
                          setImageUrl={() => {}}
                          width={140}
                          height={140}
                        />
                      </div>
                    ) : (
                      <img
                        src={
                          userData.profile_image
                            ? userData.profile_image
                            : defaultImage
                        }
                        className='mt-2'
                      />
                    )}
                  </div>
                )}
                <div className='input-group mt-3'>
                  <div className='profile-image'>
                    <label className='edit-label text-center'>
                      <input
                        type='file'
                        id='inputGroupFile'
                        name='profile_image'
                        accept='image/*'
                        className='d-none'
                        onChange={(e) => {
                          changeProfilePicture(e)
                        }}
                      />
                      <div className='mt-md-1 d-flex justify-content-center edit-bio-upload-image'>
                        <IntlMessages id='my_account.upload_new_image' />
                        <FontAwesomeIcon
                          icon={faFileUpload}
                          className='edit-modal-sm ml-2'
                        />
                      </div>
                    </label>
                  </div>
                  <p className='mt-2 text-start'>
                    Please upload a headshot that includes your face, so others
                    can recognize you. <br className='d-none d-lg-block' />
                    <br className='d-none d-lg-block' />
                    This is a professional platform. Any image you use should be
                    professional and appropriate.
                  </p>
                </div>
              </div>
              <div className='mt-5 mt-md-0 col-lg-8 col-md-12 social-media'>
                <p className='mt-2 mb-0'>
                  {isAllowedLevel ? (
                    <IntlMessages id='my_account.first_last_name' />
                  ) : (
                    'First & Last Name (If you need your name changed, please contact your Instructor.)'
                  )}
                </p>
                <input
                  className='my-2'
                  type='text'
                  name='name'
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!isAllowedLevel}
                />
                <p className='mt-2 mb-0'>
                  <IntlMessages id='my_account.position' />
                </p>
                <FormattedMessage
                  id='my_account.type_position_placeholder'
                  defaultMessage='my_account.type_position_placeholder'
                >
                  {(placeholder) => (
                    <input
                      className='mt-2 mb-2'
                      type='text'
                      maxLength={25}
                      name='profession'
                      placeholder={placeholder}
                      value={userData.profession}
                      onChange={handleChange}
                    />
                  )}
                </FormattedMessage>
                <h4 className='mt-5 mb-2'>
                  <IntlMessages id='my_account.edit_social_media' />
                </h4>
                <div className='d-flex mt-2'>
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    className='edit-modal-sm mt-2'
                  />
                  <FormattedMessage
                    id='social.linkedin'
                    defaultMessage='https://www.linkedin.com/in/yourlink'
                  >
                    {(placeholder) => (
                      <input
                        type='text'
                        name='linkedIn'
                        placeholder={placeholder}
                        value={userMedia && userMedia.linkedIn}
                        onChange={handleChange}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className='d-flex mt-2'>
                  <FontAwesomeIcon
                    icon={faTwitterSquare}
                    className='edit-modal-sm mt-2'
                  />
                  <FormattedMessage
                    id='social.media_twitter'
                    defaultMessage='https://www.twitter.com/yourlink'
                  >
                    {(placeholder) => (
                      <input
                        type='text'
                        name='twitter'
                        placeholder={placeholder}
                        value={userMedia && userMedia.twitter}
                        onChange={handleChange}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className='d-flex mt-2'>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className='edit-modal-sm mt-2'
                  />
                  <FormattedMessage
                    id='social.instagram'
                    defaultMessage='https://www.instagram.com/yourlink'
                  >
                    {(placeholder) => (
                      <input
                        type='text'
                        name='instagram'
                        placeholder={placeholder}
                        value={userMedia && userMedia.instagram}
                        onChange={handleChange}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className='d-flex mt-2'>
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className='edit-modal-sm mt-2'
                  />
                  <FormattedMessage
                    id='social.facebook'
                    defaultMessage='https://www.facebook/yourlink'
                  >
                    {(placeholder) => (
                      <input
                        type='text'
                        name='facebook'
                        placeholder={placeholder}
                        value={userMedia && userMedia.facebook}
                        onChange={handleChange}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <div className='d-flex mt-2'>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className='edit-modal-sm mt-2'
                  />
                  <FormattedMessage
                    id='social.website'
                    defaultMessage='https://www.yourwebsite.com'
                  >
                    {(placeholder) => (
                      <input
                        type='text'
                        name='website'
                        placeholder={placeholder}
                        value={userMedia && userMedia.website}
                        onChange={handleChange}
                      />
                    )}
                  </FormattedMessage>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <h4>
                <IntlMessages id='my_account.edit_my_summary' />
              </h4>
              <FormattedMessage
                id='my_account.summary_placeholder'
                defaultMessage='my_account.summary_placeholder'
              >
                {(placeholder) => (
                  <textarea
                    className='mt-2 mb-2 pt-3 ps-4'
                    type='text'
                    name='bio'
                    placeholder={placeholder}
                    value={userData.bio}
                    onChange={handleChange}
                  />
                )}
              </FormattedMessage>
            </div>
          </div>
        ) : (
          <div className='row p-0'>
            <div className='col-md-10 mx-auto mt-md-2'>
              <label>
                <h4 className='mt-3' style={{ textTransform: 'uppercase' }}>
                  {props.page === 'email' ? (
                    <IntlMessages id='my_account.contact_information' />
                  ) : (
                    <IntlMessages id='my_account.mobile_phone' />
                  )}
                </h4>
              </label>
              <div className='ico-field-grid mt-2 mt-md-4 '>
                <div className='col-md-1 mt-1'>
                  <FontAwesomeIcon
                    className='edit-modal-sm '
                    icon={props.page === 'email' ? faEnvelope : faMobileAlt}
                    style={{ fontSize: '25' }}
                  />
                </div>
                <div className='ps-md-2 ps-0'>
                  <input
                    className='inputBoxProfile'
                    type='text'
                    value={
                      props.page === 'email'
                        ? userData.email
                        : userData.phone_number
                    }
                    placeholder={
                      props.page === 'email'
                        ? 'example@email.com'
                        : '+1 123-456-7890'
                    }
                    name={props.page === 'email' ? 'email' : 'phone_number'}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='row p-0 mb-3'>
          <div
            className={`${
              props.page == 'profile' ? 'col-md-12' : 'col-md-10 mx-auto'
            }`}
          >
            <button
              className='float-end edit-account mt-4'
              disabled={props.loading}
              onClick={() => saveData()}
            >
              {props.loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.save' />
              )}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default EditProfileModal
