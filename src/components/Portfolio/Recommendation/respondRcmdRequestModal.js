import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import defaultImage from '../../../assets/images/profile-image.png'

export const RespondRcmdRequestModal = (props) => {
  const [loading, setLoading] = useState(false)
  const socialMedia = {
    linkedIn: 'true',
    twitter: 'true',
    instagram: 'true',
    facebook: 'true',
    website: 'true'
  }

  const defaultData = {
    relationship: '',
    position: '',
    message: '',
    toUser: {}
  }

  const [rcmdRequestData, setRcmdRequestData] = useState(defaultData)
  const user = rcmdRequestData?.toUser

  useEffect(() => {
    setRcmdRequestData(props.rcmdData)
  }, [props.rcmdData])

  const closeModal = () => {
    props.onHide()
    setRcmdRequestData(defaultData)
  }

  const submitRequest = async () => {
    if (!rcmdRequestData.relationship || !rcmdRequestData.position)
      return toast.error('Please fill in all the required fields.')

    setLoading(true)

    // await axiosInstance
    //   .post(`/recommendations`, {
    //     ...rcmdRequestData,
    //     to: selectedConnection.value.id
    //   })
    //   .then((res) => {
    //     closeModal()
    //     setLoading(false)
    //     toast.success('Recommendation request sent successfully!')
    //   })
    //   .catch((err) => {
    //     closeModal()
    //     toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    //     setLoading(false)
    //   })
  }

  return (
    <Modal
      show={props.show}
      onHide={() => closeModal()}
      backdrop='static'
      keyboard={false}
      className='edit-modal'
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4 general-modal-header'>
        <h3 className='mb-0 pt-4 mt-2 '>RECOMMENDATION REQUEST</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => closeModal()}
        />
      </Modal.Header>
      <Modal.Body className='misconduct-modal'>
        <div className='d-flex'>
          <div className='mx-md-2 my-3 recommendation-container respond-rcmd-request d-flex justify-content-center justify-content-md-start'>
            <div className='rcmd-user text-center mt-2'>
              <img
                src={user.profile_image ? user.profile_image : defaultImage}
                className='rounded-circle p-0'
                style={{ width: '168px', height: '168px' }}
                alt=''
              />
              <div className='mx-2 text-center'>
                <h5 className='mt-2 mb-0'>{user?.name}</h5>
                <div className='text-start'>
                  <p className='my-0 '>{user?.profession}</p>
                  <div className='mt-1'>
                    {socialMedia?.linkedIn && (
                      <a
                        className='m-1'
                        href={
                          socialMedia.linkedIn.startsWith('https')
                            ? socialMedia.linkedIn
                            : `https://${socialMedia.linkedIn}`
                        }
                        target='_blank'
                      >
                        <FontAwesomeIcon
                          icon={faLinkedinIn}
                          className='social-media-icons'
                        />
                      </a>
                    )}
                    {socialMedia?.twitter && (
                      <a
                        className='m-1'
                        href={
                          socialMedia.twitter.startsWith('https')
                            ? socialMedia.twitter
                            : `https://${socialMedia.twitter}`
                        }
                        target='_blank'
                      >
                        <FontAwesomeIcon
                          icon={faTwitterSquare}
                          className='social-media-icons'
                        />
                      </a>
                    )}
                    {socialMedia?.instagram && (
                      <a
                        className='m-1'
                        href={
                          socialMedia.instagram.startsWith('https')
                            ? socialMedia.instagram
                            : `https://${socialMedia.instagram}`
                        }
                        target='_blank'
                      >
                        <FontAwesomeIcon
                          icon={faInstagram}
                          className='social-media-icons'
                        />
                      </a>
                    )}
                    {socialMedia?.facebook && (
                      <a
                        className='m-1'
                        href={
                          socialMedia.facebook.startsWith('https')
                            ? socialMedia.facebook
                            : `https://${socialMedia.facebook}`
                        }
                        target='_blank'
                      >
                        <FontAwesomeIcon
                          icon={faFacebookSquare}
                          className='social-media-icons'
                        />
                      </a>
                    )}
                    {socialMedia?.website && (
                      <a
                        className='m-1'
                        href={
                          socialMedia.website.startsWith('https')
                            ? socialMedia.website
                            : `https://${socialMedia.website}`
                        }
                        target='_blank'
                      >
                        <FontAwesomeIcon
                          icon={faGlobe}
                          className='social-media-icons'
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <h2 className='mt-2' style={{ fontSize: '17px' }}>
                Has requested a recommendation
              </h2>
            </div>
            <div className='contact-us ms-md-5'>
              <label htmlFor='relationship'>Relationship to you:</label>
              <input
                className='mt-0 mb-2'
                type='text'
                name='relationship'
                value={rcmdRequestData.relationship}
                readOnly
              />
              <label htmlFor='position'>
                Position or role when they knew you:
              </label>
              <input
                className='mt-0 mb-2'
                type='text'
                name='position'
                value={rcmdRequestData.position}
                readOnly
              />
              <label htmlFor='message'>Personal message</label>

              <textarea
                className='mt-0 mb-2'
                type='text'
                name='position'
                value={rcmdRequestData.message}
                readOnly
              />

              <div className='mt-2 text-center connection-modal d-flex flex-column'>
                <button
                  className='cancel-subscription-button accept-request-button m-auto'
                  style={{
                    height: '34px',
                    width: '372px'
                  }}
                  onClick={() => {
                    props.respondRequest(rcmdRequestData.id, 'accept')
                  }}
                >
                  {loading ? (
                    <IntlMessages id='general.loading' />
                  ) : (
                    <IntlMessages id='connection.accept_connection' />
                  )}
                </button>
                <div className='mt-2 d-flex justify-content-center align-items-center'>
                  <p
                    className='my-auto text-end'
                    onClick={() => {
                      props.respondRequest(rcmdRequestData.id, 'ignore')
                    }}
                  >
                    <IntlMessages id='connection.ignore_connection' />
                  </p>
                  <h2 className='my-auto mx-4'>|</h2>

                  <p
                    className='my-auto text-start'
                    style={{ color: '#F2359D' }}
                    onClick={() => {
                      props.respondRequest(rcmdRequestData.id, 'block')
                    }}
                  >
                    {' '}
                    <IntlMessages id='connection.block_user' />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
