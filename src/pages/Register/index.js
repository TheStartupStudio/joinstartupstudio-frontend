import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import AcademyBtn from '../../components/AcademyBtn'
import ModalInput from '../../components/ModalInput/ModalInput'
import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import IntlMessages from '../../utils/IntlMessages'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import HowWeProtect from '../../components/HowWeProtect'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import StartupStudioLogo from '../../assets/images/academy-icons/SUS OAE Logox800 1.png'
import facebookLogo from '../../assets/images/academy-icons/svg/icons8-facebook.svg'
import googleLogo from '../../assets/images/academy-icons/svg/icons8-google.svg'
import microsoftLogo from '../../assets/images/academy-icons/svg/icons8-microsoft.svg'

function Register() {
  const [protectModal, setProtectModal] = useState(false)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const currentUrl = window.location.origin

  const validateForm = () => {
    let newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Enter a valid email address.'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol.'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    password: ''
    // confirmPassword: ''
    // address: '',
    // city: '',
    // state: '',
    // zipCode: '',
    // nameOn: '',
    // cardNo: '',
    // exp: '',
    // cvc: '',
    // zipC: ''
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/auth/register', {
        name: formData.fullName,
        email: formData.emailAddress,
        password: formData.password
        // confirmPassword: formData.confirmPassword
        // address: formData.address,
        // city: formData.city,
        // state: formData.state,
        // zipCode: formData.zipCode,
        // nameOn: formData.nameOn,
        // cardNo: formData.cardNo,
        // exp: formData.exp,
        // cvc: formData.cvc,
        // zipC: formData.zipC
      })

      setIsLoading(false)
      if (response.status === 200) {
        toast.success('Registration successful!')
        history.push('/check-email', { email: formData.emailAddress })
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Registration failed or this email is already registered.')
    }
  }

  return (
    <>
      <a href='https://academy.learntostart.com/' className='logo-register'>
        <img
          src={StartupStudioLogo}
          alt='course-logo'
          className='my-3 img-register-login'
        />
      </a>

      <main className='register-main'>
        <section className='px-5 pb-5 p-t-5 register-section'>
          <h1 className='text-center fs-48 fw-light'>
            {/* $15 per month subscription */}
            Register
          </h1>
          <form className='mt-4-4' onSubmit={handleSubmit} autoComplete='off'>
            <div
              className='d-grid gap-4'
              // style={{ gridTemplateColumns: '4fr auto 2fr' }}
            >
              <div>
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Account Information
                  </p>
                  <div className='d-grid gap-3 grid-col-2 grid-col-1-mob'>
                    <div className='relative'>
                      <ModalInput
                        id={'fullName'}
                        labelTitle={'Full Name'}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                      {errors.fullName && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className='relative'>
                      <ModalInput
                        id={'emailAddress'}
                        labelTitle={'Email Address'}
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                        autoComplete={'new-email'}
                      />
                      {errors.emailAddress && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.emailAddress}
                        </p>
                      )}
                    </div>
                    <div className='relative'>
                      <div className='relative w-100 d-flex justify-content-between input-container-modal'>
                        <input
                          id={'password'}
                          type={showPassword ? 'text' : 'password'}
                          className='input-style'
                          placeholder=' '
                          value={formData.password}
                          onChange={handleInputChange}
                          autoComplete={false}
                        />
                        <label htmlFor={'password'} className='label-style'>
                          Password
                        </label>
                        <div
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          />
                        </div>
                      </div>
                      {errors.password && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className='relative'>
                      <div className='relative w-100 d-flex justify-content-between input-container-modal'>
                        <input
                          id={'confirmPassword'}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='input-style'
                          placeholder=' '
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          autoComplete={'new-password'}
                        />
                        <label
                          htmlFor={'confirmPassword'}
                          className='label-style'
                        >
                          Confirm Password
                        </label>
                        <div
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEye : faEyeSlash}
                          />
                        </div>
                      </div>
                      {errors.confirmPassword ? (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.confirmPassword}
                        </p>
                      ) : (
                        <div className='position-absolute password-register'>
                          <IntlMessages id='create_account.password_policy' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className='mt-5'>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Billing Address
                  </p>
                  <div className='d-flex flex-column gap-3'>
                    <ModalInput
                      id={'address'}
                      labelTitle={'Address'}
                      value={formData.address}
                      onChange={handleInputChange}
                      imgSrc={penIcon}
                    />
                    <div
                      className='d-grid gap-3'
                      style={{ gridTemplateColumns: '3fr 1fr 2fr' }}
                    >
                      <ModalInput
                        id={'city'}
                        labelTitle={'City'}
                        value={formData.city}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                      <ModalInput
                        id={'state'}
                        labelTitle={'State'}
                        value={formData.state}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                      <ModalInput
                        id={'zipCode'}
                        labelTitle={'Zip Code'}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
              <hr
                style={{
                  height: '100%'
                  // borderLeft: '1px solid rgb(165 167 169)'
                }}
              />
              {/* <div>
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Payment Information
                  </p>
                  <ModalInput
                    id={'nameOn'}
                    labelTitle={'Name on Credit Card'}
                    value={formData.nameOn}
                    onChange={handleInputChange}
                    imgSrc={penIcon}
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
                      value={formData.cardNo}
                      onChange={handleInputChange}
                      imgSrc={penIcon}
                    />
                    <div
                      className='d-grid gap-3'
                      style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                    >
                      <ModalInput
                        id={'exp'}
                        labelTitle={'Expiration'}
                        value={formData.exp}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                      <ModalInput
                        id={'cvc'}
                        labelTitle={'CVC'}
                        value={formData.cvc}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
                      />
                      <ModalInput
                        id={'zipC'}
                        labelTitle={'Zip Code'}
                        value={formData.zipC}
                        onChange={handleInputChange}
                        imgSrc={penIcon}
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
              </div> */}
            </div>
            <div className='d-flex flex-column align-items-center mt-3'>
             <p className='text-center fs-13 fw-medium mb-3 blue-color lh-sm'>
  By creating an account you agree to our
  <br />
<a
  href="https://app.learntostart.com/terms"
  target="_blank"
  rel="noopener noreferrer"
  className="blue-color text-decoration-underline"
>
  Terms of Service
</a>
<span> and </span>
<a
  href="https://app.learntostart.com/privacy-policy"
  target="_blank"
  rel="noopener noreferrer"
  className="blue-color text-decoration-underline"
>
  Privacy Policy
</a>

</p>

              <div className='mb-3'>
                <div
                  className='login-button'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '150px',
                    borderRadius: '8px',
                    background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                    padding: '2px',
                    height: '58px',
                    boxShadow: '0px 4px 10px 0px #00000040'
                  }}
                >
                  <button
                    type='submit'
                    className={`w-100 register-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span 
                          className='spinner-border spinner-border-sm' 
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            borderColor: '#51C7DF',
                            borderRightColor: 'transparent'
                          }}
                        />
                        <span style={{ color: '#51C7DF' }}>Loading...</span>
                      </div>
                    ) : (
                      <span className='d-flex align-items-center justify-content-center'
                      style={{color: '#51C7DF'}}>
                        Register
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className='ms-2 fw-bold'
                        />
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                <span className='mb-2 public-page-text'>OR USE</span>
                <div className='d-flex gap-3 auth-logos-buttons'>
                  <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/google`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={googleLogo} alt='google' />
                  </a>
                  <a
                    href={`${
                      process.env.REACT_APP_SERVER_BASE_URL
                    }auth/facebook?from=${encodeURIComponent(currentUrl)}`}
                    className='cursor-pointer'
                  >
                    <img
                      className='auth-logos'
                      src={facebookLogo}
                      alt='facebook'
                    />
                  </a>
                  <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/microsoft`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={microsoftLogo} alt='microsoft' />
                  </a>
                </div>
              </div>
              <p className='fs-13 fw-light text-black mb-0'>
                The security of your information is important.
              </p>
              <p
                className='fs-13 fw-medium blue-color cursor-pointer '
                onClick={() => setProtectModal(true)}
              >
                <IntlMessages id='login.protect_data' />
              </p>
            </div>
          </form>
        </section>
        <section className='d-flex justify-content-center mt-4 gap-2 mb-3 align-items-center'>
          <p className='fs-18 fw-light mb-0'>
            <IntlMessages id='create_account.already_registered' />
          </p>
          <Link className='fs-15 fw-medium blue-color' to='/'>
            Log in here
          </Link>
        </section>
        <HowWeProtect isOpen={protectModal} setIsOpen={setProtectModal} />
      </main>
    </>
  )
}

export default Register
