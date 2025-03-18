import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import visaLogo from '../../assets/images/academy-icons/visa-logo.png'

function ConfirmEmail() {
  return (
    <>
      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex flex-column payment-main'>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image align-self-center'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Please Confirm Your Email
          </h2>
          <p className='fs-15 text-black '>
            Congratulations on taking the first step on an
            <br /> exciting journey. Please confirm your email by
            <br /> clicking on the link below.
          </p>

          <Link
            to={{
              pathname: '/',
              state: { confirmEmail: true }
            }}
            className='fw-medium fs-15 blue-color'
          >
            httsp://eanengvaeiganvenafe
          </Link>

          <p className='mt-3 fs-15 text-black'>
            This link will expire in 30 minutes.
          </p>
          <p className='fs-15 text-black'>
            Thanks!
            <br /> The Startup Studio Team
          </p>
          <p className='fs-13 fst-italic text-black'>
            If you believe this email was sent in error, you can safely
            <br /> ignore this email.
          </p>

          <div className='align-self-center'>
            <p className='text-center text-black text-uppercase fs-13 fw-medium mb-0 mt-5'>
              The Startup Studio
            </p>
            <p className='fs-13 fw-medium text-black'>
              https://mystartupcourse.com
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmEmail
