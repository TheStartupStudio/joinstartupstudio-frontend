import React from 'react'
import { Col } from 'react-bootstrap'
import DefaultImage from '../../../../assets/images/default-university-logo.jpg'

const SuccessMessage = () => {
  return (
    <>
      <hr className='mt-0' />
      <div
        className='d-flex align-items-center justify-content-center'
        style={{ letterSpacing: ' 0.68px' }}
      >
        <Col className='text-center'>
          <div className='w-100 m-0'>
            <img
              src={DefaultImage}
              alt='Profile'
              style={{ width: '30px', borderRadius: '50%' }}
            />
          </div>
          <p
            className='fw-bold pb-3'
            style={{
              textAlign: 'center',
              letterSpacing: ' 0.68px'
            }}
          >
            Congratulations! <br /> You have successfully applied for the Learn
            to Start Virtual Academy
          </p>

          <p>
            Thank you for your application. The Learn to Start Virtual Academy
            admissions <br /> team will be in touch with you soon.
          </p>
          <p>
            If you have any questions, please email{' '}
            <strong style={{ color: '#52C7DE' }}>info@learntostart.com</strong>{' '}
            <br /> or visit us at{' '}
            <strong style={{ color: '#52C7DE' }}>learntostart.com</strong>
          </p>
        </Col>
      </div>
    </>
  )
}

export default SuccessMessage
