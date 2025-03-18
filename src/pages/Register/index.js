import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import AcademyBtn from '../../components/AcademyBtn'
import ModalInput from '../../components/ModalInput/ModalInput'
import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import IntlMessages from '../../utils/IntlMessages'

function Register() {
  const history = useHistory()

  return (
    <>
      <InfoPageHeader linkColor={'#000000'} />

      <main className='register-main'>
        <section className='px-5 pb-5 p-t-5 register-section'>
          <h1 className='text-center fs-48 fw-light'>
            $15 per month subscription
          </h1>
          <form className='mt-4-4'>
            <div
              className='d-grid gap-4'
              style={{ gridTemplateColumns: '4fr auto 2fr' }}
            >
              <div>
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Account Information
                  </p>
                  <div
                    className='d-grid gap-3'
                    style={{ gridTemplateColumns: '1fr 1fr' }}
                  >
                    <ModalInput
                      id={'fullName'}
                      labelTitle={'Full Name'}
                      imageStyle={{ width: '0px', height: '0px' }}
                    />
                    <ModalInput
                      id={'emailAddress'}
                      labelTitle={'Email Address'}
                      imageStyle={{ width: '0px', height: '0px' }}
                    />
                    <ModalInput
                      id={'password'}
                      labelTitle={'Password'}
                      imageStyle={{ width: '0px', height: '0px' }}
                    />
                    <div className='relative'>
                      <ModalInput
                        id={'confirmPassword'}
                        labelTitle={'Confirm Password'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                      <div className='position-absolute password-register'>
                        <IntlMessages id='create_account.password_policy' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Billing Address
                  </p>
                  <div className='d-flex flex-column gap-3'>
                    <ModalInput
                      id={'address'}
                      labelTitle={'Address'}
                      imageStyle={{ width: '0px', height: '0px' }}
                    />
                    <div
                      className='d-grid gap-3'
                      style={{ gridTemplateColumns: '3fr 1fr 2fr' }}
                    >
                      <ModalInput
                        id={'city'}
                        labelTitle={'City'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                      <ModalInput
                        id={'state'}
                        labelTitle={'State'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                      <ModalInput
                        id={'zipCode'}
                        labelTitle={'Zip Code'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  height: '100%',
                  borderLeft: '1px solid rgb(165 167 169)'
                }}
              />
              <div>
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Payment Information
                  </p>
                  <ModalInput
                    id={'nameOn'}
                    labelTitle={'Name on Credit Card'}
                    imageStyle={{ width: '0px', height: '0px' }}
                  />
                </div>
                <div className='mt-3'>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Card Information
                  </p>
                  <div className='d-flex flex-column gap-3'>
                    <ModalInput
                      id={'cardNo'}
                      labelTitle={'Card Number'}
                      imageStyle={{ width: '0px', height: '0px' }}
                    />
                    <div
                      className='d-grid gap-3'
                      style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                    >
                      <ModalInput
                        id={'exp'}
                        labelTitle={'Expiration'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                      <ModalInput
                        id={'cvc'}
                        labelTitle={'CVC'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                      <ModalInput
                        id={'zipC'}
                        labelTitle={'Zip Code'}
                        imageStyle={{ width: '0px', height: '0px' }}
                      />
                    </div>
                  </div>

                  <p className='fs-13 fw-light text-black mt-3'>
                    Your card will be charged $15 per month until you cancel.
                    You may cancel at any time by going to your account settings
                    page. Cancellation must be submitted at least 48 hours prior
                    to renewal.
                  </p>
                </div>
              </div>
            </div>
            <div className='d-flex flex-column align-items-center mt-3'>
              <p className='text-center fs-13 fw-medium mb-3 blue-color lh-sm'>
                By creating an account you agree to our
                <br /> Terms of Service and Privacy Policy
              </p>
              <div className='mb-3'>
                <AcademyBtn
                  title={'Subscribe'}
                  icon={faArrowRight}
                  onClick={() => history.push('/payment')}
                />
              </div>
              <p className='fs-13 fw-light text-black mb-0'>
                The security of your information is important.
              </p>
              <p className='fs-13 fw-medium blue-color '>
                Learn how we protect you.
              </p>
            </div>
          </form>
        </section>
        <section className='d-flex justify-content-center mt-4 gap-2 mb-3 align-items-center'>
          <p className='fs-18 fw-light mb-0'>Already registered?</p>
          <Link className='fs-15 fw-medium blue-color' to='/'>
            Log in here
          </Link>
        </section>
      </main>
    </>
  )
}

export default Register
