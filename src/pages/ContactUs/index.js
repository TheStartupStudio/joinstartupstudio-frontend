import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import React, { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { useHistory } from 'react-router-dom'
import AcademyBtn from '../../components/AcademyBtn'
import ModalInput from '../../components/ModalInput/ModalInput'
import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

function ContactUs() {
  const [content, setContent] = useState('')
  const history = useHistory()

  return (
    <>
      <InfoPageHeader linkColor={'#000000'} />

      <main className='register-main'>
        <section
          className='px-5 pb-5 p-t-5 register-section'
          style={{ marginBottom: '15rem' }}
        >
          <h1 className='text-center fs-48 fw-light'>Contact Us</h1>
          <form className='mt-5'>
            <div
              className='d-grid gap-4'
              style={{ gridTemplateColumns: '4fr auto 2fr' }}
            >
              <div>
                <h5 className='text-uppercase fs-18 fw-medium'>
                  Send us a message
                </h5>
                <div className='d-grid gap-3'>
                  <ModalInput
                    id={'name'}
                    labelTitle={'Name'}
                    imageStyle={{ display: 'none' }}
                  />
                  <ModalInput
                    id={'email'}
                    labelTitle={'Email Address'}
                    imageStyle={{ display: 'none' }}
                  />
                  {/* <div>
                    <label htmlFor='message'>Message:</label>
                    <textarea
                      id='message'
                      name='message'
                      rows='4'
                      cols='50'
                    ></textarea>
                  </div> */}
                  <div className='relative w-100 d-flex justify-content-between input-container-modal'>
                    <textarea
                      rows={4}
                      id={'Message'}
                      type='text'
                      className='input-style'
                      placeholder=' '
                    />
                    <label htmlFor={'Message'} className='label-style'>
                      Message
                    </label>
                  </div>
                  <p className='mb-0 text-center fs-15 fw-light text-black'>
                    This site is protected by reCAPTCHA. The Google 
                    <a
                      href='https://policies.google.com/privacy'
                      target='blank'
                      className='text-black text-decoration-underline'
                    >
                      Privacy Policy
                    </a>
                     and 
                    <a
                      href='https://policies.google.com/terms'
                      target='blank'
                      className='text-black text-decoration-underline'
                    >
                      Terms of Service
                    </a>
                     apply.
                  </p>
                </div>
              </div>
              <hr
                style={{
                  height: '100%',
                  borderLeft: '1px solid rgb(165 167 169)'
                }}
              />
              <div>
                <h5 className='text-uppercase fs-18 fw-medium'>
                  Additional Ways to contact us
                </h5>
                <div className='d-flex gap-3'>
                  <FaLocationDot />
                  <p className='fs-15 fw-light text-black'>
                    9100 Conroy Windermere Rd. Suite 200 - #335 Windermere, FL
                    34786
                  </p>
                </div>
                <div className='d-flex gap-3 align-items-center mb-3'>
                  <FontAwesomeIcon icon={faPhone} />
                  <p className='fs-15 fw-light text-black mb-0'>
                    (866) 815-8559
                  </p>
                </div>
                <div className='d-flex gap-3 align-items-center'>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <p className='fs-15 fw-light text-black mb-0'>
                    support@mystartupcourse.com
                  </p>
                </div>
              </div>
            </div>
            <div className='d-flex flex-column align-items-center mt-3'>
              <AcademyBtn title={'Send'} icon={faEnvelope} />
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

export default ContactUs
