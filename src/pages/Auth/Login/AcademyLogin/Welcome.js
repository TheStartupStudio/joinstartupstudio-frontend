import React from 'react'
import FormWrapper from '../ui/FormWrapper'
import '../index.css'
import { Col, Row } from 'react-bootstrap'
import { LtsGradientButton } from '../../../../ui/ContentItems'

const Welcome = () => {
  return (
    <div
      className='container-fluid md-px-5 ps-md-5 choose-login_container'
      style={{
        backgroundColor: '#e4e9f4'
      }}
    >
      <Row className='py-5 fw-bold'>VIRTUAL ACADEMY</Row>
      <Col className='d-flex align-items-center justify-content-center'>
        <FormWrapper className=' col-md-6 text-center'>
          <p
            className='m-0'
            style={{ fontSize: '55px', fontWeight: 'lighter' }}
          >
            WELCOME
          </p>
          <p className='pb-3'>to the Learnt to Start Virtual Academy</p>

          <div className='py-5 text-center'>
            <h3>Ready to get started?</h3>
            <LtsGradientButton
              className={'my-2 justify-content-center'}
              style={{ fontSize: '14px' }}
            >
              <a href='/signup-academy' className='px-3 m-0 text-uppercase '>
                Submit you application
              </a>
            </LtsGradientButton>
            <small>
              Already a registered user?{' '}
              <a
                href='/ims-login'
                style={{ color: '#76cee3' }}
                className=' cursor-pointer'
              >
                Login here
              </a>
            </small>
          </div>

          <small className='pt-3 text-center'>
            The security of your information is important.
            <br />
            <span className='cursor-pointer' style={{ color: '#76cee3' }}>
              Learnt how we protect you.
            </span>
          </small>
        </FormWrapper>
      </Col>
    </div>
  )
}

export default Welcome
