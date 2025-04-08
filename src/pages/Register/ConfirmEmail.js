import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import courseLogo from '../../assets/images/academy-icons/academy-logo-group.png'
import visaLogo from '../../assets/images/academy-icons/visa-logo.png'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import AcademyBtn from '../../components/AcademyBtn'

function ConfirmEmail() {
  const searchParams = new URLSearchParams(window.location.search)
  const token = searchParams?.get('token')
  const history = useHistory()

  async function verifyEmail() {
    await axiosInstance
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        toast.success('Email verified successfully')
        history.push('/login', { confirmEmail: true })
      })
      .catch((error) => {
        toast.error('Error verifying email', error?.response?.data?.message)
      })
  }

  verifyEmail()

  return (
    <>
      {' '}
      <div className='bg-light d-flex justify-content-center align-items-center vh-100'>
        <div className='text-center'>
          <div
            className='spinner-border text-primary mb-4'
            style={{ width: '4rem', height: '4rem' }}
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
          <h2 className='mb-2'>Verifying your email</h2>
          <p className='text-muted'>
            Please wait while we verify your email address.
          </p>
          <p className='text-secondary small'>This won’t take long…</p>
        </div>
      </div>
    </>
  )
}

export default ConfirmEmail
