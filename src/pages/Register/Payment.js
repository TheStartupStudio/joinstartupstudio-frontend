import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import visaLogo from '../../assets/images/academy-icons/visa-logo.png'

function Payment() {
  return (
    <div className='d-flex justify-content-center p-5'>
      <div className='d-flex align-items-center flex-column payment-main'>
        <img src={courseLogo} alt='course-logo' className='course-logo-image' />
        <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
          Payment Confirmation
        </h2>
        <p className='fs-15 text-black'>
          Your payment has been received. Please see your receipt below.
        </p>
        <h3 className='fs-21 fw-medium mb-1 mt-3 text-black'>
          The Startup Studio Online Course in Entrepreneurship
        </h3>
        <span className='fs-13 fw-light'>Receipt #1234-1</span>

        <div className='d-flex mt-4' style={{ gap: '8rem' }}>
          <div>
            <p className='fs-15 fw-medium text-black'>Amount Paid</p>
            <p className='fs-15 fw-light text-black'>$15.00</p>
          </div>
          <div>
            <p className='fs-15 fw-medium text-black'>Date Paid</p>
            <p className='fs-15 fw-light text-black'>February 13, 2025</p>
          </div>
          <div>
            <p className='fs-15 fw-medium text-black'>Payment Method</p>
            <p className='d-flex justify-content-around align-items-center fs-15 fw-light text-black'>
              <img src={visaLogo} alt='visa-logo' />
              -9999
            </p>
          </div>
        </div>

        <div className='align-self-start mt-5 mb-5 payment-section'>
          <h3 className='fs-21 fw-medium text-black'>
            Payment to Learn to Start LLC
          </h3>
          <div
            className='d-flex justify-content-between payment-border'
            style={{ gap: '8.5rem' }}
          >
            <p className='fs-15 text-black'>
              One month access to Course in Entrepreneurship
            </p>
            <span>$15.00</span>
          </div>
          <div
            className='d-flex justify-content-between gap-5 mt-3'
            style={{ gap: '8.5rem' }}
          >
            <p className='fs-15 text-black mb-0 '>Total Amount Paid</p>
            <span>$15.00</span>
          </div>
        </div>

        <p className='text-black fs-15'>
          If you have any questions, contact us at{' '}
          <a href='#'>mycourse@learntostart.com.</a>
        </p>

        <div className='d-flex gap-1'>
          <p className='fs-21 text-black fw-medium'>Ready to get started?</p>
          <Link className='fs-21' to='/confirm-email'>
            Log in
          </Link>
        </div>

        <div>
          <p className='text-center text-black text-uppercase fs-13 fw-medium mb-0 mt-5'>
            The Startup Studio
          </p>
          <p className='fs-13 fw-medium text-black'>
            https://mystartupcourse.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payment
