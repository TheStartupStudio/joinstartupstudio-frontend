import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import CourseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import visaLogo from '../../assets/images/academy-icons/visa-logo.png'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import AcademyBtn from '../../components/AcademyBtn'
import { useState, useEffect } from 'react'

function ConfirmEmail() {
  const searchParams = new URLSearchParams(window.location.search)
  const token = searchParams?.get('token')
  const email = searchParams?.get('email')
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  async function verifyEmail() {
    await axiosInstance
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        toast.success('Email verified successfully')
        history.push('/', { confirmEmail: true })
      })
      .catch((error) => {
        toast.error('Error verifying email', error?.response?.data?.message)
      })
  }

  async function resendEmail() {
    if (!email) {
      return toast.error('No email address found')
    }
    setLoading(true)
    try {
      await axiosInstance.post('/auth/resend-email', { email })
      toast.success('Verification email sent successfully')
    } catch (error) {
      toast.error('Failed to resend email')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  return (
    <>
      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main'>
          <img
            src={CourseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Check your email
          </h2>
          <p className='text-black fs-15'>
            We have sent you an email with a link to confirm your email address.
            Please check your inbox and click the link to complete your
            registration.
          </p>
          <p className='text-black fs-15'>
            If you don't see the email, please check your spam or junk folder.
          </p>
          <p className='text-black fs-15'>
            If you still don't see it, please click the button below to resend
            the email.
          </p>
          <button 
            className='resend-btn' 
            onClick={resendEmail}
            disabled={loading || !email}
          >
            {loading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmEmail
