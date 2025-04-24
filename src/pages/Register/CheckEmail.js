import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import { toast } from 'react-toastify'

function CheckEmail() {
  const location = useLocation()
  const email = location?.state?.email

  async function resendEmail(data) {
    try {
      await axiosInstance.post('/users/resend-email', { email: email })
    } catch (error) {
      toast.error('Failed to resend email')
      setError('Failed to resend email. Please try again.')
    }
  }

  return (
    <>
      <div className='d-flex justify-content-center p-5 p-1rem-tab'>
        <div className='d-flex align-items-center flex-column payment-main p-1rem-mob '>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Check your email
          </h2>
          <p className='text-black fs-15 text-center-mob'>
            We have sent you an email with a link to confirm your email address.
            Please check your inbox and click the link to complete your
            registration.
          </p>
          <p className='text-black fs-15 text-center-mob'>
            If you don't see the email, please check your spam or junk folder.
          </p>
          <p className='text-black fs-15 text-center-mob'>
            If you still don't see it, please click the button below to resend
            the email.
          </p>
          <button onClick={resendEmail} className='resend-btn'>
            Resend Email
          </button>
        </div>
      </div>
    </>
  )
}

export default CheckEmail
