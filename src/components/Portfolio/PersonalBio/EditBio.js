import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'
import { FormattedMessage } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faInstagram,
  fabLinkedin
} from '@fortawesome/free-brands-svg-icons'
// import { faGlobe, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import {
  faGlobe,
  faFileUpload,
  faEnvelope,
  faMobileAlt,
  linkedIn
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../../utils/IntlMessages'
import { Link } from 'react-router-dom'

const EditProfileModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      dialogClassName='my-modal'
      className='edit_modal mt-md-5'
    >
      <Modal.Header className='pb-0 mx-4 general-modal-header'>
        <h3
          className='mt-4 mb-0 contact-bio'
          style={{
            textAlign: 'left',
            font: 'normal normal 600 20px Montserrat',
            color: '#333D3D',
            textTransform: 'uppercase',
            opacity: 1
          }}
        >
          <IntlMessages id='portfolio.edit_who_am_i' />
        </h3>
        <button
          type='button'
          className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='row px-md-1 mx-auto edit_user_bio'>
          <div className='col-12 col-md-4 col-lg-3 col-xl-2 my-auto text-center'>
            <div className='round-image-wrapper'>
              <img
                src={
                  props.user?.profile_image
                    ? props.user?.profile_image
                    : props.avatar
                }
                alt='Profile'
                className='rounded-circle float-right editbio-user-image user-image z-depth-2'
              />
            </div>
          </div>
          <div className='col-12 col-md-8 my-auto ps-2 ps-md-3'>
            <p className='edit_modal_first_paragrf mt-4 pb-0 mb-0'>
              <IntlMessages id='portfolio.edit_modal_first_paragrf' />
              <span className='edit_modal_second_paragrf ms-1'>
                <Link to={'/account'}>
                  <span className='a'>in your account settings.</span>
                </Link>
              </span>
            </p>
            <h3 className='w-100 mt-4 mb-0 edit_portfolio_bio_user_name px-0 mt-md-2 pt-1'>
              {props.user?.name}
            </h3>
            {/* proffesion */}
            {props.user?.profession !== '' && (
              <p className='user-profession mb-1 mt-2 px-0'>
                {props.user?.profession}
              </p>
            )}
            {(props.user?.social_links?.facebook ||
              props.user?.social_links?.instagram ||
              props.user?.social_links?.linkedIn ||
              props.user?.social_links?.twitter ||
              props.user?.social_links?.website) && (
              <div className='social_links_edit_modal mt-3 mb-2 px-0'>
                {props.user?.social_links?.twitter && (
                  <a
                    href={
                      props.user.social_links?.linkedIn?.startsWith('https')
                        ? props.user.social_links?.linkedIn
                        : `https://${props.user.social_links?.linkedIn}`
                    }
                    rel='noreferrer'
                    target='_blank'
                    className='link me-1'
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                )}
                {props.user?.social_links?.twitter && (
                  <a
                    href={
                      props.user.social_links?.twitter?.startsWith('https')
                        ? props.user.social_links?.twitter
                        : `https://${props.user.social_links?.twitter}`
                    }
                    rel='noreferrer'
                    target='_blank'
                    className='link me-1'
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {props.user?.social_links?.instagram && (
                  <a
                    href={
                      props.user.social_links?.instagram?.startsWith('https')
                        ? props.user.social_links?.instagram
                        : `https://${props.user.social_links?.instagram}`
                    }
                    rel='noreferrer'
                    target='_blank'
                    className='link me-1'
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
                {props.user?.social_links?.website && (
                  <a
                    href={
                      props.user.social_links?.website?.startsWith('https')
                        ? props.user.social_links?.website
                        : `https://${props.user.social_links?.website}`
                    }
                    rel='noreferrer'
                    target='_blank'
                    className='link me-1'
                  >
                    <FontAwesomeIcon icon={faGlobe} />
                  </a>
                )}
                {props.user?.social_links?.facebook && (
                  <a
                    href={
                      props.user.social_links?.facebook?.startsWith('https')
                        ? props.user.social_links?.facebook
                        : `https://${props.user.social_links?.facebook}`
                    }
                    rel='noreferrer'
                    target='_blank'
                    className='link me-1'
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                )}
              </div>
            )}

            <p className='connections px-0 mt-0'>
              {props.userConnections > 500 ? (
                <>
                  500+ <IntlMessages id='connection.title' />
                </>
              ) : (
                <>
                  <span>{props.userConnections} connections</span>
                </>
              )}
            </p>
          </div>
          <div className='row col-12 ps-md-3 pt-1 pt-md-3 pe-0'>
            <p className='Summary_first mb-0 px-3'>
              <IntlMessages id='portfolio.edit_page_Summary_first' />
              <span className='Summary_second'>
                <IntlMessages id='portfolio.edit_page_Summary_second' />
              </span>
            </p>
            <FormattedMessage
              id='my_account.summary_placeholder'
              defaultMessage='my_account.summary_placeholder'
            >
              {(placeholder) => (
                <textarea
                  className='mt-2 mb-2 pt-3 px-3 text_area'
                  type='text'
                  name='summary'
                  onChange={(event) => props.handleChange(event)}
                  placeholder={placeholder}
                  defaultValue={props.userBio && props.userBio}
                />
              )}
            </FormattedMessage>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className='border-0 pt-0 pe-4 me-1 position-relative'>
        <button className='edit-account' onClick={() => props.onSubmit()}>
          {props.updateBio ? (
            <IntlMessages id='general.saving' />
          ) : (
            <IntlMessages id='general.save' />
          )}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default EditProfileModal
